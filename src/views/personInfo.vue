<template>
	<el-container>
		<el-header>
			<el-page-header @back="goBack" content="个人信息">
			</el-page-header>
		</el-header>
		<el-container>
			<el-aside width="240px">
				<el-card class="box-card">
					<div class="text item">
						<el-avatar shape="square" :size="100" fit="fit" :src="'http://192.168.137.1:666/static/uface/'+userInfo['uface']">{{userInfo['uface']==null?"还没有头像":""}}</el-avatar>
						<el-tag style="z-index: 1;position: absolute;top: 140px;left: 0px; width: 100%; text-align: center;">{{userInfo['uname']}}</el-tag>
						<el-menu default-active="1"  class="el-menu-vertical-demo" @select="changeNav">				
							<el-menu-item index="1">
								<i class="el-icon-menu"></i>
								<span slot="title">个人资料</span>
							</el-menu-item>
							<el-menu-item index="2">
								<i class="el-icon-document"></i>
								<span slot="title">论坛帖子</span>
							</el-menu-item>
							<el-menu-item index="3">
								<i class="el-icon-setting"></i>
								<span slot="title">我的消息</span>
							</el-menu-item>
						</el-menu>
					</div>

				</el-card>
			</el-aside>
			<el-main>
				<userEdit v-if="currentIndex==1"></userEdit>
				<utar v-if="currentIndex==2"></utar>
				<msg v-if="currentIndex==3"></msg>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	import userEdit from './user/userInfoEdit'
	import utar from './user/topicAndReply.vue'
	import msg from './user/msg'
	export default {
		name: 'userInfo',
		data: () => ({
			userInfo: {},
			currentIndex:1
		}),
		components:{
			userEdit,utar,msg
		},
		methods: {
			goBack() {
				this.$router.go(-1);
			},
			warningMsg(msg, type) {
				this.$message({
					message: msg,
					type: type,
					showClose: true,
					duration: 2000
				});
			},
			changeNav(index){
				this.currentIndex = index;
			}
		},
		created() {
			this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
		},
		mounted() {
			if (localStorage.getItem("user_token")) {
				this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
			} else {
				this.warningMsg("请先登录", "warning");
			}

		}
	}
</script>

<style scoped="scoped">
	.el-container {

		background-color: #85cbcb85;
	}

	.el-header {
		padding: 15px;
		height: 40px;
		color: #333;
		text-align: center;
		line-height: 40px;
	}

	.el-aside {
		padding: 30px;
		padding-left: 50px;
		color: #333;
		text-align: center;
		line-height: 200px;
	}

	.box-card {
		position: relative;
		height: 400px;
	}

	.el-menu {
		left: 0;
		position: absolute;
		top: 180px;
		width: 100%
	}

	.el-main {
		padding: 30px;
		color: #333;
		text-align: center;
	/* 	line-height: 160px; */
	}
</style>
