export type Difficulty = 'easy' | 'normal' | 'hard'

export interface Question {
  question: string
  options: string[]
  answer: string
}
