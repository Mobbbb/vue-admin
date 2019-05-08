<template>
   <div>
       <Alert v-if='detailDesc.examineDay'>
        <ul class="attendance-modal-detail-desc">
          <li>
            <span>当前司机: </span>
            <b>{{detailDesc.driver}}</b>
          </li>
            <li>
            <span>司机ID: </span>
            <b>{{detailDesc.driverId}}</b>
          </li>
          <li>
            <span>考勤月: </span>
            <b>{{detailDesc.statDay}}</b>
          </li>
          <li>
            <span>应出勤天数/实际出勤天数: </span>
            <b>{{detailDesc.examineDay}}/</b>
            <b>{{detailDesc.dayNumber}}</b>
          </li>
          <li>
            <span>目标天数: </span>
            <b>{{detailDesc.examineDay}}</b>
          </li>
        </ul>
       </Alert>
       <Alert v-else type="warning">
         未配置考勤策略
       </Alert>
      <ExportFile 
        exportUrl='/admin/driver/examine/exportDetail' 
        exportFileName='月考勤明细列表.xlsx' 
        :queryData='exportParams'
        style="margin: 10px 0;"
        v-hasAuth="'attendance-manage-attendanceDetailExport'">
      </ExportFile>
      <Table
            border stripe
            v-if="!loading"
            :height="520"
            :columns="detailTableColumns"
            :data="detailTableData"
            no-data-text="暂无数据">
        </Table>
        <div v-else :style="{ height: '520px'}" class="table-spin-wrap">
            <Spin fix>
                <Icon type="ios-loading" size=20 class="table-spin-icon-load"></Icon>
                <div style="margin-top: 5px;">加载中...</div>
            </Spin>
        </div>
        <div style="margin: 10px; padding: 10px; overflow: hidden">
            <div style="float: right;">
                <Page
                    show-total
                    show-elevator
                    :show-sizer='true'
                    :total="detailTotal"
                    :current="detailCurrent"
                    :page-size="detailPageSize"
                    :page-size-opts="[10, 20, 40, 50]"
                    @on-change="changeDetailPage"
                    @on-page-size-change="changeDetailPageSize">
                </Page>
            </div>
        </div>
   </div>
</template>

<script>
import ExportFile from '_a/export-file/exportFile';
import {attendanceDetailList} from '@/api/driver.js';
import {detailTitle} from './fields.js';

export default {
  name: 'AttenDetail',
  props:{
    singleExamine: Object,
    isShowModal: Boolean
  },
  components: {
    ExportFile
  },
  watch: {
    'isShowModal': function(){
      if(this.isShowModal){
        this.getDetailList()
      }
    }
  },
  data() {
    return {
      loading: true,
      detailId: '',
      detailTotal: 0,
      detailCurrent: 1,
      detailParams: {},
      detailTableColumns:[...detailTitle],
      exportParams: {
        driverId: this.singleExamine.driverId,
        statDay: this.singleExamine.statDay
      },
      detailTableData: [],
      detailPageSize: 10,
      detailDesc: {
        driver: '',
        driverId: '',
        statDay: '',
        examineDay: '',
        dayNumber: '',
      },
    }
  },
  methods: {
    changeDetailPage(val) {
      this.detailCurrent = val;
      this.getDetailList();
    },
    getDetailList() {
      this.detailDesc = {...this.singleExamine};
      let params = {
        driverId: this.singleExamine.driverId, // 查看考勤明细入参由driverUuid转为driverId
        month: this.singleExamine.statDay,
        currPage: this.detailCurrent,
        pageSize: this.detailPageSize
      };
      this.loading = true
      attendanceDetailList(params).then(res => {
        this.detailTotal = res.data.data.totalCount;
        this.detailTableData = res.data.data.list;
        this.loading = false
      })
    },
    changeDetailPageSize(val){
      this.detailPageSize = val;
      this.getDetailList();
    }
  }
}
</script>
<style lang="less" scoped>
  .attendance-modal-detail-desc {
    display: flex;
    li {
      font-size: 18px;
      padding: 5px;
    }
  }
  .table-spin-wrap{
        position: relative;
        border: 1px solid #e8eaec;
    }
  .table-spin-icon-load{
      animation: ani-table-spin 1s linear infinite;
  }
  @keyframes ani-table-spin {
      from { transform: rotate(0deg);}
      50%  { transform: rotate(180deg);}
      to   { transform: rotate(360deg);}
  }
</style>