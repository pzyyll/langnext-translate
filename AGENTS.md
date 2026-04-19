# LEXIN PROJECT KNOWLEDGE BASE

**Generated:** 2026-04-01
**Commit:** 03638e3
**Branch:** main

## OVERVIEW

Desktop translation app: Tauri 2 + Nuxt 4 + Rust backend. Hotkey-triggered clipboard translation with multi-provider support (Google, DeepL, Baidu, ChatGPT/OpenAI). Uses a remote server API (`lexinsvr`) as the translation backend proxy.

## STRUCTURE

```
lexin-tauri-nuxt/
├── design/           # System design document, architecture diagram, UI mockups
├── src-renderer/     # Nuxt 4 frontend (Vue 3, Pinia, TailwindCSS 4 / DaisyUI 5)
├── src-tauri/        # Rust backend (Tauri 2, window mgmt, hotkeys, translation proxy)
├── scripts/          # Build automation (auto-locales.ts)
├── tests/            # Python notebooks for API testing
├── .agents/          # Agent skills (daisyui, reka-ui, tailwindcss, tauri-v2, ...)
├── nuxt.config.ts    # Frontend config (srcDir: src-renderer, port 1234)
└── package.json      # bun/pnpm scripts (packageManager: pnpm@10.28.2)
```

## KEY VERSIONS

| Component    | Version      | Notes                                                              |
| ------------ | ------------ | ------------------------------------------------------------------ |
| Tauri        | 2.x          | With `unstable` feature flag                                       |
| Nuxt         | 4.3.0        | SSR disabled, static generation                                    |
| Vue          | 3.5.27       | Composition API only                                               |
| Pinia        | 3.0.4        | With `@tauri-store/pinia` persistence, `saveStrategy: 'immediate'` |
| TailwindCSS  | 4.x          | Via `@tailwindcss/vite` plugin                                     |
| DaisyUI      | 5.x          | `du-` prefix for components                                        |
| Reka UI      | 2.7.0        | Headless UI primitives via Nuxt module                             |
| Rust edition | 2021         | MSRV 1.80                                                          |
| Node pkg mgr | pnpm 10.28.2 | Also supports bun                                                  |

## WHERE TO LOOK

| Task                     | Location                          | Notes                                                         |
| ------------------------ | --------------------------------- | ------------------------------------------------------------- |
| Add translation provider | `src-tauri/src/module/sdk/`       | Create subdir (deepl/, google/, openai/ exist)                |
| Add Tauri command        | `src-tauri/src/cmds/mod.rs`       | Register in `generate_handler![]` macro                       |
| Frontend page            | `src-renderer/pages/`             | Nuxt file-based routing                                       |
| Vue component            | `src-renderer/components/`        | By domain: Base/, Translate/, Home/, Win/                     |
| State management         | `src-renderer/stores/`            | Pinia setup stores (translate.ts, translate-api.ts, model.ts) |
| Window management        | `src-tauri/src/windows/`          | home.rs, translate.rs, tray.rs                                |
| Global hotkeys           | `src-tauri/src/lib.rs`            | `app_setup()`: uses kmhook-rs engine                          |
| i18n strings             | `src-renderer/i18n/locales/`      | en.json, zh.json (default: zh)                                |
| Type definitions         | `src-renderer/index.d.ts`         | Global `Translate` namespace types                            |
| Plugin type augmentation | `src-renderer/plugins/index.d.ts` | NuxtApp interface ($tauri, $translate, etc.)                  |
| App settings (Rust)      | `src-tauri/src/utils/settings.rs` | Settings struct with API config                               |
| App state (Rust)         | `src-tauri/src/core/state.rs`     | AppState struct (exit_prevent, settings)                      |
| Constants (Rust)         | `src-tauri/src/consts.rs`         | Window labels, shortcut enums, API keys                       |
| Custom icons             | `src-renderer/assets/icons/`      | SVG/PNG: baidu, deepl, google, chatgpt logos                  |
| Capabilities (Tauri)     | `src-tauri/capabilities/`         | default.json, desktop.json permissions                        |

## CONVENTIONS

### Frontend (TypeScript/Vue)

- **Formatting**: Tabs, 100 char limit, single quotes, no trailing comma (`.prettierrc`)
- **Props**: TypeScript-first `defineProps<{ }>`, object notation only for defaults
- **Models**: `defineModel<T>()` for v-model binding
- **Stores**: Composition API setup stores, persisted via `@tauri-store/pinia`
- **Icons**: `icon-*` prefix auto-resolved via unplugin-icons; custom SVGs via `SvgsIcon` or `icon-svgs-*`
- **Styling**: DaisyUI 5 with `du-` prefix, themes: bumblebee (light), dracula (dark)
- **Layouts**: 5 layouts (container, default, main, notstyle, titlebar)

### Backend (Rust)

- **Line width**: 100 chars (`rustfmt.toml`)
- **Commands**: `#[tauri::command]` in cmds/ or module/, register in `register_cmds()`
- **State**: AppState in core/state.rs, accessible via `tauri::State<'_, AppState>`
- **Error handling**: thiserror crate, avoid `unwrap()` in production paths
- **Translation**: Remote API proxy via reqwest, auth with bearer token from settings.json

### Plugin Load Order

`01.global.ts` → `02.tauriapi.ts` → `03.0.pinia.ts` → `03.translate.ts`

### NuxtApp Provides

| Key              | Type            | Source Plugin     | Purpose                                              |
| ---------------- | --------------- | ----------------- | ---------------------------------------------------- |
| `$tauri`         | `Tauri`         | `02.tauriapi.ts`  | Window ops, settings, clipboard                      |
| `$translate`     | `Translate`     | `03.translate.ts` | Translation API invoke wrappers                      |
| `$media`         | `Media`         | `01.global.ts`    | Responsive breakpoint queries                        |
| `$translateType` | `TranslateType` | `01.global.ts`    | Provider definitions (google, deepl, baidu, chatgpt) |
| `$rootFontSize`  | `number`        | `01.global.ts`    | Root element font size                               |

### Tauri Commands (IPC)

See `src-tauri/src/AGENTS.md` for full command list. Key: `translate_text`, `translate_speech`, `translate_img2text`, `get_settings`, `open_translate_window`, `set_pin`, `resize_window_height`.

### Frontend Pages

See `src-renderer/AGENTS.md` for full page list. Key routes: `/home` (main), `/translate` (popup), `/home/services`, `/home/models`.

### Translate Components

See `src-renderer/AGENTS.md` for full component list. Key: Input.vue, Output.vue, OutputTabs.vue, LangSelect.vue, TypeSelect.vue.

### Data Flow

**Clipboard → Translation (CPCP):**

1. Double Ctrl+C → kmhook callback → `try_show_on_cpcp()`
2. Rust reads clipboard → emits `"cpcp"` event to translate window
3. Frontend `$tauri.listen_event("cpcp")` → `store.sourceInputFromClipboard`
4. Input.vue watches → `store.setSourceInput()` → Output.vue triggers translation

**Translation Pipeline:**

1. Input.vue `watchDebounced(model, 500ms)` → `store.setSourceInput(text)`
2. Output.vue watches `sourceInput` → `$translate.translate_text({apiType, from, to, text})`
3. `invoke("translate_text")` → Rust POST to `lexinsvr/api/translate/text` (bearer auth)
4. Response → `store.setTabShowText(apiType, text)` → Markdown render

**Multi-Provider:** OutputTabs.vue renders one Output.vue per selected provider; each translates independently.

**Window Auto-Close:** Translate window registers kmhook mouse listener; click/move outside → hide (unless pinned).

## ANTI-PATTERNS (THIS PROJECT)

| NEVER                                                 | Why                             |
| ----------------------------------------------------- | ------------------------------- |
| Remove `#![windows_subsystem = "windows"]` in main.rs | Shows console window in release |
| Use `unwrap()` in window/clipboard ops                | Causes panics on edge cases     |
| Leave `console.log()` in production                   | Debug noise in release builds   |
| Use `any` type                                        | Bypasses TypeScript safety      |
| Use `as any`, `@ts-ignore`                            | Hides real type errors          |
| Use Options API                                       | Project uses Composition API    |
| Skip `storeToRefs()`                                  | Loses reactivity on destructure |
| Hardcode user-facing strings                          | Use `$t('key')` for i18n        |
| Use raw Tailwind for DaisyUI components               | Breaks theme consistency        |

## KNOWN ISSUES

- `unwrap()` calls in Rust need error handling (cmds/mod.rs:40-47 × 5 calls, module/translate.rs:45-46)
- `any` types in index.d.ts (`Channel.api_config`, `TranslateTypeInfo.icon`), plugins/index.d.ts
- `modules/` directory exists but is empty (incomplete module architecture)
- `composables/` directory exists but is empty
- `src-renderer/archive/` directory exists (may contain deprecated code)
- Home sub-pages `backup.vue`, `quick-input.vue`, `settings.vue` are placeholder stubs
- Possible dead IPC: `test_cmd`, `open_window` never invoked from frontend; `translate_languages` may be unused

## COMMANDS

```bash
# Development
bun tauri:dev          # Full app dev (Nuxt on :1234 + Tauri, uses tauri-dev.conf.json)
bun dev                # Nuxt only

# Production
bun tauri:build        # Build desktop app (uses pnpm generate for frontend)
bun generate           # Static site generation

# Utilities
bun auto:locales       # Generate i18n translations via OpenAI
cargo test -p lexin    # Rust unit tests
```

## HOTKEYS (Runtime)

| Key         | Action                                          |
| ----------- | ----------------------------------------------- |
| Ctrl+C (×2) | Capture clipboard, open translate window (cpcp) |
| Alt (×2)    | Show translate window (double-tap)              |
| Alt+L       | Open debug lab window (dev mode only)           |

## TAURI PLUGINS (Registered in lib.rs)

See `src-tauri/src/AGENTS.md` for full plugin list. Key: tauri-plugin-pinia (state persistence), tauri-plugin-clipboard-manager, tauri-plugin-decorum, tauri-plugin-log, plugin::single_instance.

## GIT DEPENDENCIES

| Crate            | Repo                              | Purpose                       |
| ---------------- | --------------------------------- | ----------------------------- |
| `mdict_analysis` | `pzyyll/mdict-analysis-rs` (main) | MDict dictionary file parsing |
| `kmhook`         | `pzyyll/kmhook-rs` (main)         | Global keyboard/mouse hooks   |

## NOTES

- No CI/CD pipeline configured
- Windows-specific: Win32 API for UI automation, monitor work area detection
- macOS: Platform config in `tauri.macos.conf.json` (private API for tray icon)
- Windows: Platform config in `tauri.windows.conf.json`
- No frontend test framework configured
- Translation uses remote server API at URL from `settings.json` (key: `lexinsvr`)
- Settings stored in `$APPDATA/settings.json`, keyed by `lexinsvr` for API endpoint + token
