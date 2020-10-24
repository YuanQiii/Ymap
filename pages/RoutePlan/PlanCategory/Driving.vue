<template>
	<view>
		<route-line :routes="routes" modeCat="行驶"/>
	</view>
</template>

<script>
	import RouteLine from '../../../components/RouteLine/RouteLine.vue'
	export default {
		name: 'Driving',
		components:{
			RouteLine
		},
		props:{
			routes: {
				type: Array,
				default: () => {
					return []
				}
			}
		}
	}
</script>

<style scoped>
</style>
