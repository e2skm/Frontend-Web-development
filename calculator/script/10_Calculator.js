// Lesson 10: Calulator
let calculation = '';
// Function to update screen
function updateScreen() {
  document.querySelector('.js-screen').innerText = calculation;
}
// Function to handle every button 
function handleButtonClick(value) {
  if (value === '=') {
    try {
      calculation = eval(calculation);
    } catch (e) {
      calculation = 'Error';
    }
  } else if (value === 'del') {
    calculation = '';
  } else if (value === '%') {
    calculation += ' / 100 ';
  } else {
    // Handle operators with spaces
    ['+', '-', '*', '/'].includes(value) ? calculation += ` ${value} `: calculation += value;
  }
  
  console.log(calculation);
  updateScreen();
}

// Initialize screen
updateScreen();
