/<!--统计管理-整体统计-月统计折线-->
<template>
  <div class="month-statistics">
    <div>
      <div class="pull-left">
        <span>选择月份：</span>
        <Select v-model="lineMonth" placeholder="请选择月份" class="month-select">
          <Option v-for="item in nowMonth" :value="item" :key="item">{{ item }}月</Option>
        </Select>
      </div>
      <!-- 月总量统计 -->
      <ul class="line-flex-box" style="margin-left:200px;">
        <li class="small-num-box color-blue">
          <p>充电电量( 度 )</p>
          <div>
            今日
            <span class="inline-val">30146658</span>
          </div>
        </li>
        <li class="small-num-box color-green">
          <p>充电收入( 元 )</p>
          <div>
            今日
            <span class="inline-val">30146658</span>
          </div>
        </li>
        <li class="line-flex-box">
          <div class="small-num-box color-blue">
            <p>账户余额支付( 元 )</p>
            <div>
              今日
              <span class="inline-val">30146658</span>
            </div>
          </div>
          <div class="small-num-box color-qing">
            <p>支付宝支付( 元 )</p>
            <div>
              今日
              <span class="inline-val">30146658</span>
            </div>
          </div>
          <div class="small-num-box color-light">
            <p>微信支付( 元 )</p>
            <div>
              今日
              <span class="inline-val">30146658</span>
            </div>
          </div>
        </li>
      </ul>
      <!-- 统计折线图 -->
      <broken-line class="top40"/>
      <!-- 品牌交易情况 -->
      <div class="top40">
        <div class="brand-tab text-center right30">
          品牌交易情况
        </div>
        <span>选择月份：</span>
        <Select v-model="brandMonth" placeholder="请选择月份" class="month-select">
          <Option v-for="item in nowMonth" :value="item" :key="item">{{ item }}月</Option>
        </Select>
      </div>
      <ul class="flex-start flex-wrap top20">
        <li class="right50 bottom30" v-for="(brand,i) in brandList" :key="brand.id">
          <h6 class="brand-tit">{{brand.name}}</h6>
          <div class="big-num-box three-line" :class="i%2===1?'color-blue':'color-green'">
            <div>
              充电电量( 度 )
              <span class="inline-val">{{brand.val1}}</span>
            </div>
            <div>
              充电费用( 元 )
              <span class="inline-val">{{brand.val2}}</span>
            </div>
            <!-- 需要看后台给不给时间，不给要自己获取 -->
            <div class="brand-time text-center">2019-02</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import brokenLine from "./broken-line.vue";
export default {
  components: {
    brokenLine
  },
  data() {
    return {
      lineMonth: "",
      brandMonth: "",
      nowMonth: 0,
      brandList: []
    };
  },
  mounted() {
    this.nowMonth = new Date().getMonth();
    this.brandMonth = this.nowMonth;
    // 获取品牌交易情况
    this.getBrandList();
  },
  methods: {
    getBrandList() {
      this.brandList = [
        {
          id: 123123,
          name: "品牌1",
          val1: 29088,
          val2: 303221
        },
        {
          id: 123125,
          name: "品牌2",
          val1: 29088,
          val2: 303221
        },
        {
          id: 123124,
          name: "品牌3",
          val1: 29088,
          val2: 303221
        }
      ];
    }
  }
};
</script>
<style scoped lang="less" src="../../../charge.less"></style>
<style lang="less">
.brand-tab {
  display: inline-block;
  line-height: 38px;
  border-bottom: 2px solid #2d8cf0;
  color:#2d8cf0;
  width:130px;
  font-size: 14px;
}
.month-statistics {
  .month-select {
    width: 150px;
    display: inline-block;
  }
  .brand-time {
    line-height: 36px;
  }
  .brand-tit {
    text-align: center;
    font-size: 16px;
    line-height: 30px;
    color:#333;
  }
}
</style>
