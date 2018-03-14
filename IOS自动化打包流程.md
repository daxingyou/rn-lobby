# 自动化打包使用

以下步骤以`彩02`为例，确定应用的文件夹名称缩写`c02`

## RN 配置

在 `hatsune/multiChannel` 目录下创建对应的RN配置文件夹 `c02`

`hatsune/multiChannel/c02 ` 下包含三个文件

* `global.js`

  ```javascript
  export default Global = {
    platformName: '彩02彩票',
    host: 'http://c0209.com',
    baseColor: '#FF7700',
    umengAppKeyIos: '58e4e0a5a40fa339fe00191e',
    umengAppKeyAndroid: '58e5e0c6f43e484ac80013df'
  }
  ```

* `ic_app_splash.webp`

* `ic_logo.webp`

## iOS 工程配置

### 配置好脚本信息

在 `hatsune/ios/configs/Icons` 下添加对应的打包配置文件 `c02.conf`

```Sh
app_version='40'
app_version_string='1.0.0'
app_name='彩02-数彩专家'
app_bundle_id='com.kosun.c02.g'
app_product_name='彩02'
app_scheme='hatsune'
apple_id='body@my123shop.com'
config_name='c02'
umeng_key='58e4e0a5a40fa339fe00191e'
code_push_key='UbFu22YkbIkyiRQjbDAJo4bIMccl6ksvOPqes'
```

### Icons 配置

在 `hatsune/ios/configs/Icons` 下添加对应的 Icons 配置文件夹 `c02`

`hatsune/ios/configs/Icons/c02` 下包含 8 个 尺寸的 icon 图片

* `iconiPhoneApp_60pt@2x.png`
* `iconiPhoneApp_60pt@3x.png`
* `iconiPhoneNotification_20pt@2x.png`
* `iconiPhoneNotification_20pt@3x.png`
* `iconiPhoneSpootlight5_29pt@2x.png`
* `iconiPhoneSpootlight5_29pt@3x.png`
* `iconiPhoneSpootlight7_40pt@2x.png`
* `iconiPhoneSpootlight7_40pt@3x.png`


### Launch Images 配置

在 `hatsune/ios/configs/LaunchImages` 下添加对应的 Launch Images 配置文件夹 `c02`

`hatsune/ios/configs/LaunchImages/c02` 下包含 4 个 尺寸的 Launch Images 图片

* `default@2x.png`
* `default@3x.png`
* `launch_screen@2x.png`
* `launch_screen@3x.png`

## 运行脚本进行自动化打包

改变当前目录为 `hatsune/ios` ，并运行命令行：

```
./packer.sh -f configs/c02.conf
```

按照提示输入，等待打包完成

