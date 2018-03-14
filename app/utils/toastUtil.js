import Toast from 'react-native-root-toast'

let toast

export const toastShort = (content, onHidden) => {
  if (content) {
    if (toast !== undefined) {
      Toast.hide(toast)
    }
    toast = Toast.show(content.toString(), {
      duration: Toast.durations.SHORT,
      position: Toast.positions.CENTER,
      shadow: false,
      animation: true,
      hideOnPress: true,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      delay: 200,
      onHidden : function () {
        !!onHidden && typeof onHidden == 'function' && onHidden()
      },
    })
  }
}

export const toastLong = (content) => {
  if (content) {
    if (toast !== undefined) {
      Toast.hide(toast)
    }
    toast = Toast.show(content.toString(), {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
      shadow: false,
      animation: true,
      hideOnPress: true,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      delay: 0,
    })
  }
}
