import React, { Component } from 'react'
import { View, Image, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native'
import Sound from '../../../components/clickSound'
const { width } = Dimensions.get('window')

const FEATURES = [
  { action: 'subAccount', text: '下级开户', imgSrc: require('../../../src/img/agent_sub_ccount.png') },
  { action: 'teamMgmt', text: '团队管理', imgSrc: require('../../../src/img/agent_team_mgt.png') },
  { action: 'report', text: '报表', imgSrc: require('../../../src/img/agent_report.png') },
]
const iconArrow = require('../../../src/img/agent_arrow.png')

export default class AgentMain extends Component {
  constructor(props) {
    super(props)
    this._onPressFeature = this._onPressFeature.bind(this)
    this.toggleRebateDropDown = this.toggleRebateDropDown.bind(this)
    this.getHighestRebate = this.getHighestRebate.bind(this)
    this.state = {
      showOtherRebate: false,
    }
  }

  _onPressFeature(action) {
    const { userInfo } = this.props.navigation.state.params
    const { navigation } = this.props
    if (action === 'subAccount') {
      navigation.navigate('SubAccount', {userInfo})
    } else if (action === 'teamMgmt') {
      navigation.navigate('TeamMgmt', {userInfo})
    } else if (action === 'report') {
      navigation.navigate('Report', {userInfo})
    }
  }
  toggleRebateDropDown (status) {
    Sound.stop()
    Sound.play()
    this.setState({
      showOtherRebate: status,
    })
  }
  getHighestRebate() {
    const { userInfo } = this.props.navigation.state.params
    let rebate = ''
    userInfo.rebate.forEach((item) => {
      rebate = Number(rebate) > Number(item.userRebate) ? Number(rebate) : Number(item.userRebate)
    })
    return rebate.toFixed(2)
  }
  render() {
    const { userInfo  } = this.props.navigation.state.params
    const { token } = userInfo
    const { navigation } = this.props
    let data = FEATURES
    if ((data.length) % 2 !== 0) {
      data.push({})
    }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image style={styles.headerBg} source={require('../../../src/img/agent_header.png')}>
            <View style={styles.nav}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.navLeft}
                onPress={() => {
                  Sound.stop()
                  Sound.play()
                  navigation.goBack()
                }}>
                <Image style={styles.backIcon} source={require('../../../src/img/ic_back.png')} />
              </TouchableOpacity>
              <View style={styles.navCenter}>
                <Text style={styles.userNameText}>{userInfo.user_name}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.navRight}
                onPress={() => {
                  Sound.stop()
                  Sound.play()
                  navigation.navigate('AgentDesc', { token })
                }}>
                <Image style={styles.questionIcon} source={require('../../../src/img/ic_question.png')} />
              </TouchableOpacity>
            </View>
            <View style={styles.userInfoWrap}>
              <View style={styles.balance}>
                <Text style={styles.userInfoText}>
                  {`余额：${userInfo.account_balance}`}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.highestRebate}
                onPress={() => this.toggleRebateDropDown(!this.state.showOtherRebate)}>
                <Text style={[styles.userInfoText, {marginLeft: 20}]}>
                  {`最高返点：${this.getHighestRebate()}`}
                </Text>
                <Image style={[styles.arrowIcon, this.state.showOtherRebate && {transform: [{ rotate: '-180deg'}]}]}
                       source={iconArrow} />
              </TouchableOpacity>
            </View>
          </Image>
        </View>
        {
          this.state.showOtherRebate && (
            <View style={styles.rebateDropdown}>
              <View style={styles.rebateContent}>
                {
                  !!userInfo.rebate && userInfo.rebate.map((item, index) => {
                    return (
                      <Text key={index} style={styles.rebateItem}>
                          {`${item.categoryName}返点：${item.userRebate}`}
                      </Text>
                    )
                 })
                }
              </View>
            </View>
          )
        }
        <View style={styles.featuresWrap}>
        {
          data.map((item, index) => {
            if (item) {
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.feature, (index + 1) % 2 === 0 && {borderRightWidth: 0}]}
                  activeOpacity={1}
                  onPress={() => {
                    Sound.stop()
                    Sound.play()
                    this._onPressFeature(item.action)
                  }}>
                  <Image style={styles.featureIcon} source={item.imgSrc} />
                  <Text style={styles.featureText}>{item.text}</Text>
                </TouchableOpacity>
              )
            } else {
              return (
                <View
                  key={index}
                  style={[styles.feature, (index + 1) % 2 === 0 && {borderRightWidth: 0}]} />
              )
            }
          })
        }
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  headerBg: {
    width,
    height: width * 120 / 375,
    flexDirection: 'column',
    paddingTop: 27,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navLeft: {
    flex: 1,
    paddingLeft: 14,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIcon: {
    height: 18,
    width: 10,
  },
  navCenter: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navRight: {
    flex: 1,
    paddingRight: 15,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  userNameText: {
    color: '#FFFFFF',
    fontSize: 18,
    backgroundColor: 'transparent',
  },
  questionIcon: {
    height: 20,
    width: 20,
  },
  userInfoWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: 15,
  },
  balance: {
    flex: 1,
    height: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highestRebate: {
    flex: 1,
    flexDirection: 'row',
    height: 17,
    borderLeftWidth: 1,
    borderLeftColor: '#FFFFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfoText: {
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontSize: 16,
  },
  featuresWrap: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  feature: {
    backgroundColor: '#FFFFFF',
    width: (width - 1) / 2,
    height: 100,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F5F5F9',
  },
  featureIcon: {
    width: 41,
    height: 41,
  },
  featureText: {
    marginTop: 8,
    color: '#333333',
    fontSize: 14,
  },
  arrowIcon: {
    width: 13.7,
    height: 7.5,
    marginRight: 15,
    transform: [{ rotate: '-90deg'}],
  },
  rebateDropdown: {
    backgroundColor: '#CC0000',
    paddingHorizontal: 10,
  },
  rebateContent: {
    paddingTop: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderColor: '#FFF',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  rebateItem: {
    lineHeight: 30,
    width: (width - 20) / 2,
    color: '#FFF',
    paddingLeft: 30,
    height: 30,
  },
})
