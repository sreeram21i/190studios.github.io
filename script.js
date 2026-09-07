document.addEventListener("DOMContentLoaded", () => {
    // 1. Sticky Navigation & Active Link Highlight
    const header = document.getElementById("main-header");
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".desktop-nav a");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
        
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(current)) {
                link.classList.add("active");
            }
        });
    });

    // 2. Mobile Menu Logic & Scroll Lock
    const menuBtn = document.querySelector(".mobile-menu-btn");
    const mobileNav = document.querySelector(".mobile-nav");
    const mobileLinks = document.querySelectorAll(".mobile-nav a");

    function toggleMobileMenu() {
        mobileNav.classList.toggle("open");
        
        if (mobileNav.classList.contains("open")) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }

        const lines = menuBtn.querySelectorAll(".line");
        if(mobileNav.classList.contains("open")) {
            lines[0].style.transform = "rotate(45deg) translate(6px, 6px)";
            lines[1].style.opacity = "0";
            lines[2].style.transform = "rotate(-45deg) translate(6px, -6px)";
        } else {
            lines[0].style.transform = "none";
            lines[1].style.opacity = "1";
            lines[2].style.transform = "none";
        }
    }

    menuBtn.addEventListener("click", toggleMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (mobileNav.classList.contains("open")) {
                toggleMobileMenu();
            }
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 900 && mobileNav.classList.contains("open")) {
            toggleMobileMenu();
        }
    });

    // 3. Scroll Reveal Animations (Text and Image fading)
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-stagger, .section-heading');
    revealElements.forEach(el => observer.observe(el));


  // 4. BULLETPROOF JAVASCRIPT SCROLL SCRUBBING
    const scrubLines = document.querySelectorAll('.draw-line-v, .draw-line-h');

    function updateScrubLines() {
        const windowHeight = window.innerHeight;

        scrubLines.forEach(line => {
            // Get position of the section the line is inside
            const parent = line.parentElement;
            const rect = parent.getBoundingClientRect();

            // Calculate scroll distance
            const scrollDistance = windowHeight - rect.top;
            const maxScrollTarget = windowHeight * 0.8; 

            let progress = scrollDistance / maxScrollTarget;

            // Lock progress strictly between 0 and 1
            progress = Math.max(0, Math.min(1, progress));

            // DIRECT DOM MANIPULATION (Fixes browser repaint bugs)
            if (line.classList.contains('center-line') || line.classList.contains('top-center')) {
                line.style.transform = `translateX(-50%) scaleY(${progress})`;
            } else if (line.classList.contains('draw-line-h')) {
                line.style.transform = `scaleX(${progress})`;
            } else {
                line.style.transform = `scaleY(${progress})`;
            }
        });
    }

    // Passive scroll listener for max performance
    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateScrubLines);
    }, { passive: true });

    // Run once immediately on load
    updateScrubLines();


    // Run on scroll
    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateScrubLines);
    });
    // Run once on load to establish starting positions
    updateScrubLines();

    // Passive scroll listener for max performance
    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateScrubLines);
    }, { passive: true });

    // NEW FIX: Delay the initial calculation by 100ms so the CSS transition 
    // catches it and animates the lines beautifully on page load.
    setTimeout(() => {
        updateScrubLines();
    }, 100);

    

});

document.addEventListener('DOMContentLoaded', () => {
    // --- Lightbox Slider Logic ---
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    const thumbnails = document.querySelectorAll('.gallery-thumb');
    
    let currentIndex = 0;
    let imageArray = [];

    // Populate image array from thumbnails
    thumbnails.forEach((thumb, index) => {
        imageArray.push(thumb.src);
        
        // Open lightbox on click
        thumb.addEventListener('click', () => {
            currentIndex = index;
            updateLightboxImage();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Update image source
    function updateLightboxImage() {
        lightboxImg.src = imageArray[currentIndex];
    }

    // Close Lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    // Next/Prev Logic
    function showNext() {
        currentIndex = (currentIndex + 1) % imageArray.length;
        updateLightboxImage();
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + imageArray.length) % imageArray.length;
        updateLightboxImage();
    }

    // Event Listeners for Controls
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    // Close on clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
});