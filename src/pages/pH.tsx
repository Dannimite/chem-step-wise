import { useState } from "react"
import { TestTube, Zap, Droplet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TopicCalculator } from "@/components/chemistry/TopicCalculator"
import { SolutionDisplay } from "@/components/chemistry/SolutionDisplay"

const pH = () => {
  const [calculationType, setCalculationType] = useState("ph-from-h")
  const [concentration, setConcentration] = useState("")
  const [solution, setSolution] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)

  const handleCalculate = () => {
    setIsLoading(true)
    setTimeout(() => {
      const h_conc = parseFloat(concentration)
      const ph_value = -Math.log10(h_conc)
      const poh_value = 14 - ph_value
      
      setSolution({
        detectedTopic: "ph-calculations",
        canonicalProblem: `Calculate pH from [H⁺] = ${concentration} M`,
        steps: [
          {
            stepNumber: 1,
            title: "Identify Given Concentration",
            description: "Note the hydrogen ion concentration",
            formula: "",
            substitution: `[H⁺] = ${concentration} M`,
            calculation: "",
            result: "Concentration identified"
          },
          {
            stepNumber: 2,
            title: "Apply pH Formula",
            description: "Use the pH definition",
            formula: "pH = -\\log[H^+]",
            substitution: `pH = -\\log(${concentration})`,
            calculation: `pH = -\\log(${h_conc}) = ${ph_value.toFixed(2)}`,
            result: `pH = ${ph_value.toFixed(2)}`
          },
          {
            stepNumber: 3,
            title: "Calculate pOH",
            description: "Use the relationship pH + pOH = 14",
            formula: "pOH = 14 - pH",
            substitution: `pOH = 14 - ${ph_value.toFixed(2)}`,
            calculation: `pOH = ${poh_value.toFixed(2)}`,
            result: `pOH = ${poh_value.toFixed(2)}`
          },
          {
            stepNumber: 4,
            title: "Interpret Result",
            description: "Determine if solution is acidic, basic, or neutral",
            formula: "",
            substitution: ph_value < 7 ? "pH < 7" : ph_value > 7 ? "pH > 7" : "pH = 7",
            calculation: "",
            result: ph_value < 7 ? "Acidic solution" : ph_value > 7 ? "Basic solution" : "Neutral solution"
          }
        ],
        finalAnswer: `pH = ${ph_value.toFixed(2)}, pOH = ${poh_value.toFixed(2)}`,
        latexEquations: [
          `pH = -\\log[H^+] = -\\log(${concentration}) = ${ph_value.toFixed(2)}`,
          `pOH = 14 - pH = 14 - ${ph_value.toFixed(2)} = ${poh_value.toFixed(2)}`
        ],
        interpretation: `The solution has a pH of ${ph_value.toFixed(2)}, making it ${ph_value < 7 ? 'acidic' : ph_value > 7 ? 'basic' : 'neutral'}.`
      })
      setIsLoading(false)
    }, 1200)
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
            <TestTube className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-foreground">pH & Acids/Bases</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Calculate pH, pOH, and hydrogen ion concentrations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              pH Calculator
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Calculation Type</Label>
                <Select value={calculationType} onValueChange={setCalculationType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ph-from-h">pH from [H⁺]</SelectItem>
                    <SelectItem value="h-from-ph">H⁺ from pH</SelectItem>
                    <SelectItem value="ph-from-oh">pH from [OH⁻]</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="concentration">
                  {calculationType === "ph-from-h" ? "[H⁺] Concentration (M)" : 
                   calculationType === "h-from-ph" ? "pH Value" : 
                   "[OH⁻] Concentration (M)"}
                </Label>
                <Input
                  id="concentration"
                  type="number"
                  placeholder={calculationType === "h-from-ph" ? "e.g., 7.0" : "e.g., 1.0e-7"}
                  value={concentration}
                  onChange={(e) => setConcentration(e.target.value)}
                  step="any"
                />
              </div>
              
              <Button 
                onClick={handleCalculate}
                disabled={!concentration || isLoading}
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
                    <Droplet className="mr-2 h-4 w-4" />
                    Calculate pH
                  </>
                )}
              </Button>
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

export default pH