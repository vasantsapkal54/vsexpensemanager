# vsexpensemanager
# Expense Manager

A comprehensive expense tracking application with advanced reporting capabilities, built as a Progressive Web App (PWA) that can be converted to native Android/iOS apps.

![Expense Manager Screenshot](screenshot.png)

## Features

- **Secure Authentication**
  - Static admin login (username: `admin`, password: `admin555`)
- **Expense Management**
  - Add/Delete expense records
  - Categorize expenses with custom categories
  - Date-based expense tracking
- **Interactive Dashboard**
  - Real-time monthly summary chart
  - Visual category breakdown pie chart
- **Advanced Reporting**
  - Generate daily/weekly/monthly/yearly reports
  - Comparative expense analysis
  - Custom date range selection
- **Data Management**
  - Local Excel file database support
  - One-click Excel export/import
  - Automatic local storage initialization
- **Category System**
  - Add/Remove custom categories
  - Dynamic category selection in forms

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Bootstrap 5
- **Data Visualization**: Chart.js
- **Spreadsheet Handling**: SheetJS (xlsx.js)
- **Storage**: LocalStorage API
- **Hosting**: GitHub Pages

## Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/expense-manager.git
   cd expense-manager
   ```

2. **Host on GitHub Pages**
   - Go to Repository Settings > Pages
   - Select branch `gh-pages` and root folder
   - Access app at: `https://yourusername.github.io/expense-manager`

## Usage

1. **Login**
   - Use credentials: 
     - Username: `admin`
     - Password: `admin555`

2. **Add Expense**
   - Navigate to "Add Expense"
   - Select date, category, and enter amount
   - Click "Save Expense"

3. **View Dashboard**
   - Real-time expense visualization
   - Interactive charts with hover effects

4. **Generate Reports**
   - Select report type (daily/monthly/etc)
   - Choose date range
   - Click "Generate" for visual report

5. **Manage Categories**
   - Add new categories
   - Remove existing categories
   - Automatic form field updates

## Excel Integration

- **Export Data**
  - Click "Export Excel" in navigation
  - Get `.xlsx` file with all records

- **Import Data**
  - Replace `expenses.xlsx` file
  - Data auto-loads on app refresh

## Convert to Android App

1. Use [WebViewGold](https://www.webviewgold.com) or similar service
2. Input your GitHub Pages URL
3. Configure app settings:
   ```json
   {
     "appName": "Expense Manager",
     "orientation": "portrait",
     "allowFileAccess": true
   }
   ```
4. Build and download APK

## Security Notes

- Initial credentials stored in plain text (for demo purposes)
- Recommended for production:
  - Implement password hashing
  - Add user registration system
  - Enable HTTPS

## License

MIT License - See [LICENSE](LICENSE) for details

## Credits

- Chart.js for data visualization
- SheetJS for Excel handling
- Bootstrap for UI components
