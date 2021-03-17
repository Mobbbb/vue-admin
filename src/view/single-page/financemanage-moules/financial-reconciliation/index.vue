<template>
  <div class="mapdata">
    <VTable
      :total="total"
      :current="currPage"
      :pageSize="pageSize"
      :isShowPage="false"
      :parColumns="parColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
      style="margin-top: 25px;">
    </VTable>
  </div>
</template>
<script>
  import VTable from '_a/v-table/v-table'
  import {returnFields } from './index'
  import { channelList } from '@/api/finance'

  export default {
    name: "reconciliation",
    data() {
      return {
        ...returnFields(this),
        searchParams: {},
        tableData: [],
        parColumns: []

      };
    },
    created() {},
    mounted() {
      Object.entries(this.columns).forEach(([key, value])=> {this.parColumns.push(value)})
      this.getTableList();
    },
    methods: {
      getTableList: function(){ // 获取表格数据
        this.$store.commit('changeLoadingFlag', true);
        channelList().then(res => {
          this.tableData = res.data.data;
          this.total = res.data.totalCount;
          this.$store.commit('changeLoadingFlag', false)
        })
      },
      changePage(val){
        this.currPage = val;
        this.getTableList();
      },
      changePageSize(val){
        this.pageSize = val;
        this.getTableList();
      },
    },
  };
</script>
