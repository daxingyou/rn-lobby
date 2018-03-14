import React, {Component} from "react"
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native'
import Sound from '../components/clickSound'

export default class SelectedTab extends Component {
  componentWillReceiveProps (nextProps){
    if(nextProps.activeTab >= this.props.activeTab && nextProps.activeTab >= 5) {
      this._scrollView.scrollTo({x: this.props.containerWidth*0.8, y: 0, animated: true })
    } else if(nextProps.activeTab>=3) {
      this._scrollView.scrollTo({x: this.props.containerWidth/3, y: 0, animated: true })
    } else {
      this._scrollView.scrollTo({x: 0, y: 0, animated: true })
    }
  }
  render(){
    const tabUnderlineStyle = {
      position: 'absolute',
      width: 80,
      height: 3,
      backgroundColor: 'red',
      bottom: 0,
      borderRadius: 1.5,
    }

    const rate = this.props.rate?this.props.rate:null
    return(
      <View style={styles.srollTabContainer}>
        <ScrollView
          ref={(scrollView) => { this._scrollView = scrollView }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{flex:1}}>
          {
            this.props.textArr.map((v,i)=>{
              return(
                <TouchableOpacity key={i} style={rate? {width: 80, height: 50}: {width: 80, height: 35}} onPress={() => {Sound.stop();Sound.play();this.props.goToPage(i)}}>
                  {this.props.activeTab === i
                    ? <Animated.View style={tabUnderlineStyle} />
                    : null
                  }
                  <View style={styles.contentWrap}>
                    <View style={styles.selectedBar_bg} key={i} >
                      <Text style={this.props.activeTab === i? styles.textSelected: styles.text}>{v}</Text>
                    </View>
                  </View>

                  {rate?
                    <View>
                      <Text style={this.props.activeTab === i? styles.textSelected2: styles.text2}>{rate[i]}</Text>
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
  srollTabContainer: {
    paddingTop: 10,
    paddingLeft:10,
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
  text2: {
    textAlign: "center",
    color: '#ff0000',
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
  textSelected: {
    fontSize: 15,
    textAlign: "center",
    color: "red",
  },
  textSelected2: {
    textAlign: "center",
    color: "#ff0000",
  },
})
