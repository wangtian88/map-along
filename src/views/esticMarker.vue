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

let amap: AMap.Map;
let map: AMap.Map;

// 样式列表
const stylesArray = [{
  icon: {
    img: 'https://a.amap.com/jsapi_demos/static/resource/img/men3.png',
    size: [16, 16],//可见区域的大小
    anchor: 'bottom-center',//锚点
    fitZoom: 14,//最合适的级别
    scaleFactor: 2,//地图放大一级的缩放比例系数
    maxScale: 2,//最大放大比例
    minScale: 1//最小放大比例
  },
  label: {
    content: '百花殿',
    position: 'BM',
    minZoom: 15,
  }
}, 
{
  icon: {
    img: 'https://a.amap.com/jsapi_demos/static/resource/img/tingzi.png',
    size: [48, 63],
    anchor: 'bottom-center',
    fitZoom: 17.5,
    scaleFactor: 2,
    maxScale: 2,
    minScale: 0.125
  },
  label: {
    content: '万寿亭',
    position: 'BM',
    minZoom: 15
  }
}];

// zoom 与样式的映射
const zoomStyleMapping = {
  14: 0,  // 14级使用样式 0
  15: 0,
  16: 0,
  17: 0,
  18: 1,
  19: 1,
  20: 1,
};

const initMap = async () => {
  if (!amap) {
    amap = await useAMapLoader({ loaderPlugins: ["AMap.ElasticMarker"] });
    const mapOption: AMap.MapOptions = {
      center: [116.405562, 39.881166],
      zoom: 17,
      // @ts-ignore
      forceVector: true,
    };
    map = new AMap.Map('map-contain', mapOption);
  }
  const elasticMarker = new AMap.ElasticMarker({
    position: [116.405562, 39.881166],
    // 指定样式列表
    styles: stylesArray,
    // 指定 zoom 与样式的映射
    zoomStyleMapping: zoomStyleMapping,
  });
  map.add(elasticMarker);
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

:deep(.amap-marker-label) {
  width: 60px;
  font-size: 16px;
  line-height: 18px;
  text-align: center;
  height: 18px;
  font-family: STLiti;
  color: green;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.4);
  border: solid 2px rgba(100, 255, 200, 0.8);
}
</style>