<template>
	<view>
		<view v-if="message === '起终点距离过近'" class="error">
			起终点距离过近
		</view>

		<view v-else>
			<view v-show="descriptionShow">
				<!-- 公交路线选择 -->
				<view v-for="(value, index) in routes" :key="index">
					<view @click="transitDetail(value, index)">
						<transit-description :value="value" />
					</view>
				</view>
			</view>

			<view class="transit-lines-step" v-if="!descriptionShow">
				<view class="transit-description">
					<swiper :indicator-dots="true" :autoplay="false" :duration="500" circular="true" disable-touch="true" @change="transitChange"
					 class="transit-swiper" :current="index">
						<swiper-item v-for="(value, index) in routes" :key="index">
							<view class="swiper-item">
								<transit-description :value="value" />
							</view>
						</swiper-item>
					</swiper>
				</view>
				<transit-detail :steps="detailValue.steps" />
			</view>



		</view>
	</view>
</template>

<script>
	import TransitDescription from '../RouteDescription/TransitDescription.vue'
	import TransitDetail from '../RouteDescription/TransitDetail.vue'
	export default {
		name: 'Transit',
		components: {
			TransitDescription,
			TransitDetail
		},
		props: {
			routes: {
				type: Array,
				default: () => {
					return []
				}
			},
			message: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				descriptionShow: true,
				detailValue: null,
				index: null
			}
		},
		created() {
			this.index = getApp().globalData.transitPlanIndex
		},
		watch: {
			routes(newVal) {

				if (this.index !== null) {
					this.transitDetail(newVal[this.index], this.index)
				}
			}
		},
		methods: {
			transitDetail(value, index) {
				uni.$emit('routePolyline', value) //发送路线折线 index监听
				this.detailValue = value

				this.index = index
				getApp().globalData.transitPlanIndex = index

				this.descriptionShow = false
			},
			transitChange(e) {
				this.detailValue = this.routes[e.detail.current]
				uni.$emit('routePolyline', this.detailValue) //发送路线折线 index监听
				console.log(this.detailValue)
				getApp().globalData.transitPlanIndex = e.detail.current
			}
		}
	}
</script>

<style scoped>
	.error {
		text-align: center;
		line-height: 3rem;
	}

	.transit-swiper {
		height: 14vh;
	}

	.transit-back {
		width: 3rem;
		height: 3rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.transit-back-img {
		width: 30rpx;
		height: 30rpx;
	}
</style>
