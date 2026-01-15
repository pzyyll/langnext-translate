# LEXIN PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-13
**Commit:** dabeea5
**Branch:** main

## OVERVIEW

Desktop translation app: Tauri 2 + Nuxt 4 + Rust backend. Hotkey-triggered clipboard translation with multi-provider support (OpenAI, DeepL, Google).

## STRUCTURE

```
lexin-tauri-nuxt/
├── src-renderer/     # Nuxt 4 frontend (Vue 3, Pinia, TailwindCSS/DaisyUI)
├── src-tauri/        # Rust backend (Tauri 2, translation SDKs)
├── scripts/          # Build automation (auto-locales.ts)
├── tests/            # Python notebooks for API testing
├── nuxt.config.ts    # Frontend config (srcDir: src-renderer, port 1234)
└── package.json      # bun/pnpm scripts
```

## WHERE TO LOOK

| Task                     | Location                     | Notes                                              |
| ------------------------ | ---------------------------- | -------------------------------------------------- |
| Add translation provider | `src-tauri/src/module/sdk/`  | Create subdir, implement translate trait           |
| Add Tauri command        | `src-tauri/src/cmds/mod.rs`  | Register in `generate_handler![]`                  |
| Frontend page            | `src-renderer/pages/`        | Nuxt file-based routing                            |
| Vue component            | `src-renderer/components/`   | By domain: Base/, Translate/, Home/, Win/          |
| State management         | `src-renderer/stores/`       | Pinia setup stores, persisted via TauriPluginPinia |
| Window management        | `src-tauri/src/windows/`     | home.rs, translate.rs, tray.rs                     |
| Global hotkeys           | `src-tauri/src/lib.rs`       | app_setup() function                               |
| i18n strings             | `src-renderer/i18n/locales/` | en.json, zh.json (default: zh)                     |

## CONVENTIONS

### Frontend (TypeScript/Vue)

- **Formatting**: Tabs, 100 char limit, single quotes, no trailing comma
- **Props**: TypeScript-first `defineProps<{ }>`, object notation only for defaults
- **Models**: `defineModel<T>()` for v-model binding
- **Stores**: Composition API setup stores, immediate persistence
- **Icons**: `icon-*` prefix auto-resolved, custom SVGs via `SvgsIcon`
- **Styling**: DaisyUI with `du-` prefix, themes: bumblebee (light), dracula (dark)

### Backend (Rust)

- **Line width**: 100 chars (rustfmt.toml)
- **Commands**: `#[tauri::command]` in cmds/ or module/, register in mod.rs
- **State**: AppState in core/state.rs, accessible via Tauri's manage()
- **Error handling**: thiserror crate, avoid unwrap() in production paths

### Plugin Load Order

`01.global.ts` -> `02.tauriapi.ts` -> `03.0.pinia.ts` -> `03.translate.ts`

## ANTI-PATTERNS (THIS PROJECT)

| NEVER                                                 | Why                             |
| ----------------------------------------------------- | ------------------------------- |
| Remove `#![windows_subsystem = "windows"]` in main.rs | Shows console window in release |
| Use `unwrap()` in window/clipboard ops                | Causes panics on edge cases     |
| Leave console.log() in production                     | Debug noise in release builds   |
| Use `any` type                                        | Bypasses TypeScript safety      |
| Use `as any`, `@ts-ignore`                            | Hides real type errors          |

## KNOWN ISSUES

- 28+ `unwrap()` calls in Rust need error handling
- Debug console.log() scattered in components (Translate.vue, Dialog.vue, Input.vue)
- `any` types in index.d.ts, plugins, some components
- Plugin architecture incomplete (Dialog.vue:172 TODO)
- No frontend test framework configured

## COMMANDS

```bash
# Development
bun tauri:dev          # Full app dev (Nuxt on :1234 + Tauri)
bun dev                # Nuxt only

# Production
bun tauri:build        # Build desktop app
bun generate           # Static site generation

# Utilities
bun auto:locales       # Generate i18n via OpenAI
cargo test -p lexin    # Rust unit tests
```

## HOTKEYS (Runtime)

| Key              | Action                                   |
| ---------------- | ---------------------------------------- |
| Ctrl+C (global)  | Capture clipboard, open translate window |
| Alt (double-tap) | Translation menu                         |
| Alt+L            | Debug lab (dev mode only)                |

## NOTES

- No CI/CD pipeline configured
- Uses git dependencies: mdict-analysis-rs, kmhook-rs
- Windows-specific: Win32 API for UI automation, monitor detection
- macOS: Private API enabled for tray icon templating
