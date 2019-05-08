<template>
  <div class="couponBox">
    <div class="couponmodel" v-for="(item, index) in coupons" :key="index">
      <Form inline :label-width='80'  class="couponForm">
        <div class="left">
          <div class="coupon">
            <div class="couponLeft">
              <p style="color:#2D8cF0" v-show="item.couponType===1">{{item.discount}}折</p>
              <p style="color:#2D8cF0" v-show="item.couponType===2">{{item.couponMoney}}元</p>
              <p style="font-size: 12px;" v-show="item.couponType===2">满 {{item.astrict}} 可用</p>
              <p style="font-size: 12px;" v-show="item.couponType===1">最高抵扣 {{item.highestMoney}} 元</p>
            </div>
            <div class="couponRight">
              <p class="couponType">{{couponTypeMap[item.couponType]}}</p>
              <p>{{item.couponName}}</p>
              <p>有效期：获取后{{item.effectiveDay}}天内可用</p>
              <p>{{limitMap[item.usePeriod]}}</p>
            </div>
          </div>
        </div>
        <div class="right">
          <FormItem label='优惠券名称'>
            <Input v-model="item.couponName" v-if="!isDetail" style="width:150px" :maxlength='8'></Input>
            <p v-else>{{item.couponName}}</p>
          </FormItem>
          <FormItem label='张数'>
            <InputNumber :max="10" :min="1" v-model="item.couponNum" v-if="!isDetail" style="width:100px"></InputNumber>
            <p v-else>{{item.couponNum}}</p>
          </FormItem>
          <FormItem label='有效期'>
            <div v-if="!isDetail">
              <span>获取后</span>
              <InputNumber v-model="item.effectiveDay" :min='1' :max="90" style="width:80px;margin:0 10px;"></InputNumber>
              <span>天内可用</span>
            </div>            
            <p v-else>获取后{{item.effectiveDay}}天内可用</p>
          </FormItem>
          <FormItem label='使用城市'>
            <div style="width:300px;">
              <Select style="width:300px" v-model="item.couponCityList" v-if="!isDetail" multiple clearable @on-change='changeCity(index, item.couponCityList)'>
                <Option value="2">全部已开通城市</Option>
                <Option v-for="(item, index) in citys" :key="index" :value="item.cityID" v-if="!isOnce">{{item.city}}</Option>
                <Option v-for="(item, index) in citys" :key="index" :value="item.cityUuid" v-if="isOnce">{{item.city}}</Option>
              </Select>
              <p v-else>
                <span>{{item.cityName}}</span>
              </p>
            </div>
          </FormItem>
          <FormItem label='使用时段'>
            <Select v-model="item.usePeriod" style="width:200px" v-if="!isDetail" @on-change='timeLimit' @on-open-change='getIndex(index)'>
              <Option :value="1">全天可用</Option>
              <Option :value="2">限制时段</Option>
            </Select>
            <span v-if="isDetail">{{limitMap[item.usePeriod]}}</span>
            <span v-if="isDetail&&item.usePeriod===2">({{item.periodBegin}}时 - {{item.periodEnd}}时)</span>
            <div v-show="item.isOtherTime">
              <Select style="width:100px;" placeholder="开始时段" v-model="item.periodBegin">
                <Option v-for="(item, i) in range" :value="item" :key="i" :disabled='item >= coupons[index].periodEnd'>{{item}}</Option>
              </Select>-
              <Select style="width:100px;" placeholder="结束时段" v-model="item.periodEnd">
                <Option v-for="(item, i) in range" :value="item" :key="i" :disabled='item <= coupons[index].periodBegin'>{{item}}</Option>
              </Select>
            </div>
          </FormItem>
          <span class="closeModel" v-if="!isDetail"><Icon type="md-close-circle" size='26' color='#ff5b33' @click="closeModel(index)"/></span>
        </div>
      </Form>
    </div>
    <div class="addmodel" v-if="!isDetail">
      <div class="modelTxt" @click="addModel">
        <img src="@/assets/images/addCoupon.png" style="width:100%">
      </div>
    </div>
    <Modal v-model="isShowModel" :mask-closable='false'>
      <p slot="header">请先选择优惠券模板</p>
      <Col class="demo-spin-col" span="8" v-show="isLoading" style="text-align:center">
        <Spin fix>加载中...</Spin>
      </Col>
      <div class="templateBox" v-show="!isLoading">
        <CheckboxGroup v-model='couponTemplate'>
          <Checkbox v-for="(item, index) in templateList" :label="item.uuid" :key="index" style="width:100%;padding:10px 0;">{{item.templateName}}</Checkbox>
        </CheckboxGroup>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long @click="saveTemplate">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { templateAll } from '@/api/passenger'
import { useTypeMap, useLimitMap } from '@/config/passengerTable'
import { selectItemByIds } from '@/libs/tools'


export default {
  props: {
    parentData: { // 从父级获取到的所有数据来源，用作展示
      type: Array,
      default: () => {
        return []
      }
    },
    citys: { // 从父级获取到的所有已开通的城市列表
      type: Array,
      default: () => {
        return []
      }
    },
    cityType: { // 用于选择城市编码还是城市的uuid
      type: String,
      default: 'cityID'
    },
    isOnce:{ // 用于一次性发券
      type: Boolean,
      default: false
    },
    isDetail:{ // 判断是否是详情
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      range: [...Array(25).keys()],
      isShowTime: false, // 是否显示时间段
      isShowModel: false, // 是否展示模板
      isOther: false, // 是否显示优惠券城市复选框
      coupons:[],
      isLoading: true,
      templateList: [], // 优惠券模板列表
      couponTemplate: [], //已选模板
      cityMap: {
        1: '全国所有城市',
        2: '全部已开通城市'
      },
      limitMap:{
        1: '全天可用',
        2: '限制时段'
      },
      couponTypeMap: {
        1: '折扣券',
        2: '抵扣券'
      }
    }
  },
  computed: {
    getCityName: function(id){
      let item = selectItemByIds(JSON.parse(localStorage.getItem('provinceCityList')), [id])
      console.log(item)
      return item.label
    }
  },
  watch:{
    coupons:{
      handler:function() {
        this.$emit('modelVal', this.coupons)
      },
      deep: true
    },
    parentData:{
      handler:function() {
        this.coupons = this.parentData ? this.parentData : []
      },
      deep: true
    }
  },
  mounted(){
    this.coupons = this.parentData ? this.parentData : []
  },
  methods: {
    getIndex(index){
      this.couponIndex = index
    },
    timeLimit(val){ // 使用时段转换
      let newCoupon = JSON.parse(JSON.stringify(this.coupons))
      newCoupon[this.couponIndex].isOtherTime = val === 2 ? true : false
      if(val === 1){
        newCoupon[this.couponIndex].periodBegin = 0
        newCoupon[this.couponIndex].periodEnd = 24
      }
      this.coupons = JSON.parse(JSON.stringify(newCoupon))
    },
    changeCity(index, val){
      let length = val.length
      let newCoupon = JSON.parse(JSON.stringify(this.coupons))
      if(val[length-1]==='1'){
        newCoupon[index].couponCityList = ['1']
      } else if (val[length-1]==='2'){
        newCoupon[index].couponCityList = ['2']
      } else {
        val.forEach((v, k) => {
          if(v==='1' || v==='2'){
            val.splice(k, 1)
          }
        })
        newCoupon[index].couponCityList = val
      }
      this.coupons = JSON.parse(JSON.stringify(newCoupon))
    },
    addModel(){ // 添加优惠券
      templateAll({}).then(res=>{
        if(res.data.success){
          this.isLoading = false
          this.templateList = res.data.data
          this.templateList.forEach(function(value, key){
            value.useType = useTypeMap[value.useType]
            value.useLimit = useLimitMap[value.useLimit]
          })        
        }
      })
      let length = this.coupons.length
      if(length <= 9) {
        this.isShowModel = true
      } else {
        this.$Message.warning('模板数量不能超过10个')
      }
    },
    saveTemplate(){ // 保存优惠券
      this.couponTemplate.forEach((v, k) => {
        this.templateList.forEach((value, index) => {
          if(value.uuid === v){
            let length = this.coupons.length
            if(length <= 9) {
              value.templateUuid = value.uuid
              delete value['uuid']
              value.couponNum = 1
              value.usePeriod = 1
              value.effectiveDay = 10
              value.couponCityList = ['2']
              value.isOtherTime = false
              value.periodBegin = 0
              value.periodEnd = 24
              this.coupons.push(value)
            } else {
              this.$Message.warning('模板数量不能超过10个')
            }       
          }
        })
      });
      this.isShowModel = false
      this.couponTemplate = []
    },
    closeModel(index) { // 删除优惠券
      this.coupons.splice(index, 1)
    }
  }
}
</script>
<style lang="less" scoped>
.couponBox{
  border: 1px solid #dcdee2;
  border-radius: 5px;
  .couponmodel {
    border-bottom: 1px dashed #dcdee2;
    width: 1100px;    
    .couponForm{
      display: flex;
      flex-wrap: wrap;
      height: 200px;
      align-items: center;
      .left {
        width: 35%;
        height: 100%;
        padding: 35px 20px;
        .coupon {
          border: 1px solid #e6e6e6;
          height: 100%;
          display: flex;
          .couponLeft {
            .verticalCenter;
            border-right: 1px solid #e6e6e6;
            height: 100%;
            width: 30%;
            font-size: 16px;
            text-align: center;
          }
          .couponRight {
            height: 100%;
            .verticalCenter;
              position: relative;
              width: 70%;
              padding-left: 20px;
            .couponType {
              border-bottom: 1px solid #e6e6e6;
              border-left: 1px solid #e6e6e6;
              position: absolute;
              right: 0px;
              top: 0px;
              padding: 5px;        
            }
          }
        }
      }
      .right {
        width: 65%;
        position: relative;
        height: 100%;
        padding: 35px 0;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        .closeModel {
          position:absolute;
          right:5px;
          top:5px;
          cursor:pointer;
        }
      }
    }
    .verticalCenter {
      display: flex;
      flex-direction: column;
      justify-content: center
    }
  }
  .couponmodel:hover{
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  }
  .addmodel {
    height: 150px;
    padding-left: 25px;
    width: 1100px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    .modelTxt{
      width: 350px;
      cursor: pointer;
    }
  }
}
.templateBox {
  height: 400px;
  overflow: auto;
  overflow-x: hidden;
}
</style>
