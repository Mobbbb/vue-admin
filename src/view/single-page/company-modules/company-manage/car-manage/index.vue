<template>
	<div>
		<SearchList :inputList="inputList" @on-search="queryData" @on-reset="clearQueryData"></SearchList>
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
		<modal  ref="carScenes" :enteroriseName="enteroriseName"  @confirm="confirm" ></modal>
		<Modal class="carManageStyle" footer-hide v-model="isShow" :mask-closable="false" :title="'场景管理'+ '（'+companyName+'）'"  width="600"> 
			<div>
				<div style="display: flex" v-for="(item,index) in sceneList" :key="index">
					<div class="operate-left">
						<span v-if="index == 0">场景：</span>
					</div>
					<div class="operate-right">
						<span style="display: inline-block;width: 100px">{{ item.sceneName }}</span>
						<Icon type="ios-remove-circle-outline" size="18" color="red" style="vertical-align: middle;cursor:pointer" @click="delSecnes(item.sceneId)" />
					</div>
				</div>
				<div style="display: flex;margin-top: 20px">
					<div class="operate-right">
						<Form  :model="formValidate"  ref="formItem" :label-width="120" style="    margin-left: 91px;">
							<FormItem style="width: 300px" label="新的用车场景：" prop="sceneName" :rules="[{ required: true, message: '用车场景不能为空'},{validator: validate, trigger: 'blur'}]"   >
								<Input placeholder="请输入场景名称" style="width: 100px" v-model="formValidate.sceneName" />
								<Button type="primary" style="margin-left: 10px" @click="addScenes">添加</Button>
							</FormItem>
						</Form>
					</div>
				</div>
			</div>
			<div slot="footer">
				<Button size="large" type="text" style="margin-right: 8px;" @click="isShow = false">取消</Button>
				<Button size="large" type="primary">确定</Button>
			</div>
		</Modal>

	</div>
</template>

<script>
import {
	getCarInfoScenes,
	carScenesList,
	addCarScenes,
	delCarScenes,
	CarInfoScenesDetail,
	editCarInfoScenes
} from '@/api/company-api/company.js'
import modal from "./modal";
import {
	inputList,
	pageData,
	tableTitle,
} from "./fields.js";

export default {
	components: {
		modal
	},
	data() {
		return {
			...pageData,
			inputList,
			searchParams: {},
			isShow: false,
			enteroriseId: '',
			formValidate: {
				sceneName: '',
			},
			enteroriseName: ''
		};
	},
	
	mounted() {
		// 暂停加载框
		this.$store.commit("changeLoadingFlag", true);
		this.inputList = JSON.parse(JSON.stringify(inputList));
		this.gettableTitle();
		this.getList();
	},
	methods: {
		getList() {
			let data = {
                pageSize: this.pageSize,
                currPage: this.current
			}
			data = Object.assign(data,this.searchParams)
			getCarInfoScenes(data).then(res =>{
				this.$store.commit("changeLoadingFlag", false);
				this.tableData = res.data.data.list;
				this.total = res.data.data.totalCount
            })
			
		},
		changePage(val) {
			this.current = val;
      		this.getList();
		},
		changePageSize(val) {
			this.pageSize = val;
			this.getList();
		},
		queryData(params) {
			this.searchParams = params;
			this.getList();
		},
		
		clearQueryData() {
			this.searchParams = {}
			this.getList();
		},
		viewDetail(row) { //场景详情
			this.enteroriseName = row.enteroriseName;
			let data = {
				orgType: '1',
				orgId: row.enteroriseId
			}
			CarInfoScenesDetail(data).then( (res) =>{
				let data = res.data.data.sceneList;
				if(data && data.length) {
					new Promise((resolve, reject) => {
						this.$refs.carScenes.init(data, resolve);
					}).then(() => {
						this.modalFrom.showModal= true;
					})
				}else {
					this.$Message.error('请先添加场景!');
				}
			})
		},
		validate(rule, val, callback) {
			var reg =  /^[a-zA-Z\u4e00-\u9fa5]{1,20}$/;
			if (!reg.test(val)){
				callback(new Error('请输入20位以内的大小写字母、或汉字格式'));
			} else {
				callback();
			}
		},
		scenesMange(row) { //场景管理
			this.sceneName = '';
			if(row) this.companyName = row.enteroriseName;

			this.$refs.formItem.resetFields();
			if(row) {
				this.enteroriseId = row.enteroriseId;
				this.isShow = true;
			}
			
			let data = {
                enteroriseId: this.enteroriseId
			}
			carScenesList(data).then( (res)=>{
				this.sceneList = res.data.data.list;
			}) 
		},
		addScenes() {  //添加用车场景
			this.$refs['formItem'].validate((valid) =>{
				if(valid) {
					let data = {
						enteroriseId: this.enteroriseId,
						sceneName: this.formValidate.sceneName
					}
					addCarScenes(data).then( (res) =>{
						if(res.code = '200') {
							this.scenesMange();
							this.getList();
							this.modalFrom.isShowDetail = false
						}
					});
				}
			});
		},
		delSecnes(sceneId) { //删除用车场景
			let data = {
				sceneId: sceneId
			}
			 this.$Modal.confirm({
				title:'删除',
				content:'您确认要删除该用车场景么？',
				onOk:()=>{
					delCarScenes(data).then( (res) =>{
						if(res.code = 200) {
							this.scenesMange()
						}
					})
				}
			})
			
		},
		confirm(data) { //场景详情确定
			// console.log(data)
			let sceneContent;
			data.forEach(element => {
				
				if( this.isJSON(element.sceneContent) ) {
					sceneContent =  element.sceneContent
				}else{
					sceneContent =  JSON.stringify(element.sceneContent);
				}

				element.sceneContent = sceneContent
				
			});
			editCarInfoScenes({sceneList: data}).then( (res) =>{
				
				this.modalFrom.showModal = false;
				
			})
		},
		isJSON(str) {
			try {
				if (typeof JSON.parse(str) == "object") {
					return true;
				}
			} catch(e) {
				
			}
			return false;
		},
		gettableTitle() {
			let data = [];
			let actions = {
				key: "action",
				title: "详情",
				width: 200,
				render: (h, params) => {
					return h('div', [
						h('a',{
							style: {
								marginRight: '5px'
							},
							on: {
								click: () => {
									this.scenesMange(params.row);
								}
							}
						},'场景管理'),
						h('a',	{
							style: {
								marginRight: '5px'
							},
							on: {
								click: () => {
									this.viewDetail(params.row);
								}
							},
							
						},"场景详情"),
						

					])
				}
			};
			data = [...tableTitle];
			data.push(actions);
      		this.tableColumns = data;
		},
		
	}
};
</script>
<style>
	
	.carManageStyle .checkItem{
		margin-left: 80px;
		
	}
	.carManageStyle .infoWrap .ivu-form-item{
		margin-bottom: 10px!important;
	}
	.carManageStyle .operate-left{
		width: 200px;
		line-height: 40px;
		text-align: right;
		margin-right: 10px
	}
	.carManageStyle .operate-right{
		line-height: 40px
	}

	.carManageStyle .ivu-form-item-content{
		width: 300px
	}
</style>
