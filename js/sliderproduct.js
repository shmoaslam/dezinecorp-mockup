// JavaScript Document


class ProductSlider {
    constructor() {
        this.track = document.getElementById('productTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicatorsContainer = document.getElementById('sliderIndicators');
        
        this.currentIndex = 0;
        this.itemsPerView = 4;
        this.totalItems = document.querySelectorAll('.product-item').length;
        this.maxIndex = Math.max(0, this.totalItems - this.itemsPerView);
        
        this.init();
    }
    
    init() {
        this.updateItemsPerView();
        this.createIndicators();
        this.attachEventListeners();
        this.updateSlider();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.updateItemsPerView();
            this.updateSlider();
        });
    }
    
    updateItemsPerView() {
        const containerWidth = window.innerWidth;
        
        if (containerWidth <= 576) {
            this.itemsPerView = 1;
        } else if (containerWidth <= 768) {
            this.itemsPerView = 2;
        } else if (containerWidth <= 992) {
            this.itemsPerView = 3;
        } else {
            this.itemsPerView = 4;
        }
        
        this.maxIndex = Math.max(0, this.totalItems - this.itemsPerView);
        
        // Adjust current index if needed
        if (this.currentIndex > this.maxIndex) {
            this.currentIndex = this.maxIndex;
        }
    }
    
    createIndicators() {
        this.indicatorsContainer.innerHTML = '';
        const indicatorCount = Math.ceil(this.totalItems / this.itemsPerView);
        
        for (let i = 0; i <= this.maxIndex; i++) {
            const indicator = document.createElement('span');
            indicator.className = 'indicator';
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicatorsContainer.appendChild(indicator);
        }
    }
    
    attachEventListeners() {
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Touch/swipe support
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });
        
        this.track.addEventListener('touchend', () => {
            if (!isDragging) return;
            
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            isDragging = false;
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
    }
    
    updateSlider() {
        const translateX = -(this.currentIndex * (100 / this.itemsPerView));
        this.track.style.transform = `translateX(${translateX}%)`;
        
        // Update button states
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex >= this.maxIndex;
        
        // Update indicators
        const indicators = this.indicatorsContainer.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    nextSlide() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
            this.updateSlider();
        }
    }
    
    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateSlider();
        }
    }
    
    goToSlide(index) {
        if (index >= 0 && index <= this.maxIndex) {
            this.currentIndex = index;
            this.updateSlider();
        }
    }
}

// Initialize the slider when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new ProductSlider();
});

// Auto-play functionality (optional)
class AutoPlaySlider extends ProductSlider {
    constructor() {
        super();
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 seconds
        this.startAutoPlay();
        this.handleAutoPlayEvents();
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            if (this.currentIndex >= this.maxIndex) {
                this.currentIndex = 0;
            } else {
                this.currentIndex++;
            }
            this.updateSlider();
        }, this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    handleAutoPlayEvents() {
        const container = document.querySelector('.product-slider-container');
        
        container.addEventListener('mouseenter', () => this.stopAutoPlay());
        container.addEventListener('mouseleave', () => this.startAutoPlay());
        
        // Stop auto-play when user interacts with slider
        this.prevBtn.addEventListener('click', () => {
            this.stopAutoPlay();
            setTimeout(() => this.startAutoPlay(), this.autoPlayDelay);
        });
        
        this.nextBtn.addEventListener('click', () => {
            this.stopAutoPlay();
            setTimeout(() => this.startAutoPlay(), this.autoPlayDelay);
        });
    }
}

// Uncomment the line below to enable auto-play
// document.addEventListener('DOMContentLoaded', function() {
//     new AutoPlaySlider();
// });
