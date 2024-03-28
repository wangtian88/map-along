<template></template>

<script setup lang="ts">
let dragRoute: any;

const handleDrag = (map: Map_2.Map, AMap: Map_2.Map) => {
  if (typeof AMap === 'undefined') {
    return;
  }

  // if (dragRoute) {
  //   dragRoute.destroy();
  // }

  var arr = new Array();//经纬度坐标数组
  arr.push(new AMap.LngLat(116.403322, 39.920255)); //初始的导航起点
  arr.push(new AMap.LngLat(116.420703, 39.897555)); //初始的导航途经点
  arr.push(new AMap.LngLat(116.430703, 39.897555)); //初始的导航途经点
  arr.push(new AMap.LngLat(116.410703, 39.897555)); //初始的导航终点

  AMap.plugin('AMap.DragRoute', async () => {
    dragRoute = new AMap.DragRoute(map, arr, AMap.DrivingPolicy.LEAST_FEE);
    dragRoute.search();

    // 导航路径绘制完成触发  货车汽车通用
    // dragRoute.on('complete', () => {
    //   // 获取路径坐标点
    //   getAllPoint();
    //   // 获取起始点途径点 货车汽车通用
    //   getStopWay();
    // });
  })

}

/*
// 返回所有坐标
const getAllPoint = () => {
  const res = dragRoute.getRoute();
  const lineData: number[][] = new Array();
  res.map((item) => {
    const { lng, lat } = item;
    lineData.push([lng, lat]);
  });
  emit('getLine', lineData);

  resStart = lineData[0];
  resEnd = lineData[res.length - 1];
};

const getStopWay = () => {
  const res = dragRoute.getWays();
  const stopData: number[][] = new Array();
  // push起点
  stopData.push(resStart);
  // push经停点
  if (res && res.length > 0) {
    res.map((item) => {
      const { lng, lat } = item;
      stopData.push([lng, lat]);
    });
  }
  // push终点
  stopData.push(resEnd);
  emit('changeAddress', stopData);
};
*/

defineExpose({
  handleDrag,
})
</script>