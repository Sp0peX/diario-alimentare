// Sistema di autenticazione locale
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.init();
    }
    
    init() {
        // Controlla se l'utente è già loggato
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            // Se siamo nella pagina di login e l'utente è già loggato, reindirizza
            if (window.location.pathname.includes('login.html')) {
                window.location.href = 'index.html';
                return;
            }
        } else {
            // Se non siamo nella pagina di login e l'utente non è loggato, reindirizza
            if (!window.location.pathname.includes('login.html')) {
                window.location.href = 'login.html';
                return;
            }
        }
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Form di login
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // Form di registrazione
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
        
        // Toggle tra login e registrazione
        const showRegister = document.getElementById('showRegister');
        const showLogin = document.getElementById('showLogin');
        
        if (showRegister) {
            showRegister.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleForms('register');
            });
        }
        
        if (showLogin) {
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleForms('login');
            });
        }
        
        // Logout button (se presente)
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }
    
    toggleForms(formType) {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const title = document.querySelector('.login-title');
        
        if (formType === 'register') {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            title.textContent = 'Registrazione';
        } else {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            title.textContent = 'Diario Alimentare';
        }
        
        this.clearMessages();
    }
    
    handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        
        if (!username || !password) {
            this.showError('Inserisci nome utente e password');
            return;
        }
        
        const user = this.users.find(u => u.username === username);
        
        if (!user) {
            this.showError('Nome utente non trovato');
            return;
        }
        
        if (user.password !== this.hashPassword(password)) {
            this.showError('Password non corretta');
            return;
        }
        
        // Login riuscito
        this.currentUser = {
            id: user.id,
            username: user.username,
            email: user.email
        };
        
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.showSuccess('Login effettuato con successo!');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
    
    handleRegister(e) {
        e.preventDefault();
        
        const username = document.getElementById('registerUsername').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validazioni
        if (!username || !email || !password || !confirmPassword) {
            this.showError('Compila tutti i campi');
            return;
        }
        
        if (username.length < 3) {
            this.showError('Il nome utente deve essere di almeno 3 caratteri');
            return;
        }
        
        if (password.length < 6) {
            this.showError('La password deve essere di almeno 6 caratteri');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showError('Le password non coincidono');
            return;
        }
        
        // Controlla se l'utente esiste già
        if (this.users.find(u => u.username === username)) {
            this.showError('Nome utente già esistente');
            return;
        }
        
        if (this.users.find(u => u.email === email)) {
            this.showError('Email già registrata');
            return;
        }
        
        // Crea nuovo utente
        const newUser = {
            id: Date.now().toString(),
            username: username,
            email: email,
            password: this.hashPassword(password),
            createdAt: new Date().toISOString()
        };
        
        this.users.push(newUser);
        this.saveUsers();
        
        this.showSuccess('Registrazione completata! Ora puoi accedere.');
        
        setTimeout(() => {
            this.toggleForms('login');
            document.getElementById('loginUsername').value = username;
        }, 1500);
    }
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
    
    isLoggedIn() {
        return this.currentUser !== null;
    }
    
    // Semplice hash della password (in produzione usare bcrypt o simili)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Converte a 32bit integer
        }
        return hash.toString();
    }
    
    loadUsers() {
        const users = localStorage.getItem('diaryUsers');
        return users ? JSON.parse(users) : [];
    }
    
    saveUsers() {
        localStorage.setItem('diaryUsers', JSON.stringify(this.users));
    }
    
    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        const successDiv = document.getElementById('successMessage');
        
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
        
        if (successDiv) {
            successDiv.style.display = 'none';
        }
        
        setTimeout(() => {
            if (errorDiv) errorDiv.style.display = 'none';
        }, 5000);
    }
    
    showSuccess(message) {
        const errorDiv = document.getElementById('errorMessage');
        const successDiv = document.getElementById('successMessage');
        
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.style.display = 'block';
        }
        
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
        
        setTimeout(() => {
            if (successDiv) successDiv.style.display = 'none';
        }, 5000);
    }
    
    clearMessages() {
        const errorDiv = document.getElementById('errorMessage');
        const successDiv = document.getElementById('successMessage');
        
        if (errorDiv) errorDiv.style.display = 'none';
        if (successDiv) successDiv.style.display = 'none';
    }
}

// Inizializza il sistema di autenticazione
const auth = new AuthSystem();

// Esporta per uso globale
window.auth = auth;