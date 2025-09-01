import { useState } from "react"
import { Calculator, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Variable } from "@/types/chemistry"

interface TopicCalculatorProps {
  title: string
  description: string
  variables: Variable[]
  onCalculate: (values: Record<string, number>) => void
  result?: string
  isLoading?: boolean
}

export function TopicCalculator({ 
  title, 
  description, 
  variables, 
  onCalculate, 
  result, 
  isLoading 
}: TopicCalculatorProps) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [units, setUnits] = useState<Record<string, string>>({})

  const handleValueChange = (variableId: string, value: string) => {
    setValues(prev => ({
      ...prev,
      [variableId]: value
    }))
  }

  const handleUnitChange = (variableId: string, unit: string) => {
    setUnits(prev => ({
      ...prev,
      [variableId]: unit
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const numericValues: Record<string, number> = {}
    let isValid = true

    variables.forEach(variable => {
      if (variable.required && (!values[variable.name] || values[variable.name].trim() === '')) {
        isValid = false
        return
      }
      
      if (values[variable.name]) {
        const numValue = parseFloat(values[variable.name])
        if (isNaN(numValue)) {
          isValid = false
          return
        }
        numericValues[variable.name] = numValue
      }
    })

    if (isValid) {
      onCalculate(numericValues)
    }
  }

  const handleReset = () => {
    setValues({})
    setUnits({})
  }

  const getCommonUnits = (baseUnit: string) => {
    const unitMap: Record<string, string[]> = {
      'L': ['L', 'mL', 'm³', 'cm³'],
      'atm': ['atm', 'Pa', 'kPa', 'mmHg', 'torr'],
      'K': ['K', '°C', '°F'],
      'g': ['g', 'kg', 'mg'],
      'mol': ['mol', 'mmol', 'kmol'],
      'J': ['J', 'kJ', 'cal', 'kcal'],
      'M': ['M', 'mM', 'mol/L']
    }
    return unitMap[baseUnit] || [baseUnit]
  }

  return (
    <Card className="w-full shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            {variables.map((variable) => (
              <div key={variable.name} className="space-y-2">
                <Label htmlFor={variable.name} className="text-sm font-medium">
                  {variable.description}
                  {variable.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      id={variable.name}
                      type="number"
                      step="any"
                      placeholder={`Enter ${variable.symbol}`}
                      value={values[variable.name] || ''}
                      onChange={(e) => handleValueChange(variable.name, e.target.value)}
                      className="text-base"
                    />
                  </div>
                  
                  <Select
                    value={units[variable.name] || variable.unit}
                    onValueChange={(value) => handleUnitChange(variable.name, value)}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getCommonUnits(variable.unit).map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Variable: {variable.symbol}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate
                </>
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleReset}
              disabled={isLoading}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {result && (
          <div className="mt-6 p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
            <div className="text-sm font-medium text-muted-foreground mb-2">Result:</div>
            <div className="text-lg font-semibold text-foreground">{result}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}