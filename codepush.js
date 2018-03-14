const { execSync } = require("child_process")

const apps = [
  {
    name: 'c9',
    user: 'c9',
    config: 'c9',
    app_android: 'hatsune-android',
    app_ios: 'hatsune-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp111',
    user: 'cp111',
    config: 'cp111',
    app_android: 'hatsune-android',
    app_ios: 'hatsune-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp899',
    user: 'admin',
    config: 'cp899',
    app_android: 'hatsune-android',
    app_ios: 'hatsune-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.1.2', '1.0.0', '1.1.0'],
  },
  {
    name: 'cp500w4',
    user: 'lottery',
    config: 'cp500w4',
    app_android: 'cp500w4-android',
    app_ios: 'cp500w4-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'k3cp',
    user: 'lottery',
    config: 'k3cp',
    app_android: 'k3cp-android',
    app_ios: 'k3cp-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp500',
    user: 'cp500',
    config: 'cp500',
    app_android: 'hatsune-android',
    app_ios: 'hatsune-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp500y',
    user: 'cp500y',
    config: 'cp500y',
    app_android: 'hatsune-android',
    app_ios: 'hatsune-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.1.1', '1.0.0'],
  },
  {
    name: 'cpcp',
    user: 'cpcp',
    config: 'cpcp',
    app_android: 'hatsune-android',
    app_ios: 'hatsune-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'duocai',
    user: 'lottery',
    config: 'duocai',
    app_android: 'dccp-android',
    app_ios: 'duocaiwang-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp7070',
    user: 'lottery',
    config: 'cp7070',
    app_android: 'cp7070-android',
    app_ios: 'cp7070-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp555',
    user: 'lottery',
    config: 'cp555',
    app_android: 'cp555-android',
    app_ios: 'cp555-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'yccp',
    user: 'lottery',
    config: 'yccp',
    app_android: 'yccp-android',
    app_ios: 'yccp-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'tcw',
    user: 'lottery',
    config: 'tcw',
    app_android: 'tcw-android',
    app_ios: 'tcw-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'lccp',
    user: 'lottery',
    config: 'lccp',
    app_android: 'lccp-android',
    app_ios: 'lccp-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp500w',
    user: 'lottery',
    config: 'cp500w',
    app_android: 'w500cp-android',
    app_ios: 'w500cp-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp8888',
    user: 'lottery',
    config: 'cp8888',
    app_android: 'cp8888-android',
    app_ios: 'cp8888-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0', '1.0.0'],
  },
  {
    name: 'cp88',
    user: 'lottery',
    config: 'cp88',
    app_android: 'cpbb-android',
    app_ios: 'cpbb-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp361',
    user: 'lottery',
    config: 'cp361',
    app_android: 'cp361-android',
    app_ios: 'cp361-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'c02',
    user: 'lottery',
    config: 'c02',
    app_android: 'c02-android',
    app_ios: 'c02-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.1', '1.0.0'],
  },
  {
    name: 'cp99',
    user: 'lottery',
    config: 'cp99',
    app_android: 'cp99-android',
    app_ios: 'cp99-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'c29',
    user: 'lottery',
    config: 'c29',
    app_android: 'c29-android',
    app_ios: 'c29-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0', '11.0.3'],
  },
  {
    name: 'yicaicp',
    user: 'lottery',
    config: 'yicaicp',
    app_android: 'yicaicp-android',
    app_ios: 'yicaicp-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp500w2',
    user: 'lottery',
    config: 'cp500w2',
    app_android: 'cp500w2-android',
    app_ios: 'cp500w2-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp500w3',
    user: 'lottery',
    config: 'cp500w3',
    app_android: 'cp500w3-android',
    app_ios: 'cp500w3-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'ssc',
    user: 'lottery',
    config: 'ssc',
    app_android: 'ssccp-android',
    app_ios: 'ssccp-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'xyc',
    user: 'lottery',
    config: 'xyc',
    app_android: 'xyc-android',
    app_ios: 'xyc-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp9a',
    user: 'lottery',
    config: 'cp9a',
    app_android: 'cp9a-android',
    app_ios: 'cp9a-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp336',
    user: 'lottery',
    config: 'cp336',
    app_android: 'cp336-android',
    app_ios: 'cp336-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.3.4', '1.0.0'],
  },
  {
    name: 'cp500x2',
    user: 'lottery',
    config: 'cp500x2',
    app_android: 'cp500x2-android',
    app_ios: 'cp500x2-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp500x3',
    user: 'lottery',
    config: 'cp500x3',
    app_android: 'cp500x3-android',
    app_ios: 'cp500x3-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp500x4',
    user: 'lottery',
    config: 'cp500x4',
    app_android: 'cp500x4-android',
    app_ios: 'cp500x4-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'shunfengcp',
    user: 'lottery',
    config: 'shunfengcp',
    app_android: 'shunfengcp-android',
    app_ios: 'shunfengcp-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp1516',
    user: 'lottery',
    config: 'cp1516',
    app_android: 'cp1516-android',
    app_ios: 'cp1516-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp916',
    user: 'lottery',
    config: 'cp916',
    app_android: 'cp916-android',
    app_ios: 'cp916-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'], //app store 1.0.1版本应用包上错了，没截图功能，须切到916分支更新
  },
  {
    name: 'c81',
    user: 'lottery',
    config: 'c81',
    app_android: 'c81-android',
    app_ios: 'c81-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'wmcp',
    user: 'lottery',
    config: 'wmcp',
    app_android: 'wmcp-android',
    app_ios: 'wmcp-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'shunfengcp3',
    user: 'lottery',
    config: 'shunfengcp3',
    app_android: 'shunfengcp3-android',
    app_ios: 'shunfengcp3-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'zcp',
    user: 'lottery',
    config: 'zcp',
    app_android: 'zcp-android',
    app_ios: 'zcp-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'c222',
    user: 'lottery',
    config: 'c222',
    app_android: 'c222-android',
    app_ios: 'c222-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp5050',
    user: 'lottery',
    config: 'cp5050',
    app_android: 'cp5050-android',
    app_ios: 'cp5050-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'zgc',
    user: 'lottery',
    config: 'zgc',
    app_android: 'zgc-android',
    app_ios: 'zgc-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'dfc',
    user: 'lottery',
    config: 'dfc',
    app_android: 'dfc-android',
    app_ios: 'dfc-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'xyc3',
    user: 'lottery',
    config: 'xyc3',
    app_android: 'xyc3-android',
    app_ios: 'xyc3-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'ncw',
    user: 'lottery',
    config: 'ncw',
    app_android: 'ncw-android',
    app_ios: 'ncw-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp29x2',
    user: 'lottery',
    config: 'cp29x2',
    app_android: 'cp29x2-android',
    app_ios: 'cp29x2-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'c6',
    user: 'lottery',
    config: 'c6',
    app_android: 'c6-android',
    app_ios: 'c6-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'wfccp',
    user: 'lottery',
    config: 'wfccp',
    app_android: 'wfccp-android',
    app_ios: 'wfccp-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'xycp2',
    user: 'lottery',
    config: 'xycp2',
    app_android: 'xycp2-android',
    app_ios: 'xycp2-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0', '1.0'],
  },
  {
    name: 'bycpw',
    user: 'lottery',
    config: 'bycpw',
    app_android: 'bycpw-android',
    app_ios: 'bycpw-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp7c',
    user: 'lottery',
    config: 'cp7c',
    app_android: 'cp7c-android',
    app_ios: 'cp7c-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'c36',
    user: 'lottery',
    config: 'c36',
    app_android: 'c36-android',
    app_ios: 'c36-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'c48',
    user: 'lottery',
    config: 'c48',
    app_android: 'c48-android',
    app_ios: 'c48-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp703',
    user: 'lottery',
    config: 'cp703',
    app_android: 'cp703-android',
    app_ios: 'cp703-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cpbw',
    user: 'lottery',
    config: 'cpbw',
    app_android: 'cpbw-android',
    app_ios: 'cpbw-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp1216',
    user: 'lottery',
    config: 'cp1216',
    app_android: 'cp1216-android',
    app_ios: 'cp1216-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'aicai',
    user: 'lottery',
    config: 'aicai',
    app_android: 'aicai-android',
    app_ios: 'aicai-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'zcw',
    user: 'lottery',
    config: 'zcw',
    app_android: 'zcw-android',
    app_ios: 'zcw-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'c45',
    user: 'lottery',
    config: 'c45',
    app_android: 'c45-android',
    app_ios: 'c45-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'lequcai',
    user: 'lottery',
    config: 'lequcai',
    app_android: 'lequcai-android',
    app_ios: 'lequcai-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp3hao',
    user: 'lottery',
    config: 'cp3hao',
    app_android: 'cp3hao-android',
    app_ios: 'cp3hao-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'dayingjia2',
    user: 'lottery',
    config: 'dayingjia2',
    app_android: 'dayingjia2-android',
    app_ios: 'dayingjia2-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'fuxingcai',
    user: 'lottery',
    config: 'fuxingcai',
    app_android: 'fuxingcai-android',
    app_ios: 'fuxingcai-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'juxingcai',
    user: 'lottery',
    config: 'juxingcai',
    app_android: 'juxingcai-android',
    app_ios: 'juxingcai-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'dayingjia',
    user: 'lottery',
    config: 'dayingjia',
    app_android: 'dayingjia-android',
    app_ios: 'dayingjia-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'dayingjia3',
    user: 'lottery',
    config: 'dayingjia3',
    app_android: 'dayingjia3-android',
    app_ios: 'dayingjia3-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'c899',
    user: 'lottery',
    config: 'c899',
    app_android: 'c899-android',
    app_ios: 'c899-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp188',
    user: 'lottery',
    config: 'cp188',
    app_android: 'cp188-android',
    app_ios: 'cp188-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'diyicaipiao',
    user: 'lottery',
    config: 'diyicaipiao',
    app_android: 'diyicaipiao-android',
    app_ios: 'diyicaipiao-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'dayingjia4',
    user: 'lottery',
    config: 'dayingjia4',
    app_android: 'dayingjia4-android',
    app_ios: 'dayingjia4-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'c76',
    user: 'lottery',
    config: 'c76',
    app_android: 'c76-android',
    app_ios: 'c76-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'aicai2',
    user: 'lottery',
    config: 'aicai2',
    app_android: 'aicai2-android',
    app_ios: 'aicai2-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp588',
    user: 'lottery',
    config: 'cp588',
    app_android: 'cp588-android',
    app_ios: 'cp588-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp55',
    user: 'lottery',
    config: 'cp55',
    app_android: 'cp55-android',
    app_ios: 'cp55-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp9',
    user: 'lottery',
    config: 'cp9',
    app_android: 'cp9-android',
    app_ios: 'cp9-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp688',
    user: 'lottery',
    config: 'cp688',
    app_android: 'cp688-android',
    app_ios: 'cp688-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'gaoxingcp',
    user: 'lottery',
    config: 'gaoxingcp',
    app_android: 'gaoxingcp-android',
    app_ios: 'gaoxingcp-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'xycp3',
    user: 'lottery',
    config: 'xycp3',
    app_android: 'xycp3-android',
    app_ios: 'xycp3-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp500500',
    user: 'lottery',
    config: 'cp500500',
    app_android: 'cp500500-android',
    app_ios: 'cp500500-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp99x2',
    user: 'lottery',
    config: 'cp99x2',
    app_android: 'cp99x2-android',
    app_ios: 'cp99x2-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp500x5',
    user: 'lottery',
    config: 'cp500x5',
    app_android: 'cp500x5-android',
    app_ios: 'cp500x5-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'jingcai',
    user: 'lottery',
    config: 'jingcai',
    app_android: 'jingcai-android',
    app_ios: 'jingcai-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'c8800',
    user: 'lottery',
    config: 'c8800',
    app_android: 'c8800-android',
    app_ios: 'c8800-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp500w5',
    user: 'lottery',
    config: 'cp500w5',
    app_android: 'cp500w5-android',
    app_ios: 'cp500w5-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp3a',
    user: 'lottery',
    config: 'cp3a',
    app_android: 'cp3a-android',
    app_ios: 'cp3a-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'aitou',
    user: 'lottery',
    config: 'aitou',
    app_android: 'aitou-android',
    app_ios: 'aitou-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'dayingjia5',
    user: 'lottery',
    config: 'dayingjia5',
    app_android: 'dayingjia5-android',
    app_ios: 'dayingjia5-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp777',
    user: 'lottery',
    config: 'cp777',
    app_android: 'cp777-android',
    app_ios: 'cp777-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'fhcp',
    user: 'lottery',
    config: 'fhcp',
    app_android: 'fhcp-android',
    app_ios: 'fhcp-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'liucai',
    user: 'lottery',
    config: 'liucai',
    app_android: 'liucai-android',
    app_ios: 'liucai-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'cp33dg',
    user: 'lottery',
    config: 'cp33dg',
    app_android: 'cp33dg-android',
    app_ios: 'cp33dg-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'kosun',
    user: 'admin',
    config: 'kosun',
    app_android: 'kosun-android',
    app_ios: 'kosun-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'test',
    user: 'admin',
    config: 'test',
    app_android: 'test-android',
    app_ios: 'test-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'feature1',
    user: 'admin',
    config: 'feature1',
    app_android: 'feature1-android',
    app_ios: 'feature1-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'feature4',
    user: 'admin',
    config: 'feature4',
    app_android: 'feature4-android',
    app_ios: 'feature4-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
  {
    name: 'stable',
    user: 'admin',
    config: 'stable',
    app_android: 'stable-android',
    app_ios: 'stable-ios',
    version_android: ['1.0.0'],
    version_ios: ['1.0.0'],
  },
]

const codepush = {
  admin: {
    email: 'admin@example.com',
    key: 'H6N13mR5As01BSfiLPEefwquimaJ4ksvOXqog'
  },
  c9: {
    email: 'cai9caipiao@kosun.com',
    key: 'tBnycPJEkP5T5Q0pm0NX1jQGC0ub4ksvOXqof'
  },
  cpcp: {
    email: 'cpcaipiao@kosun.com',
    key: 'EW3nxicAUCLHU9CKghPjr5Psy5v14ksvOXqoe'
  },
  cp111: {
    email: '111cp@kosun.com',
    key: 'Osipw5usFaGzS1sUuDSeqGTadahg4ksvOXqoc'
  },
  cp500y: {
    email: 'kosun888@outlook.com',
    key: 'sJedLgh1ZnP7JJNUBo4tkgdHK9X0YD6GbGUlN'
  },
  cp500: {
    email: 'cp500w@kosun.com',
    key: 'itr31pC6H5egugh29uxOQSA1dcZ34ksvOXqod'
  },
  lottery: {
    email: 'lottery@kosun.com',
    key: 'uyZBMPBzkD2L8ranqHUMETbFou1b6ksvOPqes'
  }
}

let log = 'codepush start!'
console.log(log)

let params = process.argv
let platform = 'all'
let appName = null
let deployment = 'Production'
if (params[2]) {
  platform = params[2]
}
if (params[4]) {
  deployment = params[4]
}

const doPush = (app) => {
  console.log(`=================== ${app.name} ${platform} start`);

  execSync(`cp -f multiChannel/${app.config}/* app/config/`, {stdio: [0, 1, 2]})

  try {
    execSync('code-push logout', {stdio: [0, 1, 2]})
  } catch (e) {
    console.log(e.toString());
  } finally {
    execSync(`code-push login https://api.codepush.cc --accessKey ${codepush[app.user].key}`, {stdio: [0, 1, 2]})
  }

  if (app['version_' + platform]) {
    for (let version of app['version_' + platform]) {
      console.log(`###### version: ${version}`);
      execSync(`code-push release-react ${app['app_' + platform]} ${platform} -d ${deployment} -t ${version}`, {stdio: [0, 1, 2]})
    }
  } else {
    console.log(`${appName} has no ${platform} version `);
  }

  console.log(`=================== ${app.name} ${platform} end`);
}

if (params[3]) {
  appName = params[3]
  let app = apps.filter(n => n.name === appName)[0]
  if (!app) {
    console.log('Please enter the correct application name')
  } else {
    console.log(app.name);
    console.log('platform', platform)
    if (platform === 'all') {
      ['ios', 'android'].map((item, index) => {
        platform = item
        return doPush(app)
      })
    } else {
      doPush(app)
    }
  }
} else {
  if (platform == 'all') {
    let platforms = ['ios', 'android']
    for (let pf of platforms) {
      platform = pf
      for (let app of apps) {
        doPush(app)
      }
    }
  } else {
    for (let app of apps) {
      doPush(app)
    }
  }
}

log = 'codepush end!'
console.log(log)
