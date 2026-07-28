// Central mapping from atomic number → element image source.
// Real photos are served from images-of-elements.com; synthetic elements
// with no real specimen use a shared silvery-metal placeholder photo.
// A conceptual/particle-physics visual is served for the theoretically-gaseous
// oganesson so users know it is a *conceptual* rendering, not a real photo.

import silveryMetalSample from "@/assets/silvery-metal-sample.jpg";

export type ImageKind = "real-photo" | "silvery-placeholder" | "conceptual";

export interface ElementImageInfo {
  atomicNumber: number;
  name: string;
  primary: string;
  fallbacks: string[];
  kind: ImageKind;
  /** Short human explanation for the tooltip / caption. */
  note: string;
}

// Canonical element names, indexed by atomic number (1-118).
// Uses IUPAC "aluminium" and "sulfur" spellings the source CDN uses.
export const elementNames: Record<number, string> = {
  1:"Hydrogen",2:"Helium",3:"Lithium",4:"Beryllium",5:"Boron",6:"Carbon",7:"Nitrogen",
  8:"Oxygen",9:"Fluorine",10:"Neon",11:"Sodium",12:"Magnesium",13:"Aluminium",14:"Silicon",
  15:"Phosphorus",16:"Sulfur",17:"Chlorine",18:"Argon",19:"Potassium",20:"Calcium",
  21:"Scandium",22:"Titanium",23:"Vanadium",24:"Chromium",25:"Manganese",26:"Iron",
  27:"Cobalt",28:"Nickel",29:"Copper",30:"Zinc",31:"Gallium",32:"Germanium",33:"Arsenic",
  34:"Selenium",35:"Bromine",36:"Krypton",37:"Rubidium",38:"Strontium",39:"Yttrium",
  40:"Zirconium",41:"Niobium",42:"Molybdenum",43:"Technetium",44:"Ruthenium",45:"Rhodium",
  46:"Palladium",47:"Silver",48:"Cadmium",49:"Indium",50:"Tin",51:"Antimony",52:"Tellurium",
  53:"Iodine",54:"Xenon",55:"Cesium",56:"Barium",57:"Lanthanum",58:"Cerium",
  59:"Praseodymium",60:"Neodymium",61:"Promethium",62:"Samarium",63:"Europium",
  64:"Gadolinium",65:"Terbium",66:"Dysprosium",67:"Holmium",68:"Erbium",69:"Thulium",
  70:"Ytterbium",71:"Lutetium",72:"Hafnium",73:"Tantalum",74:"Tungsten",75:"Rhenium",
  76:"Osmium",77:"Iridium",78:"Platinum",79:"Gold",80:"Mercury",81:"Thallium",82:"Lead",
  83:"Bismuth",84:"Polonium",85:"Astatine",86:"Radon",87:"Francium",88:"Radium",
  89:"Actinium",90:"Thorium",91:"Protactinium",92:"Uranium",93:"Neptunium",94:"Plutonium",
  95:"Americium",96:"Curium",97:"Berkelium",98:"Californium",99:"Einsteinium",100:"Fermium",
  101:"Mendelevium",102:"Nobelium",103:"Lawrencium",104:"Rutherfordium",105:"Dubnium",
  106:"Seaborgium",107:"Bohrium",108:"Hassium",109:"Meitnerium",110:"Darmstadtium",
  111:"Roentgenium",112:"Copernicium",113:"Nihonium",114:"Flerovium",115:"Moscovium",
  116:"Livermorium",117:"Tennessine",118:"Oganesson",
};

// Synthetic / never-photographed elements — use silvery-metal placeholder
const SILVERY_SET = new Set<number>([
  99, 100, // Einsteinium, Fermium — real but only ever a few atoms
  101, 102, 103, // Md, No, Lr
  104, 105, 106, 107, 108, 109,
  110, 111, 112, 113, 114, 115, 116, 117,
]);

// Elements the source CDN keeps under the /s/ (sample) subdirectory —
// tried after the top-level URL fails.
function realPhotoUrl(name: string): string {
  return `https://images-of-elements.com/${name.toLowerCase()}.jpg`;
}
function sampleFallbackUrl(name: string): string {
  return `https://images-of-elements.com/s/${name.toLowerCase()}.jpg`;
}

export function getElementImage(atomicNumber: number): ElementImageInfo {
  const name = elementNames[atomicNumber];
  if (!name) {
    return {
      atomicNumber,
      name: `Element ${atomicNumber}`,
      primary: silveryMetalSample,
      fallbacks: [],
      kind: "silvery-placeholder",
      note: "No image mapping available for this atomic number.",
    };
  }

  if (atomicNumber === 118) {
    // Oganesson: predicted gas, no macroscopic specimen ever produced.
    return {
      atomicNumber,
      name,
      primary: silveryMetalSample,
      fallbacks: [],
      kind: "conceptual",
      note:
        "Conceptual visual — oganesson has only been produced as a few atoms; no real photograph exists.",
    };
  }

  if (SILVERY_SET.has(atomicNumber)) {
    return {
      atomicNumber,
      name,
      primary: silveryMetalSample,
      fallbacks: [],
      kind: "silvery-placeholder",
      note:
        "Silvery-metal reference sample — this synthetic element has never been produced in macroscopic amounts, so its predicted metallic appearance is shown.",
    };
  }

  return {
    atomicNumber,
    name,
    primary: realPhotoUrl(name),
    fallbacks: [sampleFallbackUrl(name), silveryMetalSample],
    kind: "real-photo",
    note: "Real photograph of an elemental sample.",
  };
}

/**
 * Verify that every atomic number 1–118 maps to an image source.
 * Returns a list of missing atomic numbers (empty when the mapping is complete).
 * Used by tests AND by the runtime dev warning inside <ElementImage />.
 */
export function verifyElementImageCoverage(): { missing: number[]; ok: boolean } {
  const missing: number[] = [];
  for (let z = 1; z <= 118; z++) {
    const info = getElementImage(z);
    if (!info.primary || !elementNames[z]) missing.push(z);
  }
  return { missing, ok: missing.length === 0 };
}
