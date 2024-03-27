<!-- 
	<MoveAlong 
		:lonlat="[116.478935, 39.997761]" 
		:car-img="carImg" 
		:duration="500" 
		:line-arr="lineArr"
	/>
	import MoveAlong from '@/components/MoveAlong.vue';

	参数说明：
		lonlat: 中心点 Array<number>
		car-img: mariker图标
		duration: 速度
		line-arr: 轨迹数据number[][]
-->

<template></template>

<script setup lang="ts">
import carIcon from '@/assets/images/car.png';

const props = defineProps({
	lonlat: {
		type: Array<number>,
		default: [116.478935, 39.997761]
	},
	carImg: {
		type: String,
		default: carIcon,
	},
	duration: {
		type: Number,
		default: 500,
	},
	lineArr: {
		type: Array<Array<number>>,
	},
})

const { lonlat, carImg, duration, lineArr } = props;


let marker: AMap.Marker;

// 加载动画插件
const moveAnimate = (map: Map_2.Map, AMap: Map_2.Map) => {
	if (typeof map === 'undefined') {
		return;
	}
	marker = new AMap.Marker({
		map: map,
		position: lonlat,
		icon: carImg,
		offset: new AMap.Pixel(-13, -26),
	});

	AMap.plugin('AMap.MoveAnimation', async () => {
		// 绘制轨迹
		new AMap.Polyline({
			map: map,
			path: lineArr,
			showDir: true,
			strokeColor: "#28F",  //线颜色
			// strokeOpacity: 1,     //线透明度
			strokeWeight: 6,      //线宽
			// strokeStyle: "solid"  //线样式
		});

		const passedPolyline = new AMap.Polyline({
			map: map,
			strokeColor: "#AF5",  //线颜色
			strokeWeight: 6,      //线宽
		});

		// @ts-ignore
		marker.on('moving', function (e: any) {
			passedPolyline.setPath(e.passedPath);
			map.setCenter(e.target.getPosition(), true)
		});

		map.setFitView();
	})
}

const handleStart = () => {
	marker.moveAlong(lineArr, {
		// 每一段的时长
		duration: duration,//可根据实际采集时间间隔设置
		// JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
		autoRotation: true,
	});
}

const handlePause = () => {
	marker.pauseMove();
}

const handleResume = () => {
	marker.resumeMove();
}

const handleStop = () => {
	marker.stopMove();
}

defineExpose({
	handleStart,
	handlePause,
	handleResume,
	handleStop,
	moveAnimate,
});
</script>

<style scoped lang="less"></style>
