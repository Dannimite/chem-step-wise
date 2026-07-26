import { useState } from "react"
import { Scale, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SolutionDisplay } from "@/components/chemistry/SolutionDisplay"
import { balanceEquation } from "@/lib/equationBalancer"
import { SolverResponse, SolutionStep } from "@/types/chemistry"

const Equations = () => {
  const [equation, setEquation] = useState("")
  const [solution, setSolution] = useState<SolverResponse>()
  const [error, setError] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)

  const handleBalance = () => {
    setIsLoading(true)
    setError(undefined)
    setSolution(undefined)
    setTimeout(() => {
      try {
        const result = balanceEquation(equation)
        const { reactants, products, coefficients, elements, elementTotals, balanced } = result
        const rNames = reactants.map((s) => s.formula)
        const pNames = products.map((s) => s.formula)

        const steps: SolutionStep[] = []
        steps.push({
          stepNumber: 1,
          title: "Identify species and elements",
          description: "Parse each formula and list every element that appears.",
          substitution: `Reactants: ${rNames.join(", ")}  |  Products: ${pNames.join(", ")}`,
          resultWithUnits: `Elements: ${elements.join(", ")}`,
        })
        steps.push({
          stepNumber: 2,
          title: "Set up variable coefficients",
          description: "Assign an unknown coefficient to each species.",
          substitution: [
            ...reactants.map((s, i) => `${String.fromCharCode(97 + i)}·${s.formula}`),
            "→",
            ...products.map((s, i) => `${String.fromCharCode(97 + reactants.length + i)}·${s.formula}`),
          ].join(" "),
          explanation:
            "Conservation of mass requires the total atoms of each element on the left to equal the total on the right.",
        })
        steps.push({
          stepNumber: 3,
          title: "Write conservation equations",
          description: "For each element, atoms in = atoms out.",
          substitution: elements
            .map((el) => {
              const lhs = reactants
                .map((s, i) => (s.atoms[el] ? `${s.atoms[el]}·${String.fromCharCode(97 + i)}` : null))
                .filter(Boolean)
                .join(" + ") || "0"
              const rhs = products
                .map((s, i) => (s.atoms[el] ? `${s.atoms[el]}·${String.fromCharCode(97 + reactants.length + i)}` : null))
                .filter(Boolean)
                .join(" + ") || "0"
              return `${el}: ${lhs} = ${rhs}`
            })
            .join("\n"),
        })
        steps.push({
          stepNumber: 4,
          title: "Solve the linear system",
          description: "Solve for the smallest positive integer coefficients (nullspace, then scale by LCM and reduce by GCD).",
          resultWithUnits: coefficients.map((c, i) => `${String.fromCharCode(97 + i)} = ${c}`).join(",  "),
        })
        steps.push({
          stepNumber: 5,
          title: "Verify atom balance",
          description: "Confirm every element balances on both sides.",
          substitution: elementTotals.map((t) => `${t.element}: ${t.left} = ${t.right}`).join("\n"),
          resultWithUnits: elementTotals.every((t) => t.left === t.right) ? "All elements balanced ✓" : "Mismatch",
        })

        setSolution({
          success: true,
          detectedTopic: "Chemical Equations",
          canonicalProblem: `Balance: ${equation}`,
          steps,
          finalAnswer: balanced,
          latexEquations: [],
          confidence: 1,
        })
      } catch (e: any) {
        setError(e?.message ?? "Could not balance this equation.")
      } finally {
        setIsLoading(false)
      }
    }, 400)
  }

  const examples = [
    "C3H8 + O2 → CO2 + H2O",
    "H2 + O2 → H2O",
    "Fe + O2 → Fe2O3",
    "NH3 + O2 → NO + H2O",
    "KMnO4 + HCl → KCl + MnCl2 + H2O + Cl2",
  ]

  return (
    <div className="container mx-auto max-w-6xl space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
            <Scale className="h-8 w-8 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-foreground">Chemical Equations</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Balance chemical equations step-by-step using linear algebra over the conservation-of-mass system.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Equation Balancer
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="equation">Chemical Equation</Label>
                <Input
                  id="equation"
                  placeholder="e.g., C3H8 + O2 → CO2 + H2O"
                  value={equation}
                  onChange={(e) => setEquation(e.target.value)}
                  className="text-base"
                />
                <p className="text-xs text-muted-foreground">
                  Use <code>-&gt;</code> or <code>→</code> between reactants and products. Parentheses like <code>Ca(OH)2</code> are supported.
                </p>
              </div>

              <Button
                onClick={handleBalance}
                disabled={!equation.trim() || isLoading}
                className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Balancing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Balance Equation
                  </>
                )}
              </Button>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg border border-destructive/40 bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium text-foreground">Try these examples:</div>
              <div className="grid gap-2">
                {examples.map((example, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer border-border/30 hover:shadow-md hover:border-primary/30 transition-all duration-200"
                    onClick={() => setEquation(example)}
                  >
                    <CardContent className="p-3">
                      <div className="text-sm font-mono text-foreground">{example}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <SolutionDisplay solution={solution} isLoading={isLoading} error={error} />
      </div>
    </div>
  )
}

export default Equations
