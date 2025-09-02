export interface ChemistryTopic {
  id: string
  name: string
  description: string
  icon: string
  examples: ExampleProblem[]
  calculators: Calculator[]
}

export interface ExampleProblem {
  id: string
  topicId: string
  title: string
  question: string
  variables: Record<string, Variable>
  solution: SolutionStep[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
}

export interface Variable {
  name: string
  symbol: string
  value?: number
  unit: string
  description: string
  required: boolean
}

export interface SolutionStep {
  stepNumber: number
  title: string
  description: string
  formula?: string
  latexFormula?: string
  substitution?: string
  calculation?: string
  result?: string
  resultWithUnits?: string
  explanation?: string
}

export interface Calculator {
  id: string
  name: string
  description: string
  inputs: Variable[]
  outputs: Variable[]
  formula: string
  latexFormula: string
}

export interface SolverResponse {
  success: boolean
  detectedTopic: string
  canonicalProblem: string
  variables: Record<string, Variable>
  steps: SolutionStep[]
  finalAnswer: string
  latexEquations: string[]
  confidence: number
  clarifyingQuestions?: string[]
  error?: string
}

export interface ChemistryQuestion {
  text: string
  topicHint?: string
  variables?: Record<string, any>
}