import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight } from "lucide-react"

type ConversionType = "pressure" | "volume"

const pressureUnits = {
  atm: { name: "Atmospheres (atm)", toAtm: 1 },
  Pa: { name: "Pascals (Pa)", toAtm: 1 / 101325 },
  kPa: { name: "Kilopascals (kPa)", toAtm: 1 / 101.325 },
  mmHg: { name: "mmHg (Torr)", toAtm: 1 / 760 },
}

const volumeUnits = {
  L: { name: "Liters (L)", toL: 1 },
  mL: { name: "Milliliters (mL)", toL: 0.001 },
  m3: { name: "Cubic meters (m³)", toL: 1000 },
}

export const UnitConverter = () => {
  const [conversionType, setConversionType] = useState<ConversionType>("pressure")
  const [inputValue, setInputValue] = useState("")
  const [fromUnit, setFromUnit] = useState("atm")
  const [toUnit, setToUnit] = useState("Pa")

  const convert = () => {
    const value = parseFloat(inputValue)
    if (isNaN(value)) return ""

    if (conversionType === "pressure") {
      const inAtm = value * pressureUnits[fromUnit as keyof typeof pressureUnits].toAtm
      const result = inAtm / pressureUnits[toUnit as keyof typeof pressureUnits].toAtm
      return result.toExponential(4)
    } else {
      const inL = value * volumeUnits[fromUnit as keyof typeof volumeUnits].toL
      const result = inL / volumeUnits[toUnit as keyof typeof volumeUnits].toL
      return result.toExponential(4)
    }
  }

  const result = convert()
  const currentUnits = conversionType === "pressure" ? pressureUnits : volumeUnits

  return (
    <Card className="border-border/30">
      <CardHeader>
        <CardTitle className="text-xl">Unit Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Conversion Type Selection */}
        <div className="space-y-2">
          <Label>Conversion Type</Label>
          <Select
            value={conversionType}
            onValueChange={(value: ConversionType) => {
              setConversionType(value)
              if (value === "pressure") {
                setFromUnit("atm")
                setToUnit("Pa")
              } else {
                setFromUnit("L")
                setToUnit("mL")
              }
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pressure">Pressure</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Conversion Input/Output */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          {/* From Unit */}
          <div className="space-y-2">
            <Label>From</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Enter value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
              />
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(currentUnits).map(([key, { name }]) => (
                    <SelectItem key={key} value={key}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex items-center justify-center pb-2">
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </div>

          {/* To Unit */}
          <div className="space-y-2">
            <Label>To</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={result}
                readOnly
                placeholder="Result"
                className="flex-1 bg-muted/50"
              />
              <Select value={toUnit} onValueChange={setToUnit}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(currentUnits).map(([key, { name }]) => (
                    <SelectItem key={key} value={key}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Conversion Reference */}
        <div className="rounded-lg bg-muted/50 p-4 space-y-2">
          <div className="text-sm font-medium text-foreground">Quick Reference</div>
          <div className="text-xs text-muted-foreground space-y-1">
            {conversionType === "pressure" ? (
              <>
                <div>1 atm = 101,325 Pa = 101.325 kPa = 760 mmHg</div>
                <div>1 kPa = 1,000 Pa = 0.00987 atm = 7.5 mmHg</div>
              </>
            ) : (
              <>
                <div>1 L = 1,000 mL = 0.001 m³</div>
                <div>1 m³ = 1,000 L = 1,000,000 mL</div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
