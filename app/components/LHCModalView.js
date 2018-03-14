import React, { Component } from 'react'
import { StyleSheet, View, Dimensions, TouchableOpacity, Modal, Platform } from 'react-native'
import GridView from './GridView'
import ButtonIos from './ButtonIos'
import Immutable from 'immutable'
import Sound from './clickSound'

const isIos = Platform.OS == 'ios'
const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

export default class ModalView extends Component {
  constructor(props){
    super(props)
    this.state = {
      isModalVisible: false,
      selectedItem: props.selectedMenu,
    }
  }
  componentWillReceiveProps(props) {
    this.setState({
      isModalVisible: props.isModalVisible,
    })
  }
  _renderGridMenuItem = (item) => {
    const isSelect = item.lhc_type_id === this.state.selectedItem.lhc_type_id
    return (
      <ButtonIos
        key={item.lhc_type_name}
        isCross={isSelect}
        flexOrientation='row'
        containerStyle={[styles.gridMenuBtn, isSelect ? { borderColor: '#EC0909' } : { borderColor: '#BFBFBF' }]}
        styleTextLeft={isSelect ? { color: '#EC0909' } : { color: '#464646' }}
        text={item.lhc_type_name}
        onPress={() => {
          Sound.stop()
          Sound.play()
          this._onPressMenuItem(item)
        }}/>
    )
  }
  _onPressMenuItem = (item) => {
    this.setState({ isModalVisible: false, selectedItem: item })
    this.props.onPressMenuItemCallBack(item)
  }
  _renderModal = () => {
    let menus = Immutable.fromJS(this.props.dataArr).toJS()
    delete menus['12']
    delete menus['13']
    delete menus['15']
    delete menus['17']
    delete menus['18']
    delete menus['19']
    delete menus['21']
    menus = Object.keys(menus).map((v)=>{
      menus[v].lhc_type_id == 20 ?menus[v].lhc_type_name = "尾数":null
      return menus[v]
    })
    return (
      <View style={{width:windowWidth,height:windowHeight-64,backgroundColor: 'rgba(0,0,0,0.3)',top:64}}>
        <View key={'menuGrid'} style={styles.gridViewWrap}>
          <GridView
            items={Array.from(menus)}
            itemsPerRow={3}
            renderItem={this._renderGridMenuItem}
            fromModal={true}/>
        </View>
      </View>
    )
  }
  render(){
    const { onPressMenuItemCallBack } = this.props
    return(
      <Modal
        animationType={"none"}
        transparent={true}
        visible={this.state.isModalVisible}>

      <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPress={() => {
          Sound.stop()
          Sound.play()
          this.setState({ isModalVisible: false })
          onPressMenuItemCallBack && onPressMenuItemCallBack(this.state.selectedItem)
        }}>
        {
          this._renderModal()
        }
      </TouchableOpacity>

      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: windowHeight,
    marginTop: isIos?0:-20,
  },
  gridViewWrap: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 10,
  },
  gridMenuBtn: {
    borderWidth: 1,
    marginTop: 10,
    marginLeft: 13,
    marginRight: 13,
    marginBottom: 0,
    width: windowWidth / 4,
    padding: 5,
    borderColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
})
