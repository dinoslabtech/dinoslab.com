export type Term = {
  id: string;
  href: string;
  patterns: RegExp[];
};

/** Longer phrases first. Same `id` links at most once per linker instance. */
export const terms: Term[] = [
  { id: "mipi", href: "/blog/mipi-csi-2", patterns: [/MIPI CSI-2/gi, /CSI-2/gi] },
  { id: "hexaspi", href: "/blog/hexaspi", patterns: [/Hexadeca-SPI/gi, /Hexa-SPI/gi, /HexaSPI/gi] },
  { id: "tsn", href: "/blog/ethernet-tsn", patterns: [/Ethernet TSN/gi, /\bTSN\b/g] },
  { id: "canfd", href: "/blog/can-fd", patterns: [/\bFDCAN\b/g, /CAN FD/g] },
  { id: "ttcan", href: "/blog/can-fd#ttcan", patterns: [/\bTTCAN\b/g] },
  { id: "i3c", href: "/blog/i2c-i3c#i3c", patterns: [/\bI3C\b/g] },
  { id: "i2c", href: "/blog/i2c-i3c#i2c", patterns: [/\bI2C\b/g] },
  { id: "otp", href: "/blog/otp", patterns: [/\bOTP\b/g] },
  { id: "bga", href: "/blog/bga", patterns: [/\bVFBGA\d*\b/g, /\bBGA\d*\b/g] },
  { id: "psram", href: "/blog/memory#psram", patterns: [/\bPSRAM\b/g] },
  { id: "sram", href: "/blog/memory#sram", patterns: [/\bSRAM\b/g] },
  { id: "dram", href: "/blog/memory#dram", patterns: [/\bSDRAM\b/g, /\bDRAM\b/g] },
  { id: "nand", href: "/blog/memory#nand", patterns: [/\bNAND\b/g] },
  { id: "nor", href: "/blog/memory#nor", patterns: [/\bNOR\b/g] },
];

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

type Hit = { start: number; end: number; href: string; id: string };

/**
 * Link the first occurrence of each term. Pass the same function around a
 * page so SRAM, CSI-2, and the rest are not underlined on every row.
 */
export function createTermLinker() {
  const used = new Set<string>();

  return function linkTerms(text: string): string {
    const hits: Hit[] = [];

    for (const term of terms) {
      if (used.has(term.id)) continue;
      let best: Hit | undefined;
      for (const pattern of term.patterns) {
        const re = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`);
        const match = re.exec(text);
        if (match && (best === undefined || match.index < best.start)) {
          best = {
            start: match.index,
            end: match.index + match[0].length,
            href: term.href,
            id: term.id,
          };
        }
      }
      if (best) hits.push(best);
    }

    hits.sort((a, b) => a.start - b.start || b.end - a.end);
    const chosen: Hit[] = [];
    let cursor = 0;
    for (const hit of hits) {
      if (hit.start < cursor) continue;
      if (used.has(hit.id)) continue;
      chosen.push(hit);
      used.add(hit.id);
      cursor = hit.end;
    }

    if (chosen.length === 0) return escapeHtml(text);

    let html = "";
    let i = 0;
    for (const hit of chosen) {
      html += escapeHtml(text.slice(i, hit.start));
      html += `<a class="term" href="${hit.href}">${escapeHtml(text.slice(hit.start, hit.end))}</a>`;
      i = hit.end;
    }
    html += escapeHtml(text.slice(i));
    return html;
  };
}
