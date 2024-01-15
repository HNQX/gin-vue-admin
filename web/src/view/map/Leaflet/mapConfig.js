/* eslint-disable indent */
export const PARAMS_DEFAULT_BACKGROUND_COLOR = '#cccccc'
export const KEY_TIANDITU = 'f63c35a2b171b35965fe48ef4609adae'

export const KEY_GAODE_DAOHANG = 'c922dabc01b25446e8614a1d9ddafb75'

const PRE_TIANDITU = 'http://t{s}.tianditu.gov.cn/'

const PRE_TIANDITU_PARAMS = `/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=${KEY_TIANDITU}&LAYER=`
const PRE_TIANDITU_SUBDOMAINS = ['0', '1', '2', '3', '4', '5', '6', '7']

const NAME_LAYER = 'chinaosm:osm'
export const MAP_TILELAYER = [
    { id: 1, name: '天地图', type: 'tileLayer', option: { subdomains: PRE_TIANDITU_SUBDOMAINS }, url: [`${PRE_TIANDITU}vec_w${PRE_TIANDITU_PARAMS}vec`, `${PRE_TIANDITU}cva_w${PRE_TIANDITU_PARAMS}cva`] },
    { id: 2, name: '天地图影像', type: 'tileLayer', option: { subdomains: PRE_TIANDITU_SUBDOMAINS }, url: [`${PRE_TIANDITU}img_w${PRE_TIANDITU_PARAMS}img`, `${PRE_TIANDITU}cia_w${PRE_TIANDITU_PARAMS}cia`] },
    { id: 3, name: '天地图地形', type: 'tileLayer', option: { subdomains: PRE_TIANDITU_SUBDOMAINS }, url: [`${PRE_TIANDITU}ter_w${PRE_TIANDITU_PARAMS}ter`, `${PRE_TIANDITU}cta_w${PRE_TIANDITU_PARAMS}cta`] },
    { id: 4, name: '清新地图', type: 'wms', bg: '#ffffff', option: { layers: NAME_LAYER, format: 'image/png', transparent: true }, url: [`/mapServer/geoserver/${NAME_LAYER.split(':').shift()}/wms`] },
    { id: 5, name: '清新地图', type: 'wms', bg: '#4952a0', option: { layers: NAME_LAYER, format: 'image/png', styles: 'blue', transparent: true }, url: [`/mapServer/geoserver/${NAME_LAYER.split(':').shift()}/wms`] },
]
