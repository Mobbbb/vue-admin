<!--充电站管理-司机充值记录-->
<template>
  <div>
    <ul class="flex-ul" style="padding-left:15px;">
      <li>
        <span class="name-info">司机姓名</span>：
        <span class="val-info">{{driverInfo.driverName}}</span>
      </li>
      <li>
        <span class="name-info name-info-shot">司机ID</span>：
        <span class="val-info">{{driverInfo.driverId}}</span>
      </li>
      <li>
        <span class="name-info name-info-shot">手机号</span>：
        <span class="val-info">{{driverInfo.driverMobile}}</span>
      </li>
      <li>
        <span class="name-info name-info-lang">所属运营商</span>：
        <span class="val-info">{{driverInfo.agentName}}</span>
      </li>
      <li>
        <span class="name-info">所属司管</span>：
        <span class="val-info">{{driverInfo.managerDriverName}}</span>
      </li>
      <li>
        <span class="name-info name-info-shot">车型</span>：
        <span class="val-info">{{driverInfo.carLevel}}</span>
      </li>
      <li>
        <span class="name-info name-info-shot">车牌号</span>：
        <span class="val-info">{{driverInfo.plateNum}}</span>
      </li>
      <li>
        <span class="name-info">车辆VIN</span>：
        <span class="val-info">{{driverInfo.vin}}</span>
      </li>
    </ul>
    <!-- 产品说充值记录暂时放置 -->
    <!-- <Divider orientation="left">充值记录</Divider>
    <SearchList :inputList="inputList" @on-search="queryData" @on-reset="clearQueryData"></SearchList>
    <ExportFile
      exportUrl="/chargingPile/account/orderList/export"
      exportFileName="司机充值记录表.xlsx"
      :queryData="searchData"
    ></ExportFile>
    <VTable
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="parColumns"
      :parTableData="tableData"
      @sort="sort"
      @selectObj="selectObj"
      @changePage="changePage"
      @changePageSize="changePageSize"
      class="top15"
    ></VTable> -->
  </div>
</template>
<script>
import VTable from "_a/v-table/v-table";
import { returnFields,inputList } from "./fields";
import ExportFile from "_a/export-file/exportFile";
import {
  protocolListdata,
  protocolSave,
  protocolDetail,
  protocolEdit
} from "@/api/configData.js";
import { axiosAccountList, axiosDriverRechargeList } from "@/api/charge.js";
export default {
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
      total: 0,
      current: 1,
      pageSize: 10,
      searchData: {}, //搜索查询条件
      driverInfo: {}, //司机信息
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
    // 获取司机信息
    this.getDriverInfo();
    this.getList();

    // 产品需求：只能选择去年和今年的月份
    let noDdate = new Date()
    let y = noDdate.getFullYear()
    let m = noDdate.getMonth() + 1
    this.inputList[1].options = {
      disabledDate(date) {
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        return (year<(y-1)) || (year>y) || (year===y&&month>m)
      }
    };
  },
  methods: {
    // 获取司机信息
    getDriverInfo() {
      let that = this;
      let params = {
        uuid: this.id,
        pageSize: 1,
        currPage: 1
      };

      axiosAccountList(params).then(res => {
        let resdata = res.data.data
        this.driverInfo = resdata && resdata.list[0] || []
      });
    },
    queryData(data) {
      // 点击查询
      this.current = 1;
      this.searchData = data;
      this.getList(data);
    },
    clearQueryData() {
      // 点击清空
      this.current = 1;
      this.searchData = {};
      this.getList();
    },
    sort: function() {},
    selectObj: function() {},
    changePage: function(val) {
      this.current = val;
      this.getList(this.searchData);
    },
    changePageSize: function(val) {
      this.pageSize = val;
      this.getList(this.searchData);
    },
    // 获取列表
    getList(obj,id) {
      this.$store.commit("changeLoadingFlag", true);
      let that = this;
      let params = {
        driverUuid: this.id,
        pageSize: this.pageSize,
        currPage: this.current
      };
      if (obj) {
        for (let key in obj) {
          params[key] = obj[key];
        }
      }

      // axiosDriverRechargeList(params).then(res => {
      //   let resdata = res.data.data
      //   this.tableData = resdata && resdata.list || []
      //   this.total = resdata && resdata.totalCount
      //   this.$store.commit('changeLoadingFlag', false)
      // });

      // 假数据
      this.tableData = [
        {
          updateDate: "2019-09-08 11:55:06",
          payOrderType: 2,
          rechargeAmout: 500,
          payChannel: 1,
          rechargeMoneyAfter: "800"
        },
        {
          updateDate: "2019-09-08 11:55:06",
          payOrderType: "1",
          rechargeAmout: 500,
          payChannel: 1,
          rechargeMoneyAfter: "800"
        }
      ];
      this.total = 2;
      this.$store.commit("changeLoadingFlag", false);
    }
  },
  watch:{
    id(newVal){
      this.getDriverInfo();
      this.getList();
    }
  }
};
</script>
<style lang="less" scoped src="../../../charge.less"></style>