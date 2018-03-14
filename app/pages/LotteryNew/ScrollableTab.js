import React, {Component} from "react"
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native'
import Sound from '../../components/clickSound'
import Config from '../../config/global'

export default class ScrollableTab extends Component {
  componentWillReceiveProps (nextProps){
    const { activeTab, containerWidth } = this.props
    
    if(nextProps.activeTab >= activeTab && nextProps.activeTab >= 5) {
      this._scrollView.scrollTo({x: containerWidth*0.8, y: 0, animated: true })
    } else if(nextProps.activeTab >= 3) {
      this._scrollView.scrollTo({x: containerWidth/3, y: 0, animated: true })
    } else {
      this._scrollView.scrollTo({x: 0, y: 0, animated: true })
    }
  }

  render(){
    const { rate, textArr, activeTab, goToPage } = this.props

    return(
      <View style={styles.srollTabContainer}>
        <ScrollView
          ref={(scrollView) => { this._scrollView = scrollView }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{flex:1}}>
          {
            textArr.map((v,i)=>{
              return(
                <TouchableOpacity
                  key={i}
                  style={rate? {width: 80, height: 50}: {width: 80, height: 35}}
                  onPress={() => {
                    Sound.stop()
                    Sound.play()
                    goToPage(i)
                  }}>
                    {activeTab === i
                      ? <Animated.View style={styles.tabUnderlineStyle} />
                      : null
                    }
                    <View style={styles.contentWrap}>
                      <View style={styles.selectedBar_bg} key={i} >
                        <Text style={[styles.text, activeTab === i && {color: Config.baseColor}]}>{v}</Text>
                      </View>
                    </View>

                    {rate?
                      <View>
                        <Text style={styles.rate}>{rate[i].split(',').map(num => Number(num).toFixed(2)).join(', ')}</Text>
                      </View>:null
                    }
                </TouchableOpacity>

              )
            })
          }
        </ScrollView>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  tabUnderlineStyle: {
    position: 'absolute',
    width: 80,
    height: 3,
    backgroundColor: Config.baseColor,
    bottom: 0,
    borderRadius: 1.5,
  },
  srollTabContainer: {
    paddingLeft: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E6E8",
  },
  contentWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
    color: '#666',
    textAlign: "center",
  },
  selectedBar_bg: {
    height: 25,
    width: 70,
    paddingTop: 2,
    paddingBottom: 2,
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    left: 0,
  },
  rate: {
    fontSize: 11,
    textAlign: "center",
    color: Config.baseColor,
  },
})
