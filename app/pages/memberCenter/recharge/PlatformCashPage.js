import React, { Component } from 'react'
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import HeaderToolBar from '../../../components/HeadToolBar'
import PlatformFirstStep from '../../pageComponents/platformStep/PlatformFirstStep'
import PlatformSecondStep from '../../pageComponents/platformStep/PlatformSecondStep'
import PlatformThreeStep from '../../pageComponents/platformStep/PlatformThreeStep'
import dismissKeyboard from '../../../utils/dismissKeyboard'
import Sound from '../../../components/clickSound'
import Config from '../../../config/global'

const StepComponents = [PlatformFirstStep, PlatformSecondStep, PlatformThreeStep]

class PlatformCashPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      step: 0,
      datas: {},
    }
    this._onPressNextStep = this._onPressNextStep.bind(this)
  }
  componentDidMount() {
    this.setState({ datas: Object.assign(this.state.datas, { amount: this.props.navigation.state.params.amount }) })
  }
  _onPressItem(index) {
    if (this.state.step !== 0) {
      this.setState({ step: index })
    }
  }
  _onPressNextStep(index, data) {
    this.setState({ step: index, datas: Object.assign(this.state.datas, data) })
  }

  render() {
    const step = this.state.step
    const StepComponent = StepComponents[step]

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => {Sound.stop();Sound.play();dismissKeyboard()}}
        activeOpacity={1}>
        <HeaderToolBar
          title={'平台收款'}
          leftIcon={'back'}
          leftIconAction={() => this.props.navigation.goBack()}/>

        <View style={styles.stepContainer}>
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.leftStepWrap}
            onPress={() => {Sound.stop();Sound.play();this._onPressItem.bind(this, 0)()}}>
            <Text style={{ color: Config.baseColor, fontSize: 14 }}>{'1.选择存款账户'}</Text>
            <Image source={require('../../../src/img/ic_arrow_right.png')} style={[styles.imgIcon, { marginLeft: 10 }]} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {Sound.stop();Sound.play();this._onPressItem.bind(this, 1)()}}>
            <Text style={[styles.centerText, (step === 1 || step === 2) ? { color: Config.baseColor } : { color: 'black' }]}>{'2.填写信息'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.rightStepWrap}>
            <Image source={require('../../../src/img/ic_arrow_right.png')} style={[styles.imgIcon, { marginRight: 10 }]} />
            <Text style={[styles.centerText, (step === 2) ? { color: Config.baseColor } : { color: 'black' }]}>{'3.核对信息'}</Text>
          </TouchableOpacity>
        </View>

        <StepComponent
          onPressNextStep={this._onPressNextStep}
          navigation={this.props.navigation}
          datas={this.state.datas}
          token={this.props.token}/>

      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5F5F9',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    padding: 10,
    backgroundColor: '#FFF',
    height : 50,
    borderWidth: .5,
    borderColor: '#e5e5e5',
  },
  leftStepWrap: {
    flex: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightStepWrap: {
    flex: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  imgIcon: {
    width: 10,
    height: 10,
  },
  centerText: {
    marginHorizontal: 10,
    fontSize: 14,
  },
})

const mapStateToProps = (state) => {
  return {
    token: state.userInfo.token,
  }
}

export default connect(mapStateToProps)(PlatformCashPage)
