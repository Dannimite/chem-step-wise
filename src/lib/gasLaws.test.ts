import { describe, it, expect } from "vitest";
import {
  parseIdealGasQuestion,
  solveIdealGasLaw,
  toAtm,
  toKelvin,
  toLiters,
  R_L_ATM,
} from "./gasLaws";

describe("unit conversions", () => {
  it("converts pressure units to atm", () => {
    expect(toAtm(760, "mmHg")).toBeCloseTo(1, 4);
    expect(toAtm(101.325, "kPa")).toBeCloseTo(1, 4);
    expect(toAtm(1, "bar")).toBeCloseTo(0.98692, 4);
  });
  it("converts volume units to L", () => {
    expect(toLiters(500, "mL")).toBeCloseTo(0.5, 6);
    expect(toLiters(1, "m3")).toBeCloseTo(1000, 6);
  });
  it("converts temperature to K", () => {
    expect(toKelvin(25, "C")).toBeCloseTo(298.15, 2);
    expect(toKelvin(32, "F")).toBeCloseTo(273.15, 2);
  });
});

describe("solveIdealGasLaw", () => {
  it("solves for n given P, V, T", () => {
    // 2.50 atm, 5.00 L, 298 K → n ≈ 0.511 mol
    const s = solveIdealGasLaw({ P: 2.5, V: 5, T: 298 }, "n");
    expect(s.value).toBeCloseTo((2.5 * 5) / (R_L_ATM * 298), 4);
    expect(s.value).toBeCloseTo(0.5111, 3);
    expect(s.unit).toBe("mol");
  });

  it("solves for V given P, n, T", () => {
    // 1 mol at 1 atm, 273.15 K → 22.414 L (molar volume at STP)
    const s = solveIdealGasLaw({ P: 1, n: 1, T: 273.15 }, "V");
    expect(s.value).toBeCloseTo(22.414, 2);
  });

  it("solves for P given V, n, T", () => {
    const s = solveIdealGasLaw({ V: 10, n: 0.5, T: 300 }, "P");
    expect(s.value).toBeCloseTo((0.5 * R_L_ATM * 300) / 10, 5);
  });

  it("solves for T given P, V, n", () => {
    const s = solveIdealGasLaw({ P: 2, V: 5, n: 0.3 }, "T");
    expect(s.value).toBeCloseTo((2 * 5) / (0.3 * R_L_ATM), 3);
    expect(s.unit).toBe("K");
  });

  it("throws when more than one variable is missing", () => {
    expect(() => solveIdealGasLaw({ P: 1 }, "V")).toThrow();
  });
});

describe("parseIdealGasQuestion", () => {
  it("extracts P, V, T and asks for moles", () => {
    const q = "How many moles of gas are in a 5.00 L container at 2.50 atm and 298 K?";
    const { knowns, askedFor } = parseIdealGasQuestion(q);
    expect(knowns.P).toBeCloseTo(2.5, 4);
    expect(knowns.V).toBeCloseTo(5, 4);
    expect(knowns.T).toBeCloseTo(298, 2);
    expect(askedFor).toBe("n");
  });

  it("converts Celsius to Kelvin", () => {
    const q = "Find the volume of 0.50 mol of gas at 1.00 atm and 25°C.";
    const { knowns, askedFor } = parseIdealGasQuestion(q);
    expect(knowns.T).toBeCloseTo(298.15, 2);
    expect(knowns.n).toBeCloseTo(0.5, 4);
    expect(askedFor).toBe("V");
  });

  it("converts kPa to atm", () => {
    const { knowns } = parseIdealGasQuestion("A gas at 202.65 kPa and 300 K in 2 L.");
    expect(knowns.P).toBeCloseTo(2, 3);
  });

  it("end-to-end: parses and solves the STP moles question correctly", () => {
    const q = "How many moles of gas occupy 5.00 L at 2.50 atm and 298 K?";
    const { knowns, askedFor } = parseIdealGasQuestion(q);
    const s = solveIdealGasLaw(knowns, askedFor!);
    expect(s.value).toBeCloseTo(0.5111, 3);
  });
});
