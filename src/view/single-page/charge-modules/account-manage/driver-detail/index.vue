<template>
  <div>
    <Tabs v-model="tabObj.activeTab">
        <TabPane name="1" label="基本信息" style="padding-top: 10px;">
            <basic-info v-show="tabObj.activeTab === '1'" :id="id"></basic-info>
        </TabPane>
        <TabPane name="2" label="订单记录" style="padding-top: 10px;">
            <order-record v-show="tabObj.activeTab === '2'" :id="id"></order-record>
        </TabPane>
    </Tabs>
  </div>
</template>
<script>
import basicInfo from './basic-info/index.vue'
import orderRecord from './order-record/index.vue'
import { setTimeout } from 'timers';
import { tabObj } from "./fields";
export default {
  components: {
    basicInfo,
    orderRecord
  },
  data(){
    return {
      tabObj,
      id: this.$route.params.id
    }
  },
  beforeRouteUpdate (to, from, next) {
    if(to.name===from.name&&to.path!==from.path){
      // 获取司机信息
      this.id = to.params.id
    }
    next()
  }
}
</script>