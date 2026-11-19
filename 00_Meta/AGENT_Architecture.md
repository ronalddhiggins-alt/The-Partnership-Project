# Agent Architecture Reference
*Source: AGENT.md — mirrored across CLAUDE.md, AGENTS.md, GEMINI.md*
*Saved to Partnership Project for reference in building the Media Dashboard tool*

---

## The 3-Layer Architecture

**Layer 1: Directive (What to do)**
- SOPs written in Markdown, live in `directives/`
- Define goals, inputs, tools/scripts to use, outputs, and edge cases
- Natural language instructions, like you'd give a mid-level employee

**Layer 2: Orchestration (Decision making)**
- This is the AI. Job: intelligent routing.
- Read directives, call execution tools in the right order, handle errors, ask for clarification, update directives with learnings
- Glue between intent and execution. Don't try scraping yourself — read `directives/scrape_website.md`, come up with inputs/outputs, then run `execution/scrape_single_site.py`

**Layer 3: Execution (Doing the work)**
- Deterministic Python scripts in `execution/`
- Environment variables, API tokens in `.env`
- Handle API calls, data processing, file operations
- Reliable, testable, fast. Commented well.

**Why this works:** If you do everything yourself, errors compound.
90% accuracy per step = 59% success over 5 steps.
Push complexity into deterministic code. AI focuses on decision-making.

---

## Operating Principles

**1. Check for tools first**
Before writing a script, check `execution/`. Only create new scripts if none exist.

**2. Self-anneal when things break**
- Read error message and stack trace
- Fix the script and test it again
- Update the directive with what you learned
- Example: hit API rate limit → find batch endpoint → rewrite script → test → update directive

**3. Update directives as you learn**
Directives are living documents. When you discover API constraints, better approaches, common errors — update the directive. Don't create or overwrite directives without asking unless explicitly told to.

---

## Self-Annealing Loop

Errors are learning opportunities. When something breaks:
1. Fix it
2. Update the tool
3. Test tool, make sure it works
4. Update directive to include new flow
5. System is now stronger

---

## File Organization

**Directory structure:**
- `.tmp/` — All intermediate files (scraped data, temp exports). Never commit, always regenerated.
- `execution/` — Python scripts (deterministic tools)
- `directives/` — SOPs in Markdown (instruction set)
- `.env` — Environment variables and API keys

**Key principle:** Local files are only for processing. Deliverables live in cloud services where the user can access them. Everything in `.tmp/` can be deleted and regenerated.

---

## Summary

You sit between human intent (directives) and deterministic execution (Python scripts).
Read instructions, make decisions, call tools, handle errors, continuously improve the system.

**Be pragmatic. Be reliable. Self-anneal.**
