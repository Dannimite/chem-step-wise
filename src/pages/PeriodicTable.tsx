import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Atom } from "lucide-react"

// Simplified periodic table data - major elements
const periodicElements = [
  { symbol: "H", name: "Hydrogen", atomicNumber: 1, atomicMass: 1.008, category: "nonmetal", period: 1, group: 1 },
  { symbol: "He", name: "Helium", atomicNumber: 2, atomicMass: 4.003, category: "noble-gas", period: 1, group: 18 },
  { symbol: "Li", name: "Lithium", atomicNumber: 3, atomicMass: 6.94, category: "alkali-metal", period: 2, group: 1 },
  { symbol: "Be", name: "Beryllium", atomicNumber: 4, atomicMass: 9.012, category: "alkaline-earth-metal", period: 2, group: 2 },
  { symbol: "B", name: "Boron", atomicNumber: 5, atomicMass: 10.81, category: "metalloid", period: 2, group: 13 },
  { symbol: "C", name: "Carbon", atomicNumber: 6, atomicMass: 12.01, category: "nonmetal", period: 2, group: 14 },
  { symbol: "N", name: "Nitrogen", atomicNumber: 7, atomicMass: 14.01, category: "nonmetal", period: 2, group: 15 },
  { symbol: "O", name: "Oxygen", atomicNumber: 8, atomicMass: 16.00, category: "nonmetal", period: 2, group: 16 },
  { symbol: "F", name: "Fluorine", atomicNumber: 9, atomicMass: 19.00, category: "halogen", period: 2, group: 17 },
  { symbol: "Ne", name: "Neon", atomicNumber: 10, atomicMass: 20.18, category: "noble-gas", period: 2, group: 18 },
  { symbol: "Na", name: "Sodium", atomicNumber: 11, atomicMass: 22.99, category: "alkali-metal", period: 3, group: 1 },
  { symbol: "Mg", name: "Magnesium", atomicNumber: 12, atomicMass: 24.31, category: "alkaline-earth-metal", period: 3, group: 2 },
  { symbol: "Al", name: "Aluminum", atomicNumber: 13, atomicMass: 26.98, category: "metal", period: 3, group: 13 },
  { symbol: "Si", name: "Silicon", atomicNumber: 14, atomicMass: 28.09, category: "metalloid", period: 3, group: 14 },
  { symbol: "P", name: "Phosphorus", atomicNumber: 15, atomicMass: 30.97, category: "nonmetal", period: 3, group: 15 },
  { symbol: "S", name: "Sulfur", atomicNumber: 16, atomicMass: 32.07, category: "nonmetal", period: 3, group: 16 },
  { symbol: "Cl", name: "Chlorine", atomicNumber: 17, atomicMass: 35.45, category: "halogen", period: 3, group: 17 },
  { symbol: "Ar", name: "Argon", atomicNumber: 18, atomicMass: 39.95, category: "noble-gas", period: 3, group: 18 },
  { symbol: "K", name: "Potassium", atomicNumber: 19, atomicMass: 39.10, category: "alkali-metal", period: 4, group: 1 },
  { symbol: "Ca", name: "Calcium", atomicNumber: 20, atomicMass: 40.08, category: "alkaline-earth-metal", period: 4, group: 2 },
]

const categoryColors = {
  "alkali-metal": "bg-red-500/20 border-red-500/40 text-red-700 dark:text-red-300",
  "alkaline-earth-metal": "bg-orange-500/20 border-orange-500/40 text-orange-700 dark:text-orange-300",
  "metal": "bg-blue-500/20 border-blue-500/40 text-blue-700 dark:text-blue-300",
  "metalloid": "bg-green-500/20 border-green-500/40 text-green-700 dark:text-green-300",
  "nonmetal": "bg-yellow-500/20 border-yellow-500/40 text-yellow-700 dark:text-yellow-300",
  "halogen": "bg-purple-500/20 border-purple-500/40 text-purple-700 dark:text-purple-300",
  "noble-gas": "bg-pink-500/20 border-pink-500/40 text-pink-700 dark:text-pink-300"
}

const PeriodicTable = () => {
  const [selectedElement, setSelectedElement] = useState(periodicElements[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [molarMassInput, setMolarMassInput] = useState("")
  const [molarMassResult, setMolarMassResult] = useState("")

  const filteredElements = periodicElements.filter(element =>
    element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    element.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const calculateMolarMass = () => {
    // Simple parser for basic molecular formulas like H2O, NaCl, etc.
    let formula = molarMassInput.replace(/\s/g, "")
    let totalMass = 0
    let result = ""

    // Basic regex to match element symbol and count
    const matches = formula.match(/([A-Z][a-z]?)(\d*)/g)
    if (matches) {
      matches.forEach(match => {
        const elementMatch = match.match(/([A-Z][a-z]?)(\d*)/)
        if (elementMatch) {
          const symbol = elementMatch[1]
          const count = elementMatch[2] ? parseInt(elementMatch[2]) : 1
          const element = periodicElements.find(el => el.symbol === symbol)
          
          if (element) {
            const mass = element.atomicMass * count
            totalMass += mass
            result += `${symbol}: ${element.atomicMass} × ${count} = ${mass.toFixed(3)} g/mol\n`
          }
        }
      })
      result += `\nTotal Molar Mass: ${totalMass.toFixed(3)} g/mol`
      setMolarMassResult(result)
    } else {
      setMolarMassResult("Invalid formula format")
    }
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary shadow-elegant">
            <Atom className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Periodic Table</h1>
            <p className="text-muted-foreground">Interactive periodic table and molar mass calculator</p>
          </div>
        </div>

        {/* Category Legend */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryColors).map(([category, colorClass]) => (
            <Badge key={category} variant="outline" className={`text-xs ${colorClass}`}>
              {category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          ))}
        </div>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="table">Periodic Table</TabsTrigger>
          <TabsTrigger value="calculator">Molar Mass Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-6">
          {/* Search */}
          <div className="max-w-md">
            <Input
              placeholder="Search elements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Element Grid */}
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Elements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                    {filteredElements.map((element) => (
                      <Button
                        key={element.symbol}
                        variant={selectedElement.symbol === element.symbol ? "default" : "outline"}
                        className={`h-16 w-full p-1 flex flex-col items-center justify-center text-xs transition-all hover:scale-105 ${
                          categoryColors[element.category as keyof typeof categoryColors]
                        }`}
                        onClick={() => setSelectedElement(element)}
                      >
                        <div className="font-bold text-sm">{element.symbol}</div>
                        <div className="text-xs opacity-70">{element.atomicNumber}</div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Element Details */}
            <div className="lg:col-span-1">
              <Card className="shadow-card sticky top-4">
                <CardHeader>
                  <CardTitle>Element Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className={`inline-flex h-20 w-20 items-center justify-center rounded-lg border-2 text-2xl font-bold ${
                      categoryColors[selectedElement.category as keyof typeof categoryColors]
                    }`}>
                      {selectedElement.symbol}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium text-sm text-muted-foreground">Name</div>
                      <div className="text-lg font-semibold">{selectedElement.name}</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="font-medium text-sm text-muted-foreground">Atomic #</div>
                        <div className="font-mono text-primary">{selectedElement.atomicNumber}</div>
                      </div>
                      <div>
                        <div className="font-medium text-sm text-muted-foreground">Atomic Mass</div>
                        <div className="font-mono text-primary">{selectedElement.atomicMass}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="font-medium text-sm text-muted-foreground">Period</div>
                        <div className="font-mono text-primary">{selectedElement.period}</div>
                      </div>
                      <div>
                        <div className="font-medium text-sm text-muted-foreground">Group</div>
                        <div className="font-mono text-primary">{selectedElement.group}</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-sm text-muted-foreground">Category</div>
                      <Badge variant="outline" className={`mt-1 ${categoryColors[selectedElement.category as keyof typeof categoryColors]}`}>
                        {selectedElement.category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Molar Mass Calculator */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Molar Mass Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Chemical Formula</label>
                  <Input
                    placeholder="e.g., H2O, NaCl, CaCO3"
                    value={molarMassInput}
                    onChange={(e) => setMolarMassInput(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a chemical formula using element symbols and numbers
                  </p>
                </div>
                
                <Button onClick={calculateMolarMass} className="w-full">
                  Calculate Molar Mass
                </Button>
                
                {molarMassResult && (
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <div className="font-medium text-sm text-foreground mb-2">Calculation:</div>
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
                      {molarMassResult}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Reference */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Common Elements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { symbol: "H", name: "Hydrogen", mass: "1.008" },
                  { symbol: "C", name: "Carbon", mass: "12.01" },
                  { symbol: "N", name: "Nitrogen", mass: "14.01" },
                  { symbol: "O", name: "Oxygen", mass: "16.00" },
                  { symbol: "Na", name: "Sodium", mass: "22.99" },
                  { symbol: "Cl", name: "Chlorine", mass: "35.45" },
                  { symbol: "Ca", name: "Calcium", mass: "40.08" },
                  { symbol: "S", name: "Sulfur", mass: "32.07" }
                ].map((element) => (
                  <div key={element.symbol} className="flex justify-between items-center p-2 hover:bg-muted/30 rounded-lg cursor-pointer transition-colors"
                       onClick={() => setMolarMassInput(prev => prev + element.symbol)}>
                    <div className="flex items-center gap-3">
                      <div className="font-mono font-bold text-primary w-8">{element.symbol}</div>
                      <div className="text-sm">{element.name}</div>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">{element.mass}</div>
                  </div>
                ))}
                
                <div className="pt-3 border-t border-border/30">
                  <div className="text-xs text-muted-foreground">
                    Click on elements to add them to the formula
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

export default PeriodicTable