// Hero slider functionality
export function setupHeroSlider() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    const slides = heroSection.querySelectorAll('.hero-slide');
    const dots = heroSection.querySelectorAll('.hero-dot');
    const prevBtn = heroSection.querySelector('.hero-prev-btn');
    const nextBtn = heroSection.querySelector('.hero-next-btn');
    
    let currentSlide = 0;
    let slideInterval;
    const autoPlayDelay = 5000;
    
    const showSlide = (index) => {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      slides[index].classList.add('active');
      dots[index].classList.add('active');
      
      currentSlide = index;
    };
    
    const nextSlide = () => {
      const newIndex = (currentSlide + 1) % slides.length;
      showSlide(newIndex);
    };
    
    const prevSlide = () => {
      const newIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
      showSlide(newIndex);
    };
    
    const startAutoPlay = () => {
      if (slideInterval) clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, autoPlayDelay);
    };
    
    const resetAutoPlay = () => {
      clearInterval(slideInterval);
      startAutoPlay();
    };
    
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoPlay();
    });
    
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoPlay();
    });
    
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
        resetAutoPlay();
      });
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        resetAutoPlay();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        resetAutoPlay();
      }
    });
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    heroSection.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    heroSection.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      
      const swipeThreshold = 50;
      if (touchEndX - touchStartX > swipeThreshold) {
        prevSlide();
        resetAutoPlay();
      } else if (touchStartX - touchEndX > swipeThreshold) {
        nextSlide();
        resetAutoPlay();
      }
    }, { passive: true });
    
    heroSection.addEventListener('mouseenter', () => clearInterval(slideInterval));
    heroSection.addEventListener('mouseleave', startAutoPlay);
    
    window.heroSlider = {
      next: nextSlide,
      prev: prevSlide,
      goTo: (index) => {
        showSlide(index);
        resetAutoPlay();
      },
      create: (slidesData) => console.log('Creating slider with data:', slidesData)
    };
    
    startAutoPlay();
}

// slider.js - Handles the price range slider functionality
export function initPriceSlider() {
  const priceSlider = document.querySelector('.price-slider');
  if (!priceSlider) return;
  
  const minThumb = document.querySelector('.price-slider__thumb[data-value="min"]');
  const maxThumb = document.querySelector('.price-slider__thumb[data-value="max"]');
  const range = document.querySelector('.price-slider__range');
  const minPrice = document.querySelector('.price-min');
  const maxPrice = document.querySelector('.price-max');
  
  let isDragging = false;
  let currentThumb = null;
  let startX = 0;
  let startLeft = 0;
  
  const minValue = 0;
  const maxValue = 200;
  let currentMinValue = minValue;
  let currentMaxValue = maxValue;
  
  function updatePriceRange() {
    const track = priceSlider.querySelector('.price-slider__track');
    const trackWidth = track.offsetWidth;
    
    const minPercent = ((currentMinValue - minValue) / (maxValue - minValue)) * 100;
    const maxPercent = ((currentMaxValue - minValue) / (maxValue - minValue)) * 100;
    
    minThumb.style.left = `${minPercent}%`;
    maxThumb.style.left = `${maxPercent}%`;
    
    range.style.left = `${minPercent}%`;
    range.style.right = `${100 - maxPercent}%`;
    
    minPrice.textContent = `$${currentMinValue.toFixed(2)}`;
    maxPrice.textContent = `$${currentMaxValue.toFixed(2)}`;
  }
  
  function startDrag(e, thumb) {
    e.preventDefault();
    isDragging = true;
    currentThumb = thumb;
    
    startX = e.clientX || e.touches[0].clientX;
    startLeft = parseFloat(currentThumb.style.left) || 
                (currentThumb.dataset.value === 'min' ? 0 : 100);
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
  }
  
  function drag(e) {
    if (!isDragging) return;
    
    const track = priceSlider.querySelector('.price-slider__track');
    const trackRect = track.getBoundingClientRect();
    const trackWidth = trackRect.width;
    
    const clientX = e.clientX || e.touches[0].clientX;
    const deltaX = clientX - startX;
    const deltaPercent = (deltaX / trackWidth) * 100;
    let newLeft = startLeft + deltaPercent;
    
    // Constrain to track bounds
    newLeft = Math.max(0, Math.min(100, newLeft));
    
    // Prevent thumbs from crossing
    if (currentThumb.dataset.value === 'min') {
      const maxLeft = parseFloat(maxThumb.style.left) || 100;
      newLeft = Math.min(newLeft, maxLeft - 5);
      currentMinValue = minValue + (newLeft / 100) * (maxValue - minValue);
    } else {
      const minLeft = parseFloat(minThumb.style.left) || 0;
      newLeft = Math.max(newLeft, minLeft + 5);
      currentMaxValue = minValue + (newLeft / 100) * (maxValue - minValue);
    }
    
    currentThumb.style.left = `${newLeft}%`;
    updatePriceRange();
  }
  
  function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchend', stopDrag);
  }
  
  // Add event listeners for thumbs
  minThumb.addEventListener('mousedown', e => startDrag(e, minThumb));
  minThumb.addEventListener('touchstart', e => startDrag(e, minThumb));
  maxThumb.addEventListener('mousedown', e => startDrag(e, maxThumb));
  maxThumb.addEventListener('touchstart', e => startDrag(e, maxThumb));
  
  // Initialize price slider
  updatePriceRange();
}