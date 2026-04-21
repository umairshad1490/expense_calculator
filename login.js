// Login Page Handler
class LoginHandler {
    constructor() {
        this.init();
    }

    async init() {
        // Initialize database
        await expenseDB.init();
        
        // Check if user is already logged in
        const storedUser = sessionStorage.getItem('currentUser');
        if (storedUser) {
            window.location.href = 'dashboard.html';
            return;
        }

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('loginFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
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
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } catch (error) {
            this.showMessage(error.message, 'error');
        }
    }

    showMessage(message, type) {
        const messageEl = document.getElementById('authMessage');
        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
    }
}

// Initialize login handler
new LoginHandler();
