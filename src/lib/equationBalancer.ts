// Chemical equation balancer using linear algebra over rationals.
// Pure TypeScript — no LLM. Returns balanced coefficients + step-by-step trace.

type Species = { formula: string; atoms: Record<string, number> };
type ParsedEquation = { reactants: Species[]; products: Species[]; elements: string[] };

// -------------------- Formula parsing --------------------

function parseFormula(formula: string): Record<string, number> {
  const s = formula.replace(/\s+/g, "");
  let i = 0;
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
        const n = readNumber();
        counts[el] = (counts[el] || 0) + n;
      } else if (s[i] === "·" || s[i] === "*") {
        // hydrate dot — treat rest as additive
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
  const readNumber = () => {
    let num = "";
    while (i < s.length && /[0-9]/.test(s[i])) num += s[i++];
    return num === "" ? 1 : parseInt(num, 10);
  };
  return parseGroup();
}

// Normalize unicode subscripts/arrows for easier parsing.
function normalize(eq: string): string {
  const subs: Record<string, string> = {
    "₀": "0","₁": "1","₂": "2","₃": "3","₄": "4","₅": "5","₆": "6","₇": "7","₈": "8","₉": "9",
  };
  return eq
    .replace(/[₀-₉]/g, (c) => subs[c] || c)
    .replace(/→|⟶|➔|➜|-->/g, "->")
    .replace(/=+>/g, "->")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseEquation(input: string): ParsedEquation {
  const eq = normalize(input);
  const parts = eq.split("->");
  if (parts.length !== 2) throw new Error("Equation must contain '->' (or →) separating reactants and products.");
  const parseSide = (side: string): Species[] =>
    side.split("+").map((t) => t.trim()).filter(Boolean).map((term) => {
      // Strip any leading integer coefficient the user typed
      const m = term.match(/^(\d+)\s*(.*)$/);
      const formula = m ? m[2] : term;
      if (!formula) throw new Error(`Invalid species '${term}'`);
      return { formula, atoms: parseFormula(formula) };
    });
  const reactants = parseSide(parts[0]);
  const products = parseSide(parts[1]);
  const elements = Array.from(
    new Set([...reactants, ...products].flatMap((s) => Object.keys(s.atoms)))
  );
  return { reactants, products, elements };
}

// -------------------- Rational arithmetic --------------------

const gcd = (a: number, b: number): number => {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
};
const lcm = (a: number, b: number) => Math.abs(a * b) / gcd(a, b);

type Frac = { n: number; d: number };
const F = (n: number, d = 1): Frac => {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
};
const fAdd = (a: Frac, b: Frac): Frac => F(a.n * b.d + b.n * a.d, a.d * b.d);
const fSub = (a: Frac, b: Frac): Frac => F(a.n * b.d - b.n * a.d, a.d * b.d);
const fMul = (a: Frac, b: Frac): Frac => F(a.n * b.n, a.d * b.d);
const fDiv = (a: Frac, b: Frac): Frac => F(a.n * b.d, a.d * b.n);
const fNeg = (a: Frac): Frac => F(-a.n, a.d);
const fZero = (a: Frac) => a.n === 0;

// -------------------- Solve integer nullspace --------------------

function balanceCoefficients(parsed: ParsedEquation): number[] {
  const { reactants, products, elements } = parsed;
  const species = [...reactants, ...products];
  const n = species.length;
  // Build matrix: rows = elements, cols = species. Reactants +, products -.
  const A: Frac[][] = elements.map((el) =>
    species.map((sp, idx) => {
      const sign = idx < reactants.length ? 1 : -1;
      return F(sign * (sp.atoms[el] || 0));
    })
  );

  // Gauss-Jordan to reduced row echelon form
  const rows = A.length;
  const cols = n;
  let r = 0;
  const pivotCol: number[] = [];
  for (let c = 0; c < cols && r < rows; c++) {
    let piv = -1;
    for (let i = r; i < rows; i++) if (!fZero(A[i][c])) { piv = i; break; }
    if (piv === -1) continue;
    [A[r], A[piv]] = [A[piv], A[r]];
    const pv = A[r][c];
    for (let j = 0; j < cols; j++) A[r][j] = fDiv(A[r][j], pv);
    for (let i = 0; i < rows; i++) {
      if (i === r) continue;
      const factor = A[i][c];
      if (fZero(factor)) continue;
      for (let j = 0; j < cols; j++) A[i][j] = fSub(A[i][j], fMul(factor, A[r][j]));
    }
    pivotCol.push(c);
    r++;
  }

  const pivotSet = new Set(pivotCol);
  const freeCols: number[] = [];
  for (let c = 0; c < cols; c++) if (!pivotSet.has(c)) freeCols.push(c);
  if (freeCols.length !== 1) {
    throw new Error(
      freeCols.length === 0
        ? "No solution: the equation cannot be balanced as written."
        : "Equation is ambiguous (multiple independent balances). Check the formulas."
    );
  }
  const free = freeCols[0];
  // Set free var = 1; each pivot var = -A[r][free]
  const x: Frac[] = new Array(cols).fill(F(0));
  x[free] = F(1);
  for (let i = 0; i < pivotCol.length; i++) {
    const c = pivotCol[i];
    x[c] = fNeg(A[i][free]);
  }
  // Scale to positive integers
  let denomLcm = 1;
  for (const v of x) denomLcm = lcm(denomLcm, v.d);
  const ints = x.map((v) => (v.n * denomLcm) / v.d);
  // Flip sign if needed so all positive
  const anyNeg = ints.some((v) => v < 0);
  const anyPos = ints.some((v) => v > 0);
  if (anyNeg && anyPos) throw new Error("Could not resolve consistent positive coefficients.");
  const signed = anyNeg ? ints.map((v) => -v) : ints;
  // Reduce by gcd
  let g = 0;
  for (const v of signed) g = gcd(g, v);
  if (g === 0) throw new Error("Degenerate equation.");
  const reduced = signed.map((v) => v / g);
  if (reduced.some((v) => v <= 0)) throw new Error("Failed to balance: non-positive coefficient produced.");
  return reduced;
}

// -------------------- Public API --------------------

export interface BalanceResult {
  balanced: string;
  coefficients: number[];
  reactants: Species[];
  products: Species[];
  elements: string[];
  elementTotals: { element: string; left: number; right: number }[];
}

const sub = (n: number) => String(n).replace(/[0-9]/g, (d) => "₀₁₂₃₄₅₆₇₈₉"[+d]);

function prettyFormula(formula: string) {
  // Convert digits following letters/parens into subscripts.
  return formula.replace(/([A-Za-z\)\]])(\d+)/g, (_, a, n) => a + sub(parseInt(n, 10)));
}

export function balanceEquation(input: string): BalanceResult {
  const parsed = parseEquation(input);
  const coeffs = balanceCoefficients(parsed);
  const { reactants, products, elements } = parsed;
  const format = (list: Species[], offset: number) =>
    list
      .map((sp, i) => {
        const c = coeffs[offset + i];
        return (c === 1 ? "" : c.toString()) + prettyFormula(sp.formula);
      })
      .join(" + ");
  const balanced = `${format(reactants, 0)} → ${format(products, reactants.length)}`;

  const elementTotals = elements.map((el) => {
    let left = 0, right = 0;
    reactants.forEach((sp, i) => { left += (sp.atoms[el] || 0) * coeffs[i]; });
    products.forEach((sp, i) => { right += (sp.atoms[el] || 0) * coeffs[reactants.length + i]; });
    return { element: el, left, right };
  });

  return { balanced, coefficients: coeffs, reactants, products, elements, elementTotals };
}
