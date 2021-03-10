<template>
	<el-container>
		</el-scrollbar>
		<el-main>
			<el-tabs v-model="activeName" type="border-card">
				<el-tab-pane name="searchBox" style="height: 490px;overflow-y: auto;" class="infinite-list" v-infinite-scroll="load"
				 infinite-scroll-disabled="disabled">
					<span slot="label"><i class="el-icon-date"></i>搜索结果</span>
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
			</el-tabs>
		</el-main>
		</el-scrollbar>
	</el-container>
	
</template>

<script>
	export default {
		name:'searchList',
		data:()=>({
			activeName:"searchBox",
			loading:false,
			topicInfo: [],
			totalPages:0,
			page:1
		}),
		methods:{
			//弹窗
			warningMsg(msg, type) {
				this.$message({
					message: msg,
					type: type,
					showClose: true,
					duration: 2000
				});
			},
			//无限滚动读取数据
			load() {
				this.loading = true;
				setTimeout(() => {			
						this.page++;
						this.getSearchList();
						this.loading = true;
					},2000);
					
			},
			getSearchList(){
				let that = this;
				let keyword = this.$getUrlParam("w");
				this.$http.get("topic/search?keyword="+keyword+"&page="+that.page)
						.then((result) => {
							// console.log(data);
							// that.topicInfo.concat(result.data)
							that.topicInfo = that.topicInfo.concat(result.data.list);
							that.totalPages = result.data.totalPage;
							that.loading = false;		
						}).catch((e) => {
							that.warningMsg(e.response.data.msg, "error");
						})
			},
			//路由到帖子详情页
			toDetails(topicid){
				this.$router.push({
					path: `/index/topic/${topicid}`,
				});
			}
		},
		computed:{
			noMore() {
				return this.page >= this.totalPages;
				// return this.stoprefresh;
			},
			disabled() {
				return this.loading || this.noMore
			},
		},
		created(){
			this.getSearchList();
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
