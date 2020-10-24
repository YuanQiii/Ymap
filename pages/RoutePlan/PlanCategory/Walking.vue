<template>
	<view>
		<route-line :routes="routes" modeCat="步行"/>
	</view>
</template>
<script>
	import RouteLine from '../../../components/RouteLine/RouteLine.vue'
	export default {
		name: 'Walking',
		props:{
			routes: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		components:{
			RouteLine
		}
	}
	
</script>
