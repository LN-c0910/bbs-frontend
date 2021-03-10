<template>
<div v-model="allVisable">
	<transition name="el-zoom-in-center">
		<div class="dowebok" v-show="loginswitch">
			<span @click="closeAllModal" style="position: absolute;top: 2%;right: 2%;cursor: pointer;"><i class="el-icon-close"></i></span>
			<div class="logo">
				<h1>登录</h1>
			</div>
			<div class="form-item">
				<input id="username" v-model="loginform.uname"  type="text" autocomplete="off" placeholder="登录账号">
			</div>

			<div class="form-item">

				<input id="password" type="password" v-model="loginform.upassword" autocomplete="off" placeholder="登录密码">

			</div>

			<div class="form-item">
				<button id="submit" @click="Gologin" :disabled="logining" v-text="logining?'登录中':'登 录'"></button>
			</div>

			<div class="reg-bar">

				<a class="reg" href="javascript:" @click="closeLoginModal">立即注册</a>

				<a class="forget" href="javascript:">忘记密码</a>

			</div>

		</div>
	</transition>

	<transition name="el-zoom-in-center">
		<div class="dowebok" v-show="regswitch" style="height: 580px;">
			<span @click="closeAllModal" style="position: absolute;top: 2%;right: 2%;cursor: pointer;"><i class="el-icon-close"></i></span>
			<div class="logo">
				<h1>注册</h1>
			</div>
			<div class="form-item">
				<input id="username" v-model="regform.uname" type="text" autocomplete="off" placeholder="注册账号 不超过9位 支持中文">
			</div>
			
			<div class="form-item">
				<input id="password"  v-model="regform.upassword" type="password" autocomplete="off" placeholder="新密码 长度不能低于6位">
			</div>
			<div class="form-item">
				<input id="password" type="password" v-model="regform.usecpassword" autocomplete="off" placeholder="确定密码 长度不能低于6位">
			</div>
			<div class="form-item"><button id="submit" @click="register" :disabled="registering" v-text="registering?'注册中':'注 册'"></button></div>
			<div class="reg-bar">
				<a class="reg" href="javascript:void(0)" @click="closeRegModal">立即登录</a>
				<a class="forget" href="javascript:void(0)" @click="forgerPassword">忘记密码</a>
			</div>

		</div>
	</transition>
</div>
</template>

<script>
	import config from '../../config.js'
	export default {
		name: 'login',
		props: ['loginswitch','regswitch','allswitch'],
		data: () => ({
			dialogFormVisible: true,
			allVisable:false,
			registering:false,
			logining:false,
			loginform:{
				uname:null,
				upassword:null
			},
			regform:{
				uname:null,
				upassword:null,
				usecpassword:null
			},
			form: {
				uname: '',
				password: '',
				date1: '',
				date2: '',
				delivery: false,
				type: [],
				resource: '',
				desc: ''
			},
			formLabelWidth: '80px'
		}),
		methods: {
			closeAllModal() {
				//all,login,reg
				this.$emit('closeAll', false,false,false)
			},
			closeLoginModal() {
				this.$emit('closeLogin',true,false,true)
			},		
			closeRegModal() {
				this.$emit('closeReg', true,true,false)
			},
			forgerPassword(){
				this.warningMsg("功能还没有做哟","warning");
			},
			Gologin(){
				this.$clearUserInfo();
				this.$clearLogin();
				let token = null;
				this.logining = true;
				if (this.loginform.uname == null || this.loginform.upassword == null){
					this.warningMsg("请输入账号和密码",'error');
					return;
				}
				this.$http.post('/login',
					this.$qs.stringify({
								"username":this.loginform.uname,
								"password":this.loginform.upassword
						})			
				).then(({data})=>{
					if(data.code != 10307){
						this.warningMsg(data.res,'error');
						this.logining = false;
						return;
					}else{
						// this.$user.login = true;
						// this.$user.user_token = data.res;
						token = data.res;
						this.$http.post("/getUser",
							this.$qs.stringify({
								"user_token":token['token']	
							})
						).then(({data})=>{	
							console.log(data);
							// this.$user.userInfo = Object.assign(this.$user.userInfo, data);
							// console.log(this.$user.userInfo);
							this.$setUserStorage(data,true,token['token'],data.roleid);
							this.warningMsg("登录成功",'success');					
							this.setStatus();
							this.sendFace(data.uface);
							this.logining = false;
							this.closeAllModal();
						}).catch((e)=>{
							this.warningMsg("网络错误","error");
							this.logining = false;
							this.$clearLogin();
						})
						
					}
				}).catch((e)=>{
					this.warningMsg("网络错误",'error');
					this.logining = false;
					this.$clearLogin();
				})
			},
			setStatus(){
				this.$emit('setStatus',localStorage.getItem('login'));
			},
			//向父组件传递头像信息
			sendFace(face){
				this.$emit('sendFace',config.face+face);
			},
			register(){
				this.registering = true;
				let values = Object.values(this.regform);
				let username_pattern = /^[\u4E00-\u9FA5\uF900-\uFA2D|\w]{1,9}$/;
				if (values.includes(null)||values.includes('null')||values.includes('')){
					this.warningMsg("请输入用户名和密码","warning");
					this.registering = false;
					return;
				}
				if (!username_pattern.test(values[0])){
					this.warningMsg("用户名长度不能多于9位且不能包含特殊字符","warning");
					this.registering = false;
					return; 
				}
				if (values[1] != values[2]){
					this.warningMsg("两次输入的密码不一致","warning");
					this.registering = false;
					return;
				}
				this.$http.post("/register",
					this.$qs.stringify({
						"username":values[0],
						"password":values[1],
						"password_sec":values[2]
					})
				).then(({data})=>{
					if (data.code != 10308){
						this.warningMsg(data.res,"error");
						this.registering = false;
						return;
					}else{
						this.warningMsg(data.res,"success");
						this.registering = false;
					}						
				}).catch((e)=>{
					this.warningMsg("网络错误","error");
					console.log(e);
					this.registering = false;
					return;
				})
				// if (values[1])
			},
			warningMsg(msg,type) {
				this.$message({
					message: msg,
					type: type,
					showClose: true,
					duration: 2000
				});
			}
		}
	}
</script>

<style>
	.dowebok {
		background-position: center top;
		background-size: cover;
		z-index: 999;
		position: absolute;
		left: 50%;
		top: 50%;
		width: 430px;
		height: 550px;
		margin: -300px 0 0 -215px;
		border: 1px solid #fff;
		border-radius: 20px;
		overflow: hidden;
	}
	.dowebok:after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(20, 200, 150, 0.7);
		z-index: -1;
		background-position: center top;
		background-size: cover;
		background-attachment: fixed;
		-webkit-filter: blur(20px);
		-moz-filter: blur(20px);
		-ms-filter: blur(20px);
		-o-filter: blur(20px);
		filter: blur(20px);
	}

	.logo {
		color: white;
		font-size: 20px;
		text-align: center;
		line-height: 80px;
		margin: 50px auto;
	}

	.form-item {
		position: relative;
		width: 360px;
		margin: 0 auto;
		padding-bottom: 30px;
	}

	.form-item input {
		width: 288px;
		height: 48px;
		padding-left: 70px;
		border: 1px solid #fff;
		border-radius: 25px;
		font-size: 18px;
		color: #fff;
		background-color: transparent;
		outline: none;
	}

	.form-item button {
		width: 360px;
		height: 50px;
		border: 0;
		border-radius: 25px;
		font-size: 18px;
		color: #1f6f4a;
		outline: none;
		cursor: pointer;
		background-color: #fff;
	}

	#username {
		/* background: url(img/emil.png) 20px 14px no-repeat; */
	}

	#password {
		/* background: url(img/password.png) 23px 11px no-repeat; */
	}

	.tip {
		display: none;
		position: absolute;
		left: 20px;
		top: 52px;
		font-size: 14px;
		color: #f50;
	}

	.reg-bar {
		width: 360px;
		margin: 20px auto 0;
		font-size: 14px;
		overflow: hidden;
	}

	.reg-bar a {
		color: #fff;
		text-decoration: none;
	}

	.reg-bar a:hover {
		text-decoration: underline;
	}

	.reg-bar .reg {
		float: left;
	}

	.reg-bar .forget {
		float: right;
	}

	.dowebok ::-webkit-input-placeholder {
		font-size: 18px;
		line-height: 1.4;
		color: #fff;
	}

	.dowebok :-moz-placeholder {
		font-size: 18px;
		line-height: 1.4;
		color: #fff;
	}

	.dowebok ::-moz-placeholder {
		font-size: 18px;
		line-height: 1.4;
		color: #fff;
	}

	.dowebok :-ms-input-placeholder {
		font-size: 18px;
		line-height: 1.4;
		color: #fff;
	}



	@media screen and (max-width: 500px) {

		* {
			box-sizing: border-box;
		}

		.dowebok {
			position: static;
			width: auto;
			height: auto;
			margin: 0 30px;
			border: 0;
			border-radius: 0;
		}

		.logo {
			margin: 50px auto;
		}

		.form-item {
			width: auto;
		}

		.form-item input,
		.form-item button,
		.reg-bar {
			width: 100%;
		}

	}
</style>
