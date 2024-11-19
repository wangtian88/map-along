<template>
  <div id="map-contain" class="map-contain"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAMapLoader } from '@/hooks/useAMap';

let amap: AMap.Map;
let map: AMap.Map;


// 创建地图
const lonlat: [number, number] = [116.478935, 39.997761];
const createMap = async () => {
  if (amap) { return };
  if (typeof amap === 'undefined') {
    // 可以在这里直接引入需要加载的loaderPlugins方法，也可在实例map中plugin进去
    amap = await useAMapLoader({ loaderPlugins: ['AMap.DistrictSearch'] });
  }
  const mapOption: AMap.MapOptions = {
    center: lonlat,
    zoom: 8,
    // viewMode: "3D",
    // pitch: 50,
  };
  map = new AMap.Map('map-contain', mapOption);
};

const initTale = async (name: string, zoom: number) => {
  var opts = {
    subdistrict: 0,
    extensions: 'all',
    level: 'district'
  };
  //利用行政区查询获取边界构建mask路径
  //也可以直接通过经纬度构建mask路径
  amap = await useAMapLoader({ loaderPlugins: ['AMap.DistrictSearch'] });
  // @ts-ignore
  var district = new AMap.DistrictSearch(opts);
  district.search(name, function (_: string, result: any) {
    console.log(result)
    var bounds = result.districtList[0].boundaries;
    let mask = [];
    for (var i = 0; i < bounds.length; i += 1) {
      mask.push([bounds[i]])
    }
 
    var map = new AMap.Map('map-contain', {
      mask: mask,
      center: [result.districtList[0].center.lng, result.districtList[0].center.lat],
      // viewMode: '3D',
      showLabel: false,
      // labelzIndex: 130,
      // pitch: 40,
      zoom: zoom,
      layers: [
        // new AMap.TileLayer.RoadNet({
        //     rejectMapMask:true
        // }),
        // new AMap.TileLayer.Traffic()
        new AMap.TileLayer.Satellite()
        // new AMap.TileLayer.RoadNet()
        // new AMap.TileLayer
      ],
      // 修改区域掩膜canvas的背景
      backgroundColor: 'transparent',
    });

    //添加描边
    for (var i = 0; i < mask.length; i += 1) {
      new AMap.Polyline({
        path: mask[i],
        strokeColor: '#99ffff',
        strokeWeight: 4,
        // 指定绘制图层
        map: map,
        lineJoin: 'round',
        lineCap: 'round',
      })
    }
  });
}

onMounted(async () => {
  // await createMap();
  await initTale('中国', 5);
})
</script>

<style scoped lang="less">
.map-contain {
  box-sizing: content-box;
  height: 90vh;
  width: 90vw;
  background-image: none;
}
</style>
