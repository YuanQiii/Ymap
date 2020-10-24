<template>
	<cover-view class="p-main">
		<cover-view v-for="(value, index) in list" :key="index" class="p-item" @click="sendKey(value)">
			{{value}}
		</cover-view>
	</cover-view>
</template>

<script>
	export default {
		name: 'Poi',
		data() {
			return {
				list: ['美食', '酒店', '景点', '更多']
			}
		},
		methods: {
			sendKey(value) {
				if (value === '更多') {
					uni.navigateTo({
						url: '/pages/PoiList/PoiList',
						animationDuration: 500,
					})
				} else {
					uni.$emit('poiKey', value)
					uni.$emit('poiFlag', true)
				}
			}
		}
	}
</script>

<style scoped>
	.p-main {
		
		margin-left: -2rem;
		display: flex;
		justify-content: space-evenly;
		color: #EEEEEE;
	}

	.p-item {
		line-height: 1.5rem;
		margin-bottom: 1rem;
	}
</style>
