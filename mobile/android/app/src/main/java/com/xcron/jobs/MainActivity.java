package com.xcron.jobs;

import android.os.Bundle;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import com.xcron.jobs.BuildConfig;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // Debug builds: allow Playwright / chrome://inspect to attach to the Capacitor WebView.
    if (BuildConfig.DEBUG) {
      WebView.setWebContentsDebuggingEnabled(true);
    }
  }
}
