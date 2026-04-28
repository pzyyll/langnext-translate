# LangNext

LangNext is a desktop translation application built with Tauri 2, Nuxt 4, Vue 3,
Pinia, Tailwind CSS, DaisyUI, and a Rust backend. It provides quick clipboard-based
translation, a popup translation window, configurable translation providers, and a
desktop-first workflow for reading and translating text across applications.

## Features

- Desktop app powered by Tauri 2 and Rust.
- Nuxt 4 frontend with Vue 3 Composition API.
- Quick translation popup triggered by global hotkeys.
- Clipboard translation workflow with double `Ctrl+C`.
- Double `Alt` shortcut for showing the translation window.
- Multi-provider translation tabs.
- Translation provider configuration for Google, DeepL, Baidu, OpenAI, Youdao, and custom channels.
- Pinia stores persisted through Tauri storage.
- Markdown rendering with syntax highlighting for translation output.
- System tray integration and single-instance behavior.
- English and Simplified Chinese UI locales.
- Windows-focused desktop behavior with monitor-aware popup placement.

## Tech Stack

| Area | Technology |
| --- | --- |
| Desktop shell | Tauri 2 |
| Backend | Rust 2021 |
| Frontend | Nuxt 4, Vue 3 |
| State management | Pinia, `@tauri-store/pinia` |
| Styling | Tailwind CSS 4, DaisyUI 5 |
| Headless UI | Reka UI |
| Icons | Iconify, custom SVG icon loader |
| i18n | `@nuxtjs/i18n` |
| HTTP client | `reqwest` on Rust backend |
| Hotkeys | `kmhook-rs` |
| Dictionary parsing | `mdict-analysis-rs` |

## Requirements

- Windows, macOS, or Linux supported by Tauri 2. Some current behavior is Windows-focused.
- Rust 1.80 or newer.
- Node.js compatible with Nuxt 4.
- pnpm 10.33.2, as declared by `packageManager`.
- Bun, because the current Tauri scripts invoke `bun`.
- Tauri system dependencies for your platform.

For platform-specific Tauri prerequisites, see the official Tauri setup guide:
https://tauri.app/start/prerequisites/

## Installation

Install frontend dependencies:

```bash
pnpm install
```

If you use Bun directly for scripts, install Bun as well:

```bash
bun --version
```

## Development

Run the full desktop app in development mode:

```bash
bun tauri:dev
```

Run only the Nuxt frontend:

```bash
bun dev
```

The Nuxt dev server runs on port `1234`. Tauri development uses
`src-tauri/tauri-dev.conf.json` and points to `http://localhost:1234`.

## Build

Generate the static frontend:

```bash
bun generate
```

Build the desktop application:

```bash
bun tauri:build
```

The production Tauri build uses `bun run generate` as the frontend build command
and bundles the generated `dist` directory.

## Useful Scripts

| Command | Description |
| --- | --- |
| `bun tauri:dev` | Run Nuxt and Tauri in desktop development mode. |
| `bun tauri:build` | Build the packaged desktop application. |
| `bun dev` | Run the Nuxt frontend only. |
| `bun build` | Run `nuxt build`. |
| `bun generate` | Generate the static frontend for Tauri bundling. |
| `bun preview` | Preview the Nuxt build. |
| `bun generate:locales` | Generate locale files with the project script. |

## Runtime Shortcuts

| Shortcut | Action |
| --- | --- |
| Double `Ctrl+C` | Read clipboard text and open the translation popup. |
| Double `Alt` | Show the translation window. |
| `Alt+L` | Open the debug lab window in development mode. |

## Translation Flow

1. The user copies text or triggers the translation shortcut.
2. The Rust backend reads clipboard content and emits a Tauri event.
3. The Nuxt frontend receives the event through the `$tauri` plugin.
4. The translation store updates the source input and selected languages.
5. The frontend invokes Tauri translation commands through `$translate`.
6. The Rust backend sends requests to the configured `lexinsvr` API.
7. Provider responses are displayed in separate output tabs.

## Configuration

Application settings are loaded by the Rust backend and include API information for
the remote translation server. The key backend API entry is named `lexinsvr`.

The frontend exposes the following Nuxt app plugins:

| Provide | Purpose |
| --- | --- |
| `$tauri` | Window operations, settings access, clipboard, and event helpers. |
| `$translate` | Typed wrappers around translation IPC commands. |
| `$media` | Responsive media query helpers. |
| `$translateType` | Translation provider metadata. |
| `$rootFontSize` | Root font-size value for UI calculations. |

## Translation Providers

The UI and stores support these provider types:

- OpenAI-compatible translation.
- DeepL.
- Google Translate.
- Baidu Translate.
- Youdao.
- Custom providers.

The Rust backend currently proxies translation requests to the configured `lexinsvr`
server instead of calling every provider directly from the client.

## Localization

Locale files live in `src-renderer/i18n/locales/`.

Supported locales:

- `en`: English.
- `zh`: Simplified Chinese, the default locale.

## Development Notes

- Frontend source code uses tabs, single quotes, and Vue Composition API.
- User-facing strings should be added to both locale files.
- Components should use project-provided `$tauri` and `$translate` plugins instead of importing Tauri APIs directly.
- DaisyUI classes use the `du-` prefix.
- The Rust backend should avoid `unwrap()` in production paths and return IPC-friendly errors.
- `src-tauri/src/main.rs` contains `#![windows_subsystem = "windows"]`; keep it for release builds on Windows.

## Testing

Rust tests can be run from the repository root with:

```bash
cargo test -p langnext
```

There is currently no dedicated frontend test framework configured.

## License

This project is licensed under GPL-3.0-or-later. See `package.json` and
`src-tauri/Cargo.toml` for package metadata.
