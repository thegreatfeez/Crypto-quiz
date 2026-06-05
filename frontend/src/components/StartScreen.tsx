import { useState } from 'react'
import type { Difficulty } from '../types'
import WalletStatus from './WalletStatus'

interface StartScreenProps {
  onStart: (difficulty: Difficulty) => void
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')

  return (
    <div className="w-full max-w-2xl bg-gray-800 rounded-xl p-6 shadow-xl">
      <div className="space-y-6 max-w-md mx-auto mt-8 p-4 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-yellow-400">
          <i className="fas fa-coins text-yellow-400 mr-2"></i>Crypto Quiz Quest
        </h1>

        {/* Wallet connect */}
        <div className="flex justify-center">
          <appkit-button />
        </div>

        {/* Live wallet status: IQX balance + owned badges */}
        <WalletStatus />

        <div className="text-sm bg-gray-700 p-4 rounded-lg space-y-2">
          <p><strong><i className="fas fa-scroll mr-1"></i>Rules:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li><i className="fas fa-gamepad mr-1"></i>Select your difficulty level: Easy, Normal, or Hard</li>
            <li><i className="fas fa-clock mr-1"></i>20 questions per round, 15 seconds each</li>
            <li>
              <i className="fas fa-coins mr-1"></i>Earn <span className="text-yellow-300 font-semibold">IQX</span> per correct answer:
              <ul className="ml-5 list-disc text-sm text-gray-300 mt-1 space-y-1">
                <li>Easy — 1 IQX</li>
                <li>Normal — 3 IQX</li>
                <li>Hard — 7 IQX</li>
              </ul>
            </li>
            <li>
              <i className="fas fa-gem mr-1 text-purple-400"></i>Score 70%+ to earn a crypto NFT badge:
              <ul className="ml-5 list-disc text-sm text-gray-300 mt-1 space-y-1">
                <li>🥉 Bronze — Easy</li>
                <li>💎 Diamond — Normal</li>
                <li>🏆 Platinum — Hard</li>
              </ul>
            </li>
            <li><i className="fas fa-ban mr-1 text-red-400"></i>Answers are locked once chosen</li>
          </ul>
        </div>

        <div className="text-sm">
          <label className="block mb-2 font-medium text-white">
            <i className="fas fa-signal mr-1"></i>Choose Level
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className="w-full p-2 bg-gray-900 text-white border border-gray-600 rounded"
          >
            <option value="easy">Easy (HTML, CSS, basics)</option>
            <option value="normal">Normal (JS, React, mid-level Crypto)</option>
            <option value="hard">Hard (Solidity, Smart Contracts, Cryptography)</option>
          </select>
        </div>

        <button
          onClick={() => onStart(difficulty)}
          className="bg-green-600 hover:bg-green-700 w-full py-2 text-white font-medium rounded shadow-md"
        >
          <i className="fas fa-play mr-2"></i>Start Quiz
        </button>
      </div>
    </div>
  )
}
