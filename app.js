const STATIC_CREDENTIALS = { username: 'admin', password: 'admin555' };
let currentChart = null;

function initStorage() {
    if(!localStorage.getItem('expenses')) localStorage.setItem('expenses', JSON.stringify([]));
    if(!localStorage.getItem('categories')) localStorage.setItem('categories', JSON.stringify([
        'Food', 'Transport', 'Utilities', 'Entertainment'
    ]));
}

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

function showSection(sectionId) {
    document.querySelectorAll('.main-section').forEach(el => el.style.display = 'none');
    const section = document.getElementById(sectionId);
    if(section) {
        section.style.display = 'block';
        if(sectionId === 'dashboard') loadCharts();
        if(sectionId === 'reports') generateReport();
    }
}

function saveExpense(e) {
    e.preventDefault();
    const expense = {
        id: Date.now(),
        date: document.getElementById('expenseDate').value,
        category: document.getElementById('categorySelect').value,
        amount: parseFloat(document.getElementById('expenseAmount').value),
        description: document.getElementById('expenseDesc').value
    };

    // Get existing expenses or initialize empty array
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    
    // Clear form and refresh displays
    e.target.reset();
    loadExpenses();  // Refresh table
    loadCharts();    // Update dashboard
    showSection('addExpense'); // Stay in current section
}

function loadExpenses() {
    // Always fallback to empty array if no expenses
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const tbody = document.getElementById('expenseList');
    
    tbody.innerHTML = expenses.map(expense => `
        <tr>
            <td>${expense.date}</td>
            <td>${expense.category}</td>
            <td>${expense.description}</td>
            <td>₹${expense.amount.toFixed(2)}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editExpense(${expense.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteExpense(${expense.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}


function deleteExpense(id) {
    let expenses = JSON.parse(localStorage.getItem('expenses'));
    expenses = expenses.filter(e => e.id !== id);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    loadExpenses();
    loadCharts();
}

function loadCategories() {
    const categories = JSON.parse(localStorage.getItem('categories'));
    const selects = document.querySelectorAll('#categorySelect, #reportCategory');
    selects.forEach(select => {
        select.innerHTML = `<option value="">All Categories</option>` + 
            categories.map(c => `<option>${c}</option>`).join('');
    });
}

function loadCharts() {
    const expenses = JSON.parse(localStorage.getItem('expenses'));
    
    // Monthly Chart
    const monthlyData = expenses.reduce((acc, { date, amount }) => {
        const month = date.slice(0, 7);
        acc[month] = (acc[month] || 0) + amount;
        return acc;
    }, {});
    
    const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
    new Chart(monthlyCtx, {
        type: 'line',
        data: {
            labels: Object.keys(monthlyData),
            datasets: [{
                label: 'Monthly Expenses',
                data: Object.values(monthlyData),
                borderColor: '#3b82f6',
                tension: 0.1
            }]
        }
    });

    // Category Chart
    const categoryData = expenses.reduce((acc, { category, amount }) => {
        acc[category] = (acc[category] || 0) + amount;
        return acc;
    }, {});
    
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    new Chart(categoryCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryData),
            datasets: [{
                data: Object.values(categoryData),
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#6366f1']
            }]
        }
    });
}

function generateReport() {
    if(currentChart) currentChart.destroy();
    
    const category = document.getElementById('reportCategory').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const comparePeriod = document.getElementById('comparePeriod').value;
    
    let expenses = JSON.parse(localStorage.getItem('expenses'))
        .filter(e => (!startDate || e.date >= startDate) && (!endDate || e.date <= endDate) && (!category || e.category === category));
    
    // Comparison data
    let comparisonData = null;
    if(comparePeriod) {
        const compareDate = new Date(startDate || expenses[0]?.date);
        comparePeriod === 'prevMonth' ? compareDate.setMonth(compareDate.getMonth() - 1) : compareDate.setFullYear(compareDate.getFullYear() - 1);
        
        const compareStart = compareDate.toISOString().split('T')[0];
        comparisonData = JSON.parse(localStorage.getItem('expenses'))
            .filter(e => e.date.startsWith(compareStart.slice(0, 7)));
    }

    const ctx = document.getElementById('reportChart').getContext('2d');
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [...new Set(expenses.map(e => e.date))],
            datasets: [{
                label: 'Current Period',
                data: expenses.map(e => e.amount),
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
            }, ...(comparisonData ? [{
                label: 'Comparison',
                data: comparisonData.map(e => e.amount),
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
            }] : [])]
        }
    });
}

function exportToExcel() {
    const expenses = JSON.parse(localStorage.getItem('expenses'));
    const ws = XLSX.utils.json_to_sheet(expenses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    XLSX.writeFile(wb, "expenses.xlsx");
}

function initApp() {
    initStorage();
    loadCategories();
    loadExpenses();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expenseDate').value = today;
    document.getElementById('startDate').value = today.slice(0, 7) + '-01';
    document.getElementById('endDate').value = today;
    showSection('dashboard');
}

// Add this function to handle edits
function editExpense(id) {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const expense = expenses.find(e => e.id === id);
    
    if(expense) {
        document.getElementById('expenseDate').value = expense.date;
        document.getElementById('categorySelect').value = expense.category;
        document.getElementById('expenseAmount').value = expense.amount;
        document.getElementById('expenseDesc').value = expense.description;
        
        // Remove old entry
        const updatedExpenses = expenses.filter(e => e.id !== id);
        localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
        loadExpenses();
    }
}

// Initialize
initStorage();
document.getElementById('loginScreen').style.display = 'block';
