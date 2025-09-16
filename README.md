# 🍽️ Diario Alimentare Multi-Utente

Un'applicazione web moderna e intuitiva per tenere traccia dei tuoi pasti quotidiani con calcolo automatico delle calorie tramite intelligenza artificiale. Ora con supporto multi-utente!

## ✨ Funzionalità Principali

- **Sistema Multi-Utente**: Registrazione e login per profili personali separati
- **Gestione Pasti Completa**: Registra colazione, pranzo, cena e spuntini
- **Calcolo Calorie AI**: Calcolo automatico delle calorie tramite API esterne
- **Profilo Utente**: Gestione account con statistiche personali
- **Design Responsive**: Interfaccia moderna che si adatta a tutti i dispositivi
- **Salvataggio Locale**: I tuoi dati rimangono privati e salvati nel browser per utente
- **Navigazione Date**: Visualizza e modifica i pasti di giorni diversi
- **Esportazione Dati**: Scarica tutti i tuoi dati in formato JSON

## 🚀 Come Iniziare

1. **Primo Accesso**: Apri il file `login.html` nel tuo browser
2. **Registrazione**: Crea un nuovo account con username, email e password
3. **Login**: Accedi con le tue credenziali
4. **Utilizzo Diario**: Aggiungi alimenti e gestisci i tuoi pasti
5. **Profilo**: Accedi al tuo profilo per vedere statistiche e gestire l'account

### 1. Apertura dell'Applicazione

1. Apri il file `login.html` nel tuo browser web
2. L'applicazione ti chiederà di registrarti o accedere

### 2. Configurazione API (Opzionale ma Consigliata)

Per utilizzare il calcolo automatico delle calorie con AI:

1. **Registrati gratuitamente** su [API Ninjas](https://api.api-ninjas.com/)
2. Ottieni la tua **chiave API gratuita**
3. Apri il file `api-config.js`
4. Sostituisci `'YOUR_API_KEY_HERE'` con la tua chiave API:

```javascript
API_KEY: 'la-tua-chiave-api-qui'
```

### 3. Utilizzo dell'Applicazione

## 📱 Utilizzo

### Sistema Multi-Utente
1. **Registrazione**: Crea un account con username unico, email e password (min 6 caratteri)
2. **Login**: Accedi con le tue credenziali
3. **Dati Separati**: Ogni utente ha i propri dati completamente separati
4. **Logout**: Esci dall'account in sicurezza

#### Aggiungere un Alimento

1. Seleziona la sezione del pasto (colazione, pranzo, cena, spuntini)
2. Clicca su **"Aggiungi Alimento"** nella sezione desiderata
3. Inserisci il nome dell'alimento (es. "pasta al pomodoro")
4. Specifica la quantità in grammi
5. **Opzioni per le calorie**:
   - Lascia vuoto per calcolo automatico
   - Clicca **"Calcola con AI"** per calcolo preciso tramite API
   - Inserisci manualmente se conosci il valore
6. Conferma per aggiungere al diario

### Gestione Profilo
- **Statistiche**: Visualizza giorni registrati, pasti totali e calorie medie
- **Esportazione**: Scarica tutti i tuoi dati in formato JSON
- **Cancellazione Dati**: Rimuovi tutti i dati del diario mantenendo l'account
- **Eliminazione Account**: Rimuovi completamente account e dati

#### Esempi di Inserimento

- `pasta` + `100g` → Calcolo automatico
- `pizza margherita` + `250g` → Calcolo con database esteso
- `mela` + `150g` → Riconoscimento automatico

#### Gestione dei Dati

- **Cambio Data**: Usa il selettore data in alto per visualizzare giorni diversi
- **Eliminazione**: Clicca l'icona cestino per rimuovere un alimento
- **Riepilogo**: Visualizza calorie totali e numero pasti nella sezione riepilogo
- **Navigazione**: I dati vengono salvati automaticamente per il tuo utente

## 🛠️ Funzionalità Tecniche

### API Integrate

1. **API Ninjas Nutrition** (Principale)
   - Elaborazione linguaggio naturale
   - Database di 100.000+ alimenti
   - Calcolo porzioni personalizzate
   - Piano gratuito: 1.000 richieste/mese

2. **Database Locale** (Fallback)
   - Oltre 100 alimenti italiani comuni
   - Funziona offline
   - Calcolo istantaneo

### Salvataggio Dati

- I dati vengono salvati automaticamente nel **localStorage** del browser
- Persistenza tra sessioni
- Nessun server richiesto

### Compatibilità

- ✅ Chrome, Firefox, Safari, Edge (versioni moderne)
- ✅ Dispositivi mobili e tablet
- ✅ Funziona offline (con database locale)

## 📱 Utilizzo Mobile

L'applicazione è completamente responsive e ottimizzata per dispositivi mobili:

- Layout adattivo per schermi piccoli
- Touch-friendly per facilità d'uso
- Interfaccia ottimizzata per smartphone

## 🔧 Personalizzazione

### Aggiungere Nuovi Alimenti al Database Locale

Modifica il file `api-config.js` nella sezione `LOCAL_DATABASE.FOODS`:

```javascript
'nuovo-alimento': 250, // calorie per 100g
```

### Modificare l'Aspetto

Personalizza i colori e lo stile modificando il file `style.css`.

## 🐛 Risoluzione Problemi

### L'API non funziona

1. Verifica di aver inserito correttamente la chiave API
2. Controlla la connessione internet
3. L'app utilizzerà automaticamente il database locale come fallback

### I dati non si salvano

1. Assicurati che il browser supporti localStorage
2. Controlla che non sia in modalità incognito/privata
3. Verifica che ci sia spazio disponibile nel browser

### Problemi di visualizzazione

1. Aggiorna la pagina (F5)
2. Svuota la cache del browser
3. Verifica che JavaScript sia abilitato

## 📊 Statistiche e Funzionalità Avanzate

- **Riepilogo Giornaliero**: Calorie totali e numero pasti
- **Cronologia**: Naviga tra date diverse
- **Calcolo Intelligente**: Riconoscimento automatico porzioni

## 🔒 Privacy

- **Nessun dato inviato a server esterni** (eccetto per API calorie se configurata)
- **Salvataggio locale**: Tutti i dati rimangono sul tuo dispositivo
- **Nessun tracking**: L'app non raccoglie dati personali

## 🆘 Supporto

Per problemi o domande:

1. Controlla questa guida
2. Verifica la console del browser per errori (F12)
3. Assicurati di avere l'ultima versione dei file

## 📁 Struttura File

- `login.html` - Pagina di login e registrazione
- `index.html` - Pagina principale del diario alimentare
- `profile.html` - Pagina di gestione profilo utente
- `style.css` - Stili e design responsive
- `script.js` - Logica JavaScript per gestione pasti
- `auth.js` - Sistema di autenticazione multi-utente
- `api-config.js` - Configurazione API e database locale
- `README.md` - Questa guida

## 🔒 Privacy e Sicurezza

- **Dati Locali**: Tutti i dati sono salvati nel localStorage del browser per utente
- **Separazione Utenti**: Ogni utente ha accesso solo ai propri dati
- **Hash Password**: Le password sono crittografate prima del salvataggio
- **Nessun Server**: L'applicazione funziona completamente offline
- **Privacy Totale**: Nessun dato personale viene inviato a server esterni
- **API Opzionali**: Le API esterne sono usate solo per il calcolo calorie se configurate
- **Controllo Accessi**: Sistema di autenticazione per proteggere i dati personali

## 📝 Note Tecniche

- **Linguaggi**: HTML5, CSS3, JavaScript ES6+
- **Dipendenze**: Font Awesome (CDN)
- **Storage**: localStorage del browser con separazione per utente
- **API**: API Ninjas Nutrition (opzionale)
- **Autenticazione**: Sistema locale con hash delle password

---

**Buon appetito e buon tracking! 🍽️**