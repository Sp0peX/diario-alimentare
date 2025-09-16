# 📱🌐 Guida al Deployment: App Android e Sito Web

Questa guida ti mostrerà come trasformare il tuo Diario Alimentare in un'app Android (APK) e come pubblicarlo come sito web.

## 📱 PARTE 1: Creare un'App Android (APK)

### Metodo 1: Apache Cordova/PhoneGap (Consigliato)

#### Prerequisiti
1. **Node.js** - Scarica da [nodejs.org](https://nodejs.org/)
2. **Android Studio** - Scarica da [developer.android.com](https://developer.android.com/studio)
3. **Java Development Kit (JDK)** - Versione 8 o superiore

#### Installazione Cordova
```bash
# Installa Cordova globalmente
npm install -g cordova

# Verifica installazione
cordova --version
```

#### Creazione del Progetto
```bash
# Crea nuovo progetto Cordova
cordova create DiarioAlimentareApp com.tuonome.diarioalimentare "Diario Alimentare"

# Entra nella cartella
cd DiarioAlimentareApp

# Aggiungi piattaforma Android
cordova platform add android
```

#### Configurazione Files
1. **Copia i tuoi file** nella cartella `www/`:
   - Sostituisci tutto il contenuto di `www/` con i tuoi file
   - Assicurati che `login.html` sia il file principale o rinomina `index.html`

2. **Modifica config.xml**:
```xml
<?xml version='1.0' encoding='utf-8'?>
<widget id="com.tuonome.diarioalimentare" version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
    <name>Diario Alimentare</name>
    <description>App per il tracking alimentare con calcolo calorie AI</description>
    <author email="tua@email.com" href="https://tuosito.com">Il Tuo Nome</author>
    
    <content src="login.html" />
    
    <access origin="*" />
    <allow-intent href="http://*/*" />
    <allow-intent href="https://*/*" />
    
    <platform name="android">
        <allow-intent href="market:*" />
        <icon density="ldpi" src="res/icon/android/drawable-ldpi-icon.png" />
        <icon density="mdpi" src="res/icon/android/drawable-mdpi-icon.png" />
        <icon density="hdpi" src="res/icon/android/drawable-hdpi-icon.png" />
        <icon density="xhdpi" src="res/icon/android/drawable-xhdpi-icon.png" />
        <icon density="xxhdpi" src="res/icon/android/drawable-xxhdpi-icon.png" />
        <icon density="xxxhdpi" src="res/icon/android/drawable-xxxhdpi-icon.png" />
    </platform>
    
    <preference name="DisallowOverscroll" value="true" />
    <preference name="android-minSdkVersion" value="22" />
    <preference name="android-targetSdkVersion" value="33" />
</widget>
```

#### Build dell'APK
```bash
# Build per debug
cordova build android

# Build per release (firmato)
cordova build android --release
```

#### Firma dell'APK (per distribuzione)
```bash
# Genera keystore (solo la prima volta)
keytool -genkey -v -keystore diario-alimentare.keystore -alias diario-key -keyalg RSA -keysize 2048 -validity 10000

# Firma l'APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore diario-alimentare.keystore platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk diario-key

# Allinea l'APK
zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk DiarioAlimentare.apk
```

### Metodo 2: PWA (Progressive Web App)

#### Crea il Manifest
Crea `manifest.json` nella root:
```json
{
  "name": "Diario Alimentare",
  "short_name": "DiarioFood",
  "description": "App per il tracking alimentare con AI",
  "start_url": "/login.html",
  "display": "standalone",
  "background_color": "#667eea",
  "theme_color": "#667eea",
  "orientation": "portrait",
  "icons": [
    {
      "src": "icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

#### Service Worker
Crea `sw.js`:
```javascript
const CACHE_NAME = 'diario-alimentare-v1';
const urlsToCache = [
  '/',
  '/login.html',
  '/index.html',
  '/profile.html',
  '/style.css',
  '/script.js',
  '/auth.js',
  '/api-config.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
```

#### Modifica HTML per PWA
Aggiungi in `<head>` di tutti i file HTML:
```html
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#667eea">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="Diario Alimentare">
<link rel="apple-touch-icon" href="icons/icon-152x152.png">

<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('SW registered'))
      .catch(registrationError => console.log('SW registration failed'));
  });
}
</script>
```

## 🌐 PARTE 2: Pubblicare come Sito Web

### Opzione 1: GitHub Pages (Gratuito)

1. **Crea repository GitHub**:
   - Vai su [github.com](https://github.com)
   - Crea nuovo repository pubblico
   - Nome: `diario-alimentare`

2. **Carica i file**:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tuousername/diario-alimentare.git
git push -u origin main
```

3. **Attiva GitHub Pages**:
   - Vai nelle Settings del repository
   - Sezione "Pages"
   - Source: "Deploy from a branch"
   - Branch: "main"
   - Folder: "/ (root)"

4. **Il tuo sito sarà disponibile su**:
   `https://tuousername.github.io/diario-alimentare/login.html`

### Opzione 2: Netlify (Gratuito con dominio personalizzato)

1. **Vai su [netlify.com](https://netlify.com)**
2. **Drag & Drop** la cartella del progetto
3. **Configura**:
   - Build command: (lascia vuoto)
   - Publish directory: (lascia vuoto o ".")
4. **Dominio personalizzato** (opzionale):
   - Site settings → Domain management
   - Add custom domain

### Opzione 3: Vercel (Gratuito)

1. **Vai su [vercel.com](https://vercel.com)**
2. **Import Git Repository** o drag & drop
3. **Deploy automatico**

### Opzione 4: Hosting Tradizionale

1. **Acquista hosting** (es. Aruba, SiteGround, etc.)
2. **Carica via FTP** tutti i file nella cartella `public_html`
3. **Configura dominio**

## 🔧 Ottimizzazioni per Mobile

### CSS Aggiuntivo per App
Aggiungi in `style.css`:
```css
/* Nasconde la barra degli indirizzi su mobile */
@media (display-mode: standalone) {
  body {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* Migliora l'esperienza touch */
* {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

input, textarea {
  -webkit-user-select: text;
  user-select: text;
}

/* Previene lo zoom su input */
input[type="text"],
input[type="email"],
input[type="password"],
input[type="date"],
input[type="number"] {
  font-size: 16px;
}
```

## 📊 Analytics e Monitoraggio

### Google Analytics
Aggiungi prima del `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🚀 Distribuzione APK

### Google Play Store
1. **Account Developer** ($25 una tantum)
2. **Carica APK firmato**
3. **Compila store listing**
4. **Review process** (1-3 giorni)

### Distribuzione Diretta
1. **Carica APK** su tuo sito web
2. **Istruzioni installazione** per utenti
3. **Avviso sicurezza** Android per "origini sconosciute"

## 🔒 Considerazioni di Sicurezza

### Per App Android
- **Permissions** minime necessarie
- **HTTPS** per API calls
- **Obfuscation** del codice per release

### Per Sito Web
- **HTTPS** obbligatorio (certificato SSL)
- **Content Security Policy**
- **Backup** regolari

## 📝 Checklist Finale

### Prima del Deploy
- [ ] Test su diversi dispositivi
- [ ] Verifica responsive design
- [ ] Test funzionalità offline
- [ ] Ottimizzazione immagini
- [ ] Minificazione CSS/JS (opzionale)
- [ ] Test API keys
- [ ] Backup dati utenti

### Dopo il Deploy
- [ ] Test completo su produzione
- [ ] Monitoraggio errori
- [ ] Feedback utenti
- [ ] Aggiornamenti regolari

---

**Nota**: Per entrambe le soluzioni (APK e sito web), l'app funzionerà perfettamente offline grazie al localStorage per i dati utente. Le API esterne sono opzionali e l'app ha un database locale di fallback.