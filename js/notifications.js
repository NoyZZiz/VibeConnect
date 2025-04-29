/**
 * Notification System
 */
class NotificationSystem {
  constructor() {
    this.notificationBell = document.getElementById('notification-bell');
    this.notificationPanel = document.getElementById('notification-panel');
    this.init();
  }

  init() {
    if (this.notificationBell) {
      this.notificationBell.addEventListener('click', () => this.togglePanel());
      this.loadNotifications();
      this.setupWebSocket();
    }
  }

  togglePanel() {
    this.notificationPanel.classList.toggle('active');
  }

  async loadNotifications() {
    try {
      const notifications = await this.fetchNotifications();
      this.renderNotifications(notifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  renderNotifications(notifications) {
    this.notificationPanel.innerHTML = notifications.map(notif => `
      <div class="notification ${notif.unread ? 'unread' : ''}">
        <div class="notification-content">${notif.message}</div>
        <div class="notification-time">${notif.time}</div>
      </div>
    `).join('');
  }

  setupWebSocket() {
    // Connect to WebSocket for real-time updates
    console.log('Connecting to notification service...');
  }

  async fetchNotifications() {
    return [
      { 
        message: "New booking for Tea Ceremony", 
        time: "2 hours ago", 
        unread: true 
      }
    ];
  }
}

// Initialize when notification elements exist
if (document.getElementById('notification-bell')) {
  new NotificationSystem();
}