<template>
	<el-tabs type="border-card"  v-model="activeName" @tab-click="handleSwitch">
		<el-tab-pane name="topic" label="主题">
			<el-table :data="topicData" style="width: 100%">
				<el-table-column prop="ttopic" label="标题">
				</el-table-column>
				<el-table-column prop="sname" label="板块" width="100">
				</el-table-column>
				<el-table-column prop="treplycount" label="回复数" width="80">
				</el-table-column>
				<el-table-column prop="tlastclick" label="最后回复时间" width="180">
				</el-table-column>
				<el-table-column prop="tdeletetime" label="删除时间" width="180">
				</el-table-column>
				<el-table-column prop="check" label="状态" width="100">
				</el-table-column>
			
				<el-table-column width="80" align="right">
					<template slot-scope="scope">
						<el-button size="mini" @click="handleViewTopic(scope.$index, scope.row)">查看</el-button>
					</template>
				</el-table-column>
	<!-- 			<el-table-column width="90" align="right">
					<template slot-scope="scope">
						<el-button size="mini" @click="handleDeleteCollection(scope.$index, scope.row)">申请恢复</el-button>
					</template>
				</el-table-column> -->
			</el-table>
		</el-tab-pane>
		<el-tab-pane name="good" label="精华">
			<el-table :data="goodTopic" style="width: 100%">
						<el-table-column prop="ttopic" label="标题">
						</el-table-column>
						<el-table-column prop="sname" label="板块" width="100">
						</el-table-column>
						<el-table-column prop="treplycount" label="回复数" width="80">
						</el-table-column>
						<el-table-column prop="tlastclick" label="最后回复时间" width="180">
						</el-table-column>
						<el-table-column prop="tdeletetime" label="删除时间" width="180">
						</el-table-column>
						<el-table-column prop="check" label="状态" width="100">
						</el-table-column>
					
						<el-table-column width="80" align="right">
							<template slot-scope="scope">
								<el-button size="mini" @click="handleViewTopic(scope.$index, scope.row)">查看</el-button>
							</template>
						</el-table-column>
			<!-- 			<el-table-column width="90" align="right">
							<template slot-scope="scope">
								<el-button size="mini" @click="handleDeleteCollection(scope.$index, scope.row)">申请恢复</el-button>
							</template>
						</el-table-column> -->
					</el-table>
		</el-tab-pane>
		<el-tab-pane name="collection" label="收藏">
			<el-table :data="collectionData" style="width: 100%">
				<el-table-column prop="title" label="标题">
				</el-table-column>
				<el-table-column prop="author" label="作者" width="100">
				</el-table-column>
				<el-table-column prop="lastReplyTime" label="最后回复时间" width="180">
				</el-table-column>
				<el-table-column prop="status" label="状态" width="130">
				</el-table-column>

				<el-table-column width="90" align="right">
					<template slot-scope="scope">
						<el-button size="mini" @click="handleViewCollection(scope.$index, scope.row)">查看主帖</el-button>
					</template>
				</el-table-column>
				<el-table-column width="90" align="right">
					<template slot-scope="scope">
						<el-button size="mini" @click="handleDeleteCollection(scope.$index, scope.row)">取消收藏</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-tab-pane>
		
		<el-tab-pane name="reply" label="帖子">帖子</el-tab-pane>
	</el-tabs>
</template>

<script>
	export default {
		name: 'myStoreThread',
		data: () => ({
			activeName:'topic',
			collectionData: [],
			topicData:[],
			goodTopic:[]
		}),
		methods: {
			warningMsg(msg, type) {
				this.$message({
					message: msg,
					type: type,
					showClose: true,
					duration: 2000
				});
			},
			//切换tab页
			handleSwitch(tab, event){
				if (tab.name == 'collection'){
					this.listMyCollection();
					return;
				}
				if (tab.name == 'topic'){
					this.listMyTopic();
					return;
				}
			},
			//查看收藏帖子
			handleViewCollection(index, row) {
				this.$router.push({
					'path': `/index/topic/${row.tid}`,
				})
			},
			//删除收藏
			handleDeleteCollection(index, row) {
				if (!localStorage.getItem("user_token")) {
					this.warningMsg("请先登录！", "warning");
					return false;
				}
				this.$http.delete("collection/"+row.cid, 
					{
						data: localStorage.getItem("user_token")
					}
				).then(({
					data
				}) => {
					this.collectionData.splice(index,1);
					this.warningMsg(data.msg, "success");
				}).catch((e) => {
					// console.log(e);
					this.warningMsg(e.response, "error");
				
				})
			},
			//我的收藏列表
			listMyCollection() {
				if (!localStorage.getItem("user_token")) {
					this.warningMsg("请先登录！", "warning");
					return false;
				}
				this.$http.post("collection/list", this.$qs.stringify({
					"user_token": localStorage.getItem("user_token"),
				})).then(({
					data
				}) => {
					// console.log(data.msg);
					this.collectionData = data.msg;
				}).catch((e) => {
					this.warningMsg(e.response.data.msg, "error");

				})
			},
			//我的主题列表
			listMyTopic(){
				if (!localStorage.getItem("user_token")) {
					this.warningMsg("请先登录！", "warning");
					return false;
				}
				this.$http.post("myTopic", this.$qs.stringify({
					"user_token": localStorage.getItem("user_token"),
				})).then(({
					data
				}) => {
					// console.log(data.msg);
					this.topicData = data.msg;
					this.goodTopic = this.topicData.filter(item => item.good=='1');
				}).catch((e) => {
					this.warningMsg(e.response.data.msg, "error");
				
				})
			},
			//查看我的帖子
			handleViewTopic(index, row){
				this.$router.push({
					'path':`/index/topic/${row.tid}`
				})
			}
		},
		mounted() {
			this.listMyTopic();
		}
	}
</script>

<style>

</style>
