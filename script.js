import questionBank from "./questionBank.js";

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const diffilcultyLabel = document.getElementById('difficulty-label')

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const retryBtn = document.getElementById("retry-btn");

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const timerEl = document.getElementById("timer");
const walletIdEl = document.getElementById("wallet-id");
const coinCountEl = document.getElementById("coin-count");
const finalScoreEl = document.getElementById("final-score");
const feedbackEl = document.getElementById("feedback");
const totalCoinsEl = document.getElementById("total-coins");
const difficultySelect = document.getElementById("difficulty");
let questionNumber = document.getElementById("question-number")
const totalQuestions = document.getElementById("total-questions")


let currentQuestionIndex = 0;
let score = 0;
let totalCoins = 0;
let selectedDifficulty = "";
let questionSet = [];
let rewardPerQuestion = 0;

function generateWalletId(){
    const walletId = localStorage.getItem('walletId')
    if(!walletId){
        const hexChars = "0123456789abcdef";
        let hex = "0x";
        for(let i = 0; i < 40; i++){
            const randomIndex = Math.floor(Math.random() * 16);
            hex += hexChars[randomIndex];
        }
        localStorage.setItem('walletId', hex);
        walletIdEl.textContent = hex;
    } else {
        walletIdEl.textContent = walletId;
    }
}
generateWalletId()

startBtn.addEventListener('click', function(){
    selectedDifficulty = difficultySelect.value;
if (selectedDifficulty === "easy") rewardPerQuestion = 1;
else if (selectedDifficulty === "normal") rewardPerQuestion = 3;
else if (selectedDifficulty === "hard") rewardPerQuestion = 7;
diffilcultyLabel.innerHTML += selectedDifficulty

const allQuestions = questionBank[selectedDifficulty].questions;
const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
questionSet = shuffled.slice(0, 20);
console.log(questionSet);
startScreen.classList.add('hidden')
quizScreen.classList.remove('hidden')

showQuestion()
});



function showQuestion() {
  const currentQuestion = questionSet[currentQuestionIndex];
  const question = currentQuestion.question;
  const allOption = currentQuestion.options;
  const shuffledOption = [...allOption].sort(() => Math.random() - 0.5);

  questionEl.innerHTML = `
  <div class="bg-slate-800 text-white text-lg md:text-xl font-semibold p-4 rounded-xl shadow-md border border-slate-700 tracking-wide">
    ${question}
  </div>`;
  answersEl.innerHTML = "";

  shuffledOption.forEach((option, idx) => {
    const button = document.createElement("button");
    button.className = "answer-btn w-full text-left px-4 py-3 rounded-xl bg-gray-800 text-white hover:bg-indigo-400 active:bg-indigo-700 transition-colors duration-200 border-2 border-transparent shadow-md font-medium tracking-wide";
    button.textContent = option;
    button.dataset.index = idx;
    answersEl.appendChild(button);
  });

  console.log(currentQuestion);
}

function nextQuestion(){
 currentQuestionIndex++
    questionNumber.innerHTML = currentQuestionIndex +1 
    showQuestion()
}
nextBtn.addEventListener('click', nextQuestion)


