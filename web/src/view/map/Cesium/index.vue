<template>
    <div class="gva-table-box">
        <div :id="props.id" class="map" />
    </div>
</template>

<script setup>
import { Viewer } from 'cesium';
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

    ins_map = new Viewer(props.id)

}

</script>

<style lang="scss" scoped>
.map {
    height: 600px;
    background-color: #ffffff;
}
</style>

<style lang="scss"></style>
