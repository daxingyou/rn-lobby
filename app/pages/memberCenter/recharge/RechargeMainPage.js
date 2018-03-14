import React, { Component } from 'react'
import { View, Image, StyleSheet, Text, Dimensions, Alert, InteractionManager, Linking,
    TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native'
import { connect } from 'react-redux'
import HeaderToolBar from '../../../components/HeadToolBar'
import dismissKeyboard from '../../../utils/dismissKeyboard'
import { fetchWithStatus, fetchWithOutStatus } from '../../../utils/fetchUtil'
import { formatMoney } from '../../../utils/formatUtil'
import { isMatchInputMoney } from '../../../utils/stringUtil'
import { toastShort } from '../../../utils/toastUtil'
import { ModalLoading, LoadingView } from '../../../components/common'
import ModalPickerBank from '../../../components/modal/ModalPickerBank'
import Sound from '../../../components/clickSound'
import Config from '../../../config/global'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'
import CoustomKeyboard from '../../../components/github/keyboardpopup'

const MONEY_UNITS = [50, 100, 300, 500, 800, 1000, 2000, 3000]

const windowWidth = Dimensions.get('window').width

class RechargeMainPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      money: '',
      isFetching: true,
      isLoading: false,
      bankDatas: [],
      rechargeTypes: [],
      data: [],
      isShowKeyboard: false,
    }

    this.changeValue = this.changeValue.bind(this)
    this.toggleKeyboard = this.toggleKeyboard.bind(this)
    this.onConfirm = this.onConfirm.bind(this)
  }

  componentDidMount() {
    const headers = { token: this.props.userInfo.token }
    InteractionManager.runAfterInteractions(() => {
      fetchWithOutStatus({ act: 10028 }, headers).then((res) => {
        this.setState({ bankDatas: res }) // 银行卡信息
      }).catch(() => {
        this.setState({ isLoading: false })
        toastShort('网络异常, 请检查网络连接后重新打开页面!')
      })
      fetchWithOutStatus({ act: 10061 }, headers).then((res) => {
        this.setState({ data: res, isFetching: false })
      }).catch(() => {
        this.setState({ isLoading: false, isFetching: false })
        toastShort('网络异常, 请检查网络连接后重新打开页面!')
      })
    })
  }
  onLinePay(id, bankType, name) {
    const { money } = this.state
    let body = {}
    body = { act: 10040, amount: money.trim(), category_id: id }
    let bankId = '' // 网银在线支付选择的银行id

    if (id === '1') { // 网银在线支付选择银行卡
      this.state.bankDatas.forEach((item) => {
        if (item.bank_name === bankType) {
          bankId = item.bank_id
          return
        }
      })
      body = { act: 10040, amount: money.trim(), category_id: id, bank_id: bankId }
    } else {
      this.setState({ isLoading: true })
    }
    const headers = { token: this.props.userInfo.token }
    fetchWithStatus(body, headers).then((res) => {
      if (this.props.userInfo.account_type == 3) {
        Alert.alert('', res.message, [
          { text: '确认', onPress: () => {this.setState({ isLoading: false })} },
        ], { cancelable: false })
        return false
      }
      if (id === '4' || id === '5' || id === '12' || id === '24') {
        Linking.canOpenURL(res.recharge_url).then(supported => {
          if (supported) {
            Linking.openURL(res.recharge_url)
            this.setState({ isLoading: false })
          } else {
            toastShort('不能打开该网址!')
            this.setState({ isLoading: false })
          }
        })
      } else if (id === '8' || id === '9' || id === '19' || id === '20' || id === '21' || id === '22') {
        //8: 支付宝，9: 微信， 19: QQ，20: 京东，21: 百度， 22: 通用
        this.props.navigation.navigate('FriendsPay', { data: res, type: id, money: money.trim() })
        this.setState({ isLoading: false })
      } else {
        this.props.navigation.navigate('WebViewPage', { data: res, type: id, name })
        this.setState({ isLoading: false })
      }

    }).catch(err => {
      this.setState({ isLoading: false }, () => {
        Alert.alert('', err.message || '未知错误', [
          { text: '确认', onPress: () => {} },
        ])
      })
    })
  }

  _onPressItem(id, bankType, min, max, name) {
    const { money } = this.state
    if (!isMatchInputMoney(money)) {
      toastShort('请输入正确的金额!')
    } else if (min && (parseFloat(money) < min || money === '')) {
      toastShort(`单笔金额最低${min}元!`)
    } else if (max && (parseFloat(money) > max)) {
      toastShort(`单笔金额最高${max}元!`)
    } else if (id === '10') { // 客户大额支付
      this.props.navigation.navigate('PlatformCashPage', { amount: money })
    } else {
      this.onLinePay(id, bankType, name)
    }
  }
  handleUnit(item) {
    this.setState({ money: item.toString() })
  }

  renderContent() {
    if (this.state.isFetching) {
      return <LoadingView />
    }
    const { account_balance } = this.props.userInfo
    const { data, money, isShowKeyboard, isLoading } = this.state
    return (
      <View style={{flex: 1}}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{}</Text>
          <Text style={styles.titleText}> 余额: </Text>
          <Text style={[styles.titleText, { color: Config.baseColor }]}>{`${formatMoney(account_balance || 0)}`}</Text>
          <Text style={styles.titleText}>元</Text>
        </View>
        <View style={styles.inputWrap}>
          <Text style={{ fontSize: 15 }}>{'充值金额: '}</Text>
          <TouchableWithoutFeedback
            style={{flex: 1, justifyContent: 'center'}}
            onPress={() => {this.toggleKeyboard(true)}}>
            <View style={{flex: 1}}>
              {
                money ? (
                  <Text style={styles.input}>{ money }</Text>
                ) : (
                  <Text style={styles.inputTips}>请输入充值金额</Text>
                )
              }

            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 10, backgroundColor: '#FFF' }}>
          {
            MONEY_UNITS.map((item, index) => {
              const isSelected = item === parseFloat(this.state.money)
              return (
                <TouchableOpacity
                  key={`recharge${index}`}
                  style={[styles.btnStyle, isSelected ? { borderColor: Config.baseColor } : {}]}
                  onPress={() => {Sound.stop();Sound.play();this.handleUnit.bind(this, item)()}}
                  underlayColor={Config.baseColor}
                  activeOpacity={0.7}>
                  <Text style={[styles.textStyle, isSelected ? { color: Config.baseColor } : {}]}>{`${item}元`}</Text>
                </TouchableOpacity>
              )
            })
          }
        </View>
        <Text style={{ fontSize: 13, color: '#999', margin: 10 }}>选择支付方式</Text>
        <ScrollableTabView
          style={{flex: 1, backgroundColor: '#FFF'}}
          contentProps={{ removeClippedSubviews:false }}
          tabBarBackgroundColor='#FFF6F6'
          tabBarUnderlineStyle={{backgroundColor: Config.baseColor, height: 3}}
          tabBarActiveTextColor={Config.baseColor}
          tabBarInactiveTextColor='#666666'
          renderTabBar={() => <ScrollableTabBar style={styles.tab} tabStyle={styles.tabStyle} textStyle={styles.tabText}/>}>
        {
          data && data.map((typeItem, index) => {
            return (
              <ScrollView
                key={index}
                tabLabel={typeItem.type_name}
                style={{flex: 1, paddingHorizontal: 10}}
                horizontal={false}>
                {
                  typeItem.type_list.map((item, index) => {
                    return (
                      item.id === '1' ? ( // 网银在线支付
                        <ModalPickerBank
                          data={this.state.bankDatas}
                          key={index}
                          cancelText='请选择银行卡'
                          isHead={true}
                          listHeight={this.state.bankDatas.length * 30}
                          onChange={(option) => { this._onPressItem(item.id, option.bank_name) }}>
                          <View
                            item={item}
                            activeOpacity={0.85}
                            style={[styles.listItemWrap, { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#CCC' }]}>
                            {item.image_url !== '' && <Image source={{ uri: item.image_url }} style={styles.imgStyle} />}
                            <View style={styles.centerTextWrap}>
                              <Text style={{ fontSize: 15, marginBottom: 8 }}>{item.name}</Text>
                              <Text
                                style={{ fontSize: 12, color: '#999999' }}
                                numberOfLines={1}>
                                {item.introduction}
                              </Text>
                            </View>
                            <Image source={require('../../../src/img/ic_arrow_right.png')} style={styles.arrowStyle} />
                          </View>
                        </ModalPickerBank>
                      ) : (
                        <PayTypeItem
                          disabled={isLoading}
                          key={index}
                          item={item}
                          activeOpacity={0.85}
                          style={[styles.listItemWrap, { borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#CCC' }]}
                          onPress={() => {
                            Sound.stop()
                            Sound.play()
                            this._onPressItem.bind(this, item.id, '',item.min_amount_limit, item.max_amount_limit, item.name)()
                          }}/>
                      )
                    )
                  })
                }
              </ScrollView>
            )
          })
        }
        </ScrollableTabView>
        <CoustomKeyboard
          isOpen={isShowKeyboard}
          defaultValue={money}
          buttonLabel='确认'
          onTextChange={(text) => this.changeValue(text)}
          onClosedHandle={() => this.toggleKeyboard(false)}
          onButtonPress={(text) => this.onConfirm(text)}/>

      </View>
    )
  }

  changeValue(val) {
    this.setState({ money: val })
  }

  toggleKeyboard(val) {
    this.setState({ isShowKeyboard: val })
  }

  onConfirm() {
    this.setState({ isShowKeyboard: false })
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {Sound.stop();Sound.play();dismissKeyboard()}}
        activeOpacity={1}>
        <ModalLoading visible={this.state.isLoading} text={'获取充值信息中...'} />
        <HeaderToolBar
          title={'充值'}
          leftIcon={'back'}
          rightIcon1={'text'}
          rightText={'说明'}
          rightIconAction1={() => this.props.navigation.navigate('RechargeIllustratePage')}
          leftIconAction={() => this.props.navigation.goBack()}/>
        {
          this.renderContent()
        }
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  titleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  titleText: {
    color: 'black',
    fontSize: 13,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  input: {
    padding: 0,
    flex: 1,
    fontSize: 15,
  },
  inputTips: {
    fontSize: 14,
    lineHeight: 17,
    color: '#ccc',
  },
  listItemWrap: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnStyle: {
    width: windowWidth / 4 - 15,
    height: 30,
    backgroundColor: '#FFF',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    borderBottomWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  textStyle: {
    fontSize: 18,
    color: '#666',
  },
  imgStyle: {
    height: 36,
    width: 36,
  },
  centerTextWrap: {
    flex: 1,
    marginHorizontal: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  arrowStyle: {
    height: 16,
    resizeMode: 'contain',
  },
  tab: {
    height: 40,
  },
  tabStyle: {
    height: 39,
  },
  tabText: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 15,
  },
})

// 支付类型组件
const PayTypeItem = ({ item, ...props }) => {
  return (
    <TouchableOpacity
      {...props}>
      {item.image_url !== '' && <Image source={{ uri: item.image_url }} style={styles.imgStyle} />}
      <View style={styles.centerTextWrap}>
        <Text style={{ fontSize: 15, marginBottom: 8 }}>{item.name}</Text>
        <Text
          style={{ fontSize: 12, color: '#999999' }}
          numberOfLines={1}>
          {item.introduction}
        </Text>
      </View>
      <Image source={require('../../../src/img/ic_arrow_right.png')} style={styles.arrowStyle} />
    </TouchableOpacity>
  )
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
  }
}


export default connect(mapStateToProps)(RechargeMainPage)
