import { describe, it, expect } from "vitest";
import {
  elementNames,
  getElementImage,
  verifyElementImageCoverage,
} from "./elementImages";

describe("elementImages mapping", () => {
  it("has a name for every atomic number 1–118", () => {
    for (let z = 1; z <= 118; z++) {
      expect(elementNames[z], `missing name for Z=${z}`).toBeTruthy();
    }
  });

  it("returns an image source for every atomic number 1–118", () => {
    for (let z = 1; z <= 118; z++) {
      const info = getElementImage(z);
      expect(info.primary, `missing primary image for Z=${z}`).toBeTruthy();
      expect(info.name).toBe(elementNames[z]);
    }
  });

  it("verifyElementImageCoverage reports full coverage", () => {
    const { ok, missing } = verifyElementImageCoverage();
    expect(missing).toEqual([]);
    expect(ok).toBe(true);
  });

  it("maps synthetic superheavy elements 104–109 to the silvery-metal placeholder", () => {
    for (let z = 104; z <= 109; z++) {
      const info = getElementImage(z);
      expect(info.kind).toBe("silvery-placeholder");
      expect(info.primary).toMatch(/silvery-metal-sample/);
    }
  });

  it("uses a real photograph URL for common stable elements", () => {
    for (const z of [1, 6, 8, 13, 26, 47, 79]) {
      const info = getElementImage(z);
      expect(info.kind).toBe("real-photo");
      expect(info.primary).toMatch(/^https:\/\/images-of-elements\.com\//);
      expect(info.fallbacks.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("uses the IUPAC 'aluminium' spelling required by the CDN for Z=13", () => {
    expect(getElementImage(13).primary).toContain("aluminium");
  });

  it("marks oganesson (118) as a conceptual visual", () => {
    expect(getElementImage(118).kind).toBe("conceptual");
  });
});
