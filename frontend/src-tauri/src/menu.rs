use tauri::{AboutMetadata, CustomMenuItem, Menu, MenuItem, Submenu, WindowMenuEvent};

pub fn init() -> Menu {
  let name = "Heartbeat";
  let app_menu = Submenu::new(
    name,
    Menu::with_items([
      #[cfg(target_os = "macos")]
        MenuItem::About(name.into(), AboutMetadata::default()).into(),
      MenuItem::Hide.into(),
      MenuItem::HideOthers.into(),
      MenuItem::ShowAll.into(),
      MenuItem::Quit.into(),
    ]),
  );

  let view_menu = Submenu::new(
    "View",
    Menu::new()
      .add_item(CustomMenuItem::new("go_back", "Go Back").accelerator("CmdOrCtrl+[")),
  );

  Menu::new()
    .add_submenu(app_menu)
    .add_submenu(view_menu)
}

pub fn menu_handler(event: WindowMenuEvent<tauri::Wry>) {
  let win = Some(event.window()).unwrap();
  let menu_id = event.menu_item_id();

  match menu_id {
    "go_back" => win.eval("window.history.go(-1)").unwrap(),
    _ => {}
  }
}
