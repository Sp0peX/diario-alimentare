const CACHE_NAME = 'diario-alimentare-v1.0.0';
const urlsToCache = [
  '/',
  '/login.html',
  '/index.html',
  '/profile.html',
  '/style.css',
  '/script.js',
  '/auth.js',
  '/api-config.js',
  '/manifest.json',
  '/DEPLOYMENT_GUIDE.md',
  '/README.md'
];

// Installazione del Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Cached all files successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Error caching files', error);
      })
  );
});

// Attivazione del Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activated successfully');
      return self.clients.claim();
    })
  );
});

// Intercettazione delle richieste di rete
self.addEventListener('fetch', event => {
  // Ignora le richieste non-GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignora le richieste alle API esterne
  if (event.request.url.includes('api.') || 
      event.request.url.includes('googleapis.com') ||
      event.request.url.includes('openai.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Restituisce la risorsa dalla cache se disponibile
        if (response) {
          console.log('Service Worker: Serving from cache', event.request.url);
          return response;
        }

        // Altrimenti, effettua la richiesta di rete
        console.log('Service Worker: Fetching from network', event.request.url);
        return fetch(event.request)
          .then(response => {
            // Verifica se la risposta è valida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona la risposta per la cache
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(error => {
            console.error('Service Worker: Network request failed', error);
            
            // Restituisce una pagina offline personalizzata per le pagine HTML
            if (event.request.destination === 'document') {
              return caches.match('/login.html');
            }
            
            throw error;
          });
      })
  );
});

// Gestione dei messaggi dal client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Notifica di aggiornamento disponibile
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CHECK_UPDATE') {
    // Logica per verificare aggiornamenti
    event.ports[0].postMessage({ 
      hasUpdate: false, 
      version: CACHE_NAME 
    });
  }
});

// Gestione errori globali
self.addEventListener('error', event => {
  console.error('Service Worker: Global error', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('Service Worker: Unhandled promise rejection', event.reason);
});

console.log('Service Worker: Script loaded successfully');