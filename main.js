// State management
let expenses = [];
const totalBudget = 1000;
let currentCalculation = '';

// DOM Elements
const expenseForm = document.getElementById('expenseForm');
const expenseTableBody = document.getElementById('expenseTableBody');
const budgetProgress = document.getElementById('budgetProgress');
const spentAmount = document.getElementById('spentAmount');
const calculator = document.getElementById('calculator');
const calcInput = document.getElementById('calcInput');
const weeklyChart = document.getElementById('weeklyChart');

// Initialize Chart
let chart = new Chart(weeklyChart, {
    type: 'bar',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Daily Expenses',
            data: [0, 0, 0, 0, 0, 0, 0],
            backgroundColor: '#3498db'
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Event Listeners
expenseForm.addEventListener('submit', handleExpenseSubmit);

// Functions
function handleExpenseSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('expenseTitle').value;
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const category = document.getElementById('expenseCategory').value;

    addExpense({
        id: Date.now(),
        title,
        amount,
        category,
        date: new Date().toLocaleDateString()
    });

    expenseForm.reset();
    showNotification('Expense added successfully!');
}

function addExpense(expense) {
    expenses.push(expense);
    updateExpenseTable();
    updateBudgetProgress();
    updateWeeklyChart();
}

function deleteExpense(id) {
    expenses = expenses.filter(expense => expense.id !== id);
    updateExpenseTable();
    updateBudgetProgress();
    updateWeeklyChart();
    showNotification('Expense deleted!');
}

function updateExpenseTable() {
    const filterCategory = document.getElementById('filterCategory').value;
    const filteredExpenses = filterCategory === 'all' 
        ? expenses 
        : expenses.filter(expense => expense.category === filterCategory);

    expenseTableBody.innerHTML = filteredExpenses.map(expense => `
        <tr>
            <td>${expense.title}</td>
            <td>$${expense.amount.toFixed(2)}</td>
            <td>${expense.category}</td>
            <td>${expense.date}</td>
            <td>
                <button onclick="deleteExpense(${expense.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

function updateBudgetProgress() {
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const percentage = (totalSpent / totalBudget) * 100;
    
    budgetProgress.style.width = `${Math.min(percentage, 100)}%`;
    budgetProgress.style.backgroundColor = percentage > 100 ? '#e74c3c' : '#3498db';
    spentAmount.textContent = totalSpent.toFixed(2);
}

function updateWeeklyChart() {
    const today = new Date();
    const weekData = Array(7).fill(0);

    expenses.forEach(expense => {
        const expenseDate = new Date(expense.date);
        const dayDiff = Math.floor((today - expenseDate) / (1000 * 60 * 60 * 24));
        if (dayDiff < 7) {
            weekData[6 - dayDiff] += expense.amount;
        }
    });

    chart.data.datasets[0].data = weekData;
    chart.update();
}

function filterExpenses() {
    updateExpenseTable();
}

// Calculator Functions
function toggleCalculator() {
    calculator.style.display = calculator.style.display === 'none' ? 'block' : 'none';
}

function appendNumber(num) {
    currentCalculation += num;
    calcInput.value = currentCalculation;
}

function appendOperator(operator) {
    currentCalculation += operator;
    calcInput.value = currentCalculation;
}

function calculate() {
    try {
        const result = eval(currentCalculation);
        calcInput.value = result;
        currentCalculation = result.toString();
    } catch (error) {
        calcInput.value = 'Error';
        currentCalculation = '';
    }
}

function clearCalc() {
    currentCalculation = '';
    calcInput.value = '';
}

// Notification Function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    document.getElementById('notificationContainer').appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize the app
updateBudgetProgress();
updateWeeklyChart();