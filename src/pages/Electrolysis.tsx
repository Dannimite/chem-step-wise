import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Battery, Zap, Plus, Minus, Calculator } from "lucide-react";
import { useState } from "react";

const Electrolysis = () => {
  const [current, setCurrent] = useState("");
  const [time, setTime] = useState("");
  const [faradayResult, setFaradayResult] = useState<number | null>(null);

  const calculateFaraday = () => {
    const I = parseFloat(current);
    const t = parseFloat(time);
    if (I && t) {
      // Q = I × t (charge in coulombs)
      // moles of electrons = Q / F (where F = 96,485 C/mol)
      const charge = I * t;
      const molesElectrons = charge / 96485;
      setFaradayResult(molesElectrons);
    }
  };

  const electrolyticProcesses = [
    {
      name: "Electrolysis of Water",
      equation: "2H₂O → 2H₂ + O₂",
      anode: "2H₂O → O₂ + 4H⁺ + 4e⁻",
      cathode: "4H⁺ + 4e⁻ → 2H₂",
      application: "Production of hydrogen and oxygen gases"
    },
    {
      name: "Electrolysis of Molten NaCl",
      equation: "2NaCl → 2Na + Cl₂",
      anode: "2Cl⁻ → Cl₂ + 2e⁻",
      cathode: "Na⁺ + e⁻ → Na",
      application: "Industrial production of sodium and chlorine"
    },
    {
      name: "Electroplating (Copper)",
      equation: "Cu²⁺ + 2e⁻ → Cu",
      anode: "Cu → Cu²⁺ + 2e⁻",
      cathode: "Cu²⁺ + 2e⁻ → Cu",
      application: "Coating objects with a thin layer of copper"
    }
  ];

  const galvanicCells = [
    {
      name: "Zinc-Copper Cell",
      anode: "Zn → Zn²⁺ + 2e⁻",
      cathode: "Cu²⁺ + 2e⁻ → Cu",
      voltage: "1.10 V",
      description: "Common demonstration cell showing electron flow"
    },
    {
      name: "Lead-Acid Battery",
      anode: "Pb + SO₄²⁻ → PbSO₄ + 2e⁻",
      cathode: "PbO₂ + 4H⁺ + SO₄²⁻ + 2e⁻ → PbSO₄ + 2H₂O",
      voltage: "2.0 V per cell",
      description: "Rechargeable battery used in cars"
    },
    {
      name: "Lithium-Ion Battery",
      anode: "LiC₆ → Li⁺ + e⁻ + C₆",
      cathode: "Li⁺ + e⁻ + CoO₂ → LiCoO₂",
      voltage: "3.7 V",
      description: "High energy density battery for electronics"
    }
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Electrolysis & Electrode Potentials</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Understanding electrochemical processes, Faraday's laws, and galvanic cells
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              Faraday's Laws of Electrolysis
            </CardTitle>
            <CardDescription>
              Quantitative relationships in electrochemical processes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">First Law</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    The amount of substance deposited or liberated at an electrode is directly proportional to the quantity of electricity passed.
                  </p>
                  <div className="bg-muted/50 p-3 rounded">
                    <code>m = (I × t × M) / (n × F)</code>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Second Law</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    When the same quantity of electricity passes through different electrolytes, the amounts deposited are proportional to their equivalent weights.
                  </p>
                  <div className="bg-muted/50 p-3 rounded">
                    <code>m₁/m₂ = (M₁/n₁)/(M₂/n₂)</code>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Faraday Calculator</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="current">Current (A)</Label>
                    <Input
                      id="current"
                      type="number"
                      value={current}
                      onChange={(e) => setCurrent(e.target.value)}
                      placeholder="Enter current in amperes"
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time (s)</Label>
                    <Input
                      id="time"
                      type="number"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="Enter time in seconds"
                    />
                  </div>
                  <Button onClick={calculateFaraday} className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Moles of Electrons
                  </Button>
                  {faradayResult !== null && (
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <p className="text-sm font-medium">
                        Moles of electrons: {faradayResult.toFixed(4)} mol
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Charge transferred: {(parseFloat(current) * parseFloat(time)).toFixed(0)} C
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p><strong>Where:</strong></p>
                  <p>m = mass deposited (g)</p>
                  <p>I = current (A)</p>
                  <p>t = time (s)</p>
                  <p>M = molar mass (g/mol)</p>
                  <p>n = number of electrons</p>
                  <p>F = Faraday constant (96,485 C/mol)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Electrolytic Cells</CardTitle>
            <CardDescription>
              Using electrical energy to drive non-spontaneous chemical reactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {electrolyticProcesses.map((process, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{process.name}</h3>
                    <Badge variant="outline">Electrolytic</Badge>
                  </div>
                  
                  <div className="bg-muted/50 p-3 rounded">
                    <p className="font-mono text-center">{process.equation}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border rounded p-3 bg-red-50 dark:bg-red-950/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Plus className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-red-800 dark:text-red-400">Anode (+)</span>
                      </div>
                      <code className="text-xs text-red-700 dark:text-red-300">{process.anode}</code>
                    </div>
                    <div className="border rounded p-3 bg-blue-50 dark:bg-blue-950/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Minus className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800 dark:text-blue-400">Cathode (-)</span>
                      </div>
                      <code className="text-xs text-blue-700 dark:text-blue-300">{process.cathode}</code>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{process.application}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Battery className="h-6 w-6 text-primary" />
              Galvanic/Voltaic Cells
            </CardTitle>
            <CardDescription>
              Converting chemical energy to electrical energy through spontaneous redox reactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {galvanicCells.map((cell, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{cell.name}</h3>
                    <div className="flex gap-2">
                      <Badge variant="default">Galvanic</Badge>
                      <Badge variant="outline">{cell.voltage}</Badge>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border rounded p-3 bg-blue-50 dark:bg-blue-950/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Minus className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800 dark:text-blue-400">Anode (-)</span>
                      </div>
                      <code className="text-xs text-blue-700 dark:text-blue-300">{cell.anode}</code>
                    </div>
                    <div className="border rounded p-3 bg-red-50 dark:bg-red-950/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Plus className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-red-800 dark:text-red-400">Cathode (+)</span>
                      </div>
                      <code className="text-xs text-red-700 dark:text-red-300">{cell.cathode}</code>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{cell.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Differences: Electrolytic vs Galvanic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Electrolytic Cells</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-1">Energy</Badge>
                    <p>Electrical energy input required</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-1">Reaction</Badge>
                    <p>Non-spontaneous reactions driven by external voltage</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-1">Electrodes</Badge>
                    <p>Anode is positive (+), Cathode is negative (-)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-1">Examples</Badge>
                    <p>Electroplating, water splitting, metal refining</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Galvanic Cells</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Badge className="mt-1">Energy</Badge>
                    <p>Electrical energy output produced</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="mt-1">Reaction</Badge>
                    <p>Spontaneous redox reactions</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="mt-1">Electrodes</Badge>
                    <p>Anode is negative (-), Cathode is positive (+)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge className="mt-1">Examples</Badge>
                    <p>Batteries, fuel cells, corrosion processes</p>
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
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-medium">Industrial Production</h3>
                <p className="text-sm text-muted-foreground">
                  Aluminum smelting, chlorine production, hydrogen generation
                </p>
                <Badge variant="secondary">Manufacturing</Badge>
              </div>
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-medium">Energy Storage</h3>
                <p className="text-sm text-muted-foreground">
                  Rechargeable batteries, electric vehicle systems, grid storage
                </p>
                <Badge variant="secondary">Technology</Badge>
              </div>
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-medium">Surface Treatment</h3>
                <p className="text-sm text-muted-foreground">
                  Electroplating, anodizing, corrosion protection
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

export default Electrolysis;