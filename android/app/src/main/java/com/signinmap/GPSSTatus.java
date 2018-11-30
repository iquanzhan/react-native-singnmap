package com.signinmap;

import android.os.Build;
import android.provider.Settings;
import android.support.annotation.Nullable;
import android.text.TextUtils;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

/**
 * 原生模块
 */
public class GPSSTatus extends ReactContextBaseJavaModule {

    public GPSSTatus(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    /**
     *
     * @return js调用的模块名
     */
    @Override
    public String getName() {
        return "getGPSStatus";
    }

    /**
     * 给rn定义模块的一些常量
     * @return 常量的一些键值
     */
    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();

        return constants;
    }

    /**
     * 使用ReactMethod注解，使这个方法被js调用
     */
    @ReactMethod
    public void show(Callback success) {

       int locationMode = 0;
        String locationProviders;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            try {
                locationMode = Settings.Secure.getInt(getCurrentActivity().getContentResolver(), Settings.Secure.LOCATION_MODE);
            } catch (Settings.SettingNotFoundException e) {
                e.printStackTrace();
                success.invoke(false);
            }
            success.invoke(locationMode != Settings.Secure.LOCATION_MODE_OFF);
        } else {
            locationProviders = Settings.Secure.getString(getCurrentActivity().getContentResolver(), Settings.Secure.LOCATION_PROVIDERS_ALLOWED);
            success.invoke(!TextUtils.isEmpty(locationProviders));
        }
    }
}