<template>
	<view>
		<cover-view class="cover-view" v-if="addressInfo.formatted_addresses.recommend">
			<cover-view class="ad-name">
				{{addressInfo.formatted_addresses.recommend}}
			</cover-view>
			<cover-view class="ad-bottom">
				<cover-view class="ad-info">
					<cover-view class="ad-distance">
						{{FmtDistance(distance)}}
					</cover-view>
					<cover-view class="ad-street">
						{{addressInfo.address_component.street}}
					</cover-view>
				</cover-view>	
			</cover-view>
			<cover-view class="ad-operate">
				<cover-view>
					<controls />
				</cover-view>
				<cover-view @click="operate('search')">
					<cover-image src="../../static/search.png" class="ad-search"></cover-image>
				</cover-view >
						<navigator url="../RoutePlan/RoutePlan" open-type="navigate" animation-type="pop-in" animation-duration="500" v-if="markers.length">
							<cover-image src="../../static/route.png" class="ad-route"></cover-image>
						</navigator>
			</cover-view>
		</cover-view>
		<cover-view class="cover-view" v-else></cover-view>
	</view>
</template>

<script>
	import {
		formatDistance
	} from '../../utils/formatDistance.js'
	import Controls from '../Controls/Controls.vue'
	export default {
		name: 'Description',
		components:{
			Controls
		},
		props: {
			addressInfo: {
				type: Object,
				default: () => {
					return {}
				}
			},
			distance: {
				type: Number,
				default: 0
			},
			duration: {
				type: Number,
				default: 0
			},
			markers: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		methods: {
			FmtDistance(value) {
				return formatDistance(value)
			},
			operate(type) {
				if (type === 'search') {
					uni.$emit('toggleSearch', {
						searchFlag: true
					})//index监听
				}
			}
		}
	}
</script>

<style scoped>
	.ad-operate {
		display: flex;
	}
	.ad-search{
		width: 40rpx;
		height: 40rpx;
		margin-top: 35rpx;
		margin-right: 1rem;
	}
	
	.ad-route {
		width: 45rpx;
		height: 45rpx;
		margin-top: 35rpx;
		margin-right: 40rpx;
	}

	.ad-bottom {
		display: flex;
		justify-content: space-between;
	}

	.cover-view {
		color: #eeeeee;
		background-color: #393e46;
		padding: 1rem 0;
		width: 100vw;
		height: 15vh;
	}

	.ad-name {
		padding: 0 1rem;
		font-size: 1.2rem;
		overflow: hidden;
		word-wrap: normal;
		text-overflow: ellipsis;
		z-index: 9;
	}

	.ad-info {
		display: flex;
		font-size: .8rem;
		margin-top: 15rpx;
	}

	.ad-distance {
		padding: 0 1rem;
		margin-top: .8rem;
		border-right: solid 1px #00adb5;
	}

	.ad-street {
		padding: 0 1rem;
		margin-top: .8rem;
	}
</style>
