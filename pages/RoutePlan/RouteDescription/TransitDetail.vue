<template>
	<view>
		<view class="td-my">
			<view class="td-from">起</view>
			<view class="td-title">{{outTitle}}</view>
		</view>

		<view class="td-description">
			<view v-for="(value, index) in stepsDetailArr" :key="index">

				<view v-if="value.mode === 'WALKING'" class="td-walking">
					<view class="td-walking-desc">
						步行{{distanceFormat(value.distance)}}({{durationFormat(value.duration)}})
					</view>
				</view>


				<view v-if="value.mode === 'TRANSIT'" class="td-transit">

					<view class="td-vehicle">		
						<image src="../../../static/bus.png" v-if="value.vehicle === 'BUS'" class="td-vehicle-img"></image>
						<image src="../../../static/subway.png" v-if="value.vehicle === 'SUBWAY'" class="td-vehicle-img"></image>
						<image src="../../../static/rail.png" v-if="value.vehicle === 'RAIL'" class="td-vehicle-img"></image>
					</view>

					<view class="td-station">
						
						<view class="td-station-desc">
							
							<view class="td-station-geton">
								{{value.geton.title}}
							</view>
							
							<view class="td-station-td">
								<view class="td-station-title">{{value.title}}</view>
								<view class="td-station-des">开往 {{value.destination.title}}</view>
							</view>
							
							<view class="td-station-time" v-if="value.startTime">
								<view class="td-station-startTime">
									始{{value.startTime}}- 
								</view>
								<view class="td-station-endTime"></view>
									末{{value.endTime}}
							</view>
							
							<view @click="toggleShow(index)">
								<view class="td-station-count">
									乘坐{{value.stations.length}}个站点
									<text v-if="value.stations.length > 1">
									<text v-if="stationShow[index]">
										&#9650;
									</text>
									<text v-else> 
										&#9660;
									</text>
									</text>

								</view>
								<view v-if="stationShow[index]">
									<view v-for="(value1, index1) in value.stations.slice(0, (value.stations.length - 1))" :key="index1" class="td-station-item">
										{{value1.title}}
									</view>
								</view>
							</view>
							<view class="td-station-getoff">{{value.getoff.title}}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="td-des">
			<view class="td-to">终</view>
			<view class="td-title">{{desTitle}}</view>
		</view>
	</view>
</template>

<script>
	import {
		formatDistance
	} from '../../../utils/formatDistance.js'
	import {
		formatDuration
	} from '../../../utils/formatDuration.js'
	export default {
		name: 'TransitDetail',
		props: {
			steps: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		data() {
			return {
				stepsDetailArr: [],
				stationShow: [],
				desTitle: '',
				outTitle: '我的位置'
			}
		},
		created() {
			this.desTitle = getApp().globalData.destinationTitle
			this.outTitle = getApp().globalData.outsetTitle
		},
		computed: {
			flag() {
				if (this.steps.length) {
					this.stepsDetail(this.steps)
					this.initStationShow(this.steps)
				}
			}
		},
		methods: {
			stepsDetail(value) {
				let detail = []
				value.forEach(ele => {
					if (ele.mode === "WALKING") {
						let walking = {}
						walking.mode = ele.mode
						walking.distance = ele.distance
						walking.duration = ele.duration
						walking.polyline = ele.polyline
						detail.push(walking)
					}
					if (ele.mode === "TRANSIT") {
						let transit = {}
						transit.mode = ele.mode
						transit.getoff = ele.lines[0].getoff
						transit.geton = ele.lines[0].geton
						transit.stations = ele.lines[0].stations
						transit.destination = ele.lines[0].destination
						transit.polyline = ele.lines[0].polyline
						transit.vehicle = ele.lines[0].vehicle
						transit.title = ele.lines[0].title
						transit.startTime = ele.lines[0].start_time
						transit.endTime = ele.lines[0].end_time
						detail.push(transit)
					}
				})
				this.stepsDetailArr = detail
			},
			durationFormat(duration) {
				return formatDuration(duration)
			},
			distanceFormat(distance) {
				return formatDistance(distance)
			},
			initStationShow(value) {
				let arr = []
				arr.length = value.length
				arr.fill(false)
				this.stationShow = arr
			},
			toggleShow(index) {
				let flag = this.stationShow[index]			
				this.stationShow.splice(index, 1, !flag)
			},
		}
	}
</script>

<style scoped>
	.td-des {
		display: flex;
	}
	.td-to {
		text-align: center;
		line-height: 1.5rem;
		height: 1.5rem;
		width: 1.5rem;
		border-radius: 1.5rem;
		background-color: #a7535a;
		margin-left: 2.75rem;
	}
	.td-station-getoff {
		margin-bottom: 1rem;
		font-size: 1.2rem;
		margin-top: 1rem;
	}
	.td-station-item {
		margin-top: .3rem;
	}
	.td-station-count {
		margin-top: .5rem;
	}
	.td-station-time {
		display: flex;
		margin-top: .5rem;
	}
	.td-station-title {
		border: solid 1rpx #9b1e64;
		margin-right: 1rem;
		padding: .3rem;
	}
	.td-station-td {
		display: flex;
		align-items: center;
		margin-top: .5rem;
		font-size: .9rem;
	}
	.td-station-geton {
		font-size: 1.2rem;
		margin-bottom: 1rem;
	}
	.td-station-desc {
		margin-left: 1.5rem;
	}
	.td-station {
		display: flex;
		border-left: solid .2rem #9b1e64;
		margin-left: 1.18rem;
	}

	.td-vehicle {
		margin-left: 1rem;
	}

	.td-vehicle-img {
		width: 40rpx;
		height: 40rpx;
	}

	.td-transit {
		display: flex;
		align-items: center;
	}

	.td-walking-desc {
		margin: 1rem;
		margin-left: 1.5rem;
	}

	.td-walking {
		display: flex;
		align-items: center;
		border-left: solid .2rem #11659a;
		margin: 1rem 0;
		margin-left: 3.4rem;
	}

	.td-from {
		text-align: center;
		line-height: 1.5rem;
		height: 1.5rem;
		width: 1.5rem;
		border-radius: 1.5rem;
		background-color: #1ba784;
		margin-left: 2.25rem;
	}

	.td-title {
		margin-left: 1rem;
		font-size: 1.2rem;
	}

	.td-my {
		display: flex;
		margin: 0 .5rem;
	}
	.td-description {
		font-size: .9rem;
	}
</style>
