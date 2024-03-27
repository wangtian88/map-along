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

  <!-- infowindow -->
  <button @click="openInfoWindow">打开信息体窗口</button>
  <button @click="closeInfoWindow">关闭信息体窗口</button>
</template>

<script setup lang="ts">
import { ref, onMounted, Component, createApp } from 'vue';
import { useAMapLoader } from '@/hooks/useAMap';
import MoveAlong from '@/components/MoveAlong.vue';
import CirclePathDraw from '@/components/CirclePathDraw/index.vue';
import { lineArr } from '@/components/datas/line';
import carImg from '@/assets/images/car.png';

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




// 信息体窗口
let infoWindow: AMap.InfoWindow;
// 封装打开infoWindow
const handleOpenInfoWindow = (
  content: string | HTMLElement,
  position: [number, number] = [116.397389, 39.909466],
) => {
  if (infoWindow.getIsOpen()) {
    infoWindow.setPosition(position);
  } else {
    // @ts-ignore
    infoWindow.open(map, position);
  }
  infoWindow.setContent(content);
};

// 封装关闭infoWindow
const closeInfoWindow = () => {
  infoWindow.close();
};

// 通过vue组件传入
const openInfoWindow = async () => {
  infoWindow = new AMap.InfoWindow({
    isCustom: true,
    // content: '', 传入 dom 对象，或者 html 字符串
  });
  // 引入需要加载的子组件
  const InfoWindow = (await (await import('@/components/InfoWindow.vue')).default) as any;
  const dom = bootstrap(InfoWindow, { title: 'test' }, closeInfoWindow);
  handleOpenInfoWindow(dom);
};

// 创建实例
const bootstrap = (comp: Component, data: Record<string, any>, closeFn: () => void) => {
  const wrapper = document.createElement('div');
  const app = createApp(comp, {
    data,
    close: () => {
      closeFn?.();
      app.unmount();
    },
  });
  app.mount(wrapper);
  return wrapper as HTMLElement;
};



onMounted(async () => {
  await createMap();
  // 绘制轨迹
  // await moveAlongRef.value.moveAnimate(map, AMap);
  // 绘制多边形
  // await circlePathDrawRef.value.handleDraw(map, AMap);
})
</script>

<style scoped lang="less">
.map-contain {
  box-sizing: content-box;
  height: 90vh;
  width: 90vw;
}
</style>
