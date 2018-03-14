import {monetaryUnit, digits} from "./config"

// 计算注单总金额
export const getTotal = (unit, betNum, unitPrice) => (
  betNum * unitPrice / Math.pow(10, monetaryUnit[unit] || 0)
)

// PC蛋蛋28个球 六合彩49个球
export const ballNums = (categoryId) => {
  const config = {
    '6': {
      length: 28,
      add: 0,
      addZero: false,
    },
    '8': {
      length: 49,
      add: 1,
      addZero: true,
    },
  }

  return Array.from(new Array(config[categoryId].length), (val, index) => index + config[categoryId].add).map(num => {
    const numString = String(num)
    return numString.length === 1 && config[categoryId].addZero
      ? `0${numString}`
      : numString
  })
}

// Split array into chunks
if (!Array.prototype.chunk) {
  const ceil = Math.ceil
  Object.defineProperty(Array.prototype, 'chunk', {value: function(n) {
    return Array(ceil(this.length/n)).fill().map((_,i) => this.slice(i*n,i*n+n))
  }})
}

// 阶乘
export const factorial = (n) => {
  if (n === 0) {
    return 1
  }
  // 递归
  return n * factorial(n - 1)
}

// 组合个数
export const combinatorics = (base, select) => {
  return factorial(base)/factorial(base-select)/factorial(select)
}

const addProperties = function(dst, src) {
  Object.keys(src).forEach(function(p) {
    Object.defineProperty(dst, p, {
      value: src[p],
    })
  })
}

const common = {
  forEach: function(f) {
    let e
    this.init()
    while (e = this.next()) f(e)
    this.init()
  },
}

const nextIndex = function(n) {
  const smallest = n & -n,
    ripple = n + smallest,
    new_smallest = ripple & -ripple,
    ones = ((new_smallest / smallest) >> 1) - 1
  return ripple | ones
}

// 组合内容
export const combination = function(ary, nelem) {
  const result = []
  const first = (1 << nelem) - 1,
    maxIndex = 1 << ary.length,
    that = Object.create(ary.slice())
  addProperties(that, {
    init: function() {
      this.index = first
    },
    next: function() {
      if (this.index >= maxIndex) return
      let i = 0,
        n = this.index,
        result = []
      for (; n; n >>>= 1, i++) {
        if (n & 1) result[result.length] = this[i]
      }

      this.index = nextIndex(this.index)
      return result
    },
  })
  addProperties(that, common)
  that.init()
  let a
  while(a = that.next()) result.push(a)
  return result
}

export const calCheckboxBetNum = (playId, data) => {
  let coefficient = 2
  if (['61', '62', '63'].includes(playId)) {
    coefficient = 2
  } else if (['64', '65', '66', '67', '68'].includes(playId)) {
    coefficient = 3
  } else if (['69', '70'].includes(playId)) {
    coefficient = 4
  }
  return calCombination(data.length, coefficient)
}

export const calInputBetNum = (playId = '', data = []) => {
  let min = 0, max = 9
  if (data && data.length > 0) {
    let sort = false
    if (playId.indexOf('hunhe') !== -1) {
      sort = true
    }
    let coefficient = 5
    if (playId === '2') {
      coefficient = 5
    } else if (playId === '11'
            || playId === '18'
            || playId === '70') {
      coefficient = 4
    } else if (playId === '25'
            || playId === '31'
            || playId === '37'
            || playId === '65') {
      coefficient = 3
    } else if (playId === '68'
            || playId === '29'
            || playId === '35'
            || playId === '41') {
      coefficient = 3
      sort = true
    } else if (playId === '43'
            || playId === '49'
            || playId === '62') {
      coefficient = 2
    } else if (playId === '47'
            || playId === '53') {
      coefficient = 2
      sort = true
    } else if (playId === '91') {
      coefficient = 2
      min = 1
      max = 6
      sort = true
    } else if (playId === '94') {
      coefficient = 3
      sort = true
      min = 1
      max = 6
      data = data.filter(d => {
        let arr = Array.from(d)
        if (arr.length !== 3) {
          return false
        } else if (arr[0] === arr[1] && arr[1] === arr[2]) {
          return false
        } else if (arr[0] === arr[1] || arr[1] === arr[2] || arr[0] === arr[2]) {
          return true
        }
        return false
      })
    } else if (playId === '97') {
      coefficient = 3
      min = 1
      max = 6
      data = data.filter(d => {
        let arr = Array.from(d)
        if (arr.length !== 3) {
          return false
        }
        if (arr[0] !== arr[1] && arr[1] !== arr[2] && arr[0] !== arr[2]) {
          return true
        }
        if (arr[0] === arr[1] || arr[1] === arr[2] || arr[0] === arr[2]) {
          return false
        }
        return false
      })
    } else if (playId === '103') {
      coefficient = 3
    } else if (playId === '131') {
      coefficient = 3
    } else if (playId === '135') {
      coefficient = 3
      sort = true
    } else if (playId === '137'
            || playId === '142') {
      coefficient = 2
    } else if (playId === '140'
            || playId === '145') {
      coefficient = 2
      sort = true
    }

    let regex = new RegExp(`^[${min}-${max}]{${coefficient}}$`)
    data = unique(data, sort)
    data = data.filter( d => regex.test(d))
  }
  return {
    input: data,
    betNum: data.length ? data.length : 0,
  }
}

export const calSpecialInputBetNum = (playId, data) => {
  let coefficient = 3
  let digit = 9
  let sort = false
  let max = 11
  if (data) {
    if (playId === '103') {
      coefficient = 3
    } else if (playId === '105') {
      coefficient = 3
    } else if (playId === '122') {
      coefficient = 1
      sort = true
    } else if (playId === '123') {
      coefficient = 2
      sort = true
    } else if (playId === '124') {
      coefficient = 3
      sort = true
    } else if (playId === '125') {
      coefficient = 4
      sort = true
    } else if (playId === '126') {
      coefficient = 5
      sort = true
    } else if (playId === '127') {
      coefficient = 6
      sort = true
    } else if (playId === '128') {
      coefficient = 7
      sort = true
    } else if (playId === '129') {
      coefficient = 8
      sort = true
    } else if (playId === '150') {
      coefficient = 2
      max = 10
    } else if (playId === '152') {
      coefficient = 3
      max = 10
    } else if (playId === '107') {
      coefficient = 2
    } else if (playId === '109') {
      coefficient = 2
    }
    data = deduplication(data, sort)
    let regex = new RegExp('^[0-'+ digit + ']{' + (coefficient * 2) + '}$')
    data = data.filter(d => {
      let arr = d.split(" ")
      if (arr.length !== coefficient) {
        return false
      }
      if (!regex.test(arr.join('').trim())) {
        return false
      }
      for (let cell of arr) {
        if (Number(cell) > max) {
          return false
        }
      }
      return true
    })
  }
  return {
    input: data,
    betNum: data.length ? data.length : 0,
  }
}

export const calSelectBetNum = (playId, data) => {
  if (!data || Object.keys(data).length <= 0) {
    return 0
  }
  let betNum = 0

  if (['1', '10', '17', '24', '30', '36', '42', '48', '102', '106', '130', '136', '141'].includes(playId)) {
    betNum = 1
    for (let key of Object.keys(data)) {
      betNum *= data[key].length
    }
  } else if (['3', '12', '19'].includes(playId)) {
    betNum = Object.keys(data).length
    for (let key of Object.keys(data)) {
      betNum *= data[key].length
    }
  } else if (playId === '4') {
    let arrLength = data[Object.keys(data)[0]].length
    if (arrLength >= 5) {
      betNum = calCombination(arrLength, 5)
    }
  } else if (playId === '5') {
    let keys = Object.keys(data)
    if (data[keys[0]].length >= 1 && data[keys[1]].length >= 3) {
      for (let mark of data[keys[0]]) {
        let arrLength = data[keys[1]].length
        if (data[keys[1]].includes(mark)) {
          arrLength = arrLength - 1
          if (arrLength < 3) {
            continue
          }
        }
        betNum += calCombination(arrLength, 3)
      }
    }
  } else if (playId === '6') {
    let keys = Object.keys(data)
    if (data[keys[0]].length >= 2 && data[keys[1]].length >= 1) {
      for (let mark of data[keys[1]]) {
        let arrLength = data[keys[0]].length
        if (data[keys[0]].includes(mark)) {
          arrLength = arrLength - 1
          if (arrLength < 2) {
            continue
          }
        }
        betNum += calCombination(arrLength, 2)
      }
    }
  } else if (playId === '7'
              || playId === '14'
              || playId === '21') {
    let keys = Object.keys(data)
    if (data[keys[0]].length >= 1 && data[keys[1]].length >= 2) {
      for (let mark of data[keys[0]]) {
        let arrLength = data[keys[1]].length
        if (data[keys[1]].includes(mark)) {
          arrLength = arrLength - 1
          if (arrLength < 2) {
            continue
          }
        }
        betNum += calCombination(arrLength, 2)
      }
    }
  } else if (playId === '8'
          || playId === '9') {
    let keys = Object.keys(data)
    if (data[keys[0]].length >= 1 && data[keys[1]].length >= 1) {
      for (let mark of data[keys[0]]) {
        let arrLength = data[keys[1]].length
        if (data[keys[1]].includes(mark)) {
          arrLength = arrLength - 1
          if (arrLength < 1) {
            continue
          }
        }
        betNum += calCombination(arrLength, 1)
      }
    }
  } else if (playId === '13'
          || playId === '20'
          || playId === '2033') {
    let arrLength = data[Object.keys(data)[0]].length
    if (arrLength >= 4) {
      betNum = calCombination(arrLength, 4)
    }
  } else if (playId === '15' || playId === '22') {
    let arrLength = data[Object.keys(data)[0]].length
    if (arrLength >= 2) {
      betNum = calCombination(arrLength, 2)
    }
  } else if (playId === '16' || playId === '23') {
    let keys = Object.keys(data)
    if (data[keys[0]].length >= 1 && data[keys[1]].length >= 1) {
      for (let mark of data[keys[0]]) {
        let arrLength = data[keys[1]].length
        if (data[keys[1]].includes(mark)) {
          arrLength = arrLength - 1
          if (arrLength < 1) {
            continue
          }
        }
        betNum += calCombination(arrLength, 1)
      }
    }
  } else if (playId === '26'
          || playId === '32'
          || playId === '38') {
    const com = {
      0: 1, 1: 3, 2: 6, 3: 10, 4: 15, 5: 21, 6: 28, 7: 36, 8: 45,
      9: 55, 10: 63, 11: 69, 12: 73, 13: 75, 14: 75, 15: 73, 16: 69,
      17: 63, 18: 55, 19: 45, 20: 36, 21: 28, 22: 21, 23: 15, 24: 10,
      25: 6, 26: 3, 27: 1,
    }
    for (let he of data[Object.keys(data)[0]]) {
      betNum +=  com[he]
    }
  } else if (playId === '27'
          || playId === '33'
          || playId === '39') {
    let arrLength = data[Object.keys(data)[0]].length
    betNum = arrLength * (arrLength - 1)
  } else if (playId === '28'
          || playId === '2028'
          || playId === '2029'
          || playId === '2032') {
    let arrLength = data[Object.keys(data)[0]].length
    if (arrLength >= 3) {
      betNum = calCombination(arrLength, 3)
    }
  } else if (playId === '34'
          || playId === '40') {
    let arrLength = data[Object.keys(data)[0]].length
    betNum = arrLength * (arrLength - 1) * (arrLength - 2) / 6
  } else if (playId === '44'
          || playId === '50') {
    const com = {
      0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 9,
      11: 8, 12: 7, 13: 6, 14: 5, 15: 4, 16: 3, 17: 2, 18: 1,
    }
    for (let he of data[Object.keys(data)[0]]) {
      betNum +=  com[he]
    }
  } else if(playId === '45'
         || playId === '51') {
    betNum = 1
    for (let key of Object.keys(data)) {
      betNum *= data[key].length
    }
  } else if (playId === '46'
          || playId === '52'
          || playId === '58'
          || playId === '59'
          || playId === '60'
          || playId === '2026'
          || playId === '2027'
          || playId === '2031') {
    let arrLength = data[Object.keys(data)[0]].length
    betNum = arrLength * (arrLength - 1) / 2
  } else if (playId === '54'
          || playId === '111'
          || playId === '146'
          || playId === '55'
          || playId === '56'
          || playId === '57'
          || playId === '76'
          || playId === '77'
          || playId === '78'
          || playId === '79'
          || playId === '80'
          || playId === '81'
          || playId === '82'
          || playId === '83'
          || playId === '84'
          || playId === '85'
          || playId === '86'
          || playId === '87'
          || playId === '88'
          || playId === '89'
          || playId === '2006'
          || playId === '2007'
          || playId === '2008'
          || playId === '2009'
          || playId === '2010'
          || playId === '2011'
          || playId === '2012'
          || playId === '2013'
          || playId === '2014'
          || playId === '2015'
          || playId === '2016'
          || playId === '2017'
          || playId === '2018'
          || playId === '2019'
          || playId === '2021'
          || playId === '2022'
          || playId === '2023'
          || playId === '2024'
          || playId === '2025'
          || playId === '2030'
          || playId === '2034'
          || playId === '2035'
          || playId === '2036'
          || playId === '2037'
          || playId === '2038'
          || playId === '2039') {
    for (let key of Object.keys(data)) {
      betNum += data[key].length
    }
  } else if (playId === '2020') {
    betNum = 0
    for (let key of Object.keys(data)) {
      if (data[key].length > 0) {
        betNum = betNum === 0 ? 1 : betNum
        betNum *= data[key].length
      }
    }
  } else if (playId === '2040' || playId === '2041') {
    betNum = 9
  } else if (playId === '2042'
          || playId === '2043'
          || playId === '2044') {
    betNum = 54
  } else if (playId === '71'
          || playId === '72'
          || playId === '73') {
    const com = {0: 10, 1: 54, 2: 96, 3: 126, 4: 144, 5: 150, 6: 144, 7: 126, 8: 96, 9: 54}
    for (let he of data[Object.keys(data)[0]]) {
      betNum += com[he]
    }
  } else if (playId === '74'
          || playId === '75') {
    const com = {0: 10, 1: 18, 2: 16, 3: 14, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2}
    for (let he of data[Object.keys(data)[0]]) {
      betNum += com[he]
    }
  } else if (playId === '61'
          || playId === '64'
          || playId === '69') {
    let coefficient = 2
    if (playId === '61') {
      coefficient = 2
    } else if (playId === '64') {
      coefficient = 3
    }else if (playId === '69') {
      coefficient = 4
    }
    let keys = Object.keys(data)
    let newArr = []
    for (let key of keys) {
      if (data[key].length !== 0) {
        newArr.push(data[key])
      }
    }
    if (newArr.length >= coefficient) {
      let com = calCombination(newArr.length, coefficient)
      for (let i = 0; i < com; i++) {
        let tmp_nums = 1
        let tmp = ComVal(newArr, coefficient, i)
        for (let j = 0; j < tmp.length; j++) {
          tmp_nums *= tmp[j].length
        }
        betNum += tmp_nums
      }
    }
  } else if (playId === '63') {
    let arrLength = data[Object.keys(data)[0]].length
    if (arrLength >= 2) {
      betNum = calCombination(arrLength, 2)
    }
  } else if (playId === '66') {
    let arrLength = data[Object.keys(data)[0]].length
    if (arrLength >= 2) {
      betNum = calCombination(arrLength, 2) * 2
    }
  } else if (playId === '67') {
    let arrLength = data[Object.keys(data)[0]].length
    if (arrLength >= 3) {
      betNum = calCombination(arrLength, 3)
    }
  } else if (playId === '90') {
    let arrLength = data[Object.keys(data)[0]].length
    if (arrLength >= 2) {
      betNum = calCombination(arrLength, 2)
    }
  } else if (playId === '92'
          || playId === '93') {
    let arrLength = data[Object.keys(data)[0]].length
    if (arrLength >= 1) {
      betNum = data[Object.keys(data)[1]].length
    }
  } else if (playId === '95') {
    betNum = data[Object.keys(data)[0]].length
  } else if (playId === '96') {
    let arrLength = data[Object.keys(data)[0]].length
    if (arrLength >= 3) {
      betNum = calCombination(arrLength, 3)
    }
  } else if (playId === '98') {
     betNum = data[Object.keys(data)[0]].length
  } else if (playId === '99'
        || playId === '100') {
    if (data[Object.keys(data)[0]].length > 0) {
     betNum = 1
    }
  } else if (playId === '101') {
    betNum = data[Object.keys(data)[0]].length
  } else if (playId === '104') {
    let arrLength = data[Object.keys(data)[0]].length
    if (arrLength >= 3) {
      betNum = calCombination(arrLength, 3)
    }
  } else if (playId === '108') {
    let arrLength = data[Object.keys(data)[0]].length
    if (arrLength >= 2) {
      betNum = calCombination(arrLength, 2)
    }
  } else if (playId === '110'
          || playId === '112'
          || playId === '113') {
    betNum = data[Object.keys(data)[0]].length
  } else if (playId === '146') {
    let keys = Object.keys(data)
    for (let key of keys) {
      betNum += data[key].length
    }
  } else if (playId === '114') {
    let arrLength = data[Object.keys(data)[0]].length
    if (arrLength >= 1) {
      betNum = calCombination(arrLength, 1)
    }
  } else if (playId === '115') {
    let arrLength = data[Object.keys(data)[0]].length
    if (arrLength >= 2) {
      betNum = calCombination(arrLength, 2)
    }
  } else if (playId === '116') {
    let arrLength = data[Object.keys(data)[0]].length
    if (arrLength >= 3) {
      betNum = calCombination(arrLength, 3)
    }
  } else if (playId === '117') {
    let arrLength = data[Object.keys(data)[0]].length
    if (arrLength >= 4) {
      betNum = calCombination(arrLength, 4)
    }
  } else if (playId === '118') {
    let arrLength = data[Object.keys(data)[0]].length
    if (arrLength >= 5) {
      betNum = calCombination(arrLength, 5)
    }
  } else if (playId === '119') {
    let arrLength = data[Object.keys(data)[0]].length
    if (arrLength >= 6) {
      betNum = calCombination(arrLength, 6)
    }
  } else if (playId === '120') {
    let arrLength = data[Object.keys(data)[0]].length
    if (arrLength >= 7) {
      betNum = calCombination(arrLength, 7)
    }
  } else if (playId === '121') {
    let arrLength = data[Object.keys(data)[0]].length
    if (arrLength >= 8) {
      betNum = calCombination(arrLength, 8)
    }
  } else if (playId === '132') {
    let arr = data[Object.keys(data)[0]]
    if (arr.length > 0) {
      let tmp = {
          0: 1, 1: 3, 2: 6, 3: 10, 4: 15, 5: 21, 6: 28, 7: 36, 8: 45, 9: 55,
          10: 63, 11: 69, 12: 73, 13: 75, 14: 75, 15: 73, 16: 69, 17: 63,
          18: 55, 19: 45, 20: 36, 21: 28, 22: 21, 23: 15, 24: 10, 25: 6, 26: 3, 27: 1,
      }
      for (let item of arr) {
        betNum += tmp[item]
      }
    }
  } else if (playId === '133') {
    let arrLength = data[Object.keys(data)[0]].length
    if (arrLength >= 2) {
      betNum = calCombination(arrLength, 2)
    }
    betNum = betNum * 2
  } else if (playId === '139' || playId === '144') {
    let arrLength = data[Object.keys(data)[0]].length
    if (arrLength >= 2) {
      betNum = calCombination(arrLength, 2) / 2
    }
    betNum = betNum * 2
  } else if (playId === '134') {
    let arrLength = data[Object.keys(data)[0]].length
    if (arrLength >= 3) {
      betNum = calCombination(arrLength, 3)
    }
  } else if (playId === '138'
          || playId === '143') {
    let arr = data[Object.keys(data)[0]]
    if (arr.length > 0) {
      let tmp = {
          0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10,
          10: 9, 11: 8, 12: 7, 13: 6, 14: 5, 15: 4, 16: 3, 17: 2, 18: 1,
      }
      for (let item of arr) {
        betNum += tmp[item]
      }
    }
  } else if (playId === '146') {
    for (let key of Object.keys(data)) {
      betNum += data[key].length
    }
  } else if (playId === '147') {
    betNum = data[Object.keys(data)[0]].length
  } else if (playId === '148') {
    betNum = data[Object.keys(data)[0]].length
  } else if (playId === '149') {
    let keys = Object.keys(data)
    if (data[keys[0]].length > 0 && data[keys[1]].length > 0) {
      for (let i = 0; i < data[keys[0]].length; i++) {
        for (let j = 0; j < data[keys[1]].length; j++) {
          if (data[keys[0]][i] !== data[keys[1]][j]) {
            betNum ++
          }
        }
      }
    }
  } else if (playId === '151') {
    let keys = Object.keys(data)
    if (data[keys[0]].length > 0 && data[keys[1]].length > 0 && data[keys[2]].length > 0) {
      for (let i = 0; i < data[keys[0]].length; i++) {
        for (let j = 0; j < data[keys[1]].length; j++) {
          for (let m = 0; m < data[keys[2]].length; m++) {
            if (data[keys[0]][i] !== data[keys[1]][j]
              && data[keys[0]][i] !== data[keys[2]][m]
              && data[keys[1]][j] !== data[keys[2]][m]) {
              betNum ++
            }
          }
        }
      }
    }
  } else if (playId === '153'
          || playId === '154') {
    for (let key of Object.keys(data)) {
      betNum += data[key].length
    }
  } else if (playId === '155'
          || playId === '156'
          || playId === '157'
          || playId === '158'
          || playId === '159'
          || playId === '160') {
    betNum = data[Object.keys(data)[0]].length
  }


  //直选 单式号码不能重复的情况
  if (playId === '102') {
    let keys = Object.keys(data)
    if (data[keys[0]].length > 0 && data[keys[1]].length > 0 && data[keys[2]].length > 0) {
      for (let i = 0; i < data[keys[0]].length; i++) {
        for (let j = 0; j < data[keys[1]].length; j++) {
          for (let m = 0; m < data[keys[2]].length; m++) {
            if (data[keys[0]][i] === data[keys[1]][j]
              || data[keys[0]][i] === data[keys[2]][m]
              || data[keys[1]][j] === data[keys[2]][m]) {
              betNum --
            }
          }
        }
      }
    }
  } else if (playId === '106') {
    let keys = Object.keys(data)
    if (data[keys[0]].length > 0 && data[keys[1]].length > 0) {
      for (let i = 0; i < data[keys[0]].length; i++) {
        for (let j = 0; j < data[keys[1]].length; j++) {
          if (data[keys[0]][i] === data[keys[1]][j]) {
            betNum --
          }
        }
      }
    }
  } else if (playId === '204' || playId === '205') {
    betNum = data[Object.keys(data)[0]].length
  }

  return betNum
}

const calCombination = (n, m) => {
  m = parseInt(m)
  n = parseInt(n)
  if (m < 0 || n <= 0) {
    return 0
  }
  if (m > n) {
    return 0
  }
  if (m > n / 2.0) {
    m = n - m
  }
  let result = 0.0
  for (let i = n; i >= (n - m + 1); i--) {
    result += Math.log(i)
  }
  for (let i = m; i >= 1; i--) {
    result -= Math.log(i)
  }
  result = Math.exp(result)
  return Math.round(result)
}

const ComVal = (source, m, x) => {
  let n = source.length
  let list = []
  let start = 0
  while (m > 0) {
    if (m === 1) {
      list.push(source[start + x])
      break
    }
    for (let i = 0; i <= n - m; i++) {
      let cnm = calCombination(n - 1 - i, m - 1)
      if (x <= cnm - 1) {
        list.push(source[start + i])
        start = start + (i + 1)
        n = n - (i + 1)
        m--
        break
      } else {
        x = x - cnm
      }
    }
  }
  return list
}

const unique = (data, sort) => {
  let newData = []
  let tmpData = []
  for (let d of data) {
    if (d.trim() !== "") {
      tmpData.push(d.trim())
    }
  }
  data = tmpData
  if (sort) {
    for (let d of data) {
      let isSame = false
      let tmpArr = Array.from(d.trim())
      for (let i = 1; i < tmpArr.length; i++) {
        tmpArr[0] === tmpArr[i] ? isSame = true : isSame = false
        if (!isSame) {
          break
        }
      }
      if (isSame) {
        continue
      }
      newData.push(tmpArr.sort().toString().replace(/,/g, ''))
    }
  } else {
    newData = data
  }
  newData.sort()
  let uniqueData = []
  for (let d of newData) {
    if (!uniqueData.includes(d)) {
      uniqueData.push(d)
    }
  }
  return uniqueData
}

const deduplication = (data, sort) => {
  let newData = []
  for (let d of data) {
    d = d.trim()
    if (d !== "") {
      let temp = d.split(" ")
      temp = temp.filter( f => {
        if (temp.indexOf(f) !== temp.lastIndexOf(f)) {
          return false
        }
        f = f.trim()
        return f !== "" && f !== '00'
      })
      if (sort) {
        temp.sort()
      }
      newData.push(temp.join(" "))
    }
  }
  newData.sort()
  let uniqueData = []
  for (let d of newData) {
    if (!uniqueData.includes(d)) {
      uniqueData.push(d)
    }
  }
  return uniqueData
}

export const randomOrder = (currentSubPlay) => {
  let betNum = 1, select = {}, checkbox = [], input = []
  try {
    const playId = currentSubPlay.play_id
    if (currentSubPlay.select && currentSubPlay.select.length > 0) {
      const zhixuanFushuList = ['1', '3', '10', '12', '17', '19', '24', '30', '36', '42', '48', '130', '136', '141', '147']
      let selectArr = currentSubPlay.select
      if (zhixuanFushuList.includes(playId)) {
        select = randomSelectionCaseOne(selectArr, 0, 9)
        if (playId === '3') betNum = 5
        else if (playId === '12' || playId === '19') betNum = 4
      } else if (playId === '4') {
        select = randomSingleSelection(selectArr, 5, 0, 9)
      } else if (playId === '5') {
        select[selectArr[0].label] = []
        select[selectArr[1].label] = []
        select[selectArr[0].label].push(Math.round(Math.random() * 9))
        let i = 0
        while (i < 3) {
          let num = Math.round(Math.random() * 9)
          if (!select[selectArr[0].label].includes(num) && !select[selectArr[1].label].includes(num)) {
            select[selectArr[1].label].push(num)
            i ++
          }
        }
      } else if (playId === '6') {
        select[selectArr[0].label] = []
        select[selectArr[1].label] = []
        select[selectArr[1].label].push(Math.round(Math.random() * 9))
        let i = 0
        while (i < 2) {
          let num = Math.round(Math.random() * 9)
          if (!select[selectArr[0].label].includes(num) && !select[selectArr[1].label].includes(num)) {
            select[selectArr[0].label].push(num)
            i ++
          }
        }
      } else if (playId === '7') {
        select[selectArr[0].label] = []
        select[selectArr[1].label] = []
        select[selectArr[0].label].push(Math.round(Math.random() * 9))
        let i = 0
        while (i < 2) {
          let num = Math.round(Math.random() * 9)
          if (!select[selectArr[0].label].includes(num) && !select[selectArr[1].label].includes(num)) {
            select[selectArr[1].label].push(num)
            i ++
          }
        }
      } else if (playId === '8' || playId === '9') {
        select[selectArr[0].label] = []
        select[selectArr[1].label] = []
        select[selectArr[0].label].push(Math.round(Math.random() * 9))
        let i = 0
        while (i < 1) {
          let num = Math.round(Math.random() * 9)
          if (!select[selectArr[0].label].includes(num) && !select[selectArr[1].label].includes(num)) {
            select[selectArr[1].label].push(num)
            i ++
          }
        }
      }else if (['13', '20', '2033'].includes(playId)) {
        select = randomSingleSelection(selectArr, 4, 0, 9)
      } else if (playId === '14' || playId === '21') {
        select[selectArr[0].label] = []
        select[selectArr[1].label] = []
        select[selectArr[0].label].push(Math.round(Math.random() * 9))
        let i = 0
        while (i < 2) {
          let num = Math.round(Math.random() * 9)
          if (!select[selectArr[0].label].includes(num) && !select[selectArr[1].label].includes(num)) {
            select[selectArr[1].label].push(num)
            i ++
          }
        }
      } else if (playId === '15' || playId === '22'
              || playId === '46' || playId === '52' || playId === '58'
              || playId === '59' || playId === '60' || playId === '63' || playId === '66') {
        select = randomSingleSelection(selectArr, 2, 0, 9)
      } else if (playId === '27' || playId === '33' || playId === '39' ) {
        select = randomSingleSelection(selectArr, 2, 0, 9)
        betNum = 2
      } else if (playId === '16' || playId === '23') { //数组1 2内容无法重复
        select[selectArr[0].label] = []
        select[selectArr[1].label] = []
        select[selectArr[0].label].push(Math.round(Math.random() * 9))
        let i = 0
        while (i < 1) {
          let num = Math.round(Math.random() * 9)
          if (!select[selectArr[0].label].includes(num) && !select[selectArr[1].label].includes(num)) {
            select[selectArr[1].label].push(num)
            i ++
          }
        }
      } else if (playId === '26' || playId === '32' || playId === '38') {
        select[selectArr[0].label] = []
        let num = Math.round(Math.random() * 27)
        select[selectArr[0].label].push(num)
        const com = {
          0: 1, 1: 3, 2: 6, 3: 10, 4: 15, 5: 21, 6: 28, 7: 36, 8: 45,
          9: 55, 10: 63, 11: 69, 12: 73, 13: 75, 14: 75, 15: 73, 16: 69,
          17: 63, 18: 55, 19: 45, 20: 36, 21: 28, 22: 21, 23: 15, 24: 10,
          25: 6, 26: 3, 27: 1,
        }
        betNum = com[num]
      } else if (playId === '28' || playId === '34' || playId === '40' || playId === '67') {
        select = randomSingleSelection(selectArr, 3, 0, 9)
      } else if (playId === '44' || playId === '50') {
        select[selectArr[0].label] = []
        let num = Math.round(Math.random() * 18)
        select[selectArr[0].label].push(num)
        const com = {
          0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 9,
          11: 8, 12: 7, 13: 6, 14: 5, 15: 4, 16: 3, 17: 2, 18: 1,
        }
        betNum = com[num]
      } else if (playId === '45' || playId === '51') {
        select[selectArr[0].label] = []
        select[selectArr[1].label] = []
        let shi = Math.round(Math.random() * 3)
        let ge = Math.round(Math.random() * 3)
        const tmp = {
          0: '大',
          1: '小',
          2: '单',
          3: '双',
        }
        select[selectArr[0].label].push(tmp[shi])
        select[selectArr[1].label].push(tmp[ge])
      } else if (playId === '54') {
        select = randomSelectionCaseThree(selectArr, 0, 9)
      } else if (['55', '56', '57', '76', '77', '78', '79', '2035', '2036', '2037',
                  '2038', '2039', '2024', '2025', '2030'].includes(playId)) {
        select = randomSingleSelection(selectArr, 1, 0, 9)
      } else if (['2040', '2041', '2042', '2043', '2044'].includes(playId)) {
        select = randomSingleSelection(selectArr, 1, 0, 9)
        betNum = 54
      } else if (['2014', '2015', '2016', '2017', '2018', '2019'].includes(playId)) {
        select[selectArr[0].label] = []
        const temp = ['大', '小', '单', '双']
        let index = Math.round(Math.random() * 3)
        select[selectArr[0].label].push(temp[index])
      } else if (playId === '2020') {
        select[selectArr[0].label] = []
        select[selectArr[1].label] = []
        select[selectArr[2].label] = []
        select[selectArr[3].label] = []
        select[selectArr[4].label] = []
        let unitIndex = Math.round(Math.random() * 4)
        select[selectArr[unitIndex].label] = []
        const temp = ['大', '小', '单', '双']
        let index = Math.round(Math.random() * 3)
        select[selectArr[unitIndex].label].push(temp[index])
      } else if (['2021', '2022', '2023'].includes(playId)) {
        select[selectArr[0].label] = []
        const temp = ['豹子', '顺子', '对子', '半顺', '杂六']
        let index = Math.round(Math.random() * 4)
        select[selectArr[0].label].push(temp[index])
      } else if (playId === '2034') {
        select[selectArr[0].label] = []
        const temp = ['牛牛', '牛九', '牛八', '牛七', '牛六', '牛五', '牛四', '牛三', '牛二', '牛一', '无牛']
        let index = Math.round(Math.random() * 10)
        select[selectArr[0].label].push(temp[index])
      } else if (['2006', '2007', '2008', '2009', '2010'].includes(playId)) {
        select[selectArr[0].label] = []
        const temp = ['龙', '虎']
        let index = Math.round(Math.random() * 1)
        select[selectArr[0].label].push(temp[index])
      } else if (['2011', '2012', '2013'].includes(playId)) {
        select[selectArr[0].label] = []
        const temp = ['金', '木', '水', '火', '土']
        let index = Math.round(Math.random() * 4)
        select[selectArr[0].label].push(temp[index])
      } else if (playId === '61') {
        select =  randomRenxuanFushi(selectArr, 2)
      } else if (playId === '64') {
        select = randomRenxuanFushi(selectArr, 3)
      } else if (playId === '69') {
        select = randomRenxuanFushi(selectArr, 4)
      } else if (['71', '72', '73'].includes(playId)) {
        select[selectArr[0].label] = []
        let num = Math.round(Math.random() * 9)
        select[selectArr[0].label].push(num)
        const com = {0: 10, 1: 54, 2: 96, 3: 126, 4: 144, 5: 150, 6: 144, 7: 126, 8: 96, 9: 54}
        betNum = com[num]
      } else if (playId === '74' || playId === '75') {
        select[selectArr[0].label] = []
        let num = Math.round(Math.random() * 9)
        select[selectArr[0].label].push(num)
        const com = {0: 10, 1: 18, 2: 16, 3: 14, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2}
        betNum = com[num]
      } else if (playId === '80' || playId === '81' || playId === '82' || playId === '83'
              || playId === '84' || playId === '85' || playId === '86' || playId === '87'
              || playId === '88' || playId === '89') {
        select[selectArr[0].label] = []
        const longhu = ['龙', '虎', '和']
        let index = Math.round(Math.random() * 2)
        select[selectArr[0].label].push(longhu[index])
      } else if (playId === '90') {
        select = randomSingleSelection(selectArr, 2, 1, 6)
      } else if (playId === '92' || playId === '93') { //胆拖类型 数组1 2内容无法重复
        select[selectArr[0].label] = []
        select[selectArr[1].label] = []
        select[selectArr[0].label].push(Math.round(Math.random() * 5 + 1))
        let i = 0
        while (i < 1) {
          let num = Math.round(Math.random() * 5 + 1)
          if (!select[selectArr[0].label].includes(num) && !select[selectArr[1].label].includes(num)) {
            select[selectArr[1].label].push(num)
            i ++
          }
        }
      } else if (playId === '95' || playId === '98') {
        select = randomSingleSelection(selectArr, 1, 1, 6)
      } else if (playId === '96') {
        select = randomSingleSelection(selectArr, 3, 1, 6)
      } else if (playId === '99' ) {
        select = {'胆码': ['111', '222', '333', '444', '555', '666']}
      } else if (playId === '100' ) {
        select = {'号码': ['123', '234', '345', '456']}
      } else if (playId === '101') {
        select = randomSingleSelection(selectArr, 1, 3, 18)
      } else if (playId === '102' || playId === '106' || playId === '110') {
        select = randomSelectionCaseTwo(selectArr, 1, 11)
      } else if (playId === '104') {
        select = randomSingleSelection(selectArr, 3, 1, 11, true)
      } else if (playId === '108') {
        select = randomSingleSelection(selectArr, 2, 1, 11, true)
      } else if (playId === '111') {
        select = randomSelectionCaseThree(selectArr, 1, 11, true)
      } else if (playId === '114') {
        select = randomSelectionCaseTwo(selectArr, 1, 11)
      } else if (playId === '115') {
        select = randomSingleSelection(selectArr, 2, 1, 11, true)
      } else if (playId === '116') {
        select = randomSingleSelection(selectArr, 3, 1, 11, true)
      } else if (playId === '117') {
        select = randomSingleSelection(selectArr, 4, 1, 11, true)
      } else if (playId === '118') {
        select = randomSingleSelection(selectArr, 5, 1, 11, true)
      } else if (playId === '119') {
        select = randomSingleSelection(selectArr, 6, 1, 11, true)
      } else if (playId === '120') {
        select = randomSingleSelection(selectArr, 7, 1, 11, true)
      } else if (playId === '121') {
        select = randomSingleSelection(selectArr, 8, 1, 11, true)
      } else if (playId === '132') {
        select[selectArr[0].label] = []
        let num = Math.round(Math.random() * 27)
        select[selectArr[0].label].push(num)
        const com = {
            0: 1, 1: 3, 2: 6, 3: 10, 4: 15, 5: 21, 6: 28, 7: 36, 8: 45, 9: 55,
            10: 63, 11: 69, 12: 73, 13: 75, 14: 75, 15: 73, 16: 69, 17: 63,
            18: 55, 19: 45, 20: 36, 21: 28, 22: 21, 23: 15, 24: 10, 25: 6, 26: 3, 27: 1,
        }
        betNum = com[num]
      } else if (playId === '133') {
        select = randomSingleSelection(selectArr, 2, 0, 9)
        betNum = 2
      } else if (['134', '2028', '2029', '2032'].includes(playId)) {
        select = randomSingleSelection(selectArr, 3, 0, 9)
      } else if (playId === '138' || playId === '143') {
        select[selectArr[0].label] = []
        let num = Math.round(Math.random() * 18)
        select[selectArr[0].label].push(num)
        const com = {
            0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10,
            10: 9, 11: 8, 12: 7, 13: 6, 14: 5, 15: 4, 16: 3, 17: 2, 18: 1,
        }
        betNum = com[num]
      } else if (['139', '144', '2026', '2027', '2031'].includes(playId)) {
        select = randomSingleSelection(selectArr, 2, 0, 9)
      } else if (playId === '146') {
        select = randomSelectionCaseThree(selectArr, 0, 9)
      } else if (playId === '148' || playId === '149' || playId === '151') {
        select = randomSelectionCaseTwo(selectArr, 1, 10)
      } else if (playId === '153' || playId === '154') {
        select = randomSelectionCaseThree(selectArr, 1, 10, true)
      } else if (playId === '155' || playId === '156' || playId === '157') {
        select[selectArr[0].label] = []
        let shi = Math.round(Math.random())
        const tmp = {
          0: '大',
          1: '小',
        }
        select[selectArr[0].label].push(tmp[shi])
      } else if (playId === '158' || playId === '159' || playId === '160') {
        select[selectArr[0].label] = []
        let shi = Math.round(Math.random())
        const tmp = {
          0: '单',
          1: '双',
        }
        select[selectArr[0].label].push(tmp[shi])
      } else if (playId === '204') {
        select[selectArr[0].label] = []
        let shi = Math.round(Math.random() * 3)
        const tmp = {
          0: '大',
          1: '小',
          2: '单',
          3: '双',
        }
        select[selectArr[0].label].push(tmp[shi])
      } else if (playId === '205') {
        select = randomSingleSelection(selectArr, 1, 3, 19)
      }


    //======================== select type end===================

    //======================== input type start===================
    } else if (currentSubPlay.input) {
      let str = ''

      if (playId === '29' || playId === '35' || playId === '41' || playId === '68') {

        str = randomInputCaseOne(0, 9)

      } else if (playId === '47' || playId === '53') {
        let i = 0
        let arr = []
        while (i < 2) {
          let num = Math.round(Math.random() * 9)
          if (i === 1 && num === arr[0]) {
            continue
          }
          arr.push(num)
          i ++
        }
        str = arr.join("")

      } else if (playId === '91') {
        let i = 0
        let arr = []
        while (i < 2) {
          let num = Math.round(Math.random() * 5 + 1)
          if (i === 1 && num === arr[0]) {
            continue
          }
          arr.push(num)
          i ++
        }
        str = arr.join("")

      } else if (playId === '94') {

        str = randomInputCaseFive(1, 6)

      } else if (playId === '97') {

        str = randomInputCaseTwo(3, 1, 6)

      } else if (playId === '103' || playId === '105') {
        str = randomInputCaseThree(3, 1, 11)
      } else if (playId === '107' || playId === '109') {
        str = randomInputCaseThree(2, 1, 11)
      } else if (playId === '122') {
        str = randomInputCaseThree(1, 1, 11)
      } else if (playId === '123') {
        str = randomInputCaseThree(2, 1, 11)
      } else if (playId === '124') {
        str = randomInputCaseThree(3, 1, 11)
      } else if (playId === '125') {
        str = randomInputCaseThree(4, 1, 11)
      } else if (playId === '126') {
        str = randomInputCaseThree(5, 1, 11)
      } else if (playId === '127') {
        str = randomInputCaseThree(6, 1, 11)
      } else if (playId === '128') {
        str = randomInputCaseThree(7, 1, 11)
      } else if (playId === '129') {
        str = randomInputCaseThree(8, 1, 11)
      } else if (playId === '131') {
        str = randomInputCaseFour(3, 0, 9)
      } else if (playId === '135') {
        str = randomInputCaseOne(3, 0 ,9)
      } else if (playId === '137' || playId === '142') {
        str = randomInputCaseFour(2, 0, 9)
      } else if (playId === '140' || playId === '145') {
        str = randomInputCaseTwo(2, 0, 9)
      } else if (playId === '150') {
        str = randomInputCaseThree(2, 1, 10)
      } else if (playId === '152') {
        str = randomInputCaseThree(3, 1, 10)
      } else {
        let digit = 0
        if (playId === '2') {
          digit = 5
        } else if (playId === '11' || playId === '18' || playId === '70') {
          digit = 4
        } else if (playId === '25' || playId === '31' || playId === '37' || playId === '65') {
          digit = 3
        } else if (playId === '43' || playId === '49' || playId === '62') {
          digit = 2
        }

        for (let i = 0; i < digit; i++) {
          str += Math.round(Math.random() * 9).toString()
        }
      }

      input.push(str)
    }
    //======================== input type end===================

    //======================== checkbox type start===================
    if (currentSubPlay.checkbox) {
      if (playId === '62' || playId === '63') {
        checkbox = randomUnit(2)
      } else if (playId === '65' || playId === '67' || playId === '68') {
        checkbox = randomUnit(3)
      } else if (playId === '66') {
        checkbox = randomUnit(3)
        betNum = 2
      } else if (playId === '70') {
        checkbox = randomUnit(4)
      }
    }
    //======================== checkbox type end===================

  } catch (e) {
    betNum = 0
    console.warn(e)
  }

  return { select, checkbox, input, betNum }
}

export const randomOrderNew = (currentPlay, currentSubPlay, max) => {
  let betNum = 1, categoryIndices = [], indices = [], names = [], ids = []

  if (['连码', '自选不中', '中一', '连肖连尾', '合肖', '特码包三'].includes(currentPlay.name)) {
    const tabName = currentSubPlay.groupName.slice(0, 2)
    indices = randomSingleSelection(null, digits[tabName], 0, max)
  } else if(currentPlay.name === '正码过关') {
    categoryIndices = randomSingleSelection(null, 2, 0, 6-1)
    indices = randomSingleSelection(null, 2, 0, max)
  } else {
    indices = randomSingleSelection(null, 1, 0, max)
  }

  if (currentPlay.name === '正码过关') {
    for (let i = 0; i < categoryIndices.length; i++) {
      const item = currentPlay.play[categoryIndices[i]].detail[indices[i]]
      names.push(item.id)
      ids.push(item.id)
    }
  } else {
    for (let index of indices) {
      const item = currentSubPlay.detail[index]
      names.push(item.name)
      ids.push(item.id)
    }
  }

  return {
    betNum,
    names,
    ids,
  }
}

//遍历各个位置， 数字可相同
const randomSelectionCaseOne = (selectArr, min, max) => {
  let tmp = {}
  for (let item of selectArr) {
    tmp[item.label] = []
    let num = Math.round(Math.random() * (max - min) + min)
    tmp[item.label].push(num)
  }

  return tmp
}

//两个数‘01’，并且各不相同
const randomSelectionCaseTwo = (selectArr, min, max) => {
  let tmp = {}
  let mark = []
  let i = 0
  while (i < selectArr.length) {
    tmp[selectArr[i].label] = []
    let num = Math.round(Math.random() * (max - min) + min).toString()
    if (num.toString().length === 1) {
      num = '0' + num
    }
    if (!mark.includes(num)) {
      mark.push(num)
      tmp[selectArr[i].label].push(num)
      i ++
    }
  }

  return tmp
}

//定位胆， 随机一个位置， 随机一个好吗
const randomSelectionCaseThree = (selectArr, min, max, isTwoDigit) => {
  let tmp = {}
  for (let item of selectArr) {
    tmp[item.label] = []
  }
  let index = Math.round(Math.random() * (selectArr.length - 1))
  let num = Math.round(Math.random() * (max - min) + min)
  if (isTwoDigit) {
    num = num.toString()
    if (num.length === 1) {
      num = '0' + num
    }
  }
  tmp[selectArr[index].label].push(num)
  return tmp
}

//三位数，三个不能相同， 2个可以相同
const randomInputCaseOne = (min, max) => {
  let i = 0
  let arr = []
  while (i < 3) {
    let num = Math.round(Math.random() * (max - min) + min)
    if (i === 2 && num === arr[0] && num === arr[1]) {
      continue
    }
    arr.push(num)
    i ++

  }
  return arr.join("")
}

//各不相同
const randomInputCaseTwo = (digit, min, max) => {
  let i = 0
  let arr = []
  while (i < digit) {
    let num = Math.round(Math.random() * (max - min) + min)
    if (!arr.includes(num)) {
      arr.push(num)
      i ++
    }

  }
  return arr.join("")
}

//两位数‘01 02 03’，各不相同
const randomInputCaseThree = (digit, min, max) => {
  let i = 0
  let arr = []
  while (i < digit) {
    let num = Math.round(Math.random() * (max - min) + min).toString()
    if (num.toString().length === 1) {
      num = '0' + num
    }
    if (!arr.includes(num)) {
      arr.push(num)
      i ++
    }

  }
  return arr.join(" ")
}

//各位置可以相同
const randomInputCaseFour = (digit, min, max) => {
  let i = 0
  let arr = []
  while (i < digit) {
    let num = Math.round(Math.random() * (max - min) + min)
    arr.push(num)
    i ++

  }
  return arr.join("")
}

//三位数，三个不能相同，两个必须相同
const randomInputCaseFive = (min, max) => {
  let i = 0
  let arr = []
  while (i < 2) {
    let num = Math.round(Math.random() * (max - min) + min)
    if (i === 1 && num === arr[0]) {
      continue
    }
    arr.push(num)
    if (i === 0) {
      arr.push(num)
    }
    i ++

  }
  return arr.join("")
}

const randomRenxuanFushi = (selectArr, digit) => {
  let tmp = {}
  for (let item of selectArr) {
    tmp[item.label] = []
  }
  let i = 0
  let indexArr = []
  while (i < digit) {
    let index = Math.round(Math.random() * 4)
    if (!indexArr.includes(index)) {
      indexArr.push(index)
      tmp[selectArr[index].label].push(Math.round(Math.random() * 9))
      i ++
    }
  }
  return tmp
}

const randomUnit = (digit) => {
  const unit = ['万位', '千位', '百位', '十位', '个位']
  let checkbox = []
  let i = 0
  let indexArr = []
  while (i < digit) {
    let index = Math.round(Math.random() * 4)
    if (!indexArr.includes(index)) {
      indexArr.push(index)
      checkbox.push(unit[index])
      i ++
    }
  }
  return checkbox
}

//一个位置多选
const randomSingleSelection = (selectArr, digit, min, max, isTwoDigit) => {
  let tmp
  if (selectArr === null) {
    tmp = []
  } else {
    tmp = {}
    tmp[selectArr[0].label] = []
  }
  let i = 0
  while (i < digit) {
    let num = Math.round(Math.random() * (max - min) + min)
    if (isTwoDigit) {
      num = num.toString()
      if (num.length === 1) {
        num = '0' + num
      }
    }
    if (selectArr === null) {
      if (!tmp.includes(num)) {
        tmp.push(num)
        i ++
      }
    } else {
      if (!tmp[selectArr[0].label].includes(num)) {
        tmp[selectArr[0].label].push(num)
        i ++
      }
    }
  }

  return tmp
}

export const subNumber = (number, length) => {
  let tempNum = 0
  let s1 = number + ''
  let start = s1.indexOf('.')
  if(start !== -1 && s1.substr(start + length + 1, 1) >= 5)
    tempNum = 1
  let temp = Math.pow(10, length)
  let s = Math.floor(number * temp) + tempNum
  return s / temp
}

const MathTemp = (a,b) => {
  let length_a = 0,
    length_b = 0,
    length = 0
  if (a.toString().indexOf("e") >= 0 && a.toString().split("e")[1] !== "") {
    length_a += a.toString().split("e")[1] * (-1)
    a = a.toString().split("e")[0]
  }
  if (a.toString().indexOf(".") >= 0) {
    length_a += a.toString().split(".")[1].length
    a = a.toString().split(".")[0] + "" + a.toString().split(".")[1]
  }
  if (b.toString().indexOf("e") >= 0 && b.toString().split("e")[1] !== "") {
    length_b += b.toString().split("e")[1] * (-1)
    b = b.toString().split("e")[0]
  }
  if (b.toString().indexOf(".") >= 0) {
    length_b += b.toString().split(".")[1].length
    b = b.toString().split(".")[0] + "" + b.toString().split(".")[1]
  }
  if (length_b > length_a) {
    a = parseInt(a) * Math.pow(10, length_b - length_a)
    b = parseInt(b)
    length = length_b
  } else {
    b = parseInt(b) * Math.pow(10, length_a - length_b)
    a = parseInt(a)
    length = length_a
  }
  return {a: a, b: b, length: length}
}

const MathResult = (result) => {
  if (result.toString().indexOf("e") >= 0 && result.toString().split("e")[1] !== "") {
    let length = result.toString().split("e")[1] * (-1)
    result = result.toString().split("e")[0]
    if (result.toString().indexOf(".") >= 0) {
      length += result.toString().split(".")[1].length
      result = result.toString().split(".")[0] + "" + result.toString().split(".")[1]
    }
    if (0 === length) {
      return result
    }
    if (length < 0) {
      length = length * (-1)
      let temp = ""
      while (length > 0) {
        temp += "0"
        length--
      }
      result = result + temp
    } else {
      if (result.length > length) {
        result = result.substr(0, result.length - length) + "." + result.substr(result.length - length, length)
      } else {
        let temp = ""
        while (length > result.length) {
          temp += "0"
          length--
        }
        result = "0." + temp + result
      }
    }
  }
  return result
}

/**
 * 用于计算两个数的加法（包括带小数的浮点）
 */
export const MathAdd = (a, b) => {
  let o = MathTemp(a, b)
  let result = (o.a + o.b) / Math.pow(10, o.length)
  return MathResult(result)
}

/**
 * 用于计算两个数的减法（包括带小数的浮点）
 */
export const MathSub = (a, b) => {
  let o = MathTemp(a, b)
  let result = (o.a - o.b) / Math.pow(10, o.length)
  return MathResult(result)
}

/**
 * 用于计算两个数的乘法（包括带小数的浮点）
 */
 export const MathMul = (a, b) => {
  let o = MathTemp(a, b)
  let result = (o.a * o.b) / Math.pow(10, o.length * 2)
  return MathResult(result)
}

/**
 * 用于计算两个数的除法（包括带小数的浮点）
 */
export const MathDiv = (a, b) => {
  let o = MathTemp(a, b)
  let result = (o.a / o.b)
  return MathResult(result)
}

export const yesterday = () => {
  let yesterday = (new Date()).setDate((new Date()).getDate() - 1)
  return new Date(yesterday).toISOString().slice(0, 10)
}

export const replaceWithDot = (date) => {
  if (date) {
    return date.replace(/-/g, '.')
  }
}
