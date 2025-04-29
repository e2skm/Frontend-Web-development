// 12_Rock_Paper_Scissors: with autoplay
let score = JSON.parse(localStorage.getItem('score')) || {
  wins: 0,
  losses: 0,
  ties: 0
};

updateScoreElement();

// Function to generate a random move
function generateComputerMove(){
  const randomNumber = Math.round(Math.random() *3);
  if(randomNumber === 1 ) return 'Rock';
  else if(randomNumber === 2 ) return 'Paper';
  else return 'Scissors';
}

//Function to display updated score
function updateScoreElement(){
  document.querySelector('.js-score')
   .innerHTML = `Wins: ${score.wins}, Losses: ${score.losses}, Ties: ${score.ties}`;
}

// Variable to keep whether autoplay is enable or disable
let isAutoPlaying = false;

// Variable to store the setInterval() ID
let intervalID;
// Function to enable autoplay 
function autoplay(){
  const autoPlayButton = document.querySelector('.js-auto-play-button');
  
  if(!isAutoPlaying){
    intervalID = setInterval(() => {
      const playerMove = generateComputerMove();
      playGame(playerMove);
    }, 1000);
    isAutoPlaying = true;
    autoPlayButton.innerHTML = 'Stop Auto Play';
  }else{
    clearInterval(intervalID);
    isAutoPlaying = false;
    autoPlayButton.innerHTML = 'Auto Play';
  }
}

// Add event listeners to run function whenever a button is clicked
document.querySelector('.js-rock-button').addEventListener('click', () => {
  playGame('Rock')
});
document.querySelector('.js-paper-button').addEventListener('click', () => {
  playGame('Paper');
});
document.querySelector('.js-scissors-button').addEventListener('click', () => {
  playGame('Scissors');  
});
document.querySelector('.js-reset-score-button').addEventListener('click', () => {
  showConfirmation(); 
});
document.querySelector('.js-auto-play-button').addEventListener('click', () => {
  autoplay();
});
// Add event listeners to play game using the keyboard
document.body.addEventListener('keydown', (event) =>{
  if(event.key.toLowerCase() === 'r' ){
    playGame('Rock');
  }else if (event.key.toLowerCase() === 'p'){
    playGame('Paper');
  }else if (event.key.toLowerCase() === 's'){
    playGame('Scissors');
  }else if (event.key.toLowerCase() === 'a'){
    autoplay();
  }else if (event.key.toLowerCase() === 'backspace'){
    showConfirmation();
  }
});
// Functions for confirmation handling
function showConfirmation() {
  document.querySelector('.js-confirmation').style.display = 'block';
}
function hideConfirmation() {
  document.querySelector('.js-confirmation').style.display = 'none';
}
// Function to reset score
function resetScore() {
  score.wins = 0;
  score.losses = 0;
  score.ties = 0;
  localStorage.removeItem('score');
  updateScoreElement();
}
// Add event listeners for confirmation buttons
document.querySelector('.js-confirm-yes').addEventListener('click', () => {
  resetScore();
  hideConfirmation();
});
document.querySelector('.js-confirm-no').addEventListener('click', () => {
  hideConfirmation();
});
// Invoke function to hide the confirmation message
hideConfirmation();

// Main game function
function playGame(playerMove){
  const computerMove = generateComputerMove();
  let result = ''; 
  
  // Determine game result
  if(playerMove === 'Rock'){
    if(computerMove === 'Rock') result = 'Tie';
    else if(computerMove === 'Paper') result = 'You lose';
    else result =  'You win';
  }else if(playerMove === 'Paper'){
    if(computerMove === 'Paper') result = 'Tie';
    else if(computerMove === 'Scissors') result = 'You lose';
    else result =  'You win';
  }else {
    if(computerMove === 'Scissors') result = 'Tie';
    else if(computerMove === 'Rock') result = 'You lose';
    else result =  'You win';
  }

  // Update score
  if(result === 'You win') score.wins ++;
  else if(result === 'You lose') score.losses ++;
  else score.ties ++;

  // Store updated score in localStorage
  localStorage.setItem('score',JSON.stringify(score));

  // Display Info: Results, Moves and Score
  updateScoreElement();
  document.querySelector('.js-result')
   .innerHTML = `${result}`;
  document.querySelector('.js-moves')
    .innerHTML = `You
<img src="images/${playerMove}-emoji.png" class="move-icon">
:
<img src="images/${computerMove}-emoji.png" class="move-icon">
Computer`; 
}
