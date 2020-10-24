<template>
	<view class="index">
			<map :latitude="centerLatitude" :longitude="centerLongitude" :style="{'width': mapWidth,'height':mapHeight}" :subkey="mapKey"
		 :markers="markers" layer-style="1" :polyline="polyline" :scale="scale" :show-location="showLocation" :circles="circles"
		 :show-compass="showCompass" :enable3D="enable3D" @tap="tapMap" @callouttap="tapCallout" @controltap="controltap"
		 :enable-traffic="enableTraffic" :enable-satellite="enableSatellite" @regionchange="regionchange"
		 id='map'>
			</map>		
		
		<view class="index-desc">
			<description :addressInfo="addressInfo" :distance="distance" :duration="duration" :markers="markers"/>
		</view>

		<uni-popup type="bottom" animation="true" maskClick="true" ref="popupSearch">
			<search :mapKey="mapKey" :QQMapWX="QQMapWX" :region="region" />
		</uni-popup>

	</view>
</template>

<script>
	let QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
	import Description from '../../components/Description/Description.vue'
	import Search from '../../components/Search/Search.vue'
	import RoutePlan from '../RoutePlan/RoutePlan.vue'
	import uniPopup from '../../components/uni-popup/uni-popup.vue'
	export default {
		components: {
			Description,
			Search,
			uniPopup,
			RoutePlan,
		},
		data() {
			return {
				qqMap: null,
				mapCtx: null,
				mapKey: 'YABBZ-YFMKF-DWBJJ-NN44U-RUZVJ-YIBRB',
				width: 100,
				height: 82,
				searchPage: false,
				timer: null,

				chooseFlag: false,
				startChange: false,
				endChangeFlag: false,
				centerFlag: true,
				getLocationFlag: false,
				
				region: '',
				mode: 'driving',

				latitude: null, //初始化位置
				longitude: null,

				centerLatitude: null, //地图中心位置
				centerLongitude: null,

				endLatitude: null, //终点位置
				endLongitude: null,

				directionPolyLine: null, //导航折线
				distance: null, //标记点距离
				duration: null, //标记点时间

				showCompass: false, //指南针
				showLocation: true, //
				enable3D: false, //
				scale: 16, //当前
				enableTraffic: false,
				enableSatellite: false,

				markers: [],
				polyline: [],
				circles: [],
				circlesId: [],
				addressInfo: {},
			}
		},
		computed: {
			mapWidth() {
				return `${this.width}vw`
			},
			mapHeight() {
				return `${this.height}vh`
			},
		},
		onLoad() {
			let that = this
			this.qqMap = new QQMapWX({
				key: that.mapKey
			});
			this.mapCtx = wx.createMapContext("map")
			this.getLocation()
			this.toggleFlag()
			this.routePolyline()
			this.searchLc()
			this.updateLocation()
			this.choosePosition()
			this.positionChange()
			this.toggleMode()
			this.controls()
			this.endChange()
			this.exchangePosition()
		},
		methods: {
			getLocation(center = true, reverse = true) {
				let that = this
				
				uni.getLocation({
					type: 'gcj02',
					success(data) {

						that.latitude = data.latitude
						that.longitude = data.longitude

						getApp().globalData.startLatitude = data.latitude
						getApp().globalData.startLongitude = data.longitude
					

						if (center) {
							that.centerLatitude = data.latitude
							that.centerLongitude = data.longitude
						}

						that.getLocationFlag = true
						
						if(reverse){
							that.reverseGeocoder(data.latitude, data.longitude, true)
						}else {
							that.reverseGeocoder(data.latitude, data.longitude, false, true)
						}
								
					},
					fail(res) {
						console.log(res)
					},
				})
			},
			tapMap(e) {
				if (this.chooseFlag) {
					this.latitude = e.detail.latitude
					this.longitude = e.detail.longitude

					getApp().globalData.startLatitude = this.latitude
					getApp().globalData.startLongitude = this.longitude
					
					this.changeMarkersStart(this.latitude, this.longitude)
					
					this.reverseGeocoder(this.latitude, this.longitude, false, true)
					this.calculateDistance(this.mode, {
						latitude: this.latitude,
						longitude: this.longitude
					}, {
						latitude: this.endLatitude,
						longitude: this.endLongitude
					})
					this.direction(this.mode)
					this.chooseFlag = false
					uni.$emit('changeFlag', false) //Search 监听

				} else {
					this.locationAssignment(e)
					// this.createMarkersItem(e)
					this.createMarkersIcon(e)
					this.reverseGeocoder(this.endLatitude, this.endLongitude)
					// this.direction(this.mode)
					this.calculateDistance(this.mode, {
						latitude: this.latitude,
						longitude: this.longitude
					}, {
						latitude: this.endLatitude,
						longitude: this.endLongitude
					})
				}
			},
			tapCallout(e) {
				console.log(e)
			},
			controltap(e) {
				console.log(e)
			},
			createMarkersIcon(e){
				let markersItem = {
					latitude: e.detail.latitude,
					longitude: e.detail.longitude,
					id: e.timeStamp,
					iconPath: '/static/markerIcon.png',
					width: 30,
					height: 30
				}
				let length = this.markers.length
				switch(length){
					case 0: 
						this.markers.splice(0, 0, markersItem)
						break;
					case 1:
						this.markers.splice(0, 1, markersItem)
						break;
					case 2:
						this.markers.splice(2, 0, markersItem)
						break;
					case 3:
						this.markers.splice(2, 1, markersItem)
						break;
				}
				console.log(this.markers)
			},
			createMarkersStart(){
				let start = {
					latitude: getApp().globalData.startLatitude,
					longitude: getApp().globalData.startLongitude,
					id: 0,
					iconPath: '/static/start.png',
					width: 30,
					height: 30
				}
				this.markers.push(start)
			},
			createMarkersEnd(){
				let end = {
					latitude: getApp().globalData.endLatitude,
					longitude: getApp().globalData.endLongitude,
					id: 1,
					iconPath: '/static/end.png',
					width: 30,
					height: 30
				}
				this.markers.push(end)
			},
			changeMarkersStart(startLatitude, startLongitude){

				let start = {
					latitude: startLatitude,
					longitude: startLongitude,
					id: new Date().getTime(),
					iconPath: '/static/start.png',
					width: 30,
					height: 30
				}
				
			
				this.markers.splice(0, 1, start)
				
			},
			changeMarkersEnd(endLatitude, endLongitude){
				let end = {
					latitude: startLatitude,
					longitude: startLongitude,
					id: new Date().getTime(),
					iconPath: '/static/end.png',
					width: 30,
					height: 30
				}
				this.markers.splice(1, 1, end)
				console.log(this.markers)
			},
			direction(mode) {
				let that = this
				let qqMapDirection = this.qqMap.direction({
					mode: mode,
					sig: 'XuLbBwOMlClyCEpf1badIjZJx8BzTdA8',
					from: {
						latitude: that.latitude,
						longitude: that.longitude
					},
					to: {
						latitude: that.endLatitude,
						longitude: that.endLongitude
					},
					success(res) {
						uni.$emit('routePolyline', res.result.routes[0])
					},
					fail(err) {
						console.log(err)
					}
				})

			},
			reverseGeocoder(latitude, longitude, center = false, flag = false) {
				let that = this;
				let reverseGeocoder = this.qqMap.reverseGeocoder({
					location: {
						latitude: latitude,
						longitude: longitude,
					},
					get_poi: 1,
					sig: 'XuLbBwOMlClyCEpf1badIjZJx8BzTdA8',
					success(res) {
						that.addressInfo = res.result;
						if (flag) {
							getApp().globalData.outsetTitle =
								res.result.formatted_addresses.recommend;
						} else {
							getApp().globalData.destinationTitle =
								res.result.formatted_addresses.recommend;

							if (center) {
								that.region = res.result.address_component.city;
							}
						}
					},
				});
			},
			calculateDistance(mode, fromLc, toLc) {
				let that = this
				let calculateDistance = this.qqMap.calculateDistance({
					mode: 'driving',
					sig: 'XuLbBwOMlClyCEpf1badIjZJx8BzTdA8',
					from: {
						latitude: fromLc.latitude,
						longitude: fromLc.longitude
					},
					to: [{
						location: {
							lat: toLc.latitude,
							lng: toLc.longitude
						}
					}],
					success(res) {
						that.distance = res.result.elements[0].distance
						that.duration = res.result.elements[0].duration
					},
					fail(err) {
						console.log(err)
					}
				})

			},
			toggleFlag() {

				uni.$on('toggleSearch', data => {
					if (data.searchFlag) {
						this.$refs.popupSearch.open()
					} else {
						this.$refs.popupSearch.close()
					}
				}) //监听Description RoutePosition Search

			},
			searchLc() {
				uni.$on('searchLc', data => {
					
					this.markers = []
					this.polyline = []
					this.getLocation(false, false)
					
					if (this.startChange) {
						console.log('startChange为true')
						this.latitude = data.lat
						this.longitude = data.lng
						this.centerLatitude = data.lat
						this.centerLongitude = data.lng
						getApp().globalData.startLatitude = this.latitude
						getApp().globalData.startLongitude = this.longitude

						this.changeMarkersStart(this.latitude, this.longitude)
						this.reverseGeocoder(this.latitude, this.longitude, false, true)
						this.calculateDistance(this.mode, {
							latitude: this.latitude,
							longitude: this.longitude
						}, {
							latitude: this.endLatitude,
							longitude: this.endLongitude
						})

						this.direction(this.mode)
						this.startChange = false
						this.chooseFlag = false

						uni.$emit('reducePlaceholder', true) //Search监听

						if (this.myFlag) {
							getApp().globalData.outsetTitle = '我的位置'
							this.myFlag = false
						}
						uni.$emit('changeFlag', false) //Search 监听

					} else {
						console.log('startChange为false')
						
						this.centerLatitude = data.lat
						this.centerLongitude = data.lng
						
						this.endLatitude = data.lat
						this.endLongitude = data.lng

						getApp().globalData.endLatitude = data.lat
						getApp().globalData.endLongitude = data.lng

						let e = {
							detail: {
								latitude: data.lat,
								longitude: data.lng,
							},
							timeStamp: new Date().getTime()
						}

						this.createMarkersIcon(e)
						
						if(this.endChangeFlag){
							this.direction(this.mode)
							this.endChangeFlag = false
						}
						
						this.reverseGeocoder(this.endLatitude, this.endLongitude)
						
						this.calculateDistance(this.mode, {
							latitude: this.latitude,
							longitude: this.longitude
						}, {
							latitude: this.endLatitude,
							longitude: this.endLongitude
						})
					}
					// this.includePoints()

				})
			},
			routePolyline() {
				uni.$on('routePolyline', data => {
					//监听Transit RouteLine index

					let arr = []

					if (data.mode) {
						let item = {}
						item.mode = data.mode

						item.polyline = this.unzip(data.polyline)

						arr.push(item)
					} else {
						data.steps.forEach(ele => {
							if (ele.mode === "WALKING") {
								let item = {}
								item.mode = ele.mode,
									item.polyline = this.unzip(ele.polyline)
								arr.push(item)
							}
							if (ele.mode === "TRANSIT") {
								let item = {}
								item.mode = ele.mode,
									item.polyline = this.unzip(ele.lines[0].polyline)
								arr.push(item)
							}
						})
					}

					let polylineArr = []
					arr.forEach(ele => {
						let polylineItem = {}
						let p = []
						for (let i = 0; i < ele.polyline.length; i += 2) {
							p.push({
								latitude: ele.polyline[i],
								longitude: ele.polyline[i + 1]
							})
						}
						polylineItem.points = p
						polylineItem.width = 4

						if (ele.mode === "WALKING") {
							polylineItem.color = '#11659a'
						}
						if (ele.mode === "TRANSIT") {
							polylineItem.color = '#9b1e64'
						}
						if (ele.mode === "DRIVING") {
							polylineItem.color = '#fecc11'
						}
						if (ele.mode === "BICYCLING") {
							polylineItem.color = '#fffef9'
						}
						polylineArr.push(polylineItem)
					})
					this.polyline = polylineArr
					
					this.markers = []
					this.createMarkersStart()
					this.createMarkersEnd()
					this.includePoints()
				})
			},
			unzip(polyline) {
				for (let i = 2; i < polyline.length; i++) {
					polyline[i] = polyline[i - 2] + polyline[i] / 1000000
				}
				return polyline
			},
			endChange(){
				uni.$on('endChange', data => {
					this.endChangeFlag = true
				})
			},
			locationAssignment(e) {
				this.endLatitude = e.detail.latitude
				this.endLongitude = e.detail.longitude

				getApp().globalData.endLatitude = e.detail.latitude
				getApp().globalData.endLongitude = e.detail.longitude

				this.centerLatitude = e.detail.latitude
				this.centerLongitude = e.detail.longitude
			},
			updateLocation() {
				uni.$on('updateLocation', data => {
					this.latitude = data.latitude,
						this.longitude = data.longitude

					this.reverseGeocoder(this.latitude, this.longitude, false, true) //description组件

					uni.$emit('searchLc', {
						lat: getApp().globalData.startLatitude,
						lng: getApp().globalData.startLongitude
					})


					uni.navigateTo({
						url: '../RoutePlan/RoutePlan'
					})

				}) //监听PickPoint
			},
			choosePosition() {
				uni.$on('choosePosition', data => {
					this.chooseFlag = true
				}) //监听PickPoint
			},
			positionChange() {
				uni.$on('positionChange', data => {
					if (data === 'start') {
						this.startChange = true
					}
				}) // 监听RoutePosition， 接收修改
			},
			toggleMode() {
				uni.$on('toggleMode', data => {
					this.mode = data.mode
				}) //监听 RouteNav
			},
			getScale() {
				let that = this
				this.mapCtx.getScale({
					success(res) {
						that.scale = res.scale
					}
				})
			},
			regionchange(e) {
				if (this.timer) {
					clearTimeout(this.timer)
				}
				this.timer = setTimeout(() => {
				
					if (e.type === 'end') {
						this.getScale()
						this.centerLatitude = e.target.centerLocation.latitude
						this.centerLongitude = e.target.centerLocation.longitude
					}
				}, 2000)


			},
			includePoints() {
				this.mapCtx.includePoints({
					padding: [70, ],
					points: [{
							latitude: getApp().globalData.startLatitude,
							longitude: getApp().globalData.startLongitude
						},
						{
							latitude: getApp().globalData.endLatitude,
							longitude: getApp().globalData.endLongitude
						}
					]
				})
			},
			controls() {
				uni.$on('controls', data => {
					switch (data) {
						case 'increase':
							if (this.scale === 18) {
								this.scale = 18
							} else {
								this.scale++
							}
							break;
						case 'decrease':
							if (this.scale === 5) {
								this.scale = 5
							} else {
								this.scale--
							}
							break;
						case 'satellite':
							this.enableSatellite = !this.enableSatellite
							break;
						case 'traffic':
							this.enableTraffic = !this.enableTraffic
							break;
						case 'compass':
							this.showCompass = !this.showCompass
							break;
					}
				})
			},
			exchangePosition(){
				uni.$on('exchangePosition', data => {
					
					let tempLat = getApp().globalData.startLatitude
					let tempLng = getApp().globalData.startLongitude
					
					getApp().globalData.startLatitude = getApp().globalData.endLatitude
					getApp().globalData.startLongitude = getApp().globalData.endLongitude
					this.latitude = getApp().globalData.endLatitude
					this.longitude = getApp().globalData.endLongitude
					
					getApp().globalData.endLatitude = tempLat
					getApp().globalData.endLongitude = tempLng
					this.endLatitude = tempLat
					this.endLongitude = tempLng
					
					this.direction()
					this.reverseGeocoder(this.latitude, this.longitude, false, true)
					this.reverseGeocoder(this.endLatitude, this.endLongitude, false, false)
				})
			}
		}
	}
</script>

<style scoped>
.index-desc {

}
</style>
