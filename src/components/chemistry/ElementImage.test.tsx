import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ElementImage } from "./ElementImage";
import { elementNames, getElementImage } from "@/lib/elementImages";

describe("<ElementImage />", () => {
  it("renders the correct image src for every atomic number 1–118", () => {
    for (let z = 1; z <= 118; z++) {
      const { unmount } = render(<ElementImage atomicNumber={z} />);
      const img = screen.getByRole("img") as HTMLImageElement;
      const expected = getElementImage(z).primary;
      // jsdom resolves relative asset paths — check by suffix or full url
      if (expected.startsWith("http")) {
        expect(img.src).toBe(expected);
      } else {
        expect(img.src).toContain(expected.replace(/^\//, "").split("/").pop()!);
      }
      expect(img.getAttribute("loading")).toBe("lazy");
      expect(img.getAttribute("alt")).toContain(elementNames[z]);
      unmount();
    }
  });

  it("shows a 'Real photograph' label for stable elements", () => {
    render(<ElementImage atomicNumber={26} />); // Iron
    expect(screen.getByText(/Real photograph/i)).toBeInTheDocument();
  });

  it("shows a 'Reference sample' label for synthetic elements 104–109", () => {
    for (let z = 104; z <= 109; z++) {
      const { unmount } = render(<ElementImage atomicNumber={z} />);
      expect(screen.getAllByText(/Reference sample/i).length).toBeGreaterThan(0);
      unmount();
    }
  });

  it("shows a 'Conceptual visual' label for oganesson (118)", () => {
    render(<ElementImage atomicNumber={118} />);
    expect(screen.getAllByText(/Conceptual visual/i).length).toBeGreaterThan(0);
  });
});
