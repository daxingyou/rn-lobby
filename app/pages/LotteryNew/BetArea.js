import React from 'react'
import { View, StyleSheet } from 'react-native'
import GridView from './GridView'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import ScrollableTab from './ScrollableTab'
import HeXiaoTypes from './HeXiaoTypes'
import Note from './Note'

const BetArea = ({ setRef, currentPlay, heXiaoCategory, setHeXiaoCategory, onShowGuide,
                   currentSubPlay, activeTab, onChangeTab, onPressItem, selectNames }) => (
  <View style={[styles.betArea, {marginTop: currentPlay.name === '合肖' ? 5 : currentPlay.play.length === 1 ? 10 : 0}]}>
    {
      currentPlay.play.length === 1 || currentPlay.name === '正码过关'
        ? (
          <View style={{flex: 1}}>
            {currentPlay.name === '合肖' && <HeXiaoTypes heXiaoCategory={heXiaoCategory} setHeXiaoCategory={setHeXiaoCategory}/>}
            {currentPlay.name === '特码包三' && <Note rate={true} text={` ${Number(currentSubPlay.detail[0].maxOdds).toFixed(3)}`}/>}
            <GridView
              onShowGuide={onShowGuide}
              onPressItem={onPressItem}
              selectNames={selectNames}
              currentPlay={currentPlay.name === '正码过关' && currentPlay}
              currentSubPlay={currentSubPlay}
              buttonType={isNaN(currentSubPlay.detail[0].name) ? 'square' : 'ball'}
              oddsOnTab={currentPlay.name === '特码包三'}
              sx={currentSubPlay.detail[0].name === '鼠'}/>
          </View>
        )
        : (
          <ScrollableTabView
            ref={ref => setRef(ref)}
            renderTabBar={() => (
              <ScrollableTab
                activeTab={activeTab}
                textArr={currentPlay.play.map(play => play.groupName)}
                rate={['连码', '自选不中', '中一'].includes(currentPlay.name) && currentPlay.play.map(play => play.detail[0].maxOdds)}/>
            )}
            onChangeTab={({ i }) => onChangeTab(i)}>
            {
              currentPlay.play.map((currentSubPlay, index) => (
                <GridView
                  key={index}
                  tabs={true}
                  onShowGuide={onShowGuide}
                  onPressItem={onPressItem}
                  selectNames={selectNames}
                  currentSubPlay={currentSubPlay}
                  buttonType={isNaN(currentSubPlay.detail[0].name) ? 'square' : 'ball'}
                  oddsOnTab={['连码', '自选不中', '中一'].includes(currentPlay.name)}
                  sx={currentSubPlay.detail[0].name === '鼠'}
                  wx={currentSubPlay.detail[0].name === '金'}/>
              ))
            }
          </ScrollableTabView>
        )
    }
  </View>
)

const styles = StyleSheet.create({
  betArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
})

export default BetArea
