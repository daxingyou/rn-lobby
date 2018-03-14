//每次codepush新内容时请在此文件添加版本更新
const updateList = [
  {
    version: 'V1.0.0',
    updateTime: '2017-04-14 11:00:00',
    updateContent: '关于我们页面添加版本号',
  },
  {
    version: 'V1.0.1',
    updateTime: '2017-04-18 09:45:00',
    updateContent: '添加特殊代理功能',
  },
  {
    version: 'V1.0.2',
    updateTime: '2017-04-22 10:18:00',
    updateContent: '1.注册推荐码变为推荐人ID。2.注册成功之后跳转至最顶页。3.修改全部彩种图标从后台获取。',
  },
  {
    version: 'V1.0.3',
    updateTime: '2017-04-25 10:00:00',
    updateContent: '好友支付页面，支付宝昵称改成支付宝实名',
  },
  {
    version: 'V1.0.4',
    updateTime: '2017-04-28 11:12:00',
    updateContent: '1.修改绑卡提示。2.fetch请求异常统一提示网络异常。',
  },
  {
    version: 'V1.0.5',
    updateTime: '2017-05-02 11:45:00',
    updateContent: '1.微信好友支付打开支付宝app',
  },
  {
    version: 'V1.0.6',
    updateTime: '2017-05-03 11:45:00',
    updateContent: '1.修复试玩账号下注余额不足跳到充值页面',
  },
  {
    version: 'V1.0.7',
    updateTime: '2017-05-04 17:01:00',
    updateContent: '1.获取ip接口优化',
  },
  {
    version: 'V1.0.8',
    updateTime: '2017-05-05 15:30:00',
    updateContent: '1.设置页面添加手动检查版本更新功能',
  },
  {
    version: 'V1.0.9',
    updateTime: '2017-05-05 15:30:00',
    updateContent: '1.屏蔽内容展示会员中心，屏蔽的时候还可能手动更新',
  },
  {
    version: 'V1.0.9.1',
    updateTime: '2017-05-10 19:30:00',
    updateContent: '1.android充值页面webview组建bug修复',
  },
  {
    version: 'V1.0.10',
    updateTime: '2017-05-11 15:30:00',
    updateContent: '1.添加QQ钱包支付方式',
  },
  {
    version: 'V1.0.11',
    updateTime: '2017-05-15 20:44:00',
    updateContent: '1.修改所有app api url',
  },
  {
    version: 'V1.0.12',
    updateTime: '2017-05-18 11:00:00',
    updateContent: '1.修复android网银在线支付样式问题',
  },
  {
    version: 'V1.0.13',
    updateTime: '2017-05-19 18:30:00',
    updateContent: '1.好友支付打开支付宝客户端问题',
  },
  {
    version: 'V1.1.1',
    updateTime: '2017-05-22 11:30:00',
    updateContent: '1.修复注册用户名验证跟提示错误文本不一致问题',
  },
  {
    version: 'V1.1.2',
    updateTime: '2017-05-29 19:00:00',
    updateContent: '1.跑马灯样式错乱修复',
  },
  {
    version: 'V1.1.3',
    updateTime: '2017-06-17 17:00:00',
    updateContent: 'v1.0.0 bugs修复',
  },
  {
    version: 'V1.2.0',
    updateTime: '2017-06-20 17:30:00',
    updateContent: 'v1.1.1 bugs修复',
  },
  {
    version: 'V1.2.1',
    updateTime: '2017-06-21 17:30:00',
    updateContent: 'codepush server 迁移',
  },
  {
    version: 'V1.2.2',
    updateTime: '2017-06-24 14:30:00',
    updateContent: '修复：1.声音默认关闭。 2.首页余额undefined。 3.六合彩合肖赔率',
  },
  {
    version: 'V1.2.3',
    updateTime: '2017-06-25 16:00:00',
    updateContent: '时时彩三星混合组选注数bug修复',
  },
  {
    version: 'V1.2.4',
    updateTime: '2017-06-27 17:00:00',
    updateContent: '各平台好友支付添加',
  },
  {
    version: 'V1.2.5',
    updateTime: '2017-06-29 11:00:00',
    updateContent: `1.下注按钮快速点击多次提交订单bug修复，2.android禁止空白区域关闭alert（部分功能部分禁止）
                    3.下注页点击返回当购物车没内容是不做提醒`,
  },
  {
    version: 'V1.2.6',
    updateTime: '2017-06-29 17:00:00',
    updateContent: '修复android支付扫描加好友bug',
  },
  {
    version: 'V1.2.7',
    updateTime: '2017-07-03 16:00:00',
    updateContent: '1.修改换期提示方式，下注提示方式。 2.开奖页面 开奖号码为null时兼容处理',
  },
  {
    version: 'V1.2.8',
    updateTime: '2017-07-06 17:00:00',
    updateContent: '修复追号期数没自动更新问题',
  },
  {
    version: 'V1.2.9',
    updateTime: '2017-07-08 10:00:00',
    updateContent: '修复分分时时彩，极速pk拾走势bug',
  },
  {
    version: 'V1.2.10',
    updateTime: '2017-07-11 16:30:00',
    updateContent: '1. 所有站http => https，2. 我的银行卡页面添加用户真实姓名，3. 注册页面添加手机email字段',
  },
  {
    version: 'V1.2.11',
    updateTime: '2017-07-25 09:30:00',
    updateContent: '1. 通用支付文本调整。 2. cpcp http => https 3. 修复存款方式model样式问题 4.修复11x5，快三 手动输入换行正则问题',
  },
  {
    version: 'V1.2.12',
    updateTime: '2017-07-25 17:30:00',
    updateContent: '修复qq客服显示问题',
  },
  {
    version: 'V1.2.13',
    updateTime: '2017-07-26 17:30:00',
    updateContent: '1.延迟model关闭时间，在键盘隐藏后再关闭，预防android崩溃问题 2. c02 http =》 https',
  },
  {
    version: 'V1.2.14',
    updateTime: '2017-07-28 16:00:00',
    updateContent: '1.处理android崩溃问题 2.http => https',
  },
  {
    version: 'V1.2.15',
    updateTime: '2017-08-01 12:11:00',
    updateContent: '充值提现页面添加自定义数字键盘',
  },
  {
    version: 'V1.2.16',
    updateTime: '2017-08-04 16:00:00',
    updateContent: '优惠活动页面只有一张图片情况下显示优化',
  },
  {
    version: 'V1.2.17',
    updateTime: '2017-09-01 14:00:00',
    updateContent: '代理中心返点改版',
  },
  {
    version: 'V1.2.18',
    updateTime: '2017-09-02 20:30:00',
    updateContent: '修复bugs',
  },
  {
    version: 'V1.2.19',
    updateTime: '2017-09-02 21:15:00',
    updateContent: '修复提交返点修改后显示不正常',
  },
  {
    version: 'V1.3.0',
    updateTime: '2017-09-05 16:00:00',
    updateContent: '1.act:10017接口优化 2.选号页动画移除 3.团队管理页面代理返点错乱修复 4.首页跑马灯字体大小调整',
  },
  {
    version: 'V1.3.1',
    updateTime: '2017-09-07 17:00:00',
    updateContent: `
      1. 团队管理搜索框android设备样式修复
      2. 报表详情按钮android设备没显示bug修复
      3. 代理报表详情页账号列固定
      4. 页面头部组建返回按钮android设备未居中样式修复
      5. 修复注单详情页注数过多看不看底部取消注单按钮
    `,
  },
  {
    version: 'V1.3.2',
    updateTime: '2017-09-11 17:00:00',
    updateContent: `
      1. 代理报表详情列表宽度调整
      2. 修复pk10选号页面开奖结果在部分android设备显示不全问题
      3. 注单详情样式问题修复
    `,
  },
  {
    version: 'V1.3.3',
    updateTime: '2017-09-13 21:00:00',
    updateContent: `
      1. 六合彩玩法说明修改
      2. 选号页往期开奖结果期数截取
      3. 注单状态添加
      4. 选号页开奖结果本期结束每隔15秒轮询
      5. 注册接口增加注册来源字段
    `,
  },
  {
    version: 'V1.3.4',
    updateTime: '2017-09-14 12:00:00',
    updateContent: `
      1. 添加代理注册扩展字段功能
      2. 修复充值重复提交订单问题
      3. 修复六合彩开奖记录崩溃问题
    `,
  },
  {
    version: 'V1.3.5',
    updateTime: '2017-09-21 11:00:00',
    updateContent: `
      1. 修改六合彩玩法提示
      2. 修复彩期倒计时问题
    `,
  },
  {
    version: 'V1.3.6',
    updateTime: '2017-09-23 11:00:00',
    updateContent: `
      1. 下注内容文本长度过长，背景框适配问题
      2. 修复未开盘提示“期次已变化，当前是undefined期”问题
      3. ios状态栏添加网络正在请求状态
    `,
  },
  {
    version: 'V1.3.7',
    updateTime: '2017-10-03 17:00:00',
    updateContent: `
      1. 统一六合彩，pc蛋蛋，时时彩投注空内容时的提示文本
      2. 充值提示自动加小数点调整 Issue #219
      3. 连尾-四碰尾，选择一个球能进行点击确定投注  Issue #217
      4. 中一-八中一，选择1个号码能进行点击确定投注  Issue #218
      5. 特码AB、两面、正码特、正码1-6 切换玩法，所选投注号码应被清除  Issue #270
      6. toast内容为空时不显示
      7. 整理项目目录结构
      8. 六合彩随机选号功能优化
      9. 六合彩刚进入下注页面导航文本显示错误修复 Issue #325
      10. 全部彩种背景透明问题修复 Issue #326
      11. 修复QQ客服点击崩溃问题
    `,
  },
  {
    version: 'V1.4.0',
    updateTime: '2017-10-21 11:00:00',
    updateContent: `
      1. 修复关于我们页面版本号递减问题
      2. CameraRoll截图代码优化
      3. 修复umeng "undefined is not an object (evaluating 'e.play_id')"
      4. 修复umeng "undefined is not an object (evaluating 'l[0].issue_..."
      5. 优化跑马灯代码
      6. 添加codepush同个key下多版本推送功能
      7. 修复赔率为0时注单设定的显示问题
      8. 充值页面充值提示文本优化
    `,
  },
  {
    version: 'V1.4.1',
    updateTime: '2017-10-21 22:00:00',
    updateContent: `
      1. 充值页面布局bug修复
    `,
  },
  {
    version: 'V1.4.2',
    updateTime: '2017-10-25 20:00:00',
    updateContent: `
      1. 修复极速六合彩走势结果问题
    `,
  },
  {
    version: 'V1.4.3',
    updateTime: '2017-11-02 18:00:00',
    updateContent: `
      1. 原生层新增获取多渠道方法，客户端注册添加渠道字端
    `,
  },
  {
    version: 'V2.3.0',
    updateTime: '2017-11-02 18:00:00',
    updateContent: `
      1. 合并milestone 2.3.0
    `,
  },
  {
    version: 'V2.3.1',
    updateTime: '2017-11-02 23:30:00',
    updateContent: `
      1. 修复弹窗逻辑问题
    `,
  },
  {
    version: 'V2.3.2',
    updateTime: '2017-11-03 00:45:00',
    updateContent: `
      1. 注单页撤单样式问题修复
    `,
  },
  {
    version: 'V2.3.3',
    updateTime: '2017-11-03 3:00:00',
    updateContent: `
      1. 修复QQ号码写死问题
      2. 修复平台入款时间无法选择问题
    `,
  },
  {
    version: 'V2.3.4',
    updateTime: '2017-11-03 18:00:00',
    updateContent: `
      1. 下拉刷新后 更新的条目在被滑动到窗口时 才会显示背景色
      2. 重庆时时彩-五星单式(输入框)，点击摇一摇，出现闪退
      3. 时时彩走势图-选择期数100期时，页面向上拉到底部，再选择50期，页面显示空白无数据
      4. 机选&摇一摇 行数跳转不准确
      5. Number.parseInt repair
      6. 修复 时时彩 走势图设置-取消的设置 仍在下次打开时保留
      7. 取消 走势图设置 中的200期选项
      8. 定位胆走势期数显示bug
      9. 追号期数会串bug
      10. 修复ios跑马灯字体偏大问题
      11. 处理umeng上indexOf问题（需观察）

    `,
  },
  {
    version: 'V2.3.5',
    updateTime: '2017-11-07 18:00:00',
    updateContent: `
      1. 注单页过渡动画
      2. 追号页适配
      3. 修复赔率为0时，返点显示问题
      4. 添加提现记录状态
      5. 震动与设置关联
      6. 修改六合彩行间距问题
      7. 安卓机购彩页样式显示问题
      8. 震动状态未关联设置
      9. 近期开奖的多层路由返回问题
      10. ATM选项添加支行地址
      11. 改变消息通知样式
      12. 首页弹窗10秒后自动关闭
      13. 注册时添加QQ
      14. 修复切换注单Tab时，无数据的问题
      15. 修复注单列表数据重复问题
    `,
  },
  {
    version: 'V2.3.6',
    updateTime: '2017-11-08 12:00:00',
    updateContent: `
      1. 收货地址闪退
    `,
  },
  {
    version: 'V2.3.7',
    updateTime: '2017-11-11 21:00:00',
    updateContent: `
      1. 六合彩安卓下主页面开奖记录样式
      2. 修复六合彩七色波蓝绿波下注字段呼唤bug
      3. 修复极速六合彩开奖页面特码颜色样式问题
      4. 注单详情页添加已撤单状态
      5. 登录接口添加登录终端字端
      6. 充值出款详情添加备注字端
      7. 添加充值类型ID
      8. 登录注册接口添加tomeout5秒
    `,
  },
  {
    version: 'V2.3.8',
    updateTime: '2017-11-13 16:00:00',
    updateContent: `
      1. 已登录用户 在首页进试玩页面 不应显示 “已有账号？ 立即登录”
      2. 注单页投注详情调整阴影
      3. 修复注册获取channelID问题
      4. 关闭摇一摇
    `,
  },
  {
    version: 'V2.3.9',
    updateTime: '2017-11-15 18:00:00',
    updateContent: `
      1. 进入PC蛋蛋 再后退 进时时彩走势图 会闪退
      2. 补充登录后弹窗
      3. c81
      4. 修复下注页面上期开奖结构因lotteryid引起的错乱问题
      5. 修复优惠活动页面图片显示不全问题
      6. 银行卡路由
    `,
  },
  {
    version: 'V2.4.43',
    updateTime: '2017-12-xx 00:00:00',
    updateContent: `
      585 608 616 624 626
    `,
  },
  {
    version: 'V2.4.5',
    updateTime: '2017-12-11 00:10:00',
    updateContent: `
      1. 修复android调用NetInfo判断连接状态不稳定问题
    `,
  },
  {
    version: 'V2.4.6',
    updateTime: '2017-12-11 15:00:00',
    updateContent: `
      1. 注单页期数过长折行问题修复
    `,
  },
  {
    version: 'V2.4.7',
    updateTime: '2017-12-11 21:00:00',
    updateContent: `
      1. 移除手机网络状态监听
    `,
  },
  {
    version: 'V2.4.8',
    updateTime: '2017-12-11 23:00:00',
    updateContent: `
      1. 首页进到注册页面,注册完成后点“暂不设置” 闪退问题修复
      2. 好友支付闪退问题修复
    `,
  },
  {
    version: 'V2.4.9',
    updateTime: '2017-12-13 13:00:00',
    updateContent: `
      1. 数字彩pcdd玩法数据持久化
      2. 修复倒计时组建获取期数bug
      3. 走势图优化
    `,
  },
  {
    version: 'V2.4.10',
    updateTime: '2017-12-14 12:00:00',
    updateContent: `
      1. 修复广告弹窗bug
    `,
  },
  {
    version: 'V2.4.11',
    updateTime: '2017-12-14 21:00:00',
    updateContent: `
      1. 修复选好没跳转到注单页
    `,
  },
  {
    version: 'V2.4.12',
    updateTime: '2017-12-17 23:30:00',
    updateContent: `
      1. 修复充值页面路由问题
    `,
  },
  {
    version: 'V2.4.13',
    updateTime: '2017-12-20 23:00:00',
    updateContent: `
      1. 修复首页最新公告只展示一条问题
      2. 修复充值键盘小米手机样式错乱问题
      3. 底部tabbar添加paddingBottom4个像素
    `,
  },
  {
    version: 'V2.4.14',
    updateTime: '2017-12-25 16:00:00',
    updateContent: `
      1. 修复代理注册获取channelName原生层没配导致闪退问题
      2. 注册用户名及密码文案规则调整
      3. 会员中心-提现，输入资金密码， 提示资金密码错误后，一直显示加载中 #647
      4. 团队管理 详情修改 点击其他区域键盘未隐藏
      5. UMNative.onEventWithParameters容错处理（估计个别上架包原生层未引入）
    `,
  },
  {
    version: 'V2.4.15',
    updateTime: '2018-01-03 20:00:00',
    updateContent: `
      1. 登录接口添加channel_name字段
      2. 报告接口返回的html文本异常
      3. 玩法规则更新
      4. 修复六合彩正码过关随机bug
      5. 修复首页跑马灯动画bug
      6. 修复umengPush汇报appKey bug
      7. 修复首页活动轮播图展示不全问题
      8. 下注页玩法说明文本=》玩法规则
      9. 充值说明文案调整
      10. 删除接口返回用户未登录时的Toast提示弹窗
    `,
  },
  {
    version: 'V2.4.16',
    updateTime: '2018-01-04 15:00:00',
    updateContent: `
      1. 修复获取channel Bug
    `,
  },
  {
    version: 'V2.4.17',
    updateTime: '2018-01-11 20:00:00',
    updateContent: `
      1. 修复首页公告跑马灯多个空格会导致换行问题，现在用正则把多个空格变成一个空格
      2. 充值银行卡样式修复
      3. 六合彩 正特尾数，正肖 玩法提示修改
      4. 修复时时彩任选位数错乱问题
    `,
  },
  {
    version: 'V2.4.18x',
    updateTime: '2018-01-24 13:00:00',
    updateContent: `
      1. 试玩账号与正式账号注单详情接口六合彩合肖查询返回bet_odds字段类型不一致，做容错处理
    `,
  },
  {
    version: 'V2.5.0',
    updateTime: '2018-01-27 00:00:00',
    updateContent: `
      1. 六合彩，pcdd 重构
    `,
  },
  {
    version: 'V2.5.1',
    updateTime: '2018-01-27 15:00:00',
    updateContent: `
      1. 注单页面赔率显示两位改成3位
      2. 时时彩单式算注问题修复
    `,
  },
  {
    version: 'V2.5.2',
    updateTime: '2018-01-30 15:00:00',
    updateContent: `
      1. umeng android崩溃容错处理
    `,
  },
  {
    version: 'V2.5.3',
    updateTime: '2018-01-30 19:30:00',
    updateContent: `
      1. 修复android手机model问题
    `,
  },
  {
    version: 'V2.5.4',
    updateTime: '2018-01-31 02:00:00',
    updateContent: `
      1. 修复代理中心bug
      2. 修复umeng报错“undefined is not an object (evaluating 'e.play_id'), stack: randomOrder@669:14222”
    `,
  },
  {
    version: 'V2.5.5',
    updateTime: '2018-01-31 18:30:00',
    updateContent: `
      1. 修复下注页选号点确定按钮没反应问题
    `,
  },
  {
    version: 'V2.5.6',
    updateTime: '2018-02-07 16:11:00',
    updateContent: `
      1. 修复时时彩下注页通过购物车跳转至注单页随机功能问题
      2. 修复“安卓-所有彩种玩法页面添加注单后，投注单页面多次点击“清空”按钮无响应”bug
      3. 选号页选择左上角菜单时添加透明度
      4. 修复注单页字体颜色问题
      5. 修复开奖结果页小屏箭头显示问题
      6. 修复广告背景白色问题
      7. 注单设定赔率两位小数变三位
      8. 收藏接口带上token
      9. 广告弹窗优化，添加文本功能
      10. 走势代码优化
      11. 优惠活动webview增加点击url打开外部浏览器功能
    `,
  },
  {
    version: 'V2.5.7',
    updateTime: '2018-02-08 23:00:00',
    updateContent: `
      1. 六合彩走势bug修复
      2. 玩法规则跳转修复
    `,
  },
  {
    version: 'V2.5.8',
    updateTime: '2018-02-09 17:30:00',
    updateContent: `
      1. 六合彩走势bug修复
      2. PCDD跳转
    `,
  },
  {
    version: 'V2.5.9',
    updateTime: '2018-02-09 23:30:00',
    updateContent: `
      1. 闪屏页（启动页）添加广告图，尺寸650*930
    `,
  },
  {
    version: 'V2.5.10',
    updateTime: '2018-02-14 23:30:00',
    updateContent: `
      1. add redpack
    `,
  },
  {
    version: 'V2.5.11',
    updateTime: '2018-02-17 02:30:00',
    updateContent: `
      1. 修复倒计时小时三位数显示问题
      2. 修复串关可选空注bug
    `,
  },
  {
    version: 'V2.5.12',
    updateTime: '2018-02-18 00:30:00',
    updateContent: `
      1. 修复登录弹出提示框问题
      2. 修复合肖单双问题
    `,
  },
  {
    version: 'V2.5.13',
    updateTime: '2018-03-01 10:39:00',
    updateContent: `
      1. 走势pk10 6~10
      2. 玩法规则
    `,
  },
]

export default updateList
