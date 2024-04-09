<template>
  <div id="map-contain" class="map-contain"></div>
  <!-- 轨迹回放 -->
  <MoveAlong ref="moveAlongRef" :lonlat="lonlat" :car-img="carImg" :line-arr="lineArr" />
  <button @click="handleStart">开始动画</button>
  <button @click="handlePause">暂停动画</button>
  <button @click="handleResume">继续动画</button>
  <button @click="handleStop">停止动画</button>

  <!-- 围栏编辑 -->
  <CirclePathDraw 
    ref="circlePathDrawRef" 
    :type="drawType" 
    :path="[drawPath0, drawPath1]" 
    :circleData="[{center: drawPath0[0], radius: 1000}]"
    :is-one="true"
    @get-path="handlePath"
  />
  <select @change="handleDrawType">
    <option value="polygon">多边形围栏</option>
    <option value="circle">圆形围栏</option>
  </select>
  <button @click="handleDrawAdd">新增围栏</button>
  <button @click="handleDrawClose">结束编辑</button>
  <button @click="handleDrawDelete">删除围栏</button>

</template>

<script setup lang="ts">
import { ref, onMounted, onDeactivated, onUnmounted } from 'vue';
import { useAMapLoader } from '@/hooks/useAMap';
import MoveAlong from '@/components/MoveAlong.vue';
import CirclePathDraw from '@/components/CirclePathDraw/index.vue';
import { lineArr } from '@/components/datas/line';
import carImg from '@/assets/images/car.png';

let amap: AMap.Map;
let map: AMap.Map;



// 创建地图
const lonlat: [number, number] = [116.478935, 39.997761];
const createMap = async () => {
  if (amap) { return };
  if (typeof amap === 'undefined') {
    // 可以在这里直接引入需要加载的loaderPlugins方法，也可在实例map中plugin进去
    // AMap = await useAMapLoader({loaderPlugins: ['AMap.PolygonEditor']});
    amap = await useAMapLoader();
  }
  const mapOption: AMap.MapOptions = {
    center: lonlat,
    zoom: 12,
    // viewMode: "3D",
    // pitch: 50,
  };
  map = new AMap.Map('map-contain', mapOption);
};




// 轨迹组件
// const moveAlongRef = ref<HTMLDivElement | null>(null);
const moveAlongRef = ref<any>()
const handleStart = () => {
  moveAlongRef.value.handleStart();
}
const handlePause = () => {
  moveAlongRef.value.handlePause();
}
const handleResume = () => {
  moveAlongRef.value.handleResume();
}
const handleStop = () => {
  moveAlongRef.value.handleStop();
}




// 围栏组件
const circlePathDrawRef = ref<any>();
// 当前围栏类型
const drawType = ref<string>('polygon');
// 多边形围栏默认值
const drawPath0 = ref<number[][]>([[116.475334, 39.997534], [116.476627, 39.998315], [116.478603, 39.99879], [116.478529, 40.000296], [116.475082, 40.000151], [116.473421, 39.998717]]);
const drawPath1 = ref<number[][]>([
  [116.453322, 39.920255],
  [116.460703, 39.897555],
  [116.452292, 39.892353],
  [116.439846, 39.891365]
]);

const handleDrawType = (event: any) => {
  drawType.value = event.target.value;
  console.log('drawType.value', drawType.value)
}
const handleDrawAdd = () => {
  circlePathDrawRef.value.handleDrawAdd();
}
const handleDrawClose = () => {
  circlePathDrawRef.value.handleDrawClose();
}
const handleDrawDelete = () => {
  circlePathDrawRef.value.handleDrawDelete(map);
}
// 获取围栏数据
const handlePath = (datas: { center: AMap.LngLat, radius: number, path: Array<AMap.LngLat> }) => {
  console.log('handlePath', datas)
}



onMounted(async () => {
  await createMap();
  // 绘制轨迹
  await moveAlongRef.value.moveAnimate(map);
  // 绘制多边形
  await circlePathDrawRef.value.handleDraw(map);
})

onDeactivated(() => {
  map && map.destroy();
});

onUnmounted(() => {
  // 注销地图实例
  map && map.destroy();
});
</script>

<style scoped lang="less">
.map-contain {
  box-sizing: content-box;
  height: 90vh;
  width: 90vw;
}
</style>
