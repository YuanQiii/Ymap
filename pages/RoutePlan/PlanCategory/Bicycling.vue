<template>
	<view>
		<route-line :routes="routes" modeCat="骑行"/>
	</view>
</template>

<script>
	import RouteLine from '../../../components/RouteLine/RouteLine.vue'
	export default {
		name: 'Bicycling',
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

<style>
</style>
