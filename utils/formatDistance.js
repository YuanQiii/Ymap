export function formatDistance(distance){
	if(distance < 1000){
		return `${distance}米`
	}else {
		let res = Math.ceil(distance/100)/10
		return `${res}公里`
	}
}