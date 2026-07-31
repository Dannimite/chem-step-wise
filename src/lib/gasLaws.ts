// Pure ideal-gas-law solver. No React, no LLM — deterministic math + parsing.
// Solves PV = nRT for whichever variable the user leaves out.

export const R_L_ATM = 0.082057; // L·atm·mol⁻¹·K⁻¹

export type IdealVar = "P" | "V" | "n" | "T";

export interface IdealGasKnowns {
  P?: number; // atm
  V?: number; // L
  n?: number; // mol
  T?: number; // K
  /** Track original input for reporting */
  originalT?: { value: number; unit: "K" | "C" | "F" };
  originalP?: { value: number; unit: string };
  originalV?: { value: number; unit: string };
}

export interface IdealGasSolution {
  unknown: IdealVar;
  value: number;
  unit: string;
  knowns: Required<Pick<IdealGasKnowns, "P" | "V" | "n" | "T">>;
  R: number;
  formula: string;
  formulaLatex: string;
  rearrangedFormula: string;
  numerator: number;
  denominator: number;
  numeratorText: string;
  denominatorText: string;
  temperatureConversion?: string;
}

const SUBSCRIPTS: Record<string, string> = {
  "₀":"0","₁":"1","₂":"2","₃":"3","₄":"4","₅":"5","₆":"6","₇":"7","₈":"8","₉":"9",
};
function normalize(text: string): string {
  return text.replace(/[₀-₉]/g, (c) => SUBSCRIPTS[c] || c);
}

// ---------- Unit conversions ----------
export function toAtm(value: number, unit: string): number {
  const u = unit.toLowerCase();
  if (u === "atm") return value;
  if (u === "kpa") return value / 101.325;
  if (u === "pa") return value / 101325;
  if (u === "bar") return value / 1.01325;
  if (u === "mmhg" || u === "torr") return value / 760;
  if (u === "psi") return value / 14.6959;
  throw new Error(`Unknown pressure unit: ${unit}`);
}
export function toLiters(value: number, unit: string): number {
  const u = unit.toLowerCase();
  if (u === "l") return value;
  if (u === "ml" || u === "cm3" || u === "cm³") return value / 1000;
  if (u === "m3" || u === "m³") return value * 1000;
  if (u === "dm3" || u === "dm³") return value;
  throw new Error(`Unknown volume unit: ${unit}`);
}
export function toKelvin(value: number, unit: "K" | "C" | "F"): number {
  if (unit === "K") return value;
  if (unit === "C") return value + 273.15;
  if (unit === "F") return (value - 32) * (5 / 9) + 273.15;
  throw new Error(`Unknown temperature unit: ${unit}`);
}

// ---------- Extraction from natural language ----------
export function parseIdealGasQuestion(question: string): {
  knowns: IdealGasKnowns;
  askedFor?: IdealVar;
} {
  const q = normalize(question);
  const knowns: IdealGasKnowns = {};

  // Pressure: number + unit
  const pMatch = q.match(/(-?\d+(?:\.\d+)?)\s*(atm|kpa|pa|bar|mmhg|torr|psi)\b/i);
  if (pMatch) {
    const value = parseFloat(pMatch[1]);
    knowns.P = toAtm(value, pMatch[2]);
    knowns.originalP = { value, unit: pMatch[2] };
  }

  // Volume: number + L/mL/m³
  const vMatch = q.match(/(-?\d+(?:\.\d+)?)\s*(ml|l|dm3|dm³|cm3|cm³|m3|m³)\b/i);
  if (vMatch) {
    const value = parseFloat(vMatch[1]);
    knowns.V = toLiters(value, vMatch[2]);
    knowns.originalV = { value, unit: vMatch[2] };
  }

  // Temperature: prefer explicit °C / °F / K
  const tC = q.match(/(-?\d+(?:\.\d+)?)\s*°\s*c\b/i)
          || q.match(/(-?\d+(?:\.\d+)?)\s*°c\b/i)
          || q.match(/(-?\d+(?:\.\d+)?)\s*degrees?\s*c(elsius)?\b/i);
  const tF = q.match(/(-?\d+(?:\.\d+)?)\s*°\s*f\b/i)
          || q.match(/(-?\d+(?:\.\d+)?)\s*°f\b/i);
  const tK = q.match(/(-?\d+(?:\.\d+)?)\s*k\b(?!pa)/i);
  if (tC) {
    const v = parseFloat(tC[1]);
    knowns.T = toKelvin(v, "C");
    knowns.originalT = { value: v, unit: "C" };
  } else if (tF) {
    const v = parseFloat(tF[1]);
    knowns.T = toKelvin(v, "F");
    knowns.originalT = { value: v, unit: "F" };
  } else if (tK) {
    const v = parseFloat(tK[1]);
    knowns.T = v;
    knowns.originalT = { value: v, unit: "K" };
  }

  // Moles
  const nMatch = q.match(/(-?\d+(?:\.\d+)?)\s*(mol|moles)\b/i);
  if (nMatch) knowns.n = parseFloat(nMatch[1]);

  // Detect the asked-for variable
  let askedFor: IdealVar | undefined;
  const askPatterns: Array<[RegExp, IdealVar]> = [
    [/\b(find|calculate|determine|what\s+is|solve\s+for)\b[^.?!]*\bpressure\b/i, "P"],
    [/\b(find|calculate|determine|what\s+is|solve\s+for)\b[^.?!]*\bvolume\b/i, "V"],
    [/\b(find|calculate|determine|what\s+is|solve\s+for|how\s+many)\b[^.?!]*\b(moles?|n)\b/i, "n"],
    [/\b(find|calculate|determine|what\s+is|solve\s+for)\b[^.?!]*\btemperature\b/i, "T"],
  ];
  for (const [re, v] of askPatterns) {
    if (re.test(q)) { askedFor = v; break; }
  }
  if (!askedFor) {
    // Fallback: the one that is missing
    const missing: IdealVar[] = (["P", "V", "n", "T"] as IdealVar[]).filter(
      (k) => knowns[k] === undefined
    );
    if (missing.length === 1) askedFor = missing[0];
  }

  return { knowns, askedFor };
}

// ---------- Solver ----------
export function solveIdealGasLaw(
  knowns: IdealGasKnowns,
  unknown: IdealVar,
  R: number = R_L_ATM
): IdealGasSolution {
  const { P, V, n, T } = knowns;
  const required: Record<IdealVar, number | undefined> = { P, V, n, T };
  for (const k of ["P", "V", "n", "T"] as IdealVar[]) {
    if (k !== unknown && (required[k] === undefined || Number.isNaN(required[k] as number))) {
      throw new Error(`Missing value for ${k}. Provide P, V, n, or T so that only one variable is unknown.`);
    }
  }

  let value: number, unit: string, rearranged: string;
  let numerator = 0, denominator = 0;
  let numText = "", denText = "";

  switch (unknown) {
    case "P":
      numerator = (n as number) * R * (T as number);
      denominator = V as number;
      value = numerator / denominator;
      unit = "atm";
      rearranged = "P = nRT / V";
      numText = `n × R × T = ${(n as number).toString()} × ${R} × ${(T as number).toString()} = ${numerator.toPrecision(6)}`;
      denText = `V = ${(V as number).toString()}`;
      break;
    case "V":
      numerator = (n as number) * R * (T as number);
      denominator = P as number;
      value = numerator / denominator;
      unit = "L";
      rearranged = "V = nRT / P";
      numText = `n × R × T = ${(n as number).toString()} × ${R} × ${(T as number).toString()} = ${numerator.toPrecision(6)}`;
      denText = `P = ${(P as number).toString()}`;
      break;
    case "n":
      numerator = (P as number) * (V as number);
      denominator = R * (T as number);
      value = numerator / denominator;
      unit = "mol";
      rearranged = "n = PV / RT";
      numText = `P × V = ${(P as number).toString()} × ${(V as number).toString()} = ${numerator.toPrecision(6)}`;
      denText = `R × T = ${R} × ${(T as number).toString()} = ${denominator.toPrecision(6)}`;
      break;
    case "T":
      numerator = (P as number) * (V as number);
      denominator = (n as number) * R;
      value = numerator / denominator;
      unit = "K";
      rearranged = "T = PV / nR";
      numText = `P × V = ${(P as number).toString()} × ${(V as number).toString()} = ${numerator.toPrecision(6)}`;
      denText = `n × R = ${(n as number).toString()} × ${R} = ${denominator.toPrecision(6)}`;
      break;
  }

  const filled = {
    P: (unknown === "P" ? value : (P as number)),
    V: (unknown === "V" ? value : (V as number)),
    n: (unknown === "n" ? value : (n as number)),
    T: (unknown === "T" ? value : (T as number)),
  };

  let tempConv: string | undefined;
  if (knowns.originalT && knowns.originalT.unit !== "K") {
    const u = knowns.originalT.unit;
    tempConv = u === "C"
      ? `T = ${knowns.originalT.value} °C + 273.15 = ${(T as number).toFixed(2)} K`
      : `T = (${knowns.originalT.value} °F − 32) × 5/9 + 273.15 = ${(T as number).toFixed(2)} K`;
  }

  return {
    unknown,
    value,
    unit,
    knowns: filled,
    R,
    formula: "PV = nRT",
    formulaLatex: "PV = nRT",
    rearrangedFormula: rearranged,
    numerator,
    denominator,
    numeratorText: numText,
    denominatorText: denText,
    temperatureConversion: tempConv,
  };
}

// ---------- Unit validation / ambiguity detection ----------

export type GasUnitIssueKind = "missing-unit" | "ambiguous-unit" | "conflicting-unit";

export interface GasUnitIssue {
  kind: GasUnitIssueKind;
  variable: IdealVar;
  /** The raw fragment of the question that triggered the issue. */
  fragment: string;
  question: string;
}

export interface GasUnitValidation {
  ok: boolean;
  issues: GasUnitIssue[];
  clarifyingQuestions: string[];
}

const PRESSURE_UNIT_RE = /(-?\d+(?:\.\d+)?)\s*(atm|kpa|pa|bar|mmhg|torr|psi)\b/gi;
const VOLUME_UNIT_RE = /(-?\d+(?:\.\d+)?)\s*(ml|l|dm3|dm³|cm3|cm³|m3|m³)\b/gi;
const TEMP_UNIT_RE = /(-?\d+(?:\.\d+)?)\s*(°\s*c|°c|°\s*f|°f|k\b|degrees?\s*(c|f|celsius|fahrenheit)\b|kelvin\b|celsius\b|fahrenheit\b)/gi;
const MOLE_UNIT_RE = /(-?\d+(?:\.\d+)?)\s*(mol|moles|mole)\b/gi;

/**
 * Detects missing or ambiguous units in a gas-law question so the UI can ask a
 * clear follow-up question instead of silently guessing (e.g. atm vs kPa).
 */
export function validateGasUnits(question: string): GasUnitValidation {
  const q = normalize(question);
  const issues: GasUnitIssue[] = [];

  const named = (v: IdealVar) => {
    switch (v) {
      case "P": return /\bpressure\b|\bp\s*[=₁₂]?/i;
      case "V": return /\bvolume\b/i;
      case "T": return /\btemperature\b/i;
      case "n": return /\bmol(es|e)?\b|\bamount of (gas|substance)\b/i;
    }
  };

  // Which quantities carry a proper number+unit pair?
  const hasPressureValue = new RegExp(PRESSURE_UNIT_RE.source, "i").test(q);
  const hasVolumeValue = new RegExp(VOLUME_UNIT_RE.source, "i").test(q);
  const hasTempValue = new RegExp(TEMP_UNIT_RE.source, "i").test(q);
  const hasMoleValue = new RegExp(MOLE_UNIT_RE.source, "i").test(q);

  // A quantity is only asked for (unknown) if the question requests it.
  const askedFor = parseIdealGasQuestion(question).askedFor;

  // 1) Explicit "pressure of 100" style mentions without a unit.
  const bareChecks: Array<[IdealVar, RegExp, boolean, string]> = [
    ["P", /\bpressure\b[^.?!]{0,20}?(-?\d+(?:\.\d+)?)(?!\s*(atm|kpa|pa|bar|mmhg|torr|psi))/i, hasPressureValue,
      "What unit is the pressure in — atm, kPa, bar, mmHg/torr, or psi?"],
    ["V", /\bvolume\b[^.?!]{0,20}?(-?\d+(?:\.\d+)?)(?!\s*(ml|l|dm3|dm³|cm3|cm³|m3|m³))/i, hasVolumeValue,
      "What unit is the volume in — L, mL, or m³?"],
    ["T", /\btemperature\b[^.?!]{0,20}?(-?\d+(?:\.\d+)?)(?!\s*(°|k\b|c\b|f\b|kelvin|celsius|degrees))/i, hasTempValue,
      "What unit is the temperature in — K, °C, or °F?"],
  ];

  for (const [variable, re, hasValue, ask] of bareChecks) {
    if (variable === askedFor) continue;
    const m = q.match(re);
    if (m && !hasValue) {
      issues.push({ kind: "missing-unit", variable, fragment: m[0].trim(), question: ask });
    }
  }

  // 2) Numbers with no unit at all anywhere (e.g. "a gas at 2.50 and 298 K").
  const stripped = q
    .replace(new RegExp(PRESSURE_UNIT_RE.source, "gi"), " ")
    .replace(new RegExp(VOLUME_UNIT_RE.source, "gi"), " ")
    .replace(new RegExp(TEMP_UNIT_RE.source, "gi"), " ")
    .replace(new RegExp(MOLE_UNIT_RE.source, "gi"), " ")
    .replace(/(-?\d+(?:\.\d+)?)\s*(g|kg|mg|j|kj|m)\b/gi, " ");

  const orphanNumbers = stripped.match(/-?\d+(?:\.\d+)?/g) ?? [];
  if (orphanNumbers.length > 0) {
    // Guess which quantity is unlabeled: the one that has no value yet.
    const missingQuantities: Array<[IdealVar, boolean, string]> = [
      ["P", hasPressureValue, "What unit is the pressure in — atm, kPa, bar, mmHg/torr, or psi?"],
      ["V", hasVolumeValue, "What unit is the volume in — L, mL, or m³?"],
      ["T", hasTempValue, "What unit is the temperature in — K, °C, or °F?"],
      ["n", hasMoleValue, "Is that number the amount of gas in moles?"],
    ];
    for (const num of orphanNumbers) {
      const candidate = missingQuantities.find(
        ([v, hasValue]) => !hasValue && v !== askedFor && named(v)!.test(q)
      ) ?? missingQuantities.find(([v, hasValue]) => !hasValue && v !== askedFor);
      if (!candidate) break;
      const [variable, , ask] = candidate;
      if (issues.some((i) => i.variable === variable)) continue;
      issues.push({
        kind: "ambiguous-unit",
        variable,
        fragment: num,
        question: ask,
      });
    }
  }

  // 3) Two different pressure (or volume) units for the *same* single state.
  const pressureUnits = [...q.matchAll(new RegExp(PRESSURE_UNIT_RE.source, "gi"))].map((m) =>
    m[2].toLowerCase()
  );
  const uniquePressureUnits = [...new Set(pressureUnits)];
  if (uniquePressureUnits.length > 1) {
    issues.push({
      kind: "conflicting-unit",
      variable: "P",
      fragment: uniquePressureUnits.join(", "),
      question: `The question mixes pressure units (${uniquePressureUnits.join(
        " and "
      )}). Which unit should the answer use?`,
    });
  }

  const clarifyingQuestions = [...new Set(issues.map((i) => i.question))];
  return { ok: issues.length === 0, issues, clarifyingQuestions };
}

// ---------- Interactive plot data ----------

export type PlotMode = "P-V" | "V-T" | "P-T";

export interface PlotPoint {
  x: number;
  y: number;
}

export interface IdealGasPlot {
  mode: PlotMode;
  xLabel: string;
  yLabel: string;
  xUnit: string;
  yUnit: string;
  /** Constant conditions held fixed for the curve. */
  heldConstant: string;
  points: PlotPoint[];
  /** The point that corresponds to the solved state. */
  marker: PlotPoint;
  relationship: string;
}

/**
 * Choose the most relevant plot mode for the solved state:
 * - solving for P or V → P–V isotherm (Boyle)
 * - solving for T with a volume known → V–T isobar (Charles)
 * - otherwise → P–T isochore (Gay-Lussac)
 */
export function choosePlotMode(unknown: IdealVar): PlotMode {
  if (unknown === "P" || unknown === "V") return "P-V";
  if (unknown === "T") return "V-T";
  return "P-V";
}

export function buildIdealGasPlot(
  solution: IdealGasSolution,
  mode: PlotMode = choosePlotMode(solution.unknown),
  steps = 40
): IdealGasPlot {
  const { P, V, n, T } = solution.knowns;
  const R = solution.R;
  const points: PlotPoint[] = [];

  const sweep = (center: number, fn: (x: number) => number) => {
    const from = Math.max(center * 0.25, 1e-6);
    const to = center * 2;
    const dx = (to - from) / (steps - 1);
    for (let i = 0; i < steps; i++) {
      const x = from + dx * i;
      points.push({ x: Number(x.toPrecision(6)), y: Number(fn(x).toPrecision(6)) });
    }
  };

  if (mode === "P-V") {
    // Isotherm: P = nRT / V
    sweep(V, (v) => (n * R * T) / v);
    return {
      mode,
      xLabel: "Volume",
      yLabel: "Pressure",
      xUnit: "L",
      yUnit: "atm",
      heldConstant: `n = ${n.toPrecision(4)} mol, T = ${T.toFixed(2)} K`,
      points,
      marker: { x: Number(V.toPrecision(6)), y: Number(P.toPrecision(6)) },
      relationship: "Boyle's Law region: at fixed n and T, P ∝ 1/V",
    };
  }

  if (mode === "V-T") {
    // Isobar: V = nRT / P
    sweep(T, (t) => (n * R * t) / P);
    return {
      mode,
      xLabel: "Temperature",
      yLabel: "Volume",
      xUnit: "K",
      yUnit: "L",
      heldConstant: `n = ${n.toPrecision(4)} mol, P = ${P.toPrecision(4)} atm`,
      points,
      marker: { x: Number(T.toPrecision(6)), y: Number(V.toPrecision(6)) },
      relationship: "Charles's Law region: at fixed n and P, V ∝ T",
    };
  }

  // Isochore: P = nRT / V
  sweep(T, (t) => (n * R * t) / V);
  return {
    mode,
    xLabel: "Temperature",
    yLabel: "Pressure",
    xUnit: "K",
    yUnit: "atm",
    heldConstant: `n = ${n.toPrecision(4)} mol, V = ${V.toPrecision(4)} L`,
    points,
    marker: { x: Number(T.toPrecision(6)), y: Number(P.toPrecision(6)) },
    relationship: "Gay-Lussac's Law region: at fixed n and V, P ∝ T",
  };
}
