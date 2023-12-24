// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]


pub fn main() {
  // Change demo_mobile_app to the name of your app!
  heartbeat::AppBuilder::new().run();
}
