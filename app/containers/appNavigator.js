import React, { Component } from 'react'
import Immutable from 'immutable'
import {
  DeviceEventEmitter, Platform, StatusBar, View, TouchableOpacity,
  StyleSheet, Dimensions, Image, BackAndroid, Text, ScrollView,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addNavigationHelpers } from 'react-navigation'
import { toastShort } from '../utils/toastUtil'
import { reportEquipement } from '../utils/reportUmengConfig'
import AppNavigator from '../routes'
import {
  getUserInfo, setClientServiceUrl, setTabName,
  resetUserInfo, resetNav, goBack, setSpecialAgent,
} from '../actions'
import { fetchWithOutStatus, fetchWithStatus } from '../utils/fetchUtil'
import Modal from 'react-native-modalbox'

const { width } = Dimensions.get('window')
const isIos = Platform.OS === 'ios'
let resetUserInfoMark, resetNavMart, phoneSettings

class AppWithNavigationState extends Component {
  constructor(props) {
    super(props)
    this.state = {
      advertImg: '',
      isOpen: true,
    }
  }

  componentDidMount() {
    reportEquipement(this.props.token)

    this.getService()
    this.checkSpecialAgent()

    this.ivUserInfo = setInterval(this.refreshUserInfo, 60000 * 5)

    resetUserInfoMark = this.props.resetUserInfo
    resetNavMart = this.props.resetNav
    phoneSettings = this.props.phoneSettings

    this.advert = DeviceEventEmitter.addListener('ADVERT', () => {
      this.subscribeLogin = DeviceEventEmitter.addListener('LOGIN', () => {
        this.fetchAdvert(2)
      })
      this.fetchAdvert(1)
    })

    if (!isIos) {
      BackAndroid.addEventListener('handwareBackDetail', this.onBackAndroid)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(Immutable.fromJS(this.props.phoneSettings), Immutable.fromJS(nextProps.phoneSettings))) {
      phoneSettings = nextProps.phoneSettings
    }
  }

  componentWillUnmount() {
    clearInterval(this.ivUserInfo)
  }

  checkSpecialAgent = () => {
    fetchWithStatus({ act: 10050 }).then(res => {
      if (res.is_spe_agent == 1) {
        this.props.setSpecialAgent(true)
      }
    }).catch(err => {
      console.warn('从服务器获取ip错误', err)
    })
  }

  onBackAndroid = () => {
    const { nav, goBack } = this.props
    const topIndex = nav.index
    const tabIndex = nav.routes[topIndex].index
    const routes = nav.routes[topIndex].routes[tabIndex].routes
    if (routes.length > 1) {
      goBack()
    } else if (routes.length === 1) {
      if (this.lastBackPressed && this.lastBackPressed + 3000 >= Date.now()) {
        return false
      }
      this.lastBackPressed = Date.now()
      toastShort("再按一次退出程序")
    }
    return true
  }

  fetchAdvert = (pos) => {
    fetchWithOutStatus({act: 10107, type: 1, pos}).then((res) => {// 活动图
      if (res) {
        this.setState({ advert: res })
      }
      this.advert.remove()
    }).catch((err) => {
      console.warn(err)
    })
  }

  refreshUserInfo = () => {
    const { getUserInfo, token} = this.props
    if (token) {
      getUserInfo(token)
    }
  }

  getService = () => {
    fetchWithStatus({act: 10106}).then((res) => {// 获取客服地址
      if (res.status === 0) {
        this.props.setClientServiceUrl(res)
      }
    }).catch((err) => {
      console.warn(err)
    })
  }

  renderAdvertFun = () => {
    return (
      <View style={styles.advertFun}>
        <TouchableOpacity
          style={styles.advertFunBtn}
          onPress={() => {
            this.adverModal.close()
          }}>
          <Text style={styles.advertFunBtnText}>不再提醒</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.advertFunBtn, {borderLeftWidth: StyleSheet.hairlineWidth, borderColor: '#CECECE'}]}
          onPress={() => {
            this.adverModal.close()
          }}>
          <Text style={[styles.advertFunBtnText, {color: '#DD1414'}]}>我知道了</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderAdvertImg = (advertImg) => {
    return (
      <Modal
        ref={ref => this.adverModal = ref}
        style={styles.modal}
        backdropPressToClose={false}
        swipeToClose={false}
        isOpen={true}>
        <Image
          style={styles.advertImg}
          source={{ uri: advertImg }}/>
        {
          this.renderAdvertFun()
        }
      </Modal>
    )
  }

  renderAdvertText = (title, content) => {
    return (
      <Modal
        ref={ref => this.adverModal = ref}
        style={styles.advertTextModel}
        backdropPressToClose={false}
        swipeToClose={false}
        position={'center'}
        isOpen={true}>
        <View style={styles.advertTextWrap}>
          <Image
            style={styles.advertLogo}
            resizeMode='contain'
            source={require('../src/img/advert_logo.png')}/>
          <View style={styles.advertTitle}>
            <Text style={styles.advertTitleText}>{title}</Text>
          </View>
          <ScrollView style={styles.advertContent}>
            <Text style={styles.advertContentText}>{content.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ')}</Text>
          </ScrollView>
          {
            this.renderAdvertFun()
          }
        </View>
      </Modal>
    )
  }

  render() {
    const { dispatch, nav } = this.props
    const { advert } = this.state
    return (
      <View style={{flex: 1}}>
        <StatusBar
          translucent={true}
          backgroundColor='rgba(0,0,0,0)'
          barStyle='light-content'
          networkActivityIndicatorVisible={true}/>
        <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
        {
          !!advert && advert.advert_format == 1 && !!advert.advert_image
          && this.renderAdvertImg(advert.advert_image)
        }
        {
          !!advert && advert.advert_format == 2 && !!advert.advert_name
          && !!advert.advert_text && this.renderAdvertText(advert.advert_name, advert.advert_text)
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  modal: {
    width: width - 25,
    height: (width - 25) / 650 * 826 + 44,
    borderRadius: 4,
    overflow: 'hidden',
  },
  advertImg: {
    height: (width - 25) / 650 * 826,
    width: width - 25,
    backgroundColor: 'transparent',
  },
  advertFun: {
    height: 44,
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#CECECE',
  },
  advertFunBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  advertFunBtnText: {
    fontSize: 15,
    color: '#333333',
  },
  advertTextModel: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  advertTextWrap: {
    width: width - 25,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  advertLogo: {
    width: width - 25,
    height: (width - 25) / 650 * 235,
  },
  advertTitle: {
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  advertTitleText: {
    fontSize: 18,
    color: '#333333',
    fontWeight: 'bold',
  },
  advertContent: {
    minHeight: 108,
    maxHeight: 500,
    paddingHorizontal: 17,
    paddingBottom: 10,
  },
  advertContentText: {
    fontSize: 12,
    color: '#333333',
    lineHeight: 16,
  },
})

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
}

export function eraseUserInfo() {
  resetUserInfoMark()
}

export function popToTop() {
  resetNavMart()
}

export  {phoneSettings}

const mapStateToProps = state => {
  return {
    nav: state.nav,
    token: state.userInfo.token,
    phoneSettings: state.phone.phoneSettings,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    getUserInfo: (token) => {dispatch(getUserInfo(token))},
    setClientServiceUrl: (data) => dispatch(setClientServiceUrl(data)),
    setTabName: (tabName) => dispatch(setTabName(tabName)),
    resetUserInfo: () => dispatch(resetUserInfo()),
    resetNav: () => dispatch(resetNav()),
    goBack: () => dispatch(goBack()),
    setSpecialAgent: (isSpecialAgent) => dispatch(setSpecialAgent(isSpecialAgent)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppWithNavigationState)
