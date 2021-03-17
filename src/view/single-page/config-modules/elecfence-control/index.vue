<!--电子围栏管理-->
<template>
  <div class="carrier">
    <div class="carrier-header">
      <SearchList
        :inputList="inputList"
        @on-search="search"
        @on-reset="reset"
      ></SearchList>
      <Button
        type="primary"
        @click="popView"
        v-hasAuth="'elecfence_control-add'"
      >新建电子围栏</Button>
    </div>
    <div class="carrier-content">
      <VTable
        :total="total"
        :current="current"
        :pageSize="pageSize"
        :isLoading="isLoading"
        :parColumns="parColumns"
        :parTableData="tableData"
        @sort="sort"
        @selectObj="selectObj"
        @changePage="changePage"
        @changePageSize="changePageSize"
        style="margin-top: 25px;"
      ></VTable>
      <Float
        :floatParams="floatParams"
        :polygonPath="polygonPath"
        :uuid="uuid"
        :cityList="cityList"
        :optList='optList'
        :type="updateType"
        :title="title"
        :popView="isPop"
        :invalidEditor="invalidEditor"
        @on-confirm="confirm"
        :width="500"
      ></Float>
    </div>
  </div>
</template>

<script>
  import { returnFields, inputList, railTypeMap } from "./index";
  import { getCarrierList } from "@/api/operator-carrier";
  import VTable from "_a/v-table/v-table";
  import Float from "./float";
  import SearchList from "_a/search-list/search-list";
  import { 
    selectPen,
    getPenDetail
  } from '@/api/configData.js'
  export default {
    components: {
      VTable,
      SearchList,
      Float
    },
    data() {
      return {
        ...returnFields(this),
        title: "新建电子围栏",
        uuid: "",
        updateType: "",
        tableData: [],
        inputList: [],
        cityList: [],
        isPop: false,
        isLoading: true,
        pageSize: 10,
        currPage: 1,
        floatParams: {
          name: '',
          carrierArea: [],
          serviceType: '',
          railType: '',
          scope: '',
          getpathData: [],
          effectiveTime: '',
          failureTime: '',
          remark: '',
          status: 0
        },
        status: [
          // {
          //   value: '',
          //   label: '全部'
          // },
          {
            value: 1,
            label: '正常'
          },
          {
            value: 2,
            label: '未生效'
          },
          {
            value: 3,
            label: '失效'
          }
        ],
        optList: [
          // {
          //   value: 5,
          //   label: '全选'
          // },
          {
            value: 4,
            label: '快车'
          },
          {
            value: 2,
            label: '专车'
          },
          {
            value: 1,
            label: '出租车'
          }
        ],
        railTypeMap,
        invalidEditor: false,
        polygonPath: []
      };
    },
    mounted() {
      this.getTableList({});
      this.inputList = inputList;
      this.cityList = JSON.parse(localStorage.getItem('provinceCityList'))
      this.inputList[1].cascaderList = JSON.parse(localStorage.getItem('provinceCityList'))
      this.inputList[2].dropList = this.optList
      this.inputList[3].dropList = this.railTypeMap
      this.inputList[5].dropList = this.status
    },
    methods: {
      getTableList(params) {
        // 获取表格数据
        params.pageSize = this.pageSize;
        params.currPage = this.current;
        params.cityCode = params.cityId
        params.provinceCode = params.provinceId
        delete params.cityId
        delete params.provinceId
        selectPen(params).then(res => {
          this.tableData = (res.data.data && res.data.data.list) || [];
          this.total = (res.data.data && res.data.data.totalCount) || 0;
          this.$store.commit('changeLoadingFlag', false)
        });
      },
      popView() {
        this.isPop = true;
        this.title = "新建电子围栏";
        this.floatParams = {
          name: '',
          carrierArea: [],
          serviceType: '',
          railType: '',
          scope: '',
          getpathData: [],
          effectiveTime: '',
          failureTime: '',
          remark: '',
          status: 0
        }
        this.polygonPath = []
        this.invalidEditor = false
        this.updateType = "add";
      },
      confirm(data) {
        if (data) this.getTableList({})
        this.isPop = false
      },
      search(data) {
        this.current = 1
        this.getTableList(data)
      },
      reset(data) {
        this.current = 1
        this.getTableList(data)
      },
      sort() {},
      selectObj(val) {
        this.current = val;
        this.getTableList({});
      },
      changePage(val) {
        this.current = val;
        this.getTableList({});
      },
      changePageSize(val) {
        this.pageSize = val;
        this.getTableList({});
      }
    }
  };
</script>
<style scoped>
.carrier-header {
  margin-top: 10px;
}
</style>
