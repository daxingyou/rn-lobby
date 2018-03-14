import React from 'react'
import {
  ScrollView,
  View,
  Text,
  Image,
  Dimensions,
} from 'react-native'
import HeadToolBar from '../../../components/HeadToolBar'
import Config from '../../../config/global'

const { width } = Dimensions.get('window')

const content = [
  {
    title: '1. 走势图',
    above: [
      '走势图是将最近每期的开奖号码用图表的形式直观地呈现出来，便于分析。',
      '如图，在第116期中，号码02在当前开出；而号码01未开出，并且已经有6期未开出了。',
    ],
    image: require('../../../src/img/help_trend.png'),
    ratio: 185/710,
    below: [
      '您可以按需要选择显示最近30期、50期或100期的走势图进行分析。',
    ],
  },
  {
    title: '2. 统计',
    above: [
      '在走势图底部，默认显示每个号码的统计数据供您参考，包括 出现次数、平均遗漏、最大遗漏、最大连出 4项数据，如图：',
    ],
    image: require('../../../src/img/help_stat.png'),
    ratio: 384/710,
    below: [
      '出现次数：统计期数内累计出现的次数',
      '平均遗漏：平均遗漏＝统计期内的总遗漏数 / （出现次数+1）',
      '最大遗漏：统计期数内遗漏的最大值',
      '最大连出：统计期数内连续开出的最大值',
      '',
      '如当前显示的是100期的走势，则统计期数就是100。如您不需要参考这些数据，可以选择隐藏统计。',
    ],
  },
  {
    title: '3. 选号',
    above: [
      '页面底部设有预选行，方便您边看走势边选号，选好之后点击“确认”按钮即可，号码会自动带回投注页面。',
    ],
    image: require('../../../src/img/help_bet.png'),
    ratio: 210/710,
    below: [],
  },
]

const Help = ({ navigation }) => {
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>

      <HeadToolBar
        title={'帮助'}
        leftIcon={'back'}
        leftIconAction={() => navigation.goBack()}/>

      <ScrollView>
        {
          content.map((item, index) => {
            return (
              <View key={index} style={{padding: 10}}>
                <Text style={{color: Config.baseColor, fontSize: 15, marginBottom: 8}}>{item.title}</Text>
                {
                  item.above.map((para, index) => {
                    return (
                      <Text key={index} style={{lineHeight: 20, marginBottom: 3}}>{para}</Text>
                    )
                  })
                }
                <Image source={item.image} style={{width: width-20, height: (width-20)*item.ratio, marginVertical: 10}} />
                {
                  item.below.map((para, index) => {
                    return (
                      <Text key={index} style={{lineHeight: 20, marginBottom: 3}}>{para}</Text>
                    )
                  })
                }
              </View>
            )
          })
        }
      </ScrollView>

    </View>
  )
}

export default Help
