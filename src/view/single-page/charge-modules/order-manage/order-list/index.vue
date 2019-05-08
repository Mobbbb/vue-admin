<!--充电站-配置管理-订单管理列表-wx-->
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
import { returnFields, inputList,searchData,pageObj } from "./fields";
import { axiosAllBrandList, axiosOrderList } from "@/api/charge.js";
import { timeFormat } from "@/libs/util";
export default {
  name: "chargeOrderList",
  components: {
    VTable
  },
  data() {
    return {
      searchData,
      inputList,
      pageObj,
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
    let nowDate = new Date();
    let nowY = nowDate.getFullYear();
    let nowM = nowDate.getMonth() + 1;
    let nowD = nowDate.getDate();
    // 默认展示今天的订单
    let axiosDate = nowY + "-" + (nowM > 9 ? nowM :( "0" + nowM)) + "-" + (nowD > 9 ? nowD : ("0" + nowD))+' 00:00:00';
    
    if(Object.keys(this.searchData).length===0){
      this.searchData.startDate = axiosDate
      this.searchData.endDate = axiosDate
      this.inputList[7].value = [axiosDate,axiosDate]
    }
    this.getList(this.searchData);
    this.getAllBrandList();
    // 产品需求：只能选择今天之前的时间
    
    this.inputList[7].options = {
      disabledDate(date) {
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        return (
          y > nowY ||
          (y === nowY && m > nowM) ||
          (y === nowY && m === nowM && d > nowD)
        );
      }
    };
  },
  methods: {
    // 获取所有品牌列表,并整理到搜索列表的品牌下拉中
    getAllBrandList() {
      axiosAllBrandList({}).then(res => {
        let resdata = res.data.data || [];
        this.inputList[5].dropList.splice(0,this.inputList[5].dropList.length)
        resdata.forEach(item => {
          this.inputList[5].dropList.push({
            value: item.brandName,
            label: item.brandName
          });
        });
      });
    },
    // 条件搜索后回调方法
    queryData(data) {
      // 点击查询
      this.pageObj.current = 1;
      // 时间戳转日期格式，并删除原有时间戳
      data.d && (data.startDate = timeFormat(data.d, "yyyy-mm-dd"));
      data.a && (data.endDate = timeFormat(data.a, "yyyy-mm-dd"));
      delete data.d;
      delete data.a;

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
        // 选择当天，把结束时间改为24点
        obj.endDate && (obj.endDate = obj.endDate.replace('00:00:00','24:00:00'))
        for (let key in obj) {
          params[key] = obj[key];
        }
      }
      axiosOrderList(params).then(res => {
        let resdata = res.data.data;
        this.tableData = (resdata && resdata.list) || [];
        this.pageObj.total = resdata && resdata.totalCount;
        this.$store.commit("changeLoadingFlag", false);
      });
    }
  }
};
</script>

