import { useState } from "react"
import { ChevronDown, ChevronRight, Copy, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { SolutionStep } from "@/types/chemistry"
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

interface SolutionDisplayProps {
  solution?: {
    detectedTopic: string
    canonicalProblem: string
    steps: SolutionStep[]
    finalAnswer: string
    latexEquations: string[]
    confidence: number
  }
  isLoading?: boolean
  error?: string
}

export function SolutionDisplay({ solution, isLoading, error }: SolutionDisplayProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([1]))
  const [copiedSteps, setCopiedSteps] = useState<Set<number>>(new Set())

  const toggleStep = (stepNumber: number) => {
    const newExpanded = new Set(expandedSteps)
    if (newExpanded.has(stepNumber)) {
      newExpanded.delete(stepNumber)
    } else {
      newExpanded.add(stepNumber)
    }
    setExpandedSteps(newExpanded)
  }

  const copyLatex = async (latex: string, stepNumber: number) => {
    await navigator.clipboard.writeText(latex)
    setCopiedSteps(new Set(copiedSteps).add(stepNumber))
    setTimeout(() => {
      setCopiedSteps(prev => {
        const newSet = new Set(prev)
        newSet.delete(stepNumber)
        return newSet
      })
    }, 2000)
  }

  if (isLoading) {
    return (
      <Card className="w-full shadow-card">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            <div className="text-lg font-medium">Solving your chemistry problem...</div>
            <div className="text-sm text-muted-foreground">Analyzing question and calculating steps</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full shadow-card border-destructive/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <div>
              <div className="font-medium">Error solving problem</div>
              <div className="text-sm opacity-90">{error}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!solution) {
    return (
      <Card className="w-full shadow-card border-dashed border-border/50">
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">
            <div className="text-lg font-medium mb-2">Ready to solve</div>
            <div className="text-sm">Enter a chemistry question above to get started</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <CardTitle className="text-xl text-foreground">Solution</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {solution.detectedTopic}
              </Badge>
              <Badge 
                variant={solution.confidence > 0.8 ? "default" : "secondary"}
                className="text-xs"
              >
                {Math.round(solution.confidence * 100)}% confidence
              </Badge>
            </div>
          </div>
          <CheckCircle className="h-6 w-6 text-secondary flex-shrink-0" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Problem Statement */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="text-sm font-medium text-muted-foreground mb-2">Problem:</div>
          <div className="text-foreground">{solution.canonicalProblem}</div>
        </div>

        {/* Solution Steps */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Step-by-Step Solution</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpandedSteps(new Set(solution.steps.map(s => s.stepNumber)))}
            >
              Expand All
            </Button>
          </div>

          {solution.steps.map((step, index) => (
            <Collapsible 
              key={step.stepNumber}
              open={expandedSteps.has(step.stepNumber)}
              onOpenChange={() => toggleStep(step.stepNumber)}
            >
              <Card className="border-border/30">
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                          {step.stepNumber}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{step.title}</div>
                          <div className="text-sm text-muted-foreground">{step.description}</div>
                        </div>
                      </div>
                      {expandedSteps.has(step.stepNumber) ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0 space-y-4">
                    {/* Formula */}
                    {step.latexFormula && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">Formula:</div>
                        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                          <div className="flex-1">
                            <BlockMath math={step.latexFormula} />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyLatex(step.latexFormula!, step.stepNumber)}
                            className="ml-2"
                          >
                            {copiedSteps.has(step.stepNumber) ? (
                              <CheckCircle className="h-4 w-4 text-secondary" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Substitution */}
                    {step.substitution && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">Substitution:</div>
                        <div className="p-3 bg-accent/20 rounded-lg">
                          <code className="text-sm text-foreground">{step.substitution}</code>
                        </div>
                      </div>
                    )}

                    {/* Calculation */}
                    {step.calculation && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">Calculation:</div>
                        <div className="p-3 bg-secondary/10 rounded-lg">
                          <code className="text-sm text-foreground">{step.calculation}</code>
                        </div>
                      </div>
                    )}

                    {/* Result */}
                    {step.resultWithUnits && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">Result:</div>
                        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                          <div className="font-medium text-foreground">{step.resultWithUnits}</div>
                        </div>
                      </div>
                    )}

                    {/* Explanation */}
                    {step.explanation && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">Explanation:</div>
                        <div className="text-sm text-muted-foreground">{step.explanation}</div>
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>

        {/* Final Answer */}
        <div className="mt-8">
          <Separator className="mb-4" />
          <div className="p-6 bg-gradient-primary/10 rounded-lg border border-primary/20">
            <div className="text-sm font-medium text-muted-foreground mb-2">Final Answer:</div>
            <div className="text-xl font-bold text-foreground">{solution.finalAnswer}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}