<template>
  <div>
    <Cascader
      change-on-select
      v-model="areaVal"
      :data="areaList"
      filterable
      :clearable="false"
      placeholder="请选择省/市/区"
      @on-visible-change="SelectAreaDown"
    ></Cascader>
  </div>
</template>
<script>
/**
 * description:供应商提供的省市区列表
 * 必须传值：id：供应商id
 * 供应商充电站有数据，返回值均为数组，格式：['省code','市code','区code']
 * 供应商充电站为空，省市区列表也是空，返回boolean：false
 * @init-down：获取省市区下拉之后，调用，返回地区的默认值，
 * @select-down：选择一个选项之后的回调，返回选择的省市区值
 */
import { axiosAreaListBySupplierId } from "@/api/charge.js";
import { setTimeout } from "timers";
export default {
  // id:供应商id
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      areaVal: [], //区域选择
      areaList: [] //区域选择
    };
  },
  mounted() {
    this.getAreaList();
  },
  methods: {
    // 获取城市列表，如果城市列表有南京，默认展示南京如果没有南京，展示列表的第一个
    getAreaList() {
      axiosAreaListBySupplierId({ supplierId: this.id }).then(res => {
        let resdata = res.data.data;
        resdata = (resdata && resdata.provinceList) || [];
        if (resdata.length === 0) {
          this.areaList = []
          this.areaVal.splice(0, this.areaVal.length);
          this.$emit("init-down", false);
          return false;
        }
        let prov = resdata[0];
        this.areaVal.splice(0, this.areaVal.length,prov.provinceId,prov.cityList[0].cityId);
        // 组装成组件需要的样式，label和value
        resdata.forEach(province => {
          province.value = province.provinceId;
          province.label = province.provinceName;
          province.children = province.cityList;
          province.cityList.forEach(city => {
            city.value = city.cityId;
            city.label = city.cityName;
            city.children = city.areaList;
            // 判断有没有南京(江苏：320000，南京：320100)
            if (city.cityId === "320100") {
              this.areaVal = ["320000", "320100"];
            }
            city.areaList.forEach(area => {
              area.value = area.areaCode;
              area.label = area.areaName;
            });
          });
        });
        this.areaList = resdata;
        this.$emit("init-down", this.areaVal);
      });
    },
    // 选择省市区
    // 需求不能单独选择省，可以选择到市和区,在关闭下拉时判断，如果只选到了省，塞个该省份下第一个城市
    SelectAreaDown(isOpen) {
      if (isOpen) {
        return false;
      }
      let that = this;
      if (this.areaVal.length === 1) {
        this.areaList.forEach(item => {
          if (item.value === this.areaVal[0]) {
            this.areaVal.push(item.children[0].value);
          }
        });
      }
      // 选择省市区之后回调，传回选择的省市区
      setTimeout(() => {
        that.$emit("select-down", that.areaVal);
      }, 200);
    }
  },
  watch: {
    id(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getAreaList();
      }
    }
  }
};
</script>
