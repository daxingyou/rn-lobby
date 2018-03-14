import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, Text, Image, TouchableOpacity, DeviceEventEmitter, Linking, Dimensions } from 'react-native'
import HeaderToolBar from '../../../components/HeadToolBar'
import { fetchWithOutStatus } from '../../../utils/fetchUtil'
import { LoadingView, NoDataView } from '../../../components/common'
import ModalPopup from '../../../components/modal/ModalPopup'
import { toastShort } from '../../../utils/toastUtil'
import { formatCard4Space } from '../../../utils/formatUtil'

const winWidth = Dimensions.get('window').width

class BankCardMainPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      bankList: [],
      isLoading: false,
      isShowPopup: false,
      plus: false,
    }
  }

  componentDidMount() {
    this._fetchBankList()
    this.subscriptBankCards = DeviceEventEmitter.addListener('lISTENER_BANK_CARDS', () => {
      this._fetchBankList()
    })
  }
  componentWillUnmount() {
    this.subscriptBankCards.remove()
  }

  _fetchBankList = () => {
    this.setState({ isLoading: true })
    const headers = { token: this.props.token }
    fetchWithOutStatus({ act: 10025 }, headers).then((res) => {
      this.handlePlus(res)
      this.setState({ bankList: res, isLoading: false })
    })
  }

  handlePlus = (res) => {
    if (res.length === 0) {
      this.setState({ plus: true })
    }
  }

  _onPress2Add = () => {
    const { userInfo, navigation } = this.props

    if (this.state.bankList.length === 0 && userInfo.funds_pwd_status == 0) {
      this.setState({ isShowPopup: true })
    } else {
      navigation.navigate('BankCardAddPage', { fromCardMain: true })
    }
  }

  _renderContent = () => {
    const { bankList, isLoading } = this.state
    const { userInfo, clientServiceUrl } = this.props
    if (isLoading) {
      return <LoadingView />
    }
    if (bankList.length === 0) {
      return <NoDataView text={'您还没有绑定的银行卡!'} />
    }
    return (
      <View>
        <View>
          <Image style={{width:winWidth, position:'relative', height:70, top: -10}} source={require('../../../src/img/Oval.png')}/>
        </View>
        <View style={{justifyContent:'center',alignItems:'center',position:'absolute',zIndex:1,top:5,left:0,right:0}}>
          {
            bankList.map((item, index) => {
              return (
                <View key={index} style={styles.itemWrap}>
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <Image source={item.bank_image && item.bank_image !== '' ? {uri: item.bank_image} : require('../../../src/img/ic_default_bank.png')} style={styles.bankIcon} />
                    <View style={{flexDirection: 'row', width: winWidth }}>
                      <View style={{marginTop: 7, width: winWidth-230, justifyContent: 'space-between'}}>
                        <Text style={{ fontSize: 18, marginBottom: 5 }}>{item.bank_name}</Text>
                        <Text style={[styles.tip, {marginTop: 0}]}>储蓄卡</Text>
                      </View>
                      <View style={styles.cardholder}>
                        <Text style={styles.cardholderText}>{`持卡人：${userInfo.realname}`}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={[styles.tip, {fontSize: 20, marginTop: 35}]}>{formatCard4Space(item.bank_account)}</Text>
                  </View>
                </View>
              )
            })
          }
          <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 50}}>
            <Text style={styles.tip}>如有疑问，请
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (clientServiceUrl) {
                  Linking.openURL(clientServiceUrl)
                } else {
                  toastShort('无法获取客服地址！')
                }
              }}>
              <Text style={[styles.tip, { color: 'blue' }]}>
                联系在线客服
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  render() {
    const { bankList, isShowPopup } = this.state
    const { userInfo, navigation } = this.props
    return (
      <View style={styles.container} >
        <ModalPopup
          visible={isShowPopup}
          onPressCancel={() => {
            this.setState({ isShowPopup: false })
            navigation.goBack()
          }}
          onPressConfirm={() => {
            this.setState({ isShowPopup: false })
            navigation.navigate('FundPwdPage', { fromCardMain: true, cardMainKey: navigation.state.key })
          }}>
          {'主人！为保证您用卡安全,绑卡前请设置资金密码'}
        </ModalPopup>
        <HeaderToolBar
          title={'我的银行卡'}
          leftIcon={'back'}
          leftIconAction={() => navigation.goBack()}
          rightIcon2={!userInfo.user_bank_status ? 'plus' : null}
          rightIconAction2={bankList && bankList.length > 0 ? null : this._onPress2Add.bind(this)}/>
        {
          this._renderContent()
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  cardholder: {
    marginTop: 5,
    height: 25,
    paddingHorizontal: 10,
    backgroundColor: '#F5F5F9',
    borderRadius: 10,
    justifyContent: 'center',
  },
  cardholderText: {
    fontSize: 13,
    color: '#000000',
  },
  itemWrap: {
    shadowOpacity: 0.3,
    shadowOffset: {
      height: 3,
      width: 3,
    },
    marginTop: 15,
    height: 170,
    marginHorizontal: 10,
    marginBottom: 0,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center',
  },
  bankIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  tip: {
    marginVertical: 10,
    fontSize: 15,
    color: '#666',
  },
})

const mapStateToProps = (state) => {
  return {
    userInfo: state.userInfo,
    clientServiceUrl: state.sysInfo.clientServiceUrl,
  }
}

export default connect(mapStateToProps)(BankCardMainPage)
