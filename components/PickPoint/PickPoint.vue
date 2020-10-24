<template>
	<cover-view class="pp-main">
		<cover-view @click="getPosition('map')" class="pp-item">地图选点</cover-view>
		<cover-view @click="getPosition('mine')" class="pp-item">我的位置</cover-view>
	</cover-view>
</template>

<script>
	export default {
		name: 'PickPoint',
		data() {
			return {
				latitude: null,
				longitude: null
			}
		},
		methods: {
			getPosition(type) {
				uni.$emit('toggleSearch', {
					searchFlag: false
				}) //index监听
				
				uni.$emit('closePickPoint', false)//Search 监听
				
				if (type === 'mine') {
					let that = this
					uni.getLocation({
						type: 'gcj02',
						success(data) {
							that.latitude = data.latitude,
							that.longitude = data.longitude

							getApp().globalData.startLatitude = data.latitude
							getApp().globalData.startLongitude = data.longitude

							uni.$emit('updateLocation', {
								latitude: data.latitude,
								longitude: data.longitude
							}) //index监听
							
						}
					})
				}else {
					uni.$emit('choosePosition', true)//index监听
				}

			},
		}
	}
</script>

<style scoped>
	.pp-main {
		width: 100vw;
		display: flex;
		justify-content: center;
		color: #EEEEEE;
	}

	.pp-item {
		margin: .3rem 1.5rem;
	}
</style>
