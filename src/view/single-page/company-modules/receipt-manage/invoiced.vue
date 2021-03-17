<template>
    <div>
       <SearchList :inputList='inputlist' @on-search="queryData" @on-reset="clearQueryData"></SearchList>
       <VTable
			class="staff-table-container"
			:total="total"
			:current="current"
			:pageSize="pageSize"
			:parColumns="tableColumns"
			:parTableData="tableData"
			@changePage="changePage"
			@changePageSize="changePageSize"
			style="margin-top: 25px;"
		></VTable>
        <Modal v-model="isShowDetailBox" title="详情" footer-hide>
            <div class="font16" v-show="detailInfo.invoiceType == 2">
                <section class="padding10">
                    <span class="padding10">快递公司:</span>
                    <span>{{detailInfo.logisticsCompany}}</span>
                </section>
                <section class="padding10">
                    <span class="padding10">快递单号:</span>
                    <span>{{detailInfo.logisticsOrderNo}}</span>
                </section>
                <section class="padding10">
                    <span class="padding10">发票编号:</span>
                    <span>{{detailInfo.invoiceNo}}</span>
                </section>
            </div>
            <div v-show="detailInfo.invoiceType == 1" class="font16">
                 <section class="padding10">
                    <span class="padding10">送出时间:</span>
                    <span>{{detailInfo.deliveryDate?$moment(detailInfo.deliveryDate).format('YYYY-MM-DD'): ''}}</span>
                </section>
                <section class="padding10">
                    <span class="padding10">接收人:</span>
                    <span>{{detailInfo.recipient}}</span>
                </section>
                <section class="padding10">
                    <span class="padding10">联系方式:</span>
                    <span>{{detailInfo.recipientMobile}}</span>
                </section>
                <section class="padding10">
                    <span class="padding10">相关文件:</span>
                    <a :href="invoiceUrl" target="blank">下载</a>
                </section>
            </div>
        </Modal>
    </div>
</template>
<script>
import {invoicedInputList,invoicedPageData, invoicedColumns} from './fields.js';

import {api} from '@/libs/api.request.js';
import {
  invoiceList,invoiceDetail
} from "@/api/company-api/config.js";
export default {
    name: 'invoiced',
     mounted() {
        this.inputlist = JSON.parse(JSON.stringify(invoicedInputList));
        this.tableColumns = invoicedColumns(this);
        this.getList();
    },
    data(){
        return {
            detailInfo: {},
            invoiceUrl: '',
            adminApi: api,
            ...invoicedPageData,
            inputlist: []
        }
    },
   methods:{
       queryData(params){
           this.searchData = {};
           if (params.a && params.d) {
               params.invoiceDateStart = this.$moment(params.a).format('YYYY-MM-DD');
               params.invoiceDateEnd = this.$moment(params.d).format('YYYY-MM-DD');
               delete params.a
               delete params.d
           }
           for(let key in params) {
               if(params[key] === 0 || params[key]) {
                   this.searchData[key] = params[key]
               }
           }
            this.getList();
       },
       clearQueryData() {
           this.searchData = {};
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
           this.$store.commit("changeLoadingFlag", true);
           let params = {
               status: 2,
               currPage: this.current,
               pageSize: this.pageSize,
               ...this.searchData
           }
           invoiceList(params).then(res => {
            if(res.data.success) {
                this.tableData = res.data.data.list;
                this.total = res.data.data.totalCount;
                this.$store.commit("changeLoadingFlag", false);
            }
          });
       },
       viewDetail(info) {
           this.isShowDetailBox = true;
           invoiceDetail({uuid: info.uuid}).then(res=>{
               if(res.data.success) {
                   this.detailInfo = res.data.data;
                   this.invoiceUrl = 'http://'+this.detailInfo.invoiceUrl
               }
           })
       }
   }
}
</script>
<style lang="less">
@import '../company.less';
</style>
