<!--
  echarts使用
-->

<template>
  <div id="map-contain" class="map-contain" ref="mapContain"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口 按需加载。
import echarts from '@/utils/lib/echarts';

// dom
const mapContain = ref<HTMLElement>();

const initEcharts = () => {
  // 初始化图表，设置配置项
  const myChart = echarts.init(mapContain.value, 'map-contain');
  myChart.setOption({
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: 'line'
      }
    ]
  });
}

onMounted(() => {
  initEcharts();
})
</script>

<style scoped lang="less">
.map-contain {
  box-sizing: content-box;
  height: 90vh;
  width: 90vw;
}
</style>