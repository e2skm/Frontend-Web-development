// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Active section highlighting for navbar - FIXED VERSION
function setActiveSection() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    let currentSection = '';
    const pageBottom = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Check if we're at the bottom of the page (contact section)
    if (pageBottom >= documentHeight - 10) { // 10px tolerance
        currentSection = 'contact';
    } else {
        // Regular section detection for other sections
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });
    }
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Call on scroll and on load
window.addEventListener('scroll', setActiveSection);
window.addEventListener('load', setActiveSection);

// Typing effect for tools/technologies
const tools = [" Microsoft Excel", " Google Sheets", " SQL", " Python", " R" ," Power BI", " Tableau"];
let index = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 100;
const eraseSpeed = 50;
const delayBeforeDelete = 2000;

function typingEffect() {
    let currentTool = tools[index];
    if (!isDeleting) {
        document.getElementById("role").textContent = currentTool.substring(0, charIndex++);
    } else {
        document.getElementById("role").textContent = currentTool.substring(0, charIndex--);
    }
    if (!isDeleting && charIndex === currentTool.length + 1) {
        setTimeout(() => isDeleting = true, delayBeforeDelete);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        index = (index + 1) % tools.length;
    }
    setTimeout(typingEffect, isDeleting ? eraseSpeed : typingSpeed);
}
typingEffect();

// Enhanced fade-in animation for sections with staggered effect
const sections = document.querySelectorAll('section');
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            
            // Add staggered animation for items within the section
            const items = entry.target.querySelectorAll('.project, .experience, .tech-category, .certificate');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 150);
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    // Initialize items with hidden state
    const items = section.querySelectorAll('.project, .experience, .tech-category, .certificate');
    items.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    observer.observe(section);
});

// Theme toggle functionality
document.addEventListener("DOMContentLoaded", () => {
    const themeToggleBtn = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");

    const savedTheme = localStorage.getItem("theme") || "light";
    const isDarkMode = savedTheme === "dark";
    document.body.classList.toggle("dark", isDarkMode);

    themeIcon.src = isDarkMode ? "icons/sun.png" : "icons/moon.png";
    themeIcon.alt = isDarkMode ? "Light mode icon" : "Dark mode icon";
    themeIcon.title = isDarkMode ? "Click to switch to light mode" : "Click to switch to dark mode";

    themeToggleBtn.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");

        themeIcon.src = isDark ? "icons/sun.png" : "icons/moon.png";
        themeIcon.alt = isDark ? "Light mode icon" : "Dark mode icon";
        themeIcon.title = isDark ? "Click to switch to light mode" : "Click to switch to dark mode";
    });
});

// Add click effects to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});