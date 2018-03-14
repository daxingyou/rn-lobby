import Button from 'react-native-scrollable-tab-view/Button'
import Sound from '../clickSound'

const React = require('react')
const ReactNative = require('react-native')
const createReactClass = require('create-react-class')

const {
  View,
  Animated,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  Platform,
  Dimensions,
  TouchableOpacity,
} = ReactNative

const WINDOW_WIDTH = Dimensions.get('window').width - 50

const ScrollableTabBar = createReactClass({
  getDefaultProps() {
    return {
      scrollOffset: 52,
      activeTextColor: 'navy',
      inactiveTextColor: 'black',
      backgroundColor: null,
      style: {},
      tabStyle: {},
      tabsContainerStyle: {},
      underlineStyle: {},
      menuText: '全部',
    }
  },

  getInitialState() {
    this._tabsMeasurements = []
    return {
      _leftTabUnderline: new Animated.Value(0),
      _widthTabUnderline: new Animated.Value(0),
      _containerWidth: null,
    }
  },

  componentDidMount() {
    this.props.scrollValue.addListener(this.updateView)
  },

  updateView(offset) {
    const position = Math.floor(offset.value)
    const pageOffset = offset.value % 1
    const tabCount = this.props.tabs.length
    const lastTabPosition = tabCount - 1

    if (tabCount === 0 || offset.value < 0 || offset.value > lastTabPosition) {
      return
    }

    if (this.necessarilyMeasurementsCompleted(position, position === lastTabPosition)) {
      this.updateTabPanel(position, pageOffset)
      this.updateTabUnderline(position, pageOffset, tabCount)
    }
  },

  necessarilyMeasurementsCompleted(position, isLastTab) {
    return this._tabsMeasurements[position] &&
      (isLastTab || this._tabsMeasurements[position + 1]) &&
      this._tabContainerMeasurements &&
      this._containerMeasurements
  },

  updateTabPanel(position, pageOffset) {
    const containerWidth = this._containerMeasurements.width
    const tabWidth = this._tabsMeasurements[position].width
    const nextTabMeasurements = this._tabsMeasurements[position + 1]
    const nextTabWidth = nextTabMeasurements && nextTabMeasurements.width || 0
    const tabOffset = this._tabsMeasurements[position].left
    const absolutePageOffset = pageOffset * tabWidth
    let newScrollX = tabOffset + absolutePageOffset

    // center tab and smooth tab change (for when tabWidth changes a lot between two tabs)
    newScrollX -= (containerWidth - (1 - pageOffset) * tabWidth - pageOffset * nextTabWidth) / 2
    newScrollX = newScrollX >= 0 ? newScrollX : 0

    if (Platform.OS !== 'ios') {
      this._scrollView.scrollTo({x: newScrollX, y: 0, animated: false })
    } else {
      const rightBoundScroll = this._tabContainerMeasurements.width - (this._containerMeasurements.width)
      newScrollX = newScrollX > rightBoundScroll ? rightBoundScroll : newScrollX
      this._scrollView.scrollTo({x: newScrollX, y: 0, animated: false })
    }

  },
  // 修改下标源码, 下标左右各收缩10px
  updateTabUnderline(position, pageOffset, tabCount) {
    const lineLeft = this._tabsMeasurements[position].left
    const lineRight = this._tabsMeasurements[position].right

    if (position < tabCount - 1) {
      const nextTabLeft = this._tabsMeasurements[position + 1].left
      const nextTabRight = this._tabsMeasurements[position + 1].right

      const newLineLeft = (pageOffset * nextTabLeft + (1 - pageOffset) * lineLeft)
      const newLineRight = (pageOffset * nextTabRight + (1 - pageOffset) * lineRight)

      this.state._leftTabUnderline.setValue(newLineLeft+10)
      this.state._widthTabUnderline.setValue(newLineRight - newLineLeft-20)
    } else {
      this.state._leftTabUnderline.setValue(lineLeft+10)
      this.state._widthTabUnderline.setValue(lineRight - lineLeft-20)
    }
  },

  getTabLogo(name, isTabActive) {
    let logo = null
    if (name == '热门') {
      logo = isTabActive ? require('../../src/img/tab_hot_act.png') : require('../../src/img/tab_hot.png')
    } else if (name == '时时彩') {
      logo = isTabActive ? require('../../src/img/tab_ssc_act.png') : require('../../src/img/tab_ssc.png')
    } else if (name == '快3') {
      logo = isTabActive ? require('../../src/img/tab_k3_act.png') : require('../../src/img/tab_k3.png')
    } else if (name == '11选5') {
      logo = isTabActive ? require('../../src/img/tab_11X5_act.png') : require('../../src/img/tab_11X5.png')
    } else if (name == '低频彩') {
      logo = isTabActive ? require('../../src/img/tab_bet_act.png') : require('../../src/img/tab_bet.png')
    } else if (name == 'PK10') {
      logo = isTabActive ? require('../../src/img/tab_pk10_act.png') : require('../../src/img/tab_pk10.png')
    } else if (name == 'PC蛋蛋') {
      logo = isTabActive ? require('../../src/img/tab_lucky28_act.png') : require('../../src/img/tab_lucky28.png')
    } else if (name == '三分彩') {
      logo = isTabActive ? require('../../src/img/tab_sfc_act.png') : require('../../src/img/tab_sfc.png')
    } else if (name == '六合彩') {
        logo = isTabActive ? require('../../src/img/tab_lhc_act.png') : require('../../src/img/tab_lhc.png')
    }
    return logo
  },

  renderTab(name, page, isTabActive, onPressHandler, onLayoutHandler) {
    const { activeTextColor, inactiveTextColor, textStyle } = this.props
    const textColor = isTabActive ? activeTextColor : inactiveTextColor
    const fontWeight = isTabActive ? 'bold' : 'normal'
    let logo = this.getTabLogo(name, isTabActive)
    return (
      <Button
        key={`${name}_${page}`}
        accessible={true}
        accessibilityLabel={name}
        accessibilityTraits='button'
        onPress={() => {Sound.stop();Sound.play();onPressHandler(page)}}
        onLayout={onLayoutHandler}>
        <View style={[styles.tab, this.props.tabStyle ]}>
          <Image source={logo} style={{width: 23, height: 23}}/>
          <Text style={[{color: textColor, fontWeight }, textStyle ]}>
            {name}
          </Text>
        </View>
      </Button>
    )
  },

  measureTab(page, event) {
    const { x, width, height } = event.nativeEvent.layout
    this._tabsMeasurements[page] = {left: x, right: x + width, width, height }
    this.updateView({value: this.props.scrollValue._value })
  },

  onTabContainerLayout(e) {
    this._tabContainerMeasurements = e.nativeEvent.layout
    let width = this._tabContainerMeasurements.width
    if (width < WINDOW_WIDTH) {
      width = WINDOW_WIDTH
    }
    this.setState({ _containerWidth: width })
    this.updateView({value: this.props.scrollValue._value })
  },

  // 套在第二个View上(宽度是屏幕宽度-右边菜单按钮的宽度)
  onContainerLayout(e) {
    this._containerMeasurements = e.nativeEvent.layout
    this.updateView({value: this.props.scrollValue._value })
  },

  render() {
    const tabUnderlineStyle = {
      position: 'absolute',
      height: 4,
      backgroundColor: 'navy',
      bottom: 0,
    }

    const dynamicTabUnderline = {
      left: this.state._leftTabUnderline,
      width: this.state._widthTabUnderline,
    }

    return (
      <View
        style={[styles.container, {backgroundColor: this.props.backgroundColor }, this.props.style ]}>
        <View style={styles.scrollView} onLayout={this.onContainerLayout}>
          <ScrollView
            ref={(scrollView) => { this._scrollView = scrollView }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            directionalLockEnabled={true}
            bounces={false}
            scrollsToTop={false}>
            <View
              style={[styles.tabs, {width: this.state._containerWidth }, this.props.tabsContainerStyle ]}
              ref={'tabContainer'}
              onLayout={this.onTabContainerLayout}>
              {this.props.tabs.map((name, page) => {
                const isTabActive = this.props.activeTab === page
                const renderTab = this.props.renderTab || this.renderTab
                return renderTab(name, page, isTabActive, this.props.goToPage, this.measureTab.bind(this, page))
              })}
              <Animated.View style={[tabUnderlineStyle, dynamicTabUnderline, this.props.underlineStyle ]} />
            </View>
          </ScrollView>
        </View>
        {
          this.props.onPressMenu && (
            <TouchableOpacity
              key={'all'}
              style={styles.rightMenu}
              activeOpacity={0.75}
              onPress={() => {Sound.stop();Sound.play();this.props.onPressMenu()}}>
              <Image source={require('../../src/img/tab_all.png')} style={{ width: 20, height: 20, marginBottom: 4 }} />
              <Text style={{ fontSize: 14, color: '#7881FF', paddingTop: 8 }}>{this.props.menuText}</Text>
            </TouchableOpacity>
          )
        }


      </View>
    )
  },
})

module.exports = ScrollableTabBar

const styles = StyleSheet.create({
  tab: {
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  container: {
    height: 65,
    flexDirection: 'row',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: '#ccc',
  },
  scrollView: {
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    height: 65,
    justifyContent: 'space-around',
  },
  rightMenu: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 65,
    backgroundColor: '#EDEFFF',
    shadowOffset: {
      width: -2,
      height: 1,
    },
    shadowColor: '#000000',
    shadowOpacity: 0.20,
    shadowRadius: 6,
  },
})
