// Static Credentials
const STATIC_CREDENTIALS = {
    username: 'admin',
    password: 'admin555'
};

// Initialize Storage
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
        amount: parseFloat(document.getElementById('expenseAmount').value),
        description: document.getElementById('expenseDesc').value
    };

    const expenses = JSON.parse(localStorage.getItem('expenses'));
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    
    e.target.reset();
    loadExpenses();
}

function loadExpenses() {
    const expenses = JSON.parse(localStorage.getItem('expenses'));
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
}

// Category Management
function loadCategories() {
    const categories = JSON.parse(localStorage.getItem('categories'));
    
    // Populate category selects
    const categorySelects = document.querySelectorAll('select[id$="Select"], #reportCategory');
    categorySelects.forEach(select => {
        select.innerHTML = categories.map(c => `<option>${c}</option>`).join('');
    });
}

// Report Generation
function generateReport() {
    const category = document.getElementById('reportCategory').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const comparePeriod = document.getElementById('comparePeriod').value;
    
    let expenses = JSON.parse(localStorage.getItem('expenses'));
    
    // Filter expenses
    expenses = expenses.filter(e => {
        const dateMatch = (!startDate || e.date >= startDate) && (!endDate || e.date <= endDate);
        const categoryMatch = !category || e.category === category;
        return dateMatch && categoryMatch;
    });
    
    // Comparison logic
    let comparisonData = null;
    if(comparePeriod) {
        const compareDate = new Date(startDate || expenses[0]?.date);
        if(comparePeriod === 'prevMonth') {
            compareDate.setMonth(compareDate.getMonth() - 1);
        } else {
            compareDate.setFullYear(compareDate.getFullYear() - 1);
        }
        
        const compareStart = compareDate.toISOString().split('T')[0];
        comparisonData = JSON.parse(localStorage.getItem('expenses'))
            .filter(e => e.date.startsWith(compareStart.slice(0, 7)));
    }

    // Generate chart
    const ctx = document.getElementById('reportChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: expenses.map(e => e.date),
            datasets: [{
                label: 'Current Period',
                data: expenses.map(e => e.amount),
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
            }, ...(comparisonData ? [{
                label: 'Comparison Period',
                data: comparisonData.map(e => e.amount),
                backgroundColor: 'rgba(255, 99, 132, 0.5)'
            }] : [])]
        }
    });
}

// Initialize App
function initApp() {
    initStorage();
    loadCategories();
    loadExpenses();
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expenseDate').value = today;
    document.getElementById('startDate').value = today.slice(0, 7) + '-01';
    document.getElementById('endDate').value = today;
}

// Start the app
initStorage();
document.getElementById('loginScreen').style.display = 'block';
