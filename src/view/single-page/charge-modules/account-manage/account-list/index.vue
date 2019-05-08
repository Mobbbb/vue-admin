<!--充电站-配置管理-充电账户管理列表-wx-->
<template>
  <div>
    <SearchList :inputList="inputList" @on-search="queryData" @on-reset="clearQueryData"></SearchList>
    <VTable
      :total="pageObj.total"
      :current="pageObj.current"
      :pageSize="pageObj.pageSize"
      :parColumns="parColumns"
      :parTableData="tableData"
      @sort="sort"
      @selectObj="selectObj"
      @changePage="changePage"
      @changePageSize="changePageSize"
      class="top15"
    ></VTable>
  </div>
</template>
<script>
import VTable from "_a/v-table/v-table";
import { returnFields,inputList,pageObj,searchData } from "./fields";
import { axiosAccountList } from "@/api/charge.js";
export default {
  name: "chargeAccountList",
  components: {
    VTable
  },
  data() {
    return {
      searchData,
      pageObj,
      inputList,
      parColumns: [],
      tableData: []
    };
  },
  created() {
    Object.entries(returnFields(this)).forEach(([key, value]) => {
      this.parColumns.push(value);
    });
  },
  mounted() {
    this.getList(this.searchData);
    // 缓存
    if(this.inputList[5].cascaderList.length===0){
      let operatorList = localStorage.getItem('pcOperatorList')||[]
      JSON.parse(operatorList).forEach(item=>{
        this.inputList[5].cascaderList.push(item)
      })
    }
  },
  methods: {
    // 条件搜索后回调方法
    queryData(data) {
      // 点击查询
      this.pageObj.current = 1;
      delete data.provinceID
      delete data.cityID

      for(let key in this.searchData){
        delete this.searchData[key]
      }
      for(let key in data){
        this.searchData[key] = data[key]
      }
      this.getList(data);
    },
    clearQueryData() {
      // 点击清空
      this.pageObj.current = 1;
      for(let key in this.searchData){
        delete this.searchData[key]
      }
      this.getList();
    },
    sort: function() {},
    selectObj: function() {},
    changePage: function(val) {
      this.pageObj.current = val;
      this.getList(this.searchData);
    },
    changePageSize: function(val) {
      this.pageObj.pageSize = val;
      this.getList(this.searchData);
    },
    // 获取列表
    getList: function(obj) {
      this.$store.commit("changeLoadingFlag", true);
      let that = this;
      let params = {
        pageSize: this.pageObj.pageSize,
        currPage: this.pageObj.current
      };
      if (obj) {
        for (let key in obj) {
          params[key] = obj[key];
        }
      }

      axiosAccountList(params).then(res => {
        let resdata = res.data.data
        this.tableData = resdata && resdata.list || []
        this.pageObj.total = resdata && resdata.totalCount
        this.$store.commit('changeLoadingFlag', false)
      });
    }
  }
};
</script>

