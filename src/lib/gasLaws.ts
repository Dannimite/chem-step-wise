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
