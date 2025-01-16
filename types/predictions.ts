export interface Prediction {
  id: string
  raceId: string
  conditions: string
  podium: string[]
  confidence: number
  createdAt: string
  result?: {
    accurate: boolean
    score: number
  }
}

export interface PredictionStats {
  totalPredictions: number
  successRate: number
  averageAccuracy: number
}