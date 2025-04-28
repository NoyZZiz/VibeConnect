/**
 * COMPLETE BOOKING SYSTEM FOR VIBECONNECT
 * Handles:
 * - Date/time selection
 * - Participant management
 * - Price calculation
 * - Payment integration
 * - Form validation
 */

// DOM Elements
const dateInput = document.getElementById('experience-date');
const timeSlotContainer = document.querySelector('.slot-options');
const incrementBtn = document.getElementById('increment');
const decrementBtn = document.getElementById('decrement');
const countInput = document.getElementById('participants-count');
const bookNowBtn = document.querySelector('.book-now-btn');
const priceElements = {
  subtotal: document.getElementById('subtotal'),
  serviceFee: document.getElementById('service-fee'),
  total: document.getElementById('total-price')
};

// Configuration
const CONFIG = {
  basePrice: 1200,
  serviceFeePercentage: 0.1,
  maxParticipants: 8,
  timeSlots: {
    weekday: ['10:00 AM', '2:00 PM', '6:00 PM'],
    weekend: ['9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM']
  }
};

// Initialize Booking System
document.addEventListener('DOMContentLoaded', function() {
  if (!dateInput) return; // Only run on pages with booking form
  
  initDatePicker();
  initTimeSlots();
  initParticipantCounter();
  initPriceCalculator();
  initPaymentHandler();
});

// 1. Date Picker Initialization
function initDatePicker() {
  const today = new Date();
  dateInput.min = today.toISOString().split('T')[0];
  
  // Set default date (next available)
  const nextAvailable = new Date(today);
  nextAvailable.setDate(today.getDate() + 2);
  dateInput.value = nextAvailable.toISOString().split('T')[0];
  
  dateInput.addEventListener('change', updateTimeSlots);
}

// 2. Time Slot Management
function updateTimeSlots() {
  const selectedDate = new Date(dateInput.value);
  const isWeekend = [0, 6].includes(selectedDate.getDay());
  const slots = isWeekend ? CONFIG.timeSlots.weekend : CONFIG.timeSlots.weekday;
  
  timeSlotContainer.innerHTML = '';
  
  slots.forEach(slot => {
    const button = document.createElement('button');
    button.className = 'time-slot';
    button.textContent = slot;
    button.addEventListener('click', handleTimeSlotClick);
    timeSlotContainer.appendChild(button);
  });
  
  // Auto-select first slot
  if (timeSlotContainer.firstChild) {
    timeSlotContainer.firstChild.classList.add('active');
  }
}

function handleTimeSlotClick(e) {
  e.preventDefault();
  document.querySelectorAll('.time-slot').forEach(btn => btn.classList.remove('active'));
  this.classList.add('active');
  updatePrice();
}

// 3. Participant Counter
function initParticipantCounter() {
  incrementBtn.addEventListener('click', () => updateParticipants(1));
  decrementBtn.addEventListener('click', () => updateParticipants(-1));
  countInput.addEventListener('change', validateParticipantCount);
}

function updateParticipants(change) {
  const newValue = parseInt(countInput.value) + change;
  countInput.value = Math.max(1, Math.min(CONFIG.maxParticipants, newValue));
  updatePrice();
}

function validateParticipantCount() {
  let value = parseInt(this.value) || 1;
  this.value = Math.max(1, Math.min(CONFIG.maxParticipants, value));
  updatePrice();
}

// 4. Price Calculation
function initPriceCalculator() {
  updatePrice(); // Initial calculation
}

function updatePrice() {
  const participants = parseInt(countInput.value);
  const subtotal = CONFIG.basePrice * participants;
  const serviceFee = Math.round(subtotal * CONFIG.serviceFeePercentage);
  const total = subtotal + serviceFee;

  priceElements.subtotal.textContent = `₹${subtotal}`;
  priceElements.serviceFee.textContent = `₹${serviceFee}`;
  priceElements.total.textContent = `₹${total}`;
}

// 5. Payment Handling
function initPaymentHandler() {
  bookNowBtn.addEventListener('click', handleBooking);
}

async function handleBooking(e) {
  e.preventDefault();
  
  if (!validateBookingForm()) return;
  
  const bookingData = collectBookingData();
  
  try {
    await processPayment(bookingData);
    redirectToConfirmation(bookingData);
  } catch (error) {
    showError('Payment failed. Please try again.');
    console.error('Booking error:', error);
  }
}

function collectBookingData() {
  return {
    experienceId: new URLSearchParams(window.location.search).get('id'),
    date: dateInput.value,
    time: document.querySelector('.time-slot.active').textContent,
    participants: countInput.value,
    joinAsStranger: document.getElementById('join-stranger').checked,
    total: priceElements.total.textContent
  };
}

async function processPayment(bookingData) {
  // In production, integrate with Razorpay/PayPal here
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(resolve, 1000);
  });
}

function redirectToConfirmation(data) {
  window.location.href = 'booking-confirmation.html?' + new URLSearchParams(data).toString();
}

// Form Validation
function validateBookingForm() {
  let isValid = true;
  const errorElement = document.getElementById('booking-error');
  
  if (!dateInput.value) {
    showError('Please select a date', errorElement);
    isValid = false;
  }
  
  if (!document.querySelector('.time-slot.active')) {
    showError('Please select a time slot', errorElement);
    isValid = false;
  }
  
  return isValid;
}

function showError(message, element) {
  element.textContent = message;
  element.style.display = 'block';
  setTimeout(() => element.style.display = 'none', 5000);
}
function generateCalendarLink(bookingData) {
  const start = new Date(`${bookingData.date}T${convertTo24Hour(bookingData.time)}`);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2 hour duration
  
  return `https://www.google.com/calendar/render?action=TEMPLATE
    &dates=${formatCalendarDate(start)}/${formatCalendarDate(end)}
    &text=${encodeURIComponent('VibeConnect Experience')}
    &details=${encodeURIComponent(`Booking for ${bookingData.participants} participants`)}
    &location=${encodeURIComponent(getVenueLocation(bookingData.experienceId))}`;
}
async function sendConfirmationEmail(bookingData) {
  // In production, integrate with SendGrid/Mailchimp
  const emailPayload = {
    to: 'customer@email.com',
    subject: `Your ${getExperienceName(bookingData.experienceId)} Booking`,
    body: `...`
  };
  // await emailAPI.send(emailPayload);
}
async function checkAvailability(date, time) {
  // In production, check against your database
  const mockAvailability = {
    maxCapacity: 10,
    booked: 3
  };
  return mockAvailability.maxCapacity - mockAvailability.booked;
}
// API Endpoints (Replace with your actual endpoints)
const API_ENDPOINTS = {
  availability: '/api/check-availability',
  createBooking: '/api/bookings',
  payment: '/api/create-payment-intent'
};

async function checkWithServer(date, time) {
  try {
    const response = await fetch(API_ENDPOINTS.availability, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, time })
    });
    return await response.json();
  } catch (error) {
    console.error('Availability check failed:', error);
    return { available: false };
  }
}
function sanitizeInput(input) {
  // Basic XSS protection
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function validateFormData(data) {
  return {
    ...data,
    date: sanitizeInput(data.date),
    participants: Math.max(1, Math.min(8, parseInt(data.participants))),
    experienceId: validExperienceIds.includes(data.experienceId) 
      ? data.experienceId 
      : null
  };
}
function sanitizeInput(input) {
  // Basic XSS protection
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function validateFormData(data) {
  return {
    ...data,
    date: sanitizeInput(data.date),
    participants: Math.max(1, Math.min(8, parseInt(data.participants))),
    experienceId: validExperienceIds.includes(data.experienceId) 
      ? data.experienceId 
      : null
  };
}