/**
 * Payment Gateway Integration
 */
class PaymentSystem {
  constructor() {
    this.paymentForm = document.getElementById('payment-form');
    if (this.paymentForm) {
      this.init();
    }
  }

  init() {
    this.paymentForm.addEventListener('submit', (e) => this.handlePayment(e));
  }

  async handlePayment(e) {
    e.preventDefault();
    
    try {
      const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
      
      if (paymentMethod === 'razorpay') {
        await this.processRazorpayPayment();
      } else {
        await this.processStripePayment();
      }
      
      this.redirectToConfirmation();
    } catch (error) {
      console.error('Payment error:', error);
      this.showError('Payment failed. Please try again.');
    }
  }

  async processRazorpayPayment() {
    // Razorpay integration logic
    return new Promise((resolve) => {
      console.log('Processing Razorpay payment...');
      setTimeout(resolve, 1500);
    });
  }

  async processStripePayment() {
    // Stripe integration logic
    return new Promise((resolve) => {
      console.log('Processing Stripe payment...');
      setTimeout(resolve, 1500);
    });
  }

  redirectToConfirmation() {
    window.location.href = '/booking-confirmation.html';
  }

  showError(message) {
    const errorElement = document.getElementById('payment-error') || 
      document.createElement('div');
    errorElement.id = 'payment-error';
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    this.paymentForm.prepend(errorElement);
  }
}

// Initialize on payment pages
new PaymentSystem();