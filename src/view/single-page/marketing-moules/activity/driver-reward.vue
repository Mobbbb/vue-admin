<template>
  <div>
    <div class="rewardTop">      
      <Row>
        <Form ref="formInline" :model="formInline" :label-width="80">
          <FormItem label='状态'>
            {{activityStatusMap[formInline.activityStatus]}}
          </FormItem>
          <FormItem label='奖励名称'>
            {{formInline.activityName}}
          </FormItem>
          <FormItem label="起始时间">
            {{startEndTime}}
          </FormItem>
          <FormItem label='针对城市'>
            {{formInline.cityName}}
          </FormItem>
          <FormItem label='优先级'>
            {{formInline.level}}
          </FormItem>
          <div v-for="(item, index) in formInline.rewardEntityDtoList" :key="index">
            <span class="titleTxt" v-if="(formInline.activityType===2||formInline.activityType===3)&&item.rewardType===1&&item.rewardKind===1">注册成功</span>
            <span class="titleTxt" v-else-if="(formInline.activityType===2||formInline.activityType===3)&&item.rewardType===2&&item.rewardKind===1">完成首单</span>
            <div class="awardBox">
              <div class="awardLeft">
                <Checkbox style="width:80px;text-align:right;padding-right:12px;" :true-value='1' :false-value='2' v-model="item.enable">启用</Checkbox>
              </div>
              <div class="awardRight" v-if="item.rewardKind===1">
                <FormItem label='奖励' :label-width="40">
                  <span>赠送币<span v-if="formInline.activityType===1">(到账时间：注册成功时)</span></span>
                </FormItem>
                <FormItem label='金额' :label-width="40">
                  <InputNumber v-model="item.rewardMoney" :min='0' style="width:300px"></InputNumber><span style="font-size:15px;line-height:32px;padding-left:5px;">元</span>
                </FormItem>
              </div>
              <div class="awardRight" v-else-if="item.rewardKind===2">
                <FormItem label='奖励' :label-width="40">
                  <span>出行券<span v-if="formInline.activityType===1">(到账时间：注册成功时)</span></span>
                </FormItem>
                <CouponModal :parentData='couponArr'></CouponModal>
              </div>
            </div>
          </div>
        </Form>
      </Row>
    </div>
    <div class="bottomInfo">
      <p>创建者：{{formInline.createdBy}}</p>
      <p>创建时间：{{formInline.createdOn}}</p>
      <p v-show="formInline.activityStatus===4">关闭者：{{formInline.closedBy}}</p>
      <p v-show="formInline.activityStatus===4">关闭时间：{{formInline.closedOn}}</p>
    </div>
  </div>
</template>
<script>
import CouponModal from '_a/couponModal/couponModal'
import { activeDetail } from '@/api/passenger'
import { defaultData } from './fields'
export default {
  components:{
    CouponModal
  },
  data(){
    return {
      ...defaultData,
      formInline: {},
      startEndTime: '',
      params:{
        uuid: this.$router.currentRoute.params.id
      }
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.params.uuid = to.params.id
    this.getDetail(this.params)
    next();
  },
  created(){
    this.getDetail(this.params)
  },
  methods:{
    getDetail(params){
      activeDetail(params).then(res => {
        if(res.data.success){
          let data = res.data.data
          this.formInline = data
          this.startEndTime = data.beginDate + ' - ' + data.endDate
          data.rewardEntityDtoList.forEach((v, k) => {
            if(v.rewardType===1){
              this.formInline.registerGiftmoney = v.rewardMoney
            } else if (v.rewardType === 2) {
              this.formInline.firstGiftmoney = v.rewardMoney
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less">
.titleTxt{
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
}
.awardBox {
  display: flex;
  .awardLeft {
    padding-top: 8px;
  }
}
.footer {
  width: 20%;
  text-align: center;
  margin: 0 auto;
  margin-top: 50px;
}
.bottomInfo{
  margin-top: 50px;
  width: 350px;
  padding: 20px;
  border:1px dashed #000000;
  p{
    padding: 10px;
  }
}
</style>
