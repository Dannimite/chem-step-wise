import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Scale, TrendingUp, TrendingDown, Thermometer } from "lucide-react";
import { useState } from "react";

const ChemicalEquilibrium = () => {
  const [selectedFactor, setSelectedFactor] = useState(0);

  const equilibriumExamples = [
    {
      name: "Haber Process",
      equation: "N₂ + 3H₂ ⇌ 2NH₃",
      description: "Industrial production of ammonia",
      conditions: "High pressure (200-300 atm), moderate temperature (400-500°C), iron catalyst",
      application: "Fertilizer production, essential for food security"
    },
    {
      name: "Contact Process",
      equation: "2SO₂ + O₂ ⇌ 2SO₃",
      description: "Production of sulfuric acid",
      conditions: "High pressure, 450°C, vanadium(V) oxide catalyst",
      application: "Chemical industry, battery acid, fertilizers"
    },
    {
      name: "Carbonic Acid System",
      equation: "CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻",
      description: "Buffer system in blood",
      conditions: "Body temperature (37°C), physiological pH (7.4)",
      application: "Maintains blood pH, respiratory regulation"
    }
  ];

  const leChatelierFactors = [
    {
      factor: "Concentration",
      icon: <Scale className="h-5 w-5" />,
      description: "Adding or removing reactants/products shifts equilibrium",
      examples: [
        "Increase reactant → shifts right (forward)",
        "Increase product → shifts left (reverse)",
        "Remove product → shifts right (forward)",
        "Remove reactant → shifts left (reverse)"
      ],
      realWorld: "Adding oxygen to hemoglobin increases oxygen-carrying capacity"
    },
    {
      factor: "Temperature",
      icon: <Thermometer className="h-5 w-5" />,
      description: "Heat affects endothermic and exothermic reactions differently",
      examples: [
        "Endothermic: higher temp → shifts right",
        "Exothermic: higher temp → shifts left",
        "Lower temp favors exothermic direction",
        "Higher temp favors endothermic direction"
      ],
      realWorld: "Body temperature regulation affects oxygen binding to hemoglobin"
    },
    {
      factor: "Pressure",
      icon: <TrendingUp className="h-5 w-5" />,
      description: "Affects reactions involving gases (based on moles of gas)",
      examples: [
        "Higher pressure → favors fewer gas molecules",
        "Lower pressure → favors more gas molecules",
        "No effect if equal moles of gas on both sides",
        "Solids and liquids minimally affected"
      ],
      realWorld: "Deep-sea diving affects gas solubility in blood"
    },
    {
      factor: "Catalyst",
      icon: <TrendingDown className="h-5 w-5" />,
      description: "Speeds up both forward and reverse reactions equally",
      examples: [
        "Increases rate of reaching equilibrium",
        "Does not change equilibrium position",
        "Does not change equilibrium constant",
        "Lowers activation energy for both directions"
      ],
      realWorld: "Enzymes speed up metabolic reactions without changing equilibrium"
    }
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Chemical Equilibrium & Le Châtelier's Principle</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Understanding dynamic equilibrium and how systems respond to changes
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary" />
              What is Chemical Equilibrium?
            </CardTitle>
            <CardDescription>
              A dynamic state where forward and reverse reaction rates are equal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Key Characteristics:</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                      <div>
                        <p className="font-medium">Dynamic Process</p>
                        <p className="text-sm text-muted-foreground">Reactions continue in both directions at equal rates</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                      <div>
                        <p className="font-medium">Constant Concentrations</p>
                        <p className="text-sm text-muted-foreground">Concentrations of all species remain constant</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                      <div>
                        <p className="font-medium">Closed System</p>
                        <p className="text-sm text-muted-foreground">No exchange of matter with surroundings</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Equilibrium Expression:</h3>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                    <p className="text-center">For reaction: aA + bB ⇌ cC + dD</p>
                    <div className="text-center">
                      <div className="bg-primary/10 p-3 rounded inline-block">
                        <code className="text-lg">Kc = [C]ᶜ[D]ᵈ / [A]ᵃ[B]ᵇ</code>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Kc = equilibrium constant (concentration)
                    </p>
                  </div>
                  <div className="text-sm space-y-2">
                    <p><strong>Kc {'>>'} 1:</strong> Products favored</p>
                    <p><strong>Kc {'<<'} 1:</strong> Reactants favored</p>
                    <p><strong>Kc ≈ 1:</strong> Similar amounts of reactants and products</p>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-muted/20">
                <h3 className="font-medium mb-3">Visual Representation:</h3>
                <div className="flex items-center justify-center gap-4 text-center">
                  <div className="flex-1">
                    <p className="font-medium">Reactants</p>
                    <p className="text-sm text-muted-foreground">A + B</p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <ArrowRight className="h-4 w-4" />
                    <ArrowLeft className="h-4 w-4" />
                    <p className="text-xs">Equal rates</p>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Products</p>
                    <p className="text-sm text-muted-foreground">C + D</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Le Châtelier's Principle</CardTitle>
            <CardDescription>
              How equilibrium systems respond to external changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <h3 className="font-semibold mb-2">The Principle:</h3>
                <p className="text-sm">
                  "When a system at equilibrium is subjected to a change in concentration, temperature, or pressure, 
                  the system will shift its equilibrium position to counteract the imposed change."
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {leChatelierFactors.map((factor, index) => (
                  <Button
                    key={index}
                    variant={selectedFactor === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFactor(index)}
                    className="flex items-center gap-2"
                  >
                    {factor.icon}
                    {factor.factor}
                  </Button>
                ))}
              </div>

              <div className="border rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {leChatelierFactors[selectedFactor].icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{leChatelierFactors[selectedFactor].factor}</h3>
                    <p className="text-muted-foreground">{leChatelierFactors[selectedFactor].description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-3">Effects:</h4>
                    <ul className="space-y-2">
                      {leChatelierFactors[selectedFactor].examples.map((example, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Real-World Example:</h4>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                      {leChatelierFactors[selectedFactor].realWorld}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Industrial Applications</CardTitle>
            <CardDescription>
              How equilibrium principles are used in chemical manufacturing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {equilibriumExamples.map((example, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{example.name}</h3>
                    <Badge variant="outline">Industrial</Badge>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="font-mono text-center text-lg">{example.equation}</p>
                  </div>

                  <p className="text-muted-foreground">{example.description}</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Optimized Conditions:</h4>
                      <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded">
                        {example.conditions}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Application:</h4>
                      <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded">
                        {example.application}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Biological Equilibria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Oxygen Transport</h3>
                <div className="border rounded-lg p-4 space-y-2">
                  <code className="text-sm">Hb + 4O₂ ⇌ Hb(O₂)₄</code>
                  <p className="text-sm text-muted-foreground">
                    Hemoglobin binds oxygen in lungs (high O₂) and releases it in tissues (low O₂)
                  </p>
                  <Badge variant="secondary">Respiratory System</Badge>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">pH Buffer System</h3>
                <div className="border rounded-lg p-4 space-y-2">
                  <code className="text-sm">HCO₃⁻ + H⁺ ⇌ H₂CO₃ ⇌ CO₂ + H₂O</code>
                  <p className="text-sm text-muted-foreground">
                    Maintains blood pH within narrow range (7.35-7.45) essential for life
                  </p>
                  <Badge variant="secondary">Circulatory System</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environmental Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-medium">Ocean Chemistry</h3>
                <p className="text-sm text-muted-foreground">
                  CO₂ dissolving in seawater affects ocean pH and marine life
                </p>
                <code className="text-xs">CO₂ + H₂O ⇌ H₂CO₃</code>
                <Badge variant="secondary">Climate</Badge>
              </div>
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-medium">Atmospheric Reactions</h3>
                <p className="text-sm text-muted-foreground">
                  Ozone formation and depletion in the stratosphere
                </p>
                <code className="text-xs">O₂ + O ⇌ O₃</code>
                <Badge variant="secondary">Atmosphere</Badge>
              </div>
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-medium">Soil Chemistry</h3>
                <p className="text-sm text-muted-foreground">
                  Nutrient availability depends on pH equilibria in soil
                </p>
                <code className="text-xs">Al³⁺ + 3H₂O ⇌ Al(OH)₃ + 3H⁺</code>
                <Badge variant="secondary">Agriculture</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChemicalEquilibrium;