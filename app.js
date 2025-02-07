// Static Credentials
const STATIC_CREDENTIALS = {
    username: 'admin',
    password: 'admin555'
};

// Initialize Local Storage
function initStorage() {
    if(!localStorage.getItem('expenses')) {
        localStorage.setItem('expenses', JSON.stringify([]));
    }
    if(!localStorage.getItem('categories')) {
        localStorage.setItem('categories', JSON.stringify([
            'Food', 'Transport', 'Utilities', 'Entertainment'
        ]));
    }
}

// Login Function
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if(username === STATIC_CREDENTIALS.username && password === STATIC_CREDENTIALS.password) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        initApp();
    } else {
        alert('Invalid credentials!');
    }
}

// Expense Management
function saveExpense(e) {
    e.preventDefault();
    const expense = {
        id: Date.now(),
        date: document.getElementById('expenseDate').value,
        category: document.getElementById('categorySelect').value,
        amount: parseFloat(document.getElementById('expenseAmount').value)
    };

    const expenses = JSON.parse(localStorage.getItem('expenses'));
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    
    e.target.reset();
    alert('Expense saved successfully!');
    loadCharts();
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
    const newCategory = document.getElementById('newCategory').value.trim();
    if(newCategory) {
        const categories = JSON.parse(localStorage.getItem('categories'));
        if(!categories.includes(newCategory)) {
            categories.push(newCategory);
            localStorage.setItem('categories', JSON.stringify(categories));
            loadCategories();
            document.getElementById('newCategory').value = '';
        }
    }
}

function deleteCategory(category) {
    const categories = JSON.parse(localStorage.getItem('categories'));
    const filtered = categories.filter(c => c !== category);
    localStorage.setItem('categories', JSON.stringify(filtered));
    loadCategories();
}

// Chart Management
function loadCharts() {
    const expenses = JSON.parse(localStorage.getItem('expenses'));
    
    // Monthly Chart
    const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
    new Chart(monthlyCtx, {
        type: 'line',
        data: getMonthlyData(expenses)
    });

    // Category Chart
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    new Chart(categoryCtx, {
        type: 'pie',
        data: getCategoryData(expenses)
    });
}

// Report Generation
function generateReport() {
    const type = document.getElementById('reportType').value;
    const date = document.getElementById('reportDate').value;
    const expenses = JSON.parse(localStorage.getItem('expenses'));
    
    const filteredData = filterExpenses(expenses, type, date);
    const ctx = document.getElementById('reportChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: prepareReportData(filteredData, type)
    });
}

// Excel Export
function exportToExcel() {
    const expenses = JSON.parse(localStorage.getItem('expenses'));
    const ws = XLSX.utils.json_to_sheet(expenses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    XLSX.writeFile(wb, "expenses.xlsx");
}

// Initialize App
function initApp() {
    initStorage();
    loadCategories();
    loadCharts();
}

// Helper Functions
function showSection(sectionId) {
    document.querySelectorAll('.container').forEach(el => el.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
}

function filterExpenses(expenses, type, date) {
    // Implement date filtering logic
}

function getMonthlyData(expenses) {
    // Implement monthly aggregation
}

function getCategoryData(expenses) {
    // Implement category aggregation
}

// Initialize on load
initStorage();
