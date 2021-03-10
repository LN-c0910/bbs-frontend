<template>
	<el-container>
		<!-- 回复跟帖 -->
		<el-drawer :size="drawsize" title="跟帖内容" :visible.sync="drawer" :direction="direction" :before-close="handleClose">
			<el-header v-show="!showComment">当前所在位置:{{topicInfo['sname']}}->{{topicInfo['ttopic']}}</el-header>
			<el-header v-show="!showComment">
				<el-button type="primary" @click="addReply">发表</el-button>
				<el-button type="warning" @click="clearContent">清空</el-button>
			</el-header>
			<ed v-show="!showComment" @input="getContent" v-bind:isClear="clearTopic"></ed>
			<el-row v-show="showComment" style="margin-left: 20px;">
				<span>回复:{{this.fatherUname}}</span>
				<el-button type="primary" style="margin-left: 20px;" size="mini" @click="addComment">发表</el-button>
			</el-row>
			<el-main>
				<el-input v-show="showComment" type="textarea" v-model="comment"></el-input>
			</el-main>
		</el-drawer>

		<!-- 举报跟帖 -->
		<el-drawer :size="report_drawsize" title="帖子举报" :visible.sync="report_drawer" :direction="direction" :before-close="handleClose">
			<el-row style="margin-left: 20px;">
				<span>被举报人:{{this.fatherUname}}</span>

			</el-row>
			<div style="margin-left: 20px;margin-top: 20px;">
				<span>1.请选择举报类型(必选)</span>
				<el-divider><i class="el-icon-sunny"></i></el-divider>
			</div>
			<el-main>
				<div>
					<el-radio-group v-model="report_type" size="small">
						<el-radio label="10001" border>低俗色情</el-radio>
						<el-radio label="10002" border>垃圾广告</el-radio>
						<el-radio label="10003" border>内容低俗无意义</el-radio>
						<el-radio label="10004" border>辱骂攻击</el-radio>
						<el-radio label="10005" border>其他违法信息</el-radio>
						<el-radio label="10006" border>涉及未成年不良信息</el-radio>
						<el-radio label="10007" border>抄袭我的内容</el-radio>
						<el-radio label="10008" border>暴露我的隐私</el-radio>
						<el-radio label="10009" border>内容里有关我的不实描述</el-radio>
					</el-radio-group>
				</div>
			</el-main>
			<div style="margin-left: 20px;margin-top: 20px;">
				<span>2.请填写举报理由</span>
				<el-divider><i class="el-icon-moon"></i></el-divider>
			</div>
			<el-input style="width: 90%;margin: 20px;" type="textarea" placeholder="描述理由请不要超过200字" v-model="report_reason"
			 maxlength="200" show-word-limit>
			</el-input>
			<el-row style="margin-left: 20px;">
				<el-button type="danger" size="mini" @click="addReport">确认举报</el-button>
			</el-row>
		</el-drawer>
		<el-main class="scorll" style="overflow-y: auto;height: 600px;">
			<!-- 导航条 -->
			<el-header>
				<el-breadcrumb separator=">">
					<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
					<el-breadcrumb-item><a @click="toSection(topicInfo['sid'])">{{topicInfo['sname']}}</a></el-breadcrumb-item>
					<el-breadcrumb-item>{{topicInfo['ttopic']}}</el-breadcrumb-item>
				</el-breadcrumb>
			</el-header>
			<!-- 标题 -->
			<el-header v-if="topicInfo.length!=0">
				<el-row :gutter="0">
					<p style="float: left;;">
						<el-avatar :size="50" @error="errorHandler" :src="baseurl+topicInfo['uface']"></el-avatar>
					</p>
					<p style="font-size: 1.5em;float: left;margin-left: 0.8em;">{{topicInfo['ttopic']}}</p>
				</el-row>
				<el-row>
					<el-col :span="6" style="font-size: 0.5em;"><i class="el-icon-s-custom"></i>{{topicInfo['uname']}}</el-avatar>
					</el-col>
					<el-col :span="10" :offset="6" style="font-size: 0.5em;">发帖时间:{{topicInfo['ttime']}}</el-avatar>
					</el-col>
					<el-col :span="2" style="font-size: 0.5em;"><i class="el-icon-s-comment"></i>{{topicInfo['treplycount']}}</el-col>
				</el-row>
			</el-header>
			<el-divider></el-divider>
			<div class="ql-editor" style="height: auto;overflow-y: hidden;" v-html="topicInfo['tcontents']"></div>
			<el-button-group v-if="topicInfo.length!=0">
				<el-button size="mini" type="primary" icon="el-icon-star-off" @click="iwantit">收藏<span>({{topicInfo['collections']}})</span></el-button>
				<el-button size="mini" type="success" icon="el-icon-thumb" @click="ilikeit(topicInfo['tid'])">{{ilike}}({{topicInfo['tlikecount']}})</el-button>
				<el-button size="mini" type="warning" icon="el-icon-chat-dot-square" @click="talktome">评论</el-button>
				<el-button v-if="del_auth(-1)" size="mini" type="danger" icon="el-icon-delete" @click="deleteTopic">删除</el-button>
			</el-button-group>
			<el-button-group v-if="roleid==1&&topicInfo.length!=0">
				<el-button size="mini" type="success" @click="updateGood" v-text="topicInfo['good']?'取消加精':'加精'">=</el-button>
				<el-button size="mini" type="danger" @click="updateTop" v-text="topicInfo['top']?'取消置顶':'置顶'"></el-button>
				<el-button size="mini" type="warning" @click="updateForceTop" v-text="topicInfo['forcetop']?'取消首页置顶':'首页置顶'"></el-button>
			</el-button-group>
			<el-divider content-position="right">以下为回复内容:</el-divider>
			<el-card class="replylist" :class="[item['rid']==activeRid?'activeReply':'']" shadow="hover" v-for="(item,index) in replylist"
			 :key="index">
				<el-row>
					<el-avatar style="float: left;margin-left: 0.5em;" :size="30" :src="baseurl+item['uface']"></el-avatar>
					<span style="float: left;margin-left: 0.5em;font-size: 1.1em;">{{item['uname']}}</span>
					<el-tag size="small" v-if="item['rrid']!=0" style="float: left;margin-left: 0.5em;">回复:{{item['targetname']}}</el-tag>
					<span style="float: right;margin-left: 0.5em;font-size: 0.6em;">{{item['rtime']}}</span>
				</el-row>
				<el-row>
					<div class="ql-editor" style="height: auto;overflow-y: hidden;" v-html="item['rcontents']"></div>
					<el-main v-if="item['rrid']!=0">
						{{item['fatherContent']}}
						<p v-if="!item['fatherContent']"><b style="color: crimson;">该条评论已被删除</b></p>
					</el-main>
				</el-row>
				<el-row style="float: right;">
					<span v-if="del_auth(item['ruid'])" class="rtalketome cright" @click="deleteReply(item['rid'])" style="margin-right: 0.2em;">
						<el-tag type="danger" size="mini"><i class="el-icon-delete"></i>删除</el-tag>
					</span>
					<span class="rtalketome cright" @click="report(item['rid'],item['uname'])" style="margin-right: 0.2em;">
						<el-tag type="warning" size="mini"><i class="el-icon-warning-outline"></i>举报</el-tag>
					</span>
					<span class="rtalketome cright" @click="rtalketome(item['rid'],item['uname'],item['ruid'])" style="margin-right: 0.2em;">
						<el-tag type="primary" size="mini"><i class="el-icon-chat-dot-square"></i>评论</el-tag>
					</span>
					<span class="rilikeit cright">
						<el-tag type="info" size="mini" @click="rilikeit(item['rid'],index,$event)">
							<i class="el-icon-thumb"></i>
							<span :id="'relike'+item['rid']">点赞</span>
							<span :id="'relikecount'+item['rid']">({{item['rlikecount']}})</span>
						</el-tag>
					</span>
				</el-row>
				<el-divider style="background-color: #000000;"></el-divider>
			</el-card>
			<div class="block">
				<el-pagination @prev-click="prev" @next-click="next" @current-change="toCurrentPage" layout="prev, pager, next"
				 :total="total" :page-size="5">
				</el-pagination>
			</div>
		</el-main>
	</el-container>
</template>

<script>
	import config from '../../config.js'
	import ed from '../components/Editor.vue'
	export default {
		name: 'topic_details',
		props: ['topicid'],
		data: () => ({
			comment: "",
			roleid: 0,
			report_drawer: false,
			report_type: '0',
			report_drawsize: "80%",
			report_reason: "",
			drawsize: "90%",
			showComment: false,
			topicInfo: [],
			activeRid: null,
			rlikecount: 0,
			inputReply: "",
			rilike: "点赞",
			replylist: [],
			clearTopic: false,
			direction: "btt",
			drawer: false,
			//评论标记，父回复贴id
			fatherReply: 0,
			//被回复人账号
			fatherUname: "",
			//被回复人id
			fatherUid: null,
			baseurl: null,
			ilike: "点赞",
			likecount: 0,
			rtarget: null,
			inputReply: "",
			total: 50
		}),
		components: {
			ed
		},
		methods: {
			//上一页
			prev(currentPage) {
				this.getReplyInfo(currentPage);

			},
			//下一页
			next(currentPage) {
				this.getReplyInfo(currentPage);
			},
			//跳转指定页
			toCurrentPage(currentPage) {
				this.getReplyInfo(currentPage);
			},
			errorHandler() {
				return true
			},
			//富文本关闭提示
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						this.activeRid = null;
						done();
					})
					.catch(_ => {});
			},
			getTopicInfo() {
				this.$http.get("topic/" + this.topicid).
				then(({
					data
				}) => {
					this.topicInfo = data;
					console.log(data);
				}).catch((e) => {
					this.warningMsg("暂无数据", "error");
				})
			},
			toSection(sid) {
				this.$router.push({
					path: `/index/section/${sid}`
				})
			},
			warningMsg(msg, type) {
				this.$message({
					message: msg,
					type: type,
					showClose: true,
					duration: 2000
				});
			},
			getContent(content) {
				this.inputReply = content;
			},
			//清空内容
			clearContent() {
				this.clearTopic = true;
			},
			//收藏
			iwantit() {
				if (!localStorage.getItem("user_token")) {
					this.warningMsg("请先登录！", "warning");
					return false;
				}
				if (this.topicInfo.length==0||!this.topicInfo.tid){
					this.warningMsg("无法获取数据,请检查网络设置", "error");
					return false;
				}
				this.$http.post("collection",this.$qs.stringify({
					"user_token": localStorage.getItem("user_token"),
					"tid":this.topicInfo.tid
				})).then((res)=>{
					// console.log(res.data);
					if (res.data.code == '10502'){
						this.topicInfo.collections++;
					}
					this.warningMsg(res.data.msg,"success");
				}).catch((e)=>{
					this.warningMsg(e.response.data.msg,"error",);
				})
			},
			//点赞主贴请求
			//like =0 点赞-1 ，like=1 点赞加1
			likeTopic(tid, like) {
				let msg = like == 1 ? "我谢谢您!!" : "我谢谢您??";
				let type = like == 1 ? "success" : "warning";
				let likestatut = like == 1 ? "取消点赞" : "点赞";
				let localStatus = like == 1 ? "true" : "false";
				this.$http.post("topic/ilike/" + like,
					this.$qs.stringify({
						"tid": tid
					})
				).then(({
					data
				}) => {
					this.warningMsg(msg, type);
					this.ilike = likestatut;
					this.likecount++;
					localStorage.setItem("ilike" + tid, localStatus);
					this.topicInfo['tlikecount'] = data.tlikecount;
				}).catch(() => {
					this.warningMsg("网络错误,操作失败", "error");
				})
			},
			//点赞跟帖请求
			//like =0 点赞-1 ，like=1 点赞加1
			likeReply(rid, like) {
				let msg = like == 0 ? "点赞" : "取消点赞";
				this.$http.post("reply/like/" + like, this.$qs.stringify({
					"rid": rid
				})).then(({
					data
				}) => {
					// console.log(data);
					document.getElementById("relike" + rid).innerHTML = msg;
					document.getElementById("relikecount" + rid).innerHTML = data.data.rlikecount;
				}).catch((e) => {
					console.log(e);
				})
			},
			//点赞主贴
			ilikeit(tid) {
				if (this.likecount >= 4) {
					this.warningMsg("请不要频繁操作!", "error");
					return;
				}
				if (localStorage.getItem("ilike" + tid) == null ||
					localStorage.getItem("ilike" + tid) == "false") {
					this.likeTopic(tid, 1);
					return;
				}
				if (localStorage.getItem("ilike" + tid) == "true") {
					this.likeTopic(tid, 0);
					return;
				}
				// this.ilike = this.ilike=="点赞"?"取消点赞":"点赞";
			},
			//评论主贴按钮
			talktome() {
				if (!localStorage.getItem("user_token")) {
					this.warningMsg("请先登录！", "warning");
					return;
				}
				//this.topReply = 0;
				this.drawsize = "90%";
				this.showComment = false;
				this.rtarget = this.topicInfo.uid;
				this.drawer = true;
			},
			//回复跟帖按钮
			rtalketome(fatherReply, fatherUname, fatherUid) {
				if (!localStorage.getItem("user_token")) {
					this.warningMsg("请先登录", "warning");
					return;
				}
				this.showComment = true;
				this.drawsize = "30%";
				this.drawer = true;
				this.activeRid = fatherReply;
				this.fatherUid = fatherUid;
				this.fatherUname = fatherUname;
			},
			//举报跟帖按钮
			report(rid, uname) {
				if (!localStorage.getItem("user_token")) {
					this.warningMsg("请先登录", "warning");
					return;
				}
				this.report_drawer = true;
				this.activeRid = rid;
				this.fatherUname = uname;
			},
			//点赞跟帖评论
			rilikeit(rid) {
				let islike = document.getElementById("relike" + rid).innerHTML == "点赞" ? 1 : 0;
				this.likeReply(rid, islike);
			},
			getReplyInfo(page) {
				this.$http.get("reply/" + this.topicid + "/" + page)
					.then(({
						data
					}) => {
						this.replylist = data.data;
						this.total = data.total;
					}).catch((e) => {
						console.log(e);
					})
			},
			//删除帖子
			deleteTopic() {
				let that = this;
				if (!localStorage.getItem("user_token")) {
					this.warningMsg("请先登录！", "warning");
					return;
				}
				this.$http.delete("topic/" + that.topicInfo.tid, {
					data: localStorage.getItem("user_token")
				}).then(() => {
					this.warningMsg("删除成功,2秒后将刷新页面..", "success");
					setTimeout(function() {
						location.reload();
					}, 2000)
				}).catch(() => {
					this.warningMsg("权限不足", "error");
				})
			},
			//删除回复帖
			deleteReply(rid) {
				let that = this;
				if (!localStorage.getItem("user_token")) {
					this.warningMsg("请先登录！", "warning");
					return;
				}
				this.$http.delete("reply/" + rid, {
					data: localStorage.getItem("user_token")
				}).then(() => {
					this.warningMsg("删除成功,2秒后将刷新页面..", "success");
					setTimeout(function() {
						location.reload();
					}, 2000)
				}).catch((e) => {
					this.warningMsg(e.response.data.msg, "error");
				})

			},
			//发表跟帖
			addReply() {
				if (!localStorage.getItem("user_token")) {
					this.warningMsg("请先登录！", "warning");
					return;
				}
				if (this.inputReply == "") {
					this.warningMsg("请输入内容！", "warning");
					return;
				}
				this.$http.post("reply", this.$qs.stringify({
					"user_token": localStorage.getItem("user_token"),
					//"topreply":this.topReply,
					"rcontents": this.inputReply,
					"rtarget": this.rtarget,
					"rtid": this.topicInfo.tid
				})).then(({
					data
				}) => {
					this.warningMsg("发表成功", "success");
					this.reload();
				}).catch((e) => {
					this.warningMsg(e.response.data.msg, "error");
					console.log(e.response);
				})
			},
			//发表回复
			addComment() {
				let rrid = this.activeRid;
				let rtarget = this.fatherUid;
				let rcontents = this.comment;
				if (rcontents == "" || rcontents == "") {
					this.warningMsg("请输入回复内容", "warning");
					return;
				}
				if (!localStorage.getItem("user_token")) {
					this.warningMsg("请先登录！", "warning");
					return;
				}
				this.$http.post("reply", this.$qs.stringify({
					"user_token": localStorage.getItem("user_token"),
					"rcontents": rcontents,
					"rtarget": rtarget,
					"rtid": this.topicInfo.tid,
					"rrid": rrid
				})).then(({
					data
				}) => {
					this.warningMsg("发表成功", "success");
					this.reload();
				}).catch((e) => {
					this.warningMsg(e.response.data.msg, "error");
					console.log(e.response);
				})
			},
			//提交举报
			addReport() {
				let rid = this.activeRid;
				let report_type = this.report_type;
				let report_reason = this.report_reason;
				if (!localStorage.getItem("user_token")) {
					this.warningMsg("请先登录", "warning");
					return;
				}
				let uid = JSON.parse(localStorage.getItem('userInfo')).uid;
				if (report_type == '0') {
					this.warningMsg("请选择举报类型", "warning");
					return;
				}
				this.$http.post('report',this.$qs.stringify({
					'user_token':localStorage.getItem("user_token"),
					'rid':rid,
					'report_type':report_type,
					'report_reason':report_reason
				})).then(res => {
					this.warningMsg(res.data.msg,"success");
				
				}).catch(e => {
					this.warningMsg(e.response.data.msg,"warning");

				})
				console.log(rid, uid, report_type, report_reason)
			},
			//更新状态请求
			updateStatus(status, op) {
				if (!localStorage.getItem("user_token")) {
					this.warningMsg("请登录", "warning");
					return;
				}
				this.$http.post("admin/topic/" + status + "/" + this.topicInfo.tid,
					this.$qs.stringify({
						"user_token": localStorage.getItem("user_token")
					})
				).then(() => {
					this.warningMsg("操作成功", "success");
					this.topicInfo[op] = this.topicInfo[op] == 0 ? 1 : 0;
				}).catch(() => {
					this.warningMsg("权限不足", "error");
				})

			},
			updateGood() {
				let status = this.topicInfo.good == 1 ? 10404 : 10403;
				this.updateStatus(status, "good");
			},
			updateTop() {
				let status = this.topicInfo.top == 1 ? 10402 : 10401;
				this.updateStatus(status, "top");
			},
			updateForceTop() {
				let status = this.topicInfo.top == 1 ? 10406 : 10405;
				this.updateStatus(status, "forcetop");
			},
			reload() {
				this.$router.go(0);
			}

		},
		watch: {
			inputReply(val) {
				if (val) {
					this.clearTopic = false;
				}
			}
		},
		computed: {
			del_auth() {
				return function(ruid) {
					if (localStorage.getItem('userInfo') == null || this.topicInfo.uid == null) {
						return false;
					}
					if (this.roleid == 1) {
						return true;
					}
					if (this.topicInfo.uid == JSON.parse(localStorage.getItem('userInfo')).uid) {
						return true
					}
					return ruid == JSON.parse(localStorage.getItem('userInfo')).uid;
				}
			}
		},
		mounted() {
			this.getTopicInfo();
			this.getReplyInfo(1);
			this.roleid = localStorage.getItem('roleid');
		},
		created() {
			// this.getTopicInfo();
			this.baseurl = config.face;
		}
	}
</script>

<style scoped="scoped">
	.el-container {
		padding: 0 1.2em;
	}

	.replylist {
		margin-bottom: 10px;
	}

	.el-main {

		overflow: hidden;
		background-color: #FFF0FF60;
		/* border: 1px solid saddlebrown; */
		color: #333;
		text-align: center;
		/* line-height: 160px; */
		transition: 0.4s;
	}

	.el-card {
		border: none;
		cursor: default;
		margin: 0;
		padding: 0;
		background-color: transparent;
	}

	.activeReply {
		background-color: #FFFF0080;
	}

	.scorll::-webkit-scrollbar {
		/*滚动条整体样式*/
		width: 5px;
		/*高宽分别对应横竖滚动条的尺寸*/
		height: 1px;
	}

	.scorll::-webkit-scrollbar-thumb {
		/*滚动条里面小方块*/
		border-radius: 10px;
		background-color: skyblue;
		background-image: -webkit-linear-gradient(45deg,
			rgba(255, 255, 0, 0.2) 25%,
			transparent 25%,
			transparent 50%,
			rgba(255, 0, 255, 0.2) 50%,
			rgba(0, 255, 255, 0.2) 75%,
			transparent 75%,
			transparent);
	}

	.scorll::-webkit-scrollbar-track {
		/*滚动条里面轨道*/
		box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		background: #ededed;
		border-radius: 10px;
	}

	.rilikeit,
	.rtalketome {
		cursor: pointer;
	}

	.el-radio {
		margin-right: 0px !important;
	}
</style>
