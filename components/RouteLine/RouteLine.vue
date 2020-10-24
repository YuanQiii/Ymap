<template>
	<view>
		<view>
			<view v-for="(value, index) in routes" :key="index" class="rl-head">

				<view class="rl-info">
					<view class="rl-duration">{{durationFormat(value.duration)}}</view>
					<view class="rl-distance">{{distanceFormat(value.distance)}}</view>
				</view>

				<navigator open-type="navigateBack">
					<view>
						<view class="rl-rl">
							路线
						</view>
					</view>
				</navigator>

			</view>

		</view>

		<view class="rl-detail">
			<view v-for="(value, index) in stepsArr[0]" :key="index" class="rl-step">
				<view class="rl-act-desc">
					<image src="../../static/front.png" v-if="value.act_desc === '直行'" class="rl-img"></image>
					<image src="../../static/front.png" v-if="value.act_desc === ''" class="rl-img"></image>
					<image src="../../static/left.png" v-if="value.act_desc === '左转'" class="rl-img"></image>
					<image src="../../static/left_front.png" v-if="value.act_desc === '偏左转'" class="rl-img"></image>
					<image src="../../static/right.png" v-if="value.act_desc === '右转'" class="rl-img"></image>
					<image src="../../static/right_front.png" v-if="value.act_desc === '偏右转'" class="rl-img"></image>
					<image src="../../static/turn_left.png" v-if="value.act_desc === '左转调头'" class="rl-img"></image>
					<image src="../../static/turn_right.png" v-if="value.act_desc === '右转调头'" class="rl-img"></image>
				</view>
				<view class="rl-dr">
					<view class="rl-road-name">
						<view v-if="value.road_name === ''">
							无名道路
						</view>
						<view v-else>
							{{value.road_name}}
						</view>
					</view>
					<view class="rl-dis">
						{{modeCat}}{{distanceFormat(value.distance)}}
					</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	import {
		formatDuration
	} from '../../utils/formatDuration.js'
	import {
		formatDistance
	} from '../../utils/formatDistance.js'
	export default {
		name: 'RouteLine',
		props: {
			routes: {
				type: Array,
				default: () => {
					return []
				}
			},
			modeCat: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				stepsArr: [],
				currentIndex: 0
			}
		},
		watch: {
			routes(newVal) {
				console.log(newVal)
				this.walkingSteps()
				this.walkingDirection(newVal[this.currentIndex])
			}
		},
		methods: {
			durationFormat(duration) {
				return formatDuration(duration)
			},
			distanceFormat(distance) {
				return formatDistance(distance)
			},
			walkingSteps() {
				this.stepsArr = []
				this.routes.forEach(ele => {
					let arr = []
					ele.steps.forEach(ele1 => {
						let obj = {}
						obj.act_desc = ele1.act_desc
						obj.distance = ele1.distance
						obj.road_name = ele1.road_name
						arr.push(obj)
					})
					this.stepsArr.push(arr)
				})
				console.log(this.stepsArr)
			},
			walkingDirection(value) {
				uni.$emit('routePolyline', value)
			}
		}
	}
</script>

<style scoped>
	.rl-rl {
		margin-right: 1rem;
	}
	.rl-img {
		width: 40rpx;
		height: 40rpx;
		position: relative;
		margin-top: .6rem;
	}

	.rl-step {
		display: flex;
		margin-bottom: 1rem;
		position: relative;
	}

	.rl-road-name, .rl-dis {
		margin-left: 1rem;
	}
	.rl-dis {
		font-size: .9rem;
	}
	.rl-distance {
		margin-left: 2rem;
	}

	.rl-head {
		display: flex;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.rl-info {
		display: flex;

	}
</style>
