<template>
  <div id="map-contain" class="map-contain"></div>
  
  <!-- infowindow -->
  <button @click="openInfoWindow">打开信息体窗口</button>
  <button @click="closeInfoWindow">关闭信息体窗口</button>
</template>

<script setup lang="ts">
import { ref, onMounted, Component, createApp } from 'vue';
import { useAMapLoader } from '@/hooks/useAMap';

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
})
</script>

<style scoped lang="less">
.map-contain {
  box-sizing: content-box;
  height: 90vh;
  width: 90vw;
}
</style>
