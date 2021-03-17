<!--充电站-配置管理-订单详情-wx-->

<template>
  <div class="order-detail">
    <Card>
      <p slot="title">
        <Icon type="ios-film-outline"></Icon>基本信息
      </p>
      <ul class="flex-ul">
        <li>
          <span class="name-info">司机ID</span>：
          <span class="val-info">{{infoData.driverId}}</span>
        </li>
        <li>
          <span class="name-info">司机姓名</span>：
          <span class="val-info">{{infoData.driverName}}</span>
        </li>
        <li>
          <span class="name-info">绑定车牌</span>：
          <span class="val-info">{{infoData.plateNum}}</span>
        </li>
        <li>
          <span class="name-info">订单状态</span>：
          <span class="val-info">{{ orderStatusMap[infoData.status]}}</span>
        </li>
        <li>
          <span class="name-info">手机号</span>：
          <span class="val-info">{{infoData.driverMobile}}</span>
        </li>
        <li>
          <span class="name-info">订单编号</span>：
          <span class="val-info">{{infoData.orderNo}}</span>
        </li>
        <li>
          <span class="name-info">充电开始</span>：
          <span class="val-info">{{infoData.startTime}}</span>
        </li>
        <li>
          <span class="name-info">充电结束</span>：
          <span class="val-info">{{infoData.endTime}}</span>
        </li>
        <li>
          <span class="name-info">充电时长</span>：
          <span class="val-info">{{infoData.totalTime}}</span>
        </li>
        <li>
          <span class="name-info">电量(度)</span>：
          <span class="val-info">{{infoData.degree}}</span>
        </li>
        <li>
          <span class="name-info">电费(元)</span>：
          <span class="val-info">{{infoData.fee}}</span>
        </li>
        <li>
          <span class="name-info">支付方式</span>：
          <span class="val-info">{{infoData.modePayment}}</span>
        </li>
      </ul>
    </Card>
    <Card class="top15">
      <p slot="title">
        <Icon type="ios-film-outline"></Icon>站点信息
      </p>
      <ul class="flex-ul">
        <li>
          <span class="name-info">供应商</span>：
          <span class="val-info">{{infoData.supplierName}}</span>
        </li>
        <li>
          <span class="name-info">站点名称</span>：
          <span class="val-info">{{infoData.stationName}}</span>
        </li>
        <li>
          <span class="name-info">分布城市</span>：
          <span class="val-info">{{infoData.cityName}}</span>
        </li>
        <li>
          <span class="name-info">站点地址</span>：
          <span class="val-info">{{infoData.address}}</span>
        </li>
        <li>
          <span class="name-info">站点编号</span>：
          <span class="val-info">{{infoData.stationCode}}</span>
        </li>
        <li>
          <span class="name-info">电桩编号</span>：
          <span class="val-info">{{infoData.pileCode}}</span>
        </li>
        <li>
          <span class="name-info name-info-shot">类型</span>：
          <span class="val-info">{{Number(infoData.chargingType)===1?'快充':'慢充'}}</span>
        </li>
      </ul>
    </Card>
    <Card class="top15">
      <p slot="title">
        <Icon type="ios-film-outline"></Icon>单价信息
      </p>
      <Table stripe :columns="columns" :data="infoData.priceList" :loading="loading"></Table>
    </Card>
  </div>
</template>

<script>
import { axiosOrderDetail } from "@/api/charge.js";
import { orderStatusMap } from "../../chargeStatusMap.js";
export default {
  name: "chargeOrderDetail",
  data() {
    return {
      orderStatusMap,
      loading: true, //显示加载中的状态
      infoData: {}, //数据
      columns: [
        {
          title: "类型",
          key: "typeName"
        },
        {
          title: "电费(元/度)",
          key: "chargingPrice"
        },
        {
          title: "服务费(元/度)",
          key: "servicePrice"
        },
        {
          title: "单价(元/度)",
          key: "price"
        }
      ]
    };
  },
  mounted() {
    this.getPriceData();
  },
  methods: {
    getPriceData() {
      this.loading = true;
      axiosOrderDetail({ uuid: this.$route.params.id }).then(res => {
        this.infoData = res.data.data || {};
        this.loading = false;
        let ownPriceNum = 0;
        let marketPriceNum = 0;
        let PriceNum = 0;
        this.infoData.priceList.forEach(item => {
          if (item.priceType == 1) {
            item.typeName = "单价";
            ownPriceNum++;
          } else if (item.priceType == 2) {
            item.typeName = "市场价";
            marketPriceNum++;
          } else if (item.priceType == 3) {
            item.typeName = "成本价";
            PriceNum++;
          }
        });
        if (ownPriceNum > 1 || marketPriceNum > 1 || PriceNum > 1) {
          this.columns.push({
            title: "时段",
            key: "timeFrame"
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped src="../../charge.less"></style>
<style lang="less">
.order-detail {
  th {
    font-weight: 600;
  }
  .ivu-card-head {
    background: #c4dffb;
  }
}
</style>