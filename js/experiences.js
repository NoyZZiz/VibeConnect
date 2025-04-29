/**
 * VibeConnect Experiences Controller
 * Handles:
 * - Live filtering (city/category/price)
 * - Pagination
 * - Review loading
 * - Backend API integration points
 */

class ExperiencesController {
    constructor() {
      // DOM Elements
      this.filters = {
        city: document.getElementById('exp-city-filter'),
        category: document.getElementById('exp-category-filter'),
        price: document.getElementById('exp-price-filter')
      };
      this.resetBtn = document.getElementById('reset-filters');
      this.experienceContainer = document.getElementById('experience-container');
      this.paginationContainer = document.querySelector('.pagination');
  
      // State
      this.currentPage = 1;
      this.experiences = [];
      this.filteredExperiences = [];
  
      // Init
      this.initEventListeners();
      this.loadExperiences(); // Simulates API call
    }
  
    // =====================
    // 1. INITIALIZATION
    // =====================
    initEventListeners() {
      // Filter changes
      Object.values(this.filters).forEach(filter => {
        filter?.addEventListener('change', () => this.applyFilters());
      });
  
      // Reset filters
      this.resetBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        this.resetFilters();
      });
  
      // Pagination
      this.paginationContainer?.addEventListener('click', (e) => {
        if (e.target.classList.contains('page-btn')) {
          e.preventDefault();
          this.handlePagination(e.target);
        }
      });
    }
  
    // =====================
    // 2. DATA HANDLING
    // =====================
    async loadExperiences() {
      try {
        // Simulated API call - Replace with actual fetch()
        const mockResponse = await this.mockApiCall();
        this.experiences = mockResponse.data;
        this.filteredExperiences = [...this.experiences];
        
        this.renderExperiences();
        this.initReviewCounts(); // Load review counts
      } catch (error) {
        console.error('Failed to load experiences:', error);
        this.showError('Failed to load experiences. Please try again.');
      }
    }
  
    mockApiCall() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            data: [
              {
                id: 'japan-house-delhi',
                title: 'Japanese Tea Ceremony Experience',
                city: 'delhi',
                category: 'tea-ceremony',
                price: 1200,
                rating: 4.8,
                reviewCount: 142,
                duration: '2 hours',
                groupSize: '8 people'
              },
              // Add more mock experiences as needed
            ],
            totalPages: 3
          });
        }, 500);
      });
    }
  
    // =====================
    // 3. FILTERING SYSTEM
    // =====================
    applyFilters() {
      const cityValue = this.filters.city?.value || 'all';
      const categoryValue = this.filters.category?.value || 'all';
      const priceValue = this.filters.price?.value || 'all';
  
      this.filteredExperiences = this.experiences.filter(exp => {
        const cityMatch = cityValue === 'all' || exp.city === cityValue;
        const categoryMatch = categoryValue === 'all' || exp.category === categoryValue;
        const priceMatch = this.checkPriceRange(exp.price, priceValue);
        
        return cityMatch && categoryMatch && priceMatch;
      });
  
      this.currentPage = 1;
      this.renderExperiences();
      this.updateURL();
    }
  
    checkPriceRange(price, range) {
      if (range === 'all') return true;
      
      const [min, max] = range.split('-').map(Number);
      if (range.endsWith('+')) return price >= min;
      return price >= min && price <= max;
    }
  
    resetFilters() {
      Object.values(this.filters).forEach(filter => {
        if (filter) filter.value = 'all';
      });
      this.applyFilters();
    }
  
    // =====================
    // 4. RENDERING
    // =====================
    renderExperiences() {
      if (!this.experienceContainer) return;
  
      // Clear existing
      this.experienceContainer.innerHTML = '';
  
      // Show empty state if no results
      if (this.filteredExperiences.length === 0) {
        this.experienceContainer.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-compass"></i>
            <h3>No experiences found</h3>
            <p>Try adjusting your filters</p>
          </div>
        `;
        return;
      }
  
      // Render filtered experiences
      this.filteredExperiences.forEach(exp => {
        const expCard = this.createExperienceCard(exp);
        this.experienceContainer.appendChild(expCard);
      });
    }
  
    createExperienceCard(experience) {
      const card = document.createElement('div');
      card.className = 'experience-card';
      card.dataset.city = experience.city;
      card.dataset.category = experience.category;
      card.dataset.price = experience.price;
  
      card.innerHTML = `
        <div class="exp-image" style="background-image: url('assets/images/experiences/${experience.id}.jpg')">
          <span class="price-tag">₹${experience.price.toLocaleString('en-IN')}</span>
          ${experience.groupSize ? `<span class="group-tag">Group Experience</span>` : ''}
        </div>
        <div class="exp-content">
          <div class="exp-rating">
            <i class="fas fa-star"></i>
            <span>${experience.rating}</span>
            <span class="review-count">(${experience.reviewCount})</span>
          </div>
          <h3>${experience.title}</h3>
          <p class="exp-location"><i class="fas fa-map-marker-alt"></i> ${this.getLocationName(experience.city)}</p>
          <div class="exp-meta">
            <span><i class="fas fa-clock"></i> ${experience.duration}</span>
            <span><i class="fas fa-users"></i> ${experience.groupSize}</span>
          </div>
          <a href="experience-detail.html?id=${experience.id}" class="book-btn">View Details</a>
        </div>
      `;
  
      return card;
    }
  
    // =====================
    // 5. PAGINATION
    // =====================
    handlePagination(button) {
      if (button.classList.contains('active')) return;
  
      // Update active state
      document.querySelector('.page-btn.active').classList.remove('active');
      button.classList.add('active');
  
      // In a real implementation, this would load new data
      this.currentPage = parseInt(button.textContent);
      console.log(`Loading page ${this.currentPage}`); // Replace with actual API call
    }
  
    // =====================
    // 6. REVIEW SYSTEM
    // =====================
    async initReviewCounts() {
      // Simulate loading review counts from API
      document.querySelectorAll('[data-review-api]').forEach(async (element) => {
        const experienceId = element.getAttribute('data-review-api');
        try {
          const count = await this.fetchReviewCount(experienceId);
          element.textContent = count;
        } catch (error) {
          console.error(`Failed to load reviews for ${experienceId}:`, error);
          element.textContent = '0';
        }
      });
    }
  
    async fetchReviewCount(experienceId) {
      // Simulated API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(Math.floor(Math.random() * 200) + 50); // Random count for demo
        }, 300);
      });
    }
  
    // =====================
    // 7. URL MANAGEMENT
    // =====================
    updateURL() {
      const params = new URLSearchParams();
      
      if (this.filters.city?.value && this.filters.city.value !== 'all') {
        params.set('city', this.filters.city.value);
      }
      
      if (this.filters.category?.value && this.filters.category.value !== 'all') {
        params.set('category', this.filters.category.value);
      }
  
      window.history.replaceState({}, '', `?${params.toString()}`);
    }
  
    // =====================
    // 8. UTILITIES
    // =====================
    getLocationName(cityCode) {
      const locations = {
        delhi: 'Delhi',
        mumbai: 'Mumbai',
        bangalore: 'Bangalore',
        // Add other cities
      };
      return locations[cityCode] || cityCode;
    }
  
    showError(message) {
      const errorElement = document.getElementById('experiences-error') || 
        document.createElement('div');
      
      errorElement.id = 'experiences-error';
      errorElement.className = 'error-message';
      errorElement.textContent = message;
      
      if (!document.getElementById('experiences-error')) {
        this.experienceContainer?.prepend(errorElement);
      }
    }
  }
  
  // Initialize on page load
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('experience-container')) {
      new ExperiencesController();
    }
  });