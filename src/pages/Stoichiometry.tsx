import { useState } from "react"
import { QuestionInput } from "@/components/chemistry/QuestionInput"
import { SolutionDisplay } from "@/components/chemistry/SolutionDisplay"
import { TopicCalculator } from "@/components/chemistry/TopicCalculator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator } from "lucide-react"
import { mockStoichiometryVariables } from "@/data/mockData"
import { SolverResponse } from "@/types/chemistry"
import { chemistrySolver } from "@/services/chemistrySolver"

const Stoichiometry = () => {
  const [solution, setSolution] = useState<SolverResponse>()
  const [isLoading, setIsLoading] = useState(false)
  const [calculatorResult, setCalculatorResult] = useState<string>()

const handleQuestionSubmit = async (question: string, topicHint?: string) => {
  setIsLoading(true)
  setSolution(undefined) // Clear previous solution immediately
  
  // Simulate API call with actual solver
  setTimeout(() => {
    const result = chemistrySolver.solve(question, topicHint ?? 'stoichiometry')
    setSolution(result)
    setIsLoading(false)
  }, 2000)
}

  const handleCalculation = (values: Record<string, number>) => {
    // Simple mole calculation for demo
    if (values.mass && values.molarMass) {
      const moles = values.mass / values.molarMass
      setCalculatorResult(`n = ${moles.toFixed(3)} mol`)
    }
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-secondary shadow-elegant">
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Stoichiometry</h1>
            <p className="text-muted-foreground">Mole calculations, limiting reagents, and reaction yields</p>
          </div>
        </div>

        {/* Stoichiometry Concept Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { 
              name: "Mole Conversions", 
              formula: "n = m/MM", 
              description: "Convert between mass and moles",
              color: "bg-primary/10 border-primary/20"
            },
            { 
              name: "Mole Ratios", 
              formula: "a A : b B", 
              description: "Use coefficients from balanced equations",
              color: "bg-secondary/10 border-secondary/20"
            },
            { 
              name: "Limiting Reagent", 
              formula: "Compare ratios", 
              description: "Find which reactant runs out first",
              color: "bg-accent/10 border-accent/20"
            }
          ].map((concept) => (
            <Card key={concept.name} className={`border ${concept.color} hover:shadow-md transition-shadow`}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="font-medium text-sm text-foreground">{concept.name}</div>
                  <div className="font-mono text-primary text-lg">{concept.formula}</div>
                  <div className="text-xs text-muted-foreground">{concept.description}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Tabs defaultValue="solver" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="solver">Problem Solver</TabsTrigger>
          <TabsTrigger value="calculator">Mole Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="solver" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <QuestionInput 
              onSubmit={handleQuestionSubmit}
              isLoading={isLoading}
              placeholder="Example: How many grams of CO2 are produced when 10.0 g of propane (C3H8) burns completely?"
              examples={[
                {
                  id: "stoich-1",
                  title: "Limiting Reagent with Percent Yield",
                  question: "If 12.0 g of propane (C3H8) reacts with 80.0 g of oxygen (O2), and 35.0 g of CO2 is actually collected, determine: The limiting reagent. The theoretical yield of CO2 (in grams). The percent yield. (Use atomic masses: C = 12.011, H = 1.008, O = 15.999.)",
                  topic: "stoichiometry",
                  difficulty: "advanced"
                },
                {
                  id: "stoich-2",
                  title: "Methane Combustion",
                  question: "How many grams of water (H2O) are produced when 8.00 g of methane (CH4) burns completely in oxygen?",
                  topic: "stoichiometry",
                  difficulty: "intermediate"
                }
              ]}
            />
            <SolutionDisplay 
              solution={solution}
              isLoading={isLoading}
            />
          </div>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopicCalculator
              title="Mole Conversion Calculator"
              description="Convert between mass and moles using molar mass"
              variables={mockStoichiometryVariables}
              onCalculate={handleCalculation}
              result={calculatorResult}
            />
            
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Common Molar Masses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { compound: "H₂O", mass: "18.02" },
                    { compound: "CO₂", mass: "44.01" },
                    { compound: "O₂", mass: "32.00" },
                    { compound: "N₂", mass: "28.01" },
                    { compound: "C₃H₈", mass: "44.10" },
                    { compound: "NaCl", mass: "58.44" },
                    { compound: "H₂SO₄", mass: "98.08" },
                    { compound: "CaCO₃", mass: "100.09" }
                  ].map((item) => (
                    <div key={item.compound} className="p-3 bg-muted/30 rounded-lg">
                      <div className="font-medium text-sm text-foreground">{item.compound}</div>
                      <div className="text-xs text-muted-foreground">{item.mass} g/mol</div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="text-sm font-medium text-foreground mb-2">Key Formula:</div>
                  <div className="font-mono text-primary">n = m/MM</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    where n = moles, m = mass (g), MM = molar mass (g/mol)
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Stoichiometry