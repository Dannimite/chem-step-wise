// Local "/api/solve" endpoint handler.
//
// This app is fully client-side (no server runtime), so the solve endpoint is
// implemented as a request/response handler that the UI calls directly and that
// end-to-end tests can drive exactly like an HTTP endpoint: a JSON request in,
// a status + JSON body out. If a real backend is added later, this handler can
// be mounted behind POST /api/solve unchanged.

import {
  buildIdealGasPlot,
  choosePlotMode,
  parseIdealGasQuestion,
  solveIdealGasLaw,
  validateGasUnits,
  type IdealGasPlot,
  type IdealVar,
  type PlotMode,
} from "./gasLaws";
import { elementNames, getElementImage, type ImageKind } from "./elementImages";

export const SOLVE_ENDPOINT = "/api/solve";

export type SolveTopic = "gas-laws" | "element-image";

export interface SolveRequest {
  question: string;
  topic?: SolveTopic;
  /** Optional explicit plot mode for gas-law questions. */
  plotMode?: PlotMode;
}

export interface GasLawSolvePayload {
  topic: "gas-laws";
  law: "ideal-gas-law";
  askedFor: IdealVar;
  value: number;
  unit: string;
  finalAnswer: string;
  knowns: { P: number; V: number; n: number; T: number };
  steps: string[];
  plot: IdealGasPlot;
}

export interface ElementImagePayload {
  topic: "element-image";
  atomicNumber: number;
  name: string;
  imageUrl: string;
  fallbacks: string[];
  kind: ImageKind;
  note: string;
}

export interface SolveErrorPayload {
  error: string;
  clarifyingQuestions?: string[];
}

export type SolveBody = GasLawSolvePayload | ElementImagePayload | SolveErrorPayload;

export interface SolveResponse {
  status: number;
  body: SolveBody;
}

function detectTopic(question: string): SolveTopic {
  if (
    /\b(look|looks|appearance|image|photo|picture|color|colour)\b/i.test(question) ||
    /\belement\s+\d+\b/i.test(question) ||
    /\batomic\s+number\b/i.test(question)
  ) {
    return "element-image";
  }
  return "gas-laws";
}

function extractAtomicNumber(question: string): number | undefined {
  const byNumber = question.match(/\b(?:element|atomic\s+number|z)\s*#?\s*(\d{1,3})\b/i);
  if (byNumber) return parseInt(byNumber[1], 10);

  const byName = Object.entries(elementNames).find(([, name]) =>
    new RegExp(`\\b${name}\\b`, "i").test(question)
  );
  if (byName) return Number(byName[0]);

  // "aluminum" (US spelling) is not the canonical name we store.
  if (/\baluminum\b/i.test(question)) return 13;
  if (/\bcaesium\b/i.test(question)) return 55;
  if (/\bsulphur\b/i.test(question)) return 16;

  const bare = question.match(/\b(\d{1,3})\b/);
  if (bare) return parseInt(bare[1], 10);
  return undefined;
}

export async function solveEndpoint(request: SolveRequest): Promise<SolveResponse> {
  const question = (request.question ?? "").trim();
  if (!question) {
    return { status: 400, body: { error: "A question is required." } };
  }

  const topic = request.topic ?? detectTopic(question);

  if (topic === "element-image") {
    const z = extractAtomicNumber(question);
    if (!z || !Number.isInteger(z)) {
      return {
        status: 422,
        body: {
          error: "Could not identify an element in the question.",
          clarifyingQuestions: [
            "Which element do you mean? Give its name or atomic number (1–118).",
          ],
        },
      };
    }
    if (z < 1 || z > 118) {
      return {
        status: 404,
        body: { error: `No element with atomic number ${z} — valid range is 1–118.` },
      };
    }
    const info = getElementImage(z);
    return {
      status: 200,
      body: {
        topic: "element-image",
        atomicNumber: z,
        name: info.name,
        imageUrl: info.primary,
        fallbacks: info.fallbacks,
        kind: info.kind,
        note: info.note,
      },
    };
  }

  // ---- Gas laws ----
  const validation = validateGasUnits(question);
  if (!validation.ok) {
    return {
      status: 422,
      body: {
        error: "Missing or ambiguous units in the question.",
        clarifyingQuestions: validation.clarifyingQuestions,
      },
    };
  }

  const { knowns, askedFor } = parseIdealGasQuestion(question);
  if (!askedFor) {
    return {
      status: 422,
      body: {
        error: "Could not determine which variable to solve for.",
        clarifyingQuestions: [
          "Which quantity should I find — pressure, volume, moles, or temperature?",
        ],
      },
    };
  }

  try {
    const sol = solveIdealGasLaw(knowns, askedFor);
    const plot = buildIdealGasPlot(sol, request.plotMode ?? choosePlotMode(askedFor));
    const steps = [
      `Use PV = nRT and rearrange: ${sol.rearrangedFormula}`,
      ...(sol.temperatureConversion ? [sol.temperatureConversion] : []),
      `Numerator: ${sol.numeratorText}`,
      `Denominator: ${sol.denominatorText}`,
      `${sol.unknown} = ${sol.value.toPrecision(4)} ${sol.unit}`,
    ];

    return {
      status: 200,
      body: {
        topic: "gas-laws",
        law: "ideal-gas-law",
        askedFor,
        value: sol.value,
        unit: sol.unit,
        finalAnswer: `${sol.unknown} = ${sol.value.toFixed(2)} ${sol.unit}`,
        knowns: sol.knowns,
        steps,
        plot,
      },
    };
  } catch (err) {
    return {
      status: 422,
      body: {
        error: err instanceof Error ? err.message : "Unable to solve.",
        clarifyingQuestions: [
          "Please provide three of pressure, volume, moles, and temperature so only one is unknown.",
        ],
      },
    };
  }
}
