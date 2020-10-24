<template>
	<cover-view class="search-bar">
			<uni-search-bar @confirm="search" @input="input" @cancel="cancel" :placeholder="placeholder" :radius="100" bgColor="rgba(51,51,51, .1)"
			 cancelButton="always" :cancelFlag="cancelFlag" />
			<cover-view v-if="changeFlag">
				<pick-point />
			</cover-view>
			<cover-view v-else>
				<poi />
			</cover-view>
			
			
		<history-record :hrShow="hrShow"/>
		
		<cover-view class="search-res">
			<cover-view class="res-item" v-for="(value, index) in searchResult" @click="resDirect(value.location, value)" :key="index">
				<cover-view class="res-title">
					{{value.title}}
				</cover-view>
				<cover-view class="res-address">
					{{value.address}}
				</cover-view>
			</cover-view>
		</cover-view>
	</cover-view>

</template>

<script>
	let QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
	import uniSearchBar from '../uni-search-bar/uni-search-bar.vue'
	import HistoryRecord from '../HistoryRecord/HistoryRecord.vue'
	import Poi from '../Poi/Poi.vue'
	import PickPoint from '../PickPoint/PickPoint.vue'
	export default {
		name: 'Search',
		components: {
			uniSearchBar,
			HistoryRecord,
			Poi,
			PickPoint
		},
		data() {
			return {
				qqMap: null,
				searchResult: [],
				suggestionResult: [],
				placeholder: '搜索',
				cancelFlag: false,
				hrShow: true,
				keyword: null,
				changeFlag: false
			}
		},
		props: {
			mapKey: {
				type: String,
				default: ''
			},
			region: {
				type: String,
				default: ''
			}
		},
		created() {
			let that = this
			this.qqMap = new QQMapWX({
				key: that.mapKey
			});
			this.poiKey()
			uni.$on('poiFlag', data => {
				if(data){
					this.hrShow = false
				}
			})//
			uni.$on('positionChange', data => {
				if(data === 'start'){
					this.placeholder = '输入起点'
					this.changeFlag = true
				}
			})// 监听RoutePosition
			uni.$on('closePickPoint', data => {
				this.changeFlag = data
			})// 监听PickPoint
			uni.$on('reducePlaceholder', data => {
				this.placeholder = '搜索'
			})
		},
		methods: {
			input(e) {
				
				this.keyword = e.value
				
				if (e.value === '') {
					this.searchResult = []
					this.hrShow = true
				}else {
					this.hrShow = false
				}
				
				this.getSuggestion(e)
				this.poiSearch()
				
				if(this.placeholder !== '搜索'){
					this.placeholder = '搜索'
				}
				
			},
			search(e) {
				console.log(e)
			},
			cancel() {
				uni.$emit('toggleSearch', {
					flag: false
				})//index监听
				
			},
			resDirect(location, value) {
				this.cancelFlag = !this.cancelFlag
				uni.$emit('searchLc', location)
				uni.$emit('historyRecord', value)
				
				if(this.changeFlag){
					this.changeFlag = false
				}else {
					getApp().globalData.destinationTitle = value.title
					this.getLocation(value.location)				
				}

				
			},
			getSuggestion(e) {
				let that = this
				this.qqMap.getSuggestion({
					keyword: e.value,
					region: that.region,
					sig: 'XuLbBwOMlClyCEpf1badIjZJx8BzTdA8',
					success(res) {
						that.suggestionResult = res.data
					}
				})
			},
			poiSearch(poiFlag = false){
				let that = this
				this.qqMap.search({
					keyword: that.keyword,
					sig: 'XuLbBwOMlClyCEpf1badIjZJx8BzTdA8',
					success(res){
						that.searchResult = res.data	
						if(poiFlag){
							uni.$emit('circleMark', res.data)
						}
					},
					fail(error){
						console.log(error)
					}
				})
			},
			getLocation(lc){
				let that = this

				uni.getLocation({
					type: 'gcj02',
					success(res) {
						
						getApp().globalData.startLatitude = res.latitude //路线规划起点坐标
						getApp().globalData.startLongitude = res.longitude
					
						getApp().globalData.endLatitude = lc.lat//路线规划终点坐标
						getApp().globalData.endLongitude = lc.lng
						
						uni.$emit('routeFlag', true)//发送路线flag
					}
				})

			},
			poiKey(){
				uni.$on('poiKey', data => {
					this.keyword = data
					this.placeholder = data
					this.poiSearch(true)
				})
			},
		}
	}
</script>

<style scoped>
	.res-item {
		border-bottom: solid 1px #00adb5;
	}

	.res-title {
		font-size: .9rem;
		margin-top: .3rem;
	}

	.res-address {
		font-size: .8rem;
		overflow: hidden;
		word-wrap: normal;
		text-overflow: ellipsis;
		margin-bottom: .4rem;
		margin-top: .3rem;
	}

	.search-res {
		color: #EEEEEE;
		margin-left: 1rem;
		margin-right: 1rem;
	}

	.search-bar {
		height: 90vh;
		background-color: #393e46;
		opacity: .8;
		z-index: 999;
		position: relative;
	}
</style>
