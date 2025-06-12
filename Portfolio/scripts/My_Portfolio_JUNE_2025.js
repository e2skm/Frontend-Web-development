// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
      });
  });
});

// Typing effect for my roles
const roles = [
" Business Analyst", " Data Analyst", " Frontend Developer", " Scrum Master"            
];
let index = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 100;
const eraseSpeed = 50;
const delayBeforeDelete = 2000;
function typingEffect() {
  let currentRole = roles[index];
  if (!isDeleting) {
    document.getElementById("role").textContent = currentRole.substring(0,charIndex++);
  }else {
    document.getElementById("role").textContent = currentRole.substring(0,charIndex--);
  }
  if (!isDeleting && charIndex === currentRole.length + 1){
    setTimeout(() => isDeleting = true, delayBeforeDelete); 
  }else if (isDeleting && charIndex === 0){
    isDeleting = false;
    index = (index + 1) % roles.length;
  } setTimeout(typingEffect,isDeleting ? eraseSpeed : typingSpeed);
}
typingEffect();

// Add a simple fade-in animation for sections
const sections = document.querySelectorAll('section');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
      if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
      }
  });
}, { threshold: 0.1 });

sections.forEach(section => {
  observer.observe(section);
});

// Read more functionality
document.addEventListener('DOMContentLoaded', function () {
  const readMoreButtons = document.querySelectorAll('.read-more-btn');

  readMoreButtons.forEach(button => {
      button.addEventListener('click', function () {
          const paragraph = this.previousElementSibling;
          if (paragraph.classList.contains('truncated-text')) {
              paragraph.classList.remove('truncated-text');
              this.textContent = 'Read Less';
          } else {
              paragraph.classList.add('truncated-text');
              this.textContent = 'Read More';
          }
      });
  });
});

// Function to organize tasks by date and time from earliest to latest
function sortTasksByDateTime(tasks) {
  return tasks.sort((a, b) => {
    // Combine date and time for comparison
    const dateTimeA = new Date(`${a.dueDate} ${a.dueTime || '00:00'}`);
    const dateTimeB = new Date(`${b.dueDate} ${b.dueTime || '00:00'}`);
    return dateTimeA - dateTimeB;
  });
}

// Theme toggle functionality with dynamic tooltip
document.addEventListener("DOMContentLoaded", () => {
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  // Load theme from storage
  const savedTheme = localStorage.getItem("theme") || "light";
  const isDarkMode = savedTheme === "dark";
  document.body.classList.toggle("dark", isDarkMode);

  // Set initial icon, alt and tooltip
  themeIcon.src = isDarkMode ? "icons/sun.png" : "icons/moon.png";
  themeIcon.alt = isDarkMode ? "Light mode icon" : "Dark mode icon";
  themeIcon.title = isDarkMode
    ? "Click to switch to light mode"
    : "Click to switch to dark mode";

  themeToggleBtn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    themeIcon.src = isDark ? "icons/sun.png" : "icons/moon.png";
    themeIcon.alt = isDark ? "Light mode icon" : "Dark mode icon";
    themeIcon.title = isDark
      ? "Click to switch to light mode"
      : "Click to switch to dark mode";
  });
});
