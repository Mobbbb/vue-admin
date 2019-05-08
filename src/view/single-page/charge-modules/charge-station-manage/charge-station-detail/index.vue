<template>
  <div class="charge-station-detail">
    <Card>
      <p slot="title">
        <Icon type="ios-film-outline"></Icon>基本信息
      </p>
      <ul class="flex-ul">
        <li>
          <span class="name-info">站点名称</span>：
          <span class="val-info">{{detailInfo.stationName}}</span>
        </li>
        <li>
          <span class="name-info">站点编号</span>：
          <span class="val-info">{{detailInfo.stationCode}}</span>
        </li>
        <li>
          <span class="name-info">分布城市</span>：
          <span class="val-info">{{detailInfo.cityName}}</span>
        </li>
        <li>
          <span class="name-info name-info">分布区</span>：
          <span class="val-info">{{detailInfo.area}}</span>
        </li>
        <li>
          <span class="name-info">站点地址</span>：
          <span class="val-info">{{detailInfo.address}}</span>
        </li>
        <li>
          <span class="name-info">营业时间</span>：
          <span class="val-info">{{detailInfo.businessHours}}</span>
        </li>
        <li>
          <span class="name-info" style="width:90px;">停车收费情况</span>：
          <span class="val-info">{{detailInfo.parkFee}}</span>
        </li>
        <li>
          <span class="name-info">联系电话</span>：
          <span class="val-info">{{detailInfo.phone}}</span>
        </li>
      </ul>
    </Card>
    <!-- 电价信息 -->
    <Card class="top15">
      <p slot="title">
        <Icon type="ios-film-outline"></Icon>电价信息
      </p>
      <Table stripe :columns="columns1" :data="priceData" :loading="loading"></Table>
    </Card>
    <!-- 充电桩列表 -->
    <Card class="top15">
      <p slot="title">
        <Icon type="ios-film-outline"></Icon>充电桩列表
        <span
          class="fontsize12 color90"
        >( 共{{pileTotal}}个，空闲{{pileInfo.freePileCount}}个，充电中{{pileInfo.chargingPileCount}}个，故障{{pileInfo.faultPileCount}}个 )</span>
      </p>
      <ul class="flex-ul">
        <li v-for="station in chargeStationList" :key="station.id" style="margin:0 40px 30px 0;">
          <img
            v-show="station.status==3"
            class="pull-left"
            src="@/assets/images/charge/charge-error.png"
            alt="故障充电桩"
          >
          <img
            v-show="station.status==2"
            class="pull-left"
            src="@/assets/images/charge/charge-on.png"
            alt="使用中充电桩"
          >
          <img
            v-show="station.status==1"
            class="pull-left"
            src="@/assets/images/charge/charge-success.png"
            alt="可使用充电桩"
          >
          <ul style="margin-left:84px;line-height:20px;">
            <li>电桩编号：{{station.pileCode}}</li>
            <li>类型：{{Number(station.chargingType)===1?'快充':'慢充'}}</li>
            <li>状态：{{station.status | statusTurnTxt}}</li>
            <li>公率：{{station.power}} W</li>
          </ul>
        </li>
      </ul>
    </Card>
  </div>
</template>

<script>
import { axiosStationDetail, axiosStationPileList } from "@/api/charge.js";
export default {
  data() {
    return {
      detailInfo: {}, //详情信息
      loading: true, //显示加载中的状态
      columns1: [
        {
          title: "类型",
          key: "priceTypeText"
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
      ],
      priceData: [],
      pileInfo: {}, //充电桩信息
      chargeStationList: [] //充电桩列表
    };
  },
  filters: {
    statusTurnTxt(val) {
      switch (Number(val)) {
        case 1:
          return "空闲";
          break;

        case 2:
          return "充电中";
          break;

        default:
          return "故障";
          break;
      }
    }
  },
  computed: {
    pileTotal(){
      let pileInfo = this.pileInfo
      return pileInfo.freePileCount+pileInfo.chargingPileCount+pileInfo.faultPileCount || 0
    }
  },
  mounted() {
    this.getStationInfo();
    this.getStationPileList();
  },
  methods: {
    // 获取详情信息
    getStationInfo() {
      this.loading = true;
      axiosStationDetail({ uuid: this.$route.params.id }).then(res => {
        let resData = res.data.data || {};
        this.detailInfo = resData.station;
        this.priceData = resData.electricityPriceList||[];
        let t3PriceNum = 0
        let marketPriceNum = 0
        let PriceNum = 0
        this.priceData.forEach((item)=>{
          console.log(item.startTime && item.endTime)
          item.timeFrame = item.startTime!=='' && item.endTime!=='' ? item.startTime+'——'+item.endTime : ''
          if (item.priceType==1) {
            item.priceTypeText = 'T3单价'
            t3PriceNum++
          }else if(item.priceType==2){
            item.priceTypeText = '市场价'
            marketPriceNum++
          }else if(item.priceType==3){
            item.priceTypeText = '成本价'
            PriceNum++
          }
        })
        if (t3PriceNum > 1 || marketPriceNum > 1 || PriceNum > 1) {
          this.columns1.push({
            title: "时段",
            key: "timeFrame",
            minWidth: 160
          });
        }
        this.loading = false;
      });
    },
    // 获取充电桩信息
    getStationPileList() {
      axiosStationPileList({ uuid: this.$route.params.id }).then(res => {
        let resData = res.data.data || {};
        this.pileInfo = resData.statistics;
        this.chargeStationList = resData.chargingPileList;
      });
    }
  }
};
</script>
<style lang="less" scoped src="../../charge.less"></style>
<style lang="less">
.charge-station-detail {
  th {
    font-weight: 600;
  }
}
.charge-station-detail{
  .ivu-card-head {
    background: #c4dffb;
  }
}
</style>