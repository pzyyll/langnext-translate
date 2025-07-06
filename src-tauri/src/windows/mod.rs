//! Copyright: 2024 Lizc. All rights reserved.
//! License: MIT License
//! You may obtain a copy of the License at https://opensource.org/licenses/MIT
//!
//! Author: Lizc
//! Created Data: 2024-05-27
//!
//! Description: Windows module for Tauri.

use tauri::Runtime;
use tauri_plugin_decorum::WebviewWindowExt;

pub mod home;
pub mod translate;
pub mod tray;

pub fn setup<R: Runtime>(app: &tauri::AppHandle<R>)
where
    tauri::WebviewWindow<R>: WebviewWindowExt,
{
    tray::setup(app);
}
