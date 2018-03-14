import React, {Component} from 'react'
import {StyleSheet, ProgressViewIOS} from 'react-native'

const styles = StyleSheet.create({
  progressView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
})

export default class Progress extends Component {
  constructor(props) {
    super(props)
    this.state = {
      progress: 0,
    }
    this.destory = false
  }

  componentDidMount() {
    this.updateProgress()
  }

  componentWillUnmount() {
    this.destory = true
  }

  updateProgress() {
    var progress = this.state.progress + 0.01
    if (!this.destory && progress < 0.95) {
      this.setState({ progress })
      requestAnimationFrame(() => this.updateProgress())
    }
  }

  getProgress(offset) {
    var progress = this.state.progress + offset
    return Math.sin(progress % Math.PI) % 1
  }

  render() {
    return (
      <ProgressViewIOS progress={this.getProgress(0.2)} progressTintColor='red' style={styles.progressView}/>
    )
  }
}
