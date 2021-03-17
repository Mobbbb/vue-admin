<template>
  <div class="orderDeatil">
    <div class="detailLeft">
      <Card class="order-detail-card" v-for="(item, index) in keyContData" :key="index">
        <p slot="title">{{titleMap[item]}}</p>
        <Col v-for="(inner, idx) in orderData[item]" :span="inner.span" :key="idx">
          <Form class="display-div">
            <FormItem :label="inner.name + ' :'">
              <p class="detail-content">{{inner.value}}</p>
            </FormItem>
          </Form>
        </Col>
      </Card>
    </div>
  </div>
</template>

<script>
import "@/styles/cyk-style.css";
import {
  orderData,
  orderMainStatusMap,
  payTypeMap,
  drawBillMap,
  invoiceTypeMap,
  cancelTypeMap,
  titleMap,
  orderTypeMap,
  businessTypeMap,
  sourceMap
} from "./fields";
import { getApplyOrderDetail } from "@/api/enterpriseVehicle.js";
export default {
  data() {
    let self = this;
    return {
      titleMap: {},
      orderData: {},
      params: {
        uuid: this.$router.currentRoute.params.id || ""
      },
      idx: 0,
      tableData: [],
      tabsIndex: 0,
      orderStatus: Number, // 1: '已发单',  2: '进行中',  3: '待支付',  4: '已完成',  5: '已取消'
      pointrecordData: [],
      beforeChangeFare: {},
      keyContData: [],
      orderData,
      orderMainStatusMap,
      payTypeMap,
      drawBillMap,
      invoiceTypeMap,
      cancelTypeMap,
      titleMap,
      orderTypeMap,
      businessTypeMap,
      sourceMap
    };
  },
  created() {
    this.orderData = orderData;
    this.titleMap = titleMap;
    this.keyContData = Object.keys(this.orderData);
    this.getDetailInfo(this.params);
  },
  methods: {
    getAdjustData: function(item) {
      let key = item.key.substring(0, 1).toUpperCase() + item.key.substring(1);
      if (typeof item.changeKey !== "undefined") {
        if (
          this.beforeChangeFare[item.changeKey + key] !== "" &&
          this.beforeChangeFare[item.changeKey + key] !== null &&
          typeof this.beforeChangeFare[item.changeKey + key] !== "undefined"
        ) {
          return this.beforeChangeFare[item.changeKey + key];
        } else return "";
      } else return "";
    },
    getDetailInfo(params) {
      getApplyOrderDetail(params).then(res => {
        let data = res.data.data || [];
        this.orderStatus = res.data && res.data.data && data.mainStatus;
        Object.keys(data).forEach(function(key) {
          // 数据解析
          if (key == "status") {
            // 需求单状态
            data[key] = orderMainStatusMap[data[key]];
          } else if (key == "typeTime") {
            // 订单类型
            data[key] = orderTypeMap[data[key]];
          } else if (key == "businessType") {
            // 业务类型4
            data[key] = businessTypeMap[data[key]];
          } else if (key == "cancelType") {
            // 取消类型
            data[key] = cancelTypeMap[data[key]];
          } else if (key == "source") {
            //用车来源
            data[key] = sourceMap[data[key]];
          } else if (key == "applyBusinessDtos") {
            let num = 0;
            data[key].forEach(item => {
              num += item.businessCarNum;
            });
            data[key] = num;
          } else if (key == "typeSelf") {
            data[key] = data[key] == 1 ? "是" : "否";
          }
        });
        data.applyAssociatedDtos &&
          data.applyAssociatedDtos.length &&
          data.applyAssociatedDtos.forEach(ele => {
            let currentArray = [];
            Object.keys(ele).forEach(keys => {
              let newsJSON = {};
              if (keys == "routePlanNo") {
                newsJSON["name"] = "订单编号";
                newsJSON["value"] = ele[keys];
                newsJSON["key"] = keys;
                newsJSON["span"] = "8";
                currentArray[0] = newsJSON;
              }
              if (keys == "businessType") {
                newsJSON["name"] = "用车分类";
                newsJSON["value"] = ele[keys];
                newsJSON["key"] = keys;
                newsJSON["span"] = "8";
                currentArray[1] = newsJSON;
              }
              if (keys == "estimatedPrice") {
                newsJSON["name"] = "订单费用";
                newsJSON["value"] = ele[keys];
                newsJSON["key"] = keys;
                newsJSON["span"] = "8";
                currentArray[2] = newsJSON;
              }
            });
            currentArray.forEach(its => {
              orderData["contactorder"].push(its);
            });
          });
        let levelMap = {
          1: "一",
          2: "二"
        };
        data.approval &&
          data.approval.length &&
          data.approval.forEach(ele => {
            let currentArray = [];
            Object.keys(ele).forEach(keys => {
              let newsJSON = {};
              if (keys == "name") {
                newsJSON["name"] = levelMap[keys.level] + "审批人";
                newsJSON["value"] = ele[keys];
                newsJSON["key"] = keys;
                newsJSON["span"] = "8";
                currentArray[0] = newsJSON;
              }
              if (keys == "time") {
                newsJSON["name"] = "审批时间";
                newsJSON["value"] = ele[keys];
                newsJSON["key"] = keys;
                newsJSON["span"] = "8";
                currentArray[1] = newsJSON;
              }
            });
            currentArray.forEach(its => {
              orderData["companyInfo"].push(its);
            });
          });
        data.together &&
          JSON.parse(data.together).length &&
          JSON.parse(data.together).forEach(ele => {
            let currentArray = [];
            Object.keys(ele).forEach(keys => {
              let newsJSON = {};
              if (keys == "name") {
                newsJSON["name"] = "乘车人姓名";
                newsJSON["value"] = ele[keys];
                newsJSON["key"] = keys;
                newsJSON["span"] = "12";
                currentArray[0] = newsJSON;
              }
              if (keys == "mobile") {
                newsJSON["name"] = "乘车人手机号";
                newsJSON["value"] = ele[keys];
                newsJSON["key"] = keys;
                newsJSON["span"] = "12";
                currentArray[1] = newsJSON;
              }
            });
            currentArray.forEach(its => {
              orderData["placeorderInfo"].push(its);
            });
          });
        for (let i in orderData) {
          // 订单赋值
          orderData[i].forEach(function(item, index) {
            Object.keys(data).forEach(function(key) {
              if (item.key === key) {
                item.value = data[key];
              }
            });
          });
        }
        // for (let i = 0; i < orderData.adjustFare.length; i++) {
        //   this.beforeChangeFare[orderData.adjustFare[i].key] =
        //     orderData.adjustFare[i].value;
        // }
      });
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
};
</script>
<style lang="less">
.order-detail-card {
  margin-bottom: 10px;
  .ivu-card-head {
    padding: 7px 16px 4px;
    p {
      font-size: 16px;
    }
  }
  .ivu-card-body {
    display: flex;
    flex-wrap: wrap;
  }
}
.orderDeatil {
  height: 100%;
  display: flex;
  .detailLeft {
    width: 100%;
    background: #fff;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      //滚动条的宽度
      width: 4px;
      height: 4px;
      border-radius: 2px 2px;
    }
    &::-webkit-scrollbar-track-piece {
      //滚动条凹槽的颜色，还可以设置边框属性
      background-color: #f8f8f8;
    }
    &::-webkit-scrollbar-thumb {
      //滚动条的设置
      background-color: #dddddd;
      background-clip: padding-box;
      min-height: 28px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color: #bbb;
    }
    .detailBox {
      display: flex;
      flex-wrap: wrap;
      .labelTitle {
        font-weight: bold;
        text-align: left;
      }
      .text {
        color: #a6a6a6;
      }
    }
    .orderAppraise {
      line-height: 32px;
    }
  }
}
.spinBox {
  display: inline-block;
  position: relative;
  width: 100%;
  height: 100px;
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
}
.detail-content {
  padding-right: 15px;
  line-height: 20px;
}
</style>
