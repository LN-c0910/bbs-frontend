<template>
	<el-tabs type="border-card">
		<el-tab-pane label="基本资料">
			<el-row>
				<el-col :span="6">主题数:{{userInfo['utopic']}}</el-col>
				<el-col :span="6">贴子数:{{userInfo['ureply']}}</el-col>
				<el-col :span="6">收藏数:{{userInfo['collections']}}</div>
				</el-col>
				<el-col :span="6">用户积分:{{userInfo['upoint']}}</el-col>
			</el-row>
			<el-divider></el-divider>
			<el-row>
				<el-col :span="6">用户组:{{userInfo['roleid']==1?'管理员':'注册用户'}}</el-col>
				<el-col :span="6">生日:{{userInfo['ubirthday']}}</el-col>
				<el-col :span="6">性别:{{userInfo['usex']}}</el-col>
				<el-col :span="6">Email:{{userInfo['uemail']}}</el-col>
			</el-row>
			<el-divider></el-divider>
			<el-row>
				<el-col :span="12">注册时间:{{userInfo['uregdate']}}</el-col>
				<el-col :span="12">最后登录:{{userInfo['ulastlogin']}}</div>
				</el-col>
			</el-row>
		</el-tab-pane>
		<el-tab-pane label="密码">
			<div class="inputpasswd">
				<el-input placeholder="旧密码" show-password type="password" v-model="oldpass">
					<template slot="prepend"><i class="el-icon-lock"></i></template>
				</el-input>
			</div>
			<div class="inputpasswd">
				<el-input placeholder="新密码" show-password type="password" v-model="newpass">
					<template slot="prepend"><i class="el-icon-lock"></i></template>
				</el-input>
			</div>
			<div class="inputpasswd">
				<el-input placeholder="重复新密码" show-password type="password" v-model="newpass_2">
					<template slot="prepend"><i class="el-icon-lock"></i></template>
				</el-input>
			</div>
			<div class="inputpasswd">
				<el-button type="primary" size="small" @click="changePwd" style="width:100%">修改密码</el-button>
			</div>
		</el-tab-pane>
		<el-tab-pane label="头像上传">
			<el-upload :data="params" class="avatar-uploader" :action="serverUrl" :show-file-list="false"
			 :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
				<img v-if="imageUrl" :src="imageUrl" class="avatar">
				<i v-else class="el-icon-plus avatar-uploader-icon"></i>
			</el-upload>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
	import config from "../../../config.js"
	export default {
		name: 'userEdit',
		data: () => ({
			userInfo: {},
			oldpass: "",
			newpass: "",
			newpass_2: "",
			imageUrl: '',
			params:	{
				"user_token":localStorage.getItem("user_token")
			}
		}),
		methods: {
			//重新获取用户信息
			getUser(){
				this.$http.post("/getUser",
					this.$qs.stringify({
						"user_token":localStorage.getItem("user_token")	
					})
				).then(({data})=>{	
					localStorage.setItem("userInfo",JSON.stringify(data));
					this.warningMsg("头像更新成功","success");
					// this.$router.go(0);
				}).catch((e)=>{
					this.warningMsg("网络错误","error");
					this.$clearLogin();
				})
			},
			handleAvatarSuccess(res, file) {
				this.imageUrl = URL.createObjectURL(file.raw);
				this.getUser();
				
				
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 1;

				if (!isJPG) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 1MB!');
				}
				return isJPG && isLt2M;

			},
			warningMsg(msg, type) {
				this.$message({
					message: msg,
					type: type,
					showClose: true,
					duration: 2000
				});
			},
			changePwd() {
				if (!localStorage.getItem("user_token")) {
					this.warningMsg("请登录", "warning");
					return;
				}
				if (this.newpass == "" || this.newpass_2 == "" || this.oldpass == "") {
					this.warningMsg("请输入密码", "warning");
					return;
				}
				if (this.newpass != this.newpass_2) {
					this.warningMsg("两次输入的密码不一致", "warning");
					return;
				}
				if (this.newpass == this.newpass_2 == this.oldpass) {
					this.warningMsg("新密码与原密码相同", "warning");
					return;
				}
				if (this.newpass.length < 6) {
					this.warningMsg("密码最少6位", "warning");
					return;
				}
				this.$http.post("user/updatepwd",
					this.$qs.stringify({
						"user_token": localStorage.getItem("user_token"),
						"upassword": this.oldpass,
						"newpassword": this.newpass
					})
				).then(({
					data
				}) => {
					this.warningMsg(data.msg, "success");;
				}).catch((e) => {
					this.warningMsg(e.response.data.msg + ",操作失败", "error");
				})
			}
		},
		mounted() {
			if (localStorage.getItem("user_token")) {
				this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
			} else {
				this.warningMsg("请先登录", "warning");
			}
			this.serverUrl = config.api+"/uploadFace";
		},
		created() {
			this.serverUrl = config.api+"/uploadFace";
		}
	}
</script>

<style>
	.inputpasswd {
		margin-top: 15px;
	}

	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

	.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
</style>
