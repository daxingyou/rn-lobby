import Sound from 'react-native-sound'
import { phoneSettings } from '../containers/appNavigator'

this.sound = {
  play:()=>{
    if (phoneSettings.sound) {
      this.sound = new Sound('bet.wav', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          return
        } else { // loaded successfully
          this.sound.play()
        }
      })
    }
  },
  stop:()=>{
    if (phoneSettings.sound) {
      this.sound = new Sound('bet.wav', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          return
        } else { // loaded successfully
          this.sound.stop()
        }
      })
    }
  },
}

export default this.sound
