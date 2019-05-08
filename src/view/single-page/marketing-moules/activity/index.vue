<!--主页-->
<template>
  <div class="active">
    <div class="searchList">
      <Form class="formQueryStyle" inline :model="searchData" :label-width="80">
        <FormItem label="城市" :label-width='40'>
          <Select v-model="searchData.city" style="width:250px" clearable filterable>
            <Option value="1">全国所有城市</Option>
            <Option value="2">全部已开通城市</Option>
            <Option v-for="(item, index) in citys" :key="index" :value="item.cityID">{{item.city}}</Option>
          </Select>
        </FormItem>
        <!--<FormItem label="奖励类型" v-show="tabsIndex==='1'">
          <Select v-model="searchData.activityType" style="width:250px" clearable>
            <Option value="2">乘客奖励</Option>
            <Option value="3">司机奖励</Option>
          </Select>
        </FormItem>-->
        <FormItem label="活动状态">
          <Select v-model="searchData.activityStatus" style="width:250px" clearable>
            <Option value="1">未开始</Option>
            <Option value="2">在线中</Option>
            <Option value="3">已结束</Option>
            <Option value="4">已关闭</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="search" style="margin-right:20px;">查询</Button>
          <Button @click="reset">清空</Button>
        </FormItem>
        <div>
          <Button 
            style="margin-right: 100px" 
            @click="addActivity('register')" 
            v-show="tabsIndex==='0'"
            v-hasAuth="'activity-addRegister'">添加注册活动
          </Button>
          <Button 
            style="margin-right: 20px" 
            @click="addActivity('passenger')" 
            v-show="tabsIndex==='1'"
            v-hasAuth="'activity-addPassenger'">添加乘客奖励
          </Button>
          <!--<Button style="margin-right: 100px" @click="addActivity('driver')" v-show="tabsIndex==='1'">添加司机奖励</Button>-->
          <Button 
            style="margin-right: 100px" 
            @click="addActivity('rule')" 
            v-show="tabsIndex==='2'"
            v-hasAuth="'activity-addRule'">添加充值规则
          </Button>
          <router-link :to="{name: 'activity-registration-record'}" v-show="tabsIndex==='0'">
            <Button style="float:right" type="primary" v-hasAuth="'activity-registerDetail'">注册记录</Button>
          </router-link>
          <router-link :to="{name: 'activity-invite-record'}" v-show="tabsIndex==='1'">
            <Button style="float:right" type="primary" v-hasAuth="'activity-awardDetail'">邀请记录</Button>
          </router-link>
          <router-link :to="{name: 'activity-recharge-record'}" v-show="tabsIndex==='2'">
            <Button style="float:right" type="primary" v-hasAuth="'activity-recordDetail'">充值记录</Button>
          </router-link>
        </div>
      </Form>
    </div>
    <Tabs style="height:100%" @on-click='getTabs'>
      <TabPane label="注册活动" name='0'></TabPane>
      <TabPane label="推荐乘客" name='1'></TabPane>
      <TabPane label="充值活动" name='2'></TabPane>
    </Tabs>
    <ActiveLists :tabsIndex="tabsIndex" :isLoading='isLoading' :activityData='activityData' v-on:closeSuccess='getTabs(tabsIndex)' style="min-height:550px;"></ActiveLists>
    <div class="footerPage">
      <Page show-sizer
        show-elevator
        show-total
        :page-size-opts='pageSizeOpts'
        :page-size='pageSize'
        :total='total'
        :current='current'
        @on-change="changePage"
        @on-page-size-change="changePageSize"></Page>
    </div>
    <Modal v-model="isShowAdd" width='1250' :mask-closable='false'>
      <p slot="header" style="text-align:center">{{title}}</p>
      <Form ref="formInline" :model="formInline" :label-width="100" :rules='formRule'>
        <FormItem label='名称' prop='activityName'>
          <Input v-model="formInline.activityName" style="width:300px" :maxlength='15'></Input>
        </FormItem>
        <FormItem label="有效时间" prop='time'>
          <DatePicker clearable="clearable" type='datetimerange' :options="optionsTime" :editable='false' style="width:300px" :value='time' @on-change='changeTime'></DatePicker>
        </FormItem>
        <FormItem label='使用城市' prop='cityList'>
          <Select style="width:300px" v-model="formInline.cityList" multiple filterable clearable @on-change='changeCity'>
            <Option value="1">全国所有城市</Option>
            <Option value="2">全部已开通城市</Option>
            <Option v-for="(item, index) in citys" :key="index" :value="item.cityID">{{item.city}}</Option>
          </Select>
        </FormItem>
        <FormItem label='优先级' prop='level'>
          <Select v-model="formInline.level" style="width:300px" clearable>
            <Option  v-for="(item, index) in range" :value="item" :key="index">{{item}}</Option>
          </Select>
        </FormItem>
        <FormItem label='banner图' v-show="formInline.activityType!==4">
          <Vupload :multiFile="false" :action='upLoadUrl' :defaultList='bannerImg' @on-upsuccess='getImg'></Vupload>
        </FormItem>
        <FormItem label='banner图' prop='banner' v-if="formInline.activityType===4">
          <Vupload :multiFile="false" :action='upLoadUrl' :defaultList='bannerImg' @on-upsuccess='getImg'></Vupload>
        </FormItem>
        <div v-if="formInline.activityType!==4" v-for="(item, index) in formInline.rewardDto" :key="index">
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
              <CouponModal v-on:modelVal='showMsg' :citys='citys' :parentData='parentData' v-if="item.rewardType===1"></CouponModal>
              <CouponModal v-on:modelVal='showFirstMsg' :citys='citys' :parentData='firstParentData' v-if="item.rewardType===2"></CouponModal>
            </div>
          </div>
        </div>
        <table cellspacing="0" class="Table" v-if="formInline.activityType===4">
          <thead>
            <td width='150'>充值金额</td>
            <td width='150'>奖励类型</td>
            <td width='250'>金额</td>
          </thead>
          <tbody>
            <tr v-for="(item, index) in formInline.rewardDto" :key="index">
              <td>{{item.rechargeMoney}}</td>
              <td>
                赠送币
                <!-- <RadioGroup v-model="item.rewardKind" @on-change='changeType(index, item.rewardKind)'>
                  <Radio :label="1">赠送币</Radio>
                  <Radio :label="2">优惠券</Radio>
                </RadioGroup> -->
              </td>
              <td>
                <InputNumber  v-model="item.rewardMoney" :min='0' :max="9999" style="width:200px;" v-if="item.rewardKind===1"></InputNumber >
                <div v-else>
                  <Button type="primary" v-show="!item.isShowBtn" @click="addCoupon(index, item.rechargeMoney)">添加优惠券</Button>
                  <span v-show="item.isShowBtn" @click="editCoupon(index, item.rechargeMoney)" class="tableTxt">{{item.couponText}}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" long @click="save">保存</Button>
      </div>
      <Modal v-model="isShowModal" :width='1150' :mask-closable='false'>
        <p slot="header">充值{{modalTitle}}元--优惠券配置</p>
        <CouponModal v-on:modelVal='showMsg' :parentData='parentCoupon' :citys='citys'></CouponModal>
        <div slot="footer">
          <Button type="primary" size="large" long @click="saveCoupon(tableIndex)">确定</Button>
        </div>
      </Modal>
    </Modal>
  </div>
</template>
<script>
import ActiveLists from './activeList'
import Vupload from '_a/v-upload/v-upload'
import { defaultData } from './fields'
import { activityTypeList, activityInsertType, rechargeList, passengersRewardAdd, driverRewardAdd, rechargeAdd } from '@/api/passenger'
import { getCitys } from '@/api/common'
import { activeStatusMap } from '@/config/passengerTable'
import CouponModal from '_a/couponModal/couponModal'
import { getRechargeLevelList } from '@/api/finance'

export default {
  components:{
    ActiveLists,
    CouponModal,
    Vupload
  },
  data(){
    const validTime = (rule, value, callback) => {
      if(this.formInline.beginDate) callback()
      else callback(new Error('请选择时间段'))
    }
    const validNowTime = (rule, value, callback) => {
      let now = new Date()
      let dataTime = new Date(this.formInline.beginDate)
      if(dataTime<now){
        callback(new Error('选择时间不能小于当前时间'))
      }else {
        callback()
      }
    }
    return {
      ...defaultData,
      searchData : {},
      formInline:{
        activityDto:{}
      },
      isLoading: true,
      citys: [], // 存放城市信息
      time: '', // 在线时间临时存放
      range: [...Array(11).keys()], // 0-24使用时段
      activityData: [],
      tabsIndex: '0',
      upLoadUrl: this._baseUrl + '/common/uploadPics',
      couponInfo: [], // 临时存储优惠券信息
      tableIndex: Number, // 表格index值
      modalTitle: String, // 表格充值类型
      isShowModal: false, //是否显示配置优惠券内容
      title: '新增注册活动',
      isShowAdd: false, // 是否显示新增页面
      bannerImg: [], // banner图
      parentCoupon: [], // 修改优惠券的公共数组
      parentData: [], // 优惠券组件父级数据
      firstParentData: [], // 首单优惠券组件父级数据
      optionsTime: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      rechargeCoupon:[], // 充值表格内优惠券数组
      rechargeMoney: '', // 充值金额
      formRule:{
        activityName:[{required: true, message: '请填写活动名称', trigger: 'blur'}],
        time:[
          { required: true, trigger: 'change', validator: validTime },
          { trigger: 'change', validator: validNowTime },
          ],
        cityList:[{required: true, type: 'array', message: '请选择城市', trigger: 'change'}],
        level:[{required: true, type: 'number', message: '请选择优先级', trigger: 'change'}],
        banner:[{required: true, message: '请上传banner图', trigger: 'change'}]
      }
    }
  },
  created(){
    this.getTabs(this.tabsIndex)
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
  methods: {
    search() {
      this.current = 1
      this.getTabsData(this.tabsIndex)
    },
    reset() {
      this.current = 1
      this.searchData = {}
      this.getTabsData(this.tabsIndex)
    },
    changePageSize(val){
      if(val){
        this.pageSize = val
        this.getTabsData(this.tabsIndex)
      }      
    },
    changePage(val){
      if(val){
        this.current = val;
        this.getTabsData(this.tabsIndex)
      }      
    },
    getTabs(index){
      this.tabsIndex = index
      this.current = 1
      this.searchData = {}
      this.getTabsData(index)
    },
    getTabsData(index) { // 获取列表信息
      this.tableData = []
      let params = {
        currPage: this.current,
        pageSize: this.pageSize,
      }
      this.isLoading = true
      let commonRequest
      if(this.searchData){ Object.assign(params, this.searchData) }
      switch(index){
        case '0': // 注册活动
          params.activityType = 1
          commonRequest = activityTypeList
          break;
        case '1': // 乘客奖励
          commonRequest = activityTypeList
          break;
        case '2': // 充值活动
          params.activityType = 4
          commonRequest = rechargeList
          break;
      }
      commonRequest(params).then(res => {
        this.isLoading = false
        let data = res.data.data
        this.current = data.currPage
        this.pageSize = data.pageSize
        this.total = data.totalCount
        this.activityData = data.list
        this.activityData.forEach((v, k) => {
          v.Status = activeStatusMap[v.activityStatus]
          if(v.rewardKindType){ // 包含1位赠送币，包含2为优惠券
            v.actType = v.rewardKindType.search('1') !== -1 ? v.rewardKindType.search('2') !== -1 ? '赠送币 + 优惠券' : '赠送币' : '优惠券'
          }
        })
      })
    },
    addActivity(type){ // 添加活动
      this.time = ''
      this.isShowAdd = true
      this.parentData = []
      this.$refs['formInline'].resetFields()
      switch(type){
        case 'register':
          this.title = '新增注册活动'
          this.bannerImg = []
          this.formInline = {
            activityType: 1,
            rewardDto:[
              {rewardType:1,rewardKind:1, rewardMoney:null, enable: 2},
              {rewardType:1,rewardKind:2, enable: 2}
            ],
            couponDto: []
          }
          break;
        case 'passenger':
          this.title = '新增乘客奖励'
          this.firstParentData = []
          this.bannerImg = []
          this.formInline = {
            activityType: 2,
            rewardDto: [
              {rewardType:1,rewardKind:1, rewardMoney:null, enable: 2},
              {rewardType:1,rewardKind:2, enable: 2},
              {rewardType:2,rewardKind:1, rewardMoney:null, enable: 2},
              {rewardType:2,rewardKind:2, enable: 2}
            ],
            couponDto: [],
            firstCoupon: []
          }
          break;
        case 'driver':
          this.title = '新增司机奖励'
          this.formInline = {
            activityType: 3,
            rewardDto:[
              {rewardType:1,rewardKind:1, rewardMoney:null, enable: 2},
              {rewardType:2,rewardKind:1, rewardMoney:null, enable: 2}
            ]
          }
          break;
        case 'rule':
          let params = {
              currPage: 1,
              pageSize: 100,
              status: 1
          }
          this.formInline = {
            banner: "",
            activityType: 4,
            rewardDto: []
          }
          this.title = '新增充值活动'
          this.bannerImg = []
          getRechargeLevelList(params).then(res => {
              this.tableData = res.data.data.list
              res.data.data.list.forEach(item => {
                this.formInline.rewardDto.push({
                  rechargeMoney: item.money, 
                  rewardKind: 1, 
                  rewardType: 3, 
                  rewardMoney: null, 
                  enable: 1
                })
              })
          })
          break;
      }
    },
    changeTime(time){
      this.time = time
      this.formInline.beginDate = time[0]
      this.formInline.endDate = time[1]
    },
    changeCity(val){ // 优惠券内城市切换时触发，如果为全国所有城市、全部已开通城市、城市为单选， 其余为复选
      let length = val.length
      if(val[length-1]==='1'){
        this.formInline.cityList = ['1']
      } else if (val[length-1]==='2'){
        this.formInline.cityList = ['2']
      } else {
        val.forEach((v, k) => {
          if(v==='1' || v==='2') val.splice(k, 1)
        })
        this.formInline.cityList = val
      }
    },
    showMsg(data){
      this.parentData = data
      let newCoupon = []
      data.forEach(item => {
        let obj = {}
        obj.rewardType = 1
        obj.couponName = item.couponName
        obj.templateUuid = item.templateUuid
        obj.periodBegin = item.periodBegin
        obj.periodEnd = item.periodEnd
        obj.effectiveDay = item.effectiveDay
        obj.couponNum = item.couponNum
        obj.couponType = item.couponType
        obj.couponCityList = item.couponCityList
        newCoupon.push(obj)
      })
      this.formInline.couponDto = newCoupon
    },
    showFirstMsg(data){
      this.firstParentData = data
      let newCoupon = []
      data.forEach(item => {
        let obj = {}
        obj.rewardType = 2
        obj.couponName = item.couponName
        obj.templateUuid = item.templateUuid
        obj.periodBegin = item.periodBegin
        obj.periodEnd = item.periodEnd
        obj.effectiveDay = item.effectiveDay
        obj.couponNum = item.couponNum
        obj.couponType = item.couponType
        obj.couponCityList = item.couponCityList
        newCoupon.push(obj)
      })
      this.formInline.firstCoupon = newCoupon
    },
    couponData(data){ // 对优惠券组件返回的信息进行处理
      let couponArr = []
      data.forEach((v, k) => {
        if(v.uuid) v.couponUuid = v.uuid
        if(this.rechargeMoney) v.rechargeMoney = this.rechargeMoney
      })
      return data
    },
    changeType(index, rewardKind){ // 当选择优惠券时，清空输入框的金额
      if(rewardKind === 2) {
        this.formInline.rewardDto[index].rewardMoney = null
      }
    },
    getImg(res){ // 获取图片链接
      if(res.success){
        let imgUrl = res.data.picUrl
        this.bannerImg = [{url: imgUrl}]
        this.formInline.banner = imgUrl
      }
    },
    addCoupon(index, rechargeMoney){ // table添加优惠券，index为item的序号，rechargeMoney为充值金额多少
      this.tableIndex = index
      this.rechargeMoney = rechargeMoney
      this.modalTitle = rechargeMoney
      this.parentCoupon = []
      this.isShowModal = true
    },
    editCoupon(index, rechargeMoney){ // 修改、查看优惠券信息
      this.parentCoupon = []
      this.modalTitle = rechargeMoney
      this.rechargeMoney = rechargeMoney
      this.rechargeCoupon.forEach(item => {
        if(item.rechargeMoney === this.rechargeMoney){
          this.parentCoupon.push(item)
        }
      })
      this.isShowModal = true
    },
    saveCoupon(index){ // 充值活动中表格保存优惠券信息
      let coupon = []
      let rewardSum = 0 // 总金额
      let discountNum = 0 // 折扣券
      let deductionNum = 0 // 抵扣券
      this.formInline.couponDto.forEach((v, k) => { // couponType: 1:折扣券 2: 抵扣券
        if(v.rechargeMoney === this.rechargeMoney) coupon.push(v)
        if(v.couponType===1){
          discountNum = discountNum + v.couponNumber
          rewardSum = rewardSum + (v.couponNumber * v.highestMoney)
        } else if(v.couponType===2){
          deductionNum = deductionNum + v.couponNumber
          rewardSum = rewardSum + (v.couponNumber * v.couponMoney)
        }
      })
      this.formInline.rewardDto[index].couponText = '共'+ rewardSum +'元（共'+ (discountNum+deductionNum) +'张券，含'+ discountNum +'张折扣券、'+ deductionNum +'张抵扣券）'
      this.isShowModal = false
      this.formInline.rewardDto[index].isShowBtn = coupon.length === 0 ? false : true
      this.rechargeCoupon.push(...this.formInline.couponDto)
    },
    save(){ // 保存活动信息接口
      let isFullCoupon = true // 判断优惠券是否填写完整
      let commonRequest
      let params = {
        activityDto:{
          name: this.formInline.activityName,
          activityType: this.formInline.activityType,
          beginDate: this.formInline.beginDate,
          endDate: this.formInline.endDate,
          cityList: this.formInline.cityList,
          level: this.formInline.level,
          rechargeBanner: this.formInline.banner ? this.formInline.banner : ''
        },
        couponDto:this.formInline.couponDto ? [...this.formInline.couponDto] : [],
        rewardDto: [...this.formInline.rewardDto]
      }
      if(this.formInline.firstCoupon && this.formInline.firstCoupon.length !== 0){ // 首单优惠券数组如果存在，合并优惠券数组
        this.formInline.firstCoupon.forEach(item => {
          params.couponDto.push(item)
        })
      }
      params.couponDto.forEach(value => { // 对优惠券内城市列表进行封装
        value.couponCityList.forEach((item, index) => {
          if(typeof value.couponCityList[index] === 'string'){
            value.couponCityList[index] = {cityId: item}
          }
        })
      })
      this.$refs['formInline'].validate((valid) => {
        if(valid){
          params.couponDto.forEach(item => { // 判断所有优惠券信息是否完整
            for(let val in item){
              isFullCoupon = (item[val] || item[val]===0) ? isFullCoupon : false
            }
          })
          if(isFullCoupon){ // 判断优惠券信息是否完整
            let isEnable = true // 判断是否勾选内容已填
            let isReward = false
            switch(params.activityDto.activityType){
              case 1:                
                params.rewardDto.forEach(item => {
                  isReward = item.enable === 1 ? true : isReward
                  if(item.rewardKind === 1) {
                    if(item.enable===1) isEnable = item.rewardMoney ? isEnable : false
                  } else if(item.rewardKind === 2) {
                    if(item.enable===1) isEnable = params.couponDto.length === 0 ? false :true
                  }  
                })
                if(isReward){
                  if(isEnable){
                    activityInsertType(params).then(res => {
                      if(res.data.success){
                        this.isShowAdd = false
                        this.getTabs(this.tabsIndex)
                        this.$Message.success('操作成功')
                      }
                    })
                  } else {
                    this.$Message.error("请将勾选的参数填写完整")
                  }
                } else {
                  this.$Message.error("请至少启用一个奖励")
                }
                break
              case 2:
                params.rewardDto.forEach(item => {
                  isReward = item.enable === 1 ? true : isReward
                  if(item.rewardKind === 1) {
                    if(item.enable===1){
                      isEnable = item.rewardMoney ? isEnable : false
                    }
                  } else if(item.rewardKind === 2) {
                    if(item.enable===1){
                      if(params.couponDto.length === 0){
                        isEnable = false
                      } else {
                        if(item.rewardType === 1){
                          isEnable = this.formInline.couponDto.length === 0 ? false : isEnable
                        } else if(item.rewardType === 2){
                          isEnable = this.formInline.firstCoupon.length === 0 ? false : isEnable
                        }
                      }
                    }
                  }
                })
                if(isReward){
                  if(isEnable){
                    passengersRewardAdd(params).then(res => {
                      if(res.data.success){
                        this.isShowAdd = false
                        this.getTabs(this.tabsIndex)
                        this.$Message.success('操作成功')
                      }
                    })
                  } else {
                    this.$Message.error("请将勾选的参数填写完整")
                  }
                } else {
                  this.$Message.error("请至少启用一个奖励")
                }                
                break
              case 4:
                // this.formInline.couponDto = this.rechargeCoupon
                rechargeAdd(params).then(res => {
                  if(res.data.success){
                    this.isShowAdd = false
                    this.getTabs(this.tabsIndex)
                    this.$Message.success('操作成功')
                  }
                })
                break
            }
          } else {
            this.$Message.warning("请将优惠券信息填写完整")
          }
        }else {
          this.$Message.error('请重新确认内容!');
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.titleTxt{
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
}
.awardBox{
  display: flex;
  .awardRight{
    padding-top: 10px;
  }
}
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
</style>
