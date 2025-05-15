// Function to display hints for user to enter specific measurements
function displayHints(measurement){
  if (measurement === 'imperial'){
    document.querySelector('.weight-example').innerHTML = '(in pounds)';
    document.querySelector('.height-example').innerHTML = '(in inches)';
  }else{
    document.querySelector('.weight-example').innerHTML = '(in kilograms)';
    document.querySelector('.height-example').innerHTML = '(in centimeters)';
  }
}
// Function to calculate bmi
function calculateBMI(measurement, weight, height){
  // Variable to use in bmi calculation
  let measUnit = 0;

  // Assign a measurement unit depending on measurement system
  /* if(measurement === 'metric') measUnit = 10000;
  else measUnit = 703; */
  measurement === 'metric'?  measUnit = 10000 : measUnit = 703 ; 
  
  // Calculate Bmi value with one decimal place
  return ((weight / height ** 2) * measUnit).toFixed(1);  
}  

// Function to determine bmi classification
function getClassification(bmi){

  // Variable to save bmi classification
  let classification = '';
  // Determine bmi classification using bmi value
  if (bmi < 16)classification = 'Severe Thinness';
  else if (bmi >= 16 && bmi < 17) classification = 'Moderate Thinness';
  else if (bmi >= 17 && bmi < 18.5) classification = 'Mild Thinness';                
  else if (bmi >= 18.5 && bmi < 25) classification = 'Normal';
  else if (bmi >= 25 && bmi < 30) classification =  'Over Weight';
  else if (bmi >= 30 && bmi < 35) classification = 'Obesity (Class 1)';
  else if (bmi >= 35 && bmi < 49) classification =  'Obesity (Class 2)';
  else classification = 'Extreme Obesity'; 

  return classification;
}

// Get the calculate bmi button and save as a js element
buttonElement = document.getElementById('calculate-button');

// Add an event listener to check if the calculate bmi button is clicked
buttonElement.addEventListener('click', () => {
  // Get weight, height, and meaurement from html
  const weight = parseFloat(document.querySelector('#weight').value);
  const height = parseFloat(document.querySelector('#height').value);
  const measurement = document.getElementById('measurement-system').value;


  // Invoke function to display hints for specific measurments
  displayHints(measurement);

  // Invoke function to calculate Bmi value
  const bmi = calculateBMI(measurement, weight, height); 

  // Invoke function to determine classification
  let classification = getClassification(bmi); 

  // Display BMI results: value and classification respectively
  document.querySelector('#bmi').innerHTML = `Bmi: ${bmi}`;
  document.querySelector('#classification').innerHTML = `Classification: ${classification}`;
}); 

setInterval(() => {
  const measurement = document.getElementById('measurement-system').value;
  // Invoke function to display hints for specific measurments
  displayHints(measurement);
});


