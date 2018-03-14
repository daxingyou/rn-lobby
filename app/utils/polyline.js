const calPoint = (gu) => {
  let xian = Math.sqrt(Math.pow(30, 2) + Math.pow(gu, 2))
  let ty = 30 * 12.5 / xian
  let tx = Math.sqrt(Math.pow(12.5, 2) - Math.pow(ty, 2))
  return {ty, tx}
}

const calLine = ({ path, numList, displayRecord, unitIndex, rowID, index, item, windowWidth, prizeNum, beforeItem }) => {
  let itemWidth = (windowWidth - beforeItem) / numList.length
  let itemX = beforeItem + itemWidth * index + itemWidth / 2
  let itemY = rowID * 30 + 15
  if (rowID > 0) {
    let lastItem = unitIndex === -1 ? Number(displayRecord[rowID - 1].sum) : displayRecord[rowID - 1][prizeNum].split(',')[unitIndex]
    let tPoint = calPoint((windowWidth - beforeItem) / numList.length * (item - lastItem))
    let ltX = itemX, ltY = itemY - tPoint.ty
    if (item > lastItem) {
      ltX = itemX - tPoint.tx
    } else if (item < lastItem) {
      ltX = itemX + tPoint.tx
    }
    path.lineTo(ltX, ltY)
  }
  if (rowID + 1 < displayRecord.length) {
    let nextItem = unitIndex === -1 ? Number(displayRecord[rowID + 1].sum) : displayRecord[rowID + 1][prizeNum].split(',')[unitIndex]
    let tPoint = calPoint((windowWidth - beforeItem) / numList.length * (item - nextItem))
    let mtX = itemX, mtY = itemY + tPoint.ty
    if (item > nextItem) {
      mtX = itemX - tPoint.tx
    } else if (item < nextItem) {
      mtX = itemX + tPoint.tx
    }
    path.moveTo(mtX, mtY)
  }
}

export default calLine
