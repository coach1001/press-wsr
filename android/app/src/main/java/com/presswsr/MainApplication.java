package com.presswsr;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.rusel.RCTBluetoothSerial.RCTBluetoothSerialPackage;
import com.github.wuxudong.rncharts.MPAndroidChartPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.github.yamill.orientation.OrientationPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RCTBluetoothSerialPackage(),
            new MPAndroidChartPackage(),                                          
            new BackgroundTimerPackage(),
            new KCKeepAwakePackage(),
            new OrientationPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
