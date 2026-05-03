# /driftguard-fix Command

Runs DriftGuard Refactor mode to apply fixes for architectural violations.

## Description

This command switches to DriftGuard Refactor mode and applies surgical fixes to code violations identified in a DriftGuard review report. Each fix is shown as a diff and requires explicit user approval before being applied.

## Usage

```
/driftguard-fix [report-file] [options]
```

**Parameters:**
- `report-file` (optional): Path to a DriftGuard violation report. If omitted, uses the most recent report from the current session.
- `options` (optional): Specific violations to fix (e.g., "violation 1 and 3")

## Examples

```
/driftguard-fix
```
Fixes all violations from the most recent report in the current session.

```
/driftguard-fix reports/violations-2024-05-03.md
```
Fixes violations from a specific report file.

```
/driftguard-fix violation 1 and 3
```
Fixes only violations 1 and 3 from the most recent report.

```
/driftguard-fix reports/violations.md violation 2
```
Fixes only violation 2 from the specified report.

## What It Does

1. Switches to DriftGuard Refactor mode
2. Reads the violation report to understand what needs fixing
3. Reads ARCHITECTURE.md to understand the rules being violated
4. For each violation to fix:
   - Reads the affected source file(s)
   - Prepares a surgical fix (minimal changes only)
   - Shows the diff with clear explanation
   - Waits for your approval
   - Applies the fix if approved
5. Generates a fix summary with:
   - List of fixes applied
   - List of fixes skipped (if any)
   - Test recommendations
   - Next steps

## Approval Workflow

After each diff is shown:
- **Approve**: Type "yes", "apply", or "ok" to apply the fix
- **Decline**: Type "no" or "skip" to skip this fix
- **More Info**: Type "explain" or "show more" for additional context
- **Fix All**: Type "fix all remaining" to auto-approve remaining fixes

## Output

Produces a markdown summary showing:
- Fixes successfully applied
- Fixes skipped (with reasons)
- Files modified
- Tests that should be re-run
- Recommendations for next steps

## Mode Details

This command uses the **DriftGuard Refactor** mode, which:
- Makes only surgical, minimal changes
- Shows diffs before every modification
- Requires explicit approval for each fix
- Never invents fixes beyond addressing the specific rule
- Tracks test impact
- Provides complete fix summary

## Fix Patterns

The mode handles common violation types:
- **Layering violations**: Adds service methods, updates imports
- **HTTP communication**: Replaces direct fetch/axios with centralized client
- **Hardcoded secrets**: Moves to environment variables and config
- **Logging**: Replaces console.log with centralized logger
- **URL configuration**: Moves hardcoded URLs to config

## Related Commands

- `/driftguard` - Generate a violation report to fix
- `/driftguard-suggest` - Discover undocumented patterns

## Notes

- Always shows diffs before applying changes
- Requires explicit approval for each fix
- Maintains existing functionality
- Does not introduce new violations
- Generates test recommendations
- Can be run multiple times on the same report