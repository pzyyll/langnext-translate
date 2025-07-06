use core::state::AppState;
use kmhook::enginer as hotkey_enginer;
use std::error::Error;
use std::sync::Arc;
use tauri::{Manager, Runtime};
use tauri_plugin_decorum::WebviewWindowExt;
use tauri_plugin_log::{Target, TargetKind};
use tauri_plugin_window_state::{AppHandleExt, StateFlags};

mod cmds;
mod consts;
mod core;
mod module;
mod plugin;
mod utils;
mod windows;

fn app_setup<R: Runtime>(app: &mut tauri::App<R>) -> Result<(), Box<dyn Error>>
where
    tauri::WebviewWindow<R>: WebviewWindowExt,
{
    #[cfg(debug_assertions)]
    {
        use tauri_plugin_global_shortcut::{GlobalShortcut, ShortcutState};
        let gs = app.state::<GlobalShortcut<R>>();
        gs.on_shortcut("Alt+L", |app, _shortcut, event| {
            if let ShortcutState::Pressed = event.state {
                println!("CmdOrCtrl+Shift+D pressed");
                match tauri::WebviewWindowBuilder::new(
                    app,
                    "devlab",
                    tauri::WebviewUrl::App("debug-lab".into()),
                )
                .title("Lab Dashboard")
                .build()
                {
                    Ok(_) => {}
                    Err(e) => {
                        eprintln!("Error opening window: {:?}", e);
                        use tauri::Error::WebviewLabelAlreadyExists;
                        // check e is WebviewLabelAlreadyExists
                        if let WebviewLabelAlreadyExists(_) = e {
                            // focus the window
                            println!("Focusing window");
                            let devlan_win =
                                app.get_webview_window("devlab").expect("window not found");
                            devlan_win
                                .set_focus()
                                .expect("failed to set focus to window");
                            devlan_win.show().expect("failed to show window");
                            devlan_win
                                .unminimize()
                                .expect("failed to unmaximize window");
                        }
                    }
                }
            }
        })?;
    }

    let _ = app
        .handle()
        .save_window_state(StateFlags::POSITION | StateFlags::SIZE);

    let app_state = AppState::build(app.handle());
    app.manage(app_state);
    windows::setup(app.handle());
    let apphandle = Arc::new(app.handle().clone());
    {
        let apphandle = Arc::clone(&apphandle);
        hotkey_enginer::add_global_shortcut_trigger(
            "Ctrl+C",
            move || {
                println!("Ctrl+C pressed thread_id {:?}", std::thread::current().id());
                windows::translate::try_show_on_cpcp(&apphandle);
            },
            2,
            None,
        )?;
    }
    {
        let apphandle = Arc::clone(&apphandle);
        hotkey_enginer::add_global_shortcut_trigger(
            "Alt",
            move || {
                println!("Alt pressed thread_id {:?}", std::thread::current().id());
                let _ = windows::translate::try_show_on_double_alt(&apphandle);
            },
            2,
            None,
        )?;
    }
    hotkey_enginer::startup(Some(true));

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_pinia::init())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_decorum::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_os::init())
        .plugin(plugin::single_instance::get_plugin())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(
            tauri_plugin_log::Builder::new()
                .targets([
                    Target::new(TargetKind::Stdout),
                    Target::new(TargetKind::LogDir { file_name: None }),
                    Target::new(TargetKind::Webview),
                    Target::new(TargetKind::Stderr),
                ])
                .build(),
        )
        .invoke_handler(cmds::register_cmds())
        .setup(app_setup)
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|app, event| match event {
            tauri::RunEvent::ExitRequested { code, api, .. } => {
                let exit_prevent_state = &app.state::<AppState>().exit_prevent;
                if code.is_none() && *exit_prevent_state == true {
                    println!("exiting prevented");
                    api.prevent_exit();
                }
            }
            tauri::RunEvent::Exit => {
                println!("exited");
            }
            tauri::RunEvent::WindowEvent { label, event, .. } => {
                // println!("window event: {} {:?}", label, event);
                match event {
                    tauri::WindowEvent::Focused(focused) => {
                        if focused {
                            println!("window focused {label}");
                        } else {
                            println!("window unfocused {label}");
                        }
                    }
                    _ => {}
                }
            }
            _ => {}
        });
}
