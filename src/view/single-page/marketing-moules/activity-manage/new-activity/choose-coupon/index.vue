<template>
  <div class="choose-coupon">
    <p class="title" v-if="title">{{title}}：<span v-if="couponList.length===0 && isEdit" style="margin-left:10px; font-size:12px;">未设置</span></p>
    <span v-if="!isEdit">选择优惠券模板</span>
    <div>
      <ul class="coupon-list">
        <li v-for="(item,index) in couponList" :key="item.templateCode+index">
          <Form :ref="'editInfo'+index" :model="item" :rules="isEdit?{}:ruleValidate">
            <div class="coupon-item">
              <span class="index-num">{{index+1}}.</span>
              <Icon
                v-if="!isEdit"
                class="close-icon fontsize18"
                @click="removeCoupon(index)"
                type="ios-close-circle-outline"
              />
              <!-- 左侧图片优惠券 -->
              <div class="coupon-left">
                <div class="small-left" v-if="item.templateType===1">
                  <p class="fontsize18" style="color:#2D8cF0">{{item.discount}}折</p>
                  <p>最高抵扣 {{item.highestMoney}} 元</p>
                </div>
                <div class="small-left" v-else>
                  <p class="fontsize18" style="color:#2D8cF0">{{item.couponMoney}}元</p>
                  <p v-if="item.needCondition	">满 {{item.conditionMoney}} 可用</p>
                  <p v-else>不限门槛</p>
                </div>
                <div class="small-right">
                  <span class="coupon-icon" v-if="item.templateType===1">折扣券</span>
                  <span class="coupon-icon" v-else>抵扣券</span>
                  <p
                    class="coupon-name"
                    v-if="!item.nameInput"
                    @click="changeName(index,true)"
                  >{{item.couponName}}</p>
                  <div v-else>
                    <Input style="width:160px;" @on-blur="NameBlur(index)" v-model="item.couponName" size="small"/>
                    <Button
                      class="top-move"
                      size="small"
                      type="primary"
                      @click="changeName(index,false)"
                    >确定</Button>
                  </div>
                </div>
              </div>
              <!-- 右侧填写内容 -->
              <div class="coupon-right">
                <!-- 每次奖励券张数 -->
                <FormItem v-if="isEvery" label="每次奖励券张数：" prop="perRewardNum">
                  <InputNumber
                    :min="0"
                    :disabled="isEdit"
                    v-model="item.perRewardNum"
                    placeholder="张数"
                    style="width:70px;vertical-align:top;"
                  ></InputNumber>
                </FormItem>
                <!-- 发放总额度 -->
                <FormItem label="发放总额度(元)：" prop="totalRewardAmount">
                  <InputNumber
                    :min="1"
                    v-model="item.totalRewardAmount"
                    placeholder="额度"
                    style="width:100px;vertical-align:top;"
                    @on-blur="addCouponNum(index)"
                  ></InputNumber>
                </FormItem>
                <!--  发券总张数-->
                <FormItem label="发券总张数：">
                  <span>{{Math.floor(item.totalRewardAmount/(item.templateType===1?item.highestMoney:item.couponMoney))}}</span>
                </FormItem>
                <!-- 券有效期 -->
                <FormItem label="券有效期：" prop="validityType">
                  <Select
                    v-model="item.validityType"
                   :disabled="isEdit"
                    @on-change="refreshCouponList"
                    placeholder="请选择"
                    style="width:100px;"
                  >
                    <Option :value=1>固定期限</Option>
                    <Option :value=2>动态有效期</Option>
                  </Select>
                </FormItem>
                <FormItem v-if="item.validityType===1" label="固定期限：" prop="guding">
                  <!-- <DatePicker
                    clearable
                   :disabled="isEdit"
                    type="datetimerange"
                    :options="optionsTime"
                    :editable="false"
                    style="width:300px"
                    placeholder="请选择固定期限"
                    @on-change="changeTime(index)"
                    v-model="item.guding"
                  ></DatePicker> -->
                  <el-date-picker
                    size="small"
                    clearable
                    :disabled="isEdit"
                    v-model="item.guding"
                    :picker-options="optionsTime"
                    :editable="false"
                    type="datetimerange"
                    align="left"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    style="width:360px"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    @change="changeTime(index)"></el-date-picker>
                </FormItem>
                <FormItem v-if="item.validityType===2" label="动态有效期：" prop="effectiveDays">
                  <InputNumber
                   :disabled="isEdit"
                    :min="1"
                    v-model="item.effectiveDays"
                    placeholder="有效期"
                    style="width:70px;vertical-align:top;"
                  ></InputNumber>天内可用
                </FormItem>
                <FormItem label="使用城市：" prop="useCityArray">
                  <Select
                    v-model="item.useCityArray"
                   :disabled="isEdit"
                    filterable
                    multiple
                    clearable
                    @on-change="changeItemCity(index, item.useCityArray)"
                    placeholder="请选择使用城市"
                    style="width:260px;"
                  >
                    <Option value="1">全国所有城市</Option>
                    <!-- <Option value="2">全部已开通城市</Option> -->
                    <Option
                      v-for="city in cityList"
                      :key="city.cityID"
                      :value="city.cityID"
                    >{{city.city}}</Option>
                  </Select>
                </FormItem>
                <FormItem label="使用时段：" prop="timeSlot">
                  <TimePicker
                    v-model="item.timeSlot"
                   :disabled="isEdit"
                    :editable="false"
                    type="timerange"
                    placeholder="请选择"
                    @on-change="formatTime(index)"
                    style="width: 150px"
                  ></TimePicker>
                </FormItem>
                <div style="display:inline-block">
                  <FormItem label="券模板名称：">
                    <span>{{item.templateName}}</span>
                  </FormItem>
                  <FormItem label="券模板编码：">
                    <span>{{item.templateCode}}</span>
                  </FormItem>
                  <FormItem label="业务线：">
                    <span v-for="(val,index) in item.businessTypeList" :key="val">{{businessLineMap[val]}} {{index == item.businessTypeList.length-1?'':'/'}}</span>
                  </FormItem>
                  <FormItem label="订单类型：">
                    <span v-for="(val,index) in item.userLimitList" :key="val">{{orderMap[val]}} {{index == item.userLimitList.length-1?'':'/'}}</span>
                  </FormItem>
                </div>
              </div>
            </div>
            <!-- 限定时段 -->
            <div v-if="isLimit" style="display:flex">
              <FormItem>
                <Checkbox :disabled="isEdit" :true-value="1" :false-value="0" v-model="item.activityLimitTime">限定时段</Checkbox>
              </FormItem>
              <FormItem prop="startLimitTime" v-if="item.activityLimitTime">
                <TimePicker :disabled="isEdit" v-model="item.startLimitTime" type="time" placeholder="开始时间" style="width: 100px"></TimePicker>
                <span style="margin-left:15px;">-</span>
              </FormItem>
              <FormItem prop="endLimitTime" v-if="item.activityLimitTime">
                <TimePicker :disabled="isEdit" v-model="item.endLimitTime" type="time" placeholder="结束时间" style="width: 100px"></TimePicker>
              </FormItem>
            </div>
            <!-- 限定区域 -->
            <div v-if="isLimit">
              <FormItem style="margin-bottom:6px;">
                <Checkbox :disabled="isEdit" :true-value="1" :false-value="0" v-model="item.activityLimitArea">限定区域</Checkbox>
                <Button style="margin-left:15px;" @click="openAreaModal(item,index)" v-if="item.activityLimitArea && !isEdit" type="primary" size="small">选择电子围栏</Button>
              </FormItem>
              <FormItem  v-if="item.activityLimitArea"  style="min-width:200px;margin-left:20px;" prop="areaList">
                <span>电子围栏名称：{{item.electronicCrawlName}}</span>
              </FormItem>
            </div>
          </Form>
        </li>
      </ul>
      <!-- 奖励方式 -->
      <div v-if="isAwardType && couponList.length>0">
        <Form :ref="'awardType'" :model="awardTypeObj" :rules="isEdit?{}:ruleValidate">
          <FormItem label="奖励方式 " prop="couponRewardType">
            <RadioGroup v-model="awardTypeObj.couponRewardType" class="right15">
                <Radio :disabled="isEdit" :label="1">每单奖励</Radio>
                <Radio :disabled="isEdit" :label="2">阶梯奖励</Radio>
            </RadioGroup>
          </FormItem>
          <!-- 每单奖励 -->
          <FormItem v-if="awardTypeObj.couponRewardType===1 && awardTypeObj.ladder.length>0" :label="awardTypeList.onlyStart" prop="ladder">
            <InputNumber
              :disabled="isEdit"
              :min="1"
              v-model="awardTypeObj.ladder[0].ladderValue"
              style="width:70px;vertical-align:top;"
            ></InputNumber>{{awardTypeList.onlyMiddle}}
            <InputNumber
              :min="1"
              :disabled="isEdit"
              v-model="awardTypeObj.ladder[0].rewardValue"
              style="width:70px;vertical-align:top;"
            ></InputNumber>{{awardTypeList.onlyEnd}}
          </FormItem>
          <!-- 阶梯奖励 -->
          <FormItem v-if="awardTypeObj.couponRewardType===2" label="" prop="ladder">
            <ul class="recom-list">
              <li class="recom-head">
                <div class="recom-first div-item">{{awardTypeList.tableFirst}}</div>
                <div class="div-item">{{awardTypeList.tableSecond}}</div>
              </li>
              <li class="recom-body" v-for="(item,index) in awardTypeObj.ladder" :key="index">
                <div class="recom-first div-item">
                  <InputNumber
                    :disabled="isEdit"
                    :min="1"
                    size="small"
                    v-model="item.ladderValue"
                    style="width:100px;vertical-align:top;"
                  ></InputNumber>
                </div>
                <div class="div-item">
                  <InputNumber
                    :disabled="isEdit"
                    :min="1"
                    size="small"
                    v-model="item.rewardValue"
                    style="width:100px;vertical-align:top;"
                  ></InputNumber>
                </div>
                <Icon v-if="index>0 && !isEdit" @click="removeRecomList(index)" class="remove-icon" type="ios-remove-circle-outline" />
              </li>
            </ul>
            <Button v-if="awardTypeObj.ladder.length<5 && !isEdit" @click="addRecomList()" size="small">添加阶梯</Button>
          </FormItem>
        </Form>
      </div>
      <!-- 新增 -->
      <div class="coupon-box" v-if="couponList.length===0 && !isEdit">
        <img @click="isCouponModal=true" src="../../../../../../assets/images/addCoupon.png">
      </div>
      <Button v-if="couponList.length>0 && couponList.length<limitNumber && !isEdit" type="primary" @click="isCouponModal=true">选择优惠券模板</Button>
    </div>
    <Modal
      width="80%"
      title="请选择优惠券模板"
      footer-hide
      v-model="isCouponModal">
        <coupon-modal
          :isRepeat="isLimit"
          :isShow="isCouponModal"
          :limitNumber="isLimit?15-couponList.length:limitNumber"
          :list="couponList"
          @close="isCouponModal=false"
          @selectDown="selectDown"
        ></coupon-modal>
    </Modal>
    <Modal
      class="coupon-modal"
      title="电子围栏"
      footer-hide
      v-model="isAreaModal">
        <area-modal
          :isShow="isAreaModal"
          :selectAreaUuid="selectAreaUuid"
          :cityList="selectCityList"
          @close="isAreaModal=false"
          @selectDown="selectAreaDown"
        ></area-modal>
    </Modal>
  </div>
</template>
<script>
import { orderMap,businessLineMap } from "../../fields";
import {cacheData1,cacheData2,cacheData3} from "./fields";
import couponModal from "../coupon-modal/index.vue";
import areaModal from "../area-modal/index.vue";
export default {
  props: {
    // 优惠券类型
    title: {
      type:String,
      default: '选择优惠券模板'
    },
    // 城市下拉列表
    cityList:{
      type:Array,
      default:()=>[]
    },
    // 为了缓存，当有多个优惠券的时候，要区分缓存，目前只有1,2
    type: {
      type:String,
      default:'1'
    },
    isLimit: {//是否要限定时段和限定区域,优惠券模板可以选择相同的
      type: Boolean,
      default: false
    },
    isAwardType: {//是否有奖励方式
      type: Boolean,
      default: false
    },
    awardTypeList:{
      type:Object,
      default:()=>{}
    },
    isEdit: {//是否编辑
      type: Boolean,
      default: false
    },
    limitNumber:{
      type:Number,
      default: 15
    },
    isEvery: {//是否有每次奖励券张数
      type: Boolean,
      default: false
    },
    list:{
      type:Array,
      default:()=>[]
    },
    awardObj:{
      type:Object,
      default:()=>{}
    },
    selectCityList: {
      type:Array,
      default:()=>[]
    }
  },
  data() {
    let cacheData = this.type==='1'?cacheData1:this.type==='2'?cacheData2:cacheData3
    return {
      ...cacheData,
      couponList:[],
      awardTypeObj: {
        couponRewardType: null,
        ladder: [
          {ladderValue: null,rewardValue: null}
        ]
      },
      orderMap,
      businessLineMap,
      isCouponModal: false,
      isAreaModal: false,
      selectAreaUuid:'',
      selectAreaIndex: 0
    };
  },
  components: {
    couponModal,
    areaModal
  },
  mounted(){
    if(this.isEdit){
      this.setCouponList()
    }
  },
  methods: {
    addCouponNum(index){
      let item = this.couponList[index]
      let val = item.totalRewardAmount
      if(val===null){
        this.couponList[index].totalCouponNum = 0
        return false
      }
      if(String(val).indexOf('.')){
        this.couponList[index].totalRewardAmount = parseInt(val)
        val = parseInt(val)
      }
      this.couponList[index].totalCouponNum = Math.floor(val/(item.templateType===1?item.highestMoney:item.couponMoney))
    },
    formatTime(index){
      let time = this.couponList[index].timeSlot
      this.couponList[index].useLimitBeginTime = time[0]
      this.couponList[index].useLimitEndTime = time[1]
    },
    changeTime(index){
      let time = this.couponList[index].guding
      this.couponList[index].startTime = time[0]
      this.couponList[index].endTime = time[1]
    },
    selectAreaDown(item){
      this.$set(this.couponList[this.selectAreaIndex],'electronicCrawlName',item.name)
      this.$set(this.couponList[this.selectAreaIndex],'electronicCrawl',item.uuid)
    },
    openAreaModal(item,index){
      if(this.selectCityList.length===0){
        this.$Message.warning('请先选择活动城市')
        return false
      }
      this.selectAreaUuid = item.electronicCrawl
      this.selectAreaIndex = index
      this.isAreaModal = true
    },
    // 删除一个阶梯奖励
    removeRecomList(index){
      this.awardTypeObj.ladder.splice(index,1)
    },
    // 添加一个阶梯奖励
    addRecomList(){
      this.awardTypeObj.ladder.push({
        ladderValue: null,
        rewardValue: null
      })
    },
    handleSubmit(){
      let that = this
      let len = this.couponList.length
      let failedNum = 0//不通过验证的优惠券个数
      if(len===0){
        return true
      }
      for(let i=0;i<len;i++){
        let refName = 'editInfo'+i
        that.$refs[refName][0].validate(valid => {
          if (!valid) {
            failedNum++
          }
        })
      }
      //优惠券验证通过
      if(failedNum===0){
          // 奖励方式验证
        if(this.isAwardType){
          let isSuccess = false
          that.$refs['awardType'].validate(valid => {
            if (valid) {
              isSuccess = true
            }
          })
          return isSuccess
        }else{
          return true
        }
      }else{
        return false
      }
    },
    refreshCouponList() {
      this.couponList.splice(0, 1, this.couponList[0]);
    },
    // 选择优惠券模板
    selectDown(list) {
      let that = this
      function setData(item){
        that.$set(item, 'nameInput', false)
        that.$set(item, 'couponName', item.templateName||'')//券名称
        that.$set(item, 'templateUuid', item.uuid)//模板uuid
        that.$set(item, 'perRewardNum', null)//每次奖励券张数,
        that.$set(item, 'totalRewardAmount', null) //发放总额度(元)
        that.$set(item, 'validityType', null) // 券有效期
        that.$set(item, 'guding', [])// 固定有效期：
        that.$set(item, 'effectiveDays', null) // 动态有效期
        that.$set(item, 'useCityArray', [])// 城市
        that.$set(item, 'timeSlot', []) // 使用时限
        that.$set(item, 'activityLimitTime', false) // 限定时间
        that.$set(item, 'activityLimitArea', false) // 限定区域
        that.$set(item, 'startLimitTime', '') // 限定开始时间
        that.$set(item, 'endLimitTime', '') // 限定结束时间
        that.$set(item, 'electronicCrawl', '') // 限定区域围栏列表
        that.$set(item, 'electronicCrawlName', '') // 限定区域围栏列表
        delete item.uuid
        return item
      }
      // 如果优惠券模板可以选择重复的
      if(this.isLimit){
        list.forEach(item => {
          let newItem = setData(item)
          this.couponList.push(newItem);
        });
        return false
      }
      let couponListCopy = JSON.parse(JSON.stringify(this.couponList));
      this.couponList.splice(0, this.couponList.length);
      let couponListHash = {};
      couponListCopy.forEach((item, index) => {
        couponListHash[item.templateCode] = String(index);
      });
      let addList = []
      list.forEach(item => {
        let index = couponListHash[item.templateCode];
        if (index) {
          this.couponList.push(couponListCopy[index]);
        } else {
          let newItem = setData(item)
          addList.push(newItem)
          // this.couponList.push(item);
        }
      });
      this.couponList.push(...addList);
    },
    // 删除优惠券
    removeCoupon(index) {
      this.couponList.splice(index, 1);
    },
    NameBlur(index){
      if(this.isEdit){
        return false
      }
      let name = this.couponList[index].couponName
      let len = name.length;
      if (len > 10) {
        this.$Message.error("最多输入10个字符");
        this.couponList[index].couponName = name.slice(0,10)
      } else if (len === 0) {
        this.$Message.error("名称不能为空");
        this.couponList[index].couponName = this.couponList[index].templateName
      }
    },
    // 修改优惠券名称
    changeName(index, status) {
      if(this.isEdit){
        return false
      }
      if (!status) {
        let len = this.couponList[index].couponName.length;
        if (len > 10) {
          this.$Message.error("最多输入10个字符");
        } else if (len === 0) {
          this.$Message.error("名称不能为空");
        } else {
          this.couponList[index].nameInput = status;
        }
      } else {
        this.couponList[index].nameInput = status;
      }
      this.couponList.splice(0, 1, this.couponList[0]);
    },
    changeItemCity(index, val) {
      let length = val.length;
      let cityListCopy = [];
      if (val[length - 1] === "1") {
        cityListCopy = ["1"];
      }else if (val[length - 1] === "2") {
        cityListCopy = ["2"];
      } else {
        val.forEach((v, k) => {
          if (v === "1"||v === "2") val.splice(k, 1);
        });
        cityListCopy = val;
      }
      this.couponList[index].useCityArray = cityListCopy;
      this.couponList[index].useCityId = cityListCopy.join(',');
      this.couponList.splice(0, 1, this.couponList[0]);
    },
    // 编辑用
    setCouponList(){
      this.list.forEach(item=>{
        item.guding=[item.startTime,item.endTime]
        item.timeSlot=[item.useLimitBeginTime,item.useLimitEndTime]
      })
      let copyList = JSON.parse(JSON.stringify(this.list))
      this.couponList = [...copyList]
      this.awardTypeObj = this.awardObj
    },
    // 整理优惠券修改信息
    getEditInfo(){
      let res = []
      let isSuccess = true
      for(let i=0;i<this.couponList.length;i++){
        let item = this.couponList[i]
        let newVal = item.totalRewardAmount
        let oldVal = this.list[i].totalRewardAmount
        if(!newVal){
          this.$Message.warning('优惠券中发放总额度不能为空')
          isSuccess = false
          break;
        }else if(newVal<oldVal){
          this.$Message.warning('优惠券中发放总额度不能修改为小于原值')
          isSuccess = false
          break;
        }else if(newVal>oldVal){
          res.push({
            uuid: item.uuid,
            totalRewardAmount: newVal,
            activityUuid: this.$route.query.id
          })
        }
      }
      let resData = isSuccess?res:false
      return resData
    }
  },
  watch: {
    isEdit(newVal){
      if(newVal){
        this.setCouponList()
      }
    },
    list:{
      handler(){
        this.setCouponList()
      },
      deep:true
    }
  },
};
</script>
<style lang="less" scoped src="../../activity.less"></style>
<style lang="less" scoped>
// 选择优惠券弹窗
.coupon-modal{
  /deep/ .ivu-modal{
    min-width: 1000px;
  }
}
// 阶梯奖励开始
.recom-list{
  border:1px solid #cccdd1;
  text-align: center;
  width:330px;
  li{
    .div-item{
      width:160px;
      display: inline-block;
    }
  }
  .recom-first{
    border-right: 1px solid #cccdd1;
  }
  .recom-head{
    line-height:36px;
    background: #f8f8f9;
  }
  .recom-body{
    border-top: 1px solid #cccdd1;
    position: relative;
    .div-item{
      padding-top:8px;
    }
  }
  .remove-icon{
    position: absolute;
    right:-30px;
    top:10px;
    font-size: 20px;
    color:#e61f10;
    font-weight: bold;
    cursor: pointer;
  }
}
// 阶梯奖励结束
.title{
  line-height:30px;
  font-size: 14px;
}
.choose-coupon{
  margin-bottom:20px;
}
.coupon-box {
  width: 100%;
  max-width: 1430px;
  height: 150px;
  padding: 20px 15px;
  border: 1px solid #cccdd1;
  border-radius: 3px;
  img {
    height: 100%;
    cursor: pointer;
  }
}
</style>

