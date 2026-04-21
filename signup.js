// Signup Page Handler
class SignupHandler {
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
        document.getElementById('registerFormElement').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
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
            await expenseDB.createUser(username, password);
            this.showMessage('Account created successfully! Redirecting to login...', 'success');
            
            // Reset form
            document.getElementById('registerFormElement').reset();
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
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

// Initialize signup handler
new SignupHandler();
