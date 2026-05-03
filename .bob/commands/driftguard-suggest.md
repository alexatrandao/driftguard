# /driftguard-suggest Command

Runs DriftGuard Suggest-Rules mode to discover undocumented architectural patterns.

## Description

This command switches to DriftGuard Suggest-Rules mode and analyzes your codebase to identify consistent architectural patterns that are followed in practice but not documented in ARCHITECTURE.md. This is the meta-capability that turns DriftGuard from a rule enforcer into a knowledge extractor.

## Usage

```
/driftguard-suggest [directory] [options]
```

**Parameters:**
- `directory` (optional): Path to analyze. Defaults to current workspace directory.
- `options` (optional): Analysis focus (e.g., "focus on error handling", "quick analysis")

## Examples

```
/driftguard-suggest
```
Analyzes the entire workspace for undocumented patterns.

```
/driftguard-suggest demo-target/
```
Analyzes only the demo-target directory.

```
/driftguard-suggest src/ focus on layering
```
Analyzes src/ with focus on layering patterns.

```
/driftguard-suggest quick analysis
```
Performs faster analysis with fewer files examined.

## What It Does

1. Switches to DriftGuard Suggest-Rules mode
2. Reads ARCHITECTURE.md (if exists) to understand documented rules
3. Scans codebase structure to map layers and modules
4. Detects consistent patterns across multiple files:
   - Layering and dependency patterns
   - Error handling conventions
   - Response formatting standards
   - Data sanitization practices
   - External communication patterns
   - Configuration and secrets management
   - Logging and observability
   - Validation patterns
   - Authentication/authorization
5. Collects evidence (3+ examples) for each pattern
6. Formulates candidate rules with rationale and exceptions
7. Generates a comprehensive report with confidence levels

## Output

Produces a markdown report showing:
- **High Confidence Rules**: 5+ consistent examples, ready to document
- **Medium Confidence Rules**: 3-4 examples with some variations
- **Low Confidence Rules**: Emerging patterns to monitor
- **Evidence**: File:line references for each pattern
- **Rationale**: Why the pattern exists and its benefits
- **Exception Clauses**: When the rule might not apply
- **Recommendations**: Which rules to document immediately

## Confidence Levels

- **High**: 5+ consistent examples, zero counter-examples → Document immediately
- **Medium**: 3-4 examples, 1-2 variations → Consider documenting after review
- **Low**: 3 examples but significant variation → Monitor for consistency

## Mode Details

This command uses the **DriftGuard Suggest-Rules** mode, which:
- Is read-only (never modifies code or ARCHITECTURE.md)
- Requires 3+ consistent examples before suggesting a rule
- Focuses on architectural patterns, not style preferences
- Provides specific evidence with file:line references
- Assigns confidence levels based on consistency
- Suggests rationale and exception clauses for each rule

## Pattern Categories Analyzed

- **Layering**: How modules interact across architectural layers
- **Error Handling**: How errors are caught, logged, and returned
- **Response Formatting**: API response structure and conventions
- **Data Sanitization**: How sensitive data is removed from responses
- **HTTP Communication**: External API call patterns and client usage
- **Configuration**: Environment variable and secrets management
- **Logging**: Logging library usage and conventions
- **Validation**: Input validation patterns and placement
- **Authentication**: Token/session management patterns

## Related Commands

- `/driftguard` - Review code against documented rules
- `/driftguard-fix` - Apply fixes for violations

## Use Cases

1. **New Projects**: Discover emerging patterns to document early
2. **Legacy Codebases**: Extract implicit architectural decisions
3. **Team Onboarding**: Document tribal knowledge
4. **Architecture Reviews**: Identify inconsistencies to address
5. **Rule Evolution**: Find patterns that should become rules

## Notes

- Requires at least 3 consistent examples to suggest a rule
- Focuses on architectural concerns, not code style
- Does not modify ARCHITECTURE.md or any code files
- Analysis is evidence-based with specific file references
- Higher confidence rules are ready for immediate documentation
- Can be run periodically to discover new patterns as code evolves