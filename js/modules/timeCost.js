/**
 * Time Cost Module - Convert money to hours of work
 * Behavioral economics tool to help users think in terms of time
 */

const TimeCost = {
  hourlyRateInput: null,
  itemCostInput: null,
  calculateBtn: null,
  costHoursSpan: null,
  costMessageSpan: null,
  historyList: null,

  init() {
    this.hourlyRateInput = document.getElementById('hourlyRate');
    this.itemCostInput = document.getElementById('itemCost');
    this.calculateBtn = document.getElementById('calculateCostBtn');
    this.costHoursSpan = document.getElementById('costHours');
    this.costMessageSpan = document.getElementById('costMessage');
    this.historyList = document.getElementById('purchaseHistoryList');

    if (!this.calculateBtn) return; // Not on cost page

    this.hourlyRateInput.value = AppState.hourlyRate;
    this.hourlyRateInput.addEventListener('change', () => {
      AppState.hourlyRate = parseInt(this.hourlyRateInput.value);
      Storage.set('hourlyRate', AppState.hourlyRate);
    });

    this.calculateBtn.addEventListener('click', () => this.calculateCost());
    this.renderHistory();
  },

  calculateCost() {
    const cost = parseFloat(this.itemCostInput.value);
    const rate = parseFloat(this.hourlyRateInput.value);

    if (isNaN(cost) || cost <= 0) {
      this.costHoursSpan.textContent = 'Enter a valid cost';
      return;
    }

    const hours = cost / rate;
    const days = hours / 8;
    this.costHoursSpan.textContent = `${hours.toFixed(1)} hours`;

    let message = '';
    if (hours < 1) {
      message = `💡 That's less than an hour. Worth it?`;
    } else if (hours < 4) {
      message = `⏳ Half a workday. Think twice.`;
    } else if (hours < 8) {
      message = `⚠️ A full work day! Are you sure?`;
    } else {
      message = `🚨 ${days.toFixed(1)} full work days! Reconsider!`;
    }
    this.costMessageSpan.textContent = message;

    // Save to history
    const purchase = {
      item: `$${cost.toFixed(2)} purchase`,
      hours: hours.toFixed(1),
      timestamp: new Date().toLocaleTimeString()
    };
    AppState.addPurchase(purchase);
    this.renderHistory();
    this.updateDashboardCost();
    this.itemCostInput.value = ''; // Clear input
  },

  renderHistory() {
    if (!this.historyList) return;

    if (AppState.purchases.length === 0) {
      this.historyList.innerHTML = '<li class="empty-history">No items yet. Calculate something!</li>';
      return;
    }

    this.historyList.innerHTML = AppState.purchases
      .map(p => `<li>${p.timestamp} — ${p.item} = <strong>${p.hours} hours</strong> of life</li>`)
      .join('');
  },

  updateDashboardCost() {
    const todayCostSpan = document.getElementById('todayCost');
    if (todayCostSpan && AppState.purchases.length) {
      const today = new Date().toLocaleDateString();
      let todayTotal = 0;

      // Estimate today's cost (purchases from this view session)
      AppState.purchases.forEach(p => {
        todayTotal += parseFloat(p.hours) * AppState.hourlyRate;
      });

      todayCostSpan.textContent = `$${Math.round(todayTotal)}`;
    }
  }
};
