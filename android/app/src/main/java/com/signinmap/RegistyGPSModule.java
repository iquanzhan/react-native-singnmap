package com.signinmap;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.toast.ToastModule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class RegistyGPSModule implements ReactPackage {
    /**
     *
     * @param reactContext 上下文
     * @return 需要调用的原生控件
     */
    @Override
    public List<com.facebook.react.uimanager.ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    /**
     *
     * @param reactContext 上下文
     * @return 需要调用的原生模块
     */
    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();

        modules.add(new GPSSTatus(reactContext));

        return modules;
    }
}