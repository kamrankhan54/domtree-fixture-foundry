export type ValidationIssue = { level: "error" | "warn", message: string };

export function validateRows(rows: any[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!rows.length) {
    issues.push({ level: "error", message: "No rows parsed from input." });
    return issues;
  }
  const keys = Object.keys(rows[0] || {});
  if (keys.length === 0) issues.push({ level: "error", message: "Rows have no fields." });

  // Example checks
  const emptyRows = rows.filter(r => !r || Object.keys(r).length === 0).length;
  if (emptyRows) issues.push({ level: "warn", message: `${emptyRows} empty row(s).` });

  return issues;
}
