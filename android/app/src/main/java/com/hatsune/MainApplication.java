package com.hatsune;

import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.ReactApplication;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.jadsonlourenco.RNShakeEvent.RNShakeEventPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.liuchungui.react_native_umeng_push.UmengPushApplication;
import com.liuchungui.react_native_umeng_push.UmengPushPackage;
import com.meituan.android.walle.WalleChannelReader;
import com.microsoft.codepush.react.CodePush;
import com.oblador.keychain.KeychainPackage;
import com.rnfs.RNFSPackage;
import com.umeng.analytics.MobclickAgent;
import com.zmxv.RNSound.RNSoundPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends UmengPushApplication implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        protected boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new UmengPushPackage(),
                    new UmengReactPackage(),
                    new KeychainPackage(),
                    new RNFSPackage(),
                    new RNSoundPackage(),
                    new RNFetchBlobPackage(),
                    new RNShakeEventPackage(),
                    new RNDeviceInfo(),
                    new CodePush(BuildConfig.CODE_PUSH_KEY, MainApplication.this, BuildConfig.DEBUG, "http://api.codepush.cc")
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
        RNPatcher.resetClientProvider();
        String channel = WalleChannelReader.getChannel(this);
        MobclickAgent.UMAnalyticsConfig umConfig = new MobclickAgent.UMAnalyticsConfig(this, BuildConfig.UMENG_APPKEY, channel);
        MobclickAgent.startWithConfigure(umConfig);
        mPushAgent.setMessageChannel(channel);
        mPushAgent.setResourcePackageName("com.hatsune");
        // PushAgent mPushAgent = PushAgent.getInstance(this);
        // //注册推送服务，每次调用register方法都会回调该接口
        // mPushAgent.register(new IUmengRegisterCallback() {
        //
        //     @Override
        //     public void onSuccess(String deviceToken) {
        //         //注册成功会返回device token
        //     }
        //
        //     @Override
        //     public void onFailure(String s, String s1) {
        //
        //     }
        // });
    }
}
