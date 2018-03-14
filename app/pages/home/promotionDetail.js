import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  WebView,
  Linking,
} from 'react-native'

import LotteryNavBar from '../../components/lotteryNavBar'

export default class PromotionDetail extends Component {

  _injectJavaScript = () => `
    var a = document.getElementsByTagName('a');
    for(var i = 0; i < a.length; i++){
      a[i].onclick = function (event) {
        window.postMessage(this.href);
        event.preventDefault();
      }
    }
  `

  _onMessage = (e) => {
    Linking.openURL(e.nativeEvent.data).catch(err => console.error('打开外部链接出错', err))
  }

  render() {
    const { navigation } = this.props
    const { data } = navigation.state.params
    return (
      <View style={{flex: 1}}>
        <LotteryNavBar navigation={navigation} title='详情'/>
        <View style={styles.container}>
          <View style={styles.title}>
            <Text style={styles.titleText}>{data.activity_name}</Text>
          </View>
          <Text style={styles.activetyDate}>
            {`活动时间：${data.activity_starttime.split(' ')[0]} 至 ${data.activity_finishtime.split(' ')[0]}`}
          </Text>
          <View style={styles.webViewWrap}>
            <WebView
              scrollEnabled={true}
              automaticallyAdjustContentInsets={true}
              style={styles.webView}
              onMessage={this._onMessage}
              injectedJavaScript={this._injectJavaScript()}
              source={{
                html: `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta name="viewport" content="width=300, initial-scale=1, maximum-scale=1"/>
                      <style>
                        p > img {
                          width: 100%;
                        }
                      </style>
                    </head>
                    <body>
                      ${data.activity_description}
                    </body>
                  </html>
                `,
              }}/>
          </View>
        </View>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    height: 45,
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
  },
  titleText: {
    color: '#333333',
    fontSize: 15,
  },
  activetyDate: {
    marginTop: 8,
    marginLeft: 20,
    color: '#666666',
    fontSize: 13,
  },
  webViewWrap: {
    flex: 1,
    paddingHorizontal: 10,
  },
  webView: {
    flex:1,
  },
})
