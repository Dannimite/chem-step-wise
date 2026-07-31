import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LineChart as LineChartIcon } from "lucide-react";
import {
  buildIdealGasPlot,
  choosePlotMode,
  type IdealGasSolution,
  type PlotMode,
} from "@/lib/gasLaws";

interface IdealGasPlotProps {
  solution: IdealGasSolution;
}

const MODE_LABEL: Record<PlotMode, string> = {
  "P-V": "P–V (isotherm)",
  "V-T": "V–T (isobar)",
  "P-T": "P–T (isochore)",
};

export function IdealGasPlot({ solution }: IdealGasPlotProps) {
  const [mode, setMode] = useState<PlotMode>(choosePlotMode(solution.unknown));
  const plot = useMemo(() => buildIdealGasPlot(solution, mode), [solution, mode]);

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <LineChartIcon className="h-4 w-4 text-primary" aria-hidden />
            {plot.yLabel} vs {plot.xLabel}
          </CardTitle>
          <ToggleGroup
            type="single"
            value={mode}
            onValueChange={(v) => v && setMode(v as PlotMode)}
            size="sm"
            aria-label="Plot relationship"
          >
            {(["P-V", "V-T", "P-T"] as PlotMode[]).map((m) => (
              <ToggleGroupItem key={m} value={m} className="text-xs px-2">
                {m}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Badge variant="secondary" className="text-xs">{MODE_LABEL[plot.mode]}</Badge>
          <Badge variant="outline" className="text-xs">Held constant: {plot.heldConstant}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={plot.points} margin={{ top: 8, right: 16, bottom: 24, left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="x"
                type="number"
                domain={["dataMin", "dataMax"]}
                tickFormatter={(v: number) => Number(v).toPrecision(3)}
                tick={{ fontSize: 11 }}
                stroke="hsl(var(--muted-foreground))"
                label={{
                  value: `${plot.xLabel} (${plot.xUnit})`,
                  position: "insideBottom",
                  offset: -12,
                  fontSize: 12,
                  fill: "hsl(var(--muted-foreground))",
                }}
              />
              <YAxis
                tickFormatter={(v: number) => Number(v).toPrecision(3)}
                tick={{ fontSize: 11 }}
                stroke="hsl(var(--muted-foreground))"
                label={{
                  value: `${plot.yLabel} (${plot.yUnit})`,
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 12,
                  fill: "hsl(var(--muted-foreground))",
                }}
              />
              <ChartTooltip
                contentStyle={{
                  background: "hsl(var(--popover))",
                  borderColor: "hsl(var(--border))",
                  color: "hsl(var(--popover-foreground))",
                  fontSize: 12,
                  borderRadius: 8,
                }}
                formatter={(value: number) => [`${Number(value).toPrecision(4)} ${plot.yUnit}`, plot.yLabel]}
                labelFormatter={(label) => `${plot.xLabel}: ${Number(label).toPrecision(4)} ${plot.xUnit}`}
              />
              <Line
                type="monotone"
                dataKey="y"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <ReferenceDot
                x={plot.marker.x}
                y={plot.marker.y}
                r={5}
                fill="hsl(var(--primary))"
                stroke="hsl(var(--background))"
                strokeWidth={2}
                isFront
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {plot.relationship}. The highlighted point is your solved state:{" "}
          {plot.xLabel} = {plot.marker.x} {plot.xUnit}, {plot.yLabel} = {plot.marker.y} {plot.yUnit}.
        </p>
      </CardContent>
    </Card>
  );
}
