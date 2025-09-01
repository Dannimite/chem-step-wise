import { useState } from "react"
import { Atom, Calculator, Beaker } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TopicCalculator } from "@/components/chemistry/TopicCalculator"
import { SolutionDisplay } from "@/components/chemistry/SolutionDisplay"

const MolarMass = () => {
  const [formula, setFormula] = useState("")
  const [solution, setSolution] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)

  const handleCalculate = () => {
    setIsLoading(true)
    setTimeout(() => {
      setSolution({
        detectedTopic: "molar-mass",
        canonicalProblem: `Calculate the molar mass of ${formula}`,
        steps: [
          {
            stepNumber: 1,
            title: "Identify Elements",
            description: "Break down the formula into individual elements",
            formula: "",
            substitution: "H₂SO₄ contains: H, S, O",
            calculation: "",
            result: "Elements: H (2), S (1), O (4)"
          },
          {
            stepNumber: 2,
            title: "Find Atomic Masses",
            description: "Look up atomic masses from periodic table",
            formula: "",
            substitution: "H = 1.008 g/mol, S = 32.06 g/mol, O = 15.999 g/mol",
            calculation: "",
            result: "Atomic masses identified"
          },
          {
            stepNumber: 3,
            title: "Calculate Total Mass",
            description: "Multiply atomic masses by number of atoms",
            formula: "Molar Mass = Σ(atomic mass × number of atoms)",
            substitution: "MM = (2 × 1.008) + (1 × 32.06) + (4 × 15.999)",
            calculation: "MM = 2.016 + 32.06 + 63.996",
            result: "MM = 98.072 g/mol"
          }
        ],
        finalAnswer: "98.07 g/mol",
        latexEquations: ["MM_{H_2SO_4} = 2(1.008) + 1(32.06) + 4(15.999) = 98.07 \\text{ g/mol}"],
        interpretation: "The molar mass of sulfuric acid (H₂SO₄) is 98.07 g/mol."
      })
      setIsLoading(false)
    }, 1000)
  }

  const examples = [
    "H2O",
    "CO2", 
    "NaCl",
    "CaCO3",
    "C6H12O6",
    "NH3"
  ]

  return (
    <div className="container mx-auto max-w-6xl space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
            <Atom className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-foreground">Molar Mass Calculator</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Calculate molecular weights and formula masses for any chemical compound
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Formula Input
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="formula">Chemical Formula</Label>
                <Input
                  id="formula"
                  placeholder="e.g., H2SO4, CaCO3, C6H12O6"
                  value={formula}
                  onChange={(e) => setFormula(e.target.value)}
                  className="text-base"
                />
              </div>
              
              <Button 
                onClick={handleCalculate}
                disabled={!formula.trim() || isLoading}
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Beaker className="mr-2 h-4 w-4" />
                    Calculate Molar Mass
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium text-foreground">Common compounds:</div>
              <div className="grid grid-cols-3 gap-2">
                {examples.map((example, index) => (
                  <Card 
                    key={index}
                    className="cursor-pointer border-border/30 hover:shadow-md hover:border-primary/30 transition-all duration-200"
                    onClick={() => setFormula(example)}
                  >
                    <CardContent className="p-2">
                      <div className="text-sm font-mono text-center text-foreground">{example}</div>
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

export default MolarMass