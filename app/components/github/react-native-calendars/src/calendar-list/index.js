import React, { Component } from 'react'
import { ScrollView, Dimensions } from 'react-native'

import Calendar from '../calendar'
import { yesterday } from '../../../../../utils'

const windowHeight = Dimensions.get('window').height
const lastDay = yesterday()

class CalendarList extends Component {
  constructor(props) {
    super(props)
    const currentMonth = new Date(new Date(lastDay).setDate(1)).toISOString().slice(0, 10)
    this.state = {
      months: this.getMonths(currentMonth, props.pastScrollRange).reverse(),
      marked: props.page === 'PlatformSecondStep' ? {} : {
        [lastDay]: [{color: 'red', textColor: 'white'}],
      },
    }
    this.range = [lastDay]

    this.onDayPress = this.onDayPress.bind(this)
  }

  getMonths(current, pastScrollRange) {
    const dateArray = [current]
    const currentDate = new Date(current)
    for (let i = pastScrollRange; i > 0; i--) {
      let date = currentDate
      date = date.setMonth(date.getMonth() - 1)
      dateArray.push(new Date(date).toISOString().slice(0, 10))
    }
    return dateArray
  }

  getDates(start, end) {
    const dateArray = []
    const startDate = new Date(start)
    const endDate = new Date(end)
    while (startDate < endDate) {
      let date = startDate
      date = date.setDate(date.getDate() + 1)
      dateArray.push(new Date(date).toISOString().slice(0, 10))
    }
    dateArray.pop()
    return dateArray
  }

  onDayPress(day) {
    const { page, onDateChange, onRangeChange, navigation } = this.props

    const pressDay = new Date(day.timestamp)
    const yesterday = new Date(lastDay)

    if (page === 'PlatformSecondStep' && pressDay <= new Date()) {
      onDateChange(day.dateString)
      navigation.goBack()
    } else if (pressDay <= yesterday) {
      const { marked } = this.state
      const markedKeys = Object.keys(marked)

      // Clear 'range' and 'marked' before creating new 'range'
      if (markedKeys.filter(key => marked[key][0].color === 'red').length === 2) {
        this.range = []
        this.setState({
          marked: {},
        })
      }

      // Set start date and end date to red
      this.setState(preState => {
        return ({
          marked: {
            ...preState.marked,
            [day.dateString]: [{color: 'red', textColor: 'white'}],
          },
        })
      })

      // Update 'range' to `[start, end]`
      let newRange = this.range
      if (day.timestamp > newRange[0]) {
        newRange.push(day.timestamp)
      } else {
        newRange = [day.timestamp].concat(newRange)
      }
      this.range = newRange

      // Set dates that within the range to pink
      if (markedKeys.length === 1) {
        this.getDates(newRange[0], newRange[1]).map(date => {
          this.setState(preState => {
            return ({
              marked: {
                ...preState.marked,
                [date]: [{color: '#FFD5D6'}],
              },
            })
          })
        })
      }

      const range = this.range.map(i => {
        return new Date(i).toISOString().slice(0, 10)
      })
      onRangeChange(range)
    }
  }

  render() {
    const { marked } = this.state
    const { page } = this.props

    return (
      <ScrollView
        ref='scrollView'
        onContentSizeChange={(w, h) => { this.refs.scrollView.scrollTo({x:0, y: page === 'PlatformSecondStep' ? h-windowHeight+64 : h-windowHeight+64+50, animated: false}) }}>
        {this.state.months.map(month => {
          return (
            <Calendar
              key={month}
              current={month}
              hideArrows={true}
              hideExtraDays={true}
              onDayPress={day => this.onDayPress(day)}
              markedDates={marked}
              markingType={'interactive'}/>
          )
        })}
      </ScrollView>
    )
  }
}

export default CalendarList
