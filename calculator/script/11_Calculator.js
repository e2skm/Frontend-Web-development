// Lesson 10: Calulator with event listener
let calculation = '';

// Function to update screen
function updateScreen() {
  const screen = document.querySelector('.js-screen');
  screen.innerText = calculation;
  // Auto-scroll to the end for long calculations
  screen.scrollLeft = screen.scrollWidth;
}

// Function to handle every button 
function handleButtonClick(value) {
  if (value === '=') {
    try {
      calculation = eval(calculation).toString();
    } catch (e) {
      calculation = 'Error';
    }
  } else if (value === 'del') {
    calculation = '';
  } else if (value === 'backspace') {
    calculation = calculation.trim().slice(0, -1);
  } else if (value === '%') {
    calculation += ' / 100 ';
  } else {
    // Handle operators with spaces
    ['+', '-', '*', '/'].includes(value) ? calculation += ` ${value} ` : calculation += value;
  }
  
  updateScreen();
}

// Keyboard event listener
document.addEventListener('keydown', (event) => {
  const key = event.key;
  
  // Handle digits 0-9
  if (/[0-9]/.test(key)) {
    handleButtonClick(key);
  }
  // Handle basic operations
  else if (['+', '-', '*', '/'].includes(key)) {
    handleButtonClick(` ${key} `);
  }
  // Handle other keys
  else if (key === 'Enter') {
    handleButtonClick('=');
  }
  else if (key === 'Backspace') {
    handleButtonClick('backspace');
  }
  else if (key === '%') {
    handleButtonClick('%');
  }
  else if (key === '(' || key === ')') {
    handleButtonClick(key);
  }
  else if (key === '.') {
    handleButtonClick('.');
  }
});

// Initialize screen
updateScreen();
