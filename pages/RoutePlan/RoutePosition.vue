<template>
	<view class="rps-main" v-if="message != 'to格式错误'">
		<view class="rps-item">
			<view class="rps-point">
				<view class="rps-point-start"></view>
				<view class="rps-point-center"></view>
				<view class="rps-point-end"></view>
			</view>
			<view class="rps-wrap">
				<view class="rps-start" @click="changePosition('start')">{{startTitle}}</view>
				<view class="rps-end" @click="changePosition('end')">{{endTitle}}</view>
			</view>
			<view class="rps-exchange" @click="changePosition('exchange')">
				<image src="../../static/exchange.png" class="rps-img"></image>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		name: 'RoutePosition',
		data() {
			return {
				endTitle: '',
				startTitle: '我的位置'
			}
		},
		
		created() {
			this.endTitle = getApp().globalData.destinationTitle
			if (getApp().globalData.outsetTitle) {
				this.startTitle = getApp().globalData.outsetTitle
			}
		},
		methods: {
			changePosition(type) {


				if (type === 'exchange') {
					uni.$emit('exchangePosition', type) // index RoutePlan监听	
				} else {
					uni.navigateBack()
					uni.$emit('toggleSearch', {
						searchFlag: true
					}) // index监听


					if (type === 'start') {
						uni.$emit('positionChange', type) // Search HistoryRecord监听
					}
					if (type === 'end') {
						uni.$emit('endChange', type) // index监听
					}
				}
			}
		}
	}
</script>

<style scoped>
	.rps-point-center {
		height: .8rem;
		width: .2rem;
		background-color: #EEEEEE;
		margin: .1rem 0; 
	}
	.rps-point-start {
		width: .6rem;
		height: .6rem;
		border-radius: .6rem;
		background-color: #1ba784;
	}
	.rps-point-end {
		width: .6rem;
		height: .6rem;
		border-radius: .6rem;
		background-color: #a7535a;
	}
	.rps-point {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-right: 1rem;
		margin-left: -1rem;
	}
	.rps-img {
		width: 50rpx;
		height: 50rpx;
		margin-left: 1rem;
	}

	.rps-item {
		display: flex;
		align-items: center;
	}

	.rps-wrap {
		border: solid 1rpx #00adb5;
		padding: .5rem;
		border-radius: 10rpx;
	}

	.rps-start,
	.rps-end {
		width: 15rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		line-height: 1.5rem;
	}

	.rps-main {
		height: 5rem;
		background-color: #393e46;
		color: #eeeeee;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
