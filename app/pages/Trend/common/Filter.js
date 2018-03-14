import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Switch,
} from 'react-native'

import Modal from 'react-native-modalbox'
import Sound from '../../../components/clickSound'
import Config from '../../../config/global'

const { width } = Dimensions.get('window')
const selected = require('../../../src/img/ic_selected_green.png')
const unselected = require('../../../src/img/ic_unselected_b.png')

export default class Filter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      displayPeriods: props.displayPeriods,
      dataSort: props.dataSort,
      misData: true,
      showMisData: props.showMisData,
      statData: true,
      showStatData: props.showStatData,
      polyline: true,
      showPolyline: props.showPolyline,
      modalHeight: 370,
    }
    this.modalRef = -1
    this.switchEnabled = true
    this.issueList = [
      {
        label: '30期',
        action: 30,
      },
      {
        label: '50期',
        action: 50,
      },
      {
        label: '100期',
        action: 100,
      },
    ]
  }

  componentDidMount() {
    this.updateSetting(this.props.selectedType)
  }

  componentWillReceiveProps(nextProps) {
    this.updateSetting(nextProps.selectedType)
  }

  updateSetting = (selectedType) => {
    if (selectedType === '基本走势') {
      this.setState({
        misData: false,
        statData: false,
        polyline: false,
        modalHeight: 370-41*3,
      })
    } else if (['生肖', '色波'].includes(selectedType)) {
      this.setState({
        misData: false,
        statData: true,
        polyline: false,
        modalHeight: 370-41*2,
      })
    } else if (['三星组三', '三星组六'].includes(selectedType)) {
      this.setState({
        misData: true,
        statData: false,
        polyline: false,
        modalHeight: 370-41*2,
      })
    } else {
      this.setState({
        misData: true,
        statData: true,
        polyline: true,
        modalHeight: 370,
      })
    }
  }

  render() {
    const { closeFilterWin, handleConfirm, navigation } = this.props
    const { displayPeriods, dataSort, misData, showMisData, statData, showStatData, polyline, showPolyline, modalHeight } = this.state
    return (
      <Modal
        isOpen={true}
        backdropPressToClose={false}
        style={[styles.modal, {height: modalHeight}]}
        position={"center"}
        swipeToClose={false}>
          <View style={styles.title}>
            <View style={{flex: 1}}/>
            <View style={{flex: 2}}>
              <Text style={styles.titleText}>走势图设置</Text>
            </View>
            <TouchableOpacity style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}
              onPress={() => navigation.navigate('Help')}>
                <Text style={styles.help}>帮助</Text>
                <Image style={{width: 5, height: 10, marginRight: 10, marginTop: 3}} source={require('../../../src/img/trend_help.png')}/>
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
          <View style={styles.rowBetween}>
            <Text style={styles.labelText}>期数：</Text>
          </View>
          <View style={[styles.rowBetween, {paddingHorizontal: 40}]}>
          {
            this.issueList.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.85}
                  style={styles.selectItem}
                  onPress={() => {
                    Sound.stop()
                    Sound.play()
                    this.setState({
                      displayPeriods: item.action,
                    })
                  }}>
                  <Image
                    source={displayPeriods === item.action ? selected : unselected}
                    style={styles.selectImg}/>
                  <Text style={styles.ctnText}>{item.label}</Text>
                </TouchableOpacity>
              )
            })
          }
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.labelText}>排顺：</Text>
          </View>
          <View style={[styles.rowBetween, {justifyContent: 'flex-start', paddingHorizontal: 40}]}>
            {
              [
                {text: '顺序显示', order: 'asc'},
                {text: '倒序显示', order: 'desc'},
              ].map((option, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.85}
                  style={[styles.selectItem, index === 1 && {marginLeft: 31.25}]}
                  onPress={() => {
                    Sound.stop()
                    Sound.play()
                    this.setState({
                      dataSort: option.order,
                    })
                  }}>
                  <Image
                    source={dataSort === option.order ? selected : unselected}
                    style={styles.selectImg}/>
                  <Text style={styles.ctnText}>{option.text}</Text>
                </TouchableOpacity>
              ))
            }
          </View>
            {
              [
                {show: misData, text: '遗漏数据', key: 'showMisData', value: showMisData, func: (value) => this.setState({showMisData: value})},
                {show: statData, text: '统计数据', key: 'showStatData', value: showStatData, func: (value) => this.setState({showStatData: value})},
                {show: polyline, text: '显示折线', key: 'showPolyline', value: showPolyline, func: (value) => this.setState({showPolyline: value})},
              ].map((option, index) => {
                return option.show
                  ? (
                    <View key={index} style={styles.rowBetween}>
                      <Text style={styles.ctnText}>{option.text}</Text>
                      <Switch
                        disable={this.switchEnabled}
                        onValueChange={(value) => option.func(value)}
                        value={option.value} />
                    </View>
                  )
                  : null
              })
            }
        </View>
        <View style={styles.btm}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.btn}
            onPress={() => {
              Sound.stop()
              Sound.play()
              closeFilterWin()
            }}>
            <Text style={styles.btnText}>取消</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.btn, {backgroundColor: Config.baseColor, marginLeft: 20}]}
            onPress={() => {
              Sound.stop()
              Sound.play()
              handleConfirm({
                displayPeriods,
                dataSort,
                showMisData,
                showStatData,
                showPolyline,
              })
              this.switchEnabled = false
            }}>
            <Text style={[styles.btnText, {color: '#FFFFFF'}]}>确认</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  btnText: {
    color: '#999999',
    fontSize: 18,
  },
  btn: {
    width: width / 2 - 50,
    height: 40,
    borderRadius: 4,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btm: {
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#CCCCCC',
  },
  content: {
    flex: 1,
    paddingTop: 3.5,
  },
  ctnText: {
    color: '#000000',
    fontSize: 15,
  },
  help: {
    color: '#449EFC',
    fontSize: 14,
    marginRight: 4,
  },
  selectItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectImg: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  labelText: {
    color: '#666666',
    fontSize: 15,
  },
  rowBetween: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    color: '#000000',
    fontSize: 20,
    textAlign: 'center',
  },
  title: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CCCCCC',
  },
  modal: {
    width: width - 50,
    borderRadius: 10,
  },
})
