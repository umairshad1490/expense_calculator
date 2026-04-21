// IndexedDB Database Manager
class ExpenseDB {
    constructor() {
        this.dbName = 'ExpenseTrackerDB';
        this.version = 1;
        this.db = null;
    }

    // Initialize database
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                console.error('Database failed to open');
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('Database opened successfully');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                this.db = event.target.result;

                // Create users object store
                if (!this.db.objectStoreNames.contains('users')) {
                    const userStore = this.db.createObjectStore('users', { keyPath: 'userId', autoIncrement: true });
                    userStore.createIndex('username', 'username', { unique: true });
                }

                // Create transactions object store
                if (!this.db.objectStoreNames.contains('transactions')) {
                    const transactionStore = this.db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
                    transactionStore.createIndex('userId', 'userId', { unique: false });
                    transactionStore.createIndex('date', 'date', { unique: false });
                    transactionStore.createIndex('type', 'type', { unique: false });
                    transactionStore.createIndex('category', 'category', { unique: false });
                }

                console.log('Database setup complete');
            };
        });
    }

    // User operations
    async createUser(username, password) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readwrite');
            const store = transaction.objectStore('users');

            // Hash password (simple - for production use bcrypt or similar)
            const hashedPassword = this.hashPassword(password);

            const user = {
                username: username.toLowerCase(),
                password: hashedPassword,
                createdAt: new Date().toISOString()
            };

            const request = store.add(user);

            request.onsuccess = () => {
                resolve({ userId: request.result, username: user.username });
            };

            request.onerror = () => {
                if (request.error.name === 'ConstraintError') {
                    reject(new Error('Username already exists'));
                } else {
                    reject(request.error);
                }
            };
        });
    }

    async loginUser(username, password) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const index = store.index('username');

            const request = index.get(username.toLowerCase());

            request.onsuccess = () => {
                const user = request.result;
                if (!user) {
                    reject(new Error('User not found'));
                    return;
                }

                const hashedPassword = this.hashPassword(password);
                if (user.password === hashedPassword) {
                    resolve({ userId: user.userId, username: user.username });
                } else {
                    reject(new Error('Invalid password'));
                }
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Simple password hashing (for production, use proper encryption)
    hashPassword(password) {
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }

    // Transaction operations
    async addTransaction(userId, transaction) {
        return new Promise((resolve, reject) => {
            const dbTransaction = this.db.transaction(['transactions'], 'readwrite');
            const store = dbTransaction.objectStore('transactions');

            const transactionData = {
                userId: userId,
                type: transaction.type,
                description: transaction.description,
                amount: parseFloat(transaction.amount),
                category: transaction.category,
                date: transaction.date,
                createdAt: new Date().toISOString()
            };

            const request = store.add(transactionData);

            request.onsuccess = () => {
                resolve({ id: request.result, ...transactionData });
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async getTransactionsByUser(userId, startDate = null, endDate = null) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['transactions'], 'readonly');
            const store = transaction.objectStore('transactions');
            const index = store.index('userId');

            const request = index.getAll(userId);

            request.onsuccess = () => {
                let transactions = request.result;

                // Filter by date range if provided
                if (startDate && endDate) {
                    transactions = transactions.filter(t => {
                        const tDate = new Date(t.date);
                        return tDate >= new Date(startDate) && tDate <= new Date(endDate);
                    });
                }

                // Sort by date (newest first)
                transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

                resolve(transactions);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async deleteTransaction(transactionId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['transactions'], 'readwrite');
            const store = transaction.objectStore('transactions');

            const request = store.delete(transactionId);

            request.onsuccess = () => {
                resolve(true);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async getAllTransactions(userId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['transactions'], 'readonly');
            const store = transaction.objectStore('transactions');
            const index = store.index('userId');

            const request = index.getAll(userId);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }
}

// Initialize database instance
const expenseDB = new ExpenseDB();
