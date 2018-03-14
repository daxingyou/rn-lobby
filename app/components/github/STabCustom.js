const React = require('react')
const PropTypes = require('prop-types')
const createReactClass = require('create-react-class')
import Button from 'react-native-scrollable-tab-view/Button'
const {
  StyleSheet,
  Text,
  View,
} = require('react-native')

const STabCustom = createReactClass({
  propTypes: {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,
    backgroundColor: PropTypes.string,
    activeTextColor: PropTypes.string,
    inactiveTextColor: PropTypes.string,
    textStyle: Text.propTypes.style,
    tabStyle: View.propTypes.style,
    renderTab: PropTypes.func,
    underlineStyle: View.propTypes.style,
  },

  getDefaultProps() {
    return {
      activeTextColor: '#FFFFFF',
      inactiveTextColor: '#666666',
      backgroundColor: null,
    }
  },

  renderTab(name, page, isTabActive, onPressHandler) {
    const { activeTextColor, inactiveTextColor, textStyle, tabStyle, activeTabStyle } = this.props
    const textColor = isTabActive ? activeTextColor : inactiveTextColor
    return (
      <Button
        style={{flex: 1 }}
        key={name}
        accessible={true}
        accessibilityLabel={name}
        accessibilityTraits='button'
        onPress={() => onPressHandler(page)}>
        <View style={[styles.tab, tabStyle, isTabActive ? activeTabStyle : null]}>
          <Text style={[textStyle, {color: textColor}]}>
            {name}
          </Text>
        </View>
      </Button>
    )

  },

  render() {
    return (
      <View style={[styles.tabs, {backgroundColor: this.props.backgroundColor }, this.props.style ]}>
        {this.props.tabs.map((name, page) => {
          const isTabActive = this.props.activeTab === page
          const renderTab = this.props.renderTab || this.renderTab
          return renderTab(name, page, isTabActive, this.props.goToPage)
        })}
      </View>
    )
  },
})

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
})

module.exports = STabCustom
