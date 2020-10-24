export function formatDuration(duration) {
	if (duration < 60) {
		return `${duration}分钟`
	} else if (duration > 60 && duration < 1440) {
		let h = Math.ceil(duration / 60)
		let m = duration % 60
		return `${h}小时${m}分钟`
	}
}
