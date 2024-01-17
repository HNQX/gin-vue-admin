<!-- eslint-disable -->
<template>
  <div class="gva-table-box">
    <div :id="props.id" class="map" />
  </div>
</template>

<script setup>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import 'leaflet.locatecontrol' // Import plugin
import 'leaflet.locatecontrol/dist/L.Control.Locate.min.css' // Import styles

import { onBeforeUnmount, onMounted } from 'vue'
import { MyBtn, Util } from './extend'

import { KEY_GAODE_DAOHANG, MAP_TILELAYER, PARAMS_DEFAULT_BACKGROUND_COLOR } from './mapConfig'

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
    center: [31.25, 120.6],
    attributionControl: false
  })
  ins_map.getContainer().style.backgroundColor = PARAMS_DEFAULT_BACKGROUND_COLOR

  L.control.locate().addTo(ins_map)

  const LIST_BTN = [
    { text: '×', title: '清除图层', class: 'btn2' },
    { text: '⋙', title: '导航', class: 'btn1' },
    { text: '⇵', title: '更改底图', class: 'btn3', instance: true },
  ]
  ins_map.addControl(new MyBtn(LIST_BTN))

  let currentMapId = 1
  ins_map.on('btnClick', (e) => {
    switch (e.title) {
      case '导航':
        daohang()
        break
      case '清除图层':
        removeByRef('LAYER_1')
        removeByRef('LAYER_DAOHANG')
        removeByRef('LAYER_DAOHANG_LINE')
        break
      case '更改底图':
        switchBase(currentMapId)
        currentMapId++
        if (currentMapId > MAP_TILELAYER.length) currentMapId = 1
        break
      default:
        break
    }
  })

  LIST_BTN.forEach(i => i.instance && ins_map.fire('btnClick', i))


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

const switchBase = (id) => {
  const group = removeByRef('BASE_MAP')
  const to = MAP_TILELAYER.filter((i) => (i.id === id))[0]
  if (!to) return

  to.url.forEach((i) => {
    let layer
    switch (to.type) {
      case 'tileLayer':
        layer = L.tileLayer(i, to.option)
        break
      case 'wms':
        layer = L.tileLayer.wms(i, to.option)
        break
      default:
        break
    }
    layer && group.addLayer(layer)
  })

  ins_map.getContainer().style.backgroundColor = to.bg || PARAMS_DEFAULT_BACKGROUND_COLOR
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

  fetch(`https://restapi.amap.com/v3/direction/driving?origin=${p_s}&destination=${p_e}&extensions=all&key=${KEY_GAODE_DAOHANG}`)
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
  cursor: pointer;
}
</style>
