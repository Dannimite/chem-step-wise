import { useState } from "react"
import { QuestionInput } from "@/components/chemistry/QuestionInput"
import { SolutionDisplay } from "@/components/chemistry/SolutionDisplay"
import { TopicCalculator } from "@/components/chemistry/TopicCalculator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gauge } from "lucide-react"
import { mockGasLawsVariables } from "@/data/mockData"
import { SolverResponse } from "@/types/chemistry"
import { chemistrySolver } from "@/services/chemistrySolver"

const GasLaws = () => {
  const [solution, setSolution] = useState<SolverResponse>()
  const [isLoading, setIsLoading] = useState(false)
  const [calculatorResult, setCalculatorResult] = useState<string>()

  const handleQuestionSubmit = async (question: string, topicHint?: string) => {
    setIsLoading(true)
    setSolution(undefined) // Clear previous solution immediately
    
    // Simulate API call with actual solver
    setTimeout(() => {
      const result = chemistrySolver.solve(question, topicHint)
      setSolution(result)
      setIsLoading(false)
    }, 2000)
  }

  const handleCalculation = (values: Record<string, number>) => {
    // Simple Boyle's Law calculation for demo
    if (values.pressure1 && values.volume1 && values.volume2) {
      const pressure2 = (values.pressure1 * values.volume1) / values.volume2
      setCalculatorResult(`P₂ = ${pressure2.toFixed(2)} atm`)
    }
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary shadow-elegant">
            <Gauge className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gas Laws</h1>
            <p className="text-muted-foreground">Boyle's, Charles's, Gay-Lussac's, and Ideal Gas Law</p>
          </div>
        </div>

        {/* Gas Law Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Boyle's Law", formula: "P₁V₁ = P₂V₂", condition: "Constant T" },
            { name: "Charles's Law", formula: "V₁/T₁ = V₂/T₂", condition: "Constant P" },
            { name: "Gay-Lussac's", formula: "P₁/T₁ = P₂/T₂", condition: "Constant V" },
            { name: "Ideal Gas", formula: "PV = nRT", condition: "All gases" }
          ].map((law) => (
            <Card key={law.name} className="border-border/30 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="font-medium text-sm text-foreground">{law.name}</div>
                  <div className="font-mono text-primary text-lg">{law.formula}</div>
                  <Badge variant="outline" className="text-xs">{law.condition}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Tabs defaultValue="solver" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="solver">Problem Solver</TabsTrigger>
          <TabsTrigger value="calculator">Interactive Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="solver" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <QuestionInput 
              onSubmit={handleQuestionSubmit}
              isLoading={isLoading}
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
              title="Boyle's Law Calculator"
              description="Calculate pressure or volume at constant temperature"
              variables={mockGasLawsVariables}
              onCalculate={handleCalculation}
              result={calculatorResult}
            />
            
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Gas Law Formulas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="font-medium text-sm text-foreground mb-1">Boyle's Law</div>
                    <div className="font-mono text-primary">P₁V₁ = P₂V₂</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      At constant temperature, pressure and volume are inversely proportional
                    </div>
                  </div>
                  
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="font-medium text-sm text-foreground mb-1">Charles's Law</div>
                    <div className="font-mono text-primary">V₁/T₁ = V₂/T₂</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      At constant pressure, volume and temperature are directly proportional
                    </div>
                  </div>
                  
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="font-medium text-sm text-foreground mb-1">Ideal Gas Law</div>
                    <div className="font-mono text-primary">PV = nRT</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      R = 0.0821 L·atm/mol·K (gas constant)
                    </div>
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

export default GasLaws