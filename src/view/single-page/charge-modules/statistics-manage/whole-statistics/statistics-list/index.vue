<!--统计管理-整体统计-列表-wx-->
<template>
  <div class="statistics-list">
    <SearchList :inputList="inputList" @on-search="queryData" @on-reset="clearQueryData"></SearchList>
    <ExportFile
      exportUrl="/admin/driver/examine/export"
      exportFileName="月统计表.xlsx"
      :queryData="queryAjaxPramas"
    ></ExportFile>
    <VTable
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :isLoading="isLoading"
      :parColumns="parColumns"
      :parTableData="tableDataCom"
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
import { returnFields } from "./fields";
import ExportFile from "_a/export-file/exportFile";
import {
  protocolListdata,
  protocolSave,
  protocolDetail,
  protocolEdit
} from "@/api/configData.js";
import { timeFormat } from "@/libs/util";
export default {
  name: "agreementControl",
  components: {
    VTable,
    ExportFile
  },
  data() {
    return {
      queryAjaxPramas: {},
      identifys: "",
      total: 0,
      current: 1,
      pageSize: 10,
      isLoading: true,
      tableColumns: [],
      agreementColumns: [],
      parColumns: [],
      tableData: [],
      protocolLink: "",
      editorModal: false,
      inputList: [
        {
          name: "drop-input",
          bind_key: "status",
          placeholder: "请选择品牌",
          dropList: [
            {
              value: 0,
              label: "品牌1"
            },
            {
              value: 1,
              label: "品牌2"
            }
          ],
          value: "",
          title: "品牌：",
          titleWidth: 60,
          inputWidth: 150, // input框的宽度
          key: "6",
          isHide: false
        },
        {
          name: "cascader-input", // 文本输入框名
          bind_key: ["provinceId", "cityId"], // 返回数据的key名
          placeholder: "请选择市/运营商",
          value: [], // 绑定返回数据
          changeOnSelect: true, //级联是否可以每级选择
          cascaderList: [
            {
              value: "beijing",
              label: "北京",
              children: [
                {
                  value: "gugong",
                  label: "运营商1"
                },
                {
                  value: "tiantan",
                  label: "运营商2"
                }
              ]
            },
            {
              value: "jiangsu",
              label: "江苏",
              children: [
                {
                  value: "nanjing",
                  label: "运营商3"
                },
                {
                  value: "suzhou",
                  label: "苏州商"
                }
              ]
            }
          ], // 级联列表
          title: "市/运营商：", // 展示的字段名
          titleWidth: 70, // 展示的字段名的宽度
          inputWidth: 150, // input框的宽度
          key: "6", // 该文本框的唯一标识，用于匹配该文本框是否展示
          isHide: false, // false: 不隐藏 / true: 隐藏
          changeOnSelect: true
        },
        {
          name: "date-input", // 文本输入框名
          bind_key: "date", // 返回数据的key名
          placeholder: "请选择日期",
          value: "", // 用于数据绑定
          title: "选择日期：", // 展示的字段名
          titleWidth: 60, // 展示的字段名的宽度
          inputWidth: 200, // input框的宽度
          key: "6", // 该文本框的唯一标识，用于匹配该文本框是否展示
          isHide: false // false: 不隐藏 / true: 隐藏
        }
      ] //搜索列表
    };
  },
  created() {
    Object.entries(returnFields(this)).forEach(([key, value]) => {
      this.parColumns.push(value);
    });
  },
  mounted() {
    this.getList();
  },
  computed: {
    tableDataCom() {
      let tableData = this.tableData;
      tableData.forEach((item, index) => {
        item.protocolName =
          item.protocolName == 1
            ? "乘客端"
            : item.protocolName == 2
            ? "司机端"
            : "全部";
        item.protocolLink = item.protocolLink ? item.protocolLink : "暂无";
        item.updatedOn = item.updatedOn ? item.updatedOn : "暂无";
        item.updatedBy = item.updatedBy ? item.updatedBy : "暂无";
        item.idxs = index + 1;
      });
      return tableData;
    }
  },
  methods: {
    queryData(data) {
      // 点击查询
      this.current = 1;
      this.queryAjaxPramas = {};
      this.searchData = data;
      Object.keys(this.searchData).map(key => {
        let item = this.searchData[key];
        if (item || item === 0) {
          this.queryAjaxPramas[key] = item;
        }
      });
      this.getList();
    },
    clearQueryData() {
      // 点击清空
      this.queryAjaxPramas = {};
      this.current = 1;
      this.searchData = {};
      this.getList();
    },
    search: function() {
      let protocolName = this.identifys;
      this.current = 1;
      this.pageSize = 10;
      this.getList(protocolName);
    },
    reset: function() {
      this.identifys = "";
      this.getList();
    },
    sort: function() {},
    selectObj: function() {},
    changePage: function(val) {
      this.current = val;
      this.getList();
    },
    changePageSize: function(val) {
      this.pageSize = val;
      this.getList();
    },
    getList: function(protocolName) {
      let that = this;
      let data = {
        protocolName: protocolName,
        pageSize: this.pageSize,
        currPage: this.current
      };
      protocolListdata(data).then(res => {
        let resdata = res.data.data;
        this.tableData = (resdata && resdata.list) || [];
        this.total = resdata && resdata.totalCount;
        this.$store.commit("changeLoadingFlag", false);
      });
    }
  }
};
</script>


