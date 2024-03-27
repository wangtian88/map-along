<!--
	vue3 createApp mount创建infowindow


-->

<template>
	<div class="info-window">
		<div class="close-icon" @click="close">x</div>
		<h3>挂载 标题 -- {{ data.title }}</h3>
		<p @click="handleClick">挂载 描述</p>
	</div>
</template>
<script lang="ts" setup>
import { PropType } from 'vue';
// import { useRouter } from 'vue-router';

// const router = useRouter();
defineProps({
	data: {
		type: Object as PropType<{ title: string;[key: string]: any }>,
		default: () => {
			return {
				title: '标题h4',
			};
		},
	},
	close: {
		type: Function as PropType<() => void>,
		default: () => {
			return () => { };
		},
	},
});

const handleClick = () => {
	console.log(1111111111)
}

</script>
<style>
.info-window {
	background-color: #fff;
	padding: 20px;
}

.close-icon {
	font-size: 24px;
	color: #3333;
}
</style>