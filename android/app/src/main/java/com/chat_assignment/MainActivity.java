package com.chat_assignment;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.FacebookSdk;

public class MainActivity extends ReactActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        FacebookSdk.sdkInitialize(getApplicationContext());

    }

  @Override
  protected String getMainComponentName() {
    return "chat_assignment";
  }
}
