<template>
  <input v-model="keyWord" placeholder="输入地址查询" placeholder-class="input-placeholder" @input="handleSearch" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAMapLoader } from '@/hooks/useAMap';
import { useDebounceFn } from "@/hooks/useDebounceFn";

const keyWord = ref<string>();
let amap: AMap.Map;

// 搜索后
const debounceSearch = async () => {
  if (!amap) {
    amap = await useAMapLoader({ loaderPlugins: ["AMap.PlaceSearch"] });
  }
  
  const placeSearch = new AMap.PlaceSearch({
    pageSize: 10, // 单页显示结果条数
    pageIndex: 1, // 页码
    extensions: "all", // 获取详细信息
    autoFitView: false, // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
  });
  
  //构造地点查询类
  placeSearch.search(keyWord.value, (status: string, result: { info: string; poiList: { pois: any } }) => {
    placeSearch.clear();
    if (status === "complete" && result.info === "OK") {
      console.log('result.poiList.pois:', result.poiList.pois)
    } else {
      console.log("请输入更详细地址！");
    }
  });
};

// 防抖
const { run: handleSearch } = useDebounceFn(debounceSearch, 1000);
</script>