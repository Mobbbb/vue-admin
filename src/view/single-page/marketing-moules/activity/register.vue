<template>
  <div>
    <div class="registerTop">
      <Row>
        <Form ref="formInline" :model="formInline" :label-width="100">
          <FormItem label='状态'>
            {{activityStatusMap[formInline.activityStatus]}}
          </FormItem>
          <FormItem label='名称'>
            {{formInline.activityName}}
          </FormItem>
          <FormItem label="在线时间">
            {{time}}
          </FormItem>
          <FormItem label='使用城市'>
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
            <span class="titleTxt">注册成功</span>
            <div class="awardBox" v-for="(item, index) in rewardArr" :key="index">
              <div class="awardLeft">
                <Checkbox style="width:80px;text-align:right;padding-right:12px;" disabled v-model="enable">启用</Checkbox>
              </div>
              <div class="awardRight" v-if="item.rewardKind===1">
                <FormItem label='奖励' :label-width="40">
                  <span>赠送币<span v-if="formInline.activityType===1">(到账时间：注册成功时)</span></span>
                </FormItem>
                <FormItem label='金额' :label-width="40">
                  <p>{{item.rewardMoney}}<span v-if="item.rewardMoney">元</span></p>
                </FormItem>
              </div>
              <div class="awardRight" v-else-if="couponArr.length">
                <FormItem label='奖励' :label-width="40">
                  <span>出行券<span v-if="formInline.activityType===1">(到账时间：注册成功时)</span></span>
                </FormItem>
                <CouponModal :parentData='couponArr' :citys='citys' :isDetail="true"></CouponModal>
              </div>
            </div>
          </div>
        </Form>
      </Row>
    </div>
    <div class="bottomInfo">
      <p>创建者：{{formInline.createdBy}}</p>
      <p>创建时间：{{formInline.createdOn}}</p>
      <p v-if="formInline.activityStatus===4">关闭者：{{formInline.closedBy}}</p>
      <p v-if="formInline.activityStatus===4">关闭时间：{{formInline.closedOn}}</p>
    </div>
  </div>
</template>
<script>
import CouponModal from '_a/couponModal/couponModal'
import { couponTypeMap } from '@/config/passengerTable'
import { activeDetail } from '@/api/passenger'
import { getCitys } from '@/api/common'
import { defaultData } from './fields'
import { selectItemByIds } from '@/libs/tools'

export default {
  components:{
    CouponModal
  },
  data(){
    return {
      ...defaultData,
      formInline:{
        enable: false, // 是否启用赠送币
        isCoupon: false, // 是否启用优惠券
      },
      time: '',
      citys: [],
      couponArr: [],
      isShowCoupon: false,
      params: {
        uuid: this.$router.currentRoute.params.id
      },
      enable: true,
      rewardArr: [],
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
      activeDetail(params).then(res => {
        this.couponArr = []
        this.rewardArr = []
        if(res.data.success){
          let data = res.data.data
          this.formInline = data
          this.time = data.beginDate + ' - ' + data.endDate
          data.rewardEntityDtoList.forEach((v, k) => {
            let list = []
            let arr = []
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
            if(v.rewardKind === 1){
              this.rewardArr.push(v)
            }
            if(v.rewardKind === 2){
              this.couponArr.push(v)
            }
          })
          if(this.couponArr.length){
            this.rewardArr.push(this.couponArr)
          }          
        }
      })
    }
  }
}
</script>
<style lang="less">
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
