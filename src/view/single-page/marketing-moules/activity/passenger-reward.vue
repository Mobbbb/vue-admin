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
          <FormItem label='banner图'>
            <div style="border:1px dashed #dcdee2;max-width:15%;">
              <img :src="formInline.revarchargeBanner" alt="" style="width:100%;">
            </div>
          </FormItem>
          <div>
            <span class="titleTxt" v-if="registerReward.length">注册成功</span>
            <div class="awardBox"  v-for="(item, index) in registerReward" :key="index">
              <div class="awardLeft">
                <Checkbox style="width:80px;text-align:right;padding-right:12px;" disabled v-model="isEnable">启用</Checkbox>
              </div>
              <div class="awardRight" v-if="item.rewardKind===1 && item.rewardType === 1">
                <FormItem label='奖励' :label-width="40">
                  <span>赠送币<span v-if="formInline.activityType===1">(到账时间：注册成功时)</span></span>
                </FormItem>
                <FormItem label='金额' :label-width="40">
                  <p>{{item.rewardMoney}}<span v-if="item.rewardMoney">元</span></p>
                </FormItem>
              </div>
              <div class="awardRight" v-else-if="registerCoupon.length">
                <FormItem label='奖励' :label-width="40">
                  <span>出行券<span v-if="formInline.activityType===1">(到账时间：注册成功时)</span></span>
                </FormItem>
                <CouponModal :parentData='registerCoupon' :isDetail="true" :citys='citys'></CouponModal>
              </div>
            </div>
          </div>
          <div>
            <span class="titleTxt" v-if="firstReward.length">完成首单</span>
            <div class="awardBox"  v-for="(item, index) in firstReward" :key="index">
              <div class="awardLeft">
                <Checkbox style="width:80px;text-align:right;padding-right:12px;" disabled v-model="isEnable">启用</Checkbox>
              </div>
              <div class="awardRight" v-if="item.rewardKind===1 && item.rewardType === 2">
                <FormItem label='奖励' :label-width="40">
                  <span>赠送币<span v-if="formInline.activityType===1">(到账时间：注册成功时)</span></span>
                </FormItem>
                <FormItem label='金额' :label-width="40">
                  <p>{{item.rewardMoney}}<span v-if="item.rewardMoney">元</span></p>
                </FormItem>
              </div>
              <div class="awardRight" v-else-if="firstCoupon.length">
                <FormItem label='奖励' :label-width="40">
                  <span>出行券<span v-if="formInline.activityType===1">(到账时间：注册成功时)</span></span>
                </FormItem>
                <CouponModal :parentData='firstCoupon' :isDetail="true" :citys='citys'></CouponModal>
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
import { getCitys } from '@/api/common'
import { selectItemByIds } from '@/libs/tools'

export default {
  components:{
    CouponModal
  },
  data(){
    return {
      ...defaultData,
      formInline: {},
      startEndTime: '',
      registerCoupon:[], // 注册成功的优惠券数组
      firstCoupon: [], // 首单的优惠券数组
      params: {
        uuid: this.$router.currentRoute.params.id
      },
      citys: [],
      isEnable: true,
      registerReward:[],
      firstReward: [],
      limitMap:{
        1: '全天可用',
        2: '限制时段'
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
    getCitys({}).then(res => {
      let arr = []
      res.data.data.forEach(item => {
        if(item.city){
          arr.push(item)
        }
      })
      this.citys = arr
    })
  },
  methods:{
    getDetail(params){
      this.registerCoupon = []
      this.firstCoupon = []
      this.registerReward = []
      this.firstReward = []
      activeDetail(params).then(res => {
        if(res.data.success){
          let list = []
          let arr = []
          let data = res.data.data
          this.formInline = data
          this.startEndTime = data.beginDate + ' - ' + data.endDate
          data.rewardEntityDtoList.forEach((v, k) => {
            if(v.rewardType===1 && v.rewardKind === 1){
              this.registerReward.push(v)
            } else if(v.rewardType===1 && v.rewardKind === 2){
              if(v.couponCityList[0] === '1'){
                v.cityName = '全国所有城市'
              } else if(v.couponCityList[0] === '2'){
                v.cityName = '全部已开通城市'
              } else {
                list = selectItemByIds(JSON.parse(localStorage.getItem('provinceCityList')), v.couponCityList)
                list.forEach(item => {
                  arr.push(item.label)
                })
                v.cityName = arr.join()
              }
              this.registerCoupon.push(v)
            } else if(v.rewardType === 2 && v.rewardKind === 1) {
              this.firstReward.push(v)
            } else if(v.rewardType === 2 && v.rewardKind === 2){
              if(v.couponCityList[0] === '1'){
                v.cityName = '全国所有城市'
              } else if(v.couponCityList[0] === '2'){
                v.cityName = '全部已开通城市'
              } else {
                list = selectItemByIds(JSON.parse(localStorage.getItem('provinceCityList')), v.couponCityList)
                list.forEach(item => {
                  arr.push(item.label)
                })
                v.cityName = arr.join()
              }
              this.firstCoupon.push(v)
            }
          })
          if(this.registerCoupon.length){
            this.registerReward.push(this.registerCoupon)
          }
          if(this.firstCoupon.length){
            this.firstReward.push(this.firstCoupon)
          }
        }
      })
    }
  }
}
</script>
<style lang="less" sc>
.awardBox {
  display: flex;
  .awardLeft {
    padding-top: 8px;
  }
}
.titleTxt{
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
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
