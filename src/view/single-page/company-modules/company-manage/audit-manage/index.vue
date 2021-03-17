<template>
	<div>
		<SearchList :inputList="inputList" @on-search="search" @on-reset="reset"></SearchList>
		<VTable
			class="staff-table-container"
			:total="total"
			:current="current"
			:pageSize="pageSize"
			:isLoading="isLoading"
			:parColumns="tableColumns"
			:parTableData="tableData"
			@changePage="changePage"
			@changePageSize="changePageSize"
			style="margin-top: 25px;"
		></VTable>
		<Modal v-model="isShowDetail" :mask-closable="false" title="申请详情" width="800">
			<div class="detailStyle">
				<ul>
					<li v-for="(item,index) in detailData" :key="index">
						<span>{{ item.title }}</span>
						<span v-if=" !item.isLoad ">{{ item.value }}</span>
						<span v-else @click="downLoad" style="text-decoration: underline;">
							<a>{{ item.value }}</a>
						</span>
					</li>
				</ul>
			</div>
		</Modal>
		<Modal v-model="isShowModal" :mask-closable="false" title="审核不通过" width="600">
			<div class="errorStyle">
				<p style="margin-bottom: 20px">您确认该企业的开通申请审核不通过么？</p>
				<Form ref="formDynamic" :model="formItem" :label-width="140" style="width: 400px;">
					<FormItem
						label="原因："
						prop="reason"
						:rules="{required: true, message: '审核不通过原因不能为空', trigger: 'blur'}"
					>
						<Input v-model="formItem.reason" type="textarea" :rows="6" placeholder="请填写审核不通过原因..."/>
					</FormItem>
				</Form>
			</div>
			<div slot="footer">
				<Button size="large" type="text" style="margin-right: 8px;" @click="isShowModal = false">取消</Button>
				<Button size="large" type="primary" @click="confirm">确定</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
import { inputList, pageData, tableTitle, detailData } from "./fields.js";
import {
	companyAuditList,
	companyAuditDetail,
	companyAuditVerify
} from "@/api/company-api/company.js";
export default {
	data() {
		return {
			...pageData,
			inputList: [],
			detailData: [],
			formItem: {
				reason: ""
			}
		};
	},
	computed: {},
	mounted() {
		// 暂停加载框
		this.inputList = JSON.parse(JSON.stringify(inputList));
		this.detailData = detailData;
		this.gettableTitle();
		this.getList();
	},
	methods: {
		search(data) {
			this.searchParams = data;
			this.current = 1;
			this.getList();
		},
		reset() {
			this.searchParams = {};
			this.current = 1;
			this.pageSize = 10;
			this.getList();
		},
		changePage(val) {
			this.current = val;
			this.getList();
		},
		changePageSize(val) {
			this.pageSize = val;
			this.getList();
		},
		getList() {
			let data = Object.assign(
				{},
				{
					currPage: this.current,
					pageSize: this.pageSize
				},
				this.searchParams
			);
			companyAuditList(data)
				.then(res => {
					this.total = res.data.data.totalCount;
					this.tableData = res.data.data.list;
					this.$store.commit("changeLoadingFlag", false);
				})
				.catch(err => {
					this.total = 0;
					this.tableData = [];
					this.$store.commit("changeLoadingFlag", false);
				});
		},
		confirm() {
			//审核不通过确认方法
			this.verfiyOpations(this.formItem);
		},
		verfiyOpations(data) {
			companyAuditVerify(data)
				.then(res => {
					this.$Message.success(res.data.msg);
					this.getList();
					this.isShowModal = false;
				})
				.catch(err => {});
		},
		viewSuccess(params) {
			this.$Modal.confirm({
				title: "提示",
				content: "<p>您确认要通过该企业的开通申请么?</p>",
				onOk: () => {
					this.verfiyOpations(params);
				},
				onCancel: () => {}
			});
		},
		downLoad() {
			//下载营业执照
			// console.log("下载营业执照");
		},
		gettableTitle() {
			let data = [];
			let actions = {
				key: "action",
				title: "详情",
				width: 300,
				fixed: "right",
				align: "center",
				render: (h, params) => {
					return h("div", [
						h(
							"a",
							{
								// props: {
								//   type: "success",
								//   size: "small"
								// },
								// attrs: {
								//   ghost: "ghost"
								// },
								// style: {
								//   margin: "0 10px",
								//   color: "#2db7f5",
								//   borderColor: "#2db7f5",
								//   float: 'left'
								// },
								on: {
									click: () => {
										companyAuditDetail({
											uuid: params.row.uuid
										})
											.then(res => {
												let companyAuditDetailData =
													res.data.data;
												console.log(res.data.data);
												this.detailData.forEach(
													item => {
														item.value =
															companyAuditDetailData[
																item.keytitle
															] || "暂无";
														if (
															item.keytitle ==
															"businesslicense"
														) {
															item.value =
																"下载执照";
														}
													}
												);
												this.isShowDetail = true;
											})
											.catch(err => {});
									}
								}
							},
							"详情"
						),
						h(
							"a",
							{
								// props: {
								//   type: "success",
								//   size: "small"
								// },
								// attrs: {
								//   ghost: "ghost"
								// },
								style: {
									margin: "0 10px",
									display:
										params.row.status == 1
											? "inline-block"
											: "none"
								},
								on: {
									click: () => {
										let data = {
											uuid: params.row.uuid,
											pass: true
										};
										this.viewSuccess(data);
									}
								}
							},
							"审核通过"
						),
						h(
							"a",
							{
								// props: {
								//   type: "error",
								//   size: "small"
								// },
								// attrs: {
								//   ghost: "ghost"
								// },
								style: {
									margin: "0 10px",
									display:
										params.row.status == 1
											? "inline-block"
											: "none"
								},
								on: {
									click: () => {
										this.formItem["uuid"] = params.row.uuid;
										this.formItem["pass"] = false;
										this.isShowModal = true;
									}
								}
							},
							"审核不通过"
						)
					]);
				}
			};
			data = [...tableTitle];
			data.push(actions);
			this.tableColumns = data;
		}
	}
};
</script>

<style scoped>
.detailStyle {
	width: 600px;
	border-top: 1px solid #e4e4e4;
	border-left: 1px solid #e4e4e4;
	margin: 0 auto;
}
.detailStyle ul {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
}
.detailStyle ul li {
	width: 299px;
	text-align: left;
	border-right: 1px solid #e4e4e4;
}

.detailStyle ul li span {
	display: inline-block;
	width: 100%;
	padding-left: 20px;
	line-height: 47px;
	height: 47px;
	border-bottom: 1px solid #e4e4e4;
}
.detailStyle ul li span:nth-child(1) {
	background-color: #f8f8f9;
	line-height: 39px !important;
	height: 39px !important;
}

.errorStyle {
	width: 500px;
	margin: 0 auto;
	text-align: center;
}
</style>
