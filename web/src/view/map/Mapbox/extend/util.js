import SPITE_KEY from '../spirte_key'
export function util_getLocation(center) {

    const json = { 'type': 'FeatureCollection', 'features': [] }
    if (!center) return json
    for (let i = 0; i < 200; i++) {
        json.features.push({
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [center[0] + 0.5 * plusOrMinus() * Math.random(), center[1] + 0.5 * plusOrMinus() * Math.random()]
            },
            "properties": {
                "title": "Test title",
                "marker-symbol": SPITE_KEY[Math.floor(Math.random() * SPITE_KEY.length)]
            }
        })
    }

    return json
}

export function util_plusOrMinus() {
    return Math.round(Math.random()) * 2 - 1
}

/**
 * 地图上的弹窗方法
 */
import { Popup } from 'mapbox-gl'
export function util_popup(map, position, content) {
    map.popup && map.popup.remove()
    map.popup = new Popup().setLngLat(position).addTo(map)
        .setHTML(`<table style="text-align:center;margin-top:10px;" border="1"><tr><th>Key</th><th>Value</th></tr>${content}</table>`)
}

/**
 * 
 * @param {Object} info 
 * @returns 返回表格化info字符串
 * @example
    > util_tableInfo({a:123,cc:'str'})
    < '<tr><td>a</td><td>123</td></tr><tr><td>cc</td><td>str</td></tr>'
    > util_tableInfo(123)
    < ''
 */
export function util_tableInfo(info) {
    if (typeof info !== 'object') return ''
    let content = ''
    for (let i in info) content += `<tr><td>${i}</td><td>${info[i]}</td></tr>`
    return content
}

export function util_dataToJson(data, positionRow) {
    const row = (positionRow || 'lng,lat').split(',')
    const geoJson = { 'type': 'FeatureCollection', 'features': [] }
    data.forEach(i => {
        geoJson.features.push({ 'type': 'Feature', 'geometry': { 'type': 'Point', 'coordinates': [i[row[0]], i[row[1]]] }, 'properties': i })
    })
    return geoJson
}

export function util_time_process(currentTime, startTime, endTime) {
    return (_t(currentTime) - _t(startTime)) / (_t(endTime) - _t(startTime))
    function _t(t) { return new Date(t).getTime() }
}