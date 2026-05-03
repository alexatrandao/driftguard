# /driftguard Command

Runs DriftGuard Reviewer mode to analyze code for architectural violations.

## Description

This command switches to DriftGuard Reviewer mode and performs a read-only architectural compliance review of your codebase against rules defined in ARCHITECTURE.md.

## Usage

```
/driftguard [directory]
```

**Parameters:**
- `directory` (optional): Path to analyze. Defaults to current workspace directory.

## Examples

```
/driftguard
```
Reviews the entire workspace for violations.

```
/driftguard demo-target/
```
Reviews only the demo-target directory.

```
/driftguard src/services/
```
Reviews only the services directory.

## What It Does

1. Switches to DriftGuard Reviewer mode
2. Reads ARCHITECTURE.md to understand documented rules
3. Scans all source files in the specified directory
4. Identifies violations of documented architectural rules
5. Generates a structured violation report with:
   - Specific rule violations with file locations
   - Severity levels (Critical/High/Medium/Low)
   - Suggested fixes for each violation
   - Compliance score

## Output

Produces a markdown report showing:
- Total violations found
- Each violation with rule citation, location, and fix suggestion
- Summary of rules with/without violations
- Overall compliance percentage

## Mode Details

This command uses the **DriftGuard Reviewer** mode, which:
- Is read-only (never modifies code)
- Only flags violations of explicitly documented rules
- Cites rules verbatim from ARCHITECTURE.md
- Respects exception clauses in rules
- Provides actionable fix suggestions

## Related Commands

- `/driftguard-fix` - Apply fixes for violations found in a report
- `/driftguard-suggest` - Discover undocumented architectural patterns

## Notes

- Requires ARCHITECTURE.md to exist in the analyzed directory
- Review is non-destructive - no files are modified
- Use the generated report with `/driftguard-fix` to apply corrections