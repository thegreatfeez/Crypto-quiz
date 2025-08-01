import questionBank from "./questionBank.js";

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

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
console.log(selectedDifficulty)

const allQuestions = questionBank[selectedDifficulty].questions;
const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
questionSet = shuffled.slice(0, 20);
console.log(questionSet);

});