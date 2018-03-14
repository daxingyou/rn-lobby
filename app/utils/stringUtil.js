
/**
* 是否是空字符串
*/
export const isEmptyStr = (str) => {
  if (!str) {
    return true
  }
  return str.trim() === ''
}

/**
 * 用户名满足长度为6-16之间，只能由字母、数字或者下划线组成!
 */
export const matchUserName = (userName) => {
  if (userName.match(/^[\w]{6,16}$/)) {
    return true
  }
  return false
}

/**
 * 密码长度为6-12个字符之间,至少要有1个字母及数字！
 */
export const matchPassword = (pwd) => {
  if (pwd.match(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/)) {
    return true
  }
  return false
}

/**
* 是否输入正确的金额
*/
export const isMatchInputMoney = (money) => {
  return /^(-)?(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/.test(money)
}

export const matchPhoneNum = (phoneNum) => {
  if (phoneNum.match(/^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/)) {
    return true
  }
  return false
}

export const matchEmail = (email) => {
  if (email.match(/^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/)) {
    return true
  }
  return false
}

export const matchQQ = (qq) => {
  if (qq.match(/^[1-9]\d{4,9}$/)) {
    return true
  }
  return false
}
