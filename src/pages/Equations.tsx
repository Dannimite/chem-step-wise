import { useState } from "react"
import { Scale, CheckCircle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TopicCalculator } from "@/components/chemistry/TopicCalculator"
import { SolutionDisplay } from "@/components/chemistry/SolutionDisplay"

const Equations = () => {
  const [equation, setEquation] = useState("")
  const [solution, setSolution] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)

  const handleBalance = () => {
    setIsLoading(true)
    setTimeout(() => {
      setSolution({
        detectedTopic: "chemical-equations",
        canonicalProblem: `Balance the chemical equation: ${equation}`,
        steps: [
          {
            stepNumber: 1,
            title: "Identify Elements",
            description: "List all elements present in the equation",
            formula: "",
            substitution: "Elements: C, H, O",
            calculation: "",
            result: "Elements identified"
          },
          {
            stepNumber: 2,
            title: "Set Up Coefficients",
            description: "Assign variables for coefficients",
            formula: "",
            substitution: "aC₃H₈ + bO₂ → cCO₂ + dH₂O",
            calculation: "",
            result: "Variables assigned"
          },
          {
            stepNumber: 3,
            title: "Balance Carbon",
            description: "Balance carbon atoms on both sides",
            formula: "",
            substitution: "C: 3a = c, so c = 3",
            calculation: "",
            result: "c = 3"
          },
          {
            stepNumber: 4,
            title: "Balance Hydrogen", 
            description: "Balance hydrogen atoms on both sides",
            formula: "",
            substitution: "H: 8a = 2d, so d = 4",
            calculation: "",
            result: "d = 4"
          },
          {
            stepNumber: 5,
            title: "Balance Oxygen",
            description: "Balance oxygen atoms on both sides",
            formula: "",
            substitution: "O: 2b = 2c + d = 6 + 4 = 10, so b = 5",
            calculation: "",
            result: "b = 5"
          }
        ],
        finalAnswer: "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O",
        latexEquations: ["C_3H_8 + 5O_2 \\rightarrow 3CO_2 + 4H_2O"],
        interpretation: "The balanced equation shows complete combustion of propane."
      })
      setIsLoading(false)
    }, 1500)
  }

  const examples = [
    "C3H8 + O2 → CO2 + H2O",
    "H2 + O2 → H2O", 
    "Fe + O2 → Fe2O3",
    "NH3 + O2 → NO + H2O"
  ]

  return (
    <div className="container mx-auto max-w-6xl space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
            <Scale className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-foreground">Chemical Equations</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Balance chemical equations step-by-step using systematic methods
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Equation Balancer
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="equation">Chemical Equation</Label>
                <Input
                  id="equation"
                  placeholder="e.g., C3H8 + O2 → CO2 + H2O"
                  value={equation}
                  onChange={(e) => setEquation(e.target.value)}
                  className="text-base"
                />
              </div>
              
              <Button 
                onClick={handleBalance}
                disabled={!equation.trim() || isLoading}
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Balancing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Balance Equation
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium text-foreground">Try these examples:</div>
              <div className="grid gap-2">
                {examples.map((example, index) => (
                  <Card 
                    key={index}
                    className="cursor-pointer border-border/30 hover:shadow-md hover:border-primary/30 transition-all duration-200"
                    onClick={() => setEquation(example)}
                  >
                    <CardContent className="p-3">
                      <div className="text-sm font-mono text-foreground">{example}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <SolutionDisplay 
          solution={solution}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default Equations