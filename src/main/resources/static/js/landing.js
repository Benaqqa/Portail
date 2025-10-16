// Landing Page JavaScript
console.log('Landing.js script loaded!');

// Core navigation function
function showSection(sectionId) {
    console.log('showSection called with:', sectionId);
    
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
        section.style.opacity = '0';
        section.style.visibility = 'hidden';
        section.classList.remove('active');
    });
    
    // Show the target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        // Force display immediately
        targetSection.style.display = 'block';
        targetSection.style.visibility = 'visible';
        targetSection.style.opacity = '1';
        targetSection.style.position = 'relative';
        targetSection.style.zIndex = '1';
        targetSection.classList.add('active');
        
        // Scroll to top of content
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        console.log('Section shown:', sectionId);
    } else {
        console.error('Section not found:', sectionId);
    }
    
    // Update active menu link
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });
}

// Initialize landing page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing landing page...');
    
    // Add event listener for "Découvrir Notre Mission" button
    const missionButton = document.querySelector('.btn-secondary');
    if (missionButton) {
        missionButton.addEventListener('click', function() {
            showSection('qui-sommes-nous');
        });
    }
    
    // Check if there's a hash in the URL
    const hash = window.location.hash.substring(1);
    if (hash) {
        console.log('Found hash in URL:', hash);
        showSection(hash);
    } else {
        // Set default section to "Actualités"
        showSection('actualites');
    }

    // Add navigation event listeners
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            console.log('Menu link clicked:', sectionId);
            
            // Update URL hash
            window.location.hash = sectionId;
            
            // Show the section
            showSection(sectionId);
        });
    });

    // Add hash change listener
    window.addEventListener('hashchange', function() {
        const newHash = window.location.hash.substring(1);
        console.log('Hash changed to:', newHash);
        if (newHash) {
            showSection(newHash);
        }
    });

    console.log('Landing page initialization complete');
    console.log('Found sections:', document.querySelectorAll('.content-section').length);
    console.log('Found menu links:', menuLinks.length);
    
    // Initialize other functionality
    addGalleryTabListeners();
    addSearchFunctionality();
    addContactFormHandling();
    addResponsiveMenuToggle();
});

// Make sure to call initialization functions after DOM is ready
setTimeout(function() {
    console.log('Re-checking navigation after timeout...');
    const firstSection = document.querySelector('.content-section.active');
    if (firstSection) {
        console.log('Active section found:', firstSection.id);
    } else {
        console.warn('No active section found, forcing actualites');
        showSection('actualites');
    }
}, 500);

// Gallery tab functionality
function addGalleryTabListeners() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Search functionality
function addSearchFunctionality() {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    const resultsPlaceholder = document.querySelector('.results-placeholder');

    if (searchButton && searchInput) {
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    function performSearch() {
        const query = searchInput.value.trim();

        if (query.length === 0) {
            showSearchResults('Veuillez entrer un terme de recherche', []);
            return;
        }

        // Simulate search results (in real implementation, this would call an API)
        const mockResults = [
            {
                title: 'Formation en gestion de projet',
                type: 'Formation',
                excerpt: 'Formation complète sur la gestion de projet...',
                date: '2024-01-15'
            },
            {
                title: 'Guide des bonnes pratiques',
                type: 'Ressource',
                excerpt: 'Document détaillé sur les bonnes pratiques...',
                date: '2024-01-10'
            }
        ];

        showSearchResults(`Résultats pour "${query}"`, mockResults);
    }
}

function showSearchResults(query, results) {
    const searchResults = document.querySelector('.search-results');
    const resultsPlaceholder = document.querySelector('.results-placeholder');

    if (searchResults && resultsPlaceholder) {
        if (results.length === 0) {
            searchResults.innerHTML = `
                <h3>Résultats de recherche</h3>
                <div class="results-placeholder">
                    <i class="fas fa-search"></i>
                    <p>Aucun résultat trouvé pour "${query}"</p>
                </div>
            `;
        } else {
            let resultsHTML = `<h3>${query}</h3><div class="search-results-list">`;

            results.forEach(result => {
                resultsHTML += `
                    <div class="search-result-item">
                        <div class="result-header">
                            <h4>${result.title}</h4>
                            <span class="result-type">${result.type}</span>
                        </div>
                        <p>${result.excerpt}</p>
                        <div class="result-meta">
                            <span class="result-date">${result.date}</span>
                            <a href="#" class="result-link">Voir plus</a>
                        </div>
                    </div>
                `;
            });

            resultsHTML += '</div>';
            searchResults.innerHTML = resultsHTML;
        }
    }
}

// Contact form handling
function addContactFormHandling() {
    const contactForm = document.querySelector('.contact-form form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const phone = this.querySelector('input[type="tel"]').value;
            const subject = this.querySelector('select').value;
            const message = this.querySelector('textarea').value;

            // Validate form
            if (!name || !email || !subject || !message) {
                showContactMessage('Veuillez remplir tous les champs obligatoires', 'error');
                return;
            }

            // Simulate form submission
            const submitButton = this.querySelector('.submit-contact');
            const originalText = submitButton.textContent;

            submitButton.textContent = 'Envoi en cours...';
            submitButton.disabled = true;

            setTimeout(() => {
                showContactMessage('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.', 'success');
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
}

function showContactMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.contact-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `contact-message ${type}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Insert message before the contact container
    const contactContainer = document.querySelector('.contact-container');
    if (contactContainer) {
        contactContainer.parentNode.insertBefore(messageDiv, contactContainer);

        // Auto-remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Responsive menu toggle
function addResponsiveMenuToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navigationMenu = document.querySelector('.navigation-menu');

    if (menuToggle && navigationMenu) {
        menuToggle.addEventListener('click', function() {
            navigationMenu.classList.toggle('open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navigationMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navigationMenu.classList.remove('open');
            }
        });

        // Close menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 1024) {
                navigationMenu.classList.remove('open');
            }
        });
    }
}

// Add smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add loading animations for content sections
function addContentAnimations() {
    // Disable animations for sections - they interfere with navigation
    // The CSS and inline styles will handle the transitions
    console.log('Content animations disabled to prevent navigation issues');
}

// Initialize content animations when page loads
window.addEventListener('load', function() {
    // Don't add animations that might interfere with section display
    console.log('Page fully loaded');
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navigationMenu = document.querySelector('.navigation-menu');
        if (navigationMenu && navigationMenu.classList.contains('open')) {
            navigationMenu.classList.remove('open');
        }
    }

    // Arrow keys for navigation (when menu is focused)
    if (e.target.classList.contains('menu-link')) {
        const menuLinks = Array.from(document.querySelectorAll('.menu-link'));
        const currentIndex = menuLinks.indexOf(e.target);

        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % menuLinks.length;
            menuLinks[nextIndex].focus();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevIndex = currentIndex === 0 ? menuLinks.length - 1 : currentIndex - 1;
            menuLinks[prevIndex].focus();
        }
    }
});

// Add CSS for dynamic elements
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .survey-message,
        .contact-message {
            padding: 15px 20px;
            margin: 20px 0;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .survey-message.success,
        .contact-message.success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .survey-message.error,
        .contact-message.error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .message-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .search-results-list {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .search-result-item {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            border: 1px solid #e9ecef;
        }
        
        .result-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .result-header h4 {
            color: #2c3e50;
            margin: 0;
        }
        
        .result-type {
            background: #667eea;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8em;
        }
        
        .result-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #e9ecef;
        }
        
        .result-date {
            color: #6c757d;
            font-size: 0.9em;
        }
        
        .result-link {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
        }
        
        .result-link:hover {
            text-decoration: underline;
        }
        
        /* Force sections to be visible when active */
        .content-section.active {
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
        }
        
        /* Debug styles */
        .content-section {
            border: 2px solid transparent;
        }
        
        .content-section.active {
            border-color: #28a745;
        }
        
        /* Additional force styles */
        .content-section.active {
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
            position: relative !important;
            z-index: 1 !important;
        }
    `;

    document.head.appendChild(style);
}

// Initialize dynamic styles
addDynamicStyles();
