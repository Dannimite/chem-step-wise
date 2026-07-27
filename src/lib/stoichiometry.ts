// Stoichiometry solver — pure TypeScript. Uses the equation balancer and
// standard atomic masses to convert between mass/moles across a balanced equation.

import { balanceEquation, parseEquation } from "./equationBalancer";

// Standard atomic masses (g/mol). Values rounded to 4 sig figs where reasonable.
export const atomicMasses: Record<string, number> = {
  H: 1.008, He: 4.003,
  Li: 6.94, Be: 9.012, B: 10.81, C: 12.01, N: 14.01, O: 16.00, F: 19.00, Ne: 20.18,
  Na: 22.99, Mg: 24.31, Al: 26.98, Si: 28.09, P: 30.97, S: 32.07, Cl: 35.45, Ar: 39.95,
  K: 39.10, Ca: 40.08, Sc: 44.96, Ti: 47.87, V: 50.94, Cr: 52.00, Mn: 54.94, Fe: 55.85,
  Co: 58.93, Ni: 58.69, Cu: 63.55, Zn: 65.38, Ga: 69.72, Ge: 72.63, As: 74.92, Se: 78.97,
  Br: 79.90, Kr: 83.80,
  Rb: 85.47, Sr: 87.62, Y: 88.91, Zr: 91.22, Nb: 92.91, Mo: 95.95, Tc: 98, Ru: 101.07,
  Rh: 102.91, Pd: 106.42, Ag: 107.87, Cd: 112.41, In: 114.82, Sn: 118.71, Sb: 121.76,
  Te: 127.60, I: 126.90, Xe: 131.29,
  Cs: 132.91, Ba: 137.33, La: 138.91, Ce: 140.12, Pr: 140.91, Nd: 144.24, Pm: 145,
  Sm: 150.36, Eu: 151.96, Gd: 157.25, Tb: 158.93, Dy: 162.50, Ho: 164.93, Er: 167.26,
  Tm: 168.93, Yb: 173.05, Lu: 174.97, Hf: 178.49, Ta: 180.95, W: 183.84, Re: 186.21,
  Os: 190.23, Ir: 192.22, Pt: 195.08, Au: 196.97, Hg: 200.59, Tl: 204.38, Pb: 207.2,
  Bi: 208.98, Po: 209, At: 210, Rn: 222,
  Fr: 223, Ra: 226, Ac: 227, Th: 232.04, Pa: 231.04, U: 238.03, Np: 237, Pu: 244,
  Am: 243, Cm: 247, Bk: 247, Cf: 251, Es: 252, Fm: 257, Md: 258, No: 259, Lr: 262,
};

function normalizeFormula(f: string): string {
  const subs: Record<string, string> = {
    "₀":"0","₁":"1","₂":"2","₃":"3","₄":"4","₅":"5","₆":"6","₇":"7","₈":"8","₉":"9",
  };
  return f.replace(/[₀-₉]/g, (c) => subs[c] || c).replace(/\s+/g, "");
}

// Parse formula → element counts. Supports parentheses and hydrate dots.
export function parseFormulaCounts(formula: string): Record<string, number> {
  const s = normalizeFormula(formula);
  let i = 0;
  const readNumber = () => {
    let num = "";
    while (i < s.length && /[0-9]/.test(s[i])) num += s[i++];
    return num === "" ? 1 : parseInt(num, 10);
  };
  const parseGroup = (): Record<string, number> => {
    const counts: Record<string, number> = {};
    while (i < s.length && s[i] !== ")") {
      if (s[i] === "(") {
        i++;
        const inner = parseGroup();
        if (s[i] !== ")") throw new Error(`Missing ')' in ${formula}`);
        i++;
        const mult = readNumber();
        for (const [e, n] of Object.entries(inner)) counts[e] = (counts[e] || 0) + n * mult;
      } else if (/[A-Z]/.test(s[i])) {
        let el = s[i++];
        while (i < s.length && /[a-z]/.test(s[i])) el += s[i++];
        counts[el] = (counts[el] || 0) + readNumber();
      } else if (s[i] === "·" || s[i] === "*" || s[i] === ".") {
        i++;
        const mult = readNumber();
        const rest = parseGroup();
        for (const [e, n] of Object.entries(rest)) counts[e] = (counts[e] || 0) + n * mult;
      } else {
        throw new Error(`Unexpected character '${s[i]}' in ${formula}`);
      }
    }
    return counts;
  };
  return parseGroup();
}

export function molarMass(formula: string): { mass: number; breakdown: string[] } {
  const counts = parseFormulaCounts(formula);
  let total = 0;
  const breakdown: string[] = [];
  for (const [el, n] of Object.entries(counts)) {
    const m = atomicMasses[el];
    if (m == null) throw new Error(`Unknown element '${el}' in ${formula}`);
    const sub = m * n;
    total += sub;
    breakdown.push(`${el}: ${m} × ${n} = ${sub.toFixed(3)} g/mol`);
  }
  return { mass: total, breakdown };
}

export interface StoichInput {
  equation: string;
  given: { formula: string; amount: number; unit: "g" | "mol" };
  target: { formula: string; unit: "g" | "mol" };
}

export interface StoichResult {
  balanced: string;
  coefficients: number[];
  givenCoeff: number;
  targetCoeff: number;
  givenMolarMass: number;
  targetMolarMass: number;
  molesGiven: number;
  molesTarget: number;
  answerAmount: number;
  answerUnit: "g" | "mol";
  givenMassBreakdown: string[];
  targetMassBreakdown: string[];
}

function matchSpecies(
  formulas: string[],
  target: string
): number {
  const t = normalizeFormula(target);
  const idx = formulas.findIndex((f) => normalizeFormula(f) === t);
  if (idx === -1) throw new Error(`'${target}' is not one of the species in the equation.`);
  return idx;
}

export function solveStoichiometry(input: StoichInput): StoichResult {
  const bal = balanceEquation(input.equation);
  const species = [...bal.reactants, ...bal.products].map((s) => s.formula);

  const gi = matchSpecies(species, input.given.formula);
  const ti = matchSpecies(species, input.target.formula);
  const givenCoeff = bal.coefficients[gi];
  const targetCoeff = bal.coefficients[ti];

  const gMm = molarMass(input.given.formula);
  const tMm = molarMass(input.target.formula);

  const molesGiven = input.given.unit === "mol"
    ? input.given.amount
    : input.given.amount / gMm.mass;

  const molesTarget = molesGiven * (targetCoeff / givenCoeff);

  const answerAmount = input.target.unit === "mol" ? molesTarget : molesTarget * tMm.mass;

  return {
    balanced: bal.balanced,
    coefficients: bal.coefficients,
    givenCoeff,
    targetCoeff,
    givenMolarMass: gMm.mass,
    targetMolarMass: tMm.mass,
    molesGiven,
    molesTarget,
    answerAmount,
    answerUnit: input.target.unit,
    givenMassBreakdown: gMm.breakdown,
    targetMassBreakdown: tMm.breakdown,
  };
}

// Validate that a formula appears in the equation (used for UI hints)
export function speciesInEquation(equation: string): string[] {
  const parsed = parseEquation(equation);
  return [...parsed.reactants, ...parsed.products].map((s) => s.formula);
}
