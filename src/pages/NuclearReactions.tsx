import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Atom, Zap, AlertTriangle } from "lucide-react"

// Nuclear reaction types and examples
const reactionTypes = [
  {
    id: "alpha-decay",
    name: "Alpha Decay",
    symbol: "α",
    description: "Emission of alpha particle (helium nucleus)",
    generalForm: "²³⁸U → ²³⁴Th + ⁴He",
    category: "decay",
    energyChange: "Releases energy",
    halfLife: "Variable"
  },
  {
    id: "beta-minus-decay",
    name: "Beta Minus Decay",
    symbol: "β⁻",
    description: "Neutron converts to proton, emitting electron",
    generalForm: "¹⁴C → ¹⁴N + e⁻ + ν̄ₑ",
    category: "decay",
    energyChange: "Releases energy",
    halfLife: "Variable"
  },
  {
    id: "beta-plus-decay",
    name: "Beta Plus Decay",
    symbol: "β⁺",
    description: "Proton converts to neutron, emitting positron",
    generalForm: "¹¹C → ¹¹B + e⁺ + νₑ",
    category: "decay",
    energyChange: "Releases energy",
    halfLife: "Variable"
  },
  {
    id: "gamma-emission",
    name: "Gamma Emission",
    symbol: "γ",
    description: "Emission of high-energy electromagnetic radiation",
    generalForm: "⁹⁹ᵐTc → ⁹⁹Tc + γ",
    category: "decay",
    energyChange: "Releases energy",
    halfLife: "Very short"
  },
  {
    id: "nuclear-fission",
    name: "Nuclear Fission",
    symbol: "Split",
    description: "Heavy nucleus splits into lighter nuclei",
    generalForm: "²³⁵U + n → ¹⁴⁴Ba + ⁸⁹Kr + 3n",
    category: "fission",
    energyChange: "Massive energy release",
    halfLife: "Instantaneous"
  },
  {
    id: "nuclear-fusion",
    name: "Nuclear Fusion",
    symbol: "Fuse",
    description: "Light nuclei combine to form heavier nucleus",
    generalForm: "²H + ³H → ⁴He + n",
    category: "fusion",
    energyChange: "Massive energy release",
    halfLife: "Instantaneous"
  },
  {
    id: "electron-capture",
    name: "Electron Capture",
    symbol: "EC",
    description: "Nucleus captures inner orbital electron",
    generalForm: "⁷Be + e⁻ → ⁷Li + νₑ",
    category: "decay",
    energyChange: "Releases energy",
    halfLife: "Variable"
  },
  {
    id: "neutron-activation",
    name: "Neutron Activation",
    symbol: "n,γ",
    description: "Stable nucleus absorbs neutron becomes radioactive",
    generalForm: "²³Na + n → ²⁴Na + γ",
    category: "activation",
    energyChange: "Absorbs energy",
    halfLife: "Creates radioactive isotope"
  }
]

const nuclearExamples = [
  {
    id: "uranium-decay",
    name: "Uranium-238 Decay Chain",
    reaction: "²³⁸U → ²³⁴Th + ⁴He",
    type: "Alpha Decay",
    halfLife: "4.468 billion years",
    energy: "4.270 MeV",
    applications: ["Dating rocks", "Nuclear fuel"],
    description: "Uranium-238 undergoes alpha decay to form thorium-234"
  },
  {
    id: "carbon-dating",
    name: "Carbon-14 Decay",
    reaction: "¹⁴C → ¹⁴N + e⁻ + ν̄ₑ",
    type: "Beta Minus Decay",
    halfLife: "5,730 years",
    energy: "0.156 MeV",
    applications: ["Carbon dating", "Archaeological dating"],
    description: "Carbon-14 beta decay used for dating organic materials"
  },
  {
    id: "nuclear-power",
    name: "Nuclear Power Fission",
    reaction: "²³⁵U + n → ¹⁴¹Ba + ⁹²Kr + 3n",
    type: "Nuclear Fission",
    halfLife: "Instantaneous",
    energy: "≈200 MeV",
    applications: ["Nuclear power plants", "Nuclear weapons"],
    description: "Uranium-235 fission reaction used in nuclear reactors"
  },
  {
    id: "solar-fusion",
    name: "Solar Fusion (Proton-Proton Chain)",
    reaction: "4¹H → ⁴He + 2e⁺ + 2νₑ",
    type: "Nuclear Fusion",
    halfLife: "Continuous",
    energy: "26.7 MeV",
    applications: ["Solar energy", "Stellar nucleosynthesis"],
    description: "Primary fusion reaction powering the Sun"
  },
  {
    id: "medical-technetium",
    name: "Technetium-99m Decay",
    reaction: "⁹⁹ᵐTc → ⁹⁹Tc + γ",
    type: "Gamma Emission",
    halfLife: "6.01 hours",
    energy: "0.140 MeV",
    applications: ["Medical imaging", "SPECT scans"],
    description: "Most widely used radioisotope in nuclear medicine"
  },
  {
    id: "tritium-fusion",
    name: "Deuterium-Tritium Fusion",
    reaction: "²H + ³H → ⁴He + n",
    type: "Nuclear Fusion",
    halfLife: "Instantaneous",
    energy: "17.6 MeV",
    applications: ["Fusion reactors", "Neutron sources"],
    description: "Most energetic fusion reaction for terrestrial applications"
  }
]

const categoryColors = {
  "decay": "bg-orange-500/20 border-orange-500/40 text-orange-700 dark:text-orange-300",
  "fission": "bg-red-500/20 border-red-500/40 text-red-700 dark:text-red-300",
  "fusion": "bg-blue-500/20 border-blue-500/40 text-blue-700 dark:text-blue-300",
  "activation": "bg-green-500/20 border-green-500/40 text-green-700 dark:text-green-300"
}

const NuclearReactions = () => {
  const [selectedReaction, setSelectedReaction] = useState(reactionTypes[0])
  const [selectedExample, setSelectedExample] = useState(nuclearExamples[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [halfLifeInput, setHalfLifeInput] = useState("")
  const [halfLifeResult, setHalfLifeResult] = useState("")

  const filteredReactions = reactionTypes.filter(reaction =>
    reaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredExamples = nuclearExamples.filter(example =>
    example.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    example.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const calculateHalfLife = () => {
    const input = halfLifeInput.trim()
    if (!input) {
      setHalfLifeResult("Please enter values")
      return
    }

    // Parse input for half-life calculations
    // Format: "N0=1000, t=5730, N=500" for calculating remaining amount
    // Format: "N0=1000, N=250, t=?" for calculating time
    try {
      const params: Record<string, number> = {}
      const pairs = input.split(',').map(p => p.trim())
      
      pairs.forEach(pair => {
        const [key, value] = pair.split('=')
        if (key && value && !isNaN(Number(value))) {
          params[key.trim()] = Number(value)
        }
      })

      let result = ""
      
      if (params.N0 && params.t && params.N && !params.halfLife) {
        // Calculate half-life: t₁/₂ = t × ln(2) / ln(N₀/N)
        const halfLife = params.t * Math.log(2) / Math.log(params.N0 / params.N)
        result = `Half-life calculation:\n`
        result += `t₁/₂ = t × ln(2) / ln(N₀/N)\n`
        result += `t₁/₂ = ${params.t} × 0.693 / ln(${params.N0}/${params.N})\n`
        result += `t₁/₂ = ${halfLife.toFixed(2)} time units`
      } else if (params.N0 && params.halfLife && params.t) {
        // Calculate remaining amount: N = N₀ × (1/2)^(t/t₁/₂)
        const remaining = params.N0 * Math.pow(0.5, params.t / params.halfLife)
        result = `Remaining amount calculation:\n`
        result += `N = N₀ × (1/2)^(t/t₁/₂)\n`
        result += `N = ${params.N0} × (1/2)^(${params.t}/${params.halfLife})\n`
        result += `N = ${remaining.toFixed(2)} units`
      } else if (params.N0 && params.halfLife && params.N) {
        // Calculate time: t = t₁/₂ × log₀.₅(N/N₀)
        const time = params.halfLife * Math.log(params.N / params.N0) / Math.log(0.5)
        result = `Time calculation:\n`
        result += `t = t₁/₂ × log₀.₅(N/N₀)\n`
        result += `t = ${params.halfLife} × log₀.₅(${params.N}/${params.N0})\n`
        result += `t = ${time.toFixed(2)} time units`
      } else {
        result = "Invalid input format.\nExamples:\n"
        result += "Calculate half-life: N0=1000, t=5730, N=500\n"
        result += "Calculate remaining: N0=1000, halfLife=5730, t=11460\n"
        result += "Calculate time: N0=1000, halfLife=5730, N=250"
      }
      
      setHalfLifeResult(result)
    } catch (error) {
      setHalfLifeResult("Error in calculation. Please check your input format.")
    }
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary shadow-elegant">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Nuclear Reactions</h1>
            <p className="text-muted-foreground">Explore nuclear processes, decay chains, and energy calculations</p>
          </div>
        </div>

        {/* Category Legend */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryColors).map(([category, colorClass]) => (
            <Badge key={category} variant="outline" className={`text-xs ${colorClass}`}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Badge>
          ))}
        </div>

        {/* Safety Notice */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Safety Notice</span>
          </div>
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
            Nuclear reactions involve radioactive materials and high energy. Always follow proper safety protocols and regulations.
          </p>
        </div>
      </div>

      <Tabs defaultValue="reactions" className="w-full" onValueChange={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reactions">Reaction Types</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="calculator">Half-Life Calculator</TabsTrigger>
        </TabsList>

        <TabsContent value="reactions" className="space-y-6">
          {/* Search */}
          <div className="max-w-md">
            <Input
              placeholder="Search reaction types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Reaction Types Grid */}
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Nuclear Reaction Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredReactions.map((reaction) => (
                      <Button
                        key={reaction.id}
                        variant={selectedReaction.id === reaction.id ? "default" : "outline"}
                        className={`h-auto p-4 flex flex-col items-start justify-start text-left transition-all hover:scale-[1.02] ${
                          categoryColors[reaction.category as keyof typeof categoryColors]
                        }`}
                        onClick={() => setSelectedReaction(reaction)}
                      >
                        <div className="flex items-center gap-2 w-full flex-wrap">
                          <span className="font-bold text-lg flex-shrink-0">{reaction.symbol}</span>
                          <span className="font-medium break-words">{reaction.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 break-words w-full">
                          {reaction.description}
                        </p>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reaction Details */}
            <div className="space-y-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Atom className="h-5 w-5" />
                    {selectedReaction.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Badge 
                      variant="outline" 
                      className={categoryColors[selectedReaction.category as keyof typeof categoryColors]}
                    >
                      {selectedReaction.category.charAt(0).toUpperCase() + selectedReaction.category.slice(1)}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm">General Form:</h4>
                    <p className="text-sm font-mono bg-muted/50 p-2 rounded">
                      {selectedReaction.generalForm}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm">Description:</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedReaction.description}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm">Energy Change:</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedReaction.energyChange}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm">Time Scale:</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedReaction.halfLife}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="examples" className="space-y-6">
          {/* Search */}
          <div className="max-w-md">
            <Input
              placeholder="Search examples..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Examples Grid */}
            <div className="lg:col-span-2">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Nuclear Reaction Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {filteredExamples.map((example) => (
                      <Button
                        key={example.id}
                        variant={selectedExample.id === example.id ? "default" : "outline"}
                        className="h-auto p-4 flex flex-col items-start justify-start text-left transition-all hover:scale-[1.01]"
                        onClick={() => setSelectedExample(example)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-medium">{example.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {example.type}
                          </Badge>
                        </div>
                        <p className="text-sm font-mono text-muted-foreground mt-1">
                          {example.reaction}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {example.description}
                        </p>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Example Details */}
            <div className="space-y-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    {selectedExample.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm">Reaction:</h4>
                    <p className="text-sm font-mono bg-muted/50 p-2 rounded">
                      {selectedExample.reaction}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm">Type:</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedExample.type}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm">Half-Life:</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedExample.halfLife}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm">Energy Released:</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedExample.energy}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm">Applications:</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedExample.applications.map((app, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm">Description:</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedExample.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Half-Life Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Input Parameters:</label>
                <Input
                  placeholder="Example: N0=1000, t=5730, N=500"
                  value={halfLifeInput}
                  onChange={(e) => setHalfLifeInput(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use: N0 (initial amount), N (final amount), t (time), halfLife (half-life period)
                </p>
              </div>
              
              <Button onClick={calculateHalfLife} className="w-full">
                Calculate
              </Button>
              
              {halfLifeResult && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Result:</h4>
                  <pre className="text-sm whitespace-pre-wrap">{halfLifeResult}</pre>
                </div>
              )}

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-300 mb-2">
                  Half-Life Formulas:
                </h4>
                <div className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
                  <p>• Exponential Decay: N = N₀ × (1/2)^(t/t₁/₂)</p>
                  <p>• Half-Life: t₁/₂ = t × ln(2) / ln(N₀/N)</p>
                  <p>• Decay Constant: λ = ln(2) / t₁/₂</p>
                  <p>• Activity: A = λN = A₀ × e^(-λt)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default NuclearReactions