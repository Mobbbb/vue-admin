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
          <FormItem label='充值banner图'>
            <img :src="formInline.revarchargeBanner" alt="" style="height:300px;height:100px;">
          </FormItem>
          <table cellspacing="0" class="Table">
            <thead>
              <td width='150'>充值金额</td>
              <td width='150'>奖励类型</td>
              <td width='250'>金额</td>
            </thead>
            <tbody>
              <tr v-for="(item, index) in discountCoupon" :key="index">
                <td>{{item.revarchargeMoney}}</td>
                <td>
                  {{item.rewardKindText}}
                </td>
                <td>
                  <span style="width:100px;" v-if="item.rewardKind===1">{{item.rewardMoney}}</span>
                  <div v-else>
                    <span v-show="!item.isShowBtn">{{item.couponInfo}}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
import Vupload from '_a/v-upload/v-upload'
import CouponModal from '_a/couponModal/couponModal'
import { activeDetail, rechargeRule } from '@/api/passenger'
import {defaultData } from './fields'
export default {
  components:{
    Vupload,
    CouponModal
  },
  data(){
    return {
      ...defaultData,
      formInline:{},
      time: '',
      discountCoupon: [],
      params:{
        uuid: this.$router.currentRoute.params.id // 活动详情接口参数
      },
      params2: {
        activityUuid: this.$router.currentRoute.params.id // 充送规则接口参数
      }
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.params.uuid = to.params.id
    this.params2.activityUuid = to.params.id
    this.getDetail(this.params)
    this.getTableData(this.params2)
    next();
  },
  created(){
    this.getDetail(this.params) // 获取页面详情数据
    this.getTableData(this.params2) // 获取表格数据
  },
  methods:{
    getDetail(params){
      activeDetail(params).then(res => {
        if(res.data.success){
          let data = res.data.data
          this.formInline = data
          this.time = data.beginDate + ' - ' + data.endDate
          if(data.city===1){
            this.formInline.cityName = '全国城市'
          } else if(data.city===2){
            this.formInline.cityName = '全部已开通城市'
          }    
        }
      })
    },
    getTableData(params){
      rechargeRule(params).then(res => {
        if(res.data.success){
          this.discountCoupon = res.data.data
          this.discountCoupon.forEach((v, k) => {
            if(v.rewardKind === 2){
                v.rewardKindText = '优惠券'
                v.couponInfo = v.rewardSum + '元(共'+ (v.discountNum + v.deductionNum) +'张券，含'+ v.discountNum +"张折扣券、"+ v.deductionNum +'张抵扣券)'
              } else if(v.rewardKind === 1){
                v.rewardKindText = '赠送币'
              }
          })
          this.discountCoupon.sort(this.compare("revarchargeMoney"))
        }
      })
    },
    compare(propertyName){ // 充值规则排序
      return function(obj1, obj2){
        let value1 = obj1[propertyName]
        let value2 = obj2[propertyName]
        if(value1 < value2){
          return -1
        } else if (value1 > value2){
          return 1
        } else {
          return 0
        }
      }      
    }
  }
}
</script>
<style lang="less" scoped>
.Table{
  text-align: center;
  border-collapse: collapse;
  border: 1px solid;
  margin-left: 100px;
  td{
    border: 1px solid;
    height: 50px;
  }
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
