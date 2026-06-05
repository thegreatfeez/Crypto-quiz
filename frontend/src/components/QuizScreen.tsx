import { useState, useEffect, useCallback } from 'react'
import type { Difficulty, Question } from '../types'

interface QuizScreenProps {
  questions: Question[]
  difficulty: Difficulty
  rewardPerAnswer: number
  onFinish: (score: number) => void
}

export default function QuizScreen({ questions, difficulty, rewardPerAnswer, onFinish }: QuizScreenProps) {
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [iqx, setIqx] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [selected, setSelected] = useState<string | null>(null)
  const [shuffled, setShuffled] = useState<string[]>([])

  const current = questions[index]
  const isLast = index === questions.length - 1

  // Shuffle options whenever the question changes
  useEffect(() => {
    setShuffled([...current.options].sort(() => Math.random() - 0.5))
    setSelected(null)
    setTimeLeft(15)
  }, [index, current.options])

  const advance = useCallback(() => {
    if (isLast) {
      onFinish(score)
    } else {
      setIndex((i) => i + 1)
    }
  }, [isLast, score, onFinish])

  // Timer
  useEffect(() => {
    if (selected !== null) return
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id)
          advance()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [selected, advance])

  function handleAnswer(option: string) {
    if (selected !== null) return
    setSelected(option)
    if (option === current.answer) {
      setScore((s) => s + 1)
      setIqx((c) => c + rewardPerAnswer)
    }
  }

  function handleDone() {
    const finalScore = selected === current.answer ? score : score
    onFinish(finalScore)
  }

  function btnClass(option: string) {
    if (selected === null) {
      return 'answer-btn relative w-full text-left px-4 py-3 rounded-xl bg-gray-800 text-white hover:bg-indigo-200 hover:text-gray-900 transition-colors duration-200 border-2 border-transparent shadow-md font-medium tracking-wide'
    }
    if (option === current.answer) {
      return 'answer-btn relative w-full text-left px-4 py-3 rounded-xl bg-green-600 text-white border-2 border-green-300 shadow-md font-medium tracking-wide cursor-not-allowed opacity-90'
    }
    if (option === selected) {
      return 'answer-btn relative w-full text-left px-4 py-3 rounded-xl bg-red-600 text-white border-2 border-red-300 shadow-md font-medium tracking-wide cursor-not-allowed opacity-90'
    }
    return 'answer-btn relative w-full text-left px-4 py-3 rounded-xl bg-gray-800 text-white border-2 border-transparent shadow-md font-medium tracking-wide cursor-not-allowed opacity-50'
  }

  return (
    <div className="w-full max-w-2xl bg-gray-800 rounded-xl p-6 shadow-xl space-y-4">
      <div className="flex justify-between text-sm text-gray-300">
        <span><i className="fas fa-coins mr-1"></i>IQX: <span className="text-yellow-400 font-bold">{iqx}</span></span>
        <span><i className="fas fa-layer-group mr-1"></i>Difficulty: <span className="capitalize">{difficulty}</span></span>
        <span><i className="fas fa-stopwatch mr-1"></i>Time: <span className={timeLeft <= 5 ? 'text-red-400 font-bold' : ''}>{timeLeft}s</span></span>
      </div>

      <div className="bg-slate-800 text-white text-lg font-semibold p-4 rounded-xl shadow-md border border-slate-700 tracking-wide">
        {current.question}
      </div>

      <div className="grid gap-3">
        {shuffled.map((option) => (
          <button
            key={option}
            className={btnClass(option)}
            onClick={() => handleAnswer(option)}
            disabled={selected !== null}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="text-sm text-gray-400 text-right">
        Question {index + 1} of {questions.length}
      </div>

      {selected !== null && !isLast && (
        <button
          onClick={() => setIndex((i) => i + 1)}
          className="bg-blue-600 hover:bg-blue-700 w-full py-2 rounded text-white"
        >
          <i className="fas fa-arrow-right mr-2"></i>Next
        </button>
      )}

      {selected !== null && isLast && (
        <button
          onClick={handleDone}
          className="bg-green-600 hover:bg-green-700 w-full py-2 rounded text-white"
        >
          <i className="fas fa-check mr-2"></i>Done
        </button>
      )}
    </div>
  )
}
