<!--充电站-配置管理-定价管理-wx-->

<template>
  <div class="appidenty">
    <SearchList :inputList="inputList" @on-search="queryData" @on-reset="clearQueryData"></SearchList>
    <ExportFile
      :isDisabled="isExportBtn"
      exportUrl="/charging/price/export"
      exportFileName="定价管理表.xlsx"
      :queryData="searchData"
      style="margin-right:20px;"
      v-hasAuth="'price-control-export'"
    ></ExportFile>
    <Button type="primary" @click="addlistem" v-hasAuth="'price-control-add'">新增价格</Button>
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
    <!-- 弹框 -->
    <modal
      :mask-closable="false"
      v-model="newMobel"
      :title="editorModal?'编辑':'新建'"
      @on-cancel="formReset('addPriceParams')"
      class="add-price-model"
    >
      <Form
        ref="addPriceParams"
        :model="addPriceParams"
        :rules="addPriceParamsRule"
        :label-width="100"
      >
        <FormItem label="城市 : " prop="cityName">
          <Select
            v-show="!editorModal"
            v-model="addPriceParams.cityName"
            placeholder="请选择城市"
            class="widthhalf"
          >
            <Option
              v-for="city in cityList"
              :value="city.cityName"
              :key="city.cityId"
            >{{city.cityName}}</Option>
          </Select>
          <span v-show="editorModal">{{addPriceParams.cityName}}</span>
        </FormItem>
        <FormItem label="品牌: " prop="supplierId">
          <Select
            v-show="!editorModal"
            v-model="addPriceParams.supplierId"
            placeholder="请选择品牌"
            class="widthhalf"
          >
            <Option
              v-for="supplier in supplierList"
              :value="supplier.supplierId"
              :key="supplier.supplierId"
            >{{supplier.brandName}}</Option>
          </Select>
          <span v-show="editorModal">{{addPriceParams.brandName}}</span>
        </FormItem>
        <FormItem label="电费 : " prop="chargingPrice">
          <Input
            @on-blur="formatVal('chargingPrice')"
            v-model="addPriceParams.chargingPrice"
            type="number"
            :number="true"
            placeholder="请输入电费"
            class="widthhalf"
          />
          <span class="left15">元/度</span>
        </FormItem>
        <FormItem label="服务费 : " prop="servicePrice">
          <Input
            @on-blur="formatVal('servicePrice')"
            v-model="addPriceParams.servicePrice"
            type="number"
            :number="true"
            placeholder="请输入服务费"
            class="widthhalf"
          />
          <span class="left15">元/度</span>
        </FormItem>
        <FormItem label="T3单价 : ">
          <span class="total-price">{{t3Price}}</span>
          <span class="left15">元/度</span>
        </FormItem>
        <FormItem label="启用时间 : " prop="startTime">
          <DatePicker
            v-if="changeTime"
            @on-change="getStartTime"
            v-model="addPriceParams.startTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            :editable="false"
            placeholder="请选择时间"
            style="width: 200px"
          ></DatePicker>
          <div v-else>
            <span class="total-price">{{addPriceParams.startTime}}</span>
            <Button
              style="color:#2d8cf0;"
              type="text"
              @click="changeTime=true;addPriceParams.startTime=''"
            >修改时间</Button>
          </div>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="newMobel = false;formReset('addPriceParams')">取消</Button>
        <Button type="primary" @click="addSubmit('addPriceParams')">确认</Button>
      </div>
    </modal>
  </div>
</template>
<script>
import VTable from "_a/v-table/v-table";
import { returnFields, inputList, addPriceParamsRule,supplierList,cityList,searchData,pageObj } from "./fields";
import ExportFile from "_a/export-file/exportFile";
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
    VTable,
    ExportFile
  },
  data() {
    return {
      searchData,
      inputList,
      addPriceParamsRule,
      supplierList,
      cityList,
      pageObj,
      editorModal: false,
      newMobel: false, //新建弹出框
      isExportBtn: true, //导出按钮是否禁用，true禁用，false可用
      changeTime: false, //是否修改时间
      startTime: "", //默认启用时间。新增：当前时间，编辑：编辑时间
      parColumns: [],
      tableData: [],
      addPriceParams: {
        //新增编辑字段
        cityName: "", // 城市（已开通城市）
        supplierId: "", // 供应商（合作的）
        chargingPrice: "", // 电费
        servicePrice: "", // 服务费
        startTime: "" // 启用时间(默认当前时间)
      }
    };
  },
  created() {
    Object.entries(returnFields(this)).forEach(([key, value]) => {
      this.parColumns.push(value);
    });
  },
  computed: {
    t3Price() {
      return (
        (
          Number(this.addPriceParams.chargingPrice) +
          Number(this.addPriceParams.servicePrice)
        ).toFixed(2) || ""
      );
    }
  },
  mounted() {
    this.getList(this.searchData, true);
    // 以下列表因缓存问题，需判断是否有数据在决定是否请求数据
    this.getSupplierList();
    this.getPriceCityList();
    this.getCoopCityList();
    this.getAllBrandList();
  },
  methods: {
    // 获取启用所有品牌列表,给新增用
    getAllBrandList() {
      axiosAllBrandList({ status: 1 }).then(res => {
        this.supplierList = res.data.data || [];
      });
    },
    // 获取开通合作城市下拉
    getCoopCityList() {
      axiosQueryHasCoopCity({}).then(res => {
        this.cityList = res.data.data || [];
      });
    },
    // 获取已设置价格的城市下拉
    getPriceCityList() {
      axiosQueryHasPriceCity({}).then(res => {
        let resData = res.data.data || [];
        this.inputList[0].dropList.splice(0,this.inputList[0].dropList.length)
        resData.forEach(city => {
          this.inputList[0].dropList.push({
            label: city.cityName,
            value: city.cityId
          });
        });
      });
    },
    // 获取供应商下拉
    getSupplierList() {
      axiosQueryHasPriceSupplier({}).then(res => {
        let resData = res.data.data || [];
        this.inputList[1].dropList.splice(0,this.inputList[1].dropList.length)
        resData.forEach(city => {
          this.inputList[1].dropList.push({
            label: city.brandName,
            value: city.supplierId
          });
        });
      });
    },
    // 保留小数点后2位
    formatVal(key) {
      let val = this.addPriceParams[key].toFixed(2);
      this.$set(this.addPriceParams, key, val);
    },
    // 选择时间将格式化时间赋值给对应变量
    getStartTime(formVal) {
      this.addPriceParams.startTime = formVal;
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
    // 新增、修改提交
    addSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.addPriceParams));
          this.cityList.forEach(city => {
            city.cityName === params.cityName && (params.cityId = city.cityId);
          });

          // 计算T3单价，电费+服务费
          params.price = this.t3Price;
          !params.startTime && (params.startTime = this.startTime);
          // 如果是编辑，调用编辑
          if (this.editorModal) {
            axiosEditPrice(params).then(res => {
              this.getList();
              this.newMobel = false;
              this.$Message.success(res.data.msg);
              this.formReset("addPriceParams");
            });
          } else {
            // 否则是新增，调用新增
            axiosAddPrice(params).then(res => {
              this.getList();
              this.newMobel = false;
              this.$Message.success(res.data.msg);
              this.formReset("addPriceParams");
            });
          }
        }
      });
    },
    formReset(name) {
      this.$refs[name].resetFields();
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
    // 获取列表
    getList: function(obj, isLoading) {
      isLoading && this.$store.commit("changeLoadingFlag", true);
      let that = this;
      let status = null;
      if (obj) {
        if (obj.status || obj.status == 0) {
          status = obj.status;
        }
      }
      let params = {
        cityId: (obj && obj.cityId) || null,
        supplierId: (obj && obj.supplierId) || null,
        status: status,
        pageSize: this.pageObj.pageSize,
        currPage: this.pageObj.current
      };
      axiosPriceList(params).then(res => {
        let resdata = res.data.data;
        this.tableData = (resdata && resdata.list) || [];
        // 需求：列表为空，禁用导出
        this.isExportBtn = this.tableData.length === 0 ? true : false;
        this.pageObj.total = resdata && resdata.totalCount;
        this.$store.commit("changeLoadingFlag", false);
      });
    },
    // 点击新增
    addlistem: function() {
      // 控制弹窗和新增编辑状态
      this.editorModal = false;
      this.changeTime = false;
      this.newMobel = true;
      // 新建时间为当前时间
      let nowDate = new Date().getTime();
      this.startTime = timeFormat(nowDate, "yyyy-mm-dd");
      this.addPriceParams.startTime = timeFormat(nowDate, "yyyy-mm-dd");
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

