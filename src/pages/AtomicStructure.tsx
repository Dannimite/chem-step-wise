import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Atom, Zap, Target, Calculator, Orbit } from "lucide-react";
import { useState } from "react";

const AtomicStructure = () => {
  const [atomicNumber, setAtomicNumber] = useState("");
  const [electronConfig, setElectronConfig] = useState("");

  const atomicModels = [
    {
      name: "Dalton's Atomic Theory",
      year: "1803",
      description: "Atoms as indivisible, solid spheres",
      keyPoints: [
        "All matter is made of atoms",
        "Atoms of same element are identical",
        "Atoms cannot be created or destroyed",
        "Compounds form by combining atoms in simple ratios"
      ],
      limitations: "Atoms are actually divisible; isotopes exist"
    },
    {
      name: "Thomson's Plum Pudding",
      year: "1897",
      description: "Electrons embedded in positive sphere",
      keyPoints: [
        "Discovery of electrons",
        "Atoms contain positive and negative charges",
        "Electrons distributed throughout positive mass",
        "Overall neutral charge"
      ],
      limitations: "Didn't account for nuclear structure"
    },
    {
      name: "Rutherford's Nuclear Model",
      year: "1911",
      description: "Dense positive nucleus with orbiting electrons",
      keyPoints: [
        "Most of atom is empty space",
        "Dense, positive nucleus at center",
        "Electrons orbit the nucleus",
        "Gold foil experiment evidence"
      ],
      limitations: "Couldn't explain atomic stability or spectra"
    },
    {
      name: "Bohr's Model",
      year: "1913",
      description: "Electrons in fixed energy levels",
      keyPoints: [
        "Electrons in quantized energy levels",
        "Energy absorbed/emitted when changing levels",
        "Explained hydrogen spectrum",
        "Introduced quantum concept"
      ],
      limitations: "Only worked for hydrogen; electrons don't orbit"
    },
    {
      name: "Quantum Mechanical Model",
      year: "1926",
      description: "Electrons in probability clouds (orbitals)",
      keyPoints: [
        "Wave-particle duality of electrons",
        "Uncertainty principle",
        "Orbitals as probability distributions",
        "Quantum numbers describe electron states"
      ],
      limitations: "Current accepted model"
    }
  ];

  const subatomicParticles = [
    {
      name: "Proton",
      symbol: "p⁺",
      charge: "+1",
      mass: "1 amu",
      location: "Nucleus",
      discovery: "Rutherford (1919)",
      role: "Determines atomic number and element identity"
    },
    {
      name: "Neutron",
      symbol: "n⁰",
      charge: "0",
      mass: "1 amu",
      location: "Nucleus",
      discovery: "Chadwick (1932)",
      role: "Provides nuclear stability; creates isotopes"
    },
    {
      name: "Electron",
      symbol: "e⁻",
      charge: "-1",
      mass: "1/1836 amu",
      location: "Electron cloud",
      discovery: "Thomson (1897)",
      role: "Chemical bonding and electrical properties"
    }
  ];

  const quantumNumbers = [
    {
      name: "Principal (n)",
      symbol: "n",
      description: "Energy level and size of orbital",
      values: "1, 2, 3, 4, ...",
      example: "n = 1 (closest to nucleus)"
    },
    {
      name: "Azimuthal (l)",
      symbol: "l",
      description: "Shape of orbital",
      values: "0 to (n-1)",
      example: "l = 0 (s), 1 (p), 2 (d), 3 (f)"
    },
    {
      name: "Magnetic (mₗ)",
      symbol: "mₗ",
      description: "Orientation of orbital",
      values: "-l to +l",
      example: "p orbitals: -1, 0, +1"
    },
    {
      name: "Spin (mₛ)",
      symbol: "mₛ",
      description: "Electron spin direction",
      values: "+½ or -½",
      example: "↑ or ↓ (up or down spin)"
    }
  ];

  const calculateElectronConfig = () => {
    const z = parseInt(atomicNumber);
    if (!z || z < 1 || z > 118) {
      setElectronConfig("Please enter a valid atomic number (1-118)");
      return;
    }

    const orbitals = [
      "1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p", 
      "6s", "4f", "5d", "6p", "7s", "5f", "6d", "7p"
    ];
    
    const maxElectrons = [2, 2, 6, 2, 6, 2, 10, 6, 2, 10, 6, 2, 14, 10, 6, 2, 14, 10, 6];
    
    let remaining = z;
    let config = "";
    
    for (let i = 0; i < orbitals.length && remaining > 0; i++) {
      const electrons = Math.min(remaining, maxElectrons[i]);
      config += `${orbitals[i]}${electrons} `;
      remaining -= electrons;
    }
    
    setElectronConfig(config.trim());
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Atomic Structure</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Revision and extension of atomic models, subatomic particles, and electron configuration
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Atom className="h-6 w-6 text-primary" />
              Evolution of Atomic Models
            </CardTitle>
            <CardDescription>
              How our understanding of atomic structure has developed over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {atomicModels.map((model, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{model.name}</h3>
                    <Badge variant="outline">{model.year}</Badge>
                  </div>
                  
                  <p className="text-muted-foreground italic">{model.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Key Points:</h4>
                      <ul className="space-y-1">
                        {model.keyPoints.map((point, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Limitations:</h4>
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                        {model.limitations}
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
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Subatomic Particles
            </CardTitle>
            <CardDescription>
              The building blocks of atoms and their properties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {subatomicParticles.map((particle, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <span className="font-mono font-bold">{particle.symbol}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{particle.name}</h3>
                      <p className="text-sm text-muted-foreground">Discovered by {particle.discovery}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <strong>Charge:</strong> {particle.charge}
                    </div>
                    <div>
                      <strong>Mass:</strong> {particle.mass}
                    </div>
                    <div>
                      <strong>Location:</strong> {particle.location}
                    </div>
                    <div>
                      <strong>Role:</strong> {particle.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-3">Key Relationships:</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Atomic Number (Z) =</strong> Number of protons
                </div>
                <div>
                  <strong>Mass Number (A) =</strong> Protons + Neutrons
                </div>
                <div>
                  <strong>Neutral Atom:</strong> Protons = Electrons
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Orbit className="h-6 w-6 text-primary" />
              Quantum Numbers
            </CardTitle>
            <CardDescription>
              Four quantum numbers that describe electron states in atoms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {quantumNumbers.map((qn, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{qn.symbol}</Badge>
                    <h3 className="font-semibold">{qn.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{qn.description}</p>
                  <div className="space-y-1 text-sm">
                    <p><strong>Possible values:</strong> {qn.values}</p>
                    <p><strong>Example:</strong> {qn.example}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-3">Pauli Exclusion Principle:</h3>
              <p className="text-sm text-muted-foreground">
                No two electrons in an atom can have the same set of four quantum numbers. 
                This means each orbital can hold a maximum of 2 electrons with opposite spins.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-6 w-6 text-primary" />
              Electron Configuration Calculator
            </CardTitle>
            <CardDescription>
              Calculate electron configuration for any element
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="atomic-number">Atomic Number</Label>
                  <Input
                    id="atomic-number"
                    type="number"
                    min="1"
                    max="118"
                    value={atomicNumber}
                    onChange={(e) => setAtomicNumber(e.target.value)}
                    placeholder="Enter atomic number (1-118)"
                  />
                  <Button onClick={calculateElectronConfig} className="w-full">
                    Calculate Configuration
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <Label>Electron Configuration</Label>
                  <div className="p-3 bg-muted/50 rounded-lg min-h-[100px] flex items-center">
                    {electronConfig ? (
                      <code className="text-sm">{electronConfig}</code>
                    ) : (
                      <span className="text-muted-foreground text-sm">Enter an atomic number to see configuration</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-medium">Aufbau Principle (Building Up):</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Electrons fill orbitals in order of increasing energy: 1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p → ...
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Hund's Rule:</strong> Fill orbitals singly before pairing
                  </div>
                  <div>
                    <strong>Pauli Exclusion:</strong> Maximum 2 electrons per orbital
                  </div>
                  <div>
                    <strong>Energy Order:</strong> Lower energy orbitals fill first
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              Advanced Concepts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Orbital Shapes</h3>
                <div className="space-y-3">
                  <div className="border rounded p-3">
                    <strong>s orbitals:</strong> Spherical shape, holds 2 electrons
                  </div>
                  <div className="border rounded p-3">
                    <strong>p orbitals:</strong> Dumbbell shape, 3 orientations, holds 6 electrons
                  </div>
                  <div className="border rounded p-3">
                    <strong>d orbitals:</strong> Complex shapes, 5 orientations, holds 10 electrons
                  </div>
                  <div className="border rounded p-3">
                    <strong>f orbitals:</strong> Very complex shapes, 7 orientations, holds 14 electrons
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Isotopes & Ions</h3>
                <div className="space-y-3">
                  <div className="border rounded p-3">
                    <strong>Isotopes:</strong> Same protons, different neutrons
                    <p className="text-sm text-muted-foreground">¹²C vs ¹⁴C (carbon-12 vs carbon-14)</p>
                  </div>
                  <div className="border rounded p-3">
                    <strong>Cations:</strong> Positive ions (lost electrons)
                    <p className="text-sm text-muted-foreground">Na⁺ (sodium ion)</p>
                  </div>
                  <div className="border rounded p-3">
                    <strong>Anions:</strong> Negative ions (gained electrons)
                    <p className="text-sm text-muted-foreground">Cl⁻ (chloride ion)</p>
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
                <h3 className="font-medium">Medical Imaging</h3>
                <p className="text-sm text-muted-foreground">
                  Radioactive isotopes used in PET scans and medical treatments
                </p>
                <Badge variant="secondary">Healthcare</Badge>
              </div>
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-medium">Carbon Dating</h3>
                <p className="text-sm text-muted-foreground">
                  ¹⁴C isotope used to determine age of ancient artifacts
                </p>
                <Badge variant="secondary">Archaeology</Badge>
              </div>
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-medium">Quantum Technology</h3>
                <p className="text-sm text-muted-foreground">
                  Electron spin used in quantum computing and MRI machines
                </p>
                <Badge variant="secondary">Technology</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AtomicStructure;