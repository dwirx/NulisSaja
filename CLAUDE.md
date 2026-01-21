# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Nulisaja** ("Just Write" in Indonesian) is an Obsidian community plugin for quick note creation with automatic templates and folder organization. It provides a Quick Menu UI for creating different note types (Daily, Knowledge, Ide, Notes) with customizable templates and multi-language support (Indonesian/English).

## Build Commands

```bash
npm install          # Install dependencies
npm run dev          # Watch mode for development
npm run build        # Type-check and production build
npx eslint src/      # Lint source files
```

Helper scripts:
- `./dev.sh dev|build|clean|install|lint` - Development tasks
- `./test.sh test` - Run comprehensive tests (build, file checks, UI verification)

## Architecture

### Entry Point Pattern
Keep `src/main.ts` minimal - lifecycle only. All feature logic delegates to modules:

```
src/
  main.ts              # Plugin lifecycle (onload/onunload), registers commands
  types.ts             # All TypeScript interfaces (NoteType, Settings, etc.)
  settings.ts          # Settings persistence (loadSettings/saveSettings)
  settingsTab.ts       # Settings UI panel
  styles.ts            # Dynamic CSS injection (injectStyles/removeStyles)
  commands/
    noteDefinitions.ts # Note type definitions (icons, labels, prompts)
    noteRunner.ts      # Executes note creation actions
    registerCommands.ts # Registers Obsidian commands
  services/
    noteService.ts     # Core logic: template processing, file creation
  ui/
    quickMenu.ts       # Quick menu modal component
    titlePrompt.ts     # Title input modal
  utils/
    date.ts            # Date formatting utilities
```

### Key Patterns

**Adding new note types**: Define in `src/commands/noteDefinitions.ts` using `NoteCommandDefinition` interface. The type must be added to `NoteType` union in `types.ts`.

**Template variables**: Processed by `NoteService` - supports `{{title}}`, `{{date}}`, and date format tokens (YYYY, MM, DD, etc.).

**Settings persistence**: Use `loadSettings(plugin)` / `saveSettings(plugin, settings)` from `settings.ts`.

**Safe cleanup**: Always use `this.registerEvent()`, `this.registerDomEvent()`, or `this.registerInterval()` in main.ts. Styles use `injectStyles()`/`removeStyles()` pattern.

### Mobile Support

Plugin targets both desktop and mobile. UI components in `src/styles.ts` include media queries for mobile responsiveness. Touch targets are 44px+ height.

## Manifest Rules

- `manifest.json` ID is `nulisaja` - never change after release
- Version follows SemVer, must match between `manifest.json` and `versions.json`
- Release artifacts: `main.js`, `manifest.json`, `styles.css`

## Obsidian API Guidelines

- Default to local/offline operation
- No network calls without explicit user opt-in and documentation
- Never execute remote code or access files outside the vault
- Avoid desktop-only APIs unless `isDesktopOnly: true`
