import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Battery, Plus, Minus } from "lucide-react";
import { useState } from "react";

const RedoxReactions = () => {
  const [selectedExample, setSelectedExample] = useState(0);

  const redoxExamples = [
    {
      name: "Combustion of Methane",
      equation: "CH₄ + 2O₂ → CO₂ + 2H₂O",
      oxidized: "Carbon (C⁻⁴ to C⁺⁴)",
      reduced: "Oxygen (O₂ to O⁻²)",
      explanation: "Carbon loses electrons (oxidized) while oxygen gains electrons (reduced)"
    },
    {
      name: "Rusting of Iron",
      equation: "4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃",
      oxidized: "Iron (Fe⁰ to Fe⁺³)",
      reduced: "Oxygen (O₂ to O⁻²)",
      explanation: "Iron loses electrons to form rust, while oxygen gains electrons"
    },
    {
      name: "Photosynthesis",
      equation: "6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
      oxidized: "Water (H₂O to O₂)",
      reduced: "Carbon dioxide (CO₂ to glucose)",
      explanation: "Water is oxidized to release oxygen, CO₂ is reduced to form glucose"
    }
  ];

  const balancingSteps = [
    {
      step: 1,
      title: "Identify oxidation states",
      description: "Assign oxidation numbers to all atoms in reactants and products"
    },
    {
      step: 2,
      title: "Write half-reactions",
      description: "Separate the oxidation and reduction processes"
    },
    {
      step: 3,
      title: "Balance atoms",
      description: "Balance all atoms except H and O in each half-reaction"
    },
    {
      step: 4,
      title: "Balance oxygen with H₂O",
      description: "Add H₂O molecules to balance oxygen atoms"
    },
    {
      step: 5,
      title: "Balance hydrogen with H⁺",
      description: "Add H⁺ ions to balance hydrogen atoms"
    },
    {
      step: 6,
      title: "Balance charge with electrons",
      description: "Add electrons to balance the charge in each half-reaction"
    },
    {
      step: 7,
      title: "Equalize electrons",
      description: "Multiply half-reactions so electrons cancel out"
    },
    {
      step: 8,
      title: "Combine and simplify",
      description: "Add half-reactions and cancel common terms"
    }
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Oxidation-Reduction (Redox) Reactions</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Understanding electron transfer in chemical reactions and how to balance redox equations
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              What is Redox?
            </CardTitle>
            <CardDescription>
              Redox reactions involve the transfer of electrons between reactants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Minus className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-green-800 dark:text-green-400">Oxidation</h3>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                    Loss of electrons (increase in oxidation state)
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs"><strong>Memory aid:</strong> "OIL" - Oxidation Is Loss (of electrons)</p>
                    <p className="text-xs"><strong>Example:</strong> Na → Na⁺ + e⁻</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Plus className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-800 dark:text-blue-400">Reduction</h3>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                    Gain of electrons (decrease in oxidation state)
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs"><strong>Memory aid:</strong> "RIG" - Reduction Is Gain (of electrons)</p>
                    <p className="text-xs"><strong>Example:</strong> Cl₂ + 2e⁻ → 2Cl⁻</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Key Terms:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Oxidizing Agent:</strong> Substance that causes oxidation (gets reduced itself)
                </div>
                <div>
                  <strong>Reducing Agent:</strong> Substance that causes reduction (gets oxidized itself)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Redox Reactions</CardTitle>
            <CardDescription>
              Examples of redox reactions you encounter in everyday life
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {redoxExamples.map((example, index) => (
                  <Button
                    key={index}
                    variant={selectedExample === index ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedExample(index)}
                  >
                    {example.name}
                  </Button>
                ))}
              </div>

              <div className="border rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">{redoxExamples[selectedExample].name}</h3>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-mono text-lg text-center">{redoxExamples[selectedExample].equation}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950/20">
                    <h4 className="font-medium text-green-800 dark:text-green-400 mb-2">Oxidized:</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">{redoxExamples[selectedExample].oxidized}</p>
                  </div>
                  <div className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950/20">
                    <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">Reduced:</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">{redoxExamples[selectedExample].reduced}</p>
                  </div>
                </div>

                <p className="text-muted-foreground">{redoxExamples[selectedExample].explanation}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Balancing Redox Equations</CardTitle>
            <CardDescription>
              Step-by-step method for balancing complex redox reactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {balancingSteps.map((step, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{step.step}</Badge>
                    <h3 className="font-medium">{step.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-3">Worked Example: Balancing MnO₄⁻ + Fe²⁺ → Mn²⁺ + Fe³⁺</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>Step 1-2:</strong> Oxidation: Fe²⁺ → Fe³⁺ | Reduction: MnO₄⁻ → Mn²⁺
                </div>
                <div>
                  <strong>Step 3-4:</strong> MnO₄⁻ → Mn²⁺ + 4H₂O (balance O with H₂O)
                </div>
                <div>
                  <strong>Step 5:</strong> MnO₄⁻ + 8H⁺ → Mn²⁺ + 4H₂O (balance H with H⁺)
                </div>
                <div>
                  <strong>Step 6:</strong> MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O | Fe²⁺ → Fe³⁺ + e⁻
                </div>
                <div>
                  <strong>Step 7-8:</strong> MnO₄⁻ + 8H⁺ + 5Fe²⁺ → Mn²⁺ + 4H₂O + 5Fe³⁺
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Battery className="h-6 w-6 text-primary" />
              Applications of Redox
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-medium">Batteries</h3>
                <p className="text-sm text-muted-foreground">
                  Convert chemical energy to electrical energy through redox reactions
                </p>
                <Badge variant="secondary">Energy Storage</Badge>
              </div>
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-medium">Metabolism</h3>
                <p className="text-sm text-muted-foreground">
                  Cellular respiration and photosynthesis involve redox processes
                </p>
                <Badge variant="secondary">Biological</Badge>
              </div>
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-medium">Corrosion</h3>
                <p className="text-sm text-muted-foreground">
                  Unwanted redox reactions that damage metals
                </p>
                <Badge variant="secondary">Materials</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RedoxReactions;