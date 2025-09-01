import { useState } from "react"
import { Beaker, Droplets, FlaskConical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TopicCalculator } from "@/components/chemistry/TopicCalculator"
import { SolutionDisplay } from "@/components/chemistry/SolutionDisplay"

const Concentration = () => {
  const [calculationType, setCalculationType] = useState("molarity")
  const [moles, setMoles] = useState("")
  const [volume, setVolume] = useState("")
  const [solution, setSolution] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)

  const handleCalculate = () => {
    setIsLoading(true)
    setTimeout(() => {
      setSolution({
        detectedTopic: "concentration",
        canonicalProblem: `Calculate ${calculationType} with given values`,
        steps: [
          {
            stepNumber: 1,
            title: "Identify Given Values",
            description: "List the known quantities",
            formula: "",
            substitution: `Moles = ${moles} mol, Volume = ${volume} L`,
            calculation: "",
            result: "Given values identified"
          },
          {
            stepNumber: 2,
            title: "Apply Formula",
            description: "Use the molarity formula",
            formula: "M = \\frac{n}{V}",
            substitution: `M = \\frac{${moles}}{${volume}}`,
            calculation: `M = ${(parseFloat(moles) / parseFloat(volume)).toFixed(3)}`,
            result: `M = ${(parseFloat(moles) / parseFloat(volume)).toFixed(3)} M`
          },
          {
            stepNumber: 3,
            title: "Check Units",
            description: "Verify units are correct",
            formula: "",
            substitution: "mol/L = M (molarity)",
            calculation: "",
            result: "Units are consistent"
          }
        ],
        finalAnswer: `${(parseFloat(moles) / parseFloat(volume)).toFixed(3)} M`,
        latexEquations: [`M = \\frac{${moles}}{${volume}} = ${(parseFloat(moles) / parseFloat(volume)).toFixed(3)} \\text{ M}`],
        interpretation: `The molarity of the solution is ${(parseFloat(moles) / parseFloat(volume)).toFixed(3)} M.`
      })
      setIsLoading(false)
    }, 1200)
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
            <Beaker className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-foreground">Concentration Calculator</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Calculate molarity, molality, and other concentration units
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-primary" />
              Concentration Calculator
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
                    <SelectItem value="molarity">Molarity (M)</SelectItem>
                    <SelectItem value="molality">Molality (m)</SelectItem>
                    <SelectItem value="ppm">Parts per million (ppm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="moles">Moles of solute (mol)</Label>
                <Input
                  id="moles"
                  type="number"
                  placeholder="e.g., 2.5"
                  value={moles}
                  onChange={(e) => setMoles(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="volume">Volume of solution (L)</Label>
                <Input
                  id="volume"
                  type="number"
                  placeholder="e.g., 1.0"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={handleCalculate}
                disabled={!moles || !volume || isLoading}
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
                    <FlaskConical className="mr-2 h-4 w-4" />
                    Calculate Concentration
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

export default Concentration