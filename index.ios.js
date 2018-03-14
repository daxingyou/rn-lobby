/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react'
import { AppRegistry } from 'react-native'
import App from './app/containers/app'

export default class Hatsune extends Component {
  render() {
    return (
      <App />
    )
  }
}

AppRegistry.registerComponent('hatsune', () => Hatsune)
