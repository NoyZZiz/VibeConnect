/**
 * VibeConnect Booking System
 * Handles:
 * - Date/time selection
 * - Participant management
 * - Real-time price calculation
 * - Form validation
 * - Payment simulation
 */

class BookingSystem {
  constructor() {
    // DOM Elements
    this.dateInput = document.getElementById('experience-date');
    this.timeSlotsContainer = document.querySelector('.slot-options');
    this.incrementBtn = document.getElementById('increment');
    this.decrementBtn = document.getElementById('decrement');
    this.participantInput = document.getElementById('participants-count');
    this.bookNowBtn = document.getElementById('book-now');
    this.priceElements = {
      subtotal: document.getElementById('subtotal'),
      serviceFee: document.getElementById('service-fee'),
      total: document.getElementById('total-price')
    };

    // Configuration
    this.config = {
      basePrice: 1200,
      serviceFeePercentage: 0.15,
      maxParticipants: 8,
      minParticipants: 1,
      timeSlots: {
        weekday: ['10:00 AM', '2:00 PM', '6:00 PM'],
        weekend: ['9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM']
      }
    };

    // Initialize
    this.initDatePicker();
    this.initTimeSlots();
    this.initParticipantCounter();
    this.initEventListeners();
  }

  initDatePicker() {
    // Set minimum date (today + 2 days)
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 2);
    
    this.dateInput.min = minDate.toISOString().split('T')[0];
    this.dateInput.value = minDate.toISOString().split('T')[0];
  }

  initTimeSlots() {
    this.updateTimeSlots();
    this.dateInput.addEventListener('change', () => this.updateTimeSlots());
  }

  updateTimeSlots() {
    const selectedDate = new Date(this.dateInput.value);
    const isWeekend = [0, 6].includes(selectedDate.getDay());
    const slots = isWeekend ? this.config.timeSlots.weekend : this.config.timeSlots.weekday;

    this.timeSlotsContainer.innerHTML = '';

    slots.forEach(slot => {
      const button = document.createElement('button');
      button.className = 'time-slot';
      button.textContent = slot;
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.selectTimeSlot(button);
      });
      this.timeSlotsContainer.appendChild(button);
    });

    // Auto-select first slot
    if (this.timeSlotsContainer.firstChild) {
      this.selectTimeSlot(this.timeSlotsContainer.firstChild);
    }
  }

  selectTimeSlot(button) {
    document.querySelectorAll('.time-slot').forEach(btn => 
      btn.classList.remove('active')
    );
    button.classList.add('active');
    this.updatePrice();
  }

  initParticipantCounter() {
    this.incrementBtn.addEventListener('click', () => 
      this.updateParticipants(1)
    );
    this.decrementBtn.addEventListener('click', () => 
      this.updateParticipants(-1)
    );
    this.participantInput.addEventListener('change', () => 
      this.validateParticipantCount()
    );
    this.updatePrice(); // Initial calculation
  }

  updateParticipants(change) {
    const newValue = parseInt(this.participantInput.value) + change;
    this.participantInput.value = Math.max(
      this.config.minParticipants,
      Math.min(this.config.maxParticipants, newValue)
    );
    this.updatePrice();
  }

  validateParticipantCount() {
    let value = parseInt(this.participantInput.value) || this.config.minParticipants;
    this.participantInput.value = Math.max(
      this.config.minParticipants,
      Math.min(this.config.maxParticipants, value)
    );
    this.updatePrice();
  }

  updatePrice() {
    const participants = parseInt(this.participantInput.value);
    const subtotal = this.config.basePrice * participants;
    const serviceFee = Math.round(subtotal * this.config.serviceFeePercentage);
    const total = subtotal + serviceFee;

    this.priceElements.subtotal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    this.priceElements.serviceFee.textContent = `₹${serviceFee.toLocaleString('en-IN')}`;
    this.priceElements.total.textContent = `₹${total.toLocaleString('en-IN')}`;
  }

  initEventListeners() {
    this.bookNowBtn.addEventListener('click', (e) => this.handleBooking(e));
  }

  async handleBooking(e) {
    e.preventDefault();

    if (!this.validateBookingForm()) return;

    try {
      this.showLoading(true);
      const bookingData = this.collectBookingData();
      
      // Simulate API call
      await this.processPayment(bookingData);
      this.redirectToConfirmation(bookingData);
    } catch (error) {
      this.showError('Payment failed. Please try again.');
      console.error('Booking error:', error);
    } finally {
      this.showLoading(false);
    }
  }

  validateBookingForm() {
    let isValid = true;
    const errorElement = document.getElementById('booking-error');

    // Clear previous errors
    errorElement.textContent = '';
    errorElement.style.display = 'none';

    // Date validation
    if (!this.dateInput.value) {
      this.showError('Please select a date', errorElement);
      isValid = false;
    }

    // Time slot validation
    if (!document.querySelector('.time-slot.active')) {
      this.showError('Please select a time slot', errorElement);
      isValid = false;
    }

    return isValid;
  }

  collectBookingData() {
    return {
      experienceId: new URLSearchParams(window.location.search).get('id'),
      date: this.dateInput.value,
      time: document.querySelector('.time-slot.active').textContent,
      participants: this.participantInput.value,
      subtotal: this.priceElements.subtotal.textContent,
      serviceFee: this.priceElements.serviceFee.textContent,
      total: this.priceElements.total.textContent
    };
  }

  processPayment(bookingData) {
    return new Promise((resolve) => {
      // In production: Replace with actual payment gateway integration
      setTimeout(() => {
        console.log('Processing payment for:', bookingData);
        resolve();
      }, 1500);
    });
  }

  redirectToConfirmation(bookingData) {
    const queryString = new URLSearchParams(bookingData).toString();
    window.location.href = `booking-confirmation.html?${queryString}`;
  }

  showLoading(isLoading) {
    this.bookNowBtn.disabled = isLoading;
    this.bookNowBtn.innerHTML = isLoading
      ? '<i class="fas fa-spinner fa-spin"></i> Processing...'
      : 'Book Now';
  }

  showError(message, element = document.getElementById('booking-error')) {
    element.textContent = message;
    element.style.display = 'block';
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Initialize Booking System
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('experience-date')) {
    new BookingSystem();
  }
});