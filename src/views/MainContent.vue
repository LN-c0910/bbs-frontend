<template>
	<el-container>
		</el-scrollbar>
		<el-main>
			<el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
				<el-tab-pane name="all" style="height: 490px;overflow-y: auto;" class="infinite-list" v-infinite-scroll="load"
				 infinite-scroll-disabled="disabled">
					<span slot="label"><i class="el-icon-date"></i>最新</span>
					<el-col v-for="(item,index) in topicInfo" :key="index" class="infinite-list-item">
						<el-card shadow="hover" :body-style="{'padding': '5px'}">
							<el-row>
								<span class="topicNum cleft">
									<el-tag size="mini" type="danger" effect="dark">{{item['replys']}}</el-tag>
									<el-tag v-show="item['forcetop']||item['top']" size="mini" type="success" effect="dark"><i class="el-icon-s-flag"></i></el-tag>
									<el-tag size="mini" v-show="item['good']" type="warning" effect="dark">精</el-tag>
								</span>
								<span class="cleft ttitle" :style="{color: (item['top']==1?'red':'')}" @click="toDetails(item['tid'])">{{item['ttopic']}}</span>
								<span class="cright"><i class="el-icon-user-solid"></i>{{item['uname']}}</span>
							</el-row>
							<el-row>
								<span class="brief cleft">{{item['tcontents']}}</span>
								<span class="ttime cright">发帖:{{item['ttime']}}</span>
								<span class="ttime cright" v-show="item['tlastclick']!=null">最新回复:{{item['tlastclick']}}</span>
							</el-row>
						</el-card>
						<el-divider></el-divider>
					</el-col>
					<p v-if="loading">加载中...</p>
					<p v-if="noMore">没有更多了</p>
				</el-tab-pane>
				<el-tab-pane name="good" style="height: 490px;overflow-y: auto;" class="infinite-list" v-infinite-scroll="load_g"
				 infinite-scroll-disabled="disabled_g">
					<span slot="label"><i class="el-icon-date"></i>精华</span>
					<el-col v-for="(item,index) in topicInfo_g" :key="index" class="infinite-list-item">
						<el-card shadow="hover" :body-style="{'padding': '5px'}">
							<el-row>
								<span class="topicNum cleft">
									<el-tag size="mini" type="danger" effect="dark">{{item['replys']}}</el-tag>							
									<el-tag size="mini" v-show="item['good']" type="warning" effect="dark">精</el-tag>
								</span>
								<span class="cleft ttitle" @click="toDetails(item['tid'])" :style="{color: (item['top']==1?'red':'')}">{{item['ttopic']}}</span>
								<span class="cright"><i class="el-icon-user-solid"></i>{{item['uname']}}</span>
							</el-row>
							<el-row>
								<span class="brief cleft">{{item['tcontents']}}</span>
								<span class="ttime cright">发帖:{{item['ttime']}}</span>
								<span class="ttime cright">最新回复:{{item['tlastclick']}}</span>
							</el-row>
						</el-card>
						<el-divider></el-divider>
					</el-col>
					<p v-if="loading_g">加载中...</p>
					<p v-if="noMore_g">没有更多了</p>
				</el-tab-pane>
			</el-tabs>
		</el-main>
		</el-scrollbar>
	</el-container>
</template>

<script>
	export default {
		name: 'mainContent',
		props: ['section_id'],
		data: () => ({
			loading: false,
			loading_g:false,
			userInfo: null,
			activeName: 'all',
			count: 0,
			totalPages:0,
			totalPage_g:0,
			page: 1,
			page_g:1,
			stoprefresh: false,
			topicInfo: [],
			topicInfo_g:[]
			
		}),
		methods: {
			handleClick(tab, event) {
				if (tab.name=="good"){
					// console.log("good");
					this.topicInfo_g = [];
					this.page_g = 1;
					this.loading_g = true;
					this.getGoodTopicInfo();
				
				}
			},
			getGoodTopicInfo(){
				this.$http.get("topic/section/" + this.section_id + "/" + this.page_g+"?good=1",)
				.then(({data}) => {
						// console.log(data);
						this.topicInfo_g = this.topicInfo_g.concat(data.list);
						this.totalPages_g = data.totalPages;
						this.loading_g = false;					
					}).catch((e) => {
						if (e.response.status == 404) {
							this.warningMsg(e.response.data.msg, "warning");
							this.loading_g = false;		
						} else {
							this.warningMsg("网络错误:130", "warning");
							this.loading_g = false;		
						}
					});
			},
			getTopicInfo(){
				this.$http.get("topic/section/" + this.section_id + "/" + this.page)
					.then(({data}) => {
						// console.log(data);
						this.topicInfo = this.topicInfo.concat(data.list);
						this.totalPages = data.totalPages;
						this.loading = false;					
					}).catch((e) => {
						if (e.response.status == 404) {
							this.warningMsg(e.response.data.msg, "warning");
						} else {
							this.warningMsg("网络错误:130", "warning");
						}
					});
			},
			//路由到帖子详情页
			toDetails(topicid){
				this.$router.push({
					path: `/index/topic/${topicid}`,
				});
			},
			//无限滚动读取数据
			load() {
				this.loading = true;
				setTimeout(() => {			
						this.page++;
						this.getTopicInfo();
						this.loading = true;
					},2000);
					
			},
			load_g(){
				this.loading_g = true;
				setTimeout(() => {			
						this.page_g++;
						this.getGoodTopicInfo();
						this.loading_g = true;
					},2000);
			},
			warningMsg(msg, type) {
				this.$message({
					message: msg,
					type: type,
					showClose: true,
					duration: 2000
				});
			}
		},
		computed: {
			noMore() {
				return this.page >= this.totalPages;
				// return this.stoprefresh;
			},
			disabled() {
				return this.loading || this.noMore
			},
			noMore_g() {
				return this.page_g >= this.totalPages_g;
				// return this.stoprefresh;
			},
			disabled_g() {
				return this.loading_g || this.noMore_g
			}
			
		},
		created() {
			this.getTopicInfo();
		},
		watch: {
			//监听路由参数section_id
			section_id(val) {
				if (val != "index"){
					let ev = "sid"+val;
					if (!localStorage.getItem(ev)){
						let count = 0;
						localStorage.setItem(ev,++count);
					}else{
						let count = localStorage.getItem(ev);
						localStorage.setItem(ev,++count);
					}
					
				}
				
				this.page = 1;
				this.page_g = 1;
				this.topicInfo = [];
				this.topicInfo_g = [];
				this.loading_g = true;
				
				
				this.$http.get("topic/section/" + val + "/" + this.page)
					.then(({
						data
					}) => {
						this.topicInfo = data.list;
						this.totalPages = data.totalPages;
						this.loading = false;
					}).catch((e) => {
						if (e.response.status == 404) {
							this.warningMsg(e.response.data.msg, "warning");
						} else {
							this.warningMsg("网络错误:130", "warning");
						}
					})
					
				this.$http.get("topic/section/" + val + "/" + this.page_g+"?good=1")
					.then(({
						data
					}) => {
						this.topicInfo_g = data.list;
						this.totalPages_g = data.totalPages;
						this.loading_g = false;
					}).catch((e) => {
						if (e.response.status == 404) {
							this.warningMsg(e.response.data.msg, "warning");
						} else {
							this.warningMsg("网络错误:130", "warning");
						}
					})
			}
		}
	}
</script>

<style scoped="scoped">
	.el-tabs {
		background: none;
		background-color: #00000015;
	}


	.el-main {
		overflow: hidden;
		/* border: 1px solid saddlebrown; */
		color: #333;
		text-align: center;
		/* line-height: 160px; */
		transition: 0.4s;
	}

	.el-card {
		color: #000;
		border: none;
		cursor: default;
		margin: 0;
		padding: 0;
		z-index: 1;
		background-color: transparent;
	}

	.cleft {
		float: left;
	}

	.ttitle {
		cursor: pointer;
		position: absolute;
		left: 90px;
	}

	.brief,
	.ttime,
	.comment {
		margin-top: 10px;
		margin-left: 90px;
		font-size: 0.8em;
	}

	.cright {
		float: right;
		margin-right: 20px;
	}

	.pic {
		float: left;
		margin-left: 90px;
		margin-top: 10px;
	}

	.pic img {
		margin-right: 10px;
	}

	.infinite-list::-webkit-scrollbar {
		/*滚动条整体样式*/
		width: 5px;
		/*高宽分别对应横竖滚动条的尺寸*/
		height: 1px;
	}

	.infinite-list::-webkit-scrollbar-thumb {
		/*滚动条里面小方块*/
		border-radius: 10px;
		background-color: skyblue;
		background-image: -webkit-linear-gradient(45deg,
			rgba(255, 255, 255, 0.2) 25%,
			transparent 25%,
			transparent 50%,
			rgba(255, 255, 255, 0.2) 50%,
			rgba(255, 255, 255, 0.2) 75%,
			transparent 75%,
			transparent);
	}

	.infinite-list::-webkit-scrollbar-track {
		/*滚动条里面轨道*/
		box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		background: #ededed;
		border-radius: 10px;
	}
</style>
