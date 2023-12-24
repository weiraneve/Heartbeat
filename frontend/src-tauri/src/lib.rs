use anyhow::Result;
#[cfg(target_os = "android")]
use wry::android_binding;
use wry::{
    application::{
        event::{Event, StartCause, WindowEvent},
        event_loop::{ControlFlow, EventLoop, EventLoopWindowTarget},
        window::WindowBuilder,
    },
    http::Response,
    webview::{WebView, WebViewBuilder},
};

#[cfg(target_os = "android")]
fn init_logging() {
    android_logger::init_once(
        android_logger::Config::default()
            .with_min_level(log::Level::Trace)
            .with_tag("heartbeat"),
    );
}

#[cfg(not(target_os = "android"))]
fn init_logging() {
    env_logger::init();
}

#[cfg(any(target_os = "android", target_os = "ios"))]
fn stop_unwind<F: FnOnce() -> T, T>(f: F) -> T {
    match std::panic::catch_unwind(std::panic::AssertUnwindSafe(f)) {
        Ok(t) => t,
        Err(err) => {
            eprintln!("attempt to unwind out of `rust` with err: {:?}", err);
            std::process::abort()
        }
    }
}

#[cfg(any(target_os = "android", target_os = "ios"))]
fn _start_app() {
    stop_unwind(|| main().unwrap());
}

#[no_mangle]
#[inline(never)]
#[cfg(any(target_os = "android", target_os = "ios"))]
pub extern "C" fn start_app() {
    #[cfg(target_os = "android")]
    android_binding!(heartbeat_thoughtworks_com, heartbeat, _start_app);
    #[cfg(target_os = "ios")]
    _start_app()
}

pub fn main() -> Result<()> {
    init_logging();
    let event_loop = EventLoop::new();

    let mut webview = None;
    event_loop.run(move |event, event_loop, control_flow| {
        *control_flow = ControlFlow::Wait;

        match event {
            Event::NewEvents(StartCause::Init) => {
                webview = Some(build_webview(event_loop).unwrap());
            }
            Event::WindowEvent {
                event: WindowEvent::CloseRequested { .. },
                ..
            } => {
                webview.take();
                *control_flow = ControlFlow::Exit;
            }
            _ => (),
        }
    });
}

fn build_webview(event_loop: &EventLoopWindowTarget<()>) -> Result<WebView> {
    let window = WindowBuilder::new()
        .with_title("A fantastic window!")
        .build(&event_loop)?;
    let webview = WebViewBuilder::new(window)?
        .with_url("https://tauri.app")?
        // If you want to use custom protocol, set url like this and add files like index.html to assets directory.
        // .with_url("wry://assets/index.html")?
        .with_devtools(true)
        .with_initialization_script("console.log('hello world from init script');")
        .with_ipc_handler(|_, s| {
            dbg!(s);
        })
        .with_custom_protocol("wry".into(), move |_request| {
            #[cfg(not(target_os = "android"))]
            {
                use std::fs::{canonicalize, read};
                use wry::http::header::CONTENT_TYPE;

                // Remove url scheme
                let path = _request.uri().path();

                #[cfg(not(target_os = "ios"))]
                let content = read(canonicalize(&path[1..])?)?;

                #[cfg(target_os = "ios")]
                let content = {
                    let path = core_foundation::bundle::CFBundle::main_bundle()
                        .resources_path()
                        .unwrap()
                        .join(&path);
                    read(canonicalize(&path)?)?
                };

                // Return asset contents and mime types based on file extentions
                // If you don't want to do this manually, there are some crates for you.
                // Such as `infer` and `mime_guess`.
                let (data, meta) = if path.ends_with(".html") {
                    (content, "text/html")
                } else if path.ends_with(".js") {
                    (content, "text/javascript")
                } else if path.ends_with(".png") {
                    (content, "image/png")
                } else {
                    unimplemented!();
                };

                Ok(Response::builder()
                    .header(CONTENT_TYPE, meta)
                    .body(data.into())?)
            }

            #[cfg(target_os = "android")]
            {
                Ok(Response::builder().body(Vec::new().into())?)
            }
        })
        .build()?;

        Ok(webview)
 }