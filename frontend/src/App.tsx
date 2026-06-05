import { useState } from 'react'
import questionBank from './data/questionBank'
import StartScreen from './components/StartScreen'
import QuizScreen from './components/QuizScreen'
import ResultScreen from './components/ResultScreen'
import type { Difficulty, Question } from './types'

type Screen = 'start' | 'quiz' | 'result'

const REWARDS: Record<Difficulty, number> = {
  easy: 1,
  normal: 3,
  hard: 7,
}

// BRONZE=0, DIAMOND=1, PLATINUM=2 — matches contract constants
const TIER: Record<Difficulty, 0 | 1 | 2> = {
  easy: 0,
  normal: 1,
  hard: 2,
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('start')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [questions, setQuestions] = useState<Question[]>([])
  const [score, setScore] = useState(0)
  const [totalIQX, setTotalIQX] = useState(0)

  function startQuiz(diff: Difficulty) {
    const all = questionBank[diff].questions
    const shuffled = [...all].sort(() => Math.random() - 0.5).slice(0, 20)
    setDifficulty(diff)
    setQuestions(shuffled)
    setScore(0)
    setTotalIQX(0)
    setScreen('quiz')
  }

  function finishQuiz(finalScore: number) {
    setScore(finalScore)
    setTotalIQX(finalScore * REWARDS[difficulty])
    setScreen('result')
  }

  if (screen === 'start') {
    return <StartScreen onStart={startQuiz} />
  }

  if (screen === 'quiz') {
    return (
      <QuizScreen
        questions={questions}
        difficulty={difficulty}
        rewardPerAnswer={REWARDS[difficulty]}
        onFinish={finishQuiz}
      />
    )
  }

  return (
    <ResultScreen
      score={score}
      totalIQX={totalIQX}
      difficulty={difficulty}
      tier={TIER[difficulty]}
      onRetry={() => setScreen('start')}
    />
  )
}
