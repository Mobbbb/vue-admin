<!--统计管理-整体统计-->
<template>
  <div class="statistics-manage">
    <ul class="line-flex-box">
      <li class="big-num-box color-blue">
        <p>充电电量( 度 )</p>
        <div>
          今日
          <span class="inline-val">30146658</span>
        </div>
      </li>
      <li class="big-num-box color-green">
        <p>充电收入( 元 )</p>
        <div>
          今日
          <span class="inline-val">30146658</span>
        </div>
      </li>
      <li class="line-flex-box">
        <div class="big-num-box color-blue">
          <p>账户余额支付( 元 )</p>
          <div>
            今日
            <span class="inline-val">30146658</span>
          </div>
        </div>
        <div class="big-num-box color-qing">
          <p>支付宝支付( 元 )</p>
          <div>
            今日
            <span class="inline-val">30146658</span>
          </div>
        </div>
        <div class="big-num-box color-light">
          <p>微信支付( 元 )</p>
          <div>
            今日
            <span class="inline-val">30146658</span>
          </div>
        </div>
      </li>
    </ul>
    <Divider/>
    <Tabs value="name1">
      <TabPane label="月统计" name="name1">
        <month-statistics></month-statistics>
      </TabPane>
      <TabPane label="列表" name="name2">
        <statistics-list></statistics-list>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import monthStatistics from './month-statistics/index.vue'
import statisticsList from './statistics-list/index.vue'
export default {
  components: {
    monthStatistics,
    statisticsList
  }
};
</script>
<style scoped lang="less" src="../../charge.less"></style>
<style lang="less">
.statistics-manage .ivu-tabs{
  overflow: visible;
}
</style>