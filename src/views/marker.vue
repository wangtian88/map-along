<!--
  灵活点标记
  可以随着地图级别改变样式和大小的 Marker
-->

<template>
  <div id="map-contain" class="map-contain"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAMapLoader } from '@/hooks/useAMap';

let AMap: Map_2.Map;
let map: Map_2.Map;

const stopArrNumber: number[][] = [
  [116.410738, 39.880882],
  [116.421, 39.8609],
  [116.431, 39.8814],
  [116.413, 39.8751],
  [116.420924, 39.8809],
]

const initMap = async () => {
  if (!AMap) {
    AMap = await useAMapLoader();
    const mapOption = {
      center: [116.405562, 39.881166],
      zoom: 17,
      forceVector: true,
    };
    map = new AMap.Map('map-contain', mapOption);
  }

  let stopMarker: AMap.Marker[] = stopArrNumber.map((item: number[], index: number) => {
    // vite静态资源处理
    const imgUrl = new URL(
      `/src/assets/images/stop/stop-${(index + 1) % 3}.png`,
      import.meta.url
    ).href;
    console.log(imgUrl)
    let stopIconAmap: AMap.Icon = new AMap.Icon({
      size: new AMap.Size(36, 44),
      image: imgUrl,
      imageSize: new AMap.Size(36, 44),
      imageOffset: new AMap.Pixel(0, 0),
    });

    return new AMap.Marker({
      position: item,
      icon: stopIconAmap,
      offset: new AMap.Pixel(-27, -33),
    });
  });

  map.add(stopMarker);
  map.setFitView();
}

onMounted(() => {
  initMap();
})
</script>

<style scoped lang="less">
.map-contain {
  box-sizing: content-box;
  height: 90vh;
  width: 90vw;

}
</style>