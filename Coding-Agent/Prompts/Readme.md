# Coding-Agent Prompts Index

This directory contains specialized prompts for the Coding Agent framework in VSCode. Each prompt type provides structured workflows for different coding scenarios.

---

## 📊 Prompt Directory Overview

| Prompt Type | Directory | Purpose | Status | Components |
|------------|-----------|---------|--------|------------|
| **Code Implementation** | `/Code-Implementation` | Plan architecture, implement features, debug, and optimize code | ✅ In Progress | • ChatMode-Coding.MD<br>• Coding-Implementation-instructions.MD<br>• 3 Sequential prompts |

---

## 🔧 Standard Framework Structure

Each prompt directory follows this modular pattern:

| Component | Purpose | Token Efficiency |
|-----------|---------|------------------|
| **ChatMode** | Defines tools, workflow phases, and response guidelines | ~300 words |
| **Instructions** | Behavioral constraints, coding standards, output formats | ~200 words |
| **Prompts** | Reusable templates for coding phases (Early/Mid/Late) | Variable |

---

## 🎯 Key Features

| Feature | Code Implementation |
|---------|-------------------|
| Architecture planning | ✅ serena + filesystem |
| Code generation | ✅ serena + filesystem |
| Debugging support | ✅ serena + terminal |
| Testing & validation | ✅ terminal + Github |
| Documentation | ✅ memory + Github |
| Context continuity | ✅ memory across phases |

---

## 📝 Quick Start

1. Navigate to desired prompt directory
2. Review ChatMode configuration for available tools
3. Check Instructions for coding standards
4. Use prompt templates or create custom queries
5. Progress through Early → Mid → Late phases with context flow
