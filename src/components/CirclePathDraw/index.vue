<!-- 
	
参数：
	type：当前围栏类型-指定值string circle, polygon  默认polygon
	path: 多边形围栏数据 number[][][] | string[][][]
	circleData: 圆形围栏数据
			{center, radius}[]
			center: 圆形围栏中心点
			radius: 圆形围栏半径
	is-one: 是否只显示一个围栏 true-只显示一个 false-可显示多个
	get-path：获取当前绘制的围栏数据回调
-->


<template></template>

<script setup lang="ts">
import { polygonOptionsJson, circleOptionJson } from './data';
import { watchEffect, toRefs } from 'vue';

const emits = defineEmits(['getPath']);

const props = defineProps({
	type: {
		type: String,
		default: 'polygon',
	},
	path: {
		type: Array,
	},
	// center: {
	// 	type: Array,
	// },
	// radius: {
	// 	type: Number,
	// 	default: 1000,
	// }
	circleData: Object,
	isOne: {
		type: Boolean,
		default: false,
	}
})

const { path, circleData, isOne } = props;
const { type } = toRefs(props);

let map: AMap.Map;

// 多边形实例
let polygon: AMap.Polygon;
// 多边形编辑器实例
let polygonEditor: AMap.PolygonEditor;
// 圆形实例
let circle: AMap.Circle;
//  圆形形编辑器实例
let circleEditor: AMap.CircleEditor;

// 默认圆形围栏半径
const defaultRadius = 1000;


const closeDraw = () => {
	polygonEditor && polygonEditor.close();
	circleEditor && circleEditor.close();
}

// 设置多边形元素编辑
const polygonIsEdit = (polygon: AMap.Polygon) => {
	closeDraw();
	polygonEditor.setTarget(polygon);
	polygonEditor.open();
}

// 设置圆形元素编辑
const circleIsEdit = (circle: AMap.Circle) => {
	closeDraw();
	circleEditor.setTarget(circle);
	circleEditor.open();
}

// 初始化多边形围栏
const handlePolygonDraw = () => {
	if (typeof map === 'undefined') {
		return;
	}

	closeDraw();

	// @ts-ignore
	polygon = new AMap.Polygon(polygonOptionsJson)

	AMap.plugin(['AMap.PolygonEditor'], () => {
		//实例化多边形编辑器，传入地图实例和要进行编辑的多边形实例
		polygonEditor = new AMap.PolygonEditor(map, polygon);
		// polygonEditor = new AMap.PolygonEditor(map);
		// polygonEditor.addAdsorbPolygons(polygon);

		// 绘制出多边形并调整视角
		// map.add(polygon);
		// map.setFitView()

		// 传入数据双击编辑
		polygon.on('dblclick', () => {
			polygonIsEdit(polygon);
		})

		// 新建数据双击编辑
		polygonEditor.on('add', function (data: any) {
			const polygonTarget = data.target;
			polygonEditor.addAdsorbPolygons(polygonTarget);
			// 设置编辑对象
			polygonTarget.on('dblclick', () => {
				polygonIsEdit(polygonTarget);
			})
		})
	});
}


// 初始化圆形围栏
const handleCircleDraw = () => {
	if (typeof map === 'undefined') {
		return;
	}

	closeDraw();

	circle = new AMap.Circle({
		...circleOptionJson
	})

	AMap.plugin(['AMap.CircleEditor'], () => {
		//实例化多边形编辑器，传入地图实例和要进行编辑的多边形实例
		// circleEditor = new AMap.CircleEditor(map, circle);
		circleEditor = new AMap.CircleEditor(map);
		// 绘制出圆形并调整视角
		// map.add(circle);
		// map.setFitView();

		// 传入数据双击编辑
		circle.on('dblclick', () => {
			circleIsEdit(circle);
		})

		// 新建数据双击编辑
		circleEditor.on('add', function (data: any) {
			const circle = data.target;
			// 设置编辑对象
			circle.on('dblclick', () => {
				circleIsEdit(circle);
			})
		})
	});
}

// 新建围栏
const handleDrawAdd = () => {
	// 只有一个围栏数据
	if(isOne) {
		const polygonEvent = polygonEditor && polygonEditor.getTarget();
		const circleEvent = circleEditor && circleEditor.getTarget();
		// 销毁内存中的覆盖物
		polygonEvent && polygonEvent.destroy();
		circleEvent && circleEvent.destroy();
		// 清除map
		map.clearMap();
	}
	closeDraw();
	switch (type.value) {
		case 'circle':
			circleEditor.setTarget();
			circleEditor.open();
			break;
		case 'polygon':
			polygonEditor.setTarget();
			polygonEditor.open();
			break;
	}
}

// 结束编辑
const handleDrawClose = async () => {
	switch (type.value) {
		case 'polygon':
			// 获取当前编辑围栏的path
			const polygonEvent = await polygonEditor.getTarget();
			// const path = polygonEvent._opts.path; // [[],[]]
			const path = polygonEvent?.getPath();
			emits('getPath', { path });
			break;
		case 'circle':
			const circleEvent = await circleEditor.getTarget();
			const radius = circleEvent?.getRadius();
			const center = circleEvent?.getCenter();
			emits('getPath', { radius, center })
			break;
	}

	closeDraw();
}

// 删除
const handleDrawDelete = () => {
	// @ts-ignore
	const isPolyEdit = polygonEditor && polygonEditor.editable;
	// @ts-ignore
	const isCircleEdit = circleEditor && circleEditor._editing;
	if (isPolyEdit) {
		// 获取当前编辑对象
		const polygonEvent = polygonEditor.getTarget() as any;
		// 删除覆盖物
		map.remove(polygonEvent);
		// 销毁内存中的覆盖物
		polygonEvent && polygonEvent.destroy();
	} else if (isCircleEdit) {
		// 获取当前编辑对象
		const circleEvent = circleEditor.getTarget() as any;
		// 删除覆盖物
		map.remove(circleEvent);
		// 销毁内存中的覆盖物
		circleEvent && circleEvent.destroy();
	}

	closeDraw();
}

// 创建已有的polygon数据
const creatPolygonByData = () => {
	// 判断是否有已绘制的数据，并加入
	if (path && path.length > 0 && AMap) {
		path.forEach(item => {
			// @ts-ignore
			const pathPolygon = new AMap.Polygon({
				...polygonOptionsJson,
				path: item,
			})
			polygonEditor.addAdsorbPolygons(pathPolygon);
			pathPolygon.on('dblclick', () => {
				polygonIsEdit(pathPolygon);
			})
			map.add(pathPolygon);
		})
	}
}

// 创建已有的circle数据
const creatCircleByData = () => {
	// 判断是否有传入的数据
	if (circleData && circleData.length > 0 && AMap) {
		circleData.forEach((item: { center: [number, number], radius: number }) => {
			const { center, radius } = item;
			const circlePath =  new AMap.Circle({
				...circleOptionJson,
				center,
				radius: radius || defaultRadius,
			})
			
			circlePath.on('dblclick', () => {
				circleIsEdit(circlePath);
			})

			map.add(circlePath);
		})
	}

}

const drawType = async () => {
	switch (type.value) {
		case 'polygon':
			!polygon && await handlePolygonDraw();
			await creatPolygonByData();
			break;
		case 'circle':
			!circle && await handleCircleDraw();
			await creatCircleByData();
			break;
	}
}

const handleDraw = (mapData: AMap.Map) => {
	map = mapData;
	drawType();
	// creatPolygonByData();
	// creatCircleByData();
}

watchEffect(() => {
	console.log('draw type:', type.value);
	drawType();
})

defineExpose({
	handleDraw,
	handleDrawAdd,
	handleDrawClose,
	handleDrawDelete,
});
</script>

<style scoped lang="less"></style>
