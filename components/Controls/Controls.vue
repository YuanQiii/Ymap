<template>
	<cover-view class="controls-main">
		<cover-view class="controls-scale">
			<cover-image src="../../static/increase.png" @click="controlsOP('increase')" class="controls-increase img"></cover-image>
			<cover-image src="../../static/decrease.png" @click="controlsOP('decrease')" class="controls-decrease img"></cover-image>
			<cover-image src="../../static/satellite.png" @click="controlsOP('satellite')" class="controls-satellite img"></cover-image>
			<cover-image src="../../static/traffic.png" @click="controlsOP('traffic')" class="controls-traffic img"></cover-image>
			<cover-image src="../../static/compass.png" @click="controlsOP('compass')" class="controls-compass img"></cover-image>
		</cover-view>
	</cover-view>
</template>

<script>
	export default {
		name: 'Controls',
		methods:{
			controlsOP(type){
				uni.$emit('controls', type)
			}
		}
	}
</script>

<style scoped>
	.controls-scale {
		display: flex;

	}
	.controls-main {
		height: 45rpx;
		margin-left: 1rem;
		margin-top: 1rem;
	}
	.controls-decrease {

	}
	.controls-satellite, .controls-traffic {

	}
	.img {
		height: 45rpx;
		width: 45rpx;
		margin-right: 1rem;
	}
</style>
