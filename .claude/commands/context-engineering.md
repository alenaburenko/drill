---
description: Optimize agent context setup — audit CLAUDE.md, review project context health, and apply context engineering patterns
---

Invoke the agent-skills:context-engineering skill.

Audit and improve the current project's context setup:

1. **Check CLAUDE.md exists and is current** — does it cover tech stack, commands, conventions, boundaries, and patterns?
2. **Check project structure is documented** — key directories and files listed
3. **Check SPEC.md or equivalent** — objectives, architecture, entities documented
4. **Check for stale context** — does the agent have outdated assumptions?
5. **Apply the Context Hierarchy** from the SKILL.md if improvements are needed

Output a structured report:
```markdown
## Context Engineering Report

### ✅ What's Working
- [item]

### 🔧 Improvements Applied
- [item]

### 📋 Recommendations
- [item]
```
