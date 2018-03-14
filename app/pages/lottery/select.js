import React, {Component} from 'react'
import {
  View,
  ListView,
} from 'react-native'
import Immutable from 'immutable'
import SelectItem from './selectItem'

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

export default class Select extends Component {
  handleClick = (label, val, action) => {
    const { data, orderInfo, onSelect } = this.props
    let select = {}, arr = []
    if (orderInfo && orderInfo.select && Object.keys(orderInfo.select).length > 0) {
      select = Immutable.fromJS(orderInfo.select).toJS()
      arr = select[label] || []
    } else {
      for (let item of data) {
        select[item.label] = []
      }
    }

    if (!action) {
      let playId = String(orderInfo.playId)

      if (playId === '99') {
        if (select[label].includes(val)) {
          arr = []
        } else {
          arr = ['111', '222', '333', '444', '555', '666']
        }
      } else if (playId === '100') {
        if (select[label].includes(val)) {
          arr = []
        } else {
          arr = ['123', '234', '345', '456']
        }
      } else if (['2044', '2043', '2042', '2040', '2041'].includes(playId)) {
        arr = [val]
      } else {
        if (arr.includes(val)) {
          arr.splice(arr.indexOf(val), 1)
        } else {
          arr.push(val)
        }

        if (playId === '92') {
          if (label === '胆码') {
            arr = []
            arr.push(val)
            if (select['拖码'].includes(val)) {
              select['拖码'].splice(select['拖码'].indexOf(val), 1)
            }
          }
          if (label === '拖码' && select['胆码'].includes(val)) {
            select['胆码'].splice(select['胆码'].indexOf(val), 1)
          }
        }
      }

      if (playId === '93') {
        if (label === '二同号') {
          arr = []
          arr.push(val)
          if (select['不同号'].includes(val)) {
            select['不同号'].splice(select['不同号'].indexOf(val), 1)
          }
        }
        if (label === '不同号' && select['二同号'].includes(val)) {
          select['二同号'].splice(select['二同号'].indexOf(val), 1)
        }
      }

    } else {
      arr = val
    }

    select[label] = arr
    onSelect(select)
  }

  render() {
    const { data, orderInfo } = this.props

    return (
      <View style={{flex: 1}}>
        <ListView
          removeClippedSubviews={false}
          dataSource={ds.cloneWithRows(data)}
          renderRow={(rowData) => (
            <SelectItem
              data={rowData}
              click={this.handleClick.bind(this)}
              select={orderInfo.select || {}}/>
          )}/>
      </View>
    )
  }
}
