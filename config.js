const baseUrl = 'http://192.168.137.1:666/api'
const imgUrl = 'http://192.168.137.1:666/static/t_images/'
const faceUrl = 'http://192.168.137.1:666/static/uface/'
const config = {
	locale: 'zh-CN', // en-US, zh-CN
	url: baseUrl,
	debug: {
		http: false // http request log
	},
	api: `${baseUrl}`,
	img:`${imgUrl}`,
	face:`${faceUrl}`
}

export default config
