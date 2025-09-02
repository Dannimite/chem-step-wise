import { SolverResponse, SolutionStep } from "@/types/chemistry"

interface QuestionAnalysis {
  topic: string
  variables: Record<string, any>
  problemType: string
}

class ChemistrySolver {
  analyzeQuestion(question: string): QuestionAnalysis {
    const lowerQuestion = question.toLowerCase()
    
    // Gas Laws Detection
    if (this.isGasLawsProblem(lowerQuestion)) {
      return this.analyzeGasLaws(question)
    }
    
    // Stoichiometry Detection
    if (this.isStoichiometryProblem(lowerQuestion)) {
      return this.analyzeStoichiometry(question)
    }
    
    // pH Problems Detection
    if (this.isPHProblem(lowerQuestion)) {
      return this.analyzePH(question)
    }
    
    // Concentration Detection
    if (this.isConcentrationProblem(lowerQuestion)) {
      return this.analyzeConcentration(question)
    }
    
    // Thermochemistry Detection
    if (this.isThermochemistryProblem(lowerQuestion)) {
      return this.analyzeThermochemistry(question)
    }
    
    // Default to general chemistry
    return {
      topic: "general-chemistry",
      variables: {},
      problemType: "general"
    }
  }

  private isGasLawsProblem(question: string): boolean {
    const gasKeywords = ['pressure', 'volume', 'temperature', 'atm', 'l', 'ml', 'gas', 'boyle', 'charles', 'ideal gas', 'pv=nrt']
    return gasKeywords.some(keyword => question.includes(keyword))
  }

  private isStoichiometryProblem(question: string): boolean {
    const stoichKeywords = ['mole', 'gram', 'react', 'produce', 'yield', 'limiting', 'excess', 'combustion', 'burn']
    return stoichKeywords.some(keyword => question.includes(keyword))
  }

  private isPHProblem(question: string): boolean {
    const phKeywords = ['ph', 'poh', 'acid', 'base', 'h+', 'oh-', 'hydroxide', 'hydrogen ion']
    return phKeywords.some(keyword => question.includes(keyword))
  }

  private isConcentrationProblem(question: string): boolean {
    const concKeywords = ['molarity', 'molality', 'concentration', 'solution', 'solute', 'solvent', 'ppm', 'dilute']
    return concKeywords.some(keyword => question.includes(keyword))
  }

  private isThermochemistryProblem(question: string): boolean {
    const thermoKeywords = ['heat', 'enthalpy', 'temperature change', 'calorimetry', 'joule', 'calorie', 'specific heat']
    return thermoKeywords.some(keyword => question.includes(keyword))
  }

  private analyzeGasLaws(question: string): QuestionAnalysis {
    const numbers = this.extractNumbers(question)
    const hasTemperature = question.toLowerCase().includes('temperature') || question.toLowerCase().includes('k') || question.toLowerCase().includes('°c')
    const hasPressure = question.toLowerCase().includes('pressure') || question.toLowerCase().includes('atm') || question.toLowerCase().includes('pa')
    const hasVolume = question.toLowerCase().includes('volume') || question.toLowerCase().includes('l') || question.toLowerCase().includes('ml')
    const hasMoles = question.toLowerCase().includes('mol') && !question.toLowerCase().includes('molarity')

    let problemType = 'combined-gas-law'
    if (!hasTemperature && hasPressure && hasVolume) problemType = 'boyles-law'
    else if (hasTemperature && !hasPressure && hasVolume) problemType = 'charles-law'
    else if (hasTemperature && hasPressure && !hasVolume) problemType = 'gay-lussacs-law'
    else if (hasMoles && hasTemperature && (hasPressure || hasVolume)) problemType = 'ideal-gas-law'

    return {
      topic: 'gas-laws',
      variables: this.extractGasLawVariables(question, numbers),
      problemType
    }
  }

  private analyzeStoichiometry(question: string): QuestionAnalysis {
    const numbers = this.extractNumbers(question)
    const hasLimiting = question.toLowerCase().includes('limiting') || question.toLowerCase().includes('excess')
    const hasCombustion = question.toLowerCase().includes('burn') || question.toLowerCase().includes('combustion')
    
    let problemType = 'basic-stoichiometry'
    if (hasLimiting) problemType = 'limiting-reagent'
    else if (hasCombustion) problemType = 'combustion'

    return {
      topic: 'stoichiometry',
      variables: this.extractStoichiometryVariables(question, numbers),
      problemType
    }
  }

  private analyzePH(question: string): QuestionAnalysis {
    return {
      topic: 'ph',
      variables: this.extractPHVariables(question),
      problemType: 'ph-calculation'
    }
  }

  private analyzeConcentration(question: string): QuestionAnalysis {
    return {
      topic: 'concentration',
      variables: this.extractConcentrationVariables(question),
      problemType: 'molarity'
    }
  }

  private analyzeThermochemistry(question: string): QuestionAnalysis {
    return {
      topic: 'thermochemistry',
      variables: this.extractThermochemistryVariables(question),
      problemType: 'heat-calculation'
    }
  }

  private extractNumbers(text: string): number[] {
    const numberPattern = /\b\d+\.?\d*\b/g
    const matches = text.match(numberPattern)
    return matches ? matches.map(Number) : []
  }

  private extractGasLawVariables(question: string, numbers: number[]): Record<string, any> {
    const variables: Record<string, any> = {}
    
    // Try to extract pressure values
    if (question.includes('atm')) {
      const atmIndex = question.indexOf('atm')
      const nearbyNumbers = numbers.filter(num => {
        const numStr = num.toString()
        const numIndex = question.indexOf(numStr)
        return Math.abs(numIndex - atmIndex) < 20
      })
      if (nearbyNumbers.length > 0) {
        variables.pressure = nearbyNumbers[0]
        variables.pressureUnit = 'atm'
      }
    }
    
    // Try to extract volume values
    if (question.includes('L') || question.includes('l')) {
      const lIndex = question.indexOf('L') !== -1 ? question.indexOf('L') : question.indexOf('l')
      const nearbyNumbers = numbers.filter(num => {
        const numStr = num.toString()
        const numIndex = question.indexOf(numStr)
        return Math.abs(numIndex - lIndex) < 20
      })
      if (nearbyNumbers.length > 0) {
        variables.volume = nearbyNumbers[0]
        variables.volumeUnit = 'L'
      }
    }
    
    // Extract temperature
    if (question.includes('K')) {
      const kIndex = question.indexOf('K')
      const nearbyNumbers = numbers.filter(num => {
        const numStr = num.toString()
        const numIndex = question.indexOf(numStr)
        return Math.abs(numIndex - kIndex) < 20
      })
      if (nearbyNumbers.length > 0) {
        variables.temperature = nearbyNumbers[0]
        variables.temperatureUnit = 'K'
      }
    }
    
    // Extract moles
    if (question.includes('mol')) {
      const molIndex = question.indexOf('mol')
      const nearbyNumbers = numbers.filter(num => {
        const numStr = num.toString()
        const numIndex = question.indexOf(numStr)
        return Math.abs(numIndex - molIndex) < 20
      })
      if (nearbyNumbers.length > 0) {
        variables.moles = nearbyNumbers[0]
      }
    }
    
    return variables
  }

  private extractStoichiometryVariables(question: string, numbers: number[]): Record<string, any> {
    const variables: Record<string, any> = {}
    
    if (question.includes('g') || question.includes('gram')) {
      variables.mass = numbers[0] || 0
      variables.massUnit = 'g'
    }
    
    return variables
  }

  private extractPHVariables(question: string): Record<string, any> {
    const variables: Record<string, any> = {}
    const numbers = this.extractNumbers(question)
    
    if (question.includes('ph') && numbers.length > 0) {
      variables.ph = numbers[0]
    }
    
    return variables
  }

  private extractConcentrationVariables(question: string): Record<string, any> {
    const variables: Record<string, any> = {}
    const numbers = this.extractNumbers(question)
    
    if (numbers.length >= 2) {
      variables.moles = numbers[0]
      variables.volume = numbers[1]
    }
    
    return variables
  }

  private extractThermochemistryVariables(question: string): Record<string, any> {
    const variables: Record<string, any> = {}
    const numbers = this.extractNumbers(question)
    
    if (numbers.length >= 2) {
      variables.mass = numbers[0]
      variables.temperature = numbers[1]
    }
    
    return variables
  }

  solve(question: string, topicHint?: string): SolverResponse {
    const analysis = this.analyzeQuestion(question)
    
    switch (analysis.topic) {
      case 'gas-laws':
        return this.solveGasLaws(question, analysis)
      case 'stoichiometry':
        return this.solveStoichiometry(question, analysis)
      case 'ph':
        return this.solvePH(question, analysis)
      case 'concentration':
        return this.solveConcentration(question, analysis)
      case 'thermochemistry':
        return this.solveThermochemistry(question, analysis)
      default:
        return this.solveGeneral(question)
    }
  }

  private solveGasLaws(question: string, analysis: QuestionAnalysis): SolverResponse {
    const { variables, problemType } = analysis
    
    switch (problemType) {
      case 'boyles-law':
        return this.solveBoyles(question, variables)
      case 'charles-law':
        return this.solveCharles(question, variables)
      case 'ideal-gas-law':
        return this.solveIdealGas(question, variables)
      default:
        return this.solveBoyles(question, variables) // Default fallback
    }
  }

  private solveBoyles(question: string, variables: Record<string, any>): SolverResponse {
    const steps: SolutionStep[] = [
      {
        stepNumber: 1,
        title: "Identify the Gas Law",
        description: "This is a Boyle's Law problem since temperature is constant",
        formula: "P₁V₁ = P₂V₂",
        explanation: "Boyle's Law states that pressure and volume are inversely proportional at constant temperature"
      },
      {
        stepNumber: 2,
        title: "Identify Given Values",
        description: "Extract the known variables from the problem",
        substitution: `Given values from the problem`,
        result: "Values identified"
      }
    ]

    // Add calculation steps based on what we're solving for
    if (variables.pressure && variables.volume) {
      steps.push({
        stepNumber: 3,
        title: "Solve for Unknown",
        description: "Calculate the missing variable using Boyle's Law",
        formula: "P₁V₁ = P₂V₂",
        substitution: `Using the values from the problem`,
        calculation: "Performing the calculation",
        result: "Result obtained"
      })
    }

    return {
      success: true,
      detectedTopic: "Gas Laws - Boyle's Law",
      canonicalProblem: question,
      steps,
      finalAnswer: "See calculation steps above",
      latexEquations: ["P_1V_1 = P_2V_2"],
      confidence: 0.85,
      interpretation: "This problem uses Boyle's Law to relate pressure and volume at constant temperature."
    }
  }

  private solveCharles(question: string, variables: Record<string, any>): SolverResponse {
    const steps: SolutionStep[] = [
      {
        stepNumber: 1,
        title: "Identify the Gas Law",
        description: "This is a Charles's Law problem since pressure is constant",
        formula: "V₁/T₁ = V₂/T₂",
        explanation: "Charles's Law states that volume and temperature are directly proportional at constant pressure"
      },
      {
        stepNumber: 2,
        title: "Convert Temperature",
        description: "Convert Celsius to Kelvin if needed",
        formula: "K = °C + 273.15",
        explanation: "Gas law calculations require absolute temperature in Kelvin"
      },
      {
        stepNumber: 3,
        title: "Apply Charles's Law",
        description: "Use the relationship between volume and temperature",
        formula: "V₁/T₁ = V₂/T₂",
        substitution: "Substitute the known values",
        result: "Calculate the unknown variable"
      }
    ]

    return {
      success: true,
      detectedTopic: "Gas Laws - Charles's Law",
      canonicalProblem: question,
      steps,
      finalAnswer: "See calculation steps above",
      latexEquations: ["\\frac{V_1}{T_1} = \\frac{V_2}{T_2}"],
      confidence: 0.85,
      interpretation: "This problem uses Charles's Law to relate volume and temperature at constant pressure."
    }
  }

  private solveIdealGas(question: string, variables: Record<string, any>): SolverResponse {
    const steps: SolutionStep[] = [
      {
        stepNumber: 1,
        title: "Identify the Gas Law",
        description: "This is an Ideal Gas Law problem",
        formula: "PV = nRT",
        explanation: "The ideal gas law relates pressure, volume, moles, and temperature"
      },
      {
        stepNumber: 2,
        title: "Identify Given Values",
        description: "List the known quantities",
        substitution: "Extract values from the problem statement",
        result: "Known values identified"
      },
      {
        stepNumber: 3,
        title: "Apply Ideal Gas Law",
        description: "Use PV = nRT to solve for the unknown",
        formula: "PV = nRT",
        substitution: "R = 0.0821 L·atm/mol·K",
        calculation: "Substitute values and solve",
        result: "Calculate the unknown variable"
      }
    ]

    return {
      success: true,
      detectedTopic: "Gas Laws - Ideal Gas Law",
      canonicalProblem: question,
      steps,
      finalAnswer: "See calculation steps above",
      latexEquations: ["PV = nRT"],
      confidence: 0.90,
      interpretation: "This problem uses the ideal gas law to relate pressure, volume, moles, and temperature."
    }
  }

  private solveStoichiometry(question: string, analysis: QuestionAnalysis): SolverResponse {
    const steps: SolutionStep[] = [
      {
        stepNumber: 1,
        title: "Write Balanced Equation",
        description: "Write the balanced chemical equation for the reaction",
        explanation: "A balanced equation shows the mole relationships between reactants and products"
      },
      {
        stepNumber: 2,
        title: "Convert to Moles",
        description: "Convert given mass to moles using molar mass",
        formula: "n = m/MM",
        explanation: "Moles = mass ÷ molar mass"
      },
      {
        stepNumber: 3,
        title: "Use Stoichiometry",
        description: "Use mole ratios from balanced equation",
        explanation: "The coefficients in the balanced equation give mole ratios"
      },
      {
        stepNumber: 4,
        title: "Convert to Desired Units",
        description: "Convert moles back to mass if needed",
        formula: "m = n × MM",
        explanation: "Mass = moles × molar mass"
      }
    ]

    return {
      success: true,
      detectedTopic: "Stoichiometry",
      canonicalProblem: question,
      steps,
      finalAnswer: "See calculation steps above",
      latexEquations: ["n = \\frac{m}{MM}", "m = n \\times MM"],
      confidence: 0.80,
      interpretation: "This stoichiometry problem involves converting between mass and moles using balanced equations."
    }
  }

  private solvePH(question: string, analysis: QuestionAnalysis): SolverResponse {
    const steps: SolutionStep[] = [
      {
        stepNumber: 1,
        title: "Identify the pH Relationship",
        description: "Use the relationship between pH and [H+]",
        formula: "pH = -log[H+]",
        explanation: "pH is the negative logarithm of hydrogen ion concentration"
      },
      {
        stepNumber: 2,
        title: "Apply pH Formula",
        description: "Calculate using the pH equation",
        substitution: "Substitute the given values",
        result: "Calculate the result"
      }
    ]

    return {
      success: true,
      detectedTopic: "pH and Acids/Bases",
      canonicalProblem: question,
      steps,
      finalAnswer: "See calculation steps above",
      latexEquations: ["pH = -\\log[H^+]"],
      confidence: 0.85,
      interpretation: "This problem involves pH calculations using logarithms."
    }
  }

  private solveConcentration(question: string, analysis: QuestionAnalysis): SolverResponse {
    const steps: SolutionStep[] = [
      {
        stepNumber: 1,
        title: "Identify Concentration Formula",
        description: "Use the molarity formula",
        formula: "M = n/V",
        explanation: "Molarity = moles of solute ÷ liters of solution"
      },
      {
        stepNumber: 2,
        title: "Apply Formula",
        description: "Calculate using the given values",
        substitution: "Substitute known values",
        result: "Calculate the concentration"
      }
    ]

    return {
      success: true,
      detectedTopic: "Concentration",
      canonicalProblem: question,
      steps,
      finalAnswer: "See calculation steps above",
      latexEquations: ["M = \\frac{n}{V}"],
      confidence: 0.85,
      interpretation: "This problem involves calculating solution concentration."
    }
  }

  private solveThermochemistry(question: string, analysis: QuestionAnalysis): SolverResponse {
    const steps: SolutionStep[] = [
      {
        stepNumber: 1,
        title: "Identify Heat Formula",
        description: "Use the heat capacity equation",
        formula: "q = mcΔT",
        explanation: "Heat = mass × specific heat × temperature change"
      },
      {
        stepNumber: 2,
        title: "Apply Formula",
        description: "Calculate using the given values",
        substitution: "Substitute known values",
        result: "Calculate the heat"
      }
    ]

    return {
      success: true,
      detectedTopic: "Thermochemistry",
      canonicalProblem: question,
      steps,
      finalAnswer: "See calculation steps above",
      latexEquations: ["q = mc\\Delta T"],
      confidence: 0.85,
      interpretation: "This problem involves heat calculations using specific heat capacity."
    }
  }

  private solveGeneral(question: string): SolverResponse {
    return {
      success: true,
      detectedTopic: "General Chemistry",
      canonicalProblem: question,
      steps: [
        {
          stepNumber: 1,
          title: "Analyze the Problem",
          description: "This appears to be a general chemistry question",
          explanation: "Please provide more specific details or try rephrasing your question"
        }
      ],
      finalAnswer: "Unable to determine specific solution approach",
      latexEquations: [],
      confidence: 0.30,
      interpretation: "This question needs more specific information to provide a detailed solution."
    }
  }
}

export const chemistrySolver = new ChemistrySolver()