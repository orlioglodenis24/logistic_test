/**
* TOMIR LOGISTIC S.R.L - Enhanced Website JavaScript
* Professional logistics website with slider, animations, and interactions
*/

class TomirLogisticApp {
   constructor() {
       this.currentSlide = 0;
       this.totalSlides = 0;
       this.sliderInterval = null;
       this.animatedElements = new Set();
       this.isScrolling = false;
       
       this.init();
   }

   init() {
       this.setupEventListeners();
       this.initializeSlider();
       this.setupScrollAnimations();
       this.setupMobileMenu();
       this.setupSmoothScrolling();
       this.setupBackToTop();
       this.setupStatisticsAnimation();
       this.setupContactForm();
       this.setupCertificateViewer();
       this.setupGalleryViewer();
       this.replaceContactForm();
       
       console.log('TOMIR LOGISTIC website initialized successfully');
   }

   setupEventListeners() {
       // Wait for DOM to be fully loaded
       if (document.readyState === 'loading') {
           document.addEventListener('DOMContentLoaded', () => this.init());
           return;
       }

       // Scroll events
       window.addEventListener('scroll', this.throttle(() => {
           this.handleScroll();
       }, 16));

       // Resize events
       window.addEventListener('resize', this.throttle(() => {
           this.handleResize();
       }, 250));

       // Page visibility change
       document.addEventListener('visibilitychange', () => {
           if (document.hidden) {
               this.pauseSlider();
           } else {
               this.resumeSlider();
           }
       });
   }

   // Исправленная инициализация слайдера
initializeSlider() {
    const slides = document.querySelectorAll('.slide');
    const navDots = document.querySelectorAll('.nav-dot');
    const prevButton = document.querySelector('.slider-prev');
    const nextButton = document.querySelector('.slider-next');

    if (!slides.length) return;

    this.totalSlides = slides.length;

    // Убеждаемся что кнопки доступны для клика
    const makeButtonsAccessible = () => {
        [prevButton, nextButton].forEach(button => {
            if (button) {
                button.style.pointerEvents = 'auto';
                button.style.zIndex = '15';
                button.style.position = 'absolute';
            }
        });
        
        navDots.forEach(dot => {
            dot.style.pointerEvents = 'auto';
            dot.style.zIndex = '10';
        });
    };

    makeButtonsAccessible();

    // Set up navigation dots с улучшенной обработкой
    navDots.forEach((dot, index) => {
        // Убираем предыдущие обработчики
        dot.removeEventListener('click', this.dotClickHandler);
        
        // Создаем новый обработчик
        const clickHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.goToSlide(index);
        };
        
        dot.addEventListener('click', clickHandler);
        dot.addEventListener('touchend', clickHandler);
        
        dot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                this.goToSlide(index);
            }
        });
    });

    // Set up arrow navigation с улучшенной обработкой
    if (prevButton) {
        // Убираем предыдущие обработчики
        prevButton.removeEventListener('click', this.prevClickHandler);
        
        const prevClickHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.previousSlide();
        };
        
        prevButton.addEventListener('click', prevClickHandler);
        prevButton.addEventListener('touchend', prevClickHandler);
        
        prevButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                this.previousSlide();
            }
        });
        
        this.prevClickHandler = prevClickHandler;
    }

    if (nextButton) {
        // Убираем предыдущие обработчики
        nextButton.removeEventListener('click', this.nextClickHandler);
        
        const nextClickHandler = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.nextSlide();
        };
        
        nextButton.addEventListener('click', nextClickHandler);
        nextButton.addEventListener('touchend', nextClickHandler);
        
        nextButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                this.nextSlide();
            }
        });
        
        this.nextClickHandler = nextClickHandler;
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (this.isSliderFocused()) {
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    break;
            }
        }
    });

    // Touch/swipe support
    this.setupTouchNavigation();

    // Auto-play slider
    this.startSlider();

    // Pause slider on hover
    const sliderContainer = document.querySelector('.hero-slider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => this.pauseSlider());
        sliderContainer.addEventListener('mouseleave', () => this.resumeSlider());
    }

    // Исправляем проблемы с z-index через небольшую задержку
    setTimeout(() => {
        makeButtonsAccessible();
    }, 100);
}

// Улучшенный метод goToSlide
goToSlide(index) {
    if (index < 0 || index >= this.totalSlides) return;

    const slides = document.querySelectorAll('.slide');
    const navDots = document.querySelectorAll('.nav-dot');

    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    navDots.forEach(dot => {
        dot.classList.remove('active');
        // Принудительно сохраняем круглую форму
        dot.style.borderRadius = '50%';
    });

    // Add active class to current slide and dot
    if (slides[index]) slides[index].classList.add('active');
    if (navDots[index]) {
        navDots[index].classList.add('active');
        navDots[index].style.borderRadius = '50%';
    }

    this.currentSlide = index;

    // Announce slide change for screen readers
    this.announceSlideChange(index);
}

// Добавляем метод для исправления кнопок после изменения DOM
fixSliderButtons() {
    const prevButton = document.querySelector('.slider-prev');
    const nextButton = document.querySelector('.slider-next');
    const navDots = document.querySelectorAll('.nav-dot');

    [prevButton, nextButton].forEach(button => {
        if (button) {
            button.style.pointerEvents = 'auto';
            button.style.zIndex = '15';
            button.style.borderRadius = '50%';
            button.style.position = 'absolute';
        }
    });

    navDots.forEach(dot => {
        dot.style.pointerEvents = 'auto';
        dot.style.zIndex = '10';
        dot.style.borderRadius = '50%';
    });
}

   goToSlide(index) {
       if (index < 0 || index >= this.totalSlides) return;

       const slides = document.querySelectorAll('.slide');
       const navDots = document.querySelectorAll('.nav-dot');

       // Remove active class from all slides and dots
       slides.forEach(slide => slide.classList.remove('active'));
       navDots.forEach(dot => dot.classList.remove('active'));

       // Add active class to current slide and dot
       if (slides[index]) slides[index].classList.add('active');
       if (navDots[index]) navDots[index].classList.add('active');

       this.currentSlide = index;

       // Announce slide change for screen readers
       this.announceSlideChange(index);
   }

   nextSlide() {
       const nextIndex = (this.currentSlide + 1) % this.totalSlides;
       this.goToSlide(nextIndex);
   }

   previousSlide() {
       const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
       this.goToSlide(prevIndex);
   }

   startSlider() {
       this.sliderInterval = setInterval(() => {
           this.nextSlide();
       }, 5000); // Change slide every 5 seconds
   }

   pauseSlider() {
       if (this.sliderInterval) {
           clearInterval(this.sliderInterval);
           this.sliderInterval = null;
       }
   }

   resumeSlider() {
       if (!this.sliderInterval) {
           this.startSlider();
       }
   }

   isSliderFocused() {
       const activeElement = document.activeElement;
       const sliderElements = document.querySelectorAll('.slider-arrow, .nav-dot, .hero-slider');
       return Array.from(sliderElements).some(el => el.contains(activeElement));
   }

   announceSlideChange(index) {
       const announcement = `Slide ${index + 1} of ${this.totalSlides}`;
       const announcer = document.getElementById('slide-announcer') || this.createSlideAnnouncer();
       announcer.textContent = announcement;
   }

   createSlideAnnouncer() {
       const announcer = document.createElement('div');
       announcer.id = 'slide-announcer';
       announcer.setAttribute('aria-live', 'polite');
       announcer.setAttribute('aria-atomic', 'true');
       announcer.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
       document.body.appendChild(announcer);
       return announcer;
   }

   setupTouchNavigation() {
       const slider = document.querySelector('.hero-slider');
       if (!slider) return;

       let startX = 0;
       let startY = 0;
       let endX = 0;
       let endY = 0;

       slider.addEventListener('touchstart', (e) => {
           startX = e.touches[0].clientX;
           startY = e.touches[0].clientY;
       }, { passive: true });

       slider.addEventListener('touchend', (e) => {
           endX = e.changedTouches[0].clientX;
           endY = e.changedTouches[0].clientY;

           const deltaX = endX - startX;
           const deltaY = endY - startY;

           // Check if horizontal swipe is more significant than vertical
           if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
               if (deltaX > 0) {
                   this.previousSlide();
               } else {
                   this.nextSlide();
               }
           }
       }, { passive: true });
   }

   // FIXED Statistics animation - properly handles 24/7 and other non-numeric values
   setupStatisticsAnimation() {
       const statNumbers = document.querySelectorAll('.stat-number');
       
       const animateStatistic = (element) => {
           // Get the original value from data-original attribute
           const originalValue = element.getAttribute('data-original') || element.textContent.trim();
           
           // Check if the value contains numbers that can be animated
           const numericMatch = originalValue.match(/(\d+)/);
           
           if (!numericMatch) {
               // If no numbers found, just display the original value
               element.textContent = originalValue;
               return;
           }
           
           const numericValue = parseInt(numericMatch[1]);
           const prefix = originalValue.substring(0, numericMatch.index);
           const suffix = originalValue.substring(numericMatch.index + numericMatch[1].length);
           
           let current = 0;
           const increment = numericValue / 60; // Animation duration ~1 second at 60fps
           
           const timer = setInterval(() => {
               current += increment;
               if (current >= numericValue) {
                   current = numericValue;
                   clearInterval(timer);
               }
               // Combine prefix + animated number + suffix
               element.textContent = prefix + Math.floor(current) + suffix;
           }, 16);
       };

       // Set up intersection observer for statistics
       const statsObserver = new IntersectionObserver((entries) => {
           entries.forEach(entry => {
               if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                   this.animatedElements.add(entry.target);
                   setTimeout(() => animateStatistic(entry.target), 200);
               }
           });
       }, { threshold: 0.7 });

       statNumbers.forEach(stat => statsObserver.observe(stat));
   }

   // Scroll animations
   setupScrollAnimations() {
       const animationObserver = new IntersectionObserver((entries) => {
           entries.forEach(entry => {
               if (entry.isIntersecting) {
                   entry.target.classList.add('visible');
               }
           });
       }, {
           threshold: 0.1,
           rootMargin: '0px 0px -50px 0px'
       });

       // Add animation classes to elements
       const animationTargets = [
           '.service-card',
           '.task-card',
           '.activity-item',
           '.team-card',
           '.about-features .feature',
           '.why-us-item',
           '.certificate-card',
           '.gallery-item',
           '.partner-item'
       ];

       animationTargets.forEach(selector => {
           document.querySelectorAll(selector).forEach((element, index) => {
               element.classList.add('fade-in');
               element.style.transitionDelay = `${index * 0.1}s`;
               animationObserver.observe(element);
           });
       });
   }

   // Mobile menu
   setupMobileMenu() {
       const mobileToggle = document.querySelector('.mobile-menu-toggle');
       const navMenu = document.querySelector('.nav-menu');

       if (!mobileToggle || !navMenu) return;

       mobileToggle.addEventListener('click', () => {
           const isOpen = navMenu.classList.contains('active');
           
           if (isOpen) {
               this.closeMobileMenu();
           } else {
               this.openMobileMenu();
           }
       });

       // Close menu when clicking outside
       document.addEventListener('click', (e) => {
           if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
               this.closeMobileMenu();
           }
       });

       // Close menu when pressing Escape
       document.addEventListener('keydown', (e) => {
           if (e.key === 'Escape') {
               this.closeMobileMenu();
           }
       });

       // Close menu when clicking nav links
       navMenu.querySelectorAll('a').forEach(link => {
           link.addEventListener('click', () => {
               this.closeMobileMenu();
           });
       });
   }

   openMobileMenu() {
       const mobileToggle = document.querySelector('.mobile-menu-toggle');
       const navMenu = document.querySelector('.nav-menu');

       navMenu.classList.add('active');
       mobileToggle.classList.add('active');
       mobileToggle.setAttribute('aria-expanded', 'true');
       
       // Prevent body scroll
       document.body.style.overflow = 'hidden';
   }

   closeMobileMenu() {
       const mobileToggle = document.querySelector('.mobile-menu-toggle');
       const navMenu = document.querySelector('.nav-menu');

       navMenu.classList.remove('active');
       mobileToggle.classList.remove('active');
       mobileToggle.setAttribute('aria-expanded', 'false');
       
       // Restore body scroll
       document.body.style.overflow = '';
   }

   // Smooth scrolling
   setupSmoothScrolling() {
       document.querySelectorAll('a[href^="#"]').forEach(anchor => {
           anchor.addEventListener('click', (e) => {
               e.preventDefault();
               const targetId = anchor.getAttribute('href');
               const targetElement = document.querySelector(targetId);

               if (targetElement) {
                   const headerHeight = document.querySelector('.header').offsetHeight;
                   const targetPosition = targetElement.offsetTop - headerHeight - 20;

                   window.scrollTo({
                       top: targetPosition,
                       behavior: 'smooth'
                   });

                   // Close mobile menu if open
                   this.closeMobileMenu();
               }
           });
       });
   }

   // Back to top button
   setupBackToTop() {
       const backToTopButton = document.getElementById('backToTop');
       if (!backToTopButton) return;

       backToTopButton.addEventListener('click', () => {
           window.scrollTo({
               top: 0,
               behavior: 'smooth'
           });
       });
   }

   // Contact form setup
   setupContactForm() {
       const contactForm = document.querySelector('.contact-form');
       if (!contactForm) return;

       contactForm.addEventListener('submit', (e) => {
           e.preventDefault();
           this.handleFormSubmit(e);
       });

       // Real-time validation
       const formInputs = contactForm.querySelectorAll('input, textarea, select');
       formInputs.forEach(input => {
           input.addEventListener('blur', () => this.validateField(input));
           input.addEventListener('input', () => this.clearFieldError(input));
       });
   }

   validateField(field) {
       const value = field.value.trim();
       const fieldName = field.name;
       let isValid = true;
       let errorMessage = '';

       // Clear previous errors
       this.clearFieldError(field);

       // Validation rules
       switch (fieldName) {
           case 'name':
               if (!value) {
                   errorMessage = 'Name is required';
                   isValid = false;
               } else if (value.length < 2) {
                   errorMessage = 'Name must be at least 2 characters';
                   isValid = false;
               }
               break;

           case 'email':
               const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
               if (!value) {
                   errorMessage = 'Email is required';
                   isValid = false;
               } else if (!emailRegex.test(value)) {
                   errorMessage = 'Please enter a valid email address';
                   isValid = false;
               }
               break;

           case 'phone':
               const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
               if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
                   errorMessage = 'Please enter a valid phone number';
                   isValid = false;
               }
               break;

           case 'message':
               if (!value) {
                   errorMessage = 'Message is required';
                   isValid = false;
               } else if (value.length < 10) {
                   errorMessage = 'Message must be at least 10 characters';
                   isValid = false;
               }
               break;
       }

       if (!isValid) {
           this.showFieldError(field, errorMessage);
       }

       return isValid;
   }

   showFieldError(field, message) {
       field.style.borderColor = '#ef4444';
       const errorElement = field.parentElement.querySelector('.error-message');
       if (errorElement) {
           errorElement.textContent = message;
           errorElement.style.display = 'block';
       }
   }

   clearFieldError(field) {
       field.style.borderColor = '';
       const errorElement = field.parentElement.querySelector('.error-message');
       if (errorElement) {
           errorElement.textContent = '';
           errorElement.style.display = 'none';
       }
   }

   handleFormSubmit(e) {
       const form = e.target;
       const formData = new FormData(form);
       const formInputs = form.querySelectorAll('input, textarea, select');
       
       let isFormValid = true;

       // Validate all fields
       formInputs.forEach(input => {
           if (!this.validateField(input)) {
               isFormValid = false;
           }
       });

       if (!isFormValid) {
           this.showNotification('Please fix the errors above', 'error');
           return;
       }

       // Show loading state
       const submitButton = form.querySelector('.submit-btn');
       const originalText = submitButton.textContent;
       submitButton.textContent = 'Sending...';
       submitButton.disabled = true;

       // Simulate form submission (replace with actual submission logic)
       setTimeout(() => {
           this.showNotification('Thank you for your message! We will contact you soon.', 'success');
           form.reset();
           submitButton.textContent = originalText;
           submitButton.disabled = false;
       }, 2000);
   }

   showNotification(message, type = 'info') {
       const notification = document.createElement('div');
       notification.className = `notification notification-${type}`;
       notification.style.cssText = `
           position: fixed;
           top: 100px;
           right: 20px;
           background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
           color: white;
           padding: 16px 24px;
           border-radius: 8px;
           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
           z-index: 1000;
           transform: translateX(100%);
           transition: transform 0.3s ease-in-out;
           max-width: 350px;
           font-weight: 500;
       `;
       
       notification.textContent = message;
       document.body.appendChild(notification);

       // Animate in
       requestAnimationFrame(() => {
           notification.style.transform = 'translateX(0)';
       });

       // Remove after 5 seconds
       setTimeout(() => {
           notification.style.transform = 'translateX(100%)';
           setTimeout(() => notification.remove(), 300);
       }, 5000);
   }

   // Certificate functionality
   setupCertificateViewer() {
       // Create certificate click handlers
       window.openCertificate = (url) => {
           this.createCertificateModal(url);
       };

       window.handleCertificateKeydown = (event, url) => {
           if (event.key === 'Enter' || event.key === ' ') {
               event.preventDefault();
               this.createCertificateModal(url);
           }
       };
   }

   createCertificateModal(url) {
       // Create overlay
       const overlay = document.createElement('div');
       overlay.className = 'certificate-modal-overlay';
       overlay.style.cssText = `
           position: fixed;
           top: 0;
           left: 0;
           width: 100%;
           height: 100%;
           background: rgba(0, 0, 0, 0.8);
           display: flex;
           align-items: center;
           justify-content: center;
           z-index: 10000;
           opacity: 0;
           transition: opacity 0.3s ease;
       `;

       // Create modal content
       const modal = document.createElement('div');
       modal.className = 'certificate-modal';
       modal.style.cssText = `
           background: white;
           padding: 20px;
           border-radius: 12px;
           max-width: 90vw;
           max-height: 90vh;
           overflow: auto;
           box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
           transform: scale(0.8);
           transition: transform 0.3s ease;
           position: relative;
       `;

       // Create close button
       const closeButton = document.createElement('button');
       closeButton.innerHTML = '×';
       closeButton.style.cssText = `
           position: absolute;
           top: 10px;
           right: 15px;
           background: none;
           border: none;
           font-size: 24px;
           cursor: pointer;
           color: #666;
           z-index: 10001;
           width: 30px;
           height: 30px;
           display: flex;
           align-items: center;
           justify-content: center;
       `;

       // Create content message
       const content = document.createElement('div');
       content.innerHTML = `
           <div style="text-align: center; padding: 40px 20px;">
               <h3 style="margin-bottom: 20px; color: #f97316;">Certificate Viewing</h3>
               <p style="margin-bottom: 20px; color: #666;">To view the complete certificate, please contact our specialists:</p>
               <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                   <p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:+37378883838" style="color: #f97316; text-decoration: none;">+373-78-883-838</a></p>
                   <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:tomir.logistic09@gmail.com" style="color: #f97316; text-decoration: none;">tomir.logistic09@gmail.com</a></p>
               </div>
               <p style="font-size: 14px; color: #999;">Our documents are in the process of digitization</p>
           </div>
       `;

       modal.appendChild(closeButton);
       modal.appendChild(content);
       overlay.appendChild(modal);
       document.body.appendChild(overlay);

       // Animate in
       requestAnimationFrame(() => {
           overlay.style.opacity = '1';
           modal.style.transform = 'scale(1)';
       });

       // Close handlers
       const closeModal = () => {
           overlay.style.opacity = '0';
           modal.style.transform = 'scale(0.8)';
           setTimeout(() => {
               document.body.removeChild(overlay);
               document.body.style.overflow = '';
           }, 300);
       };

       closeButton.addEventListener('click', closeModal);
       overlay.addEventListener('click', (e) => {
           if (e.target === overlay) closeModal();
       });

       const escapeHandler = (e) => {
           if (e.key === 'Escape') {
               closeModal();
               document.removeEventListener('keydown', escapeHandler);
           }
       };
       document.addEventListener('keydown', escapeHandler);

       // Prevent body scroll
       document.body.style.overflow = 'hidden';
   }

   // Gallery functionality
   setupGalleryViewer() {
       // Gallery images array
       this.galleryImages = [
           'img/груз1jpg.jpg',
           'img/груз2.jpg',
           'img/груз3.jpg',
           'img/груз4.jpg',
           'img/груз5.jpg',
           'img/груз6.jpg'
       ];
       
       this.currentGalleryIndex = 0;

       // Create gallery click handlers
       window.openGalleryImage = (index) => {
           this.openGalleryImage(index);
       };

       window.closeGalleryModal = () => {
           this.closeGalleryModal();
       };

       window.navigateGallery = (direction) => {
           this.navigateGallery(direction);
       };

       // Setup keyboard navigation for gallery
       document.addEventListener('keydown', (e) => {
           const modal = document.getElementById('galleryModal');
           if (modal && modal.style.display === 'flex') {
               switch (e.key) {
                   case 'Escape':
                       this.closeGalleryModal();
                       break;
                   case 'ArrowLeft':
                       this.navigateGallery(-1);
                       break;
                   case 'ArrowRight':
                       this.navigateGallery(1);
                       break;
               }
           }
       });
   }

   openGalleryImage(index) {
       this.currentGalleryIndex = index;
       const modal = document.getElementById('galleryModal');
       const modalImage = document.getElementById('galleryModalImage');
       
       if (modal && modalImage) {
           modal.style.display = 'flex';
           modalImage.src = this.galleryImages[index];
           modalImage.alt = `Gallery image ${index + 1}`;
           document.body.style.overflow = 'hidden';
       }
   }

   closeGalleryModal() {
       const modal = document.getElementById('galleryModal');
       if (modal) {
           modal.style.display = 'none';
           document.body.style.overflow = '';
       }
   }

   navigateGallery(direction) {
       this.currentGalleryIndex += direction;
       
       if (this.currentGalleryIndex >= this.galleryImages.length) {
           this.currentGalleryIndex = 0;
       } else if (this.currentGalleryIndex < 0) {
           this.currentGalleryIndex = this.galleryImages.length - 1;
       }
       
       const modalImage = document.getElementById('galleryModalImage');
       if (modalImage) {
           modalImage.src = this.galleryImages[this.currentGalleryIndex];
           modalImage.alt = `Gallery image ${this.currentGalleryIndex + 1}`;
       }
   }

   replaceContactForm() {
       const contactForm = document.querySelector('.contact-form');
       if (!contactForm) return;

       // Находим родительский контейнер
       const contactContent = document.querySelector('.contact-content');
       if (!contactContent) return;

       // Добавляем класс для центрирования
       contactContent.classList.add('replaced');
       
       // Очищаем весь контейнер
       contactContent.innerHTML = '';

       // Create contact information card с поддержкой переводов
       const contactInfo = document.createElement('div');
       contactInfo.className = 'contact-info-card';
       
       // Используем структуру с data-translate атрибутами
       contactInfo.innerHTML = `
           <div class="contact-card-header">
               <h3 data-translate="contact_direct_title">Contact Us Directly</h3>
               <p data-translate="contact_direct_subtitle">We are ready to discuss your logistics needs and provide professional solutions</p>
           </div>
           
           <div class="contact-methods">
               <div class="contact-method">
                   <div class="contact-method-icon">📞</div>
                   <div class="contact-method-content">
                       <h4 data-translate="contact_call_now">Call Now</h4>
                       <p data-translate="contact_hours_short">Mon-Fri: 9:00-18:00, Sat: 9:00-14:00</p>
                       <a href="tel:+37378883838" class="contact-action-btn phone-btn">
                           📞 +373-78-883-838
                       </a>
                   </div>
               </div>
               
               <div class="contact-method">
                   <div class="contact-method-icon">📍</div>
                   <div class="contact-method-content">
                       <h4 data-translate="contact_visit_office">Visit Office</h4>
                       <p class="office-address" data-translate="location_address">str. Columna, 49, of. 8<br>Chișinău, MD-2001, Moldova</p>
                       <a href="#" class="contact-action-btn location-btn" onclick="window.open('https://maps.google.com/?q=47.0105,28.8574', '_blank')">
                           📍 <span data-translate="contact_show_map">Show on Map</span>
                       </a>
                   </div>
               </div>
           </div>
           
           <div class="contact-card-footer">
               <p><strong data-translate="contact_free_consultation">Get Free Consultation</strong></p>
               <p data-translate="contact_services_list">Shipping Cost Calculation • Route Planning • Customs Clearance</p>
           </div>
       `;

       // Добавляем карточку в контейнер
       contactContent.appendChild(contactInfo);

       // ВАЖНО: Применяем переводы к новым элементам
       if (window.translationManager) {
           window.translationManager.applyTranslations();
       }

       // Применяем стили центрирования после добавления в DOM
       this.applyContactCardCentering();
       
       // Добавляем обработчик изменения размера экрана
       this.setupContactCardResize();
   }

   // Улучшенный метод для центрирования
   applyContactCardCentering() {
       const contactSection = document.querySelector('#contact');
       const contactContent = document.querySelector('.contact-content');
       const contactCard = document.querySelector('.contact-info-card');
       
       if (contactSection) {
           contactSection.style.cssText += `
               display: flex !important;
               flex-direction: column !important;
               align-items: center !important;
               justify-content: center !important;
               min-height: 500px !important;
               padding: 60px 0 !important;
           `;
       }
       
       if (contactContent) {
           contactContent.style.cssText += `
               display: flex !important;
               justify-content: center !important;
               align-items: center !important;
               width: 100% !important;
               grid-template-columns: none !important;
               gap: 0 !important;
               margin: 0 auto !important;
           `;
       }
       
       if (contactCard) {
           contactCard.style.cssText += `
               margin: 0 auto !important;
               width: 100% !important;
               max-width: 600px !important;
               position: relative !important;
           `;
       }
   }

   // Новый метод для обработки изменения размеров
   setupContactCardResize() {
       let resizeTimeout;
       
       const handleContactResize = () => {
           clearTimeout(resizeTimeout);
           resizeTimeout = setTimeout(() => {
               this.applyContactCardCentering();
               
               // Дополнительная проверка для contact-method элементов
               const contactMethods = document.querySelectorAll('.contact-method');
               contactMethods.forEach((method, index) => {
                   // Убираем любые инлайн стили которые могут "плыть"
                   method.style.cssText = '';
                   
                   // Добавляем небольшую задержку для предотвращения скачков
                   setTimeout(() => {
                       method.style.opacity = '1';
                       method.style.transform = 'translateY(0)';
                   }, index * 50);
               });
           }, 100);
       };
       
       // Слушаем изменения размера экрана
       window.addEventListener('resize', handleContactResize);
       
       // Слушаем изменения ориентации на мобильных устройствах
       window.addEventListener('orientationchange', () => {
           setTimeout(handleContactResize, 200);
       });
   }

   // Обновленный handleResize
   handleResize() {
       // Close mobile menu on resize to desktop
       if (window.innerWidth > 768) {
           this.closeMobileMenu();
       }
       
       // Reapply contact card centering on resize
       if (document.querySelector('.contact-info-card')) {
           this.applyContactCardCentering();
       }
   }

   // Scroll handler
   handleScroll() {
       this.updateHeaderOnScroll();
       this.updateBackToTopVisibility();
   }

   updateHeaderOnScroll() {
       const header = document.querySelector('.header');
       if (!header) return;

       if (window.scrollY > 100) {
           header.style.background = 'rgba(255, 255, 255, 0.98)';
           header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
       } else {
           header.style.background = 'rgba(255, 255, 255, 0.95)';
           header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
       }
   }

   updateBackToTopVisibility() {
       const backToTopButton = document.getElementById('backToTop');
       if (!backToTopButton) return;

       if (window.scrollY > 300) {
           backToTopButton.style.display = 'flex';
       } else {
           backToTopButton.style.display = 'none';
       }
   }

   // Utility functions
   throttle(func, limit) {
       let inThrottle;
       return function() {
           const args = arguments;
           const context = this;
           if (!inThrottle) {
               func.apply(context, args);
               inThrottle = true;
               setTimeout(() => inThrottle = false, limit);
           }
       }
   }

   debounce(func, wait) {
       let timeout;
       return function() {
           const context = this;
           const args = arguments;
           clearTimeout(timeout);
           timeout = setTimeout(() => func.apply(context, args), wait);
       };
   }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
   window.tomirApp = new TomirLogisticApp();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
   module.exports = TomirLogisticApp;
}

