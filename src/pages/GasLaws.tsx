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
    setSolution(undefined)
    
    setTimeout(() => {
      const result = chemistrySolver.solve(question, topicHint ?? 'gas-laws')
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { name: "Boyle's Law", formula: "P₁V₁ = P₂V₂", condition: "Constant T" },
            { name: "Charles's Law", formula: "V₁/T₁ = V₂/T₂", condition: "Constant P" },
            { name: "Gay-Lussac's Law", formula: "P₁/T₁ = P₂/T₂", condition: "Constant V" },
            { name: "Combined Gas Law", formula: "(P₁V₁)/T₁ = (P₂V₂)/T₂", condition: "n constant" },
            { name: "Ideal Gas Law", formula: "PV = nRT", condition: "Coming Soon" }
          ].map((law) => (
            <Card key={law.name} className="border-border/30 hover:shadow-md transition-shadow relative">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="font-medium text-sm text-foreground">{law.name}</div>
                  <div className="font-mono text-primary text-xs">{law.formula}</div>
                  {law.condition !== "Coming Soon" && (
                    <Badge variant="outline" className="text-xs">{law.condition}</Badge>
                  )}
                </div>
                {law.condition === "Coming Soon" && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Badge variant="outline" className="text-xs bg-background shadow-md">Coming Soon</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Tabs defaultValue="solver" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="solver">Problem Solver</TabsTrigger>
          <TabsTrigger value="understanding">Understanding Gas Laws</TabsTrigger>
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

        <TabsContent value="understanding" className="space-y-6">
          <div className="grid gap-6">
            {/* Introduction */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Understanding Gas Laws</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Gas laws describe how gases behave under different conditions. Each law focuses on specific 
                  relationships while keeping other variables constant. Understanding when and why to use each 
                  law is crucial for solving gas-related problems.
                </p>
              </CardContent>
            </Card>

            {/* Boyle's Law */}
            <Card className="shadow-card border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">1. Boyle's Law</CardTitle>
                  <Badge>Constant Temperature</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="font-mono text-2xl text-primary mb-2">P₁V₁ = P₂V₂</div>
                  <p className="text-sm text-muted-foreground">Pressure × Volume = Constant (at constant T)</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Key Concept:</h4>
                  <p className="text-muted-foreground">
                    Pressure and volume are <strong>inversely proportional</strong>. When you compress a gas 
                    (decrease volume), its pressure increases proportionally, and vice versa.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">When to Use:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Temperature remains constant</li>
                    <li>Amount of gas (moles) stays the same</li>
                    <li>Only pressure and volume change</li>
                  </ul>
                </div>
                <div className="bg-accent/10 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Example:</h4>
                  <p className="text-sm text-muted-foreground">
                    A gas occupies 2.00 L at 1.50 atm. If compressed to 0.75 L at constant temperature, 
                    what is the new pressure?
                  </p>
                  <p className="text-sm font-mono mt-2">
                    P₂ = (1.50 atm × 2.00 L) / 0.75 L = 4.00 atm
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Charles's Law */}
            <Card className="shadow-card border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">2. Charles's Law</CardTitle>
                  <Badge>Constant Pressure</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="font-mono text-2xl text-primary mb-2">V₁/T₁ = V₂/T₂</div>
                  <p className="text-sm text-muted-foreground">Volume / Temperature = Constant (at constant P)</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Key Concept:</h4>
                  <p className="text-muted-foreground">
                    Volume and temperature are <strong>directly proportional</strong>. When you heat a gas 
                    (increase temperature), its volume expands proportionally if pressure stays constant.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">When to Use:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Pressure remains constant</li>
                    <li>Amount of gas stays the same</li>
                    <li>Only volume and temperature change</li>
                    <li><strong>Temperature must be in Kelvin!</strong></li>
                  </ul>
                </div>
                <div className="bg-accent/10 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Example:</h4>
                  <p className="text-sm text-muted-foreground">
                    A balloon has a volume of 3.50 L at 300 K. If heated to 450 K at constant pressure, 
                    what is the new volume?
                  </p>
                  <p className="text-sm font-mono mt-2">
                    V₂ = (3.50 L × 450 K) / 300 K = 5.25 L
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Gay-Lussac's Law */}
            <Card className="shadow-card border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">3. Gay-Lussac's Law</CardTitle>
                  <Badge>Constant Volume</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="font-mono text-2xl text-primary mb-2">P₁/T₁ = P₂/T₂</div>
                  <p className="text-sm text-muted-foreground">Pressure / Temperature = Constant (at constant V)</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Key Concept:</h4>
                  <p className="text-muted-foreground">
                    Pressure and temperature are <strong>directly proportional</strong>. When you heat a gas 
                    in a rigid container (constant volume), its pressure increases proportionally.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">When to Use:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Volume remains constant (rigid container)</li>
                    <li>Amount of gas stays the same</li>
                    <li>Only pressure and temperature change</li>
                    <li><strong>Temperature must be in Kelvin!</strong></li>
                  </ul>
                </div>
                <div className="bg-accent/10 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Example:</h4>
                  <p className="text-sm text-muted-foreground">
                    A gas in a rigid container has a pressure of 2.00 atm at 298 K. If heated to 400 K, 
                    what is the new pressure?
                  </p>
                  <p className="text-sm font-mono mt-2">
                    P₂ = (2.00 atm × 400 K) / 298 K = 2.68 atm
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Combined Gas Law */}
            <Card className="shadow-card border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">4. Combined Gas Law</CardTitle>
                  <Badge>Constant Moles</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="font-mono text-2xl text-primary mb-2">(P₁V₁)/T₁ = (P₂V₂)/T₂</div>
                  <p className="text-sm text-muted-foreground">Combines Boyle's, Charles's, and Gay-Lussac's laws</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Key Concept:</h4>
                  <p className="text-muted-foreground">
                    Use this when <strong>all three variables change</strong> (pressure, volume, and temperature). 
                    It's the most comprehensive gas law for scenarios where multiple conditions change simultaneously.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">When to Use:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Pressure, volume, AND temperature all change</li>
                    <li>Amount of gas remains constant</li>
                    <li>Most versatile for real-world scenarios</li>
                    <li><strong>Temperature must be in Kelvin!</strong></li>
                  </ul>
                </div>
                <div className="bg-accent/10 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Example:</h4>
                  <p className="text-sm text-muted-foreground">
                    A gas at 2.00 atm, 3.00 L, and 300 K is changed to 1.50 atm and 350 K. What is the new volume?
                  </p>
                  <p className="text-sm font-mono mt-2">
                    V₂ = (2.00 atm × 3.00 L × 350 K) / (1.50 atm × 300 K) = 4.67 L
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Ideal Gas Law */}
            <Card className="shadow-card border-l-4 border-l-primary opacity-60">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">5. Ideal Gas Law</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Coming Soon</Badge>
                    <Badge>All Variables</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="font-mono text-2xl text-primary mb-2">PV = nRT</div>
                  <p className="text-sm text-muted-foreground">R = 0.0821 L·atm/(mol·K)</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Key Concept:</h4>
                  <p className="text-muted-foreground">
                    The <strong>most fundamental gas law</strong>. Use this when you need to find moles, or when 
                    you have only one set of conditions (not comparing two states). Relates all gas properties.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">When to Use:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Finding the number of moles (n)</li>
                    <li>Only one set of conditions given</li>
                    <li>Converting between mass and gas properties</li>
                    <li>Use R = 0.0821 L·atm/(mol·K) for atm-L-K units</li>
                  </ul>
                </div>
                <div className="bg-accent/10 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Example:</h4>
                  <p className="text-sm text-muted-foreground">
                    How many moles of gas are in a 5.00 L container at 2.50 atm and 298 K?
                  </p>
                  <p className="text-sm font-mono mt-2">
                    n = PV / RT = (2.50 atm × 5.00 L) / (0.0821 × 298 K) = 0.51 mol
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Decision Guide */}
            <Card className="shadow-card bg-accent/5">
              <CardHeader>
                <CardTitle className="text-xl">🎯 Quick Decision Guide</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-background rounded-lg">
                    <p className="font-semibold">📊 Two sets of conditions + constant T → <span className="text-primary">Boyle's Law</span></p>
                  </div>
                  <div className="p-3 bg-background rounded-lg">
                    <p className="font-semibold">🌡️ Two sets of conditions + constant P → <span className="text-primary">Charles's Law</span></p>
                  </div>
                  <div className="p-3 bg-background rounded-lg">
                    <p className="font-semibold">🔒 Two sets of conditions + constant V → <span className="text-primary">Gay-Lussac's Law</span></p>
                  </div>
                  <div className="p-3 bg-background rounded-lg">
                    <p className="font-semibold">🔄 Two sets of conditions + all change → <span className="text-primary">Combined Gas Law</span></p>
                  </div>
                  <div className="p-3 bg-background rounded-lg">
                    <p className="font-semibold">⚗️ One set of conditions + finding moles → <span className="text-primary">Ideal Gas Law</span></p>
                  </div>
                </div>
              </CardContent>
            </Card>
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