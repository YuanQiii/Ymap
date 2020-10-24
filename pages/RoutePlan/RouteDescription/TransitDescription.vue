<template>
		<view class="td-lines">
			<view class="td-lines-title">
				<view class="td-title">{{linesTitle(value)}}</view>
			</view>
			<view class="td-lines-descripton">
				<view class="td-duration">{{durationFormat(value.duration)}}</view>
				<view class="td-dl">-</view>
				<view class="td-distance">{{distanceFormat(value.distance)}}</view>
				<view class="td-dl">-</view>
				<view class="td-walking-distance">{{walkingDistance(value)}}</view>
<!-- 				<view class="td-dl">-</view>
				<view class="td-price">{{linesPrice(value)}}</view> -->
			</view>
		</view>
</template>

<script>
	import {
		formatDuration
	} from '../../../utils/formatDuration.js'
	import {
		formatDistance
	} from '../../../utils/formatDistance.js'
	export default {
		name: 'TransitDescription',
		props: {
			value: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		methods: {
			walkingDistance(value) {
				let distance = 0
				value.steps.filter(ele => {
					return ele.mode === "WALKING"
				}).forEach(ele => {
					distance += ele.distance
				})
				let res = formatDistance(distance)
				return `步行${res}`
			},
			linesTitle(value) {
				let title = []
				
				value.steps.filter(ele => {
					return ele.mode === "TRANSIT"
				}).forEach(ele1 => {
					let t = []
					ele1.lines.forEach(ele2 => {
						t.push(ele2.title)
					})
					t	= t.slice(0, 2)
					t = t.join(' / ')
					title.push(t)
				})
		
				return title.join(' --> ')
			},
			linesPrice(value) {
				let price = []
				value.steps.filter(ele => {
					return ele.mode === "TRANSIT"
				}).forEach(ele1 => {
					let p = []
					ele1.lines.forEach(ele2 => {
						// p.push(ele2.price/100)
						p.push(ele2.price)
					})
					p = p.slice(0, 2)
					p = p.join('/')
					price.push(p)
				})
				return `(${price.join('->')})元`
			},
			durationFormat(duration) {
				return formatDuration(duration)
			},
			distanceFormat(distance) {
				return formatDistance(distance)
			}
		}
	}
</script>

<style scoped>
	.td-dl {
		margin: 0 .5rem;
	}
	
	.td-title {
		font-size: 1rem;
		margin-bottom: .5rem;
	}
	
	.td-lines-descripton {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 1rem;
		font-size: .9rem;
	}
</style>
