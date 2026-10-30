export function parseHighlightedLines(meta = '') {
  const match = meta.match(/\{([\d,\s-]+)\}/);
  if (!match) return new Set();
  const lines = new Set();
  for (const segment of match[1].split(',')) {
    const range = segment.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!range) throw new Error(`Rango de líneas inválido: ${segment}`);
    const first = Number(range[1]), last = Number(range[2] || first);
    if (first < 1 || last < first || last > 10000) throw new Error(`Rango de líneas inválido: ${segment}`);
    for (let line = first; line <= last; line++) lines.add(line);
  }
  return lines;
}

export const lineHighlight = {
  name: 'bitacora-line-highlight',
  line(node, number) {
    if (parseHighlightedLines(this.options.meta?.__raw).has(number)) {
      this.addClassToHast(node, 'highlighted');
    }
  },
};
