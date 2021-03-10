import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

// import Layout from '@/views/IndexFrame'
// import Error from '@/views/Error'

//防止重复点击而出现重复路由的错误
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export const constantRouterMap = [{
		path: '/',
		redirect: '/index/section/index',
		component: () => import('@/views/IndexFrame'),
		children: [{
			path: '/index',
			redirect: '/index/section/index',
			component: () => import('@/views/MainContent')
		},
		{
			path: 'index/section/:section_id',
			props: true,
			component: () => import('@/views/MainContent')
		},
		{
			path: 'index/topic/:topicid',
			props: true,
			component: () => import('@/views/TopicDetails')
		},{
			path: 'index/search_list',
			props: true,
			component: () => import('@/views/SearchList')
		}]

	},
	{
		path: '*',
		redirect:'/index'
	},
	{
		path: '/404',
		component: () => import('@/views/404')
	},
	{
		path:'/person',
		component:()=>import('@/views/personInfo')
	}
]

export default new Router({
	mode: 'hash',
	scrollBehavior: () => ({
		y: 0
	}),
	routes: constantRouterMap
})
