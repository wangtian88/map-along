// 基础配置
export const polygonOptionsJson: AMap.PolygonOptions = {
	fillColor: 'rgb(255, 0, 0)', //多边形填充颜色
	fillOpacity: .1,
	strokeWeight: 2, //线条宽度，默认为 2
	strokeColor: "red", //线条颜色
	// draggable: true,
}

export const circleOptionJson: AMap.CircleOptions = {
	strokeColor: "red",
	strokeWeight: 6,
	strokeOpacity: 0.2,
	fillOpacity: 0.4,
	strokeStyle: 'dashed',
	strokeDasharray: [10, 10],
	// 线样式还支持 'dashed'
	fillColor: 'red',
	zIndex: 50,
}
