import questionBank from "./questionBank.js";

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const diffilcultyLabel = document.getElementById('difficulty-label')

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const retryBtn = document.getElementById("retry-btn");
const doneBtn = document.getElementById('done-btn')

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const timerEl = document.getElementById("timer");
const walletIdEl = document.getElementById("wallet-id");
const coinCountEl = document.getElementById("coin-count");
const finalScoreEl = document.getElementById("final-score");
const totalCoinsEl = document.getElementById("total-coins");
const difficultySelect = document.getElementById("difficulty");
let questionNumber = document.getElementById("question-number")




let currentQuestionIndex = 0;
let score = 0;
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
diffilcultyLabel.innerHTML += selectedDifficulty

const allQuestions = questionBank[selectedDifficulty].questions;
const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
questionSet = shuffled.slice(0, 20);
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
}
answersEl.addEventListener('click', function(e){
if(e.target.dataset.index){
    const selectedOption = e.target.textContent
    const currentQuestion = questionSet[currentQuestionIndex];
    const correctOption = currentQuestion.answer
    console.log("correct answer is: ", correctOption)
    
  if (selectedOption === correctOption) {
      if (selectedDifficulty === "easy") {
        rewardPerQuestion += 1;
      } else if (selectedDifficulty === "normal") {
        rewardPerQuestion += 3;
      } else if (selectedDifficulty === "hard") {
        rewardPerQuestion += 7;
      }
      score++;
    }
    coinCountEl.innerHTML = rewardPerQuestion
    totalCoinsEl.innerHTML = rewardPerQuestion
  

if(currentQuestionIndex === 19){
doneBtn.classList.remove('hidden')
nextBtn.classList.add('hidden')
}
if(currentQuestionIndex < 19){nextBtn.classList.remove('hidden')}

 
  finalScoreEl.innerHTML = score
  }
});



function nextQuestion(){
 currentQuestionIndex++
  questionNumber.innerHTML = currentQuestionIndex + 1
  nextBtn.classList.add('hidden')
  showQuestion()
  
}
nextBtn.addEventListener('click', nextQuestion)


doneBtn.addEventListener('click', function(){
 quizScreen.classList.add('hidden')
  resultScreen.classList.remove('hidden')
})

retryBtn.addEventListener('click', function(){
  document.getElementById('result-screen').classList.add('hidden');
  document.getElementById('start-screen').classList.remove('hidden');
})

