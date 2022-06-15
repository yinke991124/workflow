import Vue from 'vue'
import _ from 'lodash'
const Utils = {
  // 处理可视化大屏的fontSize
  // 用法1：目前仅用在可视化大屏上，在可视化大屏的主页面的生命周期函数created里面调用此方法，Utils.visualFontSizeAdjust(document, window)，该页面的所有的样式px都用ren代替。1rem = 100px,  10px = 0.1rem
  // 用法2： 目前使用可视化大屏的echart图表，因图标的字体等设置只能识别number类型的，所以无法用rem代替，可通过此函数存储倍率，然后再echart图表里面通过localStorage.setItem('resizeRate')获取倍率，之后每个字体*倍率实现自适应
  visualFontSizeAdjust: function (document, window) {
    // debugger
    let docEI = document.documentElement
    let resizeEvt = 'orientationchange' in window ? 'orientataionchange' : 'resize',
      recalc = function () {
        let clientWidth = docEI.clientWidth;
        if (!clientWidth) return;
        //100是字体大小，1920是开发时浏览器窗口的宽度，等比计算,最小宽度1280
        docEI.style.fontSize = clientWidth / 1920 < 1280 / 1920 ? 100 * (1280 / 1920) + 'px' : 100 * (clientWidth / 1920) + 'px';
        return clientWidth / 1920 < 1280 / 1920 ? 1280 / 1920 : clientWidth / 1920
      }
    if (!document.addEventListener) return;
    window.addEventListener(resizeEvt, recalc, false);
    document.addEventListener('DOMContentLoaded', recalc, false);
    let rate = recalc()
    localStorage.setItem('resizeRate', rate)
  },
}
export default Utils;