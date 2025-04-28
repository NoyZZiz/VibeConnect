// Experiences Page Specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters for filtering
    const urlParams = new URLSearchParams(window.location.search);
    const cityParam = urlParams.get('city');
    const categoryParam = urlParams.get('category');
    
    // Set initial filter values if they exist in URL
    const cityFilter = document.getElementById('exp-city-filter');
    const categoryFilter = document.getElementById('exp-category-filter');
    const priceFilter = document.getElementById('exp-price-filter');
    const resetBtn = document.getElementById('reset-filters');
    
    if (cityParam && cityFilter) {
        cityFilter.value = cityParam;
    }
    
    if (categoryParam && categoryFilter) {
        categoryFilter.value = categoryParam;
    }
    
    // Filter functionality
    function filterExperiences() {
        const cityValue = cityFilter ? cityFilter.value : 'all';
        const categoryValue = categoryFilter ? categoryFilter.value : 'all';
        const priceValue = priceFilter ? priceFilter.value : 'all';
        
        const experienceCards = document.querySelectorAll('.experience-card');
        
        experienceCards.forEach(card => {
            const cardCity = card.getAttribute('data-city');
            const cardCategory = card.getAttribute('data-category');
            const cardPrice = parseInt(card.getAttribute('data-price'));
            
            const cityMatch = cityValue === 'all' || cardCity === cityValue;
            const categoryMatch = categoryValue === 'all' || cardCategory === categoryValue;
            let priceMatch = true;
            
            if (priceValue !== 'all') {
                if (priceValue === '0-500') {
                    priceMatch = cardPrice <= 500;
                } else if (priceValue === '500-1000') {
                    priceMatch = cardPrice > 500 && cardPrice <= 1000;
                } else if (priceValue === '1000-1500') {
                    priceMatch = cardPrice > 1000 && cardPrice <= 1500;
                } else if (priceValue === '1500+') {
                    priceMatch = cardPrice > 1500;
                }
            }
            
            if (cityMatch && categoryMatch && priceMatch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Event listeners for filters
    if (cityFilter) cityFilter.addEventListener('change', filterExperiences);
    if (categoryFilter) categoryFilter.addEventListener('change', filterExperiences);
    if (priceFilter) priceFilter.addEventListener('change', filterExperiences);
    
    // Reset filters
    if (resetBtn) {
        resetBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (cityFilter) cityFilter.value = 'all';
            if (categoryFilter) categoryFilter.value = 'all';
            if (priceFilter) priceFilter.value = 'all';
            filterExperiences();
        });
    }
    
    // Initialize filtering
    filterExperiences();
    
    // Pagination functionality
    const pageBtns = document.querySelectorAll('.page-btn:not(.disabled)');
    
    pageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('active')) return;
            
            document.querySelector('.page-btn.active').classList.remove('active');
            this.classList.add('active');
            
            // Here you would typically load new content via AJAX
            // For this example, we'll just simulate it
            console.log(`Loading page ${this.textContent}`);
        });
    });
});