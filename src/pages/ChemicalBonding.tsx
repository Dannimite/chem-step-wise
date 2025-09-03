import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Atom, Zap, Link } from "lucide-react";

const ChemicalBonding = () => {
  const bondingTypes = [
    {
      type: "Ionic Bonding",
      icon: <Zap className="h-6 w-6" />,
      description: "Transfer of electrons between metal and non-metal atoms",
      characteristics: [
        "Forms between metals and non-metals",
        "Complete transfer of electrons",
        "Forms charged ions (cations and anions)",
        "Strong electrostatic attraction",
        "High melting and boiling points",
        "Conducts electricity when dissolved or molten"
      ],
      example: "NaCl (sodium chloride) - Na⁺ and Cl⁻ ions",
      strength: "Strong"
    },
    {
      type: "Covalent Bonding",
      icon: <Link className="h-6 w-6" />,
      description: "Sharing of electrons between non-metal atoms",
      characteristics: [
        "Forms between non-metal atoms",
        "Electrons are shared, not transferred",
        "Can be single, double, or triple bonds",
        "Lower melting and boiling points than ionic",
        "Poor electrical conductors",
        "Can be polar or non-polar"
      ],
      example: "H₂O (water) - oxygen shares electrons with hydrogen",
      strength: "Strong"
    },
    {
      type: "Metallic Bonding",
      icon: <Atom className="h-6 w-6" />,
      description: "Sea of delocalized electrons around metal cations",
      characteristics: [
        "Forms between metal atoms only",
        "Electrons are delocalized (mobile)",
        "Creates a 'sea of electrons'",
        "Good electrical and thermal conductors",
        "Malleable and ductile",
        "Metallic luster"
      ],
      example: "Copper (Cu) - mobile electrons allow conductivity",
      strength: "Strong"
    }
  ];

  const weakForces = [
    {
      name: "Van der Waals Forces",
      description: "Weak attractions between molecules due to temporary dipoles",
      examples: ["Gecko feet adhesion", "Gases liquefying at low temperatures"]
    },
    {
      name: "Hydrogen Bonding",
      description: "Special dipole-dipole attraction involving hydrogen",
      examples: ["Water's high boiling point", "DNA double helix structure"]
    },
    {
      name: "Dipole-Dipole Forces",
      description: "Attractions between polar molecules",
      examples: ["HCl molecules attracting each other", "Solubility of polar substances"]
    }
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Chemical Laws and Bonding</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Understanding how atoms combine to form compounds through different types of chemical bonds
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Atom className="h-6 w-6 text-primary" />
              Types of Chemical Bonding
            </CardTitle>
            <CardDescription>
              The three main types of strong chemical bonds that hold atoms together
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {bondingTypes.map((bond, index) => (
              <div key={index} className="border rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {bond.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{bond.type}</h3>
                    <p className="text-muted-foreground">{bond.description}</p>
                  </div>
                  <Badge variant="secondary">{bond.strength}</Badge>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Characteristics:</h4>
                    <ul className="space-y-1">
                      {bond.characteristics.map((char, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                          {char}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Example:</h4>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                      {bond.example}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weak Intermolecular Forces</CardTitle>
            <CardDescription>
              Weaker forces that affect physical properties but don't form chemical bonds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {weakForces.map((force, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Weak</Badge>
                    <h3 className="font-medium">{force.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{force.description}</p>
                  <div>
                    <h4 className="text-xs font-medium mb-1">Examples:</h4>
                    <ul className="space-y-1">
                      {force.examples.map((example, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground">• {example}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Differences: Strong vs Weak Bonds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Strong Bonds (Intramolecular)</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">Energy</Badge>
                    <p className="text-sm">High energy required to break (100-800 kJ/mol)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">Function</Badge>
                    <p className="text-sm">Hold atoms together within molecules</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">Examples</Badge>
                    <p className="text-sm">C-H bonds in methane, O-H bonds in water</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Weak Forces (Intermolecular)</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">Energy</Badge>
                    <p className="text-sm">Low energy required to break (1-50 kJ/mol)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">Function</Badge>
                    <p className="text-sm">Hold molecules together</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">Examples</Badge>
                    <p className="text-sm">Water molecules sticking together, DNA base pairing</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Real-World Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Ionic Bonding Applications</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Table salt (NaCl) for food preservation</li>
                  <li>• Calcium fluoride (CaF₂) in toothpaste</li>
                  <li>• Lithium compounds in batteries</li>
                  <li>• Sodium bicarbonate (baking soda)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3">Covalent Bonding Applications</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Water (H₂O) - essential for life</li>
                  <li>• Carbon dioxide (CO₂) in photosynthesis</li>
                  <li>• Plastics and polymers</li>
                  <li>• DNA and proteins</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChemicalBonding;