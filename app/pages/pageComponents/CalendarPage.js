import React, { Component } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'

import HeaderToolBar from '../../components/HeadToolBar'
import Sound from '../../components/clickSound'
import { CalendarList, LocaleConfig } from '../../components/github/react-native-calendars/src'
import { replaceWithDot } from '../../utils'

LocaleConfig.locales['cn'] = {
  monthNames: ['-01','-02','-03','-04','-05','-06','-07','-08','-09','-10','-11','-12'],
  dayNamesShort: ['日','一','二','三','四','五','六'],
}
LocaleConfig.defaultLocale = 'cn'

export default class CalendarPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      range: [],
    }
  }

  handelRangeChange = (range) => {
    this.setState({ range })
  }

  render() {
    const { page, navigation } = this.props
    const { onDateChange } = this.props.navigation.state.params
    const { range } = this.state

    return (
      <View style={styles.container}>
        <HeaderToolBar
          title={page === 'PlatformSecondStep' ? '请选择日期' :'按日期查找'}
          leftIcon={'back'}
          leftIconAction={() => {
            Sound.stop()
            Sound.play()
            navigation.goBack()
          }}/>
        <CalendarList
          page={page}
          pastScrollRange={12}
          onRangeChange={this.handelRangeChange}
          onDateChange={onDateChange}/>
        {page !== 'PlatformSecondStep' &&
          <View style={styles.footer}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: 'gray'}}>    起止日期    </Text>
              <Text>{replaceWithDot(range[0])}</Text>
              {range[0] && <Text>  —  </Text>}
              <Text>{replaceWithDot(range[1])}</Text>
            </View>
            <TouchableOpacity style={styles.btn}
                              onPress={() => {
                                if (range.length >= 2) {
                                  onDateChange(range)
                                  navigation.goBack()
                                }
                              }}>
              <Text style={styles.btnText}>确定</Text>
            </TouchableOpacity>
          </View>}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  footer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btn: {
    backgroundColor: 'red',
    height: 50,
    width: 80,
    justifyContent: 'center',
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
})
