/**
 * UI Components & Event Handlers
 */

class UIComponents {
  static initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tabName = e.target.dataset.tab;
        this.switchTab(tabName);
      });
    });
  }

  static switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  }

  static initResultTabs() {
    document.querySelectorAll('.result-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const resultName = e.target.dataset.result;
        this.switchResultTab(resultName);
      });
    });
  }

  static switchResultTab(resultName) {
    document.querySelectorAll('.result-content').forEach(content => {
      content.classList.remove('active');
    });
    document.querySelectorAll('.result-tab').forEach(btn => {
      btn.classList.remove('active');
    });

    document.getElementById(resultName).classList.add('active');
    document.querySelector(`[data-result="${resultName}"]`).classList.add('active');
  }

  static showWarning(title, message, details = []) {
    const modal = document.getElementById('warningModal');
    const messageEl = document.getElementById('warningMessage');
    const detailsEl = document.getElementById('warningDetails');

    messageEl.textContent = message;
    detailsEl.innerHTML = details.map(d => `<div class="warning">⚠️  ${d}</div>`).join('');

    modal.style.display = 'flex';

    document.getElementById('quarantineBtn').onclick = () => {
      modal.style.display = 'none';
      return false;
    };

    document.getElementById('continueBtn').onclick = () => {
      modal.style.display = 'none';
      return true;
    };
  }

  static hideWarning() {
    document.getElementById('warningModal').style.display = 'none';
  }

  static showResults() {
    document.getElementById('resultsSection').style.display = 'block';
  }

  static displayResult(category, html) {
    const element = document.getElementById(category);
    if (element) {
      element.innerHTML = html;
    }
  }

  static updateProgress(current, total) {
    const percentage = (current / total) * 100;
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressText').textContent = `${current} / ${total} completed`;
  }
}
