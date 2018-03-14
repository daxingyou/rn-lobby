import React, { Component } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import ScrollableTabBar from '../../../components/github/RecordScrollableTabBar'
import HeaderToolBar from '../../../components/HeadToolBar'
import Config from '../../../config/global'
import SubPlayList from './SubPlayList'
import Introduction from './Introduction'
import Types from '../../../components/Types'
import { fetchWithOutStatus } from '../../../utils/fetchUtil'
import { getCategoryId } from '../../../utils/config'
import LoadingView from '../../../components/LoadingView'

const windowWidth = Dimensions.get('window').width

const lotteryList = {
  '时时彩': ['1','2','3','4'],
  '11选5': ['11','12','13','14','15', '31'],
  'PC蛋蛋': ['21', '22'],
  '低频彩': ['16','17', '30'],
  '快3': ['6','7','8','9','10', '29'],
  '六合彩': ['20', '26', '27', '28'],
  'PK10': ['19','25'],
}

export default class Rules extends Component {
  constructor(props){
    super(props)
    this.state = {
      activeIndex: 0,
      showTypes: false,
      selectedType: '时时彩',
      rules: '',
      isFetching: true
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.selectedType!==nextState.selectedType) {
      this.setState({ isFetching: true })
      fetchWithOutStatus({
        act: 10110,
        categoryId: getCategoryId[nextState.selectedType],
      }).then((res) => {
        this.setState({ rules: res, isFetching: false })
      }).catch((err) => {
        console.warn(err)
      })
    }
  }

  componentDidMount(){
    const navigation = this.props.navigation
    let categoryId
    let lotteryId = ''
    if (navigation.state.params) {
      lotteryId = navigation.state.params.lotteryId
    }
    Object.keys(lotteryList).map(v =>{
      const s = lotteryList[v].indexOf(lotteryId)
      if (s != -1) {
        this.setState({ selectedType: v })
        categoryId = getCategoryId[v]
      }
    })
    fetchWithOutStatus({
      act: 10110,
      categoryId: categoryId ? categoryId : getCategoryId[this.state.selectedType],
    }).then((res) => {
      this.setState({ rules: res, isFetching: false })
    }).catch((err) => {
      console.warn(err)
    })
  }

  render() {
    const { navigation } = this.props
    const { showTypes, selectedType, activeIndex, isFetching } = this.state

    return (
      <View style={styles.container}>

        <HeaderToolBar
          hideWin={showTypes}
          title={selectedType}
          titleAction={() => this.setState({showTypes: !showTypes})}
          leftIcon={'back'}
          leftIconAction={() => navigation.goBack()}/>

        <ScrollableTabView
          page={activeIndex}
          onChangeTab={({ i }) => this.setState({ activeIndex: i })}
          renderTabBar={() => <ScrollableTabBar/>}
          tabBarBackgroundColor='white'
          tabBarUnderlineStyle={styles.tabBarUnderline}
          tabBarActiveTextColor={Config.baseColor}
          tabBarTextStyle={styles.tabBarText}>
          {
            isFetching ? <LoadingView /> :
            <Introduction
              rules={this.state.rules}
              tabLabel={'彩种介绍'}
              selectedType={selectedType}
              />
          }


            <SubPlayList
              rules={this.state.rules}
              tabLabel={'玩法规则'}
              selectedType={selectedType}
              />
        </ScrollableTabView>

        {
          showTypes && (
            <Types
              selectedType={selectedType}
              selectAction={(type) => {
                this.setState({
                  selectedType: type,
                  showTypes: false,
                  activeIndex: 0,
                })
              }}
              hideWin={() => {
                this.setState({
                  showTypes: false,
                })
              }}
              types={['时时彩', '快3', '11选5', '低频彩', 'PK10', 'PC蛋蛋', '六合彩']}/>
          )
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
  tabBarUnderline: {
    backgroundColor: Config.baseColor,
    height: 3,
    width: windowWidth / 2,
  },
  tabBarText: {
    width: windowWidth / 2 - 40,
    textAlign: 'center'},
})
