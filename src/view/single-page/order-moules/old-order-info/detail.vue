<template>
  <div class="orderDeatil">
    <div class="detailLeft">
      <Card class="order-detail-card">
        <p slot="title">
          <Icon type="ios-film-outline"></Icon>
          基本信息
        </p>
        <Col v-for="(item, index) in orderInfo" :span="item.span" :key="index">
          <Form class="display-div">
            <FormItem :label="item.name + ' :'">
              <p class="detail-content">{{item.value}}</p>
            </FormItem>
          </Form>
        </Col>
      </Card>
      <Card class="order-detail-card">
        <p slot="title">
          <Icon type="ios-film-outline"></Icon>
          时间信息
        </p>
        <Col v-for="(item, index) in timeInfo" :span="item.span" :key="index">
          <Form class="display-div">
            <FormItem :label="item.name + ' :'">
              <p class="detail-content">{{item.value}}</p>
            </FormItem>
          </Form>
        </Col>
      </Card>
      <Card class="order-detail-card">
        <p slot="title">
          <Icon type="ios-film-outline"></Icon>
          司乘信息
        </p>
        <Col v-for="(item, index) in driverInfo" :span="item.span" :key="index">
          <Form class="display-div">
            <FormItem :label="item.name + ' :'">
              <p class="detail-content">{{item.value}}</p>
            </FormItem>
          </Form>
        </Col>
      </Card>
      <Card class="order-detail-card">
        <p slot="title">
          <Icon type="ios-film-outline"></Icon>
          里程信息
        </p>
        <Col v-for="(item, index) in roadInfo" :span="item.span" :key="index">
          <Form class="display-div">
            <FormItem :label="item.name + ' :'">
              <p class="detail-content">{{item.value}}</p>
            </FormItem>
          </Form>
        </Col>
      </Card>
      <Card class="order-detail-card">
        <p slot="title">
          <Icon type="ios-film-outline"></Icon>
          费用及支付信息
        </p>
        <Col v-for="(item, index) in chargeInfo" :span="item.span" :key="index">
          <Form class="display-div" v-if="getAdjustData(item) === ''">
            <FormItem :label="item.name + ' :'">
              <p class="detail-content">{{item.value}}{{item.unit}}</p>
            </FormItem>
          </Form>
          <Form class="display-div" v-else>
            <FormItem :label="item.name + ' :'">
              <p
                class="detail-content"
              >{{getAdjustData(item)}}{{item.unit}}(修改前{{item.value}}{{item.unit}})</p>
            </FormItem>
          </Form>
        </Col>
      </Card>
      <Card class="order-detail-card">
        <p slot="title">
          <Icon type="ios-film-outline"></Icon>
          取消信息
        </p>
        <Col v-for="(item, index) in cancelInfo" :span="item.span" :key="index">
          <Form class="display-div">
            <FormItem :label="item.name + ' :'">
              <p class="detail-content">{{item.value}}</p>
            </FormItem>
          </Form>
        </Col>
      </Card>
      <Card class="order-detail-card">
        <p slot="title">
          <Icon type="ios-film-outline"></Icon>
          首评信息
        </p>
        <Col v-for="(item, index) in firstComment" :span="item.span" :key="index">
          <Form class="display-div">
            <FormItem
              :label="item.name + ' :'"
              style="display: flex;align-items: center;"
              v-if="item.star"
            >
              <Rate v-model="item.value" disabled/>
            </FormItem>
            <FormItem :label="item.name + ' :'" v-else-if="item.content">
              <p class="detail-content" style="word-wrap: break-word;width: 240px;">{{item.value}}</p>
            </FormItem>
            <FormItem :label="item.name + ' :'" v-else>
              <p class="detail-content">{{item.value}}</p>
            </FormItem>
          </Form>
        </Col>
      </Card>
      <Card class="order-detail-card" style="margin-bottom: 20px;">
        <p slot="title">
          <Icon type="ios-film-outline"></Icon>
          追评信息
        </p>
        <Col v-for="(item, index) in updateComment" :span="item.span" :key="index">
          <Form class="display-div">
            <FormItem
              :label="item.name + ' :'"
              style="display: flex;align-items: center;"
              v-if="item.star"
            >
              <Rate v-model="item.value" disabled/>
            </FormItem>
            <FormItem :label="item.name + ' :'" v-else-if="item.content">
              <p class="detail-content" style="word-wrap: break-word;width: 240px;">{{item.value}}</p>
            </FormItem>
            <FormItem :label="item.name + ' :'" v-else>
              <p class="detail-content">{{item.value}}</p>
            </FormItem>
          </Form>
        </Col>
      </Card>
    </div>

    <!--详情右侧-->
    <div class="detailRight">
      <Tabs @on-click="tabsName" v-model="tabsIndex" class="order-detail-tab">
        <TabPane label="订单轨迹">
          <div class="spinBox" span="8" v-show="!isShowMap">
            <Spin fix>
              <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
              <div>Loading</div>
            </Spin>
          </div>
          <div class="orderRight">
            <p class="carTextLeft">
              行程持续时间
              <span class="carTime">{{pathTime}}</span>
            </p>
            <p class="carTextRight" @click="getMap">车辆轨迹回放</p>
          </div>
          <!-- <orderMap :center="center" :params="params" v-show="isShowMap===true && isHasData===true"></orderMap> -->
          <template v-if="hashistorytrack">
            <el-amap
              vid="amap"
              class="amap-demo"
              :center="center"
              :zoom="zoom"
              :events="moveEvents"
              ref="moveMap"
            ></el-amap>
          </template>
          <p v-else style="text-align:center">暂无轨迹</p>
        </TabPane>
        <TabPane label="途径点修改记录">
          <div class="mymaparea" v-if="hasrecordline">
            <el-amap
              vid="amapcode"
              :center="center"
              :zoom="zoom"
              class="amap-demo"
              :events="events"
              ref="map"
            ></el-amap>
          </div>
          <div class="noddata" v-else>暂无数据</div>
          <div class="selectline">
            <div
              :class="['btnstyle', idx == index? 'hascolor': '']"
              @click="getSelectLine(index)"
              v-for="(item, index) in pointrecordData"
              :key="index"
            >
              <span v-if="index == 0">首次设置</span>
              <span v-else>第{{index}}次修改</span>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
import "@/styles/cyk-style.css";
// import orderMap from "./map/orderMap";
import {
  orderDetail,
  orderPath,
  wayRecord,
  queryRoutePointRecord
} from "@/api/passenger.js";
import {
  orderData,
  wayRecords,
  orderMainStatusMap,
  payTypeMap,
  drawBillMap,
  invoiceTypeMap,
  cancelTypeMap
} from "./fields";

export default {
  components: {
    // orderMap
  },
  data() {
    let self = this;
    return {
      ...orderData,
      wayRecords,
      pathArr: [], // 轨迹
      pathTime: "00时00分00秒", // 行程持续时间
      isShowMap: false, // 是否展示地图
      timer: null,
      params: {
        orderUuid: this.$router.currentRoute.params.id
      },
      isHasData: true, // 是否存在地图数据
      idx: 0,
      tableData: [],
      tabsIndex: 0,
      orderStatus: Number, // 1: '已发单',  2: '进行中',  3: '待支付',  4: '已完成',  5: '已取消'
      zoom: 4, // 地图显示级别//全国范围
      center: [116.286278, 34.22237],
      mymap: null,
      moveMap: null,
      events: {
        init(o) {
          self.mymap = self.$refs.map.$$getInstance();
          setTimeout(() => {
            self.getSelectLine();
          }, 1000);
        }
      },
      moveEvents: {
        init(o) {
          self.moveMap = self.$refs.moveMap.$$getInstance();
          setTimeout(() => {}, 1000);
        }
      },
      pointrecordData: [],
      beforeChangeFare: {},
      driving: null,
      longMarker: null,
      longpolyline: null,
      longedpassedPolyline: null,
      longPoints: [],
      pathArr: [],
      hashistorytrack: true,
      hasrecordline: true
    };
  },
  created() {
    this.getDetailInfo(this.params);
    this.tabsName(0);
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
    getSelectLine(val) {
      let that = this;
      this.idx = val;
      let tableDatas = this.pointrecordData;
      let itemMsg = tableDatas[val];
      let passpoints = [];
      itemMsg &&
        itemMsg.passingPointDtos.forEach(item => {
          passpoints.push([item.lon, item.lat]);
        });
      itemMsg &&
        this.driving.search(
          [itemMsg.originPointDto.lon, itemMsg.originPointDto.lat],
          [itemMsg.destPointDto.lon, itemMsg.destPointDto.lat],
          {
            waypoints: passpoints
          },
          function(status, result) {
            if (status === "complete") {
            } else {
              that.$Message.error("途径点生成失败");
            }
          }
        );
    },
    getDetailInfo(params) {
      orderDetail(params).then(res => {
        let data = res.data.data || [];
        this.orderStatus = res.data && res.data.data && data.mainStatus;
        Object.keys(data).forEach(function(key) {
          // 数据解析
          if (key === "mainStatus") {
            // 订单状态
            data[key] = orderMainStatusMap[data[key]];
          } else if (key === "typeTime") {
            // 订单类型
            data[key] = orderTypeMap[data[key]];
          } else if (key === "invoiceType") {
            // 发票类型
            data[key] = invoiceTypeMap[data[key]];
          } else if (key === "payType") {
            // 支付方式
            data[key] = payPatternMap[data[key]];
          } else if (key === "typeModule") {
            // 业务类型
            data[key] = useTypeMap[data[key]];
          } else if (key === "billedStatus") {
            // 是否申请发票
            data[key] = drawBillMap[data[key]];
          } else if (key === "cancelType") {
            // 取消类型
            data[key] = cancelTypeMap[data[key]];
          } else if (key == "typeSelf") {
            data[key] = data[key] ? "是" : "否";
          }
        });

        for (let i in orderData) {
          // 订单赋值
          orderData[i].forEach(function(item, $key) {
            Object.keys(data).forEach(function(key) {
              if (item.key === key) {
                if (item.star) {
                  // 评星
                  item.value = Number(data[key]);
                } else {
                  item.value = data[key];
                }
              }
            });
          });
        }
        for (let i = 0; i < orderData.adjustFare.length; i++) {
          this.beforeChangeFare[orderData.adjustFare[i].key] =
            orderData.adjustFare[i].value;
        }
      });
    },
    getPointRecord() {
      let that = this;
      let map =
        (this.$refs && this.$refs.map && this.$refs.map.$$getInstance()) ||
        this.mymap;
      this.idx = 0;
      queryRoutePointRecord({ orderUuid: this.params.orderUuid })
        .then(res => {
          if (!res.data.data) {
            this.hashistorytrack = false;
            return;
          }
          if (!this.driving) {
            this.driving = new AMap.Driving({
              map: map
            }); 
          }
          this.pointrecordData = res.data.data;
          if (this.pointrecordData.length) {
            let usedetail = this.pointrecordData[this.idx];
            let passpoints = [];
            usedetail &&
              usedetail.passingPointDtos.forEach(item => {
                passpoints.push([item.lon, item.lat]);
              });
            usedetail &&
              this.driving.search(
                [usedetail.originPointDto.lon, usedetail.originPointDto.lat],
                [usedetail.destPointDto.lon, usedetail.destPointDto.lat],
                {
                  waypoints: passpoints
                },
                function(status, result) {
                  if (status === "complete") {
                  } else {
                    that.$Message.error("途径点生成失败");
                  }
                }
              );
          }
        })
        .catch(err => {});
    },
    tabsName(index) {
      if (index === 1) {
        this.getPointRecord();
      } else if (index === 0) {
        this.isShowMap = true;
        this.getMoveLong();
      }
    },
    getMoveLong() {
      let that = this;
      orderPath(this.params)
        .then(res => {
          let data = res.data.data;
          if (!res.data.data) {
            this.hasrecordline = false;
            return false;
          }
          that.pathArr = [];
          that.pathTime = data.spendTime ? data.spendTime : "00时00分00秒";
          that.longPoints = data.point;
          that.longPoints.length &&
            that.longPoints.forEach((v, k) => {
              if (k === 0) {
                that.center = [v[0], v[1]];
              }
              that.pathArr.push([v[0], v[1]]);
            });
          if (!that.longMarker) {
            that.longMarker = new AMap.Marker({
              map: that.moveMap,
              position: [data.originPointDto.lon, data.originPointDto.lat],
              icon: "https://webapi.amap.com/images/car.png",
              offset: new AMap.Pixel(-26, -13),
              autoRotation: true,
              angle: -90
            });
          }
          // 绘制轨迹
          that.longpolyline = new AMap.Polyline({
            map: that.moveMap,
            path: data.point,
            showDir: true,
            strokeColor: "#28F", //线颜色
            strokeWeight: 6 //线宽
          });
          that.longedpassedPolyline = new AMap.Polyline({
            map: that.moveMap,
            strokeColor: "#AF5", //线颜色
            strokeWeight: 6 //线宽
          });
          that.longMarker &&
            that.longMarker.on("moving", function(e) {
              that.longedpassedPolyline &&
                that.longedpassedPolyline.setPath(e.passedPath);
            });
          that.moveMap && that.moveMap.setFitView();
        })
        .catch(error => {});
    },
    getMap() {
      if (this.longPoints.length) {
        this.longMarker.moveAlong(this.longPoints, 200);
      } else {
        this.$Message.warning("暂无运动轨迹回放");
      }
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
  .ivu-card-head {
    padding: 7px 16px 4px;
  }
}
.orderDeatil {
  height: 100%;
  display: flex;
  .detailLeft {
    width: 60%;
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
      background-color:#f8f8f8;
    }
    &::-webkit-scrollbar-thumb {
      //滚动条的设置
      background-color:#dddddd;
      background-clip:padding-box;
      min-height:28px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background-color:#bbb;
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
  .detailRight {
    width: 40%;
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
.mymaparea {
  width: 700px;
  height: 500px;
}
.detailRight .selectline {
  max-width: 700px;
  margin-top: 20px;
  border: 1px solid #dcdee2;
  overflow-x: scroll;
  // &::-webkit-scrollbar {
  //   //滚动条的宽度
  //   width: 9px;
  //   height: 9px;
  //   border-radius: 4.5px 4.5px;
  // }
  // &::-webkit-scrollbar-track-piece {
  //   //滚动条凹槽的颜色，还可以设置边框属性
  //   background-color: #f8f8f8;
  // }
  // &::-webkit-scrollbar-thumb {
  //   //滚动条的设置
  //   background-color: #dddddd;
  //   background-clip: padding-box;
  //   min-height: 28px;
  // }
  // &::-webkit-scrollbar-thumb:hover {
  //   background-color: #bbb;
  // }
  .btnstyle {
    width: 80px;
    height: 40px;
    border-right: 1px solid #dcdee2;
    display: inline-block;
    cursor: pointer;
    line-height: 35px;
    vertical-align: middle;
    text-align: center;
  }
  .hascolor {
    color: #2d8cf0;
  }
}
.orderRight {
  display: flex;
  justify-content: space-between;
  .carTextLeft {
    font-size: 20px;
    font-weight: bold;
    .carTime {
      padding-left: 20px;
    }
  }
  .carTextRight {
    display: inline-block;
    padding: 10px 15px;
    background: #2d8cf0;
    color: #ffffff;
    border-radius: 5px;
    cursor: pointer;
  }
}
</style>
