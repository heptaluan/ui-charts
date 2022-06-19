import { Injectable } from '@angular/core'

@Injectable()
export class UtilsService {
  isCloseTip: boolean = false

  constructor() {
    let reg = new RegExp('(^| )closeTip=([^;]*)(;|$)')
    if (document.cookie.match(reg) && document.cookie.match(reg)[2]) {
      this.isCloseTip = true
    }
  }

  generate_uuid() {
    const numList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    let part1 = ''
    for (let index = 0; index < 5; index++) {
      part1 += numList[Math.floor(Math.random() * 10)]
    }
    const part2 = Date.now()
    return part2 + part1
  }

  base64toBinary(b64Data, contentType = '') {
    const byteCharacters = atob(b64Data)
    let byteArrays = new ArrayBuffer(byteCharacters.length)
    let ia = new Uint8Array(byteArrays)
    for (let i = 0; i < byteCharacters.length; i++) {
      ia[i] = byteCharacters.charCodeAt(i)
    }
    const blob = new Blob([byteArrays], { type: contentType })
    return blob
  }

  // 判断用户浏览器类型
  getBrowserInfo() {
    let userAgent = navigator.userAgent
    let isOpera = userAgent.indexOf('Opera') > -1
    if (isOpera) {
      return 'Opera'
    }
    if (userAgent.indexOf('Firefox') > -1) {
      return 'FF'
    }
    if (
      userAgent.indexOf('Chrome') > -1 &&
      Number(userAgent.split('Chrome/')[1] && userAgent.split('Chrome/')[1].substring(0, 2)) > 65
    ) {
      return 'Chrome'
    }
    if (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)) {
      return 'Safari'
    }
    if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
      return 'IE'
    }
  }

  closeTip() {
    this.setCookie('closeTip')
    this.isCloseTip = true
    return this.isCloseTip
  }

  setCookie(name) {
    var day1 = new Date()
    day1.setDate(day1.getDate() + 1)
    day1.setHours(0)
    day1.setMinutes(0)
    day1.setSeconds(0)
    day1.setMilliseconds(0)
    document.cookie = name + '=' + 'true' + ';Expires=' + day1.toUTCString()
  }
}
