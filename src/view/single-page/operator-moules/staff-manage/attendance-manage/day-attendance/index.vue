<template>
  <div>
      <div class="day-operate-wrap">
        <SearchList :inputList="inputList" @on-search="queryData" @on-reset="clearQueryData"></SearchList>
        <ExportFile 
          exportUrl='/admin/driver/examine/export' 
          exportFileName='日考勤列表.xlsx' 
          :queryData='queryAjaxPramas'
          v-hasAuth="'attendance-manage-dayExport'">
        </ExportFile>
      </div>
      <VTable
        style="margin-top: 20px;"
        class="staff-table-container"
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
</template>

<script>
import {attendanceDayList} from '@/api/driver.js';
import {tableTitle, dayPageData, inputList} from './fields.js';
import ExportFile from '_a/export-file/exportFile';

export default {
  name: 'DayAttendance',
  components: {
    ExportFile
  },
  created() {
    this.getTableColumns();
    this.getList();
    this.inputList = JSON.parse(JSON.stringify(inputList))
    this.inputList[0].cascaderList = JSON.parse(localStorage.getItem('provinceCityList'))
  },
  data() {
    return {
      ...dayPageData,
      inputList
    }
  },
  methods: {
    queryData(data) { // 点击查询
      this.current = 1
      this.queryAjaxPramas = data
      this.getList()
    },
    clearQueryData() { // 点击清空
      this.queryAjaxPramas = {}
      this.current = 1
      this.getList()
    },
    getList() {
      let params = {
        currPage: this.current,
        pageSize: this.pageSize
      };
      let obj = Object.assign(params, this.queryAjaxPramas);
      attendanceDayList(obj).then(res => {
        this.total = res.data.data.totalCount;
        this.current = res.data.data.currPage !== 0 ?  res.data.data.currPage : 1;
        this.pageSize = res.data.data.pageSize;
        this.tableData = res.data.data.list;
        this.$store.commit('changeLoadingFlag', false)
      })
    },
    getTableColumns () {
      this.tableColumns = [];
      this.tableColumns = [...tableTitle];
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getList();
    },
    changePage (val) {
      this.current = val;
      this.getList();
    }
  }
}
</script>
<style lang="less">

</style>