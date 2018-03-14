import React, { Component } from 'react'
import {
  View, StyleSheet,
} from 'react-native'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'
import HeaderToolBar from '../../../components/HeadToolBar'
import AccountForm from './accountForm'
import InvCodeMgmt from './invCodeMgmt'
import Sound from '../../../components/clickSound'
import Config from '../../../config/global'

export default class SubAccount extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshCode: '',
    }
  }

  resetRefreshMark(markCode) {
    this.setState({
      refreshCode: markCode,
    })
  }

  render() {
    const { userInfo } = this.props.navigation.state.params
    const { refreshCode } = this.state
    return (
      <View style={styles.container}>
        <HeaderToolBar
          title={'下级开户'}
          leftIcon={'back'}
          leftIconAction={() => {
            Sound.stop()
            Sound.play()
            this.props.navigation.goBack()
          }}/>
        <ScrollableTabView
          style={{flex: 1}}
          contentProps={{
            removeClippedSubviews: false,
            keyboardShouldPersistTaps: true,
          }}
          tabBarBackgroundColor='#FFFFFF'
          tabBarUnderlineStyle={{backgroundColor: Config.baseColor, height: 3}}
          tabBarActiveTextColor={Config.baseColor}
          tabBarInactiveTextColor='#999999'
          renderTabBar={() =>
            <ScrollableTabBar style={styles.tab} tabStyle={styles.tabStyle} textStyle={styles.tabText}/>}>
          <AccountForm
            tabLabel='精准开户'
            userInfo={userInfo}
            token={userInfo.token}
            formType='accurateAccount'/>
          <AccountForm
            tabLabel='生成邀请码'
            userInfo={userInfo}
            token={userInfo.token}
            formType='generateInviCode'
            resetRefreshMark={this.resetRefreshMark.bind(this)}/>
          <InvCodeMgmt
            tabLabel='邀请码管理'
            userInfo={userInfo}
            token={userInfo.token}
            refreshCode={refreshCode}/>
        </ScrollableTabView>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
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
