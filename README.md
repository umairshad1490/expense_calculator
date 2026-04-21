# Monthly Expense Tracker 💰

A secure, user-friendly expense tracking application with monthly views, built with vanilla JavaScript and IndexedDB for local data storage.

## Features ✨

- **User Authentication**: Secure login and registration system
- **Privacy-First**: All data stored locally in IndexedDB - no server needed
- **Monthly View**: Track expenses by month with easy navigation
- **Categories**: Organize transactions with preset categories
- **Income & Expenses**: Track both income and expenses
- **Real-time Summary**: See total income, expenses, and balance at a glance
- **Filtering**: Filter transactions by type and category
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **User Isolation**: Each user's data is completely separate and secure

## Technologies Used 🛠️

- HTML5
- CSS3 (Custom styling with CSS variables)
- Vanilla JavaScript (ES6+)
- IndexedDB (Browser storage)

## Getting Started 🚀

### Local Development

1. Clone this repository
2. Open `index.html` in your browser
3. That's it! No build process or server needed

### Deploy to GitHub Pages

1. Create a new repository on GitHub
2. Push your code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

3. Enable GitHub Pages:
   - Go to your repository settings
   - Navigate to "Pages" in the left sidebar
   - Under "Source", select "main" branch
   - Click "Save"
   - Your site will be published at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## Usage 📖

### First Time Setup

1. Click "Register" to create a new account
2. Enter a username (minimum 3 characters) and password (minimum 6 characters)
3. After registration, login with your credentials

### Adding Transactions

1. Select transaction type (Income or Expense)
2. Enter description
3. Enter amount
4. Select category
5. Choose date
6. Click "Add Transaction"

### Viewing Transactions

- Use the month navigation arrows to view different months
- Filter by transaction type (All/Income/Expense)
- Filter by category
- Click "Delete" to remove a transaction

### Data Privacy

- All data is stored locally in your browser using IndexedDB
- Each user's data is completely isolated
- No data is sent to any server
- Data persists across browser sessions
- Clearing browser data will delete all transactions

## Security Notes 🔒

This application uses client-side storage and authentication. For production use, consider:

1. Implementing proper password hashing (bcrypt, argon2, etc.)
2. Adding two-factor authentication
3. Using HTTPS for deployment
4. Implementing session timeout
5. Adding data backup/export features

## Browser Support 🌐

Works on all modern browsers that support:
- IndexedDB
- ES6+ JavaScript
- CSS Grid and Flexbox

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## File Structure 📁

```
expense-tracker/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── db.js              # IndexedDB database operations
├── auth.js            # Authentication logic
├── app.js             # Main application logic
└── README.md          # This file
```

## Features Breakdown 🎯

### Authentication System
- User registration with validation
- Secure login
- Session management
- User-specific data isolation

### Transaction Management
- Add income and expenses
- Categorize transactions
- Date-based organization
- Delete transactions

### Monthly Overview
- Navigate between months
- View summary statistics
- Filter transactions
- Responsive transaction list

### Data Storage
- IndexedDB for persistent storage
- No external dependencies
- Offline-first approach
- Fast local operations

## Customization 🎨

### Currency Symbol
The app uses Pakistani Rupee (₨) by default. To change it:
1. Open `app.js`
2. Find the `formatCurrency` method
3. Replace `₨` with your currency symbol

### Categories
To add or modify categories:
1. Open `index.html`
2. Find the `transactionCategory` select element
3. Add/modify options in the optgroups

### Color Scheme
Colors are defined in CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;
    --success-color: #10b981;
    --danger-color: #ef4444;
    /* etc. */
}
```

## Troubleshooting 🔧

### Data not persisting
- Check if cookies/storage is enabled in your browser
- Make sure you're not in private/incognito mode
- Check browser console for IndexedDB errors

### Login issues
- Usernames are case-insensitive
- Ensure password meets minimum length requirement
- Clear browser storage and re-register if needed

### Transactions not showing
- Verify you're viewing the correct month
- Check applied filters
- Ensure transaction date matches the selected month

## Contributing 🤝

Feel free to fork this project and submit pull requests for any improvements!

## License 📄

This project is open source and available under the MIT License.

## Support 💬

For issues or questions, please open an issue on GitHub.

---

Made with ❤️ for better expense tracking
