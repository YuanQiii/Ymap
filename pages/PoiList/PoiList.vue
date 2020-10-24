<template>
	<view >
		<view v-for="(value, index) in list" :key="index" class="PoiList-main">
			<view class="PoiList-title">
				{{value.title}}
			</view>
			<view class="PoiList-desc">
				<view v-for="(item, inx) in value.desc" :key="inx" class="PoiList-item" @click="sendKey(item)">
					{{item}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'PoiList',
		data() {
			return {
				list: [{
						title: '美食',
						desc: [
							'美食', '小吃快餐', '火锅', '中餐', '西餐', '川菜', '咖啡店', '茶餐厅', '甜点饮品'
						]
					},
					{
						title: '酒店',
						desc: [
							'酒店', '快捷酒店', '星级酒店', '青年旅社', '公寓式酒店', '旅馆'
						]
					},
					{
						title: '交通出行',
						desc: [
							'加油站', '充电站', '服务区', '公交站', '地铁站', '停车场', '飞机场', '火车站', '火车票代售', '长途车站'
						]
					},
					{
						title: '景点',
						desc: [
							'景点','公园','植物园','动物园','博物馆'
						]
					},
					{
						title: '购物',
						desc: [
							'商场','便利店','超市','五金店','菜市场'
						]
					},
					{
						title: '休闲娱乐',
						desc: [
							'网吧', '洗浴', '足疗', '健身', 'KTV', '酒吧', '电影院'
						]
					},
					{
						title: '生活服务',
						desc: [
							'ATM', '公厕', '快递', '美发', '药店', '银行', '医院', '美容院'
						]
					},
				]
			}
		},
		methods:{
			sendKey(item){
				uni.$emit('poiKey', item)//发送关键词
				uni.$emit('poiFlag', true)//点击关键词关闭搜索记录
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped>
	.PoiList-title {
		margin-bottom: 1rem;
	}
	.PoiList-main {
		padding: 1rem;
		background-color: #393e46;
		color: #eeeeee;
	} 
	.PoiList-item {
		line-height: 1.4rem;
		width: 4rem;
		padding-right: 1rem;
	}
	.PoiList-desc {
		display: flex;
		flex-wrap: wrap;
	}
</style>
