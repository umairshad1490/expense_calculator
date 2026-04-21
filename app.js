// Main Application
class ExpenseApp {
    constructor() {
        this.currentMonth = new Date();
        this.transactions = [];
        this.filteredTransactions = [];
        this.filterType = 'all';
        this.filterCategory = 'all';
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Month navigation
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.changeMonth(-1);
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.changeMonth(1);
        });

        // Transaction form
        document.getElementById('transactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTransaction();
        });

        // Type change - update categories
        document.getElementById('transactionType').addEventListener('change', (e) => {
            this.updateCategoryOptions(e.target.value);
        });

        // Filters
        document.getElementById('filterType').addEventListener('change', (e) => {
            this.filterType = e.target.value;
            this.applyFilters();
        });

        document.getElementById('filterCategory').addEventListener('change', (e) => {
            this.filterCategory = e.target.value;
            this.applyFilters();
        });

        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('transactionDate').value = today;
    }

    async init() {
        const user = authManager.getCurrentUser();
        if (!user) return;

        this.updateMonthDisplay();
        await this.loadTransactions();
        this.populateFilterCategories();
    }

    reset() {
        this.currentMonth = new Date();
        this.transactions = [];
        this.filteredTransactions = [];
        this.updateMonthDisplay();
        this.updateSummary();
        this.renderTransactions();
    }

    updateMonthDisplay() {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
        const month = monthNames[this.currentMonth.getMonth()];
        const year = this.currentMonth.getFullYear();
        document.getElementById('currentMonth').textContent = `${month} ${year}`;
    }

    changeMonth(direction) {
        this.currentMonth.setMonth(this.currentMonth.getMonth() + direction);
        this.updateMonthDisplay();
        this.loadTransactions();
    }

    async loadTransactions() {
        const user = authManager.getCurrentUser();
        if (!user) return;

        // Get start and end dates for the current month
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);

        try {
            this.transactions = await expenseDB.getTransactionsByUser(
                user.userId,
                startDate.toISOString().split('T')[0],
                endDate.toISOString().split('T')[0]
            );
            this.applyFilters();
            this.updateSummary();
        } catch (error) {
            console.error('Error loading transactions:', error);
        }
    }

    async addTransaction() {
        const user = authManager.getCurrentUser();
        if (!user) return;

        const type = document.getElementById('transactionType').value;
        const description = document.getElementById('transactionDescription').value.trim();
        const amount = parseFloat(document.getElementById('transactionAmount').value);
        const category = document.getElementById('transactionCategory').value;
        const date = document.getElementById('transactionDate').value;

        if (!description || !amount || !category || !date) {
            alert('Please fill in all fields');
            return;
        }

        const transaction = {
            type,
            description,
            amount,
            category,
            date
        };

        try {
            await expenseDB.addTransaction(user.userId, transaction);
            
            // Reset form
            document.getElementById('transactionForm').reset();
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('transactionDate').value = today;
            
            // Reload transactions
            await this.loadTransactions();
            
            // Show success feedback
            this.showSuccessMessage('Transaction added successfully!');
        } catch (error) {
            console.error('Error adding transaction:', error);
            alert('Error adding transaction. Please try again.');
        }
    }

    async deleteTransaction(id) {
        if (!confirm('Are you sure you want to delete this transaction?')) {
            return;
        }

        try {
            await expenseDB.deleteTransaction(id);
            await this.loadTransactions();
            this.showSuccessMessage('Transaction deleted successfully!');
        } catch (error) {
            console.error('Error deleting transaction:', error);
            alert('Error deleting transaction. Please try again.');
        }
    }

    applyFilters() {
        this.filteredTransactions = this.transactions.filter(t => {
            const typeMatch = this.filterType === 'all' || t.type === this.filterType;
            const categoryMatch = this.filterCategory === 'all' || t.category === this.filterCategory;
            return typeMatch && categoryMatch;
        });
        this.renderTransactions();
    }

    updateSummary() {
        const income = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expense = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = income - expense;

        document.getElementById('totalIncome').textContent = this.formatCurrency(income);
        document.getElementById('totalExpense').textContent = this.formatCurrency(expense);
        document.getElementById('balance').textContent = this.formatCurrency(balance);
    }

    renderTransactions() {
        const container = document.getElementById('transactionsList');

        if (this.filteredTransactions.length === 0) {
            container.innerHTML = '<p class="no-data">No transactions found for the selected filters.</p>';
            return;
        }

        const html = this.filteredTransactions.map(t => {
            const formattedDate = new Date(t.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });

            return `
                <div class="transaction-item">
                    <div class="transaction-details">
                        <div class="transaction-header">
                            <span class="transaction-description">${this.escapeHtml(t.description)}</span>
                            <span class="transaction-category">${t.category}</span>
                        </div>
                        <div class="transaction-date">${formattedDate}</div>
                    </div>
                    <div class="transaction-right">
                        <div class="transaction-amount ${t.type}">
                            ${t.type === 'income' ? '+' : '-'}${this.formatCurrency(t.amount)}
                        </div>
                        <button class="btn btn-delete" onclick="app.deleteTransaction(${t.id})">Delete</button>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    populateFilterCategories() {
        const categories = [...new Set(this.transactions.map(t => t.category))];
        const select = document.getElementById('filterCategory');
        
        // Keep the "All Categories" option
        select.innerHTML = '<option value="all">All Categories</option>';
        
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            select.appendChild(option);
        });
    }

    updateCategoryOptions(type) {
        const categorySelect = document.getElementById('transactionCategory');
        categorySelect.innerHTML = '<option value="">Select Category</option>';

        const expenseCategories = [
            { value: 'Food', label: '🍔 Food' },
            { value: 'Transport', label: '🚗 Transport' },
            { value: 'Shopping', label: '🛍️ Shopping' },
            { value: 'Bills', label: '💡 Bills' },
            { value: 'Entertainment', label: '🎬 Entertainment' },
            { value: 'Health', label: '⚕️ Health' },
            { value: 'Education', label: '📚 Education' },
            { value: 'Other', label: '📦 Other' }
        ];

        const incomeCategories = [
            { value: 'Salary', label: '💼 Salary' },
            { value: 'Freelance', label: '💻 Freelance' },
            { value: 'Investment', label: '📈 Investment' },
            { value: 'Gift', label: '🎁 Gift' },
            { value: 'Other Income', label: '💰 Other Income' }
        ];

        const categories = type === 'expense' ? expenseCategories : incomeCategories;
        
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.value;
            option.textContent = cat.label;
            categorySelect.appendChild(option);
        });
    }

    formatCurrency(amount) {
        return `₨${amount.toFixed(2)}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showSuccessMessage(message) {
        // Create a temporary success message
        const messageDiv = document.createElement('div');
        messageDiv.className = 'success-toast';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }
}

// Add CSS for toast animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize app
window.app = new ExpenseApp();
