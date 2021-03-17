<template>
  <div>
    <div class="info-layout">
      <div class="info">
        <span class="info-span">任务名称</span>
        <span>{{billName}}</span>
      </div>
      <div class="info">
        <span class="info-span">对账日期</span>
        <span class="info-text">{{diffInfo.reconciliationDate}}</span>
        <span class="info-span">对账状态</span>
        <span>{{reconciliationStatus}}</span>
      </div>
      <div class="info">
        <span class="info-span">平台总金额</span>
        <span class="info-text">{{diffInfo.platformBillTotalAmount}}</span>
        <span class="info-span">平台总笔数</span>
        <span>{{diffInfo.platformBillTotalCnt}}</span>
      </div>
      <div class="info">
        <span class="info-span">渠道总金额</span>
        <span class="info-text">{{diffInfo.channelBillTotalAmount}}</span>
        <span class="info-span">渠道总笔数</span>
        <span>{{diffInfo.channelBillTotalCnt}}</span>
      </div>
      <div class="info info-screen" style="">
        <div>
          <span class="info-span">红色表示:</span>
          <span>双方订单均存在，金额不对</span>
        </div>
        <div>
          <ExportFile
            :isDisabled="isExportBtn"
            exportUrl="/admin/finance/bill/exportDiffInfo"
            btnText="导出差异化数据"
            ajaxMethod="GET"
            :queryData="queryData"
            exportFileName="对账结果差异数据.xlsx"
            style="margin-right:20px;"
          ></ExportFile>
        </div>
      </div>
      <div class="info info-screen">
        <div>
          <span class="info-span">蓝色表示:</span>
          <span>仅在一方存在</span>
        </div>
      </div>
    </div>
    <div class="flex-layout">
      <Card style="margin-right: 15px;width: 50%">
        <p slot="title">平台数据</p>
        <a href="#" slot="extra" @click.prevent="changeLimit">{{tableText}}</a>
        <VTable
          :total="total"
          :current="currPage"
          :pageSize="pageSize"
          :isLoading="true"
          :parColumns="parColumns"
          :parTableData="tableData"
          @changePage="changePage"
          @changePageSize="changePageSize">
        </VTable>
      </Card>
      <Card style="width: 50%">
        <p slot="title">渠道数据</p>
        <VTable
          :total="totalQD"
          :current="currPageQD"
          :pageSize="pageSizeQD"
          :isLoading="true"
          :parColumns="parColumnsQD"
          :parTableData="tableDataQD"
          @changePage="changePageQD"
          @changePageSize="changePageSizeQD">
        </VTable>
      </Card>
    </div>

  </div>
</template>
<script>
  import VTable from '_a/v-table/v-table'
  import {
    billName,
    formDataPT,
    formDataQD,
    columnsZFB,
    columnsWX,
    columnsYL,
    columnsWT,
    stateType,
  } from './index'
  import {diffInfo, platformDiffInfo,} from '@/api/finance'
  import ExportFile from "_a/export-file/exportFile";

  export default {
    name: "Returns",
    components: {
      VTable,
      ExportFile
    },
    data() {
      return {
        ...formDataPT(this),
        ...formDataQD(this),
        diffInfo: {},
        searchParams: {},
        tableData: [],
        parColumns: [],
        listType: '差异化数据',
        tableDataQD: [],
        parColumnsQD: [],
        channelId:'',
        billName:'',
        tableType:true,
        tableText:'完整列数据',
        reconciliationDate:'',
        formHearPT:["ptBillId","ptTradeDate","ptTradeTime","ptOrderAmount","ptServiceCharge","ptMerchantOrderId"],
        formHearZFB:["merchantOrderId","createDate","createTime","orderAmount","serviceCharge","alipayTradeId"],
        formHearWX:["merchantOrderId","tradeDate","tradeTime","orderAmount","serviceCharge","wechatOrderId"],
        formHearWT:["qdBillId","qdDate","qdTime","qdOrderAmount","h5ServiceCharge","qdTardeFlowId"],
        formHearYL:["merchantOrderId","qdDate","qdTime","tradeAmount","serviceCharge","inquireTradeId"],
        isExportBtn: false,
        queryData:{},
        reconciliationStatus:'',
      };
    },
    mounted() {
      this.channelId = Number(this.$route.query.id);
      this.reconciliationDate = this.$route.query.reconciliationDate;
      this.getTableColumns(this.tableText);
      this.getDiffInfo();
      this.getTableList();
      this.billName = billName[this.channelId];
      this.queryData = {
        channelId:Number(this.channelId),
        reconciliationDate: this.reconciliationDate,
      }

    },
    methods: {
      getTableColumns(val){
        this.parColumns = [];
        this.parColumnsQD = [];
        let hearList = [];
        if(this.channelId == 0){
          this.columnsQD = columnsYL;
          hearList = this.formHearYL;
        }else if(this.channelId == 1){
          this.columnsQD = columnsZFB;
          hearList = this.formHearZFB;
        }else if(this.channelId == 2){
          this.columnsQD = columnsWX;
          hearList = this.formHearWX;
        }else if(this.channelId == 3){
          this.columnsQD = columnsWT;
          hearList = this.formHearWT;
        }
        if(this.tableType){
          this.formHearPT.forEach(key => {this.parColumns.push(this.columns[key])});
          hearList.forEach(key => {this.parColumnsQD.push(this.columnsQD[key])});
        }else {
          Object.entries(this.columns).forEach(([key, value])=> {this.parColumns.push(value)});
          Object.entries(this.columnsQD).forEach(([key, value])=> {this.parColumnsQD.push(value)});
        }
      },
      changeLimit(){
        this.tableType = !this.tableType;
        this.tableText = this.tableType ? "完整列数据":"差异化数据";
        this.getTableColumns();
      },
      getDiffInfo(){
        let data = {
          channelId:this.channelId,
          reconciliationDate: this.reconciliationDate,
        };
        diffInfo(data).then(res => {
          if(res.data.success){
            this.diffInfo = res.data.data;
            let index = this.diffInfo.reconciliationStatus
            this.reconciliationStatus = stateType[index];
          }
        })
      },
      getTableList(){ // 获取表格数据
        let data = {
          currPage:this.currPage,
          pageSize:this.pageSize,
          channelId:this.channelId,
          reconciliationDate: this.reconciliationDate,
        };
        this.$store.commit('changeLoadingFlag', true);

        platformDiffInfo(data).then(res => {
          if(res.data.success){
            this.total = res.data.data.totalCount;
            this.totalQD = res.data.data.totalCount;
            this.tableData = res.data.data.list;
            this.tableDataQD = res.data.data.list;
            this.$store.commit('changeLoadingFlag', false);
          }
        })

      },
      changePage(val){
        this.currPage = val;
        this.currPageQD = val;
        this.getTableList();
      },
      changePageSize(val){
        this.pageSize = val;
        this.getTableList();
      },
      changePageQD(val){
        this.currPage = val;
        this.currPageQD = val;
        this.getTableList();
      },
      changePageSizeQD(val){
        this.pageSize = val;
        this.getTableList();
      },
    }
  };
</script>

<style lang="less" scoped>
  .info-layout {
    margin-bottom: 15px;
    .info {
      display: -webkit-flex;
      display: flex;
      align-items: center;
      .info-span{
        width: 80px;
        text-align: right;
        margin-right: 10px;
      }
      .info-text {
        min-width: 100px;
      }
    }
  }
  .flex-layout{
    display: -webkit-flex;
    display: flex;

  }
  .info-screen{
    padding-left: 30px;
    div{
      width: 50%;
    }
  }
  .margin-b10{
    margin-bottom: 10px;
  }

</style>
