<!--定价管理-wx-->
<template>
  <div>
    <div v-show="isNothing" class="fontsize16 text-center top40">暂无数据</div>
    <div v-show="!isNothing" class="appidenty">
      <Row>
        <Col span="4" style="min-width:150px;" class="right50 bottom15">
          <area-cascader :id="id" @select-down="selectAreaDown" @init-down="selectAreaDown"></area-cascader>
        </Col>
        <!-- 因为切换站点要清空搜索条件，此处用不了公用searchList-->
        <Col span="5" style="min-width:220px;" class="right15 bottom15">
          站点名称：
          <Input v-model="searchData.stationName" placeholder="请输入站点名称" style="width:auto;"/>
        </Col>
        <Col span="5" style="min-width:220px;" class="right30 bottom15">
          站点编号：
          <Input v-model="searchData.stationCode" placeholder="请输入站点编号" style="width:auto;"/>
        </Col>
        <Col span="4" style="min-width:170px;" class="bottom15">
          <Button type="primary" class="right15" @click="queryData">搜索</Button>
          <Button @click="clearQueryData">清空</Button>
        </Col>
      </Row>

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
      ></VTable>
    </div>
  </div>
</template>
<script>
import VTable from "_a/v-table/v-table";
import { returnFields } from "./fields";
import areaCascader from "../area-cascader.vue";
import { axiosStationList } from "@/api/charge.js";
import { cpTranslate } from "@/libs/tools";
export default {
  name: "chargeStationList",
  props: {
    id: {
      type: String
    }
  },
  components: {
    VTable,
    areaCascader
  },
  data() {
    return {
      total: 0,
      current: 1,
      pageSize: 10,
      isNothing: false, //该供应商下面没有冲抵哪站列表信息
      searchData: {
        stationName: "",
        stationCode: ""
      }, //搜索条件
      areaVal: [], //区域选择
      parColumns: [],
      tableData: []
    };
  },
  created() {
    Object.entries(returnFields(this)).forEach(([key, value]) => {
      this.parColumns.push(value);
    });
  },
  methods: {
    selectAreaDown(areaList) {
      // areaList 为 false，表示该供应商查不到省市区信息，展示暂无信息
      if (areaList === false) {
        this.isNothing = true;
        return false;
      }
      this.isNothing = false;
      this.areaVal = JSON.parse(JSON.stringify(areaList));
      this.clearQueryData();
    },
    // 点击搜索回调
    queryData() {
      // 点击查询
      this.current = 1;
      this.getList(this.searchData);
    },
    clearQueryData() {
      // 点击清空
      this.current = 1;
      this.$set(this.searchData, "stationName", "");
      this.$set(this.searchData, "stationCode", "");
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
    getList: function(obj) {
      this.$store.commit("changeLoadingFlag", true);
      let that = this;
      if (!this.areaVal[1]) {
        return false;
      }
      let params = {
        supplierId: this.id,
        cityId: this.areaVal[1] || "",
        areaCode: this.areaVal[2] || "",
        pageSize: this.pageSize,
        currPage: this.current
      };
      if (obj) {
        for (let key in obj) {
          params[key] = obj[key];
        }
      }

      axiosStationList(params).then(res => {
        let resdata = res.data.data;
        this.tableData = (resdata && resdata.list) || [];
        this.total = resdata && resdata.totalCount;
        this.$store.commit("changeLoadingFlag", false);
      });
    }
  }
};
</script>
