<template>
  <div>
    <div>
      <span>城市：</span>
      <Select v-model="cityVal" placeholder="请选择城市" class="inline-box right15" style="width:120px;">
        <Option v-for="item in cityList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
      <ul class="inline-box">
        <li
          class="my-tab"
          :class="{'active':myTabVal==='1'}"
          @click="myTabVal='1';dateVal='';selectDateVal=nowDate;"
        >今日</li>
        <li
          class="my-tab right15"
          :class="{'active':myTabVal==='2'}"
          @click="myTabVal='2';dateVal='';selectDateVal=nowMonth;"
        >本月</li>
        <li class="inline-box">
          <DatePicker
            type="daterange"
            placement="bottom-end"
            placeholder="选择时间"
            style="width: 200px"
            v-model="dateVal"
            @on-change="selectDate"
            :clearable="false"
          ></DatePicker>
        </li>
      </ul>
    </div>
    <div>
      <div class="pull-right" style="width:270px;">
        <p class="fontsize16 bold" >时间段充电电量排名</p>
        <ul class="rank-list top15">
          <li class="fontsize14" style="padding-left:25px;">
            <span class="rank-time"></span>
            <span class="val-box bold">电量/度</span>
            <span class="val-box bold">车次</span>
          </li>
          <li v-for="(item,i) in rankList" :key="i">
            <span class="rank-num" :class="{'top':i<3}">{{i+1}}</span>
            <span class="rank-time">{{item.time}}</span>
            <span class="val-box">{{item.val1}}</span>
            <span class="val-box">{{item.val2}}</span>
          </li>
        </ul>
      </div>
      <div style="position:relative;margin-right:280px;">
        <p class="select-date">{{selectDateVal}}</p>
        <bar-graph/>
      </div>
    </div>
  </div>
</template>
<script>
import barGraph from "./bar-graph.vue";
import { timeFormat } from "@/libs/util";
export default {
  components: {
    barGraph
  },
  data() {
    return {
      rankList: [],//时段充电量排名
      selectDateVal: "", //显示的是今日日期，本月，还是时间段
      nowDate: "", //当前日期
      nowMonth: "", //当前月份
      myTabVal: "1", //tab值，1今日，2本月，3自选
      cityList: [], //筛选城市列表
      dateVal: "", //选择时间段
      cityVal: "" //选择城市
    };
  },
  mounted() {
    // 获取现在的日期和月份
    let date = new Date();

    this.nowDate = date.toLocaleDateString().replace(/\//g, "-");
    this.nowMonth =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1);
    this.selectDateVal = this.nowDate;
    // 获取城市下拉列表
    this.getCityList();
    this.getRankList();
  },
  methods: {
    getCityList() {
      this.cityList = [
        {
          name: "北京",
          id: "123123"
        },
        {
          name: "南京",
          id: "123124"
        }
      ];
      !this.cityVal && (this.cityVal = this.cityList[0].id);
    },
    // 选择日期触发
    selectDate(val) {
      this.myTabVal = "3";
      this.selectDateVal = val[0] + " 至 " + val[1];
    },
    // 获取排名列表
    getRankList(){
      this.rankList = [
        {
          time: '10:00-12:00',
          val1: '2000',
          val2: '500'
        },
        {
          time: '10:00-12:00',
          val1: '2000',
          val2: '500'
        },
        {
          time: '10:00-12:00',
          val1: '2000',
          val2: '500'
        },
        {
          time: '10:00-12:00',
          val1: '2000',
          val2: '500'
        },
        {
          time: '10:00-12:00',
          val1: '2000',
          val2: '500'
        },
        {
          time: '10:00-12:00',
          val1: '2000',
          val2: '500'
        },
        {
          time: '10:00-12:00',
          val1: '2000',
          val2: '500'
        },
        {
          time: '10:00-12:00',
          val1: '2000',
          val2: '500'
        },
        {
          time: '10:00-12:00',
          val1: '2000',
          val2: '500'
        },
        {
          time: '10:00-12:00',
          val1: '2000',
          val2: '500'
        },
        {
          time: '10:00-12:00',
          val1: '2000',
          val2: '500'
        },
        {
          time: '10:00-12:00',
          val1: '2000',
          val2: '500'
        }
      ]
    }
  }
};
</script>
<style lang="less" scoped>
// tab样式
.my-tab {
  width: 80px;
  text-align: center;
  display: inline-block;
  border-bottom: 2px solid transparent;
  line-height: 30px;
  font-size: 14px;
  cursor: pointer;
  &.active {
    color: #1890ff;
    border-bottom-color: #1890ff;
  }
}
// 选择后时间显示样式
.select-date {
  font-size: 16px;
  position: absolute;
  left: 50px;
  top: 24px;
  color: #333;
  font-weight: bold;
  padding: 3px 8px;
  background-color: #bfcedc;
}
.rank-list{
  line-height:30px;
  span{
    display: inline-block;
  }
  .rank-time{
    width:80px;
  }
  .val-box{
    width:80px;
    text-align: center;
  }
  .rank-num{
    width:15px;
    height:15px;
    border-radius: 50%;
    background: #f0f2f5;
    text-align: center;
    line-height: 15px;
    margin-right: 10px;
    &.top{
      background: #314659;
      color: #fff;
    }
  }
  
}
.bold{
    font-weight: 600;
  }

</style>

