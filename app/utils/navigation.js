import { NavigationActions } from "react-navigation"
import { Alert } from "react-native"
import { typesList } from './config'

export const goToTrend = (navigation, category_id, lottery_id, fromBet) => {
  navigation.navigate('Trend', {
    fromBet,
    categoryId: category_id,
    lotteryId: lottery_id,
    typesList: typesList[category_id],
  })
}

export const goToLottery = (navigation, categoryId, lotteryId, lobbyPCDD, playIndex, fromBetPage, fromLotteryNavBar, nav) => {
  if (lobbyPCDD) {
    navigation.dispatch({ type: 'LOBBY_PCDD' })
    setTimeout(()=>{
      navigation.dispatch({ type: 'LOBBY_PCDDUN' })
    },1000)
  } else if (fromBetPage) {
    navigation.goBack()
  } else {
    let betPage = 'Bet'
    if (categoryId === '6') {
      betPage = 'LotteryNew'
    } else if (categoryId === '7') {
      betPage = 'LhcMainPage'
    } else if (categoryId === '8') {
      betPage = 'LotteryNew'
    }
    if (fromLotteryNavBar) {
      const topIndex = nav.index
      const tabIndex = nav.routes[topIndex].index
      const firstRoutesName = nav.routes[topIndex].routes[tabIndex].routes[0].routeName

      const resetAction = NavigationActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({ routeName: firstRoutesName }),
          NavigationActions.navigate({ routeName: betPage, params: {lotteryId, categoryId} }),
        ],
      })
      navigation.dispatch(resetAction)
    } else {
      navigation.navigate(betPage, {
        lotteryId,
        categoryId,
        playIndex: playIndex !== null ? playIndex : undefined,
      })
    }
  }
}

let alertPresent
export const backFun = (navigation, orderList, clearOrderList, cleanIssueList, fromBet) => {
  // 跳转卡顿
  setTimeout(() => {
    cleanIssueList()
  }, 300)
  if (orderList && orderList.length > 0 && !fromBet) {
    if (!alertPresent) {
      alertPresent = true
      Alert.alert('', '是否放弃所选的号码?', [
        {text: '取消', onPress: () => alertPresent = false},
        {text: '确定', onPress: () => {
            if (orderList && orderList.length > 0) {
              // 跳转卡顿
              setTimeout(() => {
                clearOrderList()
              }, 300)
            }
            navigation.goBack()
            alertPresent = false
          }},
      ], { cancelable: false })
    }
  } else {
    navigation.goBack()
  }
}
