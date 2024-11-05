document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('expense-form');
    const expenseNameInput = document.getElementById('expense-name');
    const expenseAmountInput = document.getElementById('expense-amount');
    const expenseList = document.getElementById('expense-list');
    const totalAmount = document.getElementById('total-amount');
  
    const state = {
      expenses: [],
      total: 0,
    };
  
    const reactiveState = new Proxy(state, {
      set(target, key, value) {
        target[key] = value;
        if (key === 'total') {
          totalAmount.textContent = value;
        }
        return true;
      },
    });
  
    function addExpense(name, amount) {
      const expense = { id: Date.now(), name, amount };
      reactiveState.expenses.push(expense);
      renderExpenses();
      updateTotal();
    }
  
    function removeExpense(id) {
      reactiveState.expenses = reactiveState.expenses.filter(expense => expense.id !== id);
      renderExpenses();
      updateTotal();
    }
  
    function updateTotal() {
      reactiveState.total = reactiveState.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }
  
    function renderExpenses() {
      expenseList.innerHTML = '';
      reactiveState.expenses.forEach(expense => {
        const li = document.createElement('li');
        li.textContent = `${expense.name}: ${expense.amount} ₽`;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Удалить';
        removeButton.onclick = () => removeExpense(expense.id);
        li.appendChild(removeButton);
        expenseList.appendChild(li);
      });
    }
  
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = expenseNameInput.value.trim();
      const amount = parseFloat(expenseAmountInput.value);
      if (name && amount > 0) {
        addExpense(name, amount);
        expenseNameInput.value = '';
        expenseAmountInput.value = '';
      }
    });
  });
  