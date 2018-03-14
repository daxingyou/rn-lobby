/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
#import "AppDelegate.h"
#import "RCTBundleURLProvider.h"
#import "RCTRootView.h"
#import "CodePush.h"
#import "UMMobClick/MobClick.h"
#import "RCTUmengPush.h"

@implementation AppDelegate
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  //注册友盟推送
  [RCTUmengPush registerWithAppkey:@"UMENG_KEY" launchOptions:launchOptions];

  self.umengAppKey = @"UMENG_KEY";
  self.umengChanelId = @"App Store";
  UMConfigInstance.appKey = self.umengAppKey;
  UMConfigInstance.channelId = self.umengChanelId;
//  UMConfigInstance.eSType=E_UM_GAME;//友盟游戏统计，如不设置默认为应用统计
  [MobClick startWithConfigure:UMConfigInstance];
  [MobClick setLogEnabled:YES];

  NSURL *jsCodeLocation;
  

#ifdef DEBUG
  jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
#else
  jsCodeLocation = [CodePush bundleURL];
#endif


  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"hatsune"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  //获取deviceToken
  [RCTUmengPush application:application didRegisterDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
{
  //获取远程推送消息
  [RCTUmengPush application:application didReceiveRemoteNotification:userInfo];
}

@end
