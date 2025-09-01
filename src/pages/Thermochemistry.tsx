import { useState } from "react"
import { Thermometer, Flame, Snowflake } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TopicCalculator } from "@/components/chemistry/TopicCalculator"
import { SolutionDisplay } from "@/components/chemistry/SolutionDisplay"

const Thermochemistry = () => {
  const [calculationType, setCalculationType] = useState("heat-capacity")
  const [mass, setMass] = useState("")
  const [specificHeat, setSpecificHeat] = useState("")
  const [tempChange, setTempChange] = useState("")
  const [solution, setSolution] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)

  const handleCalculate = () => {
    setIsLoading(true)
    setTimeout(() => {
      const m = parseFloat(mass)
      const c = parseFloat(specificHeat)
      const deltaT = parseFloat(tempChange)
      const q = m * c * deltaT
      
      setSolution({
        detectedTopic: "thermochemistry",
        canonicalProblem: `Calculate heat transfer using q = mcΔT`,
        steps: [
          {
            stepNumber: 1,
            title: "Identify Given Values",
            description: "List the known quantities",
            formula: "",
            substitution: `m = ${mass} g, c = ${specificHeat} J/g°C, ΔT = ${tempChange}°C`,
            calculation: "",
            result: "Given values identified"
          },
          {
            stepNumber: 2,
            title: "Apply Heat Equation",
            description: "Use the heat capacity formula",
            formula: "q = mc\\Delta T",
            substitution: `q = (${mass})(${specificHeat})(${tempChange})`,
            calculation: `q = ${q.toFixed(1)} J`,
            result: `q = ${q.toFixed(1)} J`
          },
          {
            stepNumber: 3,
            title: "Interpret Sign",
            description: "Determine if heat is absorbed or released",
            formula: "",
            substitution: q > 0 ? "q > 0" : "q < 0",
            calculation: "",
            result: q > 0 ? "Heat absorbed (endothermic)" : "Heat released (exothermic)"
          },
          {
            stepNumber: 4,
            title: "Convert Units",
            description: "Express in kilojoules if needed",
            formula: "",
            substitution: `q = ${q.toFixed(1)} J = ${(q/1000).toFixed(3)} kJ`,
            calculation: "",
            result: `q = ${(q/1000).toFixed(3)} kJ`
          }
        ],
        finalAnswer: `${q.toFixed(1)} J (${(q/1000).toFixed(3)} kJ)`,
        latexEquations: [`q = mc\\Delta T = (${mass})(${specificHeat})(${tempChange}) = ${q.toFixed(1)} \\text{ J}`],
        interpretation: `${Math.abs(q).toFixed(1)} J of heat is ${q > 0 ? 'absorbed' : 'released'} during this process.`
      })
      setIsLoading(false)
    }, 1200)
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
            <Thermometer className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-foreground">Thermochemistry</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Calculate heat transfer, calorimetry, and energy changes in chemical reactions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-primary" />
              Heat Calculator
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
                    <SelectItem value="heat-capacity">Heat Transfer (q = mcΔT)</SelectItem>
                    <SelectItem value="calorimetry">Calorimetry</SelectItem>
                    <SelectItem value="enthalpy">Enthalpy Change</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mass">Mass (g)</Label>
                <Input
                  id="mass"
                  type="number"
                  placeholder="e.g., 100"
                  value={mass}
                  onChange={(e) => setMass(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specificHeat">Specific Heat (J/g°C)</Label>
                <Input
                  id="specificHeat"
                  type="number"
                  placeholder="e.g., 4.184 (water)"
                  value={specificHeat}
                  onChange={(e) => setSpecificHeat(e.target.value)}
                  step="any"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tempChange">Temperature Change (°C)</Label>
                <Input
                  id="tempChange"
                  type="number"
                  placeholder="e.g., 25.0"
                  value={tempChange}
                  onChange={(e) => setTempChange(e.target.value)}
                  step="any"
                />
              </div>
              
              <Button 
                onClick={handleCalculate}
                disabled={!mass || !specificHeat || !tempChange || isLoading}
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
                    <Snowflake className="mr-2 h-4 w-4" />
                    Calculate Heat
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

export default Thermochemistry