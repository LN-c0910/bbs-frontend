<template>
	<el-container>
		<div id="c"></div>
		<login @setStatus="getStatus" 
		@closeAll="closeAllModal"
		 @closeLogin="closeLoginModal"
		  @closeReg="closeRegModal"
		  @sendFace="getFace"
		 v-bind:allswitch="allVisable"
		  v-bind:loginswitch="loginModal"
		   v-bind:regswitch="regModal"
		   v-bind:face="circleUrl"></login>
		<el-drawer size="100%" title="主题内容" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
			<el-form ref="form" label-width="80px">
				<el-form-item label="板块选择">
					<el-select v-model="deliverSection" placeholder="请选择板块" style="padding: 10px;">
						<el-option v-for="(item,index) in sectionInfo" :key="index" :label="item.section_name" :value="item.section_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="帖子标题">
					<el-col :span="14">
						<el-input v-model="inputTopicTitle" maxlength="20" show-word-limit placeholder="请输入标题">
						</el-input>
					</el-col>
					<el-button type="primary" @click="sendTopicContent" style="margin-left: 0.2em;">发表</el-button>
					<el-button type="warning" @click="clearContent" style="margin-left: 0.2em;">清空</el-button>
				</el-form-item>
			</el-form>
			<ed @input="getContent" @picArr="getPicArr" v-bind:isClear="clearTopic"></ed>
		</el-drawer>
		<el-aside width="250px" class="left">
			<img src="../assets/logo2.png" alt="" style="width: 130px;height: 60px;">
			<el-col>
				<el-card shadow="hover" :body-style="{'padding': '5px'}">
					<img src="../assets/logo.png" alt="" width="30">
					<span class="sectionTitle" @click="goSection('index')" v-text="'首页'"></span>
					<span class="topicNum">
						<el-tag size="mini" v-text="totalTopic" type="danger" effect="dark"></el-tag>
					</span>
				</el-card>
				<el-divider></el-divider>
			</el-col>
			<el-col v-for="(item,index) in sectionInfo" :key="index">
				<el-card shadow="hover" :body-style="{'padding': '5px'}">
					<img :src="$imgApi+item['section_img']" alt="" width="30">
					<span class="sectionTitle" @click="goSection(item['section_id'])" v-text="item['section_name']"></span>
					<span class="topicNum">
						<el-tag size="mini" v-text="item['section_topic']" type="danger" effect="dark"></el-tag>
					</span>
				</el-card>
				<el-divider></el-divider>
			</el-col>
		</el-aside>
		<el-container>
			<el-button class="myShow" v-show="!show2" @click="show2 = !show2" size="mini" icon="el-icon-user-solid" title="显示个人信息"
			 circle></el-button>
			<el-header class="sectionTitle_row" style="height: auto;">
				<el-row class="titlerow">
					<el-image class="section_img" style="width: 70px; height: 70px" :src="url" fit="fit"></el-image>
					<h1 class="section_title" v-text="section_row_title"></h1>
					<p style="line-height: 70px;margin-left: 2em;color: #666;"><i class="el-icon-s-management" style="margin: 0 10px;"></i>主题数：<span
						 v-text="section_row_topic"></span></p>
					<p v-if="section_row_title!='首页'" style="line-height: 70px;margin-left: 2em;color: #666;"><i class="el-icon-s-management"
						 style="margin: 0 10px;"></i>点击率：<span v-text="section_row_click"></span>
					</p>
					<p style="line-height: 70px;margin-left: 2em;">
						<el-button @click="addTopic_btn" type="success" size="small">发帖</el-button>
					</p>

					<p style="line-height: 70px;margin-left: 1em;">
						<el-input size="small" placeholder="请输入关键词" v-model="keyword"></el-input>
					</p>
					<p style="line-height: 70px;margin-left: 0em;">
						<el-button type="primary" size="small" @click="goSearch(keyword)">搜索</el-button>
					</p>
				</el-row>
			</el-header>
			<router-view :key="key" />
			<el-footer class="editor">
				Copyright © 2021 信管1701-管理信息系统开发小组. Some rights reserved.
			</el-footer>
		</el-container>
		<transition name="el-zoom-in-center">
			<el-aside width="180px" v-show="show2" class="right">
				<el-button class="myClose" size="mini" icon="el-icon-close" title="隐藏个人信息" circle @click="show2 = !show2"></el-button>
				<el-avatar :size="80" :src="circleUrl"></el-avatar>
				<div class="no_login" v-show="!loginst">
					<p>未登录</p>
					<p>
						<el-row>
							<el-button size="mini" type="primary" @click="openLogin">登录</el-button>
							<el-button size="mini" type="success" @click="openReg">注册</el-button>
						</el-row>
					</p>
				</div>
				<div class="login" v-show="loginst">
					<p>{{userInfo['uname']}}</p>
					<p>
						<el-tag size="mini" type="warning">{{role}}</el-tag>
					</p>
					<p>用户积分：{{userInfo['upoint']}}</p>
					<p>
						<i style="display: block;font-size: 25px;" class="el-icon-s-management"></i>
						主题数: <span>{{userInfo['utopic']}}</span>
					</p>
					<p><i style="display: block;font-size: 25px;" class="el-icon-s-order"></i>
						发帖数: <span>{{userInfo['ureply']}}</span></p>
					<p><i class="el-icon-s-comment"></i>收到评论({{userInfo['unewreply']}})</p>
					<p><i class="el-icon-message-solid"></i>收到私信({{userInfo['unewmsg']}})</p>
					<p><router-link to="/person"><i class="el-icon-star-on"></i>我的收藏</router-link></p>
					<p><router-link to="/person"><i class="el-icon-s-custom"></i>个人信息</router-link></p>
					<p>
						<el-row>
							<el-button size="mini" type="warning" @click="logout">退出 </el-button>
						</el-row>
					</p>
				</div>
			</el-aside>
		</transition>
	</el-container>
</template>

<script>
	import ed from '../components/Editor'
	import login from './Login.vue'
	import config from '../../config.js'
	export default {
		name: 'indexFrame',
		data: () => ({
			picArr: [],
			inputTopicTitle: "",
			clearTopic: false,
			loginModal: false,
			regModal: false,
			allVisable: false,
			inputTopic: "",
			timer: null,
			section_row_title: "首页",
			section_row_topic: "",
			section_row_click: "",
			deliverSection: "",
			keyword: "",
			totalTopic: 99,
			screenWidth: '',
			failed: 0,
			drawer: false,
			direction: 'btt',
			gapTime: null,
			websock: null,
			sectionids: [],
			url: require('../assets/logo.png'),
			show2: true,
			circleUrl: require('../assets/logo.png'),
			loginst: false,
			defaultPersonImg: "",
			userInfo: null,
			sectionInfo: []
		}),
		components: {
			ed,
			login
		},
		computed: {
			role() {
				if (this.userInfo.roleid == 1) {
					return "管理员";
				} else if (this.userInfo.roleid == 2) {
					return "注册用户"
				} else {
					return "访客";
				}
			},
			// 解决切换路由不刷新的问题
			key(){
				return this.$route.path+Math.random()
			}
		},
		methods: {
			//获取用户信息
			getUserInfo() {
				this.$http.get({
					url: "/api/getUser",
					headers: {
						'token': this.$user.user_token
					}
				}).then((data) => {
					console.log(data);
				}).catch((e) => {
					console.log(e);
				})
			},
			//获取登录状态
			getStatus(setStatus) {
				this.loginst = setStatus;
			},
			addTopic_btn() {
				if (localStorage.getItem('login')) {
					this.drawer = true;
				} else {
					this.warningMsg('请先登录!', 'warning');
				}

			},
			//登出并清除用户信息
			logout() {
				//发送板块点击次数
				this.clear();
				//清除登录状态和用户信息
				this.$clearUserInfo();
				this.loginst = false;
				this.$clearLogin();
				//停止ajax轮询
				this.circleUrl = require('../assets/logo.png')
				clearTimeout(this.timer);
				this.$message({
					message: '账号已注销!',
					type: 'success',
					showClose: true,
					duration: 2000
				});
			},
			closeLoginModal(closeAll, closeLogin, closeReg) {
				this.allVisable = closeAll;
				this.loginModal = closeLogin;
				this.regModal = closeReg;
			},
			closeAllModal(closeAll, closeLogin, closeReg) {
				this.allVisable = closeAll;
				this.loginModal = closeLogin;
				this.regModal = closeReg;
			},
			closeRegModal(closeAll, closeLogin, closeReg) {
				this.allVisable = closeAll;
				this.loginModal = closeLogin;
				this.regModal = closeReg;
			},
			//弹窗
			warningMsg(msg, type) {
				this.$message({
					message: msg,
					type: type,
					showClose: true,
					duration: 2000
				});
			},
			//发帖关闭提示
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
					})
					.catch(_ => {});
			},
			getContent(content) {
				this.inputTopic = content;
			},
			getPicArr(picArr) {
				this.picArr = picArr;
			},
			//发表帖子
			sendTopicContent() {
				let that = this;
				if (that.deliverSection == "" || that.deliverSection == null) {
					that.warningMsg("请选择所在板块", "warning");
					return;
				}

				if (that.inputTopicTitle == "" || that.inputTopicTitle == null) {
					that.warningMsg("请输入标题", "warning");
					return;
				}
				if (that.inputTopic == "" || that.inputTopic == null) {
					that.warningMsg("请输入内容", "warning");
					return;
				}
				that.$http.post("/topic", this.$qs.stringify({
						user_token: localStorage.getItem("user_token"),
						tsid: that.deliverSection,
						ttopic: that.inputTopicTitle,
						tcontent: that.inputTopic
					}))
					.then(({
						data
					}) => {
						that.warningMsg(data.msg, "success");
						that.$router.go(0);
					}).catch((e) => {
						that.warningMsg(e.response.data.msg, "error");
					})
			},
			//清空内容
			clearContent() {
				this.clearTopic = true;
			},
			//ajax轮询实现实时更新回复和消息数, 后续改进为webSocket长连接实时刷新
			//初始30秒一次，10次无响应后每一次访问间隔增加2秒
			update(interval) {
				clearTimeout(this.timer);
				let token = window.localStorage.getItem("user_token");
				interval = interval || 30000;
				let that = this;
				that.timer = setTimeout(function() {
					if (!localStorage.getItem('login')) return false;
					that.$http.post('/getMsgAndReplyNum/' + that.userInfo['uid'],
						that.$qs.stringify({
							"user_token": token
						})
					).then(res => {
						if (res.status == 200) {
							that.userInfo['unewreply'] = res.data.unewreply;
							that.userInfo['unewmsg'] = res.data.unewmsg;
							that.update();
						}
					}).catch((e) => {
						console.log(e);
						if (++that.failed < 10) {
							interval = interval + 2000;
							that.update(interval);
						} else {
							clearTimeout(that.timer);
						}
					})

				}, interval);
			},
			openLogin() {
				this.loginModal = true;
				this.regModal = false;
				this.allVisable = true;
			},
			openReg() {
				this.loginModal = false;
				this.regModal = true;
				this.allVisable = true;
			},
			getFace(face){
				this.circleUrl = face;
			},
			getSectionInfo() {
				this.$http.get("index").then(({
					data
				}) => {
					this.sectionInfo = data.sectionInfo;
					this.totalTopic = data.totalTopic;
					this.getRouteParams();
					this.sectionInfo.map(item => {
						this.sectionids.push(item["section_id"])
					})
				});

			},
			getRouteParams() {
				let section_id = this.$route.params.section_id;
				if (section_id == "index") {
					this.section_row_title = "首页";
					this.section_row_topic = this.totalTopic;
					return;
				}
				this.sectionInfo.map(item => {
					if (item['section_id'] == section_id) {
						this.section_row_title = item['section_name'];
						this.section_row_topic = item['section_topic'];
						this.section_row_click = item['section_click'];
					}
				})
			},

			goSection(section_id) {
				this.$router.push({
					path: `/index/section/${section_id}`,
				});
				this.getRouteParams();
			},
			goSearch(keyword){
				if (keyword.trim()==""){
					this.warningMsg("请输入关键词查询","warning");
					return;
				}
				this.$router.push({
					path:`/index/search_list?w=${keyword}`
				});
			},
			beforeunloadHandler() {
				this.beforeUnloadTime = new Date().getTime();
			},
			//发送板块点击次数
			clear() {
				this.sectionids.map(item => {
					this.$http.post("section/addclick",
						this.$qs.stringify({
							"section_id": item,
							"count": localStorage.getItem("sid" + item)
						})
					)
				})
			},
			//关闭浏览器前发送板块点击次数
			unloadHandler() {
				clearTimeout(this.timer);
				this.gapTime = new Date().getTime() - this.beforeUnloadTime;
				//判断是窗口关闭还是刷新
				if (this.gapTime <= 5) {
					this.clear();
					this.$clearClick(this.sectionids);
					this.$clearUserInfo();
				}
			},
			//TODO:
			//从img标签中读取src内容，
			//当发表成功时，将添加的图片src信息(旧)和从最终发表内容提取的src信息(新)发送到服务器
			//将新旧图片src数组比较，获取多出的图片并删除
			//该功能时间原因未做
			getimgs($str) {
				$imgArray = array();
				$pattern = "/<[img|IMG].*?src=[\'|\"](.*?(?:[\.gif|\.jpg]))[\'|\"].*?[\/]?>/";
				preg_match_all($pattern, $str, $match);
				for ($i = 0; $i < count($match[1]); $i++) {
					array_push($imgArray, substr($match[1][$i], 16));
				}
				return $imgArray;
			},
			
		},
		destroyed() {
			window.removeEventListener('beforeunload', e => this.unbefloadHandler(e))
			window.removeEventListener('unload', e => this.unloadHandler(e))

		},
		mounted() {
			this.screenWidth = document.body.clientWidth;
			window.onresize = () => {
				return (() => {
					this.screenWidth = document.body.clientWidth;
				})();
			};
			this.getSectionInfo();
			window.addEventListener('beforeunload', e => this.beforeunloadHandler(e));
			window.addEventListener('unload', e => this.unloadHandler(e));
			// this.getUserInfo();
			this.circleUrl = config.face+JSON.parse(localStorage.getItem('userInfo'))['uface'];
		},
		watch: {
			 '$route' (to, from) { //监听路由是否变化
			     if(this.$route.params.section_id){// 判断条件1  判断传递值的变化
			         this.getSectionInfo(); 
			     }
			  } ,
			loginst(val) {
				console.log(val);
				if (val) {
					this.failed = 0;
					this.update();
					this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
				} else {
					this.$clearUserInfo();
					clearTimeout(this.timer);
				}

			},
			screenWidth(val) {
				if (val <= 700) {
					this.show2 = false;
				} else {
					this.show2 = true;
				}
			},
			inputTopic(val) {
				if (val) {
					this.clearTopic = false;
				}
			}
		},
		created() {
			this.getSectionInfo();
			if (!localStorage.getItem('userInfo')) {
				this.userInfo = this.$user.userInfo;
				this.loginst = false;
			} else {
				this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
				this.loginst = localStorage.getItem('login');
			}

			if (this.loginst) {
				this.update();
			}
		}

	}
</script>

<style scoped="scoped">
	#c {
		pointer-events: none;
		background-image: linear-gradient(-225deg, #7085B690 0%, #87A7D920 50%, #DEF3F840 100%);
		opacity: 0.5;
		left: -70px;
		top: -100px;
		position: absolute;
		border-radius: 50%;
		width: 500px;
		height: 500px;
	}

	a {
		color: white;
	}

	.el-aside {
		overflow: hidden;
		color: #333;
		text-align: center;
		/* line-height: 100px; */
	}

	.titlerow>* {
		float: left;
		margin-left: 10px;
	}

	.sectionTitle_row {
		padding: 10px 30px;
	}

	.section_title {
		line-height: 70px;
		color: #fff;
		font-size: 1.5em;
	}

	body>.el-container {
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: rgb(132, 204, 201);
		transition: 0.4s;
		/* margin-bottom: 40px; */
	}

	.left {
		background-color: #00000048;
		padding: 15px;
		padding-top: 30px;
	}

	.left .el-col {
		z-index: 1;
		margin-top: 15px;
	}

	.left .el-card {

		color: #fff;
		border: none;
		cursor: default;
		margin: 0;
		padding: 0;
		z-index: 1;
		background-color: transparent;
	}

	.left img {
		width: 30px;
		float: left;
		margin-left: 5%;
	}

	.left .sectionTitle {
		cursor: pointer;
		float: left;
		margin-left: 5px;
	}

	.left .topicNum {
		float: right;
	}

	.right {
		padding-top: 15px;
		background-color: #00000015;
		font-size: 15px;
	}

	.right p {
		margin-top: 20px;
	}

	.myClose {
		background-color: transparent;
		position: absolute;
		text-align: center;
		right: 1%;
		top: 1%;
	}

	.myShow {
		background-color: transparent;
		position: absolute;
		top: 2.5%;
		right: 1%;
	}

	.el-divider {
		margin-top: 10px;
		background: linear-gradient(90deg, #ffffff10 0%, #ffffff60 30%, #fff 50%, #ffffff60 70%, #ffffff10 100%);
	}

	.el-header,
	.el-footer {
		color: #333;
		text-align: center;
		height: auto;
	}

	.el-footer {
		position: fixed;
		bottom: 0;
		left: 0;
		height: auto !important;
		font-size: 1px;
		width: 260px;
		/* border: 1px solid black; */
	}
</style>
