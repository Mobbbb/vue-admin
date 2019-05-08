<!--充电站-配置管理-城市管理-wx-->

<template>
  <div class="appidenty">
    <SearchList :inputList="inputList" @on-search="queryData" @on-reset="clearQueryData"></SearchList>
    <Button type="primary" @click="newMobel = true;" v-hasAuth="'charge-city-control-add'">新增城市</Button>
    <VTable
      :total="pageObj.total"
      :current="pageObj.current"
      :pageSize="pageObj.pageSize"
      :isLoading="isLoading"
      :parColumns="parColumns"
      :parTableData="tableData"
      @sort="sort"
      @selectObj="selectObj"
      @changePage="changePage"
      @changePageSize="changePageSize"
      class="top15"
    ></VTable>
    <!-- 弹框 -->
    <modal
      v-model="newMobel"
      :mask-closable="false"
      title="新建"
      class="add-city-model"
      @on-cancel="formReset('addCityParams')"
    >
      <Form
        ref="addCityParams"
        :model="addCityParams"
        :rules="addCityParamsRule"
        :label-width="100"
      >
        <FormItem label="城市" prop="city">
          <al-cascader level="1" ref="alCascader" v-model="addCityParams.city" class="widthhalf"/>
        </FormItem>
        <FormItem label="品牌" prop="supplierId">
          <Select v-model="addCityParams.supplierId" placeholder="请选择品牌" class="widthhalf">
            <Option
              v-for="brand in brandList"
              :value="brand.supplierId"
              :key="brand.supplierId"
            >{{brand.brandName}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="newMobel = false;formReset('addCityParams')">取消</Button>
        <Button type="primary" @click="addSubmit('addCityParams')">确认</Button>
      </div>
    </modal>
  </div>
</template>
<script>
import VTable from "_a/v-table/v-table";
import { returnFields, inputList, addCityParamsRule,brandList,pageObj,searchData } from "./fields";
import {
  axiosCityList,
  axiosAddCity,
  axiosAllBrandList,
  axiosQueryHasCoopCity
} from "@/api/charge.js";
export default {
  name: "chargeCityControl",
  components: {
    VTable
  },
  data() {
    return {
      searchData,
      inputList,
      addCityParamsRule,
      brandList,
      pageObj,
      isLoading: true,
      newMobel: false, //新建弹出框
      parColumns: [],
      tableData: [],
      addCityParams: {
        //新增编辑字段
        city: [], // 城市
        supplierId: "" // 品牌
      }
    };
  },
  created() {
    Object.entries(returnFields(this)).forEach(([key, value]) => {
      this.parColumns.push(value);
    });
  },
  mounted() {
    // 缓存
    this.getList(this.searchData, true);
    this.getAllBrandList();
    // 获取开通合作的城市
    this.getCoopCityList()
  },
  methods: {
    // 获取开通合作城市下拉
    getCoopCityList() {
      axiosQueryHasCoopCity({}).then(res => {
        let resData = res.data.data || [];
        this.inputList[0].dropList.splice(0,this.inputList[0].dropList.length)
        resData.forEach((item)=>{
          this.inputList[0].dropList.push({
            value: item.cityId,
            label: item.cityName
          })
        })
      });
    },
    // 获取所有品牌列表,并整理到搜索列表的品牌下拉中
    getAllBrandList() {
      console.log(1)
      axiosAllBrandList({ status: 1 }).then(res => {
        let resdata = res.data.data || [];
        this.inputList[1].dropList.splice(0,this.inputList[1].dropList.length)
        this.brandList.splice(0,this.brandList.length)
        resdata.forEach(item => {
          this.brandList.push(item)
          this.inputList[1].dropList.push({
            value: item.supplierId,
            label: item.brandName
          });
        });
      });
    },
    // 条件搜索后回调方法
    queryData(data) {
      // 点击查询
      this.pageObj.current = 1;
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
    // 新增提交
    addSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let that = this;
          let params = {};
          params.supplierId = this.addCityParams.supplierId;
          let cityList = this.addCityParams.city;
          params.cityId = cityList[1].code;
          if (cityList[1].name === "市辖区") {
            params.cityName = cityList[0].name;
          } else {
            params.cityName = cityList[1].name;
          }

          axiosAddCity(params).then(res => {
            this.getList();
            this.newMobel = false;
            this.$Message.success(res.data.msg);
            this.formReset("addCityParams");
            this.getCoopCityList()
          });
        }
      });
    },
    formReset(name) {
      this.$refs[name].resetFields();
      this.$refs.alCascader.select = []; // 清空页面上的展示数据*/
    },
    selectObj: function() {},
    changePage: function(val) {
      this.pageObj.current = val;
      this.getList(this.searchData);
    },
    changePageSize: function(val) {
      this.pageObj.pageSize = val;
      this.getList(this.searchData);
    },
    // 获取列表信息
    getList: function(obj, isLoading) {
      isLoading && this.$store.commit("changeLoadingFlag", true);
      let that = this;
      let params = {
        cityId: (obj && obj.cityId) || "",
        supplierId: (obj && obj.supplierId) || "",
        pageSize: this.pageObj.pageSize,
        currPage: this.pageObj.current
      };
      axiosCityList(params).then(res => {
        let resdata = res.data.data;
        this.tableData = (resdata && resdata.list) || [];
        this.pageObj.total = resdata && resdata.totalCount;
        this.$store.commit("changeLoadingFlag", false);
      });
    }
  }
};
</script>
<style lang="less">
.add-city-model .widthhalf {
  width: 50%;
}
</style>

