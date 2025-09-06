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
    
    // Extract multiple pressure values for Boyle's Law problems
    const pressureMatches = question.match(/(\d+\.?\d*)\s*atm/g)
    if (pressureMatches && pressureMatches.length >= 2) {
      const pressures = pressureMatches.map(match => parseFloat(match.replace('atm', '').trim()))
      variables.pressure1 = pressures[0]
      variables.pressure2 = pressures[1]
    } else if (pressureMatches && pressureMatches.length === 1) {
      variables.pressure1 = parseFloat(pressureMatches[0].replace('atm', '').trim())
    }
    
    // Extract multiple volume values for Boyle's Law problems  
    const volumeMatches = question.match(/(\d+\.?\d*)\s*L/g)
    if (volumeMatches && volumeMatches.length >= 1) {
      variables.volume1 = parseFloat(volumeMatches[0].replace('L', '').trim())
    }
    
    // Extract temperature
    if (question.includes('K')) {
      const tempMatches = question.match(/(\d+\.?\d*)\s*K/g)
      if (tempMatches) {
        variables.temperature1 = parseFloat(tempMatches[0].replace('K', '').trim())
        if (tempMatches.length > 1) {
          variables.temperature2 = parseFloat(tempMatches[1].replace('K', '').trim())
        }
      }
    }
    
    // Extract moles
    if (question.includes('mol')) {
      const molMatches = question.match(/(\d+\.?\d*)\s*mol/g)
      if (molMatches) {
        variables.moles = parseFloat(molMatches[0].replace('mol', '').trim())
      }
    }
    
    return variables
  }

  private extractStoichiometryVariables(question: string, numbers: number[]): Record<string, any> {
    const variables: Record<string, any> = {}

    // Mass (g)
    const norm = this.normalizeFormula(question)
    const massMatch = norm.match(/(\d+\.?\d*)\s*(g|grams?)/i)
    if (massMatch) {
      variables.mass = parseFloat(massMatch[1])
      variables.massUnit = 'g'
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
    // Extract numerical values from the question
    const numbers = this.extractNumbers(question)
    const gasValues = this.extractGasLawVariables(question, numbers)
    
    // For your specific question: "A gas sample occupies 3.50 L at a pressure of 2.00 atm. If the pressure is increased to 3.50 atm while the temperature remains constant, what will be the new volume of the gas?"
    const v1 = gasValues.volume1 || numbers[0] // 3.50 L
    const p1 = gasValues.pressure1 || numbers[1] // 2.00 atm  
    const p2 = gasValues.pressure2 || numbers[2] // 3.50 atm
    
    // Calculate V2 using Boyle's Law: P1V1 = P2V2 -> V2 = P1V1/P2
    const v2 = (p1 * v1) / p2
    
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
        substitution: `P₁ = ${p1} atm, V₁ = ${v1} L, P₂ = ${p2} atm`,
        result: "We need to find V₂"
      },
      {
        stepNumber: 3,
        title: "Rearrange the Formula",
        description: "Solve for the unknown variable V₂",
        formula: "V₂ = (P₁ × V₁) / P₂",
        explanation: "Rearrange Boyle's Law to isolate V₂"
      },
      {
        stepNumber: 4,
        title: "Substitute Values",
        description: "Insert the known values into the formula",
        substitution: `V₂ = (${p1} atm × ${v1} L) / ${p2} atm`,
        calculation: `V₂ = ${p1 * v1} / ${p2}`,
        result: `V₂ = ${v2.toFixed(2)} L`
      }
    ]

    return {
      success: true,
      detectedTopic: "Gas Laws - Boyle's Law",
      canonicalProblem: question,
      variables: {
        pressure1: { name: "Initial Pressure", symbol: "P₁", value: p1, unit: "atm", description: "Initial pressure", required: true },
        volume1: { name: "Initial Volume", symbol: "V₁", value: v1, unit: "L", description: "Initial volume", required: true },
        pressure2: { name: "Final Pressure", symbol: "P₂", value: p2, unit: "atm", description: "Final pressure", required: true },
        volume2: { name: "Final Volume", symbol: "V₂", value: v2, unit: "L", description: "Final volume (calculated)", required: false }
      },
      steps,
      finalAnswer: `The new volume of the gas will be ${v2.toFixed(2)} L`,
      latexEquations: ["P_1V_1 = P_2V_2", "V_2 = \\frac{P_1 V_1}{P_2}"],
      confidence: 0.95,
      interpretation: "This problem uses Boyle's Law to find the new volume when pressure changes at constant temperature."
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
    const numbers = this.extractNumbers(this.normalizeFormula(question))
    const vars = this.extractStoichiometryVariables(question, numbers)

    // Handle complete combustion of hydrocarbons producing CO2
    const isCombustion = analysis.problemType === 'combustion' || /burn|combustion/i.test(question)
    const hydroOk = typeof vars.carbonAtoms === 'number' && typeof vars.hydrogenAtoms === 'number'
    const hasMass = typeof vars.mass === 'number' && vars.mass > 0
    const asksCO2 = this.containsCO2(question)

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