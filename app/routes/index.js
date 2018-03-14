import React from 'react'
import { TabNavigator, StackNavigator } from 'react-navigation'
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStackStyleInterpolator'
import { Platform, Image } from 'react-native'
import Config from '../config/global'

import Splash from '../containers/splash'

//login
import LoginPage from '../pages/login/LoginPage'
import RegisterPage from '../pages/login/RegisterPage'
import RegisterAgent from '../pages/login/RegisterAgent'
import FreeAccountPage from '../pages/login/FreeAccountPage'
import RegisterAgreementPage from '../pages/login/RegisterAgreementPage'

//home
import Home from '../pages/home/main'
import PromotionDetail from '../pages/home/promotionDetail'
import Promotion from '../pages/home/promotion'

//lottery
import LobbyCenter from '../pages/lobby/main'
import Bet from '../pages/lottery/bet'
import LotteryNew from '../pages/LotteryNew/main'
import LhcMainPage from '../pages/lhc/LhcMainPage'
import OrderList from '../pages/lottery/orderList'
import PcddOrderList from '../pages/pcdd/PcddOrderList'
import PlanList from '../pages/lottery/planList'
import Pcdd from '../pages/pcdd/main'
import BetDetailsPage from '../pages/lhc/BetDetailsPage'
import Trend from '../pages/Trend/main'
import LotteryList from '../pages/lobby/lotteryList'
import Help from '../pages/Trend/common/Help'

//draw
import ResultMainPage from '../pages/result/ResultMainPage'
import LotteryListPage from '../pages/result/LotteryListPage'

//order
import RecordMainPage from '../pages/order/RecordMainPage'
import RecordDetailPage from '../pages/order/RecordDetailPage'

//memberCenter
import MemberCenterMainPage from '../pages/memberCenter/MemberCenterMainPage'
import InfoListPage from '../pages/memberCenter/info/InfoListPage'
import RechargeMainPage from '../pages/memberCenter/recharge/RechargeMainPage'
import RechargeIllustratePage from '../pages/memberCenter/recharge/RechargeIllustratePage'
import FriendsPay from '../pages/memberCenter/recharge/FriendsPay'
import PlatformCashPage from '../pages/memberCenter/recharge/PlatformCashPage'
import WebViewPage from '../pages/pageComponents/WebViewPage'
import WithDrawCashPage from '../pages/memberCenter/withDrawCash/WithDrawCashPage'
import CheckDetailPage from '../pages/memberCenter/withDrawCash/CheckDetailPage'
import LimitIllustratePage from '../pages/memberCenter/withDrawCash/LimitIllustratePage'
import Rules from '../pages/memberCenter/Rules/main' //玩法规则
import AccountDetailMainPage from '../pages/memberCenter/accountDetail/AccountDetailMainPage'
import RechargeRecordPage from '../pages/memberCenter/record/RechargeRecordPage'
import WithDrawRecordPage from '../pages/memberCenter/record/WithDrawRecordPage'
import AgentMain from '../pages/memberCenter/agent/agentMain' //代理中心
import AgentDesc from '../pages/memberCenter/agent/agentDesc'
import SubAccount from '../pages/memberCenter/agent/subAccount'
import Report from '../pages/memberCenter/agent/report'
import CurStatDetail from '../pages/memberCenter/agent/curStatDetail'
import TeamMgmt from '../pages/memberCenter/agent/teamMgmt'
import CalendarPage from '../pages/pageComponents/CalendarPage'
import BonusMainPage from '../pages/memberCenter/bonus/BonusMainPage'
import SettingPage from '../pages/memberCenter/SettingPage'
import BankCardMainPage from '../pages/memberCenter/setting/BankCardMainPage'
import BankCardAddPage from '../pages/memberCenter/setting/BankCardAddPage'
import AboutMePage from '../pages/memberCenter/setting/AboutMePage'
import ModifyLoginPwdPage from '../pages/memberCenter/setting/ModifyLoginPwdPage'
import FundPwdPage from '../pages/memberCenter/setting/FundPwdPage'
import SettingDetailMainPage from '../pages/memberCenter/settingDetail/SettingDetailMainPage'
import CollectionMainPage from '../pages/memberCenter/collection/CollectionMainPage'
import InfoMainPage from '../pages/memberCenter/info/InfoMainPage'

const isIOS = Platform.OS === 'ios'

const StackNavigatorConfig = {
  mode: 'card',
  headerMode: 'screen',
  transitionConfig:()=>({
      screenInterpolator:CardStackStyleInterpolator.forHorizontal,
  }),
}

const subpageOpt = {
  header: null,
  tabBarVisible: false,
}

const CommonAuth = {
  LoginPage: {
    screen: LoginPage,
    path: 'LoginPage',
    navigationOptions: subpageOpt,
  },
  RegisterPage: {
    screen: RegisterPage,
    path: 'RegisterPage',
    navigationOptions: subpageOpt,
  },
  RegisterAgent: {
    screen: RegisterAgent,
    path: 'RegisterAgent',
    navigationOptions: subpageOpt,
  },
  FreeAccountPage: {
    screen: FreeAccountPage,
    path: 'FreeAccountPage',
    navigationOptions: subpageOpt,
  },
  RegisterAgreementPage: {
    screen: RegisterAgreementPage,
    path: 'RegisterAgreementPage',
    navigationOptions: subpageOpt,
  },
  FundPwdPage: {
    screen: FundPwdPage,
    path: 'FundPwdPage',
    navigationOptions: subpageOpt,
  },
}

const CommonLottery = {
  Bet: {
    screen: Bet,
    path: 'Bet',
    navigationOptions: subpageOpt,
  },
  LotteryNew: {
    screen: LotteryNew,
    path: 'LotteryNew',
    navigationOptions: subpageOpt,
  },
  OrderList: {
    screen: OrderList,
    path: 'OrderList',
    navigationOptions: subpageOpt,
  },
  PcddOrderList: {
    screen: PcddOrderList,
    path: 'PcddOrderList',
    navigationOptions: subpageOpt,
  },
  PlanList: {
    screen: PlanList,
    path: 'PlanList',
    navigationOptions: subpageOpt,
  },
  LhcMainPage: {
    screen: LhcMainPage,
    path: 'LhcMainPage',
    navigationOptions: subpageOpt,
  },
  RecordDetailPage: {
    screen: RecordDetailPage,
    path: 'RecordDetailPage',
    navigationOptions: subpageOpt,
  },
  Pcdd: {
    screen: Pcdd,
    path: 'Pcdd',
    navigationOptions: subpageOpt,
  },
  BetDetailsPage: {
    screen: BetDetailsPage,
    path: 'BetDetailsPage',
    navigationOptions: subpageOpt,
  },
  LotteryListPage: {
    screen: LotteryListPage,
    path: 'LotteryListPage',
    navigationOptions: subpageOpt,
  },
  Rules: {
    screen: Rules,
    path: 'Rules',
    navigationOptions: subpageOpt,
  },
  RecordMainPage: {
    screen: RecordMainPage,
    path: 'RecordMainPage',
    navigationOptions: subpageOpt,
  },
  Trend: {
    screen: Trend,
    path: 'Trend',
    navigationOptions: subpageOpt,
  },
  Help: {
    screen: Help,
    path: 'Help',
    navigationOptions: subpageOpt,
  },
}

const commonRecharge = {
  RechargeMainPage: {
    screen: RechargeMainPage,
    path: 'RechargeMainPage',
    navigationOptions: subpageOpt,
  },
  RechargeIllustratePage: {
    screen: RechargeIllustratePage,
    path: 'RechargeIllustratePage',
    navigationOptions: subpageOpt,
  },
  FriendsPay: {
    screen: FriendsPay,
    path: 'FriendsPay',
    navigationOptions: subpageOpt,
  },
  PlatformCashPage: {
    screen: PlatformCashPage,
    path: 'PlatformCashPage',
    navigationOptions: subpageOpt,
  },
  WebViewPage: {
    screen: WebViewPage,
    path: 'WebViewPage',
    navigationOptions: subpageOpt,
  },
}

const MainStack = StackNavigator({
  Home: {
    screen: Home,
    path: 'Home',
    navigationOptions: {
      header: null,
    },
  },
  ...CommonLottery,
  ...CommonAuth,
  ...commonRecharge,
  PromotionDetail: {
    screen: PromotionDetail,
    path: 'PromotionDetail',
    navigationOptions: subpageOpt,
  },
  Promotion: {
    screen: Promotion,
    path: 'Promotion',
    navigationOptions: subpageOpt,
  },
  InfoListPage: {
    screen: InfoListPage,
    path: 'InfoListPage',
    navigationOptions: subpageOpt,
  },
  Rules: {
    screen: Rules,
    path: 'Rules',
    navigationOptions: subpageOpt,
  },
}, StackNavigatorConfig)

const LobbyStack = StackNavigator({
  LobbyCenter: {
    screen: LobbyCenter,
    path: 'LobbyCenter',
    navigationOptions: {
      header: null,
    },
  },
  ...CommonLottery,
  ...CommonAuth,
  ...commonRecharge,
  LotteryList: {
    screen: LotteryList,
    path: 'LotteryList',
    navigationOptions: subpageOpt,
  },
  Rules: {
    screen: Rules,
    path: 'Rules',
    navigationOptions: subpageOpt,
  },
}, StackNavigatorConfig)

const ResultStack = StackNavigator({
  ResultMainPage: {
    screen: ResultMainPage,
    path: 'ResultMainPage',
    navigationOptions: {
      header: null,
    },
  },
  LotteryListPage: {
    screen: LotteryListPage,
    path: 'LotteryListPage',
    navigationOptions: subpageOpt,
  },
  ...CommonLottery,
  ...CommonAuth,
  ...commonRecharge,
}, StackNavigatorConfig)

const RecordStack = StackNavigator({
  RecordMain: {
    screen: RecordMainPage,
    path: 'RecordMainPage',
    navigationOptions: {
      header: null,
    },
  },
  ...CommonLottery,
  ...CommonAuth,
  ...commonRecharge,
}, StackNavigatorConfig)

const MemberCenterStack = StackNavigator({
  MemberCenterMainPage: {
    screen: MemberCenterMainPage,
    path: 'MemberCenterMainPage',
    navigationOptions: {
      header: null,
    },
  },
  ...CommonAuth,
  ...CommonLottery,
  ...commonRecharge,
  WithDrawCashPage: {
    screen: WithDrawCashPage,
    path: 'WithDrawCashPage',
    navigationOptions: subpageOpt,
  },
  CheckDetailPage: {
    screen: CheckDetailPage,
    path: 'CheckDetailPage',
    navigationOptions: subpageOpt,
  },
  LimitIllustratePage: {
    screen: LimitIllustratePage,
    path: 'LimitIllustratePage',
    navigationOptions: subpageOpt,
  },
  AccountDetailMainPage: {
    screen: AccountDetailMainPage,
    path: 'AccountDetailMainPage',
    navigationOptions: subpageOpt,
  },
  RechargeRecordPage: {
    screen: RechargeRecordPage,
    path: 'RechargeRecordPage',
    navigationOptions: subpageOpt,
  },
  WithDrawRecordPage: {
    screen: WithDrawRecordPage,
    path: 'WithDrawRecordPage',
    navigationOptions: subpageOpt,
  },
  AgentMain: {
    screen: AgentMain,
    path: 'AgentMain',
    navigationOptions: subpageOpt,
  },
  AgentDesc: {
    screen: AgentDesc,
    path: 'AgentDesc',
    navigationOptions: subpageOpt,
  },
  SubAccount: {
    screen: SubAccount,
    path: 'SubAccount',
    navigationOptions: subpageOpt,
  },
  TeamMgmt: {
    screen: TeamMgmt,
    path: 'TeamMgmt',
    navigationOptions: subpageOpt,
  },
  CalendarPage: {
    screen: CalendarPage,
    path: 'CalendarPage',
    navigationOptions: subpageOpt,
  },
  Report: {
    screen: Report,
    path: 'Report',
    navigationOptions: subpageOpt,
  },
  CurStatDetail: {
    screen: CurStatDetail,
    path: 'CurStatDetail',
    navigationOptions: subpageOpt,
  },
  BonusMainPage: {
    screen: BonusMainPage,
    path: 'BonusMainPage',
    navigationOptions: subpageOpt,
  },
  ModifyLoginPwdPage: {
    screen: ModifyLoginPwdPage,
    path: 'ModifyLoginPwdPage',
    navigationOptions: subpageOpt,
  },
  BankCardMainPage: {
    screen: BankCardMainPage,
    path: 'BankCardMainPage',
    navigationOptions: subpageOpt,
  },
  BankCardAddPage: {
    screen: BankCardAddPage,
    path: 'BankCardAddPage',
    navigationOptions: subpageOpt,
  },
  Rules: {
    screen: Rules,
    path: 'Rules',
    navigationOptions: subpageOpt,
  },
  SettingDetailMainPage: {
    screen: SettingDetailMainPage,
    path: 'SettingDetailMainPage',
    navigationOptions: subpageOpt,
  },
  InfoMainPage: {
    screen: InfoMainPage,
    path: 'InfoMainPage',
    navigationOptions: subpageOpt,
  },
  InfoListPage: {
    screen: InfoListPage,
    path: 'InfoListPage',
    navigationOptions: subpageOpt,
  },
  SettingPage: {
    screen: SettingPage,
    path: 'SettingPage',
    navigationOptions: subpageOpt,
  },
  AboutMePage: {
    screen: AboutMePage,
    path: 'AboutMePage',
    navigationOptions: subpageOpt,
  },
  CollectionMainPage: {
    screen: CollectionMainPage,
    path: 'CollectionMainPage',
    navigationOptions: {
      header: null,
      tabBarVisible: true,
    },
  },
}, StackNavigatorConfig)

const TabBarItem = (focused, icon, selectedIcon) => (
  <Image
    source={focused ? selectedIcon : icon}
    style={{ width: 24, height: 24 }}
    resizeMode='contain'/>
)

const MyTab = TabNavigator({
  MainStack: {
    screen: MainStack,
    path: 'MainStack',
    navigationOptions: {
      header: null,
      tabBarLabel: '首页',
      headerBackTitle: null,
      tabBarIcon: ({focused, tintColor}) => (
        TabBarItem( focused, require('../src/img/home.png'), require('../src/img/home-full.png'), tintColor)
      ),
      headerTintColor: '#fff',
      headerTitleStyle: {
        alignSelf: 'center',
      },
    },
  },
  LobbyStack: {
    screen: LobbyStack,
    path: 'LobbyStack',
    navigationOptions: {
      header: null,
      tabBarLabel: '购彩',
      headerBackTitle: null,
      tabBarIcon: ({focused, tintColor}) => (
        TabBarItem( focused, require('../src/img/buy.png'), require('../src/img/buy-full.png'), tintColor)
      ),
      headerTintColor: '#fff',
      headerTitleStyle: {
        alignSelf: 'center',
      },
    },
  },
  ResultStack: {
    screen: ResultStack,
    path: 'ResultStack',
    navigationOptions: {
      header: null,
      tabBarLabel: '开奖',
      headerBackTitle: null,
      tabBarIcon: ({focused, tintColor}) => (
        TabBarItem( focused, require('../src/img/lottery.png'), require('../src/img/lottery-full.png'), tintColor)
      ),
      headerTintColor: '#fff',
      headerTitleStyle: {
        alignSelf: 'center',
      },
    },
  },
  RecordStack: {
    screen: RecordStack,
    path: 'RecordStack',
    navigationOptions: {
      header: null,
      tabBarLabel: '注单',
      headerBackTitle: null,
      tabBarIcon: ({focused, tintColor}) => (
        TabBarItem( focused, require('../src/img/bills.png'), require('../src/img/bills-full.png'), tintColor)
      ),
      headerTintColor: '#fff',
      headerTitleStyle: {
        alignSelf: 'center',
      },
    },
  },
  MemberCenterStack: {
    screen: MemberCenterStack,
    path: 'MemberCenterStack',
    navigationOptions: {
      header: null,
      tabBarLabel: '会员中心',
      headerBackTitle: null,
      tabBarIcon: ({focused, tintColor}) => (
        TabBarItem( focused, require('../src/img/user.png'), require('../src/img/user-full.png'), tintColor)
      ),
      headerTintColor: '#fff',
      headerTitleStyle: {
        alignSelf: 'center',
      },
    },
  },
}, {
  initialRouteName: 'MainStack',
  tabBarPosition : 'bottom',
  swipeEnabled: false,
  animationEnabled: isIOS ? true : false,
  backBehavior: 'none',
  lazy: isIOS ? false : true,
  tabBarOptions: {
    // tabbar上label的style
    labelStyle: {
      margin: 0,
      fontSize: 11,
    },
    // tabbar的Iconstyle
    iconStyle: {
      height: 24,
      width: 24,
      margin: 0,
    },
    // tabbar的style
    style: {
      height: 49,
      backgroundColor: '#FAFCFF',
      paddingBottom: 4,
    },
    // label和icon的背景色 活跃状态下
    activeBackgroundColor: 'white',
    // label和icon的前景色 活跃状态下（选中）
    activeTintColor: Config.baseColor,
    // label和icon的背景色 不活跃状态下
    inactiveBackgroundColor: 'white',
    // label和icon的前景色 不活跃状态下(未选中)
    inactiveTintColor: '#9F9F9F',
    showIcon: true,
    // 是否显示label，默认为true
    showLabel: true,
    // 不透明度为按选项卡(isIOS和Android < 5.0)
    pressOpacity: 0.3,
    indicatorStyle: {
      height: 0, // android 中TabBar下面会显示一条线，高度设为 0 后就不显示线了,
    },
  },
})

const AppNavigator = StackNavigator({
  Splash: {
    screen: Splash,
    path: 'Splash',
    navigationOptions: {
      header: null,
    },
  },
  MyTab: {
    screen: MyTab,
    path: 'MyTab',
  },
}, StackNavigatorConfig)

export default AppNavigator
