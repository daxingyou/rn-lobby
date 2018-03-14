import { TextInput } from 'react-native'

const { State: TextInputState } = TextInput

const dismissKeyboard = () => {
  TextInputState.blurTextInput(TextInputState.currentlyFocusedField())
}

export default dismissKeyboard
