<template>
	<cover-view class="hr-value" v-if="hrShow">
		<cover-view class="hr-top">
			<cover-view class="hr-head">
				<cover-view class="hr-info">
					历史记录
				</cover-view>
				<cover-view class="hr-clear" @click="clearStorage">
					<cover-image src="../../static/clear.png" class="hr-img"></cover-image>
					<cover-view class="hr-desc">清空</cover-view>
				</cover-view>
			</cover-view>
			<cover-view class="hr-bottom"></cover-view>
		</cover-view>
		<cover-view class="hr-item" v-for="(value, index) in hrValue" @click="chooseAddress(value)" :key="index">
			<cover-view class="hr-title">
				{{value.title}}
			</cover-view>
			<cover-view class="hr-address">
				{{value.address}}
			</cover-view>
		</cover-view>
	</cover-view>
</template>

<script>
	export default {
		name: 'HistoryRecord',
		data() {
			return {
				hrFlag: false,
				startLatitude: null,
				startLongitude: null,
				changeFlag: false
			}
		},
		props: {
			hrShow: {
				type: Boolean,
				default: true
			},
		},
		created() {
			this.initHrValue()
			this.historyRecord()
			this.positionChange()
		},
		computed: {
			hrValue() {
				let flag = this.hrFlag
				return uni.getStorageSync('hrValue')
			}
		},
		methods: {
			historyRecord() {
				uni.$on('historyRecord', value => {

					let addFlag = false
					let arr = uni.getStorageSync('hrValue')

					arr.unshift(value)

					if (arr.length > 1) {
						for (let i = 0; i < arr.length; i++) {
							for (let j = i + 1; j < arr.length; j++) {
								if (arr[i].id === arr[j].id) {
									arr.splice(j, 1)
									j--
								}
							}
						}
					}

				uni.setStorageSync('hrValue', arr.slice(0, 10));
					this.hrFlag = !this.hrFlag
				})
			},
			initHrValue() {
				let arr = uni.getStorageSync('hrValue')
				if (!arr) {
					uni.setStorageSync('hrValue', []);
				}
			},
			clearStorage() {
				uni.setStorageSync('hrValue', []);
				this.hrFlag = !this.hrFlag
			},
			chooseAddress(value) {
				uni.$emit('toggleSearch', {
					flag: false
				})//index 监听
				
				uni.$emit('searchLc', value.location)//index 监听
				
				if(this.changeFlag){
					uni.$emit('closePickPoint', false)//Search 监听
					this.changeFlag = false
				}else {
					getApp().globalData.destinationTitle = value.title
					this.getLocation(value.location)			
				}

			},
			getLocation(lc) {
				
				uni.getLocation({
					type: 'gcj02',
					success(res) {
						
						getApp().globalData.startLatitude = res.latitude //路线规划起点坐标
						getApp().globalData.startLongitude = res.longitude
					
						getApp().globalData.endLatitude = lc.lat//路线规划终点坐标
						getApp().globalData.endLongitude = lc.lng
						
					}
				})
			},
			positionChange(){
				uni.$on('positionChange', data => {
					this.changeFlag = true
				})//监听 RoutePosition
			}
		}
	}
</script>

<style scoped>
	.hr-item {
		margin: .3rem 1rem;
		border-bottom: solid 1px #00adb5;
	}

	.hr-address {
		margin-bottom: .5rem;
	}

	.hr-clear {
		display: flex;
		position: relative;
	}

	.hr-head {
		display: flex;
		justify-content: space-between;
		font-size: .8rem;
	}

	.hr-address {
		margin-top: .2rem;
		font-size: .7rem;
	}

	.hr-bottom {
		margin-bottom: .5rem;
	}

	.hr-top {
		margin: .3rem 1rem;
		border-bottom: solid 1rpx #00adb5;
	}

	.hr-img {
		width: 25rpx;
		height: 25rpx;
		position: relative;
		top: 5rpx;
		margin-right: .3rem;
	}

	.hr-value {
		color: #EEEEEE;
	}
</style>
