<template>
  <div id="map-contain" class="map-contain"></div>
  <DragRoute ref="dragRouteRef"  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAMapLoader } from '@/hooks/useAMap';
import DragRoute from '@/components/DragRoute.vue';

let AMap: Map_2.Map;
let map: Map_2.Map;


// 创建地图
const lonlat = ref<Array<number>>([116.478935, 39.997761]);
const createMap = async () => {
  if (AMap) { return };
  if (typeof AMap === 'undefined') {
    // 可以在这里直接引入需要加载的loaderPlugins方法，也可在实例map中plugin进去
    // AMap = await useAMapLoader({loaderPlugins: ['AMap.PolygonEditor']});
    AMap = await useAMapLoader();
  }
  const mapOption = {
    center: lonlat.value,
    zoom: 12,
    // viewMode: "3D",
    // pitch: 50,
  };
  map = new AMap.Map('map-contain', mapOption);
};

const dragRouteRef = ref<any>();
const initDrag = () => {
  dragRouteRef.value.handleDrag(map, AMap);
}


onMounted(async () => {
  await createMap();
  await initDrag();
})
</script>

<style scoped lang="less">
.map-contain {
  box-sizing: content-box;
  height: 90vh;
  width: 90vw;
}
</style>
