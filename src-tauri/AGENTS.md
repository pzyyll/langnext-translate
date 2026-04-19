# SRC-TAURI/SRC (RUST BACKEND)

## OVERVIEW

Tauri 2 Rust backend: translation server API proxy, window management, global hotkeys (via kmhook-rs), system tray, app settings, MDict dictionary support.

## STRUCTURE

```
src/
├── lib.rs            # App entry: plugin registration, hotkey setup, state init, run loop
├── main.rs           # Entry point (#![windows_subsystem = "windows"] — DO NOT REMOVE)
├── consts.rs         # Constants: window labels, shortcut/mouse enums, API key names
├── cmds/             # Tauri IPC commands exposed to frontend
│   ├── mod.rs        # register_cmds() + test_cmd, open_window, resize_window_height
│   └── settings.rs   # get_settings command
├── core/             # Core application state
│   ├── mod.rs        # Module re-exports
│   └── state.rs      # AppState struct (exit_prevent, settings)
├── module/           # Business logic
│   ├── mod.rs        # Module re-exports (sdk, translate)
│   ├── translate.rs  # Translation commands (text, languages, detect, speech, img2text)
│   └── sdk/          # Translation SDK implementations (placeholder)
│       ├── mod.rs    # Empty module file
│       ├── deepl/    # Empty — reserved for DeepL SDK
│       ├── google/   # Empty — reserved for Google Translate SDK
│       └── openai/   # Empty — reserved for OpenAI SDK
├── windows/          # Window builders and management
│   ├── mod.rs        # setup() → tray::setup()
│   ├── home.rs       # Home window builder
│   ├── translate.rs  # Translate window (try_show_on_cpcp, try_show_on_double_alt, set_pin)
│   └── tray.rs       # System tray setup and menu
├── plugin/           # Custom Tauri plugins
│   ├── mod.rs        # Module re-exports
│   └── single_instance.rs  # Wraps tauri-plugin-single-instance with focus logic
└── utils/            # Utility functions
    ├── mod.rs        # Module re-exports
    ├── monitor_ex.rs # Win32 monitor info (get_monitor_info_bywin, get_monitor_info_bypoint)
    ├── path.rs       # File path helpers (ensure_file_exists)
    └── settings.rs   # Settings struct: ApiInfo, load/save from JSON
```

## WHERE TO LOOK

| Task                | File                     | Notes                                      |
| ------------------- | ------------------------ | ------------------------------------------ |
| Add Tauri command   | `cmds/mod.rs`            | Add fn + register in `generate_handler![]` |
| Add translation SDK | `module/sdk/[provider]/` | deepl/, google/, openai/ exist but are empty |
| Modify hotkeys      | `lib.rs`                 | In `app_setup()`, via `hotkey_enginer`     |
| Add window type     | `windows/[name].rs`      | Follow home.rs / translate.rs pattern      |
| Modify tray menu    | `windows/tray.rs`        | In `setup()` function                      |
| Add app state field | `core/state.rs`          | Add to `AppState` struct                   |
| Add settings field  | `utils/settings.rs`      | Add to `Settings` / `ApiInfo` struct       |
| Add constant        | `consts.rs`              | Window labels, event types, shortcuts      |

## CONVENTIONS

### Commands

```rust
#[tauri::command]
pub async fn my_command(
    state: tauri::State<'_, AppState>,
    param: String,
) -> Result<serde_json::Value, String> {
    // Implementation
}
// Register in cmds/mod.rs → generate_handler![]
```

### Error Handling

- Use `thiserror` for custom error types
- Propagate with `?` operator using `.map_err(|e| e.to_string())?`
- Return `Result<T, String>` for IPC commands
- **AVOID** `unwrap()` in production paths

### State Access

```rust
// In command handlers:
let api = state.settings.get_api("lexinsvr");

// In setup or non-command context:
let state = app.state::<AppState>();
```

### Window Operations

```rust
// Get existing window
let window = app.get_webview_window("translate")?;
window.show()?;
window.set_focus()?;

// Create new window
let _win = tauri::WebviewWindowBuilder::new(
    &app, "label", tauri::WebviewUrl::App("route".into())
).title("Title").build()?;
```

### Hotkey Registration

```rust
// In app_setup(), via kmhook-rs:
hotkey_enginer::add_global_shortcut_trigger(
    "Ctrl+C",       // Key combo
    move || { ... }, // Callback
    2,               // Trigger count (double-press)
    None,            // Optional timeout
)?;
```

## ANTI-PATTERNS

| NEVER                                  | Why                                     |
| -------------------------------------- | --------------------------------------- |
| Remove line 2 in main.rs               | Shows console window in release builds  |
| Use `unwrap()` on window/clipboard ops | Panics on edge cases                    |
| Block async runtime                    | Use `spawn_blocking` for CPU-heavy work |
| Store secrets in consts.rs             | Use encrypted settings.json             |

## KNOWN ISSUES

- `unwrap()` in cmds/mod.rs:40-47 (6 calls: hwnd, monitor_info, scale_factor, outer_position, outer_size, inner_size)
- `unwrap()` in module/translate.rs:45-46 (URL join, URL parse)
- `unwrap()` in windows/translate.rs: clipboard read_text (97), cursor_position (160, 173), show result (139)
- `expect()` in plugin/single_instance.rs:14-16 (window lookup + set_focus)
- `Shortcut::AltShift1` defined in consts.rs but never used
- Possible dead commands: `test_cmd`, `open_window` never invoked from frontend
- `translate_languages` command may be unused from frontend

## DEPENDENCIES (Notable)

| Crate                  | Purpose                               |
| ---------------------- | ------------------------------------- |
| `kmhook`               | Global keyboard/mouse hooks (git dep) |
| `mdict_analysis`       | MDict dictionary parsing (git dep)    |
| `windows` / `windows-core` | Win32 API bindings (Windows-only) |
| `tauri-plugin-pinia`   | Frontend state persistence            |
| `tauri-plugin-decorum` | Window decoration control             |
| `reqwest`              | HTTP client for translation API       |
| `serde` / `serde_json` | Serialization (settings, IPC)        |
| `futures`              | Async stream utilities (StreamExt)    |
| `base64`               | Audio data encoding (speech)          |
| `thiserror`            | Error type derivation                 |
| `lazy_static`          | Static reqwest::Client singleton      |
| `log`                  | Logging facade                        |

## TAURI PLUGINS (Registered in lib.rs)

| Plugin                           | Purpose                          |
| -------------------------------- | -------------------------------- |
| `tauri-plugin-pinia`             | Frontend Pinia state persistence |
| `tauri-plugin-window-state`      | Window position/size persistence |
| `tauri-plugin-decorum`           | Window decoration control        |
| `tauri-plugin-clipboard-manager` | Clipboard read/write             |
| `tauri-plugin-http`              | HTTP requests                    |
| `tauri-plugin-store`             | Key-value storage                |
| `tauri-plugin-os`                | OS information                   |
| `tauri-plugin-shell`             | Shell command execution          |
| `tauri-plugin-global-shortcut`   | Global keyboard shortcuts        |
| `tauri-plugin-log`               | Logging (stdout, file, webview)  |
| `plugin::single_instance`        | Single instance enforcement      |
