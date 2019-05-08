<!--司机订单管理-wx-->
<template>
  <div class="driver-order">
    <SearchList :inputList="inputList" @on-search="queryData" @on-reset="clearQueryData"></SearchList>
    <ExportFile
      :isDisabled="isExportBtn"
      exportUrl="/chargingPile/order/list/export"
      exportFileName="司机订单记录表.xlsx"
      :queryData="searchData"
    ></ExportFile>
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
import { returnFields, inputList,pageObj,searchData } from "./fields";
import ExportFile from "_a/export-file/exportFile";
import { axiosAllBrandList, axiosOrderList } from "@/api/charge.js";
import { timeFormat } from "@/libs/util";
export default {
  name: "chargeOrderRecord",
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  components: {
    VTable,
    ExportFile
  },
  data() {
    return {
      inputList,
      pageObj,
      searchData,
      isExportBtn: true, //导出按钮是否禁用，true禁用，false可用
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
    this.getAllBrandList();
    this.searchData.driverUuid = this.id;
    let nowDate = new Date();
    let nowY = nowDate.getFullYear();
    let nowM = nowDate.getMonth() + 1;
    let nowD = nowDate.getDate();
    // 产品需求：只能选择今天之前的时间
    this.inputList[5].options = {
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
        this.inputList[3].dropList.splice(0,this.inputList[3].dropList.length)
        resdata.forEach(item => {
          this.inputList[3].dropList.push({
            value: item.brandName,
            label: item.brandName
          });
        });
      });
    },
    // 搜索回调
    queryData(data) {
      // 点击查询
      this.pageObj.current = 1;
      // 时间戳转日期格式，并删除原有时间戳
      data.d && (data.startDate = timeFormat(data.d, "yyyy-mm-dd"));
      data.a && (data.endDate = timeFormat(data.a, "yyyy-mm-dd").replace('00:00:00','24:00:00'));
      delete data.d;
      delete data.a;
      for(let key in this.searchData){
        delete this.searchData[key]
      }
      this.searchData.driverUuid = this.id;

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
        driverUuid: this.id,
        pageSize: this.pageObj.pageSize,
        currPage: this.pageObj.current
      };
      if (obj) {
        // 选择当天，把结束时间改为24点
        for (let key in obj) {
          params[key] = obj[key];
        }
      }

      axiosOrderList(params).then(res => {
        let resdata = res.data.data;
        this.tableData = (resdata && resdata.list) || [];
        this.isExportBtn = this.tableData.length === 0 ? true : false;
        this.pageObj.total = resdata && resdata.totalCount;
        this.$store.commit("changeLoadingFlag", false);
      });
    }
  },
  watch:{
    id(newVal){
      this.getList();
    }
  }
};
</script>
<style lang="less">
.driver-order {
  .ivu-btn-ghost {
    color: #2d8cf0;
    text-decoration: underline;
  }
}
</style>


