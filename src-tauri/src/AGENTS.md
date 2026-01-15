# SRC-TAURI/SRC (RUST BACKEND)

## OVERVIEW

Tauri 2 Rust backend: translation SDKs, window management, global hotkeys, system tray.

## STRUCTURE

```
src/
├── lib.rs            # App setup: plugins, hotkeys, state init
├── main.rs           # Entry point (DO NOT MODIFY windows_subsystem)
├── consts.rs         # Constants (SERVER_API_KEY, etc.)
├── cmds/             # Tauri commands exposed to frontend
├── core/             # AppState, settings management
├── module/           # Business logic (translate.rs, sdk/)
├── windows/          # Window builders (home, translate, tray)
├── plugin/           # Custom plugins (single_instance)
└── utils/            # Helpers (monitor_ex, path, settings)
```

## WHERE TO LOOK

| Task                | File                     | Notes                               |
| ------------------- | ------------------------ | ----------------------------------- |
| Add Tauri command   | `cmds/mod.rs`            | Add to `generate_handler![]` macro  |
| Add translation SDK | `module/sdk/[provider]/` | Implement TranslationSdk trait      |
| Modify hotkeys      | `lib.rs`                 | In `app_setup()` function           |
| Add window type     | `windows/[name].rs`      | Follow home.rs/translate.rs pattern |
| Modify tray menu    | `windows/tray.rs`        | In `setup()` function               |
| Add app state field | `core/state.rs`          | Add to AppState struct              |
| Add settings field  | `utils/settings.rs`      | Add to Settings struct              |

## CONVENTIONS

### Commands

```rust
#[tauri::command]
pub async fn my_command(
    state: tauri::State<'_, AppState>,
    param: String,
) -> Result<Value, String> {
    // Implementation
}
```

### Error Handling

- Use `thiserror` for error types
- Propagate with `?` operator
- Return `Result<T, String>` for IPC commands
- **AVOID** `unwrap()` in production paths

### State Access

```rust
let settings = &state.settings;
let api_info = settings.api.get("lexinsvr");
```

### Window Operations

```rust
// Get window
let window = app.get_webview_window("home")?;

// Show/focus
window.show()?;
window.set_focus()?;
```

## ANTI-PATTERNS

| NEVER                                  | Why                                     |
| -------------------------------------- | --------------------------------------- |
| Remove line 2 in main.rs               | Shows console window in release builds  |
| Use `unwrap()` on window/clipboard ops | Panics on edge cases                    |
| Block async runtime                    | Use `spawn_blocking` for CPU-heavy work |
| Store secrets in consts.rs             | Use encrypted settings.json             |

## DEPENDENCIES (Notable)

| Crate                | Purpose                               |
| -------------------- | ------------------------------------- |
| `kmhook`             | Global keyboard/mouse hooks (git dep) |
| `mdict_analysis`     | Dictionary parsing (git dep)          |
| `windows`            | Win32 API bindings (Windows-only)     |
| `tauri-plugin-pinia` | Frontend state persistence            |
