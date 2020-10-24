<template>
	<view class="rd-main">
		<transit :routes="routes" v-if="mode === 'transit'" :message="message"/>
		<walking :routes="routes" v-if="mode === 'walking'"/>
		<bicycling :routes="routes" v-if="mode === 'bicycling'"/>
		<driving :routes="routes" v-if="mode === 'driving'"/>
	</view>
</template>

<script>
	let QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
	import Transit from './PlanCategory/Transit.vue'
	import Walking from './PlanCategory/Walking.vue'
	import Driving from './PlanCategory/Driving.vue'
	import Bicycling from './PlanCategory/Bicycling.vue'
	export default {
		name: 'RouteDetail',
		components: {
			Transit,
			Walking,
			Driving,
			Bicycling
		},
		data() {
			return {
				mode: 'transit',
				qqMap: '',
				routeFlag: false,
				routes: [],
				message: '',

				endLatitude: null,
				endLongitude: null,

				startLatitude: null,
				startLongitude: null
			}
		},
		created() {
			this.qqMap = new QQMapWX({
				key: 'YABBZ-YFMKF-DWBJJ-NN44U-RUZVJ-YIBRB'
			});
			this.toggleMode()
			this.mode = getApp().globalData.routeMode
			this.getRouteLocation()
			this.direction()
			uni.$on('routeFlag', data => {
				this.routeFlag = data
			})
		},
		
		watch: {
			routeFlag(newVal) {
				if (newVal === true) {
					this.direction()
					this.routeFlag = false
				}
			},
			mode(newVal) {
				this.getRouteLocation()
				this.direction()
			}
		},
		methods: {
			toggleMode() {
				uni.$on('toggleMode', data => {
					this.mode = data.mode
				})//监听RouteNav
			},
			getRouteLocation() {
				this.startLatitude = getApp().globalData.startLatitude
				this.startLongitude = getApp().globalData.startLongitude
					
				this.endLatitude = getApp().globalData.endLatitude
				this.endLongitude = getApp().globalData.endLongitude

			},
			direction() {
				let that = this
				this.qqMap.direction({
					mode: that.mode,
					from: {
						latitude: that.startLatitude,
						longitude: that.startLongitude
					},
					to: {
						latitude: that.endLatitude,
						longitude: that.endLongitude
					},
					success(res) {
						that.routes = res.result.routes
					},
					fail(err){
						console.log(err)
						that.message = err.message
					}
				})
			},
		}
	}
</script>

<style scoped>

	.rd-main {
		padding: 1rem .5rem;
		padding-bottom: 0;

	}
</style>
