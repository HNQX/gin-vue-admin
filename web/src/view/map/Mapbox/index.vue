<!-- eslint-disable -->
<template>
    <div class="gva-table-box">
        <div :id="props.id" class="map" />
    </div>
</template>

<!-- eslint-disable -->
<script setup>
import { Map, Marker } from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css'
const TOKEN = 'pk.eyJ1IjoiZXZpYWZhbiIsImEiOiJjbHI3ZXBibXIyOHl3MmtteTYzMG1qdWdrIn0.qYhXUZQY-rWLk0uWKRCATQ'

import { onBeforeUnmount, onMounted } from 'vue'

let ins_map = null
const ins_group = {}

const props = defineProps({
    id: { type: String, default: 'map' },
})

onMounted(() => {
    initMap()
})

onBeforeUnmount(() => {
    ins_map.remove && ins_map.remove()
})

const initMap = () => {
    ins_map = new Map({
        container: props.id,
        style: 'mapbox://styles/mapbox/streets-v12',
        accessToken: TOKEN,
        minzoom: 8,
        attributionControl: false,
        center: [121.22, 31.55],
        pitch: 60,
        zoom: 11.5,
        bearing: 13.2,
        postEffect: { enable: !0, screenSpaceAmbientOcclusion: { enable: !0, intensity: 1.2, radius: 6, quality: 'low' }, screenSpaceReflection: { enable: !0 } },
        light: { main: { intensity: 1, shadow: !0, shadowQuality: 'low' }, ambient: { intensity: 0 } },
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
.mapboxgl-ctrl-bottom-left {
    display: none;
}
</style>
