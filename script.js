// ============================================
// DOM Elements
// ============================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const categoryBtns = document.querySelectorAll('.category-btn');
const menuItems = document.querySelectorAll('.menu-item');
const seeMoreBtn = document.getElementById('seeMoreBtn');

// ============================================
// Menu Visibility Variables
// ============================================
const ITEMS_PER_PAGE = 12; // Show 12 items initially and load 12 more each time
let currentVisibleCount = ITEMS_PER_PAGE;
let allExpanded = false;

// Function to update menu visibility
function updateMenuVisibility() {
    const activeCategory = document.querySelector('.category-btn.active').getAttribute('data-category');
    
    // First, hide ALL menu items
    menuItems.forEach(item => {
        item.style.display = 'none';
    });
    
    // Filter relevant items based on category
    let relevantItems;
    if (activeCategory === 'all') {
        relevantItems = Array.from(menuItems);
    } else {
        relevantItems = Array.from(menuItems).filter(item => 
            item.getAttribute('data-category') === activeCategory
        );
    }
    
    const totalItems = relevantItems.length;
    
    // Show only the relevant items based on currentVisibleCount
    relevantItems.forEach((item, index) => {
        if (index < currentVisibleCount) {
            item.style.display = 'flex';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }
    });
    
    // Update button
    const hiddenCount = totalItems - currentVisibleCount;
    const btnText = seeMoreBtn.querySelector('.btn-text');
    const itemCount = seeMoreBtn.querySelector('.item-count');
    
    if (currentVisibleCount >= totalItems) {
        // All items shown
        btnText.textContent = 'Show Less';
        itemCount.textContent = '';
        allExpanded = true;
    } else {
        // More items to show
        btnText.textContent = 'See More Items';
        itemCount.textContent = `(+${hiddenCount} more)`;
        allExpanded = false;
    }
    
    // Hide button if there are 12 or fewer items total
    if (totalItems <= ITEMS_PER_PAGE) {
        seeMoreBtn.style.display = 'none';
    } else {
        seeMoreBtn.style.display = 'inline-block';
    }
}

// ============================================
// Mobile Navigation Toggle
// ============================================
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger icon
    const spans = hamburger.querySelectorAll('span');
    spans.forEach((span, index) => {
        if (navMenu.classList.contains('active')) {
            if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) span.style.opacity = '0';
            if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            span.style.transform = 'none';
            span.style.opacity = '1';
        }
    });
});

// Close mobile menu when clicking on a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
    });
});

// ============================================
// Navbar Scroll Effect
// ============================================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow on scroll
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// ============================================
// Menu Filter Functionality
// ============================================
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryBtns.forEach(button => button.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Reset "See More" functionality when switching categories
        currentVisibleCount = ITEMS_PER_PAGE;
        allExpanded = false;
        
        // Update menu visibility immediately with new filter
        updateMenuVisibility();
    });
});

// Mobile no longer needs click handlers - prices are shown directly on cards

// ============================================
// Smooth Scrolling for Navigation Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Active Navigation Link on Scroll
// ============================================
const sections = document.querySelectorAll('section[id]');

function setActiveNav() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector(`.nav-link[href*=${sectionId}]`)?.classList.add('active');
        } else {
            document.querySelector(`.nav-link[href*=${sectionId}]`)?.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', setActiveNav);

// ============================================
// Intersection Observer for Animations
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature, .contact-item, .announcement-card, .gallery-item, .package-card, .menu-item').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ============================================
// Gallery Modal/Lightbox Functionality
// ============================================
const modal = document.getElementById('galleryModal');
const modalClose = document.querySelector('.modal-close');
const modalPrev = document.querySelector('.modal-prev');
const modalNext = document.querySelector('.modal-next');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const galleryItems = document.querySelectorAll('.masonry-gallery .gallery-item');

let currentGalleryIndex = 0;
const galleryItemsArray = Array.from(galleryItems);

function openModal(index) {
    currentGalleryIndex = index;
    const item = galleryItemsArray[index];
    const info = item.querySelector('.gallery-info');
    const isVideo = item.getAttribute('data-type') === 'video';
    
    // Get title and description
    const title = info.querySelector('h4').textContent;
    const description = info.querySelector('p').textContent;
    
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

function showPrevious() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryItemsArray.length) % galleryItemsArray.length;
    openModal(currentGalleryIndex);
}

function showNext() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryItemsArray.length;
    openModal(currentGalleryIndex);
}

// Gallery item click handlers
galleryItems.forEach((item, index) => {
    item.addEventListener('click', function() {
        openModal(index);
    });
});

// Close button
modalClose.addEventListener('click', closeModal);

// Navigation buttons
modalPrev.addEventListener('click', showPrevious);
modalNext.addEventListener('click', showNext);

// Close on background click
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (!modal.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
        closeModal();
    } else if (e.key === 'ArrowLeft') {
        showPrevious();
    } else if (e.key === 'ArrowRight') {
        showNext();
    }
});

// ============================================
// Event Package Booking Buttons
// ============================================
const packageBtns = document.querySelectorAll('.package-btn');

packageBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const packageName = this.parentElement.querySelector('h3').textContent;
        const whatsappNumber = '919173515648';
        const message = encodeURIComponent(`Hi! I'm interested in the ${packageName}. Can you provide more details?`);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
        
        window.open(whatsappUrl, '_blank');
    });
});

// ============================================
// Page Load Animation
// ============================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ============================================
// Dynamic Year in Footer
// ============================================
const currentYear = new Date().getFullYear();
const footerText = document.querySelector('.footer-bottom p');
if (footerText) {
    footerText.textContent = `© ${currentYear} Cafe O'Clock. All rights reserved.`;
}

// ============================================
// Parallax Effect for Hero Section
// ============================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero && scrolled < hero.offsetHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ============================================
// See More/Less Button Click Handler
// ============================================
seeMoreBtn.addEventListener('click', function() {
    const activeCategory = document.querySelector('.category-btn.active').getAttribute('data-category');
    let relevantItems;
    
    if (activeCategory === 'all') {
        relevantItems = Array.from(menuItems);
    } else {
        relevantItems = Array.from(menuItems).filter(item => 
            item.getAttribute('data-category') === activeCategory
        );
    }
    
    if (allExpanded) {
        // Collapse back to initial view
        currentVisibleCount = ITEMS_PER_PAGE;
        updateMenuVisibility();
        
        // Scroll back to menu section
        document.querySelector('#menu').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        // Expand to show more items
        currentVisibleCount += ITEMS_PER_PAGE;
        updateMenuVisibility();
    }
});

// Initialize menu visibility on page load
updateMenuVisibility();

// ============================================
// Announcements See More/Less Functionality
// ============================================
const seeMoreAnnouncementsBtn = document.getElementById('seeMoreAnnouncementsBtn');
const announcementCards = document.querySelectorAll('.announcement-card');
const ANNOUNCEMENTS_INITIAL_COUNT = 3;
let announcementsExpanded = false;

function updateAnnouncementsVisibility() {
    const totalAnnouncements = announcementCards.length;
    
    // Show/hide announcements based on state with fade effect
    announcementCards.forEach((card, index) => {
        if (announcementsExpanded || index < ANNOUNCEMENTS_INITIAL_COUNT) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 50);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    // Update button
    if (totalAnnouncements > ANNOUNCEMENTS_INITIAL_COUNT) {
        seeMoreAnnouncementsBtn.style.display = 'inline-block';
        const btnText = seeMoreAnnouncementsBtn.querySelector('.btn-text');
        
        if (announcementsExpanded) {
            btnText.textContent = 'Show Less';
        } else {
            btnText.textContent = `See More News (${totalAnnouncements - ANNOUNCEMENTS_INITIAL_COUNT} more)`;
        }
    } else {
        seeMoreAnnouncementsBtn.style.display = 'none';
    }
}

// See More Announcements button click handler
if (seeMoreAnnouncementsBtn) {
    seeMoreAnnouncementsBtn.addEventListener('click', function() {
        announcementsExpanded = !announcementsExpanded;
        updateAnnouncementsVisibility();
        
        // Scroll to announcements section if collapsing
        if (!announcementsExpanded) {
            document.querySelector('#announcements').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

// Initialize announcements visibility on page load
updateAnnouncementsVisibility();

// ============================================
// Package Cards - Flip on Mobile
// ============================================
const packageCards = document.querySelectorAll('.package-card');

// On mobile, make cards flip on tap
if (window.matchMedia('(max-width: 768px)').matches) {
    packageCards.forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
    });
}

// ============================================
// Package Info Modal
// ============================================
const packageInfoBtn = document.getElementById('packageInfoBtn');
const packageInfoModal = document.getElementById('packageInfoModal');
const modalCloseBtn = packageInfoModal ? packageInfoModal.querySelector('.modal-close-btn') : null;

if (packageInfoBtn && packageInfoModal) {
    // Open modal
    packageInfoBtn.addEventListener('click', function() {
        packageInfoModal.style.display = 'flex';
    });
    
    // Close modal when clicking X
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', function() {
            packageInfoModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    packageInfoModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && packageInfoModal.style.display === 'flex') {
            packageInfoModal.style.display = 'none';
        }
    });
}

// ============================================
// Console Welcome Message
// ============================================
console.log('%c Welcome to Cafe O\'Clock! ☕', 
    'color: #d4a373; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);');
console.log('%c Where every hour is the perfect time for great food & drinks!', 
    'color: #8b4513; font-size: 14px;');

