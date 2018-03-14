import React from 'react'
import { View, Text, Dimensions, TouchableWithoutFeedback, Modal, Clipboard, TouchableOpacity } from 'react-native'

const TransactionDetails = ({data, showDetailWin, closeDetailWin}) => {
  return (
    <Modal
      animationType={"slide"}
      transparent={true}
      visible={showDetailWin}>
      <TouchableWithoutFeedback
        onPress={() => { closeDetailWin() }}>
        <View style={styles.detailWinWrap}>
          <TouchableWithoutFeedback
            onPress={() => false}>
            <View style={styles.detailWin}>
              <View  style={styles.detailTitle}>
                <View style={styles.amoutDetail}>
                  <Text style={styles.amountIcon}>{data.amountIcon}</Text>
                  <Text style={styles.amount}>
                    {data.amount}
                  </Text>
                </View>
                <View style={styles.status}>
                  <Text style={styles.statusText}>
                    {data.status}
                  </Text>
                </View>
              </View>
              <View style={styles.content}>
                {
                  data.DetailList && data.DetailList.map((item, index) =>
                  <View style={styles.row} key={index}>
                    <View style={styles.left}>
                      <View style={styles.icon}>
                        <View style={index === 0 ? styles.verticalLine0 : styles.verticalLine} />
                        <View style={styles.circle} />
                        <View style={index === 0 ? styles.verticalLine0 : styles.verticalLine} />
                      </View>
                      <Text style={styles.labelText}>{item.label}</Text>
                    </View>
                    <View style={styles.right}>
                      <Text style={styles.valueText}>{item.content}</Text>
                    </View>
                    {
                      item.label == '交易单号' && (
                        <TouchableOpacity
                          style={styles.copy}
                          onPress={() => {
                            Clipboard.setString(item.content)
                          }}>
                          <Text style={styles.copyText}>复制</Text>
                        </TouchableOpacity>
                      )
                    }
                  </View>
                  )
                }
                {
                  data.remark ?
                  <View style={styles.remark}>
                    <Text style={styles.remarkcontent}>备注：{data.remark}</Text>
                  </View>
                  : null
                }
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const { width } = Dimensions.get('window')

const styles = {
  detailWinWrap: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailWin: {
    width: width - 50,
  },
  detailTitle: {
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    height: 85,
    backgroundColor: '#F7450A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  amoutDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountIcon: {
    color: '#fff',
    fontSize: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -5,
    marginRight: 5,
  },
  amount: {
    color: '#fff',
    fontSize: 35,
  },
  status: {
    width: 80,
    height: 20,
    backgroundColor: '#FFDA61',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  statusText: {
    color: '#F1380E',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  content: {
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    backgroundColor: '#fff',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    alignItems: 'center',
  },
  verticalLine: {
    width: 1,
    backgroundColor: '#45C658',
    height: 12.5,
  },
  verticalLine0: {
    width: 1,
    backgroundColor: '#45C658',
    height: 25,
  },
  circle: {
    borderRadius: 50,
    width: 8,
    height: 8,
    borderColor: '#45C658',
    borderWidth: 1,
    marginVertical: 5,
  },
  labelText: {
    color: '#666666',
    fontSize: 14,
    marginLeft: 7,
  },
  valueText: {
    color: '#666666',
    fontSize: 14,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copy: {
    position: 'absolute',
    right: 0,
    top: 50,
    width: 40,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#D7E9F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyText: {
    color: '#59A3EC',
    fontSize: 14,
  },
  remark: {
    paddingHorizontal: 5.5,
    borderRadius: 11.25,
    paddingVertical: 4.5,
    marginTop: 10,
    backgroundColor: '#FFEFEF',
  },
  remarkcontent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#EC0909',
    letterSpacing: 1.12,
    backgroundColor: 'transparent',
  },
}

export default TransactionDetails
