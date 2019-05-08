<template>
  <div class="month-attendance-container">
    <SearchList 
      ref="searchList" 
      :inputList="inputList" 
      @on-search="queryData" 
      @on-reset="clearQueryData">
    </SearchList>
    <div>
      <ExportFile 
        :queryData='queryAjaxPramas'
        exportUrl='/admin/driver/examine/exportMonth'
        exportFileName='月考勤列表.xlsx'
        v-hasAuth="'attendance-manage-monthExport'"> 
      </ExportFile>
      <VTable
        style="margin-top: 20px;"
        :total="total"
        :current="current"
        :pageSize="pageSize"
        :isLoading="isLoading"
        :parColumns="tableColumns"
        :parTableData="tableData"
        @changePage="changePage"
        @changePageSize="changePageSize">
      </VTable>
    </div>
    <!--<div style="margin: 0 0 10px 0; text-align: left;" v-show='isShowModal'>
        <Button  @click="isShowModal=false" :size='"large"'>返回</Button>
    </div>-->
    <Modal
      v-model="isShowModal"
      title="考勤明细"
      width="1000"
      :mask-closable="false"
      footer-hide>
      <AttenDetail :isShowModal="isShowModal" :singleExamine='detailData'></AttenDetail>
    </Modal>
  </div>
</template>

<script>
import AttenDetail from './detail';
import {attendanceMonthList} from '@/api/driver.js';
import {tableTitle, monthPageData, inputList} from './fields.js'; 
import ExportFile from '_a/export-file/exportFile';

export default {
  name: 'MonthAttendance',
  components: {
    AttenDetail,
    ExportFile
  },
  data() {
    return {
      ...monthPageData,
      inputList
    }
  },
  mounted() {
    this.getTableColumns()
    this.inputList = JSON.parse(JSON.stringify(inputList))
    this.inputList[0].cascaderList = JSON.parse(localStorage.getItem('provinceCityList'))
    this.initMonth()
    this.getList()
  },
  methods: {
    queryData(data) {
      this.current = 1
      if(data.statDay) data.statDay = new Date(data.statDay).getTime()
      this.queryAjaxPramas = data
      this.getList()
    },
    clearQueryData() {
      this.current = 1
      this.initMonth()
      this.getList()
    },
    initMonth() {
      let myDate = new Date()
      let myYear = myDate.getFullYear()
      let myMonth = myDate.getMonth()
      this.inputList[4].value = myYear + '-' + myMonth + '-01'
      this.queryAjaxPramas = { statDay: Date.parse(this.inputList[4].value) }
      this.inputList[4].options = {
        disabledDate(date) {
          let year = date.getFullYear()
          let month = date.getMonth()
          return (year>myYear) || (year===myYear && month>=myMonth)
        }
      };
    },
    getList() {
      let params = {
        currPage: this.current,
        pageSize: this.pageSize
      };
      let obj = Object.assign(params, this.queryAjaxPramas);
      attendanceMonthList(obj).then(res => {
          this.total = res.data.data.totalCount;
          this.current = res.data.data.currPage !== 0 ?  res.data.data.currPage : 1;
          this.pageSize = res.data.data.pageSize;
          this.tableData = res.data.data.list;
          this.$store.commit('changeLoadingFlag', false)
      })
    },
    getTableColumns () {
      let data = [];
      let action = {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 110,
        render: (h, params) => {
          return h('div', [
            h('Button', { 
              props: {
                type: 'primary',
                size: 'small'
              },
              attrs: {
                ghost: 'ghost'
              },
              directives: [{
                name: 'hasAuth',
                value: 'attendance-manage-attendanceDetail'
              }],
              on: {
                click: () => {
                  this.detailData = {...params.row};
                  this.viewDetail();
                }
              }
            }, '考勤明细')
          ])
        }
      };
      data = [...tableTitle]
      data.push(action);
      this.tableColumns = data;
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getList();
    },
    changePage (val) {
      this.current = val;
      this.getList();
    },
    viewDetail() {
      this.isShowModal = true;
    },
    exportFile() {

    }
  }
}
</script>
<style lang="less">
.day-end-number {
  .ivu-form-item-content {
    margin: 0 !important;
  }
}
</style>