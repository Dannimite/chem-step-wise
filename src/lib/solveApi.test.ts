import { describe, it, expect } from "vitest";
import { solveEndpoint, SOLVE_ENDPOINT } from "./solveApi";
import { elementNames } from "./elementImages";
import { R_L_ATM } from "./gasLaws";

describe(`${SOLVE_ENDPOINT} — ideal gas law (end-to-end)`, () => {
  it("solves for moles from P, V, T", async () => {
    const res = await solveEndpoint({
      question: "How many moles of gas occupy 5.00 L at 2.50 atm and 298 K?",
    });
    expect(res.status).toBe(200);
    if (!("topic" in res.body) || res.body.topic !== "gas-laws") throw new Error("wrong payload");
    expect(res.body.askedFor).toBe("n");
    expect(res.body.value).toBeCloseTo((2.5 * 5) / (R_L_ATM * 298), 4);
    expect(res.body.finalAnswer).toMatch(/^n = 0\.51 mol$/);
    expect(res.body.steps.length).toBeGreaterThanOrEqual(4);
  });

  it("solves for volume and converts °C to K end-to-end", async () => {
    const res = await solveEndpoint({
      question: "Find the volume of 0.50 mol of gas at 1.00 atm and 25°C.",
    });
    expect(res.status).toBe(200);
    if (!("topic" in res.body) || res.body.topic !== "gas-laws") throw new Error("wrong payload");
    expect(res.body.knowns.T).toBeCloseTo(298.15, 2);
    expect(res.body.value).toBeCloseTo((0.5 * R_L_ATM * 298.15) / 1, 4);
    expect(res.body.unit).toBe("L");
  });

  it("normalizes kPa pressure to atm", async () => {
    const res = await solveEndpoint({
      question: "How many moles of gas are in 2.00 L at 202.65 kPa and 300 K?",
    });
    expect(res.status).toBe(200);
    if (!("topic" in res.body) || res.body.topic !== "gas-laws") throw new Error("wrong payload");
    expect(res.body.knowns.P).toBeCloseTo(2, 3);
  });

  it("returns a plot dataset with a marker on the solved state", async () => {
    const res = await solveEndpoint({
      question: "What is the pressure of 1.00 mol of gas in 22.4 L at 273.15 K?",
    });
    expect(res.status).toBe(200);
    if (!("topic" in res.body) || res.body.topic !== "gas-laws") throw new Error("wrong payload");
    const plot = res.body.plot;
    expect(plot.mode).toBe("P-V");
    expect(plot.points.length).toBeGreaterThan(10);
    expect(plot.marker.x).toBeCloseTo(22.4, 2);
    expect(plot.marker.y).toBeCloseTo(res.body.value, 3);
    // Boyle isotherm: PV stays constant along the curve
    const pv = plot.points.map((p) => p.x * p.y);
    for (const product of pv) expect(product).toBeCloseTo(pv[0], 2);
  });

  it("supports an explicit V–T plot mode", async () => {
    const res = await solveEndpoint({
      question: "Find the temperature of 0.30 mol of gas at 2.00 atm in 5.00 L.",
      plotMode: "V-T",
    });
    expect(res.status).toBe(200);
    if (!("topic" in res.body) || res.body.topic !== "gas-laws") throw new Error("wrong payload");
    expect(res.body.askedFor).toBe("T");
    expect(res.body.plot.mode).toBe("V-T");
    expect(res.body.plot.xUnit).toBe("K");
  });

  it("asks a clarifying question when a pressure unit is missing", async () => {
    const res = await solveEndpoint({
      question: "A gas has a pressure of 2.50 and a volume of 5.00 L at 298 K. Find the moles.",
    });
    expect(res.status).toBe(422);
    expect("clarifyingQuestions" in res.body && res.body.clarifyingQuestions?.join(" ")).toMatch(
      /atm.*kPa/i
    );
  });

  it("flags conflicting pressure units", async () => {
    const res = await solveEndpoint({
      question: "A 5.00 L gas sample at 1.00 atm and 101.325 kPa and 298 K — find the moles.",
      topic: "gas-laws",
    });
    expect(res.status).toBe(422);
    expect("clarifyingQuestions" in res.body && res.body.clarifyingQuestions?.join(" ")).toMatch(
      /mixes pressure units/i
    );
  });

  it("rejects a question with too little information", async () => {
    const res = await solveEndpoint({
      question: "What is the volume of the gas at 1.00 atm?",
      topic: "gas-laws",
    });
    expect(res.status).toBe(422);
    expect("error" in res.body).toBe(true);
  });

  it("rejects an empty question", async () => {
    const res = await solveEndpoint({ question: "   " });
    expect(res.status).toBe(400);
  });
});

describe(`${SOLVE_ENDPOINT} — element image mapping (end-to-end)`, () => {
  it("returns an image for every atomic number 1–118", async () => {
    for (let z = 1; z <= 118; z++) {
      const res = await solveEndpoint({
        question: `What does element ${z} look like?`,
      });
      expect(res.status, `Z=${z}`).toBe(200);
      if (!("topic" in res.body) || res.body.topic !== "element-image")
        throw new Error(`wrong payload for Z=${z}`);
      expect(res.body.atomicNumber).toBe(z);
      expect(res.body.name).toBe(elementNames[z]);
      expect(res.body.imageUrl, `missing image for Z=${z}`).toBeTruthy();
      expect(res.body.kind).toMatch(/real-photo|silvery-placeholder|conceptual/);
    }
  });

  it("resolves elements by name, including the US 'aluminum' spelling", async () => {
    const iron = await solveEndpoint({ question: "What does Iron look like?" });
    if (!("topic" in iron.body) || iron.body.topic !== "element-image") throw new Error("bad");
    expect(iron.body.atomicNumber).toBe(26);
    expect(iron.body.kind).toBe("real-photo");

    const al = await solveEndpoint({ question: "Show me a photo of aluminum" });
    if (!("topic" in al.body) || al.body.topic !== "element-image") throw new Error("bad");
    expect(al.body.atomicNumber).toBe(13);
    expect(al.body.imageUrl).toContain("aluminium");
  });

  it("maps synthetic elements 104–109 to the silvery reference sample", async () => {
    for (let z = 104; z <= 109; z++) {
      const res = await solveEndpoint({ question: `What does element ${z} look like?` });
      if (!("topic" in res.body) || res.body.topic !== "element-image") throw new Error("bad");
      expect(res.body.kind).toBe("silvery-placeholder");
      expect(res.body.imageUrl).toMatch(/silvery-metal-sample/);
    }
  });

  it("marks oganesson (118) as conceptual", async () => {
    const res = await solveEndpoint({ question: "What does element 118 look like?" });
    if (!("topic" in res.body) || res.body.topic !== "element-image") throw new Error("bad");
    expect(res.body.kind).toBe("conceptual");
  });

  it("returns 404 for an out-of-range atomic number", async () => {
    const res = await solveEndpoint({ question: "What does element 150 look like?" });
    expect(res.status).toBe(404);
  });

  it("asks which element when none can be identified", async () => {
    const res = await solveEndpoint({
      question: "What does it look like?",
      topic: "element-image",
    });
    expect(res.status).toBe(422);
    expect("clarifyingQuestions" in res.body && res.body.clarifyingQuestions?.length).toBeTruthy();
  });
});
