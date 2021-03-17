<template>
  <div style="display: flex;">
    <table class="order-detail-table">
      <tr v-for="(item, index) in orderLeftData" :key="index">
        <td>{{item.title}}</td>
        <td>
          <Col v-for="(cell, index) in item.value" :span="cell.span" :key="index">
            <Form class="display-div">
              <!--评价内容-->
              <FormItem
                :label="cell.name + ' :'"
                style="display: flex;align-items: center;"
                v-if="cell.star"
              >
                <Rate v-model="cell.value" disabled/>
              </FormItem>
              <FormItem :label="item.name + ' :'" v-else-if="item.content">
                <p class="detail-content" style="word-wrap: break-word;width: 240px;">{{item.value}}</p>
              </FormItem>
              <!--评价内容结束-->

              <!--其他内容-->
              <FormItem :label="cell.name + ' :'" v-else>
                <!--不带车辆位置、带有跳转链接的字段-->
                <p
                  @click="trunToPage(cell)"
                  class="right-detail-content link-content"
                  v-if="typeof(cell.link) !== 'undefined' && cell.link !== 'position'"
                >{{cell.value}}</p>
                <!--带车辆位置的字段-->
                <div
                  style="line-height: 20px; color: #515a6e;"
                  v-else-if="cell.link === 'position'"
                >
                  <span class="link-position" @click="popMapView(cell.value)">地图查看</span>
                  <span class="link-position" @click="popDetailView(cell.value)">车辆实时状态</span>
                </div>
                <!--含有修改前价格的字段-->
                <div
                  style="line-height: 20px; color: #515a6e;"
                  v-else-if="typeof(cell.adjust) !== 'undefined'"
                >
                  <span>
                    {{cell.adjust}}元
                    <span
                      v-if="cell.value !== '' && cell.value !== null && cell.value !== 0"
                    >（修改前{{cell.value}}元）</span>
                  </span>
                </div>
                <!--其他字段-->
                <p class="right-detail-content" v-else>{{cell.value}}{{cell.unit}}</p>
              </FormItem>
              <!--其他内容结束-->
            </Form>
          </Col>
        </td>
      </tr>
    </table>
    <div style="flex: 0.3;">
      <Card class="order-detail-card" v-for="(item, index) in orderRightData" :key="index">
        <p slot="title">
          <Icon type="ios-film-outline"></Icon>
          {{item.title}}
        </p>
        <Col v-for="(cell, index) in item.value" :span="cell.span" :key="index">
          <Form class="display-div">
            <FormItem :label="cell.name + ' :'">
              <p
                class="right-detail-content link-content"
                v-if="cell.link"
                @click="trunToPage(cell)"
              >{{cell.value}}</p>
              <p class="right-detail-content" v-else>{{cell.value}}</p>
            </FormItem>
          </Form>
        </Col>
      </Card>
    </div>
    <Modal footer-hide :width="400" :mask-closable="false" v-model="popDetail" title="车辆实时状态">
      <CarDetail v-model="popDetail" :orderCarStatus="orderCarStatus"></CarDetail>
    </Modal>
    <Modal footer-hide :width="800" :mask-closable="false" v-model="popMap" title="地图查看">
      <CarMap v-model="popMap" :orderCarStatus="orderCarStatus"></CarMap>
    </Modal>
  </div>
</template>

<script>
import "@/styles/cyk-style.css";
import {
  getCompanyOrderDetailByOrderId
} from "@/api/enterpriseVehicle.js";
import { orderLeftData, orderRightData, showMap } from "../fields";
import {
  orderMainStatusMap,
  typeTimeMap,
  typeModuleMap,
  creatorTypeMap,
  cancelTypeMap,
  payTypeMap
} from "@/libs/status-map";
import CarDetail from "./detail-popview/car-detail.vue";
import CarMap from "./detail-popview/car-map.vue";

export default {
  components: {
    CarDetail,
    CarMap
  },
  data() {
    return {
      orderCarStatus: {},
      popMap: false,
      popDetail: false,
      showMap,
      typeTimeMap,
      payTypeMap,
      creatorTypeMap,
      cancelTypeMap,
      typeModuleMap,
      orderLeftData: [],
      orderRightData: [],
      beforeChangeFare: {}
    };
  },
  watch: {
    "$route.params.id"() {
      this.orderLeftData = JSON.parse(JSON.stringify(orderLeftData));
      this.orderRightData = JSON.parse(JSON.stringify(orderRightData));
      this.getDetailInfo();
    }
  },
  mounted() {
    this.orderLeftData = JSON.parse(JSON.stringify(orderLeftData));
    this.orderRightData = JSON.parse(JSON.stringify(orderRightData));
    this.getDetailInfo();
  },
  methods: {
    getTableColumns(map) {
      this.orderLeftData = [];
      this.orderRightData = [];
      orderLeftData.forEach(item => {
        map.forEach(cell => {
          if (item.key === cell) this.orderLeftData.push(item);
        });
      });
      orderRightData.forEach(item => {
        map.forEach(cell => {
          if (item.key === cell) this.orderRightData.push(item);
        });
      });
    },
    getDetailInfo() {
      getCompanyOrderDetailByOrderId({
        orderUuid: this.$route.query.id,
        applyNo: this.$route.query.applyNo
      }).then(res => {
        let temp = false; // 判断是否有开始服务字段
        let data = res.data.data || {};
        let orderTableMap = this.showMap[data.mainStatus] || this.showMap[8];
        let lengthLeft =
          (data.passingPointsList && data.passingPointsList.length) || 0; // 左侧途经点长度
        let lengthRight =
          (data.passingPointDtos && data.passingPointDtos.length) || 0; // 右侧途经点长度
        // this.getTableColumns(orderTableMap); // 获取左侧table展示项

        for (let i = 0; i < this.orderLeftData.length; i++) {
          if (this.orderLeftData[i].key === "passingPoints") {
            this.orderLeftData.splice(i + lengthLeft, 3 - lengthLeft); // 左侧删除空途经点
            break;
          }
        }
        this.orderRightData[0].value.forEach((item, index) => {
          if (item.key === "address0") {
            this.orderRightData[0].value.splice(
              index + lengthRight,
              3 - lengthRight
            ); // 右侧删除空途经点
          }
        });

        if (data.typeTime === 1 || data.typeTime === null) {
          // 实时用车
          this.orderRightData[0].value.forEach((item, index) => {
            if (item.key === "departTime")
              this.orderRightData[0].value.splice(index, 1); // 右侧删除预约用车时间
          });
        }

        data.orderCarHistoryStatusList &&
          data.orderCarHistoryStatusList.length &&
          data.orderCarHistoryStatusList.forEach(item => {
            // 检查是否有开始服务字段
            if (item.type === "start_service_msg") temp = true; // 有开始服务字段
          });
        if (!temp) {
          // 若无开始服务字段
          this.orderLeftData.forEach((item, index) => {
            if (item.key === "beginService")
              this.orderLeftData.splice(index, 1); // 左侧删除开始服务栏
          });
        }
        if (data.mainStatus === 9) {
          // 行程取消的订单
          if (data.actualDriverUuid === null || data.actualDriverUuid === "") {
            // 若司机未接过单(查询不到司机)
            for (let i = 0; i < this.orderLeftData.length; i++) {
              if (this.orderLeftData[i].key === "distributOrder") {
                // 左侧删除派单栏
                this.orderLeftData.splice(i, 1);
                i--;
              }
              if (this.orderLeftData[i].key === "receiveOrder") {
                this.orderLeftData.splice(i, 1); // 左侧删除接单栏
                i--;
              }
            }
            this.orderRightData.forEach((item, index) => {
              if (item.key === "driverInfo")
                this.orderRightData.splice(index, 1); // 右侧删除司机信息栏
            });
          }
        }

        this.orderRightData.forEach(item => {
          // 途经点(右侧)处理
          item.value.forEach(cell => {
            data.passingPointDtos &&
              data.passingPointDtos.forEach((atom, index) => {
                if (cell.key === "address" + index) cell.value = atom.address;
              });
          });
        });
        if (data.evaluate) {
          for (let i = 0; i < data.evaluate.length; i++) {
            // 加入追评
            if (data.evaluate[i].addType === 2) {
              orderLeftData.forEach(cell => {
                if (cell.key === "secondEvaluate")
                  this.orderLeftData.push(cell);
              });
              break;
            }
          }
        }
        this.orderLeftData.forEach(item => {
          // 评价数据处理
          item.value.forEach(cell => {
            data.evaluate && data.evaluate.forEach(atom => {
              if (cell.key === "evaluateTime" + atom.addType)
                cell.value = atom.createTime;
              if (
                cell.key ===
                "evaluateStars" + atom.addType + atom.evaluateType
              )
                cell.value = atom.score || 0;
              if (
                cell.key ===
                "evaluateTags" + atom.addType + atom.evaluateType
              )
                cell.value = atom.evaluateTag;
              if (
                cell.key ===
                "evaluateContent" + atom.addType + atom.evaluateType
              )
                cell.value = atom.content;
            });
          });
        });

        this.orderLeftData.forEach(item => {
          // 车辆位置和时间处理
          item.value.forEach(cell => {
            data.orderCarHistoryStatusList && data.orderCarHistoryStatusList.forEach(atom => {
              if (cell.key === atom.type + "_time") cell.value = atom.time;
              if (cell.key === atom.type + "_position") cell.value = atom;
            });
            data.passingPointsList && data.passingPointsList.forEach((atom, index) => {
              if (cell.key === atom.type + "_time" + index)
                cell.value = atom.time;
              if (cell.key === atom.type + "_position" + index)
                cell.value = atom;
            });
          });
        });

        for (let key in data) {
          // 整体赋值
          this.orderLeftData.forEach(item => {
            // 左侧
            item.value.forEach(cell => {
              if (cell.key === key) {
                cell.value = data[key]; // 整体赋值

                if (typeof cell.adjust !== "undefined") {
                  // 修改后金额赋值
                  let upperCaseKey =
                    cell.key.substring(0, 1).toUpperCase() +
                    cell.key.substring(1);
                  cell.adjust = data["adjust" + upperCaseKey] || 0;
                }

                // 折扣字段处理
                if (cell.value !== "" && cell.value !== null && cell.acount)
                  cell.value = data[key] + "折";

                // 数字内容转实际含义
                if (key === "payType" && cell.value.indexOf(",") !== -1)
                  cell.value = "组合";
                if (key === "payType" && cell.value.indexOf(",") === -1)
                  cell.value = payTypeMap[cell.value];
                if (key === "billedStatus" && cell.value === 1)
                  cell.value = "已开票";
                if (key === "billedStatus" && cell.value === 0)
                  cell.value = "待开票";
                if (key === "invoiceType" && cell.value === 1)
                  cell.value = "电子发票";
                if (key === "invoiceType" && cell.value === 2)
                  cell.value = "纸质发票";
              }
              if (
                (cell.value === "" ||
                  cell.value === null ||
                  typeof cell.value === "undefined") &&
                cell.type !== "number"
              )
                cell.value = "暂无";
              if (
                (cell.value === null || cell.value === "") &&
                cell.type === "number"
              )
                cell.value = 0;
            });
          });
          this.orderRightData.forEach(item => {
            // 右侧
            item.value.forEach(cell => {
              if (cell.key === key) {
                cell.value = data[key]; // 整体赋值

                if (key === "passengerName") cell.uuid = data.passengerUuid;
                if (key === "actualDriverName") cell.uuid = data.driverUuid;

                // 数字内容转实际含义
                if (key === "typeTime") cell.value = typeTimeMap[cell.value];
                if (key === "typeModule")
                  cell.value = typeModuleMap[cell.value];
                if (key === "mainStatus")
                  cell.value = orderMainStatusMap[cell.value];
                if (key === "creatorType")
                  cell.value = creatorTypeMap[cell.value];
                if (key === "cancelType")
                  cell.value = cancelTypeMap[cell.value];
              }
              if (
                cell.value === null ||
                cell.value === "" ||
                typeof cell.value === "undefined"
              )
                cell.value = "暂无";
            });
          });
        }
      });
    },
    trunToPage(params) {
      if (params.link === "vin") {
        // 点击vin码
        if (params.value !== "暂无") {
          this.$router.push({
            name: "vehicle-detail",
            params: {
              id: params.value
            }
          });
        }
      } else if (params.link === "coupon") {
        // 点击优惠券编号
      } else if (params.link === "invoice") {
        // 点击发票编号
      } else if (params.link === "passenger") {
        if (
          params.uuid === "" ||
          typeof params.uuid === "undefined" ||
          params.uuid === null
        ) {
          this.$Message.warning("暂无乘客信息");
        } else {
          this.$router.push({
            name: "customer-detail",
            params: {
              id: params.uuid
            }
          });
        }
      } else if (params.link === "driver") {
        if (
          params.uuid === "" ||
          typeof params.uuid === "undefined" ||
          params.uuid === null
        ) {
          this.$Message.warning("暂无司机信息");
        } else {
          this.$router.push({
            name: "staff-detail",
            params: {
              id: params.uuid
            }
          });
        }
      } else {
        console.log("通知前端！！");
      }
    },
    popMapView(params) {
      this.popMap = true;
      this.orderCarStatus = params || {};
    },
    popDetailView(params) {
      this.popDetail = true;
      this.orderCarStatus = params || {};
    }
  }
};
</script>

<style scoped>
.order-detail-table {
  flex: 0.7;
  border-collapse: collapse;
}
.order-detail-table tr td {
  border: 1px solid #e8eaec;
  box-sizing: border-box;
}
.order-detail-table tr td:first-of-type {
  width: 100px;
  text-align: center;
}
.order-detail-table tr td:last-of-type {
  padding: 24px 0 0 20px;
}
.left-detail-content {
  display: inline-block;
  padding-right: 15px;
}
.link-position {
  display: inline-block;
  padding-right: 15px;
  color: #3399ff;
}
.link-position:hover {
  text-decoration: underline;
  cursor: pointer;
}
.link-content {
  color: #3399ff;
}
.link-content:hover {
  text-decoration: underline;
  cursor: pointer;
}
.right-detail-content {
  padding-right: 15px;
  line-height: 20px;
}
</style>
