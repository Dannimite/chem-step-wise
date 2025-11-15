import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Atom } from "lucide-react"

// Complete periodic table data - 109 elements (with state of matter at room temperature)
const periodicElements = [
  // Period 1
  { symbol: "H", name: "Hydrogen", atomicNumber: 1, atomicMass: 1.008, category: "nonmetal", period: 1, group: 1, state: "gas" },
  { symbol: "He", name: "Helium", atomicNumber: 2, atomicMass: 4.003, category: "noble-gas", period: 1, group: 18, state: "gas" },
  
  // Period 2
  { symbol: "Li", name: "Lithium", atomicNumber: 3, atomicMass: 6.94, category: "alkali-metal", period: 2, group: 1, state: "solid" },
  { symbol: "Be", name: "Beryllium", atomicNumber: 4, atomicMass: 9.012, category: "alkaline-earth-metal", period: 2, group: 2, state: "solid" },
  { symbol: "B", name: "Boron", atomicNumber: 5, atomicMass: 10.81, category: "metalloid", period: 2, group: 13, state: "solid" },
  { symbol: "C", name: "Carbon", atomicNumber: 6, atomicMass: 12.01, category: "nonmetal", period: 2, group: 14, state: "solid" },
  { symbol: "N", name: "Nitrogen", atomicNumber: 7, atomicMass: 14.01, category: "nonmetal", period: 2, group: 15, state: "gas" },
  { symbol: "O", name: "Oxygen", atomicNumber: 8, atomicMass: 16.00, category: "nonmetal", period: 2, group: 16, state: "gas" },
  { symbol: "F", name: "Fluorine", atomicNumber: 9, atomicMass: 19.00, category: "halogen", period: 2, group: 17, state: "gas" },
  { symbol: "Ne", name: "Neon", atomicNumber: 10, atomicMass: 20.18, category: "noble-gas", period: 2, group: 18, state: "gas" },
  
  // Period 3
  { symbol: "Na", name: "Sodium", atomicNumber: 11, atomicMass: 22.99, category: "alkali-metal", period: 3, group: 1, state: "solid" },
  { symbol: "Mg", name: "Magnesium", atomicNumber: 12, atomicMass: 24.31, category: "alkaline-earth-metal", period: 3, group: 2, state: "solid" },
  { symbol: "Al", name: "Aluminum", atomicNumber: 13, atomicMass: 26.98, category: "metal", period: 3, group: 13, state: "solid" },
  { symbol: "Si", name: "Silicon", atomicNumber: 14, atomicMass: 28.09, category: "metalloid", period: 3, group: 14, state: "solid" },
  { symbol: "P", name: "Phosphorus", atomicNumber: 15, atomicMass: 30.97, category: "nonmetal", period: 3, group: 15, state: "solid" },
  { symbol: "S", name: "Sulfur", atomicNumber: 16, atomicMass: 32.07, category: "nonmetal", period: 3, group: 16, state: "solid" },
  { symbol: "Cl", name: "Chlorine", atomicNumber: 17, atomicMass: 35.45, category: "halogen", period: 3, group: 17, state: "gas" },
  { symbol: "Ar", name: "Argon", atomicNumber: 18, atomicMass: 39.95, category: "noble-gas", period: 3, group: 18, state: "gas" },
  
  // Period 4
  { symbol: "K", name: "Potassium", atomicNumber: 19, atomicMass: 39.10, category: "alkali-metal", period: 4, group: 1, state: "solid" },
  { symbol: "Ca", name: "Calcium", atomicNumber: 20, atomicMass: 40.08, category: "alkaline-earth-metal", period: 4, group: 2, state: "solid" },
  { symbol: "Sc", name: "Scandium", atomicNumber: 21, atomicMass: 44.96, category: "transition-metal", period: 4, group: 3, state: "solid" },
  { symbol: "Ti", name: "Titanium", atomicNumber: 22, atomicMass: 47.87, category: "transition-metal", period: 4, group: 4, state: "solid" },
  { symbol: "V", name: "Vanadium", atomicNumber: 23, atomicMass: 50.94, category: "transition-metal", period: 4, group: 5, state: "solid" },
  { symbol: "Cr", name: "Chromium", atomicNumber: 24, atomicMass: 51.996, category: "transition-metal", period: 4, group: 6, state: "solid" },
  { symbol: "Mn", name: "Manganese", atomicNumber: 25, atomicMass: 54.94, category: "transition-metal", period: 4, group: 7, state: "solid" },
  { symbol: "Fe", name: "Iron", atomicNumber: 26, atomicMass: 55.85, category: "transition-metal", period: 4, group: 8, state: "solid" },
  { symbol: "Co", name: "Cobalt", atomicNumber: 27, atomicMass: 58.93, category: "transition-metal", period: 4, group: 9, state: "solid" },
  { symbol: "Ni", name: "Nickel", atomicNumber: 28, atomicMass: 58.69, category: "transition-metal", period: 4, group: 10, state: "solid" },
  { symbol: "Cu", name: "Copper", atomicNumber: 29, atomicMass: 63.55, category: "transition-metal", period: 4, group: 11, state: "solid" },
  { symbol: "Zn", name: "Zinc", atomicNumber: 30, atomicMass: 65.38, category: "transition-metal", period: 4, group: 12, state: "solid" },
  { symbol: "Ga", name: "Gallium", atomicNumber: 31, atomicMass: 69.72, category: "metal", period: 4, group: 13, state: "solid" },
  { symbol: "Ge", name: "Germanium", atomicNumber: 32, atomicMass: 72.63, category: "metalloid", period: 4, group: 14, state: "solid" },
  { symbol: "As", name: "Arsenic", atomicNumber: 33, atomicMass: 74.92, category: "metalloid", period: 4, group: 15, state: "solid" },
  { symbol: "Se", name: "Selenium", atomicNumber: 34, atomicMass: 78.97, category: "nonmetal", period: 4, group: 16, state: "solid" },
  { symbol: "Br", name: "Bromine", atomicNumber: 35, atomicMass: 79.90, category: "halogen", period: 4, group: 17, state: "liquid" },
  { symbol: "Kr", name: "Krypton", atomicNumber: 36, atomicMass: 83.80, category: "noble-gas", period: 4, group: 18, state: "gas" },
  
  // Period 5
  { symbol: "Rb", name: "Rubidium", atomicNumber: 37, atomicMass: 85.47, category: "alkali-metal", period: 5, group: 1, state: "solid" },
  { symbol: "Sr", name: "Strontium", atomicNumber: 38, atomicMass: 87.62, category: "alkaline-earth-metal", period: 5, group: 2, state: "solid" },
  { symbol: "Y", name: "Yttrium", atomicNumber: 39, atomicMass: 88.91, category: "transition-metal", period: 5, group: 3, state: "solid" },
  { symbol: "Zr", name: "Zirconium", atomicNumber: 40, atomicMass: 91.22, category: "transition-metal", period: 5, group: 4, state: "solid" },
  { symbol: "Nb", name: "Niobium", atomicNumber: 41, atomicMass: 92.91, category: "transition-metal", period: 5, group: 5, state: "solid" },
  { symbol: "Mo", name: "Molybdenum", atomicNumber: 42, atomicMass: 95.95, category: "transition-metal", period: 5, group: 6, state: "solid" },
  { symbol: "Tc", name: "Technetium", atomicNumber: 43, atomicMass: 98, category: "transition-metal", period: 5, group: 7, state: "solid" },
  { symbol: "Ru", name: "Ruthenium", atomicNumber: 44, atomicMass: 101.07, category: "transition-metal", period: 5, group: 8, state: "solid" },
  { symbol: "Rh", name: "Rhodium", atomicNumber: 45, atomicMass: 102.91, category: "transition-metal", period: 5, group: 9, state: "solid" },
  { symbol: "Pd", name: "Palladium", atomicNumber: 46, atomicMass: 106.42, category: "transition-metal", period: 5, group: 10, state: "solid" },
  { symbol: "Ag", name: "Silver", atomicNumber: 47, atomicMass: 107.87, category: "transition-metal", period: 5, group: 11, state: "solid" },
  { symbol: "Cd", name: "Cadmium", atomicNumber: 48, atomicMass: 112.41, category: "transition-metal", period: 5, group: 12, state: "solid" },
  { symbol: "In", name: "Indium", atomicNumber: 49, atomicMass: 114.82, category: "metal", period: 5, group: 13, state: "solid" },
  { symbol: "Sn", name: "Tin", atomicNumber: 50, atomicMass: 118.71, category: "metal", period: 5, group: 14, state: "solid" },
  { symbol: "Sb", name: "Antimony", atomicNumber: 51, atomicMass: 121.76, category: "metalloid", period: 5, group: 15, state: "solid" },
  { symbol: "Te", name: "Tellurium", atomicNumber: 52, atomicMass: 127.60, category: "metalloid", period: 5, group: 16, state: "solid" },
  { symbol: "I", name: "Iodine", atomicNumber: 53, atomicMass: 126.90, category: "halogen", period: 5, group: 17, state: "solid" },
  { symbol: "Xe", name: "Xenon", atomicNumber: 54, atomicMass: 131.29, category: "noble-gas", period: 5, group: 18, state: "gas" },
  
  // Period 6
  { symbol: "Cs", name: "Cesium", atomicNumber: 55, atomicMass: 132.91, category: "alkali-metal", period: 6, group: 1, state: "solid" },
  { symbol: "Ba", name: "Barium", atomicNumber: 56, atomicMass: 137.33, category: "alkaline-earth-metal", period: 6, group: 2, state: "solid" },
  { symbol: "La", name: "Lanthanum", atomicNumber: 57, atomicMass: 138.91, category: "lanthanide", period: 6, group: 3, state: "solid" },
  { symbol: "Ce", name: "Cerium", atomicNumber: 58, atomicMass: 140.12, category: "lanthanide", period: 6, group: 3, state: "solid" },
  { symbol: "Pr", name: "Praseodymium", atomicNumber: 59, atomicMass: 140.91, category: "lanthanide", period: 6, group: 3, state: "solid" },
  { symbol: "Nd", name: "Neodymium", atomicNumber: 60, atomicMass: 144.24, category: "lanthanide", period: 6, group: 3, state: "solid" },
  { symbol: "Pm", name: "Promethium", atomicNumber: 61, atomicMass: 145, category: "lanthanide", period: 6, group: 3, state: "solid" },
  { symbol: "Sm", name: "Samarium", atomicNumber: 62, atomicMass: 150.36, category: "lanthanide", period: 6, group: 3, state: "solid" },
  { symbol: "Eu", name: "Europium", atomicNumber: 63, atomicMass: 151.96, category: "lanthanide", period: 6, group: 3, state: "solid" },
  { symbol: "Gd", name: "Gadolinium", atomicNumber: 64, atomicMass: 157.25, category: "lanthanide", period: 6, group: 3, state: "solid" },
  { symbol: "Tb", name: "Terbium", atomicNumber: 65, atomicMass: 158.93, category: "lanthanide", period: 6, group: 3, state: "solid" },
  { symbol: "Dy", name: "Dysprosium", atomicNumber: 66, atomicMass: 162.50, category: "lanthanide", period: 6, group: 3, state: "solid" },
  { symbol: "Ho", name: "Holmium", atomicNumber: 67, atomicMass: 164.93, category: "lanthanide", period: 6, group: 3, state: "solid" },
  { symbol: "Er", name: "Erbium", atomicNumber: 68, atomicMass: 167.26, category: "lanthanide", period: 6, group: 3, state: "solid" },
  { symbol: "Tm", name: "Thulium", atomicNumber: 69, atomicMass: 168.93, category: "lanthanide", period: 6, group: 3, state: "solid" },
  { symbol: "Yb", name: "Ytterbium", atomicNumber: 70, atomicMass: 173.05, category: "lanthanide", period: 6, group: 3, state: "solid" },
  { symbol: "Lu", name: "Lutetium", atomicNumber: 71, atomicMass: 174.97, category: "lanthanide", period: 6, group: 3, state: "solid" },
  { symbol: "Hf", name: "Hafnium", atomicNumber: 72, atomicMass: 178.49, category: "transition-metal", period: 6, group: 4, state: "solid" },
  { symbol: "Ta", name: "Tantalum", atomicNumber: 73, atomicMass: 180.95, category: "transition-metal", period: 6, group: 5, state: "solid" },
  { symbol: "W", name: "Tungsten", atomicNumber: 74, atomicMass: 183.84, category: "transition-metal", period: 6, group: 6, state: "solid" },
  { symbol: "Re", name: "Rhenium", atomicNumber: 75, atomicMass: 186.21, category: "transition-metal", period: 6, group: 7, state: "solid" },
  { symbol: "Os", name: "Osmium", atomicNumber: 76, atomicMass: 190.23, category: "transition-metal", period: 6, group: 8, state: "solid" },
  { symbol: "Ir", name: "Iridium", atomicNumber: 77, atomicMass: 192.22, category: "transition-metal", period: 6, group: 9, state: "solid" },
  { symbol: "Pt", name: "Platinum", atomicNumber: 78, atomicMass: 195.08, category: "transition-metal", period: 6, group: 10, state: "solid" },
  { symbol: "Au", name: "Gold", atomicNumber: 79, atomicMass: 196.97, category: "transition-metal", period: 6, group: 11, state: "solid" },
  { symbol: "Hg", name: "Mercury", atomicNumber: 80, atomicMass: 200.59, category: "transition-metal", period: 6, group: 12, state: "liquid" },
  { symbol: "Tl", name: "Thallium", atomicNumber: 81, atomicMass: 204.38, category: "metal", period: 6, group: 13, state: "solid" },
  { symbol: "Pb", name: "Lead", atomicNumber: 82, atomicMass: 207.2, category: "metal", period: 6, group: 14, state: "solid" },
  { symbol: "Bi", name: "Bismuth", atomicNumber: 83, atomicMass: 208.98, category: "metal", period: 6, group: 15, state: "solid" },
  { symbol: "Po", name: "Polonium", atomicNumber: 84, atomicMass: 209, category: "metalloid", period: 6, group: 16, state: "solid" },
  { symbol: "At", name: "Astatine", atomicNumber: 85, atomicMass: 210, category: "halogen", period: 6, group: 17, state: "solid" },
  { symbol: "Rn", name: "Radon", atomicNumber: 86, atomicMass: 222, category: "noble-gas", period: 6, group: 18, state: "gas" },
  
  // Period 7
  { symbol: "Fr", name: "Francium", atomicNumber: 87, atomicMass: 223, category: "alkali-metal", period: 7, group: 1, state: "solid" },
  { symbol: "Ra", name: "Radium", atomicNumber: 88, atomicMass: 226, category: "alkaline-earth-metal", period: 7, group: 2, state: "solid" },
  { symbol: "Ac", name: "Actinium", atomicNumber: 89, atomicMass: 227, category: "actinide", period: 7, group: 3, state: "solid" },
  { symbol: "Th", name: "Thorium", atomicNumber: 90, atomicMass: 232.04, category: "actinide", period: 7, group: 3, state: "solid" },
  { symbol: "Pa", name: "Protactinium", atomicNumber: 91, atomicMass: 231.04, category: "actinide", period: 7, group: 3, state: "solid" },
  { symbol: "U", name: "Uranium", atomicNumber: 92, atomicMass: 238.03, category: "actinide", period: 7, group: 3, state: "solid" },
  { symbol: "Np", name: "Neptunium", atomicNumber: 93, atomicMass: 237, category: "actinide", period: 7, group: 3, state: "solid" },
  { symbol: "Pu", name: "Plutonium", atomicNumber: 94, atomicMass: 244, category: "actinide", period: 7, group: 3, state: "solid" },
  { symbol: "Am", name: "Americium", atomicNumber: 95, atomicMass: 243, category: "actinide", period: 7, group: 3, state: "solid" },
  { symbol: "Cm", name: "Curium", atomicNumber: 96, atomicMass: 247, category: "actinide", period: 7, group: 3, state: "solid" },
  { symbol: "Bk", name: "Berkelium", atomicNumber: 97, atomicMass: 247, category: "actinide", period: 7, group: 3, state: "solid" },
  { symbol: "Cf", name: "Californium", atomicNumber: 98, atomicMass: 251, category: "actinide", period: 7, group: 3, state: "solid" },
  { symbol: "Es", name: "Einsteinium", atomicNumber: 99, atomicMass: 252, category: "actinide", period: 7, group: 3, state: "solid" },
  { symbol: "Fm", name: "Fermium", atomicNumber: 100, atomicMass: 257, category: "actinide", period: 7, group: 3, state: "solid" },
  { symbol: "Md", name: "Mendelevium", atomicNumber: 101, atomicMass: 258, category: "actinide", period: 7, group: 3, state: "solid" },
  { symbol: "No", name: "Nobelium", atomicNumber: 102, atomicMass: 259, category: "actinide", period: 7, group: 3, state: "solid" },
  { symbol: "Lr", name: "Lawrencium", atomicNumber: 103, atomicMass: 262, category: "actinide", period: 7, group: 3, state: "solid" },
  { symbol: "Rf", name: "Rutherfordium", atomicNumber: 104, atomicMass: 267, category: "transition-metal", period: 7, group: 4, state: "solid" },
  { symbol: "Db", name: "Dubnium", atomicNumber: 105, atomicMass: 270, category: "transition-metal", period: 7, group: 5, state: "solid" },
  { symbol: "Sg", name: "Seaborgium", atomicNumber: 106, atomicMass: 271, category: "transition-metal", period: 7, group: 6, state: "solid" },
  { symbol: "Bh", name: "Bohrium", atomicNumber: 107, atomicMass: 270, category: "transition-metal", period: 7, group: 7, state: "solid" },
  { symbol: "Hs", name: "Hassium", atomicNumber: 108, atomicMass: 277, category: "transition-metal", period: 7, group: 8, state: "solid" },
  { symbol: "Mt", name: "Meitnerium", atomicNumber: 109, atomicMass: 276, category: "transition-metal", period: 7, group: 9, state: "solid" },
]

const stateColors = {
  "solid": "border-l-4 border-l-blue-500",
  "liquid": "border-l-4 border-l-amber-500",
  "gas": "border-l-4 border-l-purple-500"
}

const categoryColors = {
  "alkali-metal": "bg-red-500/20 border-red-500/40 text-red-700 dark:text-red-300",
  "alkaline-earth-metal": "bg-orange-500/20 border-orange-500/40 text-orange-700 dark:text-orange-300",
  "metal": "bg-blue-500/20 border-blue-500/40 text-blue-700 dark:text-blue-300",
  "metalloid": "bg-green-500/20 border-green-500/40 text-green-700 dark:text-green-300",
  "nonmetal": "bg-yellow-500/20 border-yellow-500/40 text-yellow-700 dark:text-yellow-300",
  "halogen": "bg-purple-500/20 border-purple-500/40 text-purple-700 dark:text-purple-300",
  "noble-gas": "bg-pink-500/20 border-pink-500/40 text-pink-700 dark:text-pink-300",
  "transition-metal": "bg-cyan-500/20 border-cyan-500/40 text-cyan-700 dark:text-cyan-300",
  "lanthanide": "bg-violet-500/20 border-violet-500/40 text-violet-700 dark:text-violet-300",
  "actinide": "bg-rose-500/20 border-rose-500/40 text-rose-700 dark:text-rose-300"
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
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryColors).map(([category, colorClass]) => (
              <Badge key={category} variant="outline" className={`text-xs ${colorClass}`}>
                {category.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs border-l-4 border-l-blue-500">
              Solid
            </Badge>
            <Badge variant="outline" className="text-xs border-l-4 border-l-amber-500">
              Liquid
            </Badge>
            <Badge variant="outline" className="text-xs border-l-4 border-l-purple-500">
              Gas
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="table" className="w-full" onValueChange={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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
                <CardContent className="overflow-x-auto">
                  {/* Main Periodic Table Grid */}
                  <div className="grid grid-cols-18 gap-1 min-w-[900px]">
                    {Array.from({ length: 7 }, (_, periodIndex) => {
                      const period = periodIndex + 1;
                      return Array.from({ length: 18 }, (_, groupIndex) => {
                        const group = groupIndex + 1;
                        
                        // Find element for this position
                        let element = filteredElements.find(el => 
                          el.period === period && el.group === group && 
                          el.category !== 'lanthanide' && el.category !== 'actinide'
                        );
                        
                        // Special handling for lanthanides and actinides placeholder
                        if (period === 6 && group === 3) {
                          // Placeholder for lanthanides
                          return (
                            <div key={`${period}-${group}-placeholder`} 
                                 className="h-14 w-14 border border-dashed border-violet-400 rounded flex items-center justify-center text-xs text-muted-foreground bg-violet-500/10">
                              57-71
                            </div>
                          );
                        }
                        if (period === 7 && group === 3) {
                          // Placeholder for actinides
                          return (
                            <div key={`${period}-${group}-placeholder`} 
                                 className="h-14 w-14 border border-dashed border-rose-400 rounded flex items-center justify-center text-xs text-muted-foreground bg-rose-500/10">
                              89-103
                            </div>
                          );
                        }
                        
                        if (element) {
                          return (
                            <Button
                              key={element.symbol}
                              variant={selectedElement.symbol === element.symbol ? "default" : "outline"}
                              className={`h-14 w-14 p-1 flex flex-col items-center justify-center text-xs transition-all hover:scale-105 ${
                                categoryColors[element.category as keyof typeof categoryColors]
                              } ${stateColors[element.state as keyof typeof stateColors]}`}
                              onClick={() => setSelectedElement(element)}
                            >
                              <div className="font-bold text-sm">{element.symbol}</div>
                              <div className="text-xs opacity-70">{element.atomicNumber}</div>
                            </Button>
                          );
                        }
                        
                        // Empty cells
                        return <div key={`${period}-${group}-empty`} className="h-14 w-14" />;
                      });
                    })}
                  </div>
                  
                  {/* Lanthanides and Actinides */}
                  <div className="mt-6 space-y-2">
                    {/* Lanthanides */}
                    <div className="flex gap-1">
                      <div className="h-14 w-14 flex items-center justify-center text-xs font-medium text-muted-foreground">
                        Lanthanides
                      </div>
                      {filteredElements
                        .filter(el => el.category === 'lanthanide')
                        .sort((a, b) => a.atomicNumber - b.atomicNumber)
                        .map((element) => (
                          <Button
                            key={element.symbol}
                            variant={selectedElement.symbol === element.symbol ? "default" : "outline"}
                            className={`h-14 w-14 p-1 flex flex-col items-center justify-center text-xs transition-all hover:scale-105 ${
                              categoryColors[element.category as keyof typeof categoryColors]
                            } ${stateColors[element.state as keyof typeof stateColors]}`}
                            onClick={() => setSelectedElement(element)}
                          >
                            <div className="font-bold text-sm">{element.symbol}</div>
                            <div className="text-xs opacity-70">{element.atomicNumber}</div>
                          </Button>
                        ))}
                    </div>
                    
                    {/* Actinides */}
                    <div className="flex gap-1">
                      <div className="h-14 w-14 flex items-center justify-center text-xs font-medium text-muted-foreground">
                        Actinides
                      </div>
                      {filteredElements
                        .filter(el => el.category === 'actinide')
                        .sort((a, b) => a.atomicNumber - b.atomicNumber)
                        .map((element) => (
                          <Button
                            key={element.symbol}
                            variant={selectedElement.symbol === element.symbol ? "default" : "outline"}
                            className={`h-14 w-14 p-1 flex flex-col items-center justify-center text-xs transition-all hover:scale-105 ${
                              categoryColors[element.category as keyof typeof categoryColors]
                            } ${stateColors[element.state as keyof typeof stateColors]}`}
                            onClick={() => setSelectedElement(element)}
                          >
                            <div className="font-bold text-sm">{element.symbol}</div>
                            <div className="text-xs opacity-70">{element.atomicNumber}</div>
                          </Button>
                        ))}
                    </div>
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
                    
                    <div>
                      <div className="font-medium text-sm text-muted-foreground">State at Room Temp</div>
                      <Badge variant="outline" className={`mt-1 ${stateColors[selectedElement.state as keyof typeof stateColors]}`}>
                        {selectedElement.state.charAt(0).toUpperCase() + selectedElement.state.slice(1)}
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