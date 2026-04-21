// Authentication Manager
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is already logged in (from sessionStorage)
        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
            this.currentUser = JSON.parse(storedUser);
            this.showDashboard();
        } else {
            this.showLogin();
        }

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Switch between login and register forms
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });

        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });

        // Form submissions
        document.getElementById('loginFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        document.getElementById('registerFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });
    }

    showLoginForm() {
        document.getElementById('loginForm').classList.add('active');
        document.getElementById('registerForm').classList.remove('active');
        this.clearMessage();
    }

    showRegisterForm() {
        document.getElementById('registerForm').classList.add('active');
        document.getElementById('loginForm').classList.remove('active');
        this.clearMessage();
    }

    async handleLogin() {
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!username || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        try {
            const user = await expenseDB.loginUser(username, password);
            this.currentUser = user;
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            this.showDashboard();
            this.clearMessage();
            
            // Reset form
            document.getElementById('loginFormElement').reset();
            
            // Initialize app
            if (window.app) {
                window.app.init();
            }
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    async handleRegister() {
        const username = document.getElementById('registerUsername').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        // Validation
        if (!username || !password || !confirmPassword) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        if (username.length < 3) {
            this.showMessage('Username must be at least 3 characters', 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showMessage('Passwords do not match', 'error');
            return;
        }

        try {
            const user = await expenseDB.createUser(username, password);
            this.showMessage('Registration successful! Please login.', 'success');
            
            // Reset form and switch to login
            document.getElementById('registerFormElement').reset();
            setTimeout(() => {
                this.showLoginForm();
            }, 2000);
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    handleLogout() {
        this.currentUser = null;
        sessionStorage.removeItem('currentUser');
        this.showLogin();
        
        // Reset app state
        if (window.app) {
            window.app.reset();
        }
    }

    showLogin() {
        document.getElementById('loginScreen').classList.add('active');
        document.getElementById('dashboardScreen').classList.remove('active');
    }

    showDashboard() {
        document.getElementById('loginScreen').classList.remove('active');
        document.getElementById('dashboardScreen').classList.add('active');
        
        // Update user info in navbar
        if (this.currentUser) {
            document.getElementById('currentUser').textContent = `Welcome, ${this.currentUser.username}!`;
        }
    }

    showMessage(message, type) {
        const messageEl = document.getElementById('authMessage');
        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
    }

    clearMessage() {
        const messageEl = document.getElementById('authMessage');
        messageEl.textContent = '';
        messageEl.className = 'message';
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize auth manager after database is ready
let authManager;
expenseDB.init().then(() => {
    authManager = new AuthManager();
});
