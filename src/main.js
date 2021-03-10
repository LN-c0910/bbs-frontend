import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import global_ from './components/Global.vue'
import qs from 'qs'
import '../http'
//清除登录状态
function clearLoginInfo() {
	global_.user_token = null;
	global_.login = false;
	global_.userInfo = {
		'uface': null,
		'utopic': 0,
		'ureply': 0,
		'unewmsg': 0,
		'unewreply': 0,
		'collections': 0,
		'roleid': null,
		'ubirthday': null,
		'uemail': null,
		'uid': null,
		'ulastlogin': null,
		'uname': null,
		'upoint': null,
		'uregdate': null,
		'usex': null,
		'ustate': null,
		'ustatement': null
	}
}

function addUserInfo(userInfo, status, user_token, roleid) {
	localStorage['userInfo'] = JSON.stringify(userInfo);
	localStorage['login'] = status;
	localStorage['user_token'] = user_token;
	localStorage['roleid'] = roleid;
}

function clearUserInfo() {
	localStorage.clear();
}

function clearClick(sids) {
	sids.map(sid => {
		localStorage.removeItem("sid" + sid);
	})
}

function getUrlParam(name) {
	let after = window.location.search;
	after = after.substr(1) || window.location.hash.split("?")[1];
	if (after) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = after.match(reg);
		if (r != null) {
			return decodeURIComponent(r[2]);
		} else {
			return "";
		}
	}
}
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueQuillEditor)
Vue.prototype.$user = global_;
Vue.prototype.$qs = qs;
Vue.prototype.$clearLogin = clearLoginInfo;
Vue.prototype.$setUserStorage = addUserInfo;
Vue.prototype.$clearUserInfo = clearUserInfo;
Vue.prototype.$clearClick = clearClick;
Vue.prototype.$getUrlParam = getUrlParam;
Vue.prototype.$imgApi = "http://192.168.137.1:666";
new Vue({
	router,
	render: h => h(App),
}).$mount('#app')
