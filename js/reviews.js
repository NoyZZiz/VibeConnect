/**
 * Review Management System
 */
class ReviewSystem {
  constructor() {
    this.reviewForm = document.getElementById('review-form');
    this.reviewsContainer = document.getElementById('reviews-container');
    this.init();
  }

  init() {
    if (this.reviewForm) {
      this.reviewForm.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    this.loadReviews();
  }

  async loadReviews() {
    try {
      // Replace with actual API call
      const reviews = await this.fetchReviews();
      this.renderReviews(reviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  }

  renderReviews(reviews) {
    this.reviewsContainer.innerHTML = reviews.map(review => `
      <div class="review">
        <div class="review-header">
          <div class="review-author">${review.author}</div>
          <div class="review-rating">
            ${this.renderStars(review.rating)}
          </div>
        </div>
        <div class="review-content">${review.content}</div>
      </div>
    `).join('');
  }

  renderStars(rating) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  async handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(this.reviewForm);
    
    try {
      // Replace with actual API call
      await this.submitReview(formData);
      this.loadReviews();
      this.reviewForm.reset();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  }

  // Mock API methods - Replace with real implementations
  async fetchReviews() {
    return [
      { author: "Cultural Explorer", rating: 5, content: "Amazing experience!" }
    ];
  }

  async submitReview(data) {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Initialize on pages with reviews
if (document.getElementById('review-form')) {
  new ReviewSystem();
}