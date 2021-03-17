<!--营销管理-活动管理-wx-->

<template>
  <div class="appidenty">
    <SearchList :inputList="inputList" @on-search="queryData" @on-reset="clearQueryData">
      <Checkbox slot="extendInput" v-model="searchData.isInclude">包含</Checkbox>
    </SearchList>
    <Button type="primary" @click="$router.push('/marketing/new-activity')" v-hasAuth="''">新建活动</Button>
    <VTable
      :total="pageObj.total"
      :current="pageObj.current"
      :pageSize="pageObj.pageSize"
      :parColumns="parColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
      class="top15"
    ></VTable>
    <Modal v-model="isRecordModal" cancel-text width="900" title="操作记录">
      <Table border :columns="recordColumns" :data="recordData"></Table>
    </Modal>
  </div>
</template>
<script>
import VTable from "_a/v-table/v-table";
import { returnFields, cacheData } from "./fields";
import { getWholeRegion } from "@/api/common"; // 活动类型
import { axiosPageList } from "@/api/market"; 
import { cpTranslate } from "@/libs/tools";
import { timeFormat } from "@/libs/util";
import {
  axiosPriceList,
  axiosAddPrice,
  axiosEditPrice,
  axiosQueryHasPriceCity,
  axiosQueryHasPriceSupplier,
  axiosQueryHasCoopCity,
  axiosAllBrandList
} from "@/api/charge.js";
export default {
  name: "chargePriceControl",
  components: {
    VTable
  },
  data() {
    return {
      ...cacheData,
      isRecordModal: false, //操作记录弹窗
      recordPageObj: {
        total: 0,
        current: 1,
        pageSize: 10
      },
      recordData: [] //操作记录数据
    };
  },
  created() {
    this.parColumns.length === 0 &&
      Object.entries(returnFields(this)).forEach(([key, value]) => {
        this.parColumns.push(value);
      });
  },
  computed: {},
  mounted() {
    this.getList(this.searchData, true);
    // 以下列表因缓存问题，需判断是否有数据在决定是否请求数据
    this.inputList[3].cascaderList.length === 0 && this.getCityList();
  },
  methods: {
    // 获取城市列表
    getCityList() {
      this.inputList[3].cascaderList.splice(
        0,
        this.inputList[3].cascaderList.length
      );
      // 优先从local中获取数据
      let cityList = localStorage.getItem("countryProvinceCityList");
      if (cityList) {
        this.inputList[3].cascaderList.push(...JSON.parse(cityList));
        return false;
      }
      getWholeRegion({}).then(res => {
        if (res.data.success) {
          let list = cpTranslate(res.data.data, "", "", "citys");
          list.forEach(item => {
            item.children.unshift({
              label: "全部",
              value: "1"
            });
          });
          list.unshift({
            label: "全部",
            value: "1",
            children: []
          });
          this.inputList[3].cascaderList.push(...list);
          // 因列表获取数据较多且不会变动，存入本地
          localStorage.setItem("countryProvinceCityList", JSON.stringify(list));
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    // 条件搜索后回调方法
    queryData(data) {
      // 城市数据组装
      if (data.provinceId === "1") {
        // 表示选了全国
        data.cityId = "1";
      } else if (data.cityId === "1") {
        let citys = "";
        // 如果城市code是'1'，说明是全部城市，把该省份所有城市列表取出给后台
        var provinceObj = this.inputList[3].cascaderList.filter(function(item) {
          return item.value === data.provinceId;
        });
        provinceObj[0].children.forEach(city => {
          citys += city.value + ",";
        });
        data.cityId = citys.slice(2, citys.length - 1);
      }
      // 开始时间、结束时间数据
      data.beginTime &&
        (data.beginTime = timeFormat(data.beginTime, "yyyy-mm-dd"));
      data.endTime && (data.endTime = timeFormat(data.endTime, "yyyy-mm-dd"));
      // 是否包含
      data.isInclude = this.searchData.isInclude;
      // 点击查询
      this.pageObj.current = 1;
      for (let key in this.searchData) {
        delete this.searchData[key];
      }
      for (let key in data) {
        this.searchData[key] = data[key];
      }
      this.getList(data);
    },
    clearQueryData() {
      // 点击清空
      this.pageObj.current = 1;
      for (let key in this.searchData) {
        delete this.searchData[key];
      }
      this.$set(this.searchData, "isInclude", false);
      this.getList();
    },
    changePage(val) {
      this.pageObj.current = val;
      this.getList(this.searchData);
    },
    changePageSize(val) {
      this.pageObj.pageSize = val;
      this.getList(this.searchData);
    },
    // 获取列表
    getList(obj, isLoading) {
      isLoading && this.$store.commit("changeLoadingFlag", true);
      let that = this;
      let params = {...obj};
      params.pageSize = this.pageObj.pageSize;
      params.currPage = this.pageObj.current;
      
      axiosPageList(params).then(res => {
        if (res.data.success) {
          let resData = res.data.data
          let list = (resData && resData.list) || [];
          this.tableData.splice(0,this.tableData.length)
          this.tableData.push(...list)
          this.$store.commit("changeLoadingFlag", false);
          this.pageObj.total = resData && resData.totalCount;
        } else {
          that.$Message.error(res.data.msg);
        }
      })
    }
  }
};
</script>
<style lang="less">
.add-price-model .widthhalf {
  width: 50%;
}
.left15 {
  display: inline-block;
  margin-left: 15px;
}
</style>
<style scope>
.total-price {
  width: 50%;
  display: inline-block;
}
</style>

