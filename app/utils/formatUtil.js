
export const formatDateString = (ts) => {
  const date = new Date(parseInt(ts) * 1000)
  const year = date.getFullYear()
  const month = parseInt(date.getMonth()) + 1
  const day = date.getFullDate()
  return `${year}-${month}-${day}`
}

export const formatStringWithHtml = (originString) => {
  const newString = originString.replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
  return newString
}

export const formatCard4Space = (cardNum) => {
  return cardNum.replace(/(\d{4})(?=\d)/g, '$1 ')
}

export const formatClearSpace = (cardNum) => {
  return cardNum.replace(/\s/g, '')
}

export const formatDay = (date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}
export const formatTime = (time) => {
  return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
}

export const getMonthFirstDay = () => {
  const date = new Date()
  return `${date.getFullYear()}-${date.getMonth() + 1}-1`
}

export const formatMoney = (money) => {
  return `${money}`
}

export const clearNoNum = (value) => {
  //清除"数字"和"."以外的字符
  value = value.replace(/[^\d.]/g,"")

  //验证第一个字符是数字而不是
  value = value.replace(/^\./g,"")

  //只保留第一个. 清除多余的
  value = value.replace(/\.{2,}/g,".")
  value = value.replace(".","$#$").replace(/\./g,"").replace("$#$",".")

  //只能输入两个小数
  value = value.replace(/^(-)*(\d+)\.(\d\d).*$/,'$1$2.$3')
  if(value.indexOf(".")< 0 && value !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
   value= Number(value).toString()
  }  
  return value
}

export const formatNumber = (text) => {
  return parseInt(text.replace(/[^\d{1,}|\d{1,}]|^0{1,}\d{1,}|[,,.]{1,}/g,'') || 0)
}
