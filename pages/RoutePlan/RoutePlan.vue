<template>
	<view class="rp-main">
		<view v-if="refresh">
			<view class="route-position">
				<route-position />
			</view>
			<view class="route-nav">
				<route-nav />
			</view>
			<view class="rp-scroll">
				<view class="rp-route-detail">
					<route-detail />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import RouteNav from './RouteNav.vue'
	import RouteDetail from './RouteDetail.vue'
	import RoutePosition from './RoutePosition.vue'
	export default {
		name: 'RoutePlan',
		components: {
			RouteNav,
			RouteDetail,
			RoutePosition
		},
		data() {
			return {
				refresh: true
			}
		},
		created() {
			uni.$on('exchangePosition', data => {
				this.refresh = false
				setTimeout(() => {
					this.refresh = true
				},200)
			})
		}
	}
</script>

<style scoped>
	.rp-route-detail {}

	.route-position {
		left: 10rpx;
		position: fixed;
		width: 100%;
		z-index: 9;
	}

	.rp-main {
		min-height: 100vh;
		background-color: #393e46;
		color: #eeeeee;
	}

	.route-nav {
		z-index: 9;
		position: fixed;
		width: 100%;
		top: 5rem;
	}

	.rp-scroll {
		padding-top: 8rem;
		padding-bottom: 1rem;
	}
</style>
