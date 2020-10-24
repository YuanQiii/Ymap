<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData: {
			startLatitude: null,//路线规划起点
			startLongitude: null,
			
			endLatitude: null,//路线规划终点
			endLongitude: null,
			
			destinationTitle: '',//终点地点名
			outsetTitle: '我的位置',//起点地点名
			 
			// transitDescShow: true,//公交方案详细路线页面展示
			transitPlanIndex: null,//公交方案已选择索引
			routeNavIndex: 0,//路线方案导航索引
			routeMode: 'transit',//路线方案模式 
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
