# THIS FILE IS AUTO-GENERATED. DO NOT MODIFY!!

# Copyright 2020-2023 Tauri Programme within The Commons Conservancy
# SPDX-License-Identifier: Apache-2.0
# SPDX-License-Identifier: MIT

-keep class heartbeat.thoughtworks.com.heartbeat.* {
  native <methods>;
}

-keep class heartbeat.thoughtworks.com.heartbeat.WryActivity {
  public <init>(...);

  void setWebView(heartbeat.thoughtworks.com.heartbeat.RustWebView);
  java.lang.Class getAppClass(...);
  java.lang.String getVersion();
}

-keep class heartbeat.thoughtworks.com.heartbeat.Ipc {
  public <init>(...);

  @android.webkit.JavascriptInterface public <methods>;
}

-keep class heartbeat.thoughtworks.com.heartbeat.RustWebView {
  public <init>(...);

  void loadUrlMainThread(...);
  void setAutoPlay(...);
  void setUserAgent(...);
}

-keep class heartbeat.thoughtworks.com.heartbeat.RustWebChromeClient,heartbeat.thoughtworks.com.heartbeat.RustWebViewClient {
  public <init>(...);
}