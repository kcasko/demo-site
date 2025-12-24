// Load configuration and populate the page
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('config.json');
        const config = await response.json();
        populatePage(config);
    } catch (error) {
        console.error('Error loading configuration:', error);
    }
});

function populatePage(config) {
    // Apply theme colors
    if (config.theme) {
        document.documentElement.style.setProperty('--primary-color', config.theme.primaryColor);
        document.documentElement.style.setProperty('--secondary-color', config.theme.secondaryColor);
        document.documentElement.style.setProperty('--accent-color', config.theme.accentColor);
    }

    // Page title
    document.getElementById('page-title').textContent = config.businessName;
    
    // Navigation
    document.getElementById('nav-logo').textContent = config.businessName;

    // Hero section
    document.getElementById('hero-title').textContent = config.businessName;
    document.getElementById('hero-tagline').textContent = config.tagline;

    // About section
    if (config.about) {
        document.getElementById('about-title').textContent = config.about.title;
        document.getElementById('about-description').textContent = config.about.description;
    }

    // Services section
    populateServices(config.services);

    // Hours section
    populateHours(config.hours);

    // Gallery section
    populateGallery(config.gallery);

    // Testimonials section
    populateTestimonials(config.testimonials);

    // Google Maps
    populateMap(config.googleMapsEmbed);

    // Contact section
    populateContact(config);

    // Footer
    const currentYear = new Date().getFullYear();
    document.getElementById('footer-business').textContent = `© ${currentYear} ${config.businessName}. All rights reserved.`;
    document.getElementById('footer-tagline').textContent = config.tagline;

    // Initialize navigation toggle
    initNavToggle();

    // Initialize contact form
    initContactForm(config);

    // Initialize gallery lightbox
    initLightbox();
}

function populateServices(services) {
    const grid = document.getElementById('services-grid');
    if (!services || !grid) return;

    grid.innerHTML = services.map(service => `
        <div class="service-card">
            <span class="service-icon">${service.icon}</span>
            <h3>${service.name}</h3>
            <p>${service.description}</p>
        </div>
    `).join('');
}

function populateHours(hours) {
    const table = document.getElementById('hours-table');
    if (!hours || !table) return;

    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];

    table.innerHTML = Object.entries(hours).map(([day, time]) => `
        <tr class="${day === today ? 'today' : ''}">
            <td>${day}</td>
            <td>${time}</td>
        </tr>
    `).join('');
}

function populateGallery(gallery) {
    const grid = document.getElementById('gallery-grid');
    const titleEl = document.getElementById('gallery-title');
    if (!gallery || !grid) return;

    if (titleEl && gallery.title) {
        titleEl.textContent = gallery.title;
    }

    grid.innerHTML = gallery.images.map((image, index) => `
        <div class="gallery-item" data-index="${index}">
            <img src="${image.url}" alt="${image.caption}" loading="lazy">
            <div class="gallery-caption">${image.caption}</div>
        </div>
    `).join('');

    // Add lightbox to DOM
    if (!document.getElementById('lightbox')) {
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <button class="lightbox-close" aria-label="Close">&times;</button>
            <button class="lightbox-nav lightbox-prev" aria-label="Previous">&#10094;</button>
            <div class="lightbox-content">
                <img src="" alt="">
                <div class="lightbox-caption"></div>
            </div>
            <button class="lightbox-nav lightbox-next" aria-label="Next">&#10095;</button>
        `;
        document.body.appendChild(lightbox);
    }
}

function populateMap(mapUrl) {
    const mapFrame = document.getElementById('google-map');
    if (mapFrame && mapUrl) {
        mapFrame.src = mapUrl;
    }
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (!lightbox || !galleryItems.length) return;

    let currentIndex = 0;
    const images = Array.from(galleryItems).map(item => ({
        url: item.querySelector('img').src,
        caption: item.querySelector('.gallery-caption').textContent
    }));

    const lightboxImg = lightbox.querySelector('.lightbox-content img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');

    function showImage(index) {
        currentIndex = (index + images.length) % images.length;
        lightboxImg.src = images[currentIndex].url;
        lightboxCaption.textContent = images[currentIndex].caption;
    }

    function openLightbox(index) {
        showImage(index);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showImage(currentIndex - 1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => showImage(currentIndex + 1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    });
}

function populateTestimonials(testimonials) {
    const grid = document.getElementById('testimonials-grid');
    if (!testimonials || !grid) return;

    grid.innerHTML = testimonials.map(testimonial => `
        <div class="testimonial-card">
            <p class="testimonial-text">${testimonial.text}</p>
            <div class="testimonial-author">
                <div class="testimonial-author-avatar">${testimonial.name.charAt(0)}</div>
                <div class="testimonial-author-info">
                    <h4>${testimonial.name}</h4>
                    <div class="testimonial-rating">${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function populateContact(config) {
    // Address
    const address = config.address;
    if (address) {
        document.getElementById('contact-address').innerHTML = 
            `${address.street}<br>${address.city}, ${address.state} ${address.zip}`;
    }

    // Phone
    const phoneEl = document.getElementById('contact-phone');
    phoneEl.textContent = config.phone;
    phoneEl.href = `tel:${config.phone.replace(/[^\d]/g, '')}`;

    // Email
    const emailEl = document.getElementById('contact-email');
    emailEl.textContent = config.email;
    emailEl.href = `mailto:${config.email}`;

    // Social links
    const socialContainer = document.getElementById('social-links');
    if (config.socialMedia && socialContainer) {
        let socialHTML = '';
        
        if (config.socialMedia.facebook) {
            socialHTML += `<a href="${config.socialMedia.facebook}" class="social-link" target="_blank" rel="noopener" aria-label="Facebook">📘</a>`;
        }
        if (config.socialMedia.instagram) {
            socialHTML += `<a href="${config.socialMedia.instagram}" class="social-link" target="_blank" rel="noopener" aria-label="Instagram">📷</a>`;
        }
        if (config.socialMedia.twitter) {
            socialHTML += `<a href="${config.socialMedia.twitter}" class="social-link" target="_blank" rel="noopener" aria-label="Twitter">🐦</a>`;
        }
        
        socialContainer.innerHTML = socialHTML;
    }
}

function initNavToggle() {
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
}

function initContactForm(config) {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Opens email client with pre-filled data
        const subject = encodeURIComponent(`Website Contact from ${data.name}`);
        const body = encodeURIComponent(
            `Name: ${data.name}\n` +
            `Email: ${data.email}\n` +
            `Phone: ${data.phone || 'Not provided'}\n\n` +
            `Message:\n${data.message}`
        );
        
        window.location.href = `mailto:${config.email}?subject=${subject}&body=${body}`;
        
        alert('Opening your email client to send the message. If it doesn\'t open, please email us directly at ' + config.email);
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
