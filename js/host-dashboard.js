/**
 * Host Dashboard Controller
 */
class HostDashboard {
  constructor() {
    this.initDateRangePicker();
    this.initBookingTable();
    this.initCharts();
  }

  initDateRangePicker() {
    const dateInputs = document.querySelectorAll('.date-picker');
    dateInputs.forEach(input => {
      input.addEventListener('change', () => this.updateBookings());
    });
  }

  initBookingTable() {
    // Initialize DataTables or similar
    console.log('Booking table initialized');
  }

  initCharts() {
    // Initialize earnings chart
    if (document.getElementById('earnings-chart')) {
      console.log('Initializing charts...');
      // Integration with Chart.js would go here
    }
  }

  async updateBookings() {
    // Fetch updated booking data
    console.log('Updating bookings...');
  }
}

// Initialize on host dashboard
if (document.querySelector('.host-dashboard')) {
  new HostDashboard();
}