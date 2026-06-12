/**
 * TimeOS - Main Application Orchestrator
 * Production-grade entry point managing all modules
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 TimeOS Initializing...');

  // Initialize all modules in order
  Weather.init();
  SmartAlarm.init();
  FocusTimer.init();
  TimeCost.init();
  Analytics.init();

  // Setup navigation
  setupNavigation();

  // Request notification permissions
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }

  // Periodic dashboard updates
  setInterval(() => {
    FocusTimer.updateStats();
    TimeCost.updateDashboardCost();
    SmartAlarm.updateDashboardPreview();
    Analytics.updateWellSpentRatio();
  }, 30000); // Update every 30 seconds

  // Initial dashboard updates
  setTimeout(() => {
    FocusTimer.updateStats();
    TimeCost.updateDashboardCost();
    SmartAlarm.updateDashboardPreview();
    Analytics.updateWellSpentRatio();
  }, 100);

  console.log('✅ TimeOS Ready');
});

/**
 * Setup navigation between views
 */
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const views = document.querySelectorAll('.view');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const viewId = item.getAttribute('data-view');

      // Update active nav item
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');

      // Update active view
      views.forEach(view => view.classList.remove('active-view'));
      const targetView = document.getElementById(`${viewId}View`);
      if (targetView) {
        targetView.classList.add('active-view');

        // Trigger analytics view update if needed
        if (viewId === 'analytics') {
          Analytics.updateAnalytics();
        }
      }
    });
  });
}
