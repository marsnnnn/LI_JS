let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function addTransaction(type, description, amount, category) {
  if (!description || !amount || !category || isNaN(amount)) {
    alert("Toate campurile trebuie completate corect.");
    return;
  }

  const transaction = {
    id: Date.now(),
    type,
    description,
    amount: parseFloat(amount),
    category
  };

  transactions.push(transaction);
  saveTransactions();
  renderTransactions();
  updateChart();
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveTransactions();
  renderTransactions();
  updateChart();
}

function renderTransactions() {
  const list = document.getElementById("transaction-list");
  list.innerHTML = "";

  transactions.forEach(tx => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${tx.description} - ${tx.amount.toFixed(2)} lei (${tx.category})
      <button onclick="deleteTransaction(${tx.id})">Șterge</button>
    `;
    li.style.borderLeftColor = tx.type === "income" ? "#198754" : "#dc3545";
    list.appendChild(li);
  });
}

function updateChart() {
  const expenses = transactions.filter(t => t.type === "expense");

  const categoryTotals = {};
  expenses.forEach(tx => {
    if (!categoryTotals[tx.category]) {
      categoryTotals[tx.category] = 0;
    }
    categoryTotals[tx.category] += tx.amount;
  });

  const ctx = document.getElementById("expense-chart").getContext("2d");

  if (window.expenseChart) {
    window.expenseChart.destroy();
  }

  window.expenseChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [{
        label: "Cheltuieli",
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#ff6384", "#36a2eb", "#ffce56", "#20c997", "#6f42c1",
          "#ffc107", "#0dcaf0", "#fd7e14", "#dc3545", "#198754"
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

document.getElementById("transaction-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const type = document.getElementById("type").value;
  const description = document.getElementById("description").value.trim();
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value.trim();

  addTransaction(type, description, amount, category);
  this.reset();
});

renderTransactions();
updateChart();
