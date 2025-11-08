import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calculator, Lock } from "lucide-react"

const Stoichiometry = () => {
  return (
    <div className="container mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-secondary shadow-elegant">
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Stoichiometry</h1>
            <p className="text-muted-foreground">Mole calculations, limiting reagents, and reaction yields</p>
          </div>
        </div>
      </div>

      {/* Coming Soon Card */}
      <Card className="shadow-card border-border/50">
        <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Coming Soon</h2>
            <p className="text-muted-foreground max-w-md">
              We're working hard to bring you comprehensive stoichiometry tools and problem solvers. Check back soon!
            </p>
          </div>
          <Badge variant="secondary" className="mt-4">
            Under Development
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}

export default Stoichiometry