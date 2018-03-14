import React, { Component } from 'react'
import { View, StyleSheet, ListView } from 'react-native'

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

class GridView extends Component {
  groupItems = (renderItems, renderItemsPerRow) => {
    const itemsGroups = []
    let group = []
    renderItems.forEach((item) => {
      if (group.length === renderItemsPerRow) {
        itemsGroups.push(group)
        group = [item]
      } else {
        group.push(item)
      }
    })
    if (group.length > 0) {
      itemsGroups.push(group)
    }

    return itemsGroups
  }

  renderGroup = (group) => {
    const { renderItem, bottomStyle, callback, rate, fromModal, closeRandom } = this.props

    const itemViews = group.map((item) => {
      return renderItem(item, callback, rate)
    })
    return (
      <View style={[styles.group, bottomStyle, fromModal !== true && !closeRandom && {height: 84}]}>
        {itemViews}
      </View>
    )
  }

  render() {
    const { items, style, itemsPerRow } = this.props

    return (
      <ListView
        ref='listView'
        removeClippedSubviews={false}
        enableEmptySections={true}
        dataSource={ds.cloneWithRows(this.groupItems(items, itemsPerRow))}
        renderRow={this.renderGroup}
        style={style}/>
    )
  }
}

const styles = StyleSheet.create({
  group: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
})

GridView.defaultProps = {
  items: [],
  renderItem: null,
  style: undefined,
  itemsPerRow: 1,
  onEndReached: undefined,
}

export default GridView
