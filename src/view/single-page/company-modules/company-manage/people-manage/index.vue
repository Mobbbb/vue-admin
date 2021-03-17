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
	</div>
</template>

<script>

import {
	inputList,
	pageData,
	tableTitle

} from "./fields.js";

import {
	companyUserList
} from '@/api/company-api/company.js'

export default {
	
	data() {
		return {
			...pageData,
			inputList: [],
			searchParams: {},
		};
	},
	computed: {
		
	},
	mounted() {
		// 暂停加载框
		this.$store.commit("changeLoadingFlag", true);
		this.inputList = JSON.parse(JSON.stringify(inputList));
		this.gettableTitle();
		this.getList();
	},
	methods: {
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
			this.getList();
		},
		clearQueryData() {
			this.current = 1;
			this.searchParams = {};
			this.getList()
		},
		gettableTitle() {
      		this.tableColumns = [...tableTitle]
		},
		getList() {
			let data = {
                pageSize: Number(this.pageSize),
                currPage: Number(this.current)
			}
			data = Object.assign(data,this.searchParams)

			companyUserList(data).then(res =>{
				this.tableData = res.data.data.list;
				this.total = res.data.data.totalCount
				this.$store.commit("changeLoadingFlag", false);
            })
			
		}
	}
};
</script>