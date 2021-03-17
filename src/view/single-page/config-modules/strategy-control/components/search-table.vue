<template>
  <div>
    <searchList :inputList="inputDataList" @on-search="queryList" @on-reset="handelReset"></searchList>
    <Button type="primary" @click="addnew" v-hasAuth="'strategy_control-addOrder'">新建策略</Button>
    <VTable
      :total="pageObj.total"
      :current="pageObj.current"
      :pageSize="pageObj.pageSize"
      :isLoading="isLoading"
      :parColumns="tableColumns"
      :parTableData="tableData"
      @selectObj="selectObj"
      @changePage="changePage"
      @changePageSize="changePageSize"
      class="top20"
    ></VTable>
    
  </div>
</template>
<script>
import {cancelData,deviateData,timeData,cancelColumns,deviateColumns,timeColumns} from './fields'
import VTable from "_a/v-table/v-table";
import { axiosCancelStrategyList,axiosAlarmStrategyList,axiosTimeStrategyList } from "@/api/configData.js";

export default {
  props: {
    tabNum:{
      type:String,
      default:'1'//1:取消策略2.偏离报警策略3.时间段及高峰策略
    }
  },
  components: {
    VTable
  },
  data(){
    let pageData = this.tabNum==='2'?deviateData:this.tabNum==='3'?timeData:cancelData
    return {
      ...pageData
    }
  },
  created() {
    // 表头
    let columnsFun = this.tabNum==='2'?deviateColumns:this.tabNum==='3'?timeColumns:cancelColumns
    this.tableColumns.splice(0,this.tableColumns.length)
    Object.entries(columnsFun(this)).forEach(([key, value]) => {
      this.tableColumns.push(value);
    });
    // 搜索条件
    this.inputDataList = this.inputList
  },
  mounted(){
    if(this.tableData.length===0){
      this.judgeGetList(this.searchData)
    }else{
      this.$store.commit('changeLoadingFlag', false)
    }
    // this.getCityList();
  },
  methods: {
    addnew(){
      this.$emit('addnew')
    },
    // 条件搜索后回调方法
    queryList(data) {
      // 点击查询
      this.pageObj.current = 1;
      for(let key in this.searchData){
        delete this.searchData[key]
      }
      for(let key in data){
        this.searchData[key] = data[key]
      }
      this.judgeGetList(data);
    },
    handelReset() {
      // 点击清空
      this.pageObj.current = 1;
      for(let key in this.searchData){
        delete this.searchData[key]
      }
      this.judgeGetList();
    },
    selectObj: function() {},
    changePage: function(val) {
      this.pageObj.current = val;
      this.judgeGetList(this.searchData);
    },
    changePageSize: function(val) {
      this.pageObj.pageSize = val;
      this.judgeGetList(this.searchData);
    },
    judgeGetList(data,noLoading){
      let params = {
        pageSize: this.pageObj.pageSize,
        currPage: this.pageObj.current
      };
      if (data) {
        for (let key in data) {
          params[key] = data[key];
        }
      }
      let axiosFun = this.tabNum==='2'?axiosAlarmStrategyList:this.tabNum==='3'?axiosTimeStrategyList:axiosCancelStrategyList
      
      !noLoading && this.$store.commit("changeLoadingFlag", true);
      axiosFun(params).then(res =>{
        if (res.data.success) {
          let resdata = res.data.data
          let list = resdata && resdata.list || []
          this.tableData.splice(0,this.tableData.length)
          this.tableData.push(...list)
          this.pageObj.total = resdata && resdata.totalCount
          this.$store.commit('changeLoadingFlag', false)
        }
        else{
          this.$Message.error(res.data.msg)
        }
      })
    }
  }
};
</script>