import { useMemo, useState } from "react"
import { Calculator, AlertCircle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SolutionDisplay } from "@/components/chemistry/SolutionDisplay"
import { solveStoichiometry, speciesInEquation } from "@/lib/stoichiometry"
import { SolverResponse, SolutionStep } from "@/types/chemistry"

const Stoichiometry = () => {
  const [equation, setEquation] = useState("N2 + H2 -> NH3")
  const [givenFormula, setGivenFormula] = useState("N2")
  const [givenAmount, setGivenAmount] = useState("14")
  const [givenUnit, setGivenUnit] = useState<"g" | "mol">("g")
  const [targetFormula, setTargetFormula] = useState("NH3")
  const [targetUnit, setTargetUnit] = useState<"g" | "mol">("g")
  const [solution, setSolution] = useState<SolverResponse>()
  const [error, setError] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)

  const availableSpecies = useMemo(() => {
    try { return speciesInEquation(equation) } catch { return [] }
  }, [equation])

  const handleSolve = () => {
    setIsLoading(true)
    setError(undefined)
    setSolution(undefined)
    setTimeout(() => {
      try {
        const amt = parseFloat(givenAmount)
        if (!isFinite(amt) || amt <= 0) throw new Error("Enter a positive numeric amount for the given substance.")
        const r = solveStoichiometry({
          equation,
          given: { formula: givenFormula, amount: amt, unit: givenUnit },
          target: { formula: targetFormula, unit: targetUnit },
        })

        const steps: SolutionStep[] = []
        steps.push({
          stepNumber: 1,
          title: "Balance the chemical equation",
          description: "Balancing ensures the mole ratio between given and target is correct.",
          resultWithUnits: r.balanced,
        })

        if (givenUnit === "g") {
          steps.push({
            stepNumber: 2,
            title: `Molar mass of ${givenFormula}`,
            description: "Sum the atomic masses of every atom in the formula.",
            substitution: r.givenMassBreakdown.join("\n"),
            resultWithUnits: `M(${givenFormula}) = ${r.givenMolarMass.toFixed(3)} g/mol`,
          })
          steps.push({
            stepNumber: 3,
            title: `Convert grams of ${givenFormula} to moles`,
            description: "n = m / M",
            latexFormula: "n = \\dfrac{m}{M}",
            substitution: `n(${givenFormula}) = ${amt} g ÷ ${r.givenMolarMass.toFixed(3)} g/mol`,
            resultWithUnits: `n(${givenFormula}) = ${r.molesGiven.toFixed(5)} mol`,
          })
        } else {
          steps.push({
            stepNumber: 2,
            title: `Moles of ${givenFormula}`,
            description: "Amount is already provided in moles.",
            resultWithUnits: `n(${givenFormula}) = ${r.molesGiven} mol`,
          })
        }

        const ratioStep = steps.length + 1
        steps.push({
          stepNumber: ratioStep,
          title: "Apply the mole ratio from the balanced equation",
          description: `Coefficient of ${targetFormula} divided by coefficient of ${givenFormula}.`,
          latexFormula: `n(${targetFormula}) = n(${givenFormula}) \\times \\dfrac{${r.targetCoeff}}{${r.givenCoeff}}`,
          substitution: `n(${targetFormula}) = ${r.molesGiven.toFixed(5)} × (${r.targetCoeff} / ${r.givenCoeff})`,
          resultWithUnits: `n(${targetFormula}) = ${r.molesTarget.toFixed(5)} mol`,
        })

        if (targetUnit === "g") {
          steps.push({
            stepNumber: ratioStep + 1,
            title: `Molar mass of ${targetFormula}`,
            description: "Sum the atomic masses of every atom in the formula.",
            substitution: r.targetMassBreakdown.join("\n"),
            resultWithUnits: `M(${targetFormula}) = ${r.targetMolarMass.toFixed(3)} g/mol`,
          })
          steps.push({
            stepNumber: ratioStep + 2,
            title: `Convert moles of ${targetFormula} to grams`,
            description: "m = n × M",
            latexFormula: "m = n \\times M",
            substitution: `m(${targetFormula}) = ${r.molesTarget.toFixed(5)} × ${r.targetMolarMass.toFixed(3)}`,
            resultWithUnits: `m(${targetFormula}) = ${r.answerAmount.toFixed(4)} g`,
          })
        }

        const finalAnswer = targetUnit === "g"
          ? `${r.answerAmount.toFixed(4)} g of ${targetFormula}`
          : `${r.answerAmount.toFixed(5)} mol of ${targetFormula}`

        setSolution({
          success: true,
          detectedTopic: "Stoichiometry",
          canonicalProblem: `From ${amt} ${givenUnit} of ${givenFormula} in [${r.balanced}], find ${targetFormula} in ${targetUnit}.`,
          steps,
          finalAnswer,
          latexEquations: [],
          confidence: 1,
        })
      } catch (e: any) {
        setError(e?.message ?? "Could not solve this stoichiometry problem.")
      } finally {
        setIsLoading(false)
      }
    }, 300)
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-secondary shadow-elegant">
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Stoichiometry</h1>
            <p className="text-muted-foreground">Convert between mass and moles across a balanced reaction.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Stoichiometry Solver
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="eq">Chemical equation</Label>
              <Input
                id="eq"
                placeholder="e.g., N2 + H2 -> NH3"
                value={equation}
                onChange={(e) => setEquation(e.target.value)}
              />
              {availableSpecies.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Species detected: {availableSpecies.join(", ")}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Given substance</Label>
              <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <Input
                  placeholder="Formula (e.g., N2)"
                  value={givenFormula}
                  onChange={(e) => setGivenFormula(e.target.value)}
                />
                <Input
                  type="number"
                  step="any"
                  placeholder="Amount"
                  value={givenAmount}
                  onChange={(e) => setGivenAmount(e.target.value)}
                />
                <Select value={givenUnit} onValueChange={(v) => setGivenUnit(v as "g" | "mol")}>
                  <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="mol">mol</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Find</Label>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <Input
                  placeholder="Target formula (e.g., NH3)"
                  value={targetFormula}
                  onChange={(e) => setTargetFormula(e.target.value)}
                />
                <Select value={targetUnit} onValueChange={(v) => setTargetUnit(v as "g" | "mol")}>
                  <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="mol">mol</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleSolve}
              disabled={!equation.trim() || !givenFormula.trim() || !targetFormula.trim() || isLoading}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Solving...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Solve
                </>
              )}
            </Button>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg border border-destructive/40 bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <div className="text-sm font-medium">Try an example:</div>
              <div className="grid gap-2">
                {[
                  { eq: "N2 + H2 -> NH3", g: "N2", a: "14", u: "g", t: "NH3", tu: "g" },
                  { eq: "C3H8 + O2 -> CO2 + H2O", g: "C3H8", a: "2", u: "mol", t: "H2O", tu: "g" },
                  { eq: "Fe + O2 -> Fe2O3", g: "Fe", a: "10", u: "g", t: "Fe2O3", tu: "g" },
                ].map((ex, i) => (
                  <Card key={i} className="cursor-pointer border-border/30 hover:border-primary/30 transition-all"
                    onClick={() => {
                      setEquation(ex.eq)
                      setGivenFormula(ex.g); setGivenAmount(ex.a); setGivenUnit(ex.u as "g" | "mol")
                      setTargetFormula(ex.t); setTargetUnit(ex.tu as "g" | "mol")
                    }}>
                    <CardContent className="p-3 text-sm font-mono">
                      {ex.a} {ex.u} {ex.g} → ? {ex.tu} {ex.t} &nbsp; <span className="text-muted-foreground">[{ex.eq}]</span>
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

export default Stoichiometry
