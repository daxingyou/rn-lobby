import { StyleSheet, Dimensions } from 'react-native'

const { height, width } = Dimensions.get('window')

const PADDING = 8
const BORDER_RADIUS = 5
const FONT_SIZE = 18
const HIGHLIGHT_COLOR = 'rgba(0, 0, 0, 0.8)'
const OPTION_CONTAINER_HEIGHT = 200

export default StyleSheet.create({
  overlayStyle: {
    width,
    height,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },

  optionContainer: {
    width,
    height: OPTION_CONTAINER_HEIGHT,
    backgroundColor: 'rgba(255,255,255,1)',
    left: 0,
    top: height - OPTION_CONTAINER_HEIGHT,
  },

  cancelContainer: {
    position: 'absolute',
    left: 0,
    bottom: OPTION_CONTAINER_HEIGHT,
  },

  selectStyle: {
    flex: 1,
    borderColor: '#FFF',
    borderWidth: 1,
    paddingHorizontal: 50,
    borderRadius: BORDER_RADIUS,
  },

  selectTextStyle: {
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    fontSize: FONT_SIZE,
  },

  cancelStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    width,
    height: 40,
    backgroundColor: 'rgba(255,255,255,1)',
    borderColor: '#e5e5e5',
    borderBottomWidth: .5,
    paddingHorizontal: PADDING,
  },

  cancelTextStyle: {
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
  },

  optionStyle: {
    padding: PADDING,
    borderBottomWidth: .5,
    borderBottomColor: '#e5e5e5',
  },

  optionTextStyle: {
    textAlign: 'center',
    fontSize: FONT_SIZE,
    color: HIGHLIGHT_COLOR,
    padding : 4,
  },

  sectionStyle: {
    padding: PADDING * 2,
    borderBottomWidth: .5,
    borderBottomColor: '#e5e5e5',
  },

  sectionTextStyle: {
    textAlign: 'center',
    fontSize: FONT_SIZE,
  },
  closeIconStyle: {
    width: 16,
    height: 16,
  },
})
