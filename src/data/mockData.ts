import { ExampleProblem, SolutionStep, Variable } from "@/types/chemistry"

export const mockGasLawsVariables: Variable[] = [
  {
    name: "pressure1",
    symbol: "P₁",
    unit: "atm",
    description: "Initial pressure",
    required: true
  },
  {
    name: "volume1", 
    symbol: "V₁",
    unit: "L",
    description: "Initial volume",
    required: true
  },
  {
    name: "pressure2",
    symbol: "P₂", 
    unit: "atm",
    description: "Final pressure",
    required: false
  },
  {
    name: "volume2",
    symbol: "V₂",
    unit: "L", 
    description: "Final volume",
    required: false
  }
]

export const mockStoichiometryVariables: Variable[] = [
  {
    name: "mass",
    symbol: "m",
    unit: "g",
    description: "Mass of reactant",
    required: true
  },
  {
    name: "molarMass",
    symbol: "MM",
    unit: "g/mol",
    description: "Molar mass",
    required: true
  },
  {
    name: "moles",
    symbol: "n", 
    unit: "mol",
    description: "Number of moles",
    required: false
  }
]

export const mockSolutionSteps: SolutionStep[] = [
  {
    stepNumber: 1,
    title: "Identify the Gas Law",
    description: "This is a Boyle's Law problem since temperature is constant",
    formula: "P₁V₁ = P₂V₂",
    latexFormula: "P_1V_1 = P_2V_2",
    explanation: "Boyle's Law states that pressure and volume are inversely proportional at constant temperature"
  },
  {
    stepNumber: 2, 
    title: "Solve for Unknown Variable",
    description: "Rearrange the equation to solve for P₂",
    formula: "P₂ = P₁V₁/V₂",
    latexFormula: "P_2 = \\frac{P_1V_1}{V_2}",
    explanation: "Divide both sides by V₂ to isolate P₂"
  },
  {
    stepNumber: 3,
    title: "Substitute Values",
    description: "Insert the given values into the equation", 
    substitution: "P₂ = (1.5 atm × 2.0 L) / 0.75 L",
    calculation: "P₂ = 3.0 atm·L / 0.75 L = 4.0 atm",
    result: "4.0",
    resultWithUnits: "4.0 atm",
    explanation: "The new pressure is 4.0 atm"
  }
]

export const mockExampleProblems: ExampleProblem[] = [
  {
    id: "1",
    topicId: "gas-laws",
    title: "Boyle's Law - Gas Compression",
    question: "If 2.0 L of gas at 1.5 atm is compressed to 0.75 L at constant temperature, what is the new pressure?",
    variables: {
      P1: { name: "pressure1", symbol: "P₁", value: 1.5, unit: "atm", description: "Initial pressure", required: true },
      V1: { name: "volume1", symbol: "V₁", value: 2.0, unit: "L", description: "Initial volume", required: true },
      V2: { name: "volume2", symbol: "V₂", value: 0.75, unit: "L", description: "Final volume", required: true }
    },
    solution: mockSolutionSteps,
    difficulty: "beginner",
    tags: ["boyles-law", "pressure", "volume", "compression"]
  },
  {
    id: "2",
    topicId: "stoichiometry", 
    title: "Propane Combustion",
    question: "How many grams of CO2 are produced when 10.0 g of propane (C3H8) burns completely?",
    variables: {
      mass_propane: { name: "mass", symbol: "m", value: 10.0, unit: "g", description: "Mass of propane", required: true },
      molar_mass_propane: { name: "molarMass", symbol: "MM", value: 44.1, unit: "g/mol", description: "Molar mass of C3H8", required: true }
    },
    solution: [
      {
        stepNumber: 1,
        title: "Write Balanced Equation", 
        description: "Write the balanced combustion equation for propane",
        formula: "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O",
        latexFormula: "\\text{C}_3\\text{H}_8 + 5\\text{O}_2 \\rightarrow 3\\text{CO}_2 + 4\\text{H}_2\\text{O}",
        explanation: "Propane burns in oxygen to produce carbon dioxide and water"
      },
      {
        stepNumber: 2,
        title: "Calculate Moles of Propane",
        description: "Convert mass of propane to moles",
        formula: "n = m/MM",
        latexFormula: "n = \\frac{m}{MM}",
        substitution: "n = 10.0 g / 44.1 g/mol",
        calculation: "n = 0.227 mol C₃H₈", 
        result: "0.227",
        resultWithUnits: "0.227 mol C₃H₈"
      },
      {
        stepNumber: 3,
        title: "Use Stoichiometry",
        description: "Use mole ratio to find moles of CO₂",
        substitution: "mol CO₂ = 0.227 mol C₃H₈ × (3 mol CO₂ / 1 mol C₃H₈)",
        calculation: "mol CO₂ = 0.681 mol",
        result: "0.681",
        resultWithUnits: "0.681 mol CO₂"
      },
      {
        stepNumber: 4,
        title: "Convert to Grams",
        description: "Convert moles of CO₂ to grams",
        formula: "mass = n × MM",
        latexFormula: "\\text{mass} = n \\times MM",
        substitution: "mass = 0.681 mol × 44.01 g/mol",
        calculation: "mass = 30.0 g CO₂",
        result: "30.0",
        resultWithUnits: "30.0 g CO₂"
      }
    ],
    difficulty: "intermediate",
    tags: ["combustion", "stoichiometry", "moles", "propane", "co2"]
  },
  {
    id: "3", 
    topicId: "gas-laws",
    title: "Ideal Gas Law Problem",
    question: "A 5.00 L container holds 2.00 mol of an ideal gas at 300 K. What is the pressure in atm?",
    variables: {
      V: { name: "volume", symbol: "V", value: 5.00, unit: "L", description: "Volume", required: true },
      n: { name: "moles", symbol: "n", value: 2.00, unit: "mol", description: "Number of moles", required: true },
      T: { name: "temperature", symbol: "T", value: 300, unit: "K", description: "Temperature", required: true }
    },
    solution: [
      {
        stepNumber: 1,
        title: "Identify the Gas Law",
        description: "Use the ideal gas law equation",
        formula: "PV = nRT",
        latexFormula: "PV = nRT",
        explanation: "The ideal gas law relates pressure, volume, moles, and temperature"
      },
      {
        stepNumber: 2,
        title: "Solve for Pressure",
        description: "Rearrange to solve for P",
        formula: "P = nRT/V",
        latexFormula: "P = \\frac{nRT}{V}",
        explanation: "Divide both sides by V to isolate pressure"
      },
      {
        stepNumber: 3,
        title: "Substitute Values",
        description: "Insert known values (R = 0.0821 L·atm/mol·K)",
        substitution: "P = (2.00 mol)(0.0821 L·atm/mol·K)(300 K) / 5.00 L",
        calculation: "P = 49.26 L·atm / 5.00 L = 9.85 atm",
        result: "9.85",
        resultWithUnits: "9.85 atm"
      }
    ],
    difficulty: "beginner",
    tags: ["ideal-gas-law", "pressure", "temperature", "moles"]
  }
]

export const mockSolverResponse = {
  success: true,
  detectedTopic: "Gas Laws",
  canonicalProblem: "If 2.0 L of gas at 1.5 atm is compressed to 0.75 L at constant temperature, what is the new pressure?",
  variables: {
    P1: { name: "pressure1", symbol: "P₁", value: 1.5, unit: "atm", description: "Initial pressure", required: true },
    V1: { name: "volume1", symbol: "V₁", value: 2.0, unit: "L", description: "Initial volume", required: true },
    V2: { name: "volume2", symbol: "V₂", value: 0.75, unit: "L", description: "Final volume", required: true }
  },
  steps: mockSolutionSteps,
  finalAnswer: "4.0 atm",
  latexEquations: ["P_1V_1 = P_2V_2", "P_2 = \\frac{P_1V_1}{V_2}"],
  confidence: 0.95
}