export const getAge = (strBirthday) => {
  let returnAge
  let strBirthdayArr = strBirthday.split('-')
  let birthYear = parseInt(strBirthdayArr[0])
  let birthMonth = parseInt(strBirthdayArr[1])
  let birthDay = parseInt(strBirthdayArr[2])
  let d = new Date()
  let nowYear = d.getFullYear()
  let nowMonth = d.getMonth() + 1
  let nowDay = d.getDate()
  if (nowYear === birthYear) {
    returnAge = 0 // 同年 则为0岁
  } else {
    let ageDiff = nowYear - birthYear // 年之差
    if (ageDiff > 0) {
      if (nowMonth === birthMonth) {
        let dayDiff = nowDay - birthDay // 日之差
        if (dayDiff < 0) {
          returnAge = ageDiff - 1
        } else {
          returnAge = ageDiff
        }
      } else {
        let monthDiff = nowMonth - birthMonth // 月之差
        if (monthDiff < 0) {
          returnAge = ageDiff - 1
        } else {
          returnAge = ageDiff
        }
      }
    } else {
      returnAge = -1 // 返回-1 表示出生日期输入错误 晚于今天
    }
  }
  return returnAge // 返回周岁年龄
}
