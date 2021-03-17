<template>
  <div class="container_box">
    <searchList :inputList="inputList" @on-search="queryList" @on-reset="handelReset"></searchList>
    <!-- v-hasAuth="'city_control-add'" -->
    <Button type="primary" @click="showAddModel" >新增城市</Button>
    <VTable
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="cityColumns"
      :parTableData="cityData"
      @changePage="changePage"
      @changePageSize="changePageSize"
      style="margin-top: 20px;"
    ></VTable>
    <div class="addModal">
      <Modal v-model="addModal" title="新增城市" :mask-closable="false">
        <Form :model="addCityForm" :label-width="80">
          <FormItem label="用车分类:">
            <span v-if="tabName==2">专车</span>
            <span v-if="tabName==4">快车</span>
          </FormItem>
          <FormItem label="选择城市:">
            <Cascader :data="allCitys" v-model="cityCodeList" @on-change='cascaderChange' style="width:190px"></Cascader>
            <!-- <al-cascader level="1" ref="alCascader" v-model="" /> -->
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="handleSaveCity">确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
import { cpTranslate } from "@/libs/tools";
import {
  getOpenList,
  addCity,
  turnoffCity,
  turnOnCity
} from "@/api/company-api/config.js";

import { getProvinceCityList, getWholeRegion} from "@/api/common.js";
import {pagedata} from './data.js';
export default {
  name: "express",
  props: {
    tabName: String
  },
  data() {
    return {
        allCitys: [],
        cityCodeList: [],
        loginName:this.$store.state.user.userName,
        ...pagedata,
      cityColumns: [
        {
          title: "城市名",
          minWidth: 160,
          key: "cityName"
        },
        {
          title: "所属省份",
          minWidth: 160,
          key: "provinceName"
        },
        {
          title: "开通状态",
          key: "status",
          minWidth: 160,
          render: (h, params) => {
            let statusText = params.row.status == 0 ? "已关闭" : "已开通"
            return h("span", statusText);
          }
        },
        // {
        //   title: "更新时间",
        //   key: "updateTime",
        //   minWidth: 160,
        //   render: (h, params) => {
        //     let x = params.row.updateTime;
        //     x = this.$moment(x).format("YYYY-MM-DD HH:mm:ss");
        //     return h("span", x);
        //   }
        // },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          width: 350,
          render: (h, params) => {
            return (
              h("div"),
              [
                h(
                  "Button",
                  {
                    props: {
                      type: "error",
                      ghost: true,
                      size: "small"
                    },
                    style: {
                      display: params.row.status === 1 ? "inline-block" : "none"
                    },
                    on: {
                      click: () => {
                        let info = params.row;
                        this.closeStra(info);
                      }
                    }
                  },
                  "关闭"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "success",
                      ghost: true,
                      size: "small"
                    },
                    style: {
                      display: params.row.status === 0 ? "inline-block" : "none"
                    },
                    on: {
                      click: () => {
                        let info = params.row;
                        this.openStra(info);
                      }
                    }
                  },
                  "开启"
                )
              ]
            );
          }
        }
      ],
    };
  },
  created() {
    this.getList();
    this.getSavedCity();//获取已开通城市
    this.getAllCitys(); // 获取全国城市
    this.inputList[0].cascaderList = JSON.parse(
      localStorage.getItem("provinceCityList")
    );
  },
  methods: {
    confirm: function(data) {
      // 保存折扣矩阵回调
      if (data) this.getList();
    },
    showAddModel() {
      this.selectedCitys = []; // 清空绑定的数据
      this.cityCodeList = [];
    //   this.$refs.alCascader.select = []; // 清空页面上的展示数据
      this.addModal = true;
    },
    //开通城市
    handleSaveCity() {
      if (!this.selectedCitys.length) {
        return this.$Message.warning("请选择城市");
      }
      let type = "专车";
      switch (this.tabName) {
        case "2":
          type = "专车";
          break;
        case "4":
          type = "快车";
          break;
      }
      let data = {
        cityCode: this.selectedCitys[1].cityID,
        cityName: this.selectedCitys[1].city,
        bussniseType: Number(this.tabName),
        loginName: this.loginName,
        provinceCode:  this.selectedCitys[0].provinceID,
        provinceName:  this.selectedCitys[0].province,    
      };
      let city = this.selectedCitys[1].city;
      this.$Modal.confirm({
        title: "开通城市",
        content:
          "确认开通" + city + "的" + type + "业务吗",
        onOk: () => {
          addCity(data).then(res => {
            this.$Message.success("开通成功！");
            this.getList();
            this.getSavedCity();
            this.addModal = false;
          });
        }
      });
    },
    cascaderChange(value, selectedData) {
        if(selectedData.length>0) {
            this.selectedCitys= selectedData;
        }
    },
    cancelModal() {
      this.showBsModal = false;
    },
    cancelbdModal() {
      this.showBsModal = false;
    },
    //重置
    handelReset() {
      this.current = 1;
      this.getList();
    },
    //获取分页List
    getList() {
      let type = Number(this.tabName);
      let data = {
        bussniseType: type,
        currPage: this.current,
        pageSize: this.pageSize
      };
      this.$store.commit("changeLoadingFlag", true);
      getOpenList(data).then(res => {
        this.cityData = res.data.data.list;
        this.total = res.data.data.totalCount;
        this.$store.commit("changeLoadingFlag", false);
      });
    },
    getSavedCity() {
      let data = { typeModule: Number(this.tabName) };
      getProvinceCityList(data).then(res => {
        let transformData = JSON.stringify(cpTranslate(res.data.data));
        localStorage.setItem("provinceCityList", transformData);
        this.inputList[0].cascaderList = JSON.parse(
          localStorage.getItem("provinceCityList")
        );
      });
    },
    getAllCitys(){
        getWholeRegion().then(res=>{
             let transformData = cpTranslate(res.data.data);
             this.allCitys = transformData;
            console.log(transformData, 'resssss')
        })
    },
    queryList(res) {
      this.current = 1;
      let data = {
        bussniseType: Number(this.tabName),
        provinceCode: res.provinceID,
        cityCode: res.cityID,
        currPage: this.current,
        pageSize: this.pageSize
      };
      getOpenList(data).then(res => {
        this.cityData = res.data.data.list;
        this.total = res.data.data.totalCount;
        this.$store.commit("changeLoadingFlag", false);
      });
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getList();
    },
    changePage(val) {
      this.current = val;
      this.getList();
    },
    closeStra(info) {
      let data = {
        uuid: info.uuid,
        status: 0,
        loginName: this.loginName,
        cityCode: info.cityCode,
      };
      this.$Modal.confirm({
        title: "提示",
        content: "<p>确认关闭此城市的业务？</p>",
        onOk: () => {
          turnoffCity(data).then(res => {
            this.$Message.success("关闭成功");
            this.getList();
            this.getSavedCity();
          });
        }
      });
    },
    openStra(info) {
      let data = {
        uuid: info.uuid,
        status: 1,
        loginName: this.loginName,
        cityCode: info.cityCode,
      };
      this.$Modal.confirm({
        title: "提示",
        content: "<p>确认开启此城市？</p>",
        onOk: () => {
          turnOnCity(data).then(res => {
            this.$Message.success("开启成功");
            this.getList();
            this.getSavedCity();
          });
        }
      });
    }
  }
};
</script>

<style lang="less">
.container_box {
  .mid {
    vertical-align: middle;
  }
  .fl-lt {
    float: left;
  }
  .fakeA {
    color: blueviolet;
  }
}
</style>

