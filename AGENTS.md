# LEXIN PROJECT KNOWLEDGE BASE

**Generated:** 2026-03-14
**Commit:** a04c54d
**Branch:** main

## OVERVIEW

Desktop translation app: Tauri 2 + Nuxt 4 + Rust backend. Hotkey-triggered clipboard translation with multi-provider support (Google, DeepL, Baidu, ChatGPT/OpenAI). Uses a remote server API (`lexinsvr`) as the translation backend proxy.

## STRUCTURE

```
lexin-tauri-nuxt/
├── src-renderer/     # Nuxt 4 frontend (Vue 3, Pinia, TailwindCSS 4 / DaisyUI 5)
├── src-tauri/        # Rust backend (Tauri 2, window mgmt, hotkeys, translation proxy)
├── scripts/          # Build automation (auto-locales.ts)
├── tests/            # Python notebooks for API testing
├── .agents/          # Agent skills (daisyui, reka-ui, tailwindcss, tauri-v2)
├── nuxt.config.ts    # Frontend config (srcDir: src-renderer, port 1234)
└── package.json      # bun/pnpm scripts (packageManager: pnpm@10.28.2)
```

## KEY VERSIONS

| Component    | Version   | Notes                                 |
| ------------ | --------- | ------------------------------------- |
| Tauri        | 2.x       | With `unstable` feature flag          |
| Nuxt         | 4.3.0     | SSR disabled, static generation       |
| Vue          | 3.5.27    | Composition API only                  |
| Pinia        | 3.0.4     | With `@tauri-store/pinia` persistence |
| TailwindCSS  | 4.x       | Via `@tailwindcss/vite` plugin        |
| DaisyUI      | 5.5.17    | `du-` prefix for components           |
| Reka UI      | 2.7.0     | Headless UI primitives via Nuxt module|
| Rust edition | 2021      | MSRV 1.80                             |
| Node pkg mgr | pnpm 10.28.2 | Also supports bun                 |

## WHERE TO LOOK

| Task                     | Location                        | Notes                                            |
| ------------------------ | ------------------------------- | ------------------------------------------------ |
| Add translation provider | `src-tauri/src/module/sdk/`     | Create subdir (deepl/, google/, openai/ exist)   |
| Add Tauri command        | `src-tauri/src/cmds/mod.rs`     | Register in `generate_handler![]` macro          |
| Frontend page            | `src-renderer/pages/`           | Nuxt file-based routing                          |
| Vue component            | `src-renderer/components/`      | By domain: Base/, Translate/, Home/, Win/        |
| State management         | `src-renderer/stores/`          | Pinia setup stores (translate.ts, translate-api.ts)|
| Window management        | `src-tauri/src/windows/`        | home.rs, translate.rs, tray.rs                   |
| Global hotkeys           | `src-tauri/src/lib.rs`          | `app_setup()`: uses kmhook-rs engine             |
| i18n strings             | `src-renderer/i18n/locales/`    | en.json, zh.json (default: zh)                   |
| Type definitions         | `src-renderer/index.d.ts`       | Global `Translate` namespace types               |
| Plugin type augmentation | `src-renderer/plugins/index.d.ts`| NuxtApp interface ($tauri, $translate, etc.)    |
| App settings (Rust)      | `src-tauri/src/utils/settings.rs`| Settings struct with API config                 |
| App state (Rust)         | `src-tauri/src/core/state.rs`   | AppState struct (exit_prevent, settings)         |
| Constants (Rust)         | `src-tauri/src/consts.rs`       | Window labels, shortcut enums, API keys          |
| Custom icons             | `src-renderer/assets/icons/`    | SVG/PNG: baidu, deepl, google, chatgpt logos     |
| Capabilities (Tauri)     | `src-tauri/capabilities/`       | default.json, desktop.json permissions           |

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

| Key              | Type        | Source Plugin      | Purpose                              |
| ---------------- | ----------- | ------------------ | ------------------------------------ |
| `$tauri`         | `Tauri`     | `02.tauriapi.ts`   | Window ops, settings, clipboard      |
| `$translate`     | `Translate` | `03.translate.ts`  | Translation API invoke wrappers      |
| `$media`         | `Media`     | `01.global.ts`     | Responsive breakpoint queries        |
| `$translateType` | `TranslateType` | `01.global.ts` | Provider definitions (google, deepl, baidu, chatgpt) |
| `$rootFontSize`  | `number`    | `01.global.ts`     | Root element font size               |

### Tauri Commands (IPC)

| Command                  | Module              | Purpose                              |
| ------------------------ | ------------------- | ------------------------------------ |
| `test_cmd`               | cmds/mod.rs         | Debug/test command                   |
| `open_window`            | cmds/mod.rs         | Open webview window by route         |
| `resize_window_height`   | cmds/mod.rs         | Resize window respecting work area   |
| `open_translate_window`  | windows/translate.rs| Open/show translate window           |
| `set_pin`                | windows/translate.rs| Pin/unpin translate window           |
| `get_settings`           | cmds/settings.rs    | Get app settings JSON                |
| `translate_text`         | module/translate.rs | Translate text via server API        |
| `translate_languages`    | module/translate.rs | Get supported languages              |
| `translate_detect`       | module/translate.rs | Detect source language               |
| `translate_speech`       | module/translate.rs | Text-to-speech (returns base64 audio)|
| `translate_img2text`     | module/translate.rs | OCR: image to text                   |

### Frontend Pages

| Page               | Route           | Purpose                             |
| ------------------ | --------------- | ------------------------------------ |
| `index.vue`        | `/`             | Redirect/landing                     |
| `home.vue`         | `/home`         | Main home page with sidebar          |
| `home/services.vue`| `/home/services`| Translation service management       |
| `home/models.vue`  | `/home/models`  | Model configuration                  |
| `home/about.vue`   | `/home/about`   | About page                           |
| `translate.vue`    | `/translate`    | Translation window UI                |
| `playground.vue`   | `/playground`   | Dev playground                       |
| `test.vue`         | `/test`         | Test page                            |
| `test-cmds.vue`    | `/test-cmds`    | Tauri command testing                |
| `debug-lab.vue`    | `/debug-lab`    | Debug lab (Alt+L in dev mode)        |

### Translate Components

| Component           | Purpose                                      |
| ------------------- | -------------------------------------------- |
| `Input.vue`         | Source text input with auto-resize           |
| `Output.vue`        | Translation result display                   |
| `OutputTabs.vue`    | Multi-provider tabbed output                 |
| `LangSelect.vue`    | Language selector dropdown                   |
| `TypeSelect.vue`    | Translation provider selector               |
| `TypeIcon.vue`      | Provider icon component                      |
| `Toolsbar.vue`      | Translation toolbar actions                  |
| `Volume.vue`        | Text-to-speech playback                      |

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

- `unwrap()` calls in Rust need error handling (state.rs, settings.rs, translate.rs, cmds/mod.rs)
- Debug `console.log()` scattered in plugins and components
- `any` types in index.d.ts (`Channel.api_config`, `TranslateTypeInfo.icon`), plugins/index.d.ts
- `modules/` directory exists but is empty (incomplete module architecture)
- `composables/` directory exists but is empty
- `src-renderer/archive/` directory exists (may contain deprecated code)
- Home sub-pages `backup.vue`, `quick-input.vue`, `settings.vue` are placeholder stubs

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

| Key              | Action                                          |
| ---------------- | ----------------------------------------------- |
| Ctrl+C (×2)      | Capture clipboard, open translate window (cpcp) |
| Alt (×2)         | Show translate window (double-tap)              |
| Alt+L            | Open debug lab window (dev mode only)           |

## TAURI PLUGINS (Registered in lib.rs)

| Plugin                          | Purpose                          |
| ------------------------------- | -------------------------------- |
| `tauri-plugin-pinia`            | Frontend Pinia state persistence |
| `tauri-plugin-window-state`     | Window position/size persistence |
| `tauri-plugin-decorum`          | Window decoration control        |
| `tauri-plugin-clipboard-manager`| Clipboard read/write             |
| `tauri-plugin-http`             | HTTP requests                    |
| `tauri-plugin-store`            | Key-value storage                |
| `tauri-plugin-os`               | OS information                   |
| `tauri-plugin-shell`            | Shell command execution          |
| `tauri-plugin-global-shortcut`  | Global keyboard shortcuts        |
| `tauri-plugin-log`              | Logging (stdout, file, webview)  |
| `plugin::single_instance`       | Single instance enforcement      |

## GIT DEPENDENCIES

| Crate              | Repo                                        | Purpose                          |
| ------------------- | ------------------------------------------- | -------------------------------- |
| `mdict_analysis`    | `pzyyll/mdict-analysis-rs` (main)           | MDict dictionary file parsing    |
| `kmhook`            | `pzyyll/kmhook-rs` (main)                   | Global keyboard/mouse hooks      |

## NOTES

- No CI/CD pipeline configured
- Windows-specific: Win32 API for UI automation, monitor work area detection
- macOS: Platform config in `tauri.macos.conf.json` (private API for tray icon)
- Windows: Platform config in `tauri.windows.conf.json`
- No frontend test framework configured
- Translation uses remote server API at URL from `settings.json` (key: `lexinsvr`)
- Settings stored in `$APPDATA/settings.json`, keyed by `lexinsvr` for API endpoint + token
