import React from 'react'
import { Modal, Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import { toastShort } from '../../utils/toastUtil'
const AlertModal = ({ setModalVisible, navigation, userInfo, modalVisible }) => {
    return (
      <View>
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}>
         <View style={styles.modalAlertShadow}>
          <View style={styles.modalAlertBody}>
            <Image
              style={styles.orderrecharge}
              source={require('../../src/img/orderrecharge.png')}/>
            <Text style={{marginVertical: 10,fontSize:17}}>您的账户余额不足！</Text>
            <TouchableOpacity
              style={styles.modalAlertorder}
              onPress={() => {
                if (userInfo.account_type === 2) {
                  toastShort('试玩账号不能操作该功能!')
                } else {
                  navigation.navigate('RechargeMainPage')
                }

                setModalVisible(!modalVisible)
              }}>
              <Text style={{color:'#fff',fontSize: 15}}>去充值</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              setModalVisible(!modalVisible)
            }}>
              <Text style={{color:'#979797',fontFamily:'PingFangSC-Regular',fontSize:15}}>取消</Text>
            </TouchableOpacity>
          </View>
        </View>
        </Modal>
      </View>
    )
}

const styles = StyleSheet.create({
  modalAlertShadow: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalAlertBody: {
    width: 300,
    height: 280,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 100,
  },
  modalAlertorder: {
    backgroundColor: '#EC0909',
    shadowOffset: {width:100, height:100},
    shadowColor: 'rgba(247,34,32,0.66)',
    shadowRadius: 10,
    borderRadius: 5,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    marginVertical: 10,
  },
  orderrecharge: {
    width: 123,
    height: 115,
  },
})

export default AlertModal
