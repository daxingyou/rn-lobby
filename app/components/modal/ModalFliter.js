import React from 'react'
import {
  View,
  Text,
  Modal,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'
import BaseComponent from '../github/BaseComponent'
import Sound from '../clickSound'
import Immutable from 'immutable'

const windowWidth = Dimensions.get('window').width

export default class ModalFliter extends BaseComponent {

  constructor(props) {
    super(props)
    this._bind(
      'open',
      'close',
      '_handleCancel'
    )
    this.state = {
      isVisible: false,
      transparent: true,
      stateKeeping: {},
      selectId: 'all',
    }
  }

  _handleCancel() {
    if (this.props.onCancel) {
      this.props.onCancel()
    }
    this.close()
  }


  close() {
    this.setState({ isVisible: false })
  }
  open() {
    this.setState({ isVisible: true })
  }

  handleItem(id) {
    this.setState({ selectId: id }, () => {
      let selectId = id
      if (id === 'all') {
        selectId = this.props.data.map((item) => item.id).toString()
      }
      this.props.onSubmit({ selectedId: selectId })
      this.close()
    })

  }

  renderFilter() {
    const { selectId } = this.state
    const { data, title } = this.props
    let dataTmp = Immutable.fromJS(data).toJS()
    dataTmp.unshift({id: 'all', name: '全部'})
    if (dataTmp.length % 3 != 0) {
      dataTmp = dataTmp.concat(Array.from({length: 3 - dataTmp.length % 3}, () => {}))
    }
    return (
      <View style={styles.overlayStyle}>
        <TouchableWithoutFeedback
          onPress={()=>{
            this.close()
          }}>
            <View
              style={{flex:1}} />
        </TouchableWithoutFeedback>
        <View>
          <View style={styles.filterContainer}>
            <View style={styles.title}>
              <Text style={styles.titleText}>{title || '请选择交易类型'}</Text>
            </View>
            <View style={styles.filterList}>
              {
                dataTmp && dataTmp.length > 0 && dataTmp.map((item, index) => {
                  if (item) {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[styles.filterItem, selectId == item.id ? styles.filterItemAct : null]}
                        activeOpacity={0.85}
                        onPress={() => {
                          Sound.stop()
                          Sound.play()
                          this.handleItem(item.id.toString())
                        }}>
                        <Text style={[styles.filterItemText, selectId == item.id ? styles.filterItemTextAct : null]}>{item.name}</Text>
                      </TouchableOpacity>
                    )
                  } else {
                    return (<View key={index} style={styles.filterItemMark} />)
                  }

                })
              }
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.cancel}
            onPress={() => {
              Sound.stop()
              Sound.play()
              this.close()
            }}>
            <Text style={styles.cancelText}>取消</Text>
          </TouchableOpacity>
        </View>

      </View>
    )
  }

  render() {
    const modal = (
      <Modal
        transparent={this.state.transparent}
        visible={this.state.isVisible}
        onRequestClose={this.close}
        animationType={this.props.animationType}>
        {this.renderFilter()}
      </Modal>
    )

    return (
      <View>
        {modal}
        <TouchableOpacity onPress={() => {
          Sound.stop()
          Sound.play()
          this.open()
        }}>
          {this.props.children}
        </TouchableOpacity>
      </View>
    )
  }
}

ModalFliter.defaultProps = {
  isVisible: false,
  animationType: 'slide',
  onSubmit: () => {},
  onCancel: () => {},
  data: [],
}

const styles = StyleSheet.create({
  overlayTouch:{
    flex: 1,
  },
  overlayStyle: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  filterContainer: {
    minHeight: 300,
    backgroundColor: '#F8F8F8',
  },
  title: {
    height: 45,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: '#000',
    fontSize: 14,
  },
  filterList: {
    paddingTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  filterItem: {
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    width: windowWidth * 0.3,
    height: 50,
    marginBottom: 10,
  },
  filterItemAct: {
    backgroundColor: '#45C758',
  },
  filterItemMark: {
    width: windowWidth * 0.3,
    height: 50,
  },
  filterItemText: {
    color: '#666666',
    fontSize: 14,
  },
  filterItemTextAct: {
    color: '#fff',
  },
  cancel: {
    marginTop: 10,
    backgroundColor: '#FFF',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    color: '#000',
    fontSize: 14,
  },
})
