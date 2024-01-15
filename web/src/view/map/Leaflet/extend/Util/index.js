/* eslint-disable indent */
import gcoord from 'gcoord'
export const wgs842gcj = (lng, lat) => gcoord.transform([Number(lng), Number(lat)], gcoord.WGS84, gcoord.GCJ02)
export const gcj2wgs84 = (lng, lat) => gcoord.transform([Number(lng), Number(lat)], gcoord.GCJ02, gcoord.WGS84)

/**
 * 随机生成16进制颜色
 */
export const randomHexColor = function () {
    var hex = Math.floor(Math.random() * 16777216).toString(16) // 生成ffffff以内16进制数
    while (hex.length < 6) { // while循环判断hex位数，少于6位前面加0凑够6位
        hex = '0' + hex
    }
    return '#' + hex // 返回‘#’开头16进制颜色
}
