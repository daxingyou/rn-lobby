import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  Image,
} from 'react-native'
import Carousel from 'react-native-looped-carousel'
import Sound from '../../components/clickSound'
import { getActivityList } from '../../actions'

class Activity extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.getActivityList()
  }

  render() {
    const { navigation } = this.props
    const { activityList } = this.props

    return (
      <View style={styles.bannerWrap}>
        <Carousel
          delay={2500}
          autoplay={true}
          style={styles.banner}
          bullets={true}
          chosenBulletStyle={{margin: 5, width: 5, height: 5}}
          bulletStyle={{margin: 5, width: 5, height: 5}}
          bulletsContainerStyle={{paddingTop: 25}}>
          {
            activityList && activityList.length > 0 ? activityList.map((item, index) => {
              return (
                <TouchableOpacity
                  style={{flex: 1}}
                  key={index}
                  activeOpacity={0.85}
                  onPress={() => {
                    Sound.stop()
                    Sound.play()
                    navigation.navigate('PromotionDetail', {data: item})
                  }}>
                  {item.activity_image !== '' && <Image source={{uri: item.activity_image}} style={styles.banner} resizeMode={'stretch'}/>}
                </TouchableOpacity>
              )
            }) : <Image source={require('../../src/img/home_banner.png')} style={styles.banner}/>
          }
        </Carousel>
      </View>
    )
  }
}

const screenWidth = Dimensions.get('window').width
const styles = StyleSheet.create({
  bannerWrap: {
    width: screenWidth,
    height: screenWidth * 240 / 750,
  },
  banner: {
    width: screenWidth,
    height: screenWidth * 240 / 750,
  },
})

const mapStateToProps = (state) => {
  const { activityList } = state
  return { activityList }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getActivityList: () => {
      dispatch(getActivityList())
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Activity)
