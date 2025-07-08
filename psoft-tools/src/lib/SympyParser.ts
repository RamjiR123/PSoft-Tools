// frontend/src/lib/SympyParser.ts
// Parser for translating Java-style preconditions and statements into SymPy-ready input
export default function sympyParser(input: string) {
  console.log(`SympyParser input: ${input}`);

  // Extract precondition and statement
  const match = input.match(/^\s*\{([^}]*)\}\s*(.*)$/s);
  if (!match) {
    throw new Error("Invalid input format: expected '{precondition} statement'");
  }
  let pre = match[1].trim();
  let stmt = match[2].trim();

  // Enforce Java statement syntax (must end with ';')
  if (!stmt.endsWith(";")) {
    throw new Error("Statement must be a Java statement ending with ';'");
  }
  // Remove trailing semicolon
  stmt = stmt.slice(0, -1).trim();

  // Translate Java logical operators to SymPy bitwise operators
  pre = pre
    .replace(/&&/g, '&')
    .replace(/\|\|/g, '|')
    .replace(/!\s*/g, '~');

  // Wrap each relational expression in parentheses for correct parsing
  // Split tokens by '&' or '|' while keeping the delimiters
  const tokens = pre.split(/([&|])/);
  pre = tokens
    .map((tok) => {
      tok = tok.trim();
      if (tok === '&' || tok === '|') return ` ${tok} `;
      return `(${tok})`;
    })
    .join('');

  return { pre, stmt };
}
