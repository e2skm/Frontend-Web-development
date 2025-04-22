// Lesson 10: Web Practise
function turnOnOff(buttonClass) {
  const buttonElement = document.querySelector(`.${buttonClass}`);

  if (buttonElement.classList.contains('is-toggled')) {
    buttonElement.classList.remove('is-toggled');
  } else {
    buttonElement.classList.add('is-toggled');
  }
}
