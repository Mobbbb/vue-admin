<template>
  <div>
    <div class="searchList">
      <div class="multstyle">
        <multiSselect
          :url="companyUrl"
          query="companyName"
          data-key="companyId"
          data-label="companyName"
          @on-success="getcompany"
          :width="200"
          :titlefront="titlefront"
          ref="muselect"
        ></multiSselect>
      </div>
      <SearchList :inputList="inputList" @on-search="search" @on-reset="reset"></SearchList>
    </div>
    <VTable
      class="staff-table-container"
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :isLoading="isLoading"
      :parColumns="tableColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
      style="margin-top: 25px;"
    ></VTable>
  </div>
</template>
<script>
import VTable from "_a/v-table/v-table";
import { rechargeinputList, returnFieldsrecharge } from "../fields.js";
import { rechargeList } from "@/api/enterpriseVehicle.js";
import multiSselect from "_a/multi-select/multi-select";
export default {
  components: {
    VTable,
    multiSselect
  },
  data() {
    return {
      inputList: [],
      total: 0,
      current: 1,
      pageSize: 10,
      tableColumns: [],
      tableData: [],
      isLoading: false,
      companyUrl: "/company/wallet/list",
      searchParams: {},
      titlefront: '企业名称'
    };
  },
  created() {
    Object.entries(returnFieldsrecharge(this)).forEach(([key, value]) => {
      this.tableColumns.push(value);
    });
    this.searchParams.companyId = this.$route.params.id;
  },
  mounted() {
    this.inputList = JSON.parse(JSON.stringify(rechargeinputList));
    this.getList();
  },
  methods: {
    getcompany(value) {
      this.searchParams.companyId = value[0];
    },
    search(data) {
      for (let key in data) {
        this.searchParams[key] = data[key];
      }
      this.current = 1;
      this.getList();
    },
    reset() {
      this.searchParams = {};
      this.searchParams.companyId = this.$route.params.id;
      this.current = 1;
      this.pageSize = 10;
      this.getList();
    },
    changePage(val) {
      this.current = val;
      this.getList();
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getList();
    },
    getList() {
      let data = Object.assign(
        {},
        {
          currPage: this.current,
          pageSize: this.pageSize
        },
        this.searchParams
      );
      rechargeList(data)
        .then(res => {
          this.total = res.data.data.totalCount;
          this.tableData = res.data.data.list;
          this.$store.commit("changeLoadingFlag", false);
        })
        .catch(err => {
          this.total = 0;
          this.tableData = [];
          this.$store.commit("changeLoadingFlag", false);
        });
    }
  }
};
</script>
<style lang="less">
.searchList{
  display: flex;
  align-items: center;
  .multstyle{
    margin-right: 20px;
    margin-top: -10px;
  }
}
</style>
