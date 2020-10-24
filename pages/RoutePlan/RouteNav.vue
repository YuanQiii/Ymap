<template>
	<view class="rn">
		<view class="rn-main">
			<view :class="index === activeIndex?'rn-item active':'rn-item'" v-for="(value, index) in navName" :key="value"
			 @click="toggleNav(index, value)">
				<view class="rn-name">{{value}}</view>
				<view class="rn-link"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'RouteNav',
		data() {
			return {
				navName: ['公交', '步行', '骑行', '驾车'],
				activeIndex: 0
			}
		},
		created() {
			let index = getApp().globalData.routeNavIndex
			this.toggleNav(index, this.navName[index])
		},
		methods: {
			toggleNav(index, value) {

				let modeType = ''
				switch (value) {
					case '公交':
						modeType = 'transit'
						break;
					case '步行':
						modeType = 'walking'
						break;
					case '骑行':
						modeType = 'bicycling'
						break;
					case '驾车':
						modeType = 'driving'
						break;
				}

				uni.$emit('toggleMode', {
					mode: modeType
				})//index RouteDetail监听
				getApp().globalData.routeMode = modeType

				this.activeIndex = index
				getApp().globalData.routeNavIndex = index
			}
		}
	}
</script>

<style scoped>
	.rn-name {
		text-align: center;
		letter-spacing: .2rem;
	}

	.rn-item {
		width: 3rem;
		height: 2rem;
		margin-top: .5rem;
	}

	.active {
		color: #00adb5;
	}

	.active .rn-link {
		height: 1rpx;
		margin-top: .3rem;
		background-color: #00adb5;
	}

	.rn-main {
		display: flex;
		justify-content: space-between;
		margin-left: .5rem;
		margin-right: .5rem;
	}

	.rn {
		background-color: #393e46;
		color: #EEEEEE;
	}
</style>
