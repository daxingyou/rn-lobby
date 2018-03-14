import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image, Dimensions,
} from 'react-native'
import Sound from '../../components/clickSound'
import { getNoticeList } from '../../actions'
import MarqueeLabel from '../../components/github/MarqueeLabel'
import Config from '../../config/global'

const { width } = Dimensions.get('window')

class Notice extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isnotice: false,
    }
  }

  componentDidMount() {
    this.props.getNoticeList()
  }

  componentWillReceiveProps(nextProps) {
    let isnotice = false
    if (nextProps.nav.routes[0].index == 0 && nextProps.nav.routes[0].routes[0].index == 0) {
      isnotice = true
    }
    this.setState({ isnotice })
  }

  render() {
    const { navigation, noticeList } = this.props
    const isnotice = this.state.isnotice
    return (
      <View style={styles.noticeWrap}>
        <TouchableOpacity
          style={styles.notice}
          activeOpacity={0.85}
          onPress={() => {
            Sound.stop()
            Sound.play()
            navigation.navigate('InfoListPage', {type: 3})
          }}>
          <Image source={require('../../src/img/home_notice.png')} style={{ height: 15, width: 15, marginRight:5,marginLeft:3}}/>
          {
            noticeList && noticeList.length > 0 && isnotice ?
            (
              <MarqueeLabel
                bgViewStyle={{width: width - 57}}
                speed={70}
                textStyle={{ fontSize: 14, color: '#333'}}>
                {
                  Array.isArray(noticeList) && noticeList.length > 0 ? noticeList.map((item, index) => {
                    let noticeStr = ''
                    if (index !== 0) {
                      noticeStr += '                                     ' + item.toString()
                    } else {
                      noticeStr += item.toString()
                    }
                    return noticeStr
                  }) : '欢迎来到' + Config.platformName
                }
              </MarqueeLabel>
            )
            :
            <View style={{width: width - 57}} />
          }
          <Image source={require('../../src/img/notice_arrow.png')} style={{marginLeft:5, height: 12, width: 12}}/>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  noticeWrap: {
    height: 32.5,
    paddingHorizontal: 5,
  },
  notice: {
    flex: 1,
    borderBottomColor: '#EDEDED',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
  },
})

const mapStateToProps = (state) => {
  const { noticeList, nav } = state
  return { noticeList, nav }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getNoticeList: () => {
      dispatch(getNoticeList())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notice)
