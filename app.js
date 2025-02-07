let currentUser = null;

// Initialize App
function initApp() {
    if(!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify({}));
    }
    if(!localStorage.getItem('categories')) {
        localStorage.setItem('categories', JSON.stringify(['Food', 'Transport', 'Utilities']));
    }
    loadCategories();
}

// User Authentication
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const users = JSON.parse(localStorage.getItem('users'));
    if(users[username] && users[username].password === password) {
        currentUser = username;
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        loadDashboard();
    } else {
        alert('Invalid credentials');
    }
}

// Expense Management
function saveExpense(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const expense = {
        date: formData.get('date'),
        category: formData.get('category'),
        amount: parseFloat(formData.get('amount')),
        timestamp: new Date().getTime()
    };

    const expenses = JSON.parse(localStorage.getItem(currentUser) || '[]');
    expenses.push(expense);
    localStorage.setItem(currentUser, JSON.stringify(expenses));
    e.target.reset();
    alert('Expense saved!');
}

// Category Management
function loadCategories() {
    const categories = JSON.parse(localStorage.getItem('categories'));
    const select = document.getElementById('categorySelect');
    select.innerHTML = categories.map(c => `<option>${c}</option>`).join('');
    
    const list = document.getElementById('categoryList');
    list.innerHTML = categories.map(c => `
        <li class="list-group-item d-flex justify-content-between">
            ${c}
            <button class="btn btn-danger btn-sm" onclick="deleteCategory('${c}')">Delete</button>
        </li>
    `).join('');
}

function addCategory() {
    const newCategory = document.getElementById('newCategory').value;
    if(newCategory) {
        const categories = JSON.parse(localStorage.getItem('categories'));
        categories.push(newCategory);
        localStorage.setItem('categories', JSON.stringify(categories));
        loadCategories();
        document.getElementById('newCategory').value = '';
    }
}

function deleteCategory(category) {
    const categories = JSON.parse(localStorage.getItem('categories'));
    const filtered = categories.filter(c => c !== category);
    localStorage.setItem('categories', JSON.stringify(filtered));
    loadCategories();
}

// Dashboard Charts
function loadDashboard() {
    const expenses = JSON.parse(localStorage.getItem(currentUser) || '[]');
    
    // Monthly Chart
    const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
    new Chart(monthlyCtx, {
        type: 'line',
        data: generateMonthlyData(expenses)
    });

    // Category Chart
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    new Chart(categoryCtx, {
        type: 'pie',
        data: generateCategoryData(expenses)
    });
}

// Report Generation
function generateReport() {
    const type = document.getElementById('reportType').value;
    const expenses = JSON.parse(localStorage.getItem(currentUser) || '[]');
    const ctx = document.getElementById('reportChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: generateReportData(expenses, type)
    });
}

// Helper functions for data generation
function generateMonthlyData(expenses) {
    // Implement monthly aggregation
}

function generateCategoryData(expenses) {
    // Implement category aggregation
}

function generateReportData(expenses, type) {
    // Implement report data based on type
}

// Excel Integration
function exportToExcel() {
    const expenses = JSON.parse(localStorage.getItem(currentUser) || '[]');
    const ws = XLSX.utils.json_to_sheet(expenses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    XLSX.writeFile(wb, "expenses.xlsx");
}

// Initialize app
initApp();