import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Modal,
  Image,
  Platform,
} from 'react-native'
import tipsImg from '../src/img/ti_shi.png'
import helpImg from '../src/img/shuo_ming.png'
import exampleImg from '../src/img/fan_li.png'

const SubPlayGuide = ({ help, tips, example, closeTips }) => (
  <Modal
    animationType={"slide"}
    transparent={true}
    visible={true}>
    <TouchableWithoutFeedback onPress={() => {closeTips()}}>
      <View style={styles.winWrap}>
        <View style={styles.tipsWin}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>玩法规则</Text>
          </View>
          {
            [
              {img: tipsImg, title: '玩法提示', content: tips},
              {img: helpImg, title: '中奖说明', content: help},
              {img: exampleImg, title: '范例', content: example},
            ].map((guide, index) => (
              <View key={index} style={styles.item}>
                <View style={{flexDirection: 'row'}}>
                  <Image source={guide.img} style={styles.icon} resizeMode='contain'/>
                  <View>
                    <Text style={styles.labelText}>{guide.title}</Text>
                  </View>
                </View>
                <View style={styles.content}>
                  <Text style={styles.contentText}>{guide.content}</Text>
                </View>
              </View>
            ))
          }
        </View>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
)

const styles = StyleSheet.create({
  winWrap: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.50)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipsWin: {
    width: 325,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  item: {
    marginBottom: 5,
    padding: 5,
  },
  titleContainer: {
    marginBottom: 10,
    backgroundColor: 'red',
    paddingVertical: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  title: {
    textAlign: 'center',
    fontSize: 17,
    color: 'white',
  },
  icon: {
    marginTop: Platform.OS !== 'ios' ? 2 : 0,
    width: 30,
    height: 15,
  },
  labelText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    marginLeft: 30,
    paddingVertical: 10,
  },
  contentText: {
    color: '#333333',
    fontSize: 13,
    lineHeight: 18,
  },
})

export default SubPlayGuide
