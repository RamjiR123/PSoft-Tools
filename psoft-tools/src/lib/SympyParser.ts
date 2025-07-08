//parser for translating Java preconditions and statements into sympy
export default function sympyParser(input: string) {
  console.log(`SympyParser input: ${input}`);

  //extract precondition and statement
  const match = input.match(/^\s*\{([^}]*)\}\s*(.*)$/s);
  if (!match) {
    throw new Error("Invalid input format: expected '{precondition} statement'");
  }
  let pre = match[1].trim();
  let stmt = match[2].trim();

  //enforce Java statement syntax
  if (!stmt.endsWith(";")) {
    throw new Error("Statement must be a Java statement ending with ';'");
  }
  //remove semicolon
  stmt = stmt.slice(0, -1).trim();

  //translate Java logical operators to SymPy operators
  pre = pre
    .replace(/&&/g, '&')
    .replace(/\|\|/g, '|')
    .replace(/!\s*/g, '~');

  //wrap each relational expression in parentheses for parsing purposes
  //split tokens by '&' or '|' while keeping the delimiters
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