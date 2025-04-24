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
  if(!isAutoPlaying){
    intervalID = setInterval(function(){
      const playerMove = generateComputerMove();
      playGame(playerMove);
    }, 1000);
    isAutoPlaying = true;
  }else{
    clearInterval(intervalID);
    isAutoPlaying = false;
  }
  
}

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