// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
const wrongButton = document.querySelector('.wrong');
const rightButton = document.querySelector('.right');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');
// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreObj = {
  value10: [],
  value25: [],
  value50: [],
  value99: [],
};
// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const mistakesArray = [];
// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0s';
// Scroll
let valueY = 0;

const setLocalStorage = () => {
  localStorage.setItem('bestScores', JSON.stringify(bestScoreObj));
};

const getLocalStorage = () => {
  if (localStorage.getItem('bestScores')) {
    bestScoreObj = JSON.parse(localStorage.getItem('bestScores'));
  }
};

const pushToBestScoreAndFilter = (val, bestTime) => {
  if (questionAmount === val) {
    bestScoreObj[`value${val}`].push(bestTime);
    bestScoreObj[`value${val}`].sort((a, b) => a - b).splice(1, 1);
  }
};

const setBestScoreObj = () => {
  getLocalStorage();
  pushToBestScoreAndFilter(10, finalTimeDisplay);
  pushToBestScoreAndFilter(25, finalTimeDisplay);
  pushToBestScoreAndFilter(50, finalTimeDisplay);
  pushToBestScoreAndFilter(99, finalTimeDisplay);
  setLocalStorage();
};

const showScorePage = () => {
  gamePage.hidden = true;
  scorePage.hidden = false;
  //Show play-again button after 1sec
  setTimeout(() => (playAgainBtn.hidden = false), 1000);
};

const scoresToDom = () => {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.innerText = `Base Time: ${baseTime}s`;
  penaltyTimeEl.innerText = `Penalty: +${penaltyTime}s`;
  finalTimeEl.innerText = `${finalTimeDisplay}s`;
  itemContainer.scrollTo({ top: 0, behavior: 'instant' });

  setBestScoreObj();

  showScorePage();
};

const checkTime = (interval) => {
  if (playerGuessArray.length === questionAmount) {
    clearInterval(interval);
    //Penalty time
    for (let i = 0; i < playerGuessArray.length; i++) {
      if (playerGuessArray[i] !== equationsArray[i].evaluated) {
        penaltyTime += 0.5;
      }
    }
    finalTime = timePlayed + penaltyTime;
    scoresToDom();
  }
};

const startGameTimer = () => {
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(() => {
    timePlayed += 0.1;
    checkTime(timer);
  }, 100);
  gamePage.removeEventListener('click', startGameTimer);
};

const showGamePage = () => {
  gamePage.hidden = false;
  countdownPage.hidden = true;
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const shuffleArray = (a) => {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
};

// Create Correct/Incorrect Random Equations
const createEquations = () => {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(10);
    secondNumber = getRandomInt(10);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: true };
    equationsArray.push(equationObject);
  }
  // Loop through, make wrong equations, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(10);
    secondNumber = getRandomInt(10);
    const equationValue = firstNumber * secondNumber;
    mistakesArray[0] = `${firstNumber} x ${
      secondNumber + 1
    } = ${equationValue}`;
    mistakesArray[1] = `${firstNumber} x ${secondNumber} = ${
      equationValue - 1
    }`;
    mistakesArray[2] = `${
      firstNumber + 1
    } x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = mistakesArray[formatChoice];
    equationObject = { value: equation, evaluated: false };
    equationsArray.push(equationObject);
  }
  shuffleArray(equationsArray);
};

const equationsToDOM = () => {
  equationsArray.forEach((equation) => {
    const item = document.createElement('div');
    item.classList.add('item');
    const equationText = document.createElement('h1');
    equationText.innerText = equation.value;
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
};

const populateGamePage = () => {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
};

const countdownStart = () => {
  let count = 3;
  countdown.innerText = count;
  const interval = setInterval(() => {
    count--;
    if (count === 0) {
      countdown.innerText = 'GO!';
    } else if (count === -1) {
      clearInterval(interval);
      showGamePage();
    } else {
      countdown.innerText = count;
    }
  }, 1000);
};

const showCountdown = () => {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  populateGamePage();
  countdownStart();
};

const getRadioValue = () => {
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return Number(radioValue);
};

const selectQuestionAmount = (e) => {
  e.preventDefault();
  questionAmount = getRadioValue();
  questionAmount && showCountdown();
};

const select = (isGuessTrue) => {
  //Move Scroll 80px down
  valueY += 80;
  itemContainer.scroll(0, valueY);
  isGuessTrue ? playerGuessArray.push(true) : playerGuessArray.push(false);
};

const playAgain = () => {
  gamePage.addEventListener('click', startGameTimer);
  equationsArray = [];
  playerGuessArray = [];
  scorePage.hidden = true;
  splashPage.hidden = false;
  playAgainBtn.hidden = true;
  valueY = 0;
  setBestScore();
};

const setBestScore = () => {
  getLocalStorage();
  const { value10, value25, value50, value99 } = bestScoreObj;
  bestScores[0].innerText = (value10[0] || '0.0') + 's';
  bestScores[1].innerText = (value25[0] || '0.0') + 's';
  bestScores[2].innerText = (value50[0] || '0.0') + 's';
  bestScores[3].innerText = (value99[0] || '0.0') + 's';
};

// Listeners
wrongButton.addEventListener('click', () => {
  select(false);
});
rightButton.addEventListener('click', () => {
  select(true);
});

startForm.addEventListener('click', () => {
  radioContainers.forEach((radioContainer) => {
    radioContainer.classList.remove('selected-label');
    if (radioContainer.children[1].checked) {
      radioContainer.classList.add('selected-label');
    }
  });
});

startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener('click', startGameTimer);
playAgainBtn.addEventListener('click', playAgain);

setBestScore();
