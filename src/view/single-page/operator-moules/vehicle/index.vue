<!--车辆管理入口-->
<template>
    <div>
        <Tabs v-model="TypeFlag">
          <TabPane label="快车" name="4">
              <ExpressCenter :bussinessType='TypeFlag' v-if="TypeFlag == 4"></ExpressCenter>
          </TabPane>
          <TabPane label="专车" name="2">
             <ExpressCenter :bussinessType='TypeFlag' v-if="TypeFlag == 2"></ExpressCenter>
          </TabPane>
          <TabPane label="出租车" name="1">
             <ExpressCenter :bussinessType='TypeFlag' v-if="TypeFlag == 1"></ExpressCenter>
          </TabPane>
        </Tabs>
    </div>
</template>
<script>
import ExpressCenter from './express-center.vue'

export default {
  name: 'manage',
  components: {ExpressCenter},
  data(){
    return{
      TypeFlag:'4'
    }
  },
  mounted() {
    let TypeFlag = this.$route.params.businessType || '4';
    switch (TypeFlag) {
      case 1: 
        this.TypeFlag = '1';
        break;
      case 2: 
        this.TypeFlag = '2';
        break;
      case 3: 
        this.TypeFlag = '3';
        break;
      case 4: 
        this.TypeFlag = '4';
        break;
      default: 
        this.TypeFlag = '4';
    }
  }
}
</script>
