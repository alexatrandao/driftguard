# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Overview
DriftGuard is a Bob-based architectural compliance system with three custom modes that operate on ARCHITECTURE.md files.

## Key Conventions
- **ARCHITECTURE.md is the source of truth** for architectural rules in demo-target/
- **Rule format**: Every rule must have three parts: Rule statement, Rationale, Exception clause
- **Phase-based development**: Complete one phase fully before moving to next (avoid false starts - 40 Bobcoin budget)
- **bob_sessions/ folder is mandatory** for hackathon submission (exported task histories + screenshots)

## Bob Mode Storage
- Custom modes stored in `.bob/modes/` directory (not `modes/`)
- Slash commands stored in `.bob/commands/` directory (not `commands/`)

## Demo Target
- Language: TypeScript/Node.js (Express-style service)
- Located in `demo-target/` directory
- Deliberately contains violations of its own ARCHITECTURE.md rules for testing

## Development Priorities
1. Suggest-Rules mode is highest-leverage for hackathon scoring
2. Production-quality output required (judges score on completeness and design)
3. No real secrets - use clearly labeled placeholders for API keys