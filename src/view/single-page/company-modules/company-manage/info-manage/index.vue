<template>
	<div >
		<SearchList :inputList="inputList" @on-search="queryData" @on-reset="clearQueryData"></SearchList>
		<div>
			<Button type="primary" @click="addCompany">新建企业</Button>
		</div>
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
		<Modal v-model="isShowDetail" :mask-closable="false" title="企业详情"  width="800" class="infoWrap"> 
			<Tabs value="name1">
				<TabPane label="基本信息" name="name1">
					<Form  :label-width="130">
                        <FormItem label="企业名称：">
                            <span>{{ formDetail.name }}</span>
                        </FormItem>
						<FormItem label="企业电话：" >
                            <span>{{ formDetail.telephone }}</span>
                        </FormItem>
						<FormItem label="企业地址：">
                            <span>{{ formDetail.address }}</span>
                        </FormItem>
						<Form  :label-width="130" v-for="(value, index) in newArray" :key="index">
							<FormItem :label="index == 0 ? '联系人：': '联系人' + parseInt(index + 1 )+ '：'" >
								<span>{{ value.name }}</span>
							</FormItem>
							<FormItem :label="index == 0 ? '联系人电话：': '联系人电话' + parseInt(index + 1) + '：' " >
								<span>{{ value.phone }}</span>
							</FormItem>
						</Form>
						<FormItem label="紧急联系人：" >
                            <span>{{ formDetail.emergencyContact }}</span>
                        </FormItem>
						<FormItem label="紧急联系人电话：">
                            <span>{{ formDetail.emergencyContactPhone }}</span>
                        </FormItem>
						<FormItem label="统一社会信用代码：" >
                            <span>{{ formDetail.orgCode }}</span>
                        </FormItem>
						<FormItem label="管理员账号：" >
                            <span>{{ formDetail.adminAccount }}</span>
                        </FormItem>
                    </Form>
				</TabPane>
				<TabPane label="账户信息" name="name2">
					<Form  :label-width="130">
						<FormItem label="开户行：" >
                            <span>{{ formDetail.bankName }}</span>
                        </FormItem>
						<FormItem label="账户：">
                            <span>{{ formDetail.bankNo }}</span>
                        </FormItem>
						<FormItem label="纳税人名称：">
                            <span>{{ formDetail.taxpayerName }}</span>
                        </FormItem>
						<FormItem label="纳税人识别号：">
                            <span>{{ formDetail.taxpayerIdentiNum }}</span>
                        </FormItem>
						<FormItem label="账户类型：" >
                            <span>{{ accountType[formDetail.accountType] }}</span>
                        </FormItem>
						<FormItem label="授信额度：">
                            <span>{{formatAmount(formDetail.creditMoney)}}</span>
                        </FormItem>
						<FormItem label="账单生成周期：" >
                            <span>{{ '每月' + formDetail.billDay + '号'}}</span>
                        </FormItem>
						<FormItem label="最迟结算日：">
                            <span>{{ formDetail.billDealineDays }}</span>
                        </FormItem>
                    </Form>
				</TabPane>
				<TabPane label="其他信息" name="name3">
					<Form  :label-width="130">
                        <FormItem label="合同：" >
                            <p v-for="(item,index) in formDetail.contract" :key="index">{{ item.name }}</p>
                        </FormItem>
						<FormItem label="合同有效期：" >
                            <span>{{ formDetail.contractEffictStart + '-' + formDetail.contractEffictEnd }}</span>
                        </FormItem>
						<FormItem label="文件：" >
                            <p v-for="(item,index) in formDetail.contract" :key="index">
								<a  @click="downLoad(item.url)" >{{ item.name }}</a> 
							</p>
                        </FormItem>
                    </Form>
				</TabPane>
			</Tabs>
			<div slot="footer">
				<Button type="primary"  @click="isShowDetail = false">确定</Button>
			</div>
		</Modal>
	</div>
</template>

<script>

import {
	getCompanyList,
	getCompanyDetail,
	enableCompany
} from '@/api/company-api/company.js'
import { inputList,pageData,tableTitle,accountType} from "./fields.js";


export default {
	
	data() {
		return {
			...pageData,
			inputList: [],
			searchParams: {},
			accountType: accountType,
			formDetail: {
				
			},
			formItem: {
				remake: '',
			},
			newArray: []
		};
	},
	mounted() {
		// 暂停加载框
		this.inputList = JSON.parse(JSON.stringify(inputList));
		this.gettableTitle();
		this.getList()
	},
	methods: {
		getList() {
			let data = {
                pageSize: this.pageSize,
                currPage: this.current
			}
			data = Object.assign(data,this.searchParams);
			getCompanyList(data).then(res =>{
				this.$store.commit("changeLoadingFlag", false);
				this.tableData = res.data.data.list;
				
				this.total = res.data.data.totalCount
            });
			
		},
		downLoad(url){ // 下载
            window.location.href = url;
        },
		arrSplit(data) { //数据分割
			let arr =  data.split(";")
			let newArray = []
			arr.forEach( (item) =>{
				if('' != item) {
					newArray.push({
						name: item.split("_")[0],
						phone: item.split("_")[1]
					})
				}
			})
			return newArray;
		},

		addCompany() {
			this.$router.push({
				name: 'addCompany'
			})
		},
		editCompany(params) {
			// console.log(params)
			this.$router.push({
				path:'editCompany/:uuid',
				name: 'editCompany',
				params: {
					uuid: params.uuid
				}
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
		queryData(data) {
			this.current = 1;
			this.searchParams = data;
			this.getList()
		},
		clearQueryData() {
			this.current = 1;
			this.searchParams = {};
			this.getList()
		},
		viewDetail(params) {
			this.isShowDetail = true;
			let data = {
				uuid: params.uuid
			}
			getCompanyDetail(data).then(res =>{
				this.formDetail = res.data.data;
				this.newArray = this.arrSplit(res.data.data.contacts);
            })

		},
		openClick(params) {  //开通关闭
			var status = params.status;
			if(status == '1' || status == '0') {
				this.$Modal.confirm({
					title: '提示',
					content: status == '1' ? '<p>确认要为该企业关闭企业用车么？?</p>' : '<p>确认要为该企业开通企业用车么？?</p>',
					onOk: () => {
						let data = {
							uuid: params.uuid,
							enable: status == '0' ? true : false
						}
						enableCompany(data).then( (res) =>{
							if(res.code = '200') {
								if( status == '1') {
									this.$Message.info('关闭成功');
								}else{
									this.$Message.info('开通成功');
								}
								this.getList();
							}
						})
					}
				});
			}
		},	
		gettableTitle() {
			let data = [];
			let actions = {
				key: "action",
				title: "详情",
				width: 230,
				render: (h, params) => {
					let text;
					if(params.row.status == '0') {
						text = '开通'
					}else if(params.row.status == '1') {
						text = '关闭'
            		}
					return h('div', [
						h('a',	{
							props: {
								type: "success",
								size: "small",
								ghost: true
							},
							style: {
								marginRight: '5px'
							},
							on: {
								click: () => {
									this.viewDetail(params.row);
								}
							},
							
						},"详情"),
				
						h('a',{
							props: {
								type: 'warning',
								size: 'small',
								ghost: true
							},
							style: {
								marginRight: '5px'
							},
							on: {
								click: () => {
									this.openClick(params.row);
								}
							}
						},text),
						h('a',{
							props: {
								type: 'error',
								size: 'small',
								ghost: true
							},
							on: {
								click: () => {
									this.editCompany(params.row)
								}
							}
						},'编辑')
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
	.infoWrap .ivu-form-item{
		margin-bottom: 0!important;
	}

</style>
