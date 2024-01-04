<!-- eslint-disable -->
<template>
  <div class="gva-table-box">
    <div :id="props.id" class="map" />
  </div>
</template>

<script setup>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { onBeforeUnmount, onMounted } from 'vue'
import { MyBtn, Util } from './extend'

import PNG_START from './img/start.png'
import PNG_END from './img/end.png'

const props = defineProps({
  id: { type: String, default: 'map' },
})

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
})

let ins_map = null
const ins_group = {}

onMounted(() => {
  ins_map = L.map(props.id, {
    zoom: 10,
    center: [31.25, 120.6]
  })

  ins_map.addControl(new MyBtn([
    { text: '导航', title: 'btn1', class: 'btn1' },
    { text: 'btn2', title: 'btn2', class: 'btn2' },
    { text: 'btn4', title: 'btn4', class: 'btn4' },
  ]))

  ins_map.on('btnClick', (e) => {
    console.log(e)
    switch (e.title) {
      case 'btn1':
        daohang()
        break
      case 'btn2':
        removeByRef('LAYER_1')
        break
      case 'btn4':
        removeByRef('LAYER_DAOHANG')
        removeByRef('LAYER_DAOHANG_LINE')
        break
      default:
        break
    }
  })

  addTile()
})

onBeforeUnmount(() => {
  ins_map && ins_map.remove()
})

function removeByRef(ref) {
  const group = getGroup(ref)
  group && group.clearLayers()
  return group
}

function getGroup(layerName) {
  !ins_group[layerName] && (ins_group[layerName] = L.layerGroup().addTo(ins_map))
  return ins_group[layerName]
}

function switchTianDiTu(id, KEY_TIANDITU) {
  const arr = [
    { id: 1, name: '天地图', url: [{ url: 'http://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=' + KEY_TIANDITU }, { url: 'http://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=' + KEY_TIANDITU }] },
    { id: 2, name: '天地图影像', url: [{ url: 'http://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=' + KEY_TIANDITU }, { url: 'http://t{s}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=' + KEY_TIANDITU }] },
    { id: 3, name: '天地图地形', url: [{ url: 'http://t{s}.tianditu.gov.cn/ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=' + KEY_TIANDITU }, { url: 'http://t{s}.tianditu.gov.cn/cta_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cta&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=' + KEY_TIANDITU }] },
  ]

  const group = removeByRef('BASE_MAP')
  const to = arr.filter((i) => (i.id === id))[0]
  if (!to) return

  to.url.forEach((i) => group.addLayer(L.tileLayer(i.url, { subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'] })))
}

const addTile = () => {
  const NAME_LAYER = 'chinaosm:osm'

  const layer_default = { layers: NAME_LAYER, format: 'image/png', transparent: true }
  // const layer_blue = Object.assign({ styles: 'blue' }, layer_default)

  const layer1 = L.tileLayer.wms(`/mapServer/geoserver/${NAME_LAYER.split(':').shift()}/wms`, layer_default)
  // const layer2 = L.tileLayer.wms(`/mapServer/geoserver/${NAME_LAYER.split(':').shift()}/wms`, layer_blue)

  ins_map.addLayer(layer1)

  // L.control.layers({ '亮色': layer1, '暗黑': layer2 }, {}, { collapsed: false }).addTo(ins_map)
  // ins_map.on('baselayerchange', e => { ins_map.getContainer().style.backgroundColor = e.name === '暗黑' ? '#4952a0' : '#ffffff' })
  // ins_map.addLayer(layer1)
}

function daohang() {
  removeByRef('LAYER_DAOHANG_LINE')

  const layerName = 'LAYER_DAOHANG'
  const group = removeByRef(layerName)

  const icon_s = L.icon({ iconUrl: PNG_START, iconSize: [40, 40], iconAnchor: [20, 40] })
  const icon_e = L.icon({ iconUrl: PNG_END, iconSize: [40, 40], iconAnchor: [20, 40] })

  const positionStart = ins_map.getCenter()
  const s = ins_map.latLngToContainerPoint(positionStart)
  s.x += 60
  const positionEnd = ins_map.containerPointToLatLng(s)
  const markerStart = L.marker(positionStart, { draggable: true, icon: icon_s })
    .bindTooltip('<div style="text-align: center;">起点<br>drag me</div>', { permanent: true, direction: 'top', offset: [0, -40] })
  const markerEnd = L.marker(positionEnd, { draggable: true, icon: icon_e })
    .bindTooltip('<div style="text-align: center;">终点<br>drag me</div>', { permanent: true, direction: 'top', offset: [0, -40] })

  let flag_s, flag_e

  markerStart.on('dragend', () => {
    markerStart.unbindTooltip()
    flag_s = true
    if (flag_s && flag_e) _api_daohang(markerStart.getLatLng(), markerEnd.getLatLng())
  })
  markerEnd.on('dragend', () => {
    markerEnd.unbindTooltip()
    flag_e = true
    if (flag_s && flag_e) _api_daohang(markerStart.getLatLng(), markerEnd.getLatLng())
  })

  group.addLayer(markerStart)
  group.addLayer(markerEnd)
}

function _api_daohang(startLatLng, endLatLng) {
  const layerName = 'LAYER_DAOHANG_LINE'
  const group = removeByRef(layerName)

  const p_s = Util.wgs842gcj(startLatLng.lng, startLatLng.lat)
  const p_e = Util.wgs842gcj(endLatLng.lng, endLatLng.lat)

  fetch(`https://restapi.amap.com/v3/direction/driving?origin=${p_s}&destination=${p_e}&extensions=all&key=${'c922dabc01b25446e8614a1d9ddafb75'}`)
    .then(r => r.json()).then(r => {
      if (!r.status || r.status !== '1') return
      r.route.paths.forEach((i) => {
        console.log(i.strategy)
        i.steps.forEach((ii) => {
          const position = ii.polyline.split(';').map((iii) => Util.gcj2wgs84(iii.split(',')[0], iii.split(',')[1]).reverse())
          const html = `<div style="text-align:center;">${ii.road}<br>${ii.assistant_action}</div>`
          const polyline = L.polyline(position, { weight: 8, color: Util.randomHexColor() }).bindTooltip(html, { sticky: true })
          group.addLayer(polyline)
        })
      })
    })
}
</script>

<style lang="scss" scoped>
.map {
  height: 600px;
  background-color: #ffffff;
}
</style>

<style lang="scss">
.leaflet-control-btn a {
  padding: 2px;
  border-radius: 2px;
}
</style>
