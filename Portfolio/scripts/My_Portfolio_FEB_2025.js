// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
      });
  });
});

//Typing effect for my roles
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
// Has something to do with read more
document.addEventListener('DOMContentLoaded', function () {
  const readMoreButtons = document.querySelectorAll('.read-more-btn');

  readMoreButtons.forEach(button => {
      button.addEventListener('click', function () {
          const paragraph = this.previousElementSibling; // Get the paragraph before the button
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