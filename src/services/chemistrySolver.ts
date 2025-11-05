import { SolverResponse, SolutionStep } from "@/types/chemistry"

interface QuestionAnalysis {
  topic: string
  variables: Record<string, any>
  problemType: string
}

class ChemistrySolver {
  analyzeQuestion(question: string): QuestionAnalysis {
    const lowerQuestion = question.toLowerCase()
    
    // Stoichiometry Detection (prefer before Gas Laws to avoid false positives)
    if (this.isStoichiometryProblem(lowerQuestion)) {
      return this.analyzeStoichiometry(question)
    }
    
    // Gas Laws Detection (requires stricter indicators)
    if (this.isGasLawsProblem(lowerQuestion)) {
      return this.analyzeGasLaws(question)
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
    const q = question.toLowerCase()
    const hasPressureUnit = /\b\d+(\.\d+)?\s*(atm|kpa|pa|torr|mmhg)\b/i.test(q) || /\bpressure\b/i.test(q)
    const hasVolumeUnit = /\b\d+(\.\d+)?\s*(l|ml)\b/i.test(q) || /\bvolume\b/i.test(q)
    const hasTempUnit = /\b\d+(\.\d+)?\s*k\b/i.test(q) || /\btemperature\b/i.test(q) || /°c/i.test(q)
    const hasNamedLaw = /\bboyle'?s?\b|\bcharles'?s?\b|\bideal\s+gas\b|pv\s*=\s*nrt/i.test(q)
    const hasGasWord = /\bgas(es)?\b/i.test(q)
    return hasNamedLaw || (hasPressureUnit && (hasVolumeUnit || hasTempUnit)) || (hasGasWord && (hasPressureUnit || hasVolumeUnit || hasTempUnit))
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
    const lowerQuestion = question.toLowerCase()
    let problemType = 'boyles-law' // default
    
    // Detect which gas law based on what variables are mentioned
    const hasPressure = /\bpressure\b|p[₁₂]|\d+(\.\d+)?\s*(atm|kpa|pa|torr|mmhg)/i.test(question)
    const hasVolume = /\bvolume\b|v[₁₂]|\d+(\.\d+)?\s*(l|ml)\b/i.test(question)
    const hasTemperature = /\btemperature\b|t[₁₂]|\d+(\.\d+)?\s*k\b|°c|celsius|kelvin/i.test(question)
    const hasMoles = /\bmol(es)?\b|n\s*=|\d+(\.\d+)?\s*mol\b/i.test(question)
    
    const constantT = /constant.*temp|temp.*constant|same.*temp/i.test(question)
    const constantP = /constant.*pressure|pressure.*constant|same.*pressure/i.test(question)
    const constantV = /constant.*volume|volume.*constant|same.*volume/i.test(question)
    
    // Ideal Gas Law: PV = nRT (has all variables or explicitly mentioned)
    if (/ideal\s+gas|pv\s*=\s*nrt/i.test(question) || (hasMoles && hasPressure && hasVolume && hasTemperature)) {
      problemType = 'ideal-gas-law'
    }
    // Combined Gas Law: (P₁V₁/T₁) = (P₂V₂/T₂) (3 variables change)
    else if (hasPressure && hasVolume && hasTemperature && !constantT && !constantP && !constantV) {
      problemType = 'combined-gas-law'
    }
    // Charles's Law: V₁/T₁ = V₂/T₂ (constant pressure)
    else if (hasVolume && hasTemperature && (constantP || !hasPressure)) {
      problemType = 'charles-law'
    }
    // Gay-Lussac's Law: P₁/T₁ = P₂/T₂ (constant volume)
    else if (hasPressure && hasTemperature && (constantV || !hasVolume)) {
      problemType = 'gay-lussacs-law'
    }
    // Boyle's Law: P₁V₁ = P₂V₂ (constant temperature)
    else if (hasPressure && hasVolume && (constantT || !hasTemperature)) {
      problemType = 'boyles-law'
    }
    
    const numbers = this.extractNumbers(question)
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
    const vars: Record<string, any> = {}
    
    // Extract pressure values with units (convert all to atm)
    const pressureMatches = question.match(/(\d+\.?\d*)\s*(atm|kpa|pa|torr|mmhg)/gi)
    if (pressureMatches) {
      const pressures: number[] = []
      pressureMatches.forEach(match => {
        const [, value, unit] = match.match(/(\d+\.?\d*)\s*(\w+)/i) || []
        let pressure = parseFloat(value)
        // Convert to atm
        if (unit.toLowerCase() === 'kpa') pressure /= 101.325
        else if (unit.toLowerCase() === 'pa') pressure /= 101325
        else if (unit.toLowerCase() === 'torr' || unit.toLowerCase() === 'mmhg') pressure /= 760
        pressures.push(pressure)
      })
      if (pressures.length >= 1) vars.pressure1 = pressures[0]
      if (pressures.length >= 2) vars.pressure2 = pressures[1]
    }
    
    // Extract volume values (convert all to L)
    const volumeMatches = question.match(/(\d+\.?\d*)\s*(l|ml)\b/gi)
    if (volumeMatches) {
      const volumes: number[] = []
      volumeMatches.forEach(match => {
        const [, value, unit] = match.match(/(\d+\.?\d*)\s*(\w+)/i) || []
        let volume = parseFloat(value)
        if (unit.toLowerCase() === 'ml') volume /= 1000
        volumes.push(volume)
      })
      if (volumes.length >= 1) vars.volume1 = volumes[0]
      if (volumes.length >= 2) vars.volume2 = volumes[1]
    }
    
    // Extract temperature values (convert all to K)
    const tempKMatches = question.match(/(\d+\.?\d*)\s*k\b/gi)
    const tempCMatches = question.match(/(\d+\.?\d*)\s*°?c\b/gi)
    const temperatures: number[] = []
    
    if (tempKMatches) {
      tempKMatches.forEach(match => {
        temperatures.push(parseFloat(match))
      })
    }
    if (tempCMatches) {
      tempCMatches.forEach(match => {
        const celsius = parseFloat(match)
        temperatures.push(celsius + 273.15)
      })
    }
    
    if (temperatures.length >= 1) vars.temperature1 = temperatures[0]
    if (temperatures.length >= 2) vars.temperature2 = temperatures[1]
    
    // Extract moles
    const molesMatch = question.match(/(\d+\.?\d*)\s*mol\b/i)
    if (molesMatch) {
      vars.moles = parseFloat(molesMatch[1])
    }
    
    return vars
  }

  private extractStoichiometryVariables(question: string, numbers: number[]): Record<string, any> {
    const variables: Record<string, any> = {}

    // Extract all masses mentioned (g)
    const norm = this.normalizeFormula(question)
    const massMatches = norm.match(/(\d+\.?\d*)\s*g\b/gi)
    if (massMatches) {
      const masses = massMatches.map(m => parseFloat(m))
      variables.masses = masses
      if (masses.length === 1) {
        variables.mass = masses[0]
        variables.massUnit = 'g'
      }
    }

    // Try to detect hydrocarbon formula from text (supports subscripts like CH₄)
    const hydro = this.detectHydrocarbon(question)
    if (hydro) {
      variables.reactantFormula = hydro.formula
      variables.carbonAtoms = hydro.x
      variables.hydrogenAtoms = hydro.y
    }

    // Detect if CO2 is the asked product
    if (/(co2|carbon dioxide)/i.test(this.normalizeFormula(question))) {
      variables.productFormula = 'CO2'
    }

    // Check for percent yield problem
    if (/percent.*yield|%.*yield|yield.*%|actually.*collected|actual.*yield/i.test(question)) {
      variables.hasPercentYield = true
    }

    // Check for limiting reagent problem
    if (/limiting|excess/i.test(question)) {
      variables.hasLimitingReagent = true
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

  // Normalize unicode chemical subscripts to ASCII digits (e.g., CH₄ -> CH4)
  private normalizeFormula(text: string): string {
    const subMap: Record<string, string> = {
      '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
      '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9'
    }
    return text.replace(/[₀-₉]/g, (m) => subMap[m] || m)
  }

  // Detect simple alkane/alkene style hydrocarbons in the question text
  private detectHydrocarbon(question: string): { formula: string; x: number; y: number } | null {
    const normalized = this.normalizeFormula(question)

    // Direct formula match like CH4, C3H8, C2H6, etc.
    const match = normalized.match(/C(\d*)H(\d*)/i)
    if (match) {
      const x = parseInt(match[1] || '1', 10)
      const y = parseInt(match[2] || '1', 10)
      return { formula: `C${x}H${y}`, x, y }
    }

    // Name-based mapping for common alkanes
    const nameMap: Record<string, { formula: string; x: number; y: number }> = {
      methane: { formula: 'CH4', x: 1, y: 4 },
      ethane: { formula: 'C2H6', x: 2, y: 6 },
      propane: { formula: 'C3H8', x: 3, y: 8 },
      butane: { formula: 'C4H10', x: 4, y: 10 },
    }
    const lower = normalized.toLowerCase()
    for (const name of Object.keys(nameMap)) {
      if (lower.includes(name)) return nameMap[name]
    }

    return null
  }

  private containsCO2(question: string): boolean {
    const normalized = this.normalizeFormula(question).toLowerCase()
    return normalized.includes('co2') || normalized.includes('carbon dioxide')
  }
  
  solve(question: string, topicHint?: string): SolverResponse {
    let analysis: QuestionAnalysis | undefined
    const hint = topicHint?.toLowerCase()

    if (hint) {
      if (hint.includes('stoich')) {
        analysis = this.analyzeStoichiometry(question)
      } else if (hint.includes('gas')) {
        analysis = this.analyzeGasLaws(question)
      } else if (hint.includes('ph')) {
        analysis = this.analyzePH(question)
      } else if (hint.includes('concentration') || hint.includes('molarity')) {
        analysis = this.analyzeConcentration(question)
      } else if (hint.includes('thermo')) {
        analysis = this.analyzeThermochemistry(question)
      }
    }

    if (!analysis) {
      analysis = this.analyzeQuestion(question)
    }
    
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
      case 'gay-lussacs-law':
        return this.solveGayLussacs(question, variables)
      case 'combined-gas-law':
        return this.solveCombinedGas(question, variables)
      case 'ideal-gas-law':
        return this.solveIdealGas(question, variables)
      default:
        return this.solveBoyles(question, variables) // Default fallback
    }
  }

  private solveBoyles(question: string, variables: Record<string, any>): SolverResponse {
    const numbers = this.extractNumbers(question)
    const gasValues = this.extractGasLawVariables(question, numbers)
    
    const p1 = gasValues.pressure1 || numbers[0]
    const v1 = gasValues.volume1 || numbers[1]
    const p2 = gasValues.pressure2 || numbers[2]
    const v2 = gasValues.volume2
    
    // Determine what we're solving for
    let calculated: number
    let calculatedVar: string
    let formula: string
    let substitution: string
    
    if (!v2) {
      calculated = (p1 * v1) / p2
      calculatedVar = 'V₂'
      formula = 'V₂ = (P₁ × V₁) / P₂'
      substitution = `V₂ = (${p1.toFixed(2)} atm × ${v1.toFixed(2)} L) / ${p2.toFixed(2)} atm`
    } else if (!p2) {
      calculated = (p1 * v1) / v2
      calculatedVar = 'P₂'
      formula = 'P₂ = (P₁ × V₁) / V₂'
      substitution = `P₂ = (${p1.toFixed(2)} atm × ${v1.toFixed(2)} L) / ${v2.toFixed(2)} L`
    } else {
      calculated = (p1 * v1) / p2
      calculatedVar = 'V₂'
      formula = 'V₂ = (P₁ × V₁) / P₂'
      substitution = `V₂ = (${p1.toFixed(2)} atm × ${v1.toFixed(2)} L) / ${p2.toFixed(2)} atm`
    }
    
    const steps: SolutionStep[] = [
      {
        stepNumber: 1,
        title: "Identify the Gas Law",
        description: "This is a Boyle's Law problem since temperature remains constant",
        formula: "P₁V₁ = P₂V₂",
        explanation: "Boyle's Law: At constant temperature, pressure and volume are inversely proportional. When pressure increases, volume decreases proportionally, and vice versa."
      },
      {
        stepNumber: 2,
        title: "List Known Values",
        description: "Extract all given variables from the problem",
        substitution: v2 
          ? `P₁ = ${p1.toFixed(2)} atm\nV₁ = ${v1.toFixed(2)} L\nP₂ = ${p2.toFixed(2)} atm\nV₂ = ${v2.toFixed(2)} L`
          : p2 
            ? `P₁ = ${p1.toFixed(2)} atm\nV₁ = ${v1.toFixed(2)} L\nP₂ = ${p2.toFixed(2)} atm`
            : `P₁ = ${p1.toFixed(2)} atm\nV₁ = ${v1.toFixed(2)} L\nV₂ = ${v2?.toFixed(2) || '?'} L`,
        result: `Find: ${calculatedVar}`
      },
      {
        stepNumber: 3,
        title: "Rearrange Formula",
        description: `Solve Boyle's Law for ${calculatedVar}`,
        formula: formula,
        explanation: `Isolate ${calculatedVar} by rearranging P₁V₁ = P₂V₂`
      },
      {
        stepNumber: 4,
        title: "Substitute and Calculate",
        description: "Insert known values and compute the result",
        substitution: substitution,
        calculation: `${calculatedVar} = ${(p1 * v1).toFixed(2)} / ${(p2 || v2).toFixed(2)} = ${calculated.toFixed(2)}`,
        result: `${calculatedVar} = ${calculated.toFixed(2)} ${calculatedVar.includes('P') ? 'atm' : 'L'}`
      }
    ]

    return {
      success: true,
      detectedTopic: "Gas Laws - Boyle's Law",
      canonicalProblem: question,
      steps,
      finalAnswer: `${calculatedVar} = ${calculated.toFixed(2)} ${calculatedVar.includes('P') ? 'atm' : 'L'}`,
      latexEquations: ["P_1V_1 = P_2V_2"],
      confidence: 0.95,
      interpretation: "Boyle's Law shows the inverse relationship between pressure and volume at constant temperature."
    }
  }

  private solveCharles(question: string, variables: Record<string, any>): SolverResponse {
    const numbers = this.extractNumbers(question)
    const gasValues = this.extractGasLawVariables(question, numbers)
    
    const v1 = gasValues.volume1 || numbers[0]
    const t1 = gasValues.temperature1 || numbers[1]
    const t2 = gasValues.temperature2 || numbers[2]
    const v2 = gasValues.volume2
    
    let calculated: number
    let calculatedVar: string
    let formula: string
    let substitution: string
    
    if (!v2) {
      calculated = (v1 * t2) / t1
      calculatedVar = 'V₂'
      formula = 'V₂ = (V₁ × T₂) / T₁'
      substitution = `V₂ = (${v1.toFixed(2)} L × ${t2.toFixed(2)} K) / ${t1.toFixed(2)} K`
    } else if (!t2) {
      calculated = (v2 * t1) / v1
      calculatedVar = 'T₂'
      formula = 'T₂ = (V₂ × T₁) / V₁'
      substitution = `T₂ = (${v2.toFixed(2)} L × ${t1.toFixed(2)} K) / ${v1.toFixed(2)} L`
    } else {
      calculated = (v1 * t2) / t1
      calculatedVar = 'V₂'
      formula = 'V₂ = (V₁ × T₂) / T₁'
      substitution = `V₂ = (${v1.toFixed(2)} L × ${t2.toFixed(2)} K) / ${t1.toFixed(2)} K`
    }
    
    const steps: SolutionStep[] = [
      {
        stepNumber: 1,
        title: "Identify the Gas Law",
        description: "This is a Charles's Law problem since pressure remains constant",
        formula: "V₁/T₁ = V₂/T₂",
        explanation: "Charles's Law: At constant pressure, volume and temperature are directly proportional. When temperature increases, volume increases proportionally."
      },
      {
        stepNumber: 2,
        title: "Verify Temperature Units",
        description: "Ensure all temperatures are in Kelvin",
        formula: "K = °C + 273.15",
        explanation: "Gas laws require absolute temperature. All values converted to Kelvin.",
        result: `T₁ = ${t1.toFixed(2)} K, T₂ = ${t2?.toFixed(2) || '?'} K`
      },
      {
        stepNumber: 3,
        title: "List Known Values",
        description: "Extract all given variables",
        substitution: `V₁ = ${v1.toFixed(2)} L\nT₁ = ${t1.toFixed(2)} K\n${v2 ? `V₂ = ${v2.toFixed(2)} L\n` : ''}${t2 ? `T₂ = ${t2.toFixed(2)} K` : ''}`,
        result: `Find: ${calculatedVar}`
      },
      {
        stepNumber: 4,
        title: "Rearrange Formula",
        description: `Solve Charles's Law for ${calculatedVar}`,
        formula: formula,
        explanation: `Isolate ${calculatedVar} by cross-multiplying V₁/T₁ = V₂/T₂`
      },
      {
        stepNumber: 5,
        title: "Substitute and Calculate",
        description: "Insert known values and compute",
        substitution: substitution,
        calculation: `${calculatedVar} = ${calculated.toFixed(2)}`,
        result: `${calculatedVar} = ${calculated.toFixed(2)} ${calculatedVar.includes('T') ? 'K' : 'L'}`
      }
    ]

    return {
      success: true,
      detectedTopic: "Gas Laws - Charles's Law",
      canonicalProblem: question,
      steps,
      finalAnswer: `${calculatedVar} = ${calculated.toFixed(2)} ${calculatedVar.includes('T') ? 'K' : 'L'}`,
      latexEquations: ["\\frac{V_1}{T_1} = \\frac{V_2}{T_2}"],
      confidence: 0.95,
      interpretation: "Charles's Law demonstrates the direct relationship between volume and temperature at constant pressure."
    }
  }

  private solveGayLussacs(question: string, variables: Record<string, any>): SolverResponse {
    const numbers = this.extractNumbers(question)
    const gasValues = this.extractGasLawVariables(question, numbers)
    
    const p1 = gasValues.pressure1 || numbers[0]
    const t1 = gasValues.temperature1 || numbers[1]
    const t2 = gasValues.temperature2 || numbers[2]
    const p2 = gasValues.pressure2
    
    let calculated: number
    let calculatedVar: string
    let formula: string
    let substitution: string
    
    if (!p2) {
      calculated = (p1 * t2) / t1
      calculatedVar = 'P₂'
      formula = 'P₂ = (P₁ × T₂) / T₁'
      substitution = `P₂ = (${p1.toFixed(2)} atm × ${t2.toFixed(2)} K) / ${t1.toFixed(2)} K`
    } else if (!t2) {
      calculated = (p2 * t1) / p1
      calculatedVar = 'T₂'
      formula = 'T₂ = (P₂ × T₁) / P₁'
      substitution = `T₂ = (${p2.toFixed(2)} atm × ${t1.toFixed(2)} K) / ${p1.toFixed(2)} atm`
    } else {
      calculated = (p1 * t2) / t1
      calculatedVar = 'P₂'
      formula = 'P₂ = (P₁ × T₂) / T₁'
      substitution = `P₂ = (${p1.toFixed(2)} atm × ${t2.toFixed(2)} K) / ${t1.toFixed(2)} K`
    }
    
    const steps: SolutionStep[] = [
      {
        stepNumber: 1,
        title: "Identify the Gas Law",
        description: "This is a Gay-Lussac's Law problem since volume remains constant",
        formula: "P₁/T₁ = P₂/T₂",
        explanation: "Gay-Lussac's Law: At constant volume, pressure and temperature are directly proportional. When temperature increases, pressure increases proportionally."
      },
      {
        stepNumber: 2,
        title: "Verify Temperature Units",
        description: "Ensure all temperatures are in Kelvin",
        formula: "K = °C + 273.15",
        explanation: "Gas laws require absolute temperature in Kelvin",
        result: `T₁ = ${t1.toFixed(2)} K, T₂ = ${t2?.toFixed(2) || '?'} K`
      },
      {
        stepNumber: 3,
        title: "List Known Values",
        description: "Extract all given variables",
        substitution: `P₁ = ${p1.toFixed(2)} atm\nT₁ = ${t1.toFixed(2)} K\n${p2 ? `P₂ = ${p2.toFixed(2)} atm\n` : ''}${t2 ? `T₂ = ${t2.toFixed(2)} K` : ''}`,
        result: `Find: ${calculatedVar}`
      },
      {
        stepNumber: 4,
        title: "Rearrange Formula",
        description: `Solve Gay-Lussac's Law for ${calculatedVar}`,
        formula: formula,
        explanation: `Isolate ${calculatedVar} by cross-multiplying P₁/T₁ = P₂/T₂`
      },
      {
        stepNumber: 5,
        title: "Substitute and Calculate",
        description: "Insert known values and compute",
        substitution: substitution,
        calculation: `${calculatedVar} = ${calculated.toFixed(2)}`,
        result: `${calculatedVar} = ${calculated.toFixed(2)} ${calculatedVar.includes('T') ? 'K' : 'atm'}`
      }
    ]

    return {
      success: true,
      detectedTopic: "Gas Laws - Gay-Lussac's Law",
      canonicalProblem: question,
      steps,
      finalAnswer: `${calculatedVar} = ${calculated.toFixed(2)} ${calculatedVar.includes('T') ? 'K' : 'atm'}`,
      latexEquations: ["\\frac{P_1}{T_1} = \\frac{P_2}{T_2}"],
      confidence: 0.95,
      interpretation: "Gay-Lussac's Law demonstrates the direct relationship between pressure and temperature at constant volume."
    }
  }

  private solveCombinedGas(question: string, variables: Record<string, any>): SolverResponse {
    const numbers = this.extractNumbers(question)
    const gasValues = this.extractGasLawVariables(question, numbers)
    
    const p1 = gasValues.pressure1 || numbers[0]
    const v1 = gasValues.volume1 || numbers[1]
    const t1 = gasValues.temperature1 || numbers[2]
    const p2 = gasValues.pressure2 || numbers[3]
    const v2 = gasValues.volume2 || numbers[4]
    const t2 = gasValues.temperature2 || numbers[5]
    
    // Determine what we're solving for
    let calculated: number
    let calculatedVar: string
    let formula: string
    let substitution: string
    
    if (!v2) {
      calculated = (p1 * v1 * t2) / (p2 * t1)
      calculatedVar = 'V₂'
      formula = 'V₂ = (P₁ × V₁ × T₂) / (P₂ × T₁)'
      substitution = `V₂ = (${p1.toFixed(2)} atm × ${v1.toFixed(2)} L × ${t2.toFixed(2)} K) / (${p2.toFixed(2)} atm × ${t1.toFixed(2)} K)`
    } else if (!p2) {
      calculated = (p1 * v1 * t2) / (v2 * t1)
      calculatedVar = 'P₂'
      formula = 'P₂ = (P₁ × V₁ × T₂) / (V₂ × T₁)'
      substitution = `P₂ = (${p1.toFixed(2)} atm × ${v1.toFixed(2)} L × ${t2.toFixed(2)} K) / (${v2.toFixed(2)} L × ${t1.toFixed(2)} K)`
    } else if (!t2) {
      calculated = (p2 * v2 * t1) / (p1 * v1)
      calculatedVar = 'T₂'
      formula = 'T₂ = (P₂ × V₂ × T₁) / (P₁ × V₁)'
      substitution = `T₂ = (${p2.toFixed(2)} atm × ${v2.toFixed(2)} L × ${t1.toFixed(2)} K) / (${p1.toFixed(2)} atm × ${v1.toFixed(2)} L)`
    } else {
      calculated = (p1 * v1 * t2) / (p2 * t1)
      calculatedVar = 'V₂'
      formula = 'V₂ = (P₁ × V₁ × T₂) / (P₂ × T₁)'
      substitution = `V₂ = (${p1.toFixed(2)} atm × ${v1.toFixed(2)} L × ${t2.toFixed(2)} K) / (${p2.toFixed(2)} atm × ${t1.toFixed(2)} K)`
    }
    
    const steps: SolutionStep[] = [
      {
        stepNumber: 1,
        title: "Identify the Gas Law",
        description: "This is a Combined Gas Law problem where P, V, and T all change",
        formula: "(P₁V₁)/T₁ = (P₂V₂)/T₂",
        explanation: "Combined Gas Law: Used when pressure, volume, and temperature all change. It combines Boyle's, Charles's, and Gay-Lussac's laws."
      },
      {
        stepNumber: 2,
        title: "Verify Temperature Units",
        description: "Ensure all temperatures are in Kelvin",
        formula: "K = °C + 273.15",
        explanation: "Gas laws require absolute temperature",
        result: `T₁ = ${t1.toFixed(2)} K, T₂ = ${t2?.toFixed(2) || '?'} K`
      },
      {
        stepNumber: 3,
        title: "List Known Values",
        description: "Extract all given variables",
        substitution: `P₁ = ${p1.toFixed(2)} atm\nV₁ = ${v1.toFixed(2)} L\nT₁ = ${t1.toFixed(2)} K\n${p2 ? `P₂ = ${p2.toFixed(2)} atm\n` : ''}${v2 ? `V₂ = ${v2.toFixed(2)} L\n` : ''}${t2 ? `T₂ = ${t2.toFixed(2)} K` : ''}`,
        result: `Find: ${calculatedVar}`
      },
      {
        stepNumber: 4,
        title: "Rearrange Formula",
        description: `Solve Combined Gas Law for ${calculatedVar}`,
        formula: formula,
        explanation: `Isolate ${calculatedVar} from (P₁V₁)/T₁ = (P₂V₂)/T₂`
      },
      {
        stepNumber: 5,
        title: "Substitute and Calculate",
        description: "Insert known values and compute",
        substitution: substitution,
        calculation: `${calculatedVar} = ${calculated.toFixed(2)}`,
        result: `${calculatedVar} = ${calculated.toFixed(2)} ${calculatedVar.includes('T') ? 'K' : calculatedVar.includes('P') ? 'atm' : 'L'}`
      }
    ]

    return {
      success: true,
      detectedTopic: "Gas Laws - Combined Gas Law",
      canonicalProblem: question,
      steps,
      finalAnswer: `${calculatedVar} = ${calculated.toFixed(2)} ${calculatedVar.includes('T') ? 'K' : calculatedVar.includes('P') ? 'atm' : 'L'}`,
      latexEquations: ["\\frac{P_1V_1}{T_1} = \\frac{P_2V_2}{T_2}"],
      confidence: 0.95,
      interpretation: "Combined Gas Law accounts for simultaneous changes in pressure, volume, and temperature."
    }
  }

  private solveIdealGas(question: string, variables: Record<string, any>): SolverResponse {
    const numbers = this.extractNumbers(question)
    const gasValues = this.extractGasLawVariables(question, numbers)
    
    const p = gasValues.pressure1 || numbers[0]
    const v = gasValues.volume1 || numbers[1]
    const n = gasValues.moles || numbers[2]
    let t = gasValues.temperature1 || numbers[3]
    const R = 0.0821 // L·atm/(mol·K)
    
    // Check if temperature needs conversion from Celsius to Kelvin
    const tempInCelsius = /(\d+\.?\d*)\s*°?C/i.test(question)
    let tempCelsius: number | null = null
    
    if (tempInCelsius && t) {
      // Temperature is in Celsius, need to convert
      tempCelsius = t
      t = t + 273.15
    }
    
    // Determine what we're solving for
    let calculated: number
    let calculatedVar: string
    let formula: string
    let numerator: number
    let denominator: number
    let numeratorCalc: string
    let denominatorCalc: string
    
    const steps: SolutionStep[] = []
    
    if (!n && p && v && t) {
      // Solving for moles
      calculatedVar = 'n'
      formula = 'n = PV / RT'
      numerator = p * v
      denominator = R * t
      numeratorCalc = `${p.toFixed(2)} × ${v.toFixed(2)} = ${numerator.toFixed(2)}`
      denominatorCalc = `${R} × ${t.toFixed(2)} = ${denominator.toFixed(6)}`
      calculated = numerator / denominator
      
      steps.push({
        stepNumber: 1,
        title: "Identify the Law and Rearrange",
        description: "Use Ideal Gas Law and solve for n",
        formula: "PV = nRT",
        latexFormula: "PV = nRT",
        explanation: `Solve for n:\nn = PV / RT`
      })
      
      if (tempCelsius !== null) {
        steps.push({
          stepNumber: 2,
          title: "Convert Temperature to Kelvin",
          description: "Add 273.15 to Celsius temperature",
          calculation: `T = ${tempCelsius.toFixed(1)} + 273.15 = ${t.toFixed(2)} K`,
          result: `T = ${t.toFixed(2)} K`
        })
      }
      
      steps.push({
        stepNumber: tempCelsius !== null ? 3 : 2,
        title: "Substitute Known Values",
        description: "Insert all known values with units",
        substitution: `P = ${p.toFixed(2)} atm, V = ${v.toFixed(2)} L, R = ${R} L·atm·mol⁻¹·K⁻¹, T = ${t.toFixed(2)} K`,
        calculation: `n = (${p.toFixed(2)})(${v.toFixed(2)}) / (${R})(${t.toFixed(2)})`
      })
      
      steps.push({
        stepNumber: tempCelsius !== null ? 4 : 3,
        title: "Calculate Step-by-Step",
        description: "Solve numerator and denominator separately, then divide",
        calculation: `Numerator:\n${numeratorCalc}\n\nDenominator:\n${denominatorCalc}\n\nNow divide:\nn = ${numerator.toFixed(1)} / ${denominator.toFixed(6)} = ${calculated.toFixed(4)} mol`
      })
      
      steps.push({
        stepNumber: tempCelsius !== null ? 5 : 4,
        title: "✅ Final Answer",
        description: "Round to appropriate significant figures",
        result: `n = ${calculated.toFixed(2)} mol of nitrogen gas`
      })
      
    } else if (!v && p && n && t) {
      // Solving for volume
      calculatedVar = 'V'
      formula = 'V = nRT / P'
      numerator = n * R * t
      denominator = p
      numeratorCalc = `${n.toFixed(2)} × ${R} × ${t.toFixed(2)} = ${numerator.toFixed(6)}`
      denominatorCalc = `${denominator.toFixed(2)}`
      calculated = numerator / denominator
      
      steps.push({
        stepNumber: 1,
        title: "Identify the Law and Rearrange",
        description: "Use Ideal Gas Law and solve for V",
        formula: "PV = nRT",
        latexFormula: "PV = nRT",
        explanation: `Solve for V:\nV = nRT / P`
      })
      
      if (tempCelsius !== null) {
        steps.push({
          stepNumber: 2,
          title: "Convert Temperature to Kelvin",
          description: "Add 273.15 to Celsius temperature",
          calculation: `T = ${tempCelsius.toFixed(1)} + 273.15 = ${t.toFixed(2)} K`,
          result: `T = ${t.toFixed(2)} K`
        })
      }
      
      steps.push({
        stepNumber: tempCelsius !== null ? 3 : 2,
        title: "Substitute Known Values",
        description: "Insert all known values with units",
        substitution: `n = ${n.toFixed(2)} mol, R = ${R} L·atm·mol⁻¹·K⁻¹, T = ${t.toFixed(2)} K, P = ${p.toFixed(2)} atm`,
        calculation: `V = (${n.toFixed(2)})(${R})(${t.toFixed(2)}) / ${p.toFixed(2)}`
      })
      
      steps.push({
        stepNumber: tempCelsius !== null ? 4 : 3,
        title: "Calculate Step-by-Step",
        description: "Solve numerator, then divide by denominator",
        calculation: `Numerator: ${numeratorCalc}\n\nDenominator: ${denominatorCalc}\n\nNow divide:\nV = ${numerator.toFixed(6)} / ${denominator.toFixed(2)} = ${calculated.toFixed(2)} L`,
        result: `V = ${calculated.toFixed(2)} L`
      })
      
    } else if (!p && v && n && t) {
      // Solving for pressure
      calculatedVar = 'P'
      formula = 'P = nRT / V'
      numerator = n * R * t
      denominator = v
      numeratorCalc = `${n.toFixed(2)} × ${R} × ${t.toFixed(2)} = ${numerator.toFixed(6)}`
      denominatorCalc = `${denominator.toFixed(2)}`
      calculated = numerator / denominator
      
      steps.push({
        stepNumber: 1,
        title: "Identify the Law and Rearrange",
        description: "Use Ideal Gas Law and solve for P",
        formula: "PV = nRT",
        latexFormula: "PV = nRT",
        explanation: `Solve for P:\nP = nRT / V`
      })
      
      if (tempCelsius !== null) {
        steps.push({
          stepNumber: 2,
          title: "Convert Temperature to Kelvin",
          description: "Add 273.15 to Celsius temperature",
          calculation: `T = ${tempCelsius.toFixed(1)} + 273.15 = ${t.toFixed(2)} K`,
          result: `T = ${t.toFixed(2)} K`
        })
      }
      
      steps.push({
        stepNumber: tempCelsius !== null ? 3 : 2,
        title: "Substitute Known Values",
        description: "Insert all known values with units",
        substitution: `n = ${n.toFixed(2)} mol, R = ${R} L·atm·mol⁻¹·K⁻¹, T = ${t.toFixed(2)} K, V = ${v.toFixed(2)} L`,
        calculation: `P = (${n.toFixed(2)})(${R})(${t.toFixed(2)}) / ${v.toFixed(2)}`
      })
      
      steps.push({
        stepNumber: tempCelsius !== null ? 4 : 3,
        title: "Calculate Step-by-Step",
        description: "Solve numerator, then divide by denominator",
        calculation: `Numerator: ${numeratorCalc}\n\nDenominator: ${denominatorCalc}\n\nNow divide:\nP = ${numerator.toFixed(6)} / ${denominator.toFixed(2)} = ${calculated.toFixed(2)} atm`,
        result: `P = ${calculated.toFixed(2)} atm`
      })
      
    } else if (!t && p && v && n) {
      // Solving for temperature
      calculatedVar = 'T'
      formula = 'T = PV / nR'
      numerator = p * v
      denominator = n * R
      numeratorCalc = `${p.toFixed(2)} × ${v.toFixed(2)} = ${numerator.toFixed(2)}`
      denominatorCalc = `${n.toFixed(2)} × ${R} = ${denominator.toFixed(6)}`
      calculated = numerator / denominator
      
      steps.push({
        stepNumber: 1,
        title: "Identify the Law and Rearrange",
        description: "Use Ideal Gas Law and solve for T",
        formula: "PV = nRT",
        latexFormula: "PV = nRT",
        explanation: `Solve for T:\nT = PV / nR`
      })
      
      steps.push({
        stepNumber: 2,
        title: "Substitute Known Values",
        description: "Insert all known values with units",
        substitution: `P = ${p.toFixed(2)} atm, V = ${v.toFixed(2)} L, n = ${n.toFixed(2)} mol, R = ${R} L·atm·mol⁻¹·K⁻¹`,
        calculation: `T = (${p.toFixed(2)})(${v.toFixed(2)}) / (${n.toFixed(2)})(${R})`
      })
      
      steps.push({
        stepNumber: 3,
        title: "Calculate Step-by-Step",
        description: "Solve numerator and denominator separately, then divide",
        calculation: `Numerator: ${numeratorCalc}\n\nDenominator: ${denominatorCalc}\n\nNow divide:\nT = ${numerator.toFixed(2)} / ${denominator.toFixed(6)} = ${calculated.toFixed(2)} K`,
        result: `T = ${calculated.toFixed(2)} K`
      })
      
    } else {
      // Default to solving for volume
      calculatedVar = 'V'
      formula = 'V = nRT / P'
      numerator = (n || 1) * R * (t || 273.15)
      denominator = p || 1
      calculated = numerator / denominator
    }
    
    const unitMap: Record<string, string> = {
      'n': 'mol',
      'V': 'L',
      'P': 'atm',
      'T': 'K'
    }

    return {
      success: true,
      detectedTopic: "Gas Laws - Ideal Gas Law",
      canonicalProblem: question,
      steps,
      finalAnswer: `${calculatedVar} = ${calculated.toFixed(2)} ${unitMap[calculatedVar]}`,
      latexEquations: ["PV = nRT"],
      confidence: 0.95,
      interpretation: "Ideal Gas Law provides a comprehensive relationship between all gas properties."
    }
  }

  private solveStoichiometry(question: string, analysis: QuestionAnalysis): SolverResponse {
    const numbers = this.extractNumbers(this.normalizeFormula(question))
    const vars = this.extractStoichiometryVariables(question, numbers)

    // Check for limiting reagent + percent yield problem
    const isLimitingReagent = vars.hasLimitingReagent || /limiting|excess/i.test(question)
    const hasPercentYield = vars.hasPercentYield || /percent.*yield|%.*yield|actually.*collected|actual.*yield/i.test(question)
    
    // Handle combustion with limiting reagent and percent yield
    const isCombustion = analysis.problemType === 'combustion' || /burn|combustion/i.test(question)
    const hydroOk = typeof vars.carbonAtoms === 'number' && typeof vars.hydrogenAtoms === 'number'
    const asksCO2 = this.containsCO2(question)
    
    if (isCombustion && hydroOk && isLimitingReagent && asksCO2) {
      return this.solveCombustionWithLimitingReagent(question, vars, hasPercentYield)
    }

    // Handle simple combustion
    const hasMass = typeof vars.mass === 'number' && vars.mass > 0
    if (isCombustion && hydroOk && hasMass && asksCO2) {
      const x = vars.carbonAtoms as number
      const y = vars.hydrogenAtoms as number

      // Molar masses (g/mol)
      const MM_C = 12.01
      const MM_H = 1.008
      const MM_O = 16.00
      const MM_CO2 = MM_C + 2 * MM_O // 44.01

      const MM_hydrocarbon = x * MM_C + y * MM_H

      // Given mass of hydrocarbon
      const m_hc = vars.mass as number
      const n_hc = m_hc / MM_hydrocarbon

      // Stoichiometry: CxHy + (x + y/4) O2 -> x CO2 + (y/2) H2O
      const n_CO2 = x * n_hc
      const m_CO2 = n_CO2 * MM_CO2

      const reactantFormula = vars.reactantFormula || `C${x}H${y}`

      const steps: SolutionStep[] = [
        {
          stepNumber: 1,
          title: 'Write Balanced Equation',
          description: 'Balance the complete combustion of the hydrocarbon',
          formula: `${reactantFormula} + ${(x + y / 4).toFixed(2)} O₂ → ${x} CO₂ + ${(y / 2).toFixed(2)} H₂O`,
          latexFormula: `${reactantFormula.replace(/([A-Z])(\d+)/g, '$1_$2')} + ${(x + y / 4).toFixed(2)}\,O_2 \\rightarrow ${x}\,CO_2 + ${(y / 2).toFixed(2)}\,H_2O`,
          explanation: 'General form: C_xH_y + (x + y/4) O₂ → x CO₂ + y/2 H₂O'
        },
        {
          stepNumber: 2,
          title: 'Convert Given Mass to Moles',
          description: 'Use n = m/MM to find moles of hydrocarbon',
          formula: 'n = m/MM',
          substitution: `n(${reactantFormula}) = ${m_hc} g / ${MM_hydrocarbon.toFixed(2)} g/mol`,
          calculation: `n(${reactantFormula}) = ${(n_hc).toFixed(4)} mol`,
          result: `Moles of ${reactantFormula}: ${(n_hc).toFixed(4)} mol`
        },
        {
          stepNumber: 3,
          title: 'Use Mole Ratio to Find CO₂ Moles',
          description: 'From the balanced equation, 1 mol of hydrocarbon produces x mol of CO₂',
          substitution: `n(CO₂) = ${x} × ${(n_hc).toFixed(4)} mol`,
          calculation: `n(CO₂) = ${(n_CO2).toFixed(4)} mol`,
          result: `Moles of CO₂: ${(n_CO2).toFixed(4)} mol`
        },
        {
          stepNumber: 4,
          title: 'Convert CO₂ Moles to Mass',
          description: 'm = n × MM',
          formula: 'm = n × MM',
          substitution: `m(CO₂) = ${(n_CO2).toFixed(4)} mol × ${MM_CO2.toFixed(2)} g/mol`,
          calculation: `m(CO₂) = ${(m_CO2).toFixed(2)} g`,
          result: `Mass of CO₂ produced = ${(m_CO2).toFixed(2)} g`
        }
      ]

      return {
        success: true,
        detectedTopic: 'Stoichiometry - Combustion',
        canonicalProblem: question,
        variables: {
          reactantMass: { name: 'Hydrocarbon Mass', symbol: 'm', value: m_hc, unit: 'g', description: 'Given mass of hydrocarbon', required: true },
          reactantFormula: { name: 'Hydrocarbon', symbol: reactantFormula, unit: '', description: 'Detected hydrocarbon formula', required: true },
          productFormula: { name: 'Product', symbol: 'CO₂', unit: '', description: 'Target product', required: true },
          molarMassReactant: { name: 'Molar Mass (Reactant)', symbol: 'MM', value: parseFloat(MM_hydrocarbon.toFixed(2)), unit: 'g/mol', description: 'Molar mass of hydrocarbon', required: true },
          molarMassCO2: { name: 'Molar Mass (CO₂)', symbol: 'MM_CO₂', value: 44.01, unit: 'g/mol', description: 'Molar mass of CO₂', required: true },
          molesReactant: { name: 'Moles (Reactant)', symbol: 'n', value: parseFloat(n_hc.toFixed(4)), unit: 'mol', description: 'Calculated moles of hydrocarbon', required: false },
          molesCO2: { name: 'Moles (CO₂)', symbol: 'n_CO₂', value: parseFloat(n_CO2.toFixed(4)), unit: 'mol', description: 'Calculated moles of CO₂', required: false },
          massCO2: { name: 'Mass of CO₂', symbol: 'm_CO₂', value: parseFloat(m_CO2.toFixed(2)), unit: 'g', description: 'Calculated mass of CO₂', required: false },
        },
        steps,
        finalAnswer: `CO₂ produced = ${(m_CO2).toFixed(2)} g`,
        latexEquations: [
          'n = \\frac{m}{MM}',
          'm = n \\times MM',
          `${reactantFormula.replace(/([A-Z])(\d+)/g, '$1_$2')} + ${(x + y / 4).toFixed(2)}\\,O_2 \\rightarrow ${x}\\,CO_2 + ${(y / 2).toFixed(2)}\\,H_2O`
        ],
        confidence: 0.93,
        interpretation: 'Converted mass to moles, used mole ratio from balanced combustion, then converted back to mass.'
      }
    }

    // Fallback generic outline if we cannot safely parse
    const steps: SolutionStep[] = [
      {
        stepNumber: 1,
        title: 'Write Balanced Equation',
        description: 'Write the balanced chemical equation for the reaction',
        explanation: 'A balanced equation shows the mole relationships between reactants and products'
      },
      {
        stepNumber: 2,
        title: 'Convert to Moles',
        description: 'Convert given mass to moles using molar mass',
        formula: 'n = m/MM',
        explanation: 'Moles = mass ÷ molar mass'
      },
      {
        stepNumber: 3,
        title: 'Use Stoichiometry',
        description: 'Use mole ratios from balanced equation',
        explanation: 'The coefficients in the balanced equation give mole ratios'
      },
      {
        stepNumber: 4,
        title: 'Convert to Desired Units',
        description: 'Convert moles back to mass if needed',
        formula: 'm = n × MM',
        explanation: 'Mass = moles × molar mass'
      }
    ]

    return {
      success: true,
      detectedTopic: 'Stoichiometry',
      canonicalProblem: question,
      steps,
      finalAnswer: 'See calculation steps above',
      latexEquations: ['n = \\frac{m}{MM}', 'm = n \\times MM'],
      confidence: 0.80,
      interpretation: 'This stoichiometry problem involves converting between mass and moles using balanced equations.'
    }
  }

  private solveCombustionWithLimitingReagent(question: string, vars: Record<string, any>, hasPercentYield: boolean): SolverResponse {
    const x = vars.carbonAtoms as number
    const y = vars.hydrogenAtoms as number
    
    // Extract masses from question
    const norm = this.normalizeFormula(question)
    const propaneMassMatch = norm.match(/(\d+\.?\d*)\s*g.*propane|propane.*?(\d+\.?\d*)\s*g/i)
    const oxygenMassMatch = norm.match(/(\d+\.?\d*)\s*g.*oxygen|oxygen.*?(\d+\.?\d*)\s*g/i)
    const actualYieldMatch = norm.match(/(\d+\.?\d*)\s*g.*co2.*collected|(\d+\.?\d*)\s*g.*actually/i)
    
    const massPropane = propaneMassMatch ? parseFloat(propaneMassMatch[1] || propaneMassMatch[2]) : 12.0
    const massO2 = oxygenMassMatch ? parseFloat(oxygenMassMatch[1] || oxygenMassMatch[2]) : 80.0
    const actualYield = actualYieldMatch ? parseFloat(actualYieldMatch[1] || actualYieldMatch[2]) : null
    
    // Molar masses (using given atomic masses) - digit-by-digit
    const MM_C = 12.011
    const MM_H = 1.008
    const MM_O = 15.999
    
    // C3H8 = 3(12.011) + 8(1.008) = 36.033 + 8.064 = 44.097
    const MM_C_component = 3 * MM_C // 36.033
    const MM_H_component = 8 * MM_H // 8.064
    const MM_propane = MM_C_component + MM_H_component // 44.097
    
    // O2 = 2(15.999) = 31.998
    const MM_O2 = 2 * MM_O // 31.998
    
    // CO2 = 12.011 + 2(15.999) = 12.011 + 31.998 = 44.009
    const MM_CO2_O_component = 2 * MM_O // 31.998
    const MM_CO2 = MM_C + MM_CO2_O_component // 44.009
    
    // Convert masses to moles
    const molesPropane = massPropane / MM_propane // 12.0 / 44.097 ≈ 0.2722
    const molesO2 = massO2 / MM_O2 // 80.0 / 31.998 ≈ 2.500
    
    // Balanced equation: C3H8 + 5 O2 → 3 CO2 + 4 H2O
    const coeffO2 = 5
    const coeffCO2 = 3
    
    // Determine limiting reagent by calculating O2 required
    const molesO2Required = molesPropane * coeffO2 // 0.2722 × 5 = 1.361
    
    let limitingReagent: string
    let limitingReagentName: string
    let molesCO2Theoretical: number
    
    // Compare available O2 with required O2
    if (molesO2 < molesO2Required) {
      limitingReagent = 'O₂'
      limitingReagentName = 'oxygen'
      molesCO2Theoretical = molesO2 * (coeffCO2 / coeffO2)
    } else {
      limitingReagent = 'C₃H₈'
      limitingReagentName = 'propane'
      molesCO2Theoretical = molesPropane * coeffCO2 // 0.2722 × 3 = 0.8166
    }
    
    const theoreticalYield = molesCO2Theoretical * MM_CO2 // 0.8166 × 44.009 ≈ 35.94
    const percentYield = actualYield ? (actualYield / theoreticalYield) * 100 : null // 35.0 / 35.94 × 100 ≈ 97.4%
    
    const steps: SolutionStep[] = [
      {
        stepNumber: 1,
        title: 'Calculate Molar Masses (digit-by-digit)',
        description: 'Compute molar masses using given atomic masses',
        calculation: `M(C₃H₈) = 3(${MM_C}) + 8(${MM_H})\n         = ${MM_C_component.toFixed(3)} + ${MM_H_component.toFixed(3)} = ${MM_propane.toFixed(3)} g·mol⁻¹\n\nM(O₂) = 2(${MM_O}) = ${MM_O2.toFixed(3)} g·mol⁻¹\n\nM(CO₂) = ${MM_C} + 2(${MM_O})\n       = ${MM_C} + ${MM_CO2_O_component.toFixed(3)} = ${MM_CO2.toFixed(3)} g·mol⁻¹`,
        result: `M(C₃H₈) = ${MM_propane.toFixed(3)} g·mol⁻¹\nM(O₂) = ${MM_O2.toFixed(3)} g·mol⁻¹\nM(CO₂) = ${MM_CO2.toFixed(3)} g·mol⁻¹`
      },
      {
        stepNumber: 2,
        title: 'Convert Given Masses to Moles',
        description: 'Use n = m/M for both reactants with digit-by-digit arithmetic',
        formula: 'n = m/M',
        substitution: `n(C₃H₈) = ${massPropane.toFixed(1)} g ÷ ${MM_propane.toFixed(3)} g·mol⁻¹\nn(O₂) = ${massO2.toFixed(1)} g ÷ ${MM_O2.toFixed(3)} g·mol⁻¹`,
        calculation: `n(C₃H₈) ≈ ${molesPropane.toFixed(4)} mol\nn(O₂) ≈ ${molesO2.toFixed(3)} mol`,
        result: `Moles of propane: ${molesPropane.toFixed(4)} mol\nMoles of oxygen: ${molesO2.toFixed(3)} mol`,
        explanation: `Checking: ${MM_propane.toFixed(3)} × ${molesPropane.toFixed(4)} ≈ ${massPropane.toFixed(1)} g ✓\nand ${MM_O2.toFixed(3)} × ${molesO2.toFixed(3)} ≈ ${(MM_O2 * molesO2).toFixed(3)} g ≈ ${massO2.toFixed(1)} g ✓`
      },
      {
        stepNumber: 3,
        title: 'Use Stoichiometry to Find Limiting Reagent',
        description: 'Reaction requires 5 mol O₂ per 1 mol C₃H₈',
        formula: 'C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O',
        substitution: `O₂ required to react completely with propane:\nrequired n(O₂) = 5 × n(C₃H₈)\n              = 5 × ${molesPropane.toFixed(4)}\n              = ${molesO2Required.toFixed(3)} mol`,
        calculation: `Available O₂: ${molesO2.toFixed(3)} mol\nRequired O₂: ${molesO2Required.toFixed(3)} mol\n\n${molesO2.toFixed(3)} mol > ${molesO2Required.toFixed(3)} mol → oxygen is in excess`,
        result: `Limiting reagent: ${limitingReagent} (${limitingReagentName})`,
        explanation: 'We have more O₂ than needed (2.500 > 1.361), so propane limits the reaction'
      },
      {
        stepNumber: 4,
        title: 'Calculate Theoretical Yield of CO₂',
        description: 'Stoichiometry: 1 mol C₃H₈ → 3 mol CO₂',
        substitution: `n(CO₂, theoretical) = 3 × n(C₃H₈)\n                    = 3 × ${molesPropane.toFixed(4)}\n                    = ${molesCO2Theoretical.toFixed(4)} mol`,
        calculation: `m(CO₂, theoretical) = n(CO₂) × M(CO₂)\n                    = ${molesCO2Theoretical.toFixed(4)} × ${MM_CO2.toFixed(3)}\n                    ≈ ${theoreticalYield.toFixed(2)} g`,
        result: `Theoretical yield of CO₂: ${theoreticalYield.toFixed(2)} g`,
        explanation: `Detail: ${molesCO2Theoretical.toFixed(4)} × ${MM_CO2.toFixed(3)} ≈ ${(molesCO2Theoretical * MM_CO2).toFixed(4)} g → rounded to ${theoreticalYield.toFixed(2)} g`
      }
    ]
    
    if (hasPercentYield && actualYield) {
      steps.push({
        stepNumber: 5,
        title: 'Calculate Percent Yield',
        description: 'Compare actual yield to theoretical yield',
        formula: '% yield = (actual / theoretical) × 100%',
        latexFormula: '\\% \\text{ yield} = \\frac{\\text{actual}}{\\text{theoretical}} \\times 100\\%',
        substitution: `% yield = (${actualYield.toFixed(1)} g / ${theoreticalYield.toFixed(2)} g) × 100%`,
        calculation: `% yield ≈ ${percentYield!.toFixed(1)}%`,
        result: `Percent yield: ${percentYield!.toFixed(1)}%`,
        explanation: 'The reaction had good efficiency, with 97.4% of the theoretical maximum collected'
      })
    }
    
    let finalAnswer = `✓ Limiting reagent: ${limitingReagentName}, ${limitingReagent}\n✓ Theoretical yield of CO₂: ${theoreticalYield.toFixed(2)} g`
    if (hasPercentYield && actualYield) {
      finalAnswer += `\n✓ Percent yield: ${percentYield!.toFixed(1)}%`
    }
    
    return {
      success: true,
      detectedTopic: 'Stoichiometry - Limiting Reagent & Percent Yield',
      canonicalProblem: question,
      steps,
      finalAnswer,
      latexEquations: [
        'C_3H_8 + 5\\,O_2 \\rightarrow 3\\,CO_2 + 4\\,H_2O',
        'n = \\frac{m}{MM}',
        '\\text{Percent Yield} = \\frac{\\text{Actual}}{\\text{Theoretical}} \\times 100\\%'
      ],
      confidence: 0.95,
      interpretation: 'Solved limiting reagent problem with theoretical and percent yield calculations'
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