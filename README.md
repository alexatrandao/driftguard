# DriftGuard

**AI-powered architectural compliance that speaks your language**

DriftGuard enforces architectural rules written in plain English—no DSLs, no translation friction, just Bob understanding your intent and keeping your codebase aligned.

---

## The Problem: Architectural Drift

Every codebase starts with architectural intent. It's documented in ADRs, design docs, or team wikis. Within months, it's violated—not maliciously, but because **enforcement doesn't exist**.

Existing tools try to help:
- **ArchUnit** (Java), **dependency-cruiser** (JS), **NetArchTest** (.NET)
- They require translating human-readable rules into domain-specific languages
- That translation creates friction, goes stale, and is rarely done by the architect who wrote the original intent

**The gap**: Architects think in English. Tools demand code. The translation layer is where architectural intent dies.

---

## The Solution: English as the Enforcement Layer

DriftGuard removes the translation step entirely.

1. **Write rules once** in `ARCHITECTURE.md` using plain English
2. **Bob enforces them** using full repo context and intent understanding
3. **No DSL friction** between architectural thinking and enforcement

This works because Bob's core strengths—understanding intent and maintaining full codebase context—are exactly what English-rule enforcement requires.

---

## Three Custom Modes

### 1. DriftGuard Reviewer (Read-Only Analysis)

Scans your codebase and produces structured violation reports.

**What it does:**
- Reads `ARCHITECTURE.md` to understand your rules
- Analyzes source files for violations
- Cites rules verbatim with file:line references
- Respects exception clauses
- Assigns severity levels (Critical/High/Medium/Low)
- Suggests concrete fixes

**Use it for:**
- Pre-commit checks
- Architecture reviews
- Onboarding new team members
- Compliance audits

**Command:** `/driftguard [directory]`

### 2. DriftGuard Refactor (Surgical Fixes)

Applies precise fixes to violations with explicit approval at each step.

**What it does:**
- Reads violation reports from Reviewer mode
- Prepares minimal, surgical fixes
- Shows diffs before every change
- Waits for your approval
- Tracks test impact
- Generates fix summary

**Use it for:**
- Fixing violations incrementally
- Refactoring legacy code to compliance
- Learning how to fix architectural issues
- Maintaining audit trails of changes

**Command:** `/driftguard-fix [report-file]`

### 3. DriftGuard Suggest-Rules (Knowledge Extraction) ⭐

**This is the differentiator.** Analyzes your codebase and proposes new rules based on patterns it observes.

**What it does:**
- Discovers undocumented architectural patterns
- Requires 3+ consistent examples before suggesting a rule
- Provides evidence with file:line references
- Assigns confidence levels (High/Medium/Low)
- Suggests rationale and exception clauses
- Focuses on architecture, not style

**Use it for:**
- Extracting tribal knowledge from legacy codebases
- Documenting emerging patterns in new projects
- Identifying inconsistencies to address
- Evolving your architectural rules over time

**Command:** `/driftguard-suggest [directory]`

**Why this matters:** Most tools enforce rules you write. DriftGuard also **discovers** rules you haven't written yet, turning implicit architectural decisions into explicit, enforceable standards.

---

## Why Bob Specifically?

DriftGuard is built on IBM Bob because Bob's architecture makes English-rule enforcement uniquely effective:

### 1. Full Repository Context
Bob maintains awareness of the entire codebase, not just individual files. This is essential for architectural rules that span multiple modules (layering violations, circular dependencies, cross-cutting concerns).

### 2. Intent Understanding
Bob understands the *why* behind code, not just the *what*. When a rule says "Controllers must not call repositories directly," Bob understands the architectural intent (separation of concerns) and can identify violations even when they're not syntactically obvious.

### 3. Natural Language Processing
Bob is designed to work with human language. Rules written in English are Bob's native input format—no translation layer needed.

### 4. Custom Modes
Bob's mode system allows DriftGuard to have specialized behaviors (read-only analysis, surgical refactoring, pattern discovery) while maintaining consistent context and understanding.

### 5. Tool Integration
Bob's tool ecosystem (file reading, searching, diffing) provides the precise capabilities needed for architectural analysis without requiring custom infrastructure.

**The insight:** Architectural compliance isn't a code generation problem—it's a code *understanding* problem. Bob is built for understanding.

---

## Project Structure

```
driftguard/
├── .bob/
│   ├── modes/                    # Three custom Bob modes
│   │   ├── driftguard-reviewer.md
│   │   ├── driftguard-refactor.md
│   │   └── driftguard-suggest.md
│   └── commands/                 # Slash command wrappers
│       ├── driftguard.md
│       ├── driftguard-fix.md
│       └── driftguard-suggest.md
├── demo-target/                  # Example TypeScript service
│   ├── ARCHITECTURE.md           # Rules in plain English
│   └── src/                      # Code with intentional violations
├── examples/                     # Sample outputs from each mode
│   ├── reviewer-output.md
│   ├── refactor-session.md
│   └── suggested-rules.md
├── bob_sessions/                 # Exported task histories (hackathon requirement)
└── docs/
    └── demo-script.md            # 3-minute walkthrough
```

---

## Getting Started

### Prerequisites
- IBM Bob IDE
- A codebase with (or without) an `ARCHITECTURE.md` file

### Quick Start

1. **Create your rules** (or use the demo):
   ```bash
   # Use the demo target
   cd demo-target
   cat ARCHITECTURE.md
   ```

2. **Run a review**:
   ```
   /driftguard demo-target/
   ```

3. **Fix violations**:
   ```
   /driftguard-fix
   ```

4. **Discover patterns**:
   ```
   /driftguard-suggest demo-target/
   ```

### Rule Format

Every rule in `ARCHITECTURE.md` has three parts:

```markdown
## Rule X.Y: [Title]

**Rule**: [Clear, actionable statement]

**Rationale**: [Why this rule exists, what problems it prevents]

**Exceptions**: [When this rule doesn't apply, with documentation requirements]
```

---

## Use Cases

### For Architects
- Document architectural decisions in plain English
- Enforce rules without writing DSL code
- Discover undocumented patterns in existing codebases
- Evolve rules as architecture matures

### For Teams
- Onboard new developers with clear, enforced rules
- Prevent architectural drift during rapid development
- Maintain consistency across microservices
- Refactor legacy code incrementally

### For Code Reviews
- Automate architectural compliance checks
- Focus human review on business logic
- Provide concrete fix suggestions
- Track compliance over time

---

## Hackathon Submission

**Built for:** IBM Bob Dev Day Hackathon  
**Category:** Custom Modes & Commands  
**Innovation:** English-rule enforcement + pattern discovery (meta-capability)

### Judging Criteria Alignment

1. **Completeness & Feasibility** ✓
   - Three fully-functional modes with clear use cases
   - Demo target with real violations
   - Comprehensive documentation

2. **Creativity & Innovation** ⭐
   - Suggest-Rules mode: discovers rules you haven't written
   - Removes DSL translation friction entirely
   - Turns Bob into an architectural knowledge extractor

3. **Design & Usability** ✓
   - Simple slash commands (`/driftguard`, `/driftguard-fix`, `/driftguard-suggest`)
   - Rules written in plain English
   - Clear, structured outputs

4. **Effectiveness & Efficiency** ✓
   - Addresses real problem: architectural drift
   - Scales to any codebase size
   - Works with any programming language Bob understands

---

## Technical Details

### Mode Behaviors

**Reviewer Mode:**
- Read-only (never modifies code)
- Cites rules verbatim from ARCHITECTURE.md
- Respects exception clauses
- Provides actionable fix suggestions

**Refactor Mode:**
- Surgical precision (minimal changes only)
- Shows diffs before every modification
- Requires explicit approval
- Tracks test impact

**Suggest-Rules Mode:**
- Evidence-based (3+ examples required)
- Confidence scoring (High/Medium/Low)
- Architectural focus (not style)
- Non-invasive (never modifies files)

### Supported Languages

DriftGuard works with any language Bob understands:
- TypeScript/JavaScript (demo target)
- Python, Java, C#, Go, Rust, etc.
- Rules are language-agnostic

---

## Future Enhancements

- **CI/CD Integration**: GitHub Actions for automated reviews
- **Compliance Dashboards**: Track drift over time
- **Rule Templates**: Common architectural patterns as starting points
- **Multi-repo Analysis**: Enforce consistency across microservices
- **Rule Versioning**: Track how rules evolve

---

## License

MIT License - See LICENSE file for details

---

## Contact

Built by DriftGuard for IBM Bob Dev Day Hackathon 2024

**Repository:** [GitHub URL](https://github.com/alexatrandao/driftguard)  
**Demo Video:** [YouTube URL](https://www.youtube.com/watch?v=444NO2XGGrk)

---

## Acknowledgments

- IBM Bob team for creating an AI assistant that truly understands code
- The architectural compliance community for identifying the DSL friction problem
- All the architects who've written rules that were never enforced

---

**DriftGuard: Because architectural intent shouldn't require translation.**
