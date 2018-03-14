import React from 'react'
import { View, Dimensions } from 'react-native'
import { LoadingView } from '../common'

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

const ModalLoading = ({ visible }) => {
  const { overLayContainer } = styles
  return (
    visible?
    <View style={overLayContainer}>
      <LoadingView />
    </View>
    :<View />
  )
}

const styles = {
  overLayContainer: {
    position: 'absolute',
    width: windowWidth,
    height: windowHeight,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    marginTop: 10,
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
}

export { ModalLoading }
