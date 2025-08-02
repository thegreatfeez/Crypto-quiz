import questionBank from "./questionBank.js";

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const retryBtn = document.getElementById("retry-btn");
const doneBtn = document.getElementById("done-btn");

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const timerEl = document.getElementById("timer");
const walletIdEl = document.getElementById("wallet-id");
const coinCountEl = document.getElementById("coin-count");
const finalScoreEl = document.getElementById("final-score");
const totalCoinsEl = document.getElementById("total-coins");
const difficultySelect = document.getElementById("difficulty");
const difficultyLabel = document.getElementById("difficulty-label");
const questionNumber = document.getElementById("question-number");
const nftDisplay = document.getElementById("nft-display");

let currentQuestionIndex = 0;
let score = 0;
let rewardPerQuestion = 0;
let selectedDifficulty = "";
let questionSet = [];
let timerInterval;
let timeLeft = 15;

function generateWalletId() {
  const savedId = localStorage.getItem('walletId');
  if (!savedId) {
    const hexChars = "0123456789abcdef";
    let hex = "0x";
    for (let i = 0; i < 40; i++) {
      const randomIndex = Math.floor(Math.random() * 16);
      hex += hexChars[randomIndex];
    }
    localStorage.setItem('walletId', hex);
    walletIdEl.textContent = hex;
  } else {
    walletIdEl.textContent = savedId;
  }
}

function startTimer() {
  timeLeft = 15;
  timerEl.textContent = timeLeft;
  
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      nextQuestion();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
}

function showQuestion() {
  const currentQuestion = questionSet[currentQuestionIndex];
  const shuffledOption = [...currentQuestion.options].sort(() => Math.random() - 0.5);

  questionEl.innerHTML = `
    <div class="bg-slate-800 text-white text-lg md:text-xl font-semibold p-4 rounded-xl shadow-md border border-slate-700 tracking-wide">
      ${currentQuestion.question}
    </div>`;
  
  answersEl.innerHTML = "";

  shuffledOption.forEach((option, idx) => {
    const button = document.createElement("button");
    button.className = "answer-btn relative w-full text-left px-4 py-3 rounded-xl bg-gray-800 text-white hover:bg-indigo-200 transition-colors duration-200 border-2 border-transparent shadow-md font-medium tracking-wide";
    button.textContent = option;
    button.dataset.index = idx;

    if (option === currentQuestion.answer) {
      button.dataset.correct = "true";
    }

    answersEl.appendChild(button);
  });
}

function nextQuestion() {
  currentQuestionIndex++;
  questionNumber.innerHTML = currentQuestionIndex + 1;
  nextBtn.classList.add('hidden');
  showQuestion();
  startTimer();
}

generateWalletId();

startBtn.addEventListener('click', () => {
  selectedDifficulty = difficultySelect.value;
  difficultyLabel.innerHTML += selectedDifficulty;

  const allQuestions = questionBank[selectedDifficulty].questions;
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  questionSet = shuffled.slice(0, 20);

  startScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');

  startTimer();
  showQuestion();
});

answersEl.addEventListener('click', function(e) {
  if (e.target.dataset.index) {
    stopTimer();
    
    const selectedOption = e.target.textContent;
    const currentQuestion = questionSet[currentQuestionIndex];
    const correctOption = currentQuestion.answer;
    const correctBtn = document.querySelector('.answer-btn[data-correct="true"]');

    const allButtons = answersEl.querySelectorAll('.answer-btn');
    allButtons.forEach(btn => {
      btn.classList.remove('bg-green-600', 'ring', 'ring-green-300');
      btn.disabled = true;
      btn.classList.add('cursor-not-allowed', 'opacity-50');
    });

    if (selectedOption === correctOption) {
      e.target.classList.add('bg-green-600', 'ring', 'ring-green-300');

      if (selectedDifficulty === "easy") {
        rewardPerQuestion += 1;
      } else if (selectedDifficulty === "normal") {
        rewardPerQuestion += 3;
      } else if (selectedDifficulty === "hard") {
        rewardPerQuestion += 7;
      }
      score++;
    } else if (selectedOption !== correctOption) {
      e.target.classList.add('bg-red-600', 'ring', 'ring-red-300');
      correctBtn.classList.add('bg-green-600', 'ring', 'ring-green-300');
    }

    if (currentQuestionIndex === 19) {
      doneBtn.classList.remove('hidden');
      nextBtn.classList.add('hidden');
    } else {
      nextBtn.classList.remove('hidden');
    }

    coinCountEl.innerHTML = rewardPerQuestion;
    totalCoinsEl.innerHTML = rewardPerQuestion;
    finalScoreEl.innerHTML = score;
  }
});

nextBtn.addEventListener('click', nextQuestion);

doneBtn.addEventListener('click', () => {
  stopTimer();
  
  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');
  const nftBox = document.getElementById('nft-image');
  const noNftMessage = document.getElementById('no-nft-message');

  if (score >= 14) {
    nftDisplay.classList.remove('hidden');
    if (selectedDifficulty === 'hard') {
      nftBox.style.backgroundImage = "url('/NFT/platinum.png')";
    } else if (selectedDifficulty === 'normal') {
      nftBox.style.backgroundImage = "url('/NFT/diamond.png')";
    } else if (selectedDifficulty === 'easy') {
      nftBox.style.backgroundImage = "url('/NFT/bronze.png')";
    }
    
    const claimBtn = document.getElementById('claim-nft-btn');
    const claimMessage = document.getElementById('claim-message');
    
    claimBtn.addEventListener('click', function() {
      claimMessage.classList.remove('hidden');
      claimBtn.classList.add('hidden');
    });
  } else {
    noNftMessage.classList.remove('hidden');
  }
});

retryBtn.addEventListener('click', () => {
  location.reload();
});
