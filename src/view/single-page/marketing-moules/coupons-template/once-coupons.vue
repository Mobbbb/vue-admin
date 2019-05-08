<template>
  <div>
    <div class="top">
      <Form :model='formInline' :label-width='60'>
        <FormItem label='发放人群'>
          <TreeInput
            allTitle='全部乘客'
            title="cityPassenger"
            IndexId='cityUuid'
            inputWidth='550px'
            :TreeData='selectArea'
            :selectAll='true'
            :parentData.sync="formInline.cityUuids"></TreeInput>
        </FormItem>
        <FormItem>
          <Checkbox v-model="isOther" @on-change='changeCheckbox' :disabled='formInline.cityUuids.length!==0'>特定乘客</Checkbox>
          <p v-show="isShowNum">特定乘客模板已上传，<span @click="downLoadExcel" style="color:#2D8cF0;cursor:pointer">点击此处下载</span></p>
        </FormItem>
      </Form>
      <CouponModal style="width:1100px;" v-on:modelVal='showMsg' :parentData='parentData' :isOnce='true' :citys='citys'></CouponModal>
    </div>    
    <div class="footer">
      <Button type="primary" size='large' long @click="save">保存</Button>
    </div>
    <ImportFile
      ref="upLoadChild"
      v-show="false"
      :toDownTemplateUrl='toDownTemplateUrl'
      :importFileUrl='importFileUrl'
      @on-success='upLoad'
      @on-change='changeModal'>
    </ImportFile>
  </div>
</template>
<script>
import CouponModal from '_a/couponModal/couponModal'
import TreeInput from '_a/treeInput/treeInput'
import ImportFile from '_a/import-file/index'
import { getCitys } from '@/api/common'
import { grantCoupon, oneOffCoupon } from '@/api/passenger'
export default {
  components:{
    CouponModal,
    TreeInput,
    ImportFile
  },
  data(){
    return {
      formInline:{
        cityUuids: []
      },
      citys: [], // 获取已开通城市
      isOther: false,
      isShowModal: false, // 是否显示导入框
      isShowNum: false, // 是否显示人数
      btnText: '选择文件导入',
      selectArea: [],
      countNum: 100,
      parentData: [],
      toDownTemplateUrl: '/download/特定乘客模板.xlsx', // 下载模板url
      importFileUrl: '/admin/coupon/upload' // 导入乘客rul
    }
  },
  created(){
    getCitys({}).then(res =>{
      if(res.data.success){
        let data = res.data.data
        this.citys = data
        this.selectArea = data
        this.selectArea.forEach((v, k) =>{
          v.cityPassenger = v.city + '全部乘客'
        })
      }
    })
  },
  watch:{
    formInline: {
      handler(val){
        if(val.cityUuids.length !== 0){
          this.isOther = false
        }
      },
      deep:true
    }
  },
  methods:{
    changeCheckbox(flag){
      if(flag){
        this.$refs.upLoadChild.importFile()
      } else {
        this.isShowNum = false
      }
    },
    downLoad(){ // 下载Excel
      window.open(this.downLoadUrl)
    },
    showMsg(data){ // 优惠券内容改变事件
      this.parentData = data
      let couponArr = []
      data.forEach((v, k) => {
        if(v.usePeriod === 1){
          couponArr.push({
            couponName: v.couponName,
            templateUuid: v.uuid,
            totalNumber: v.couponNum,
            expiryDay: v.effectiveDay,
            cityUuid: v.couponCityList,
            templateUuid: v.templateUuid,
            timeType: v.usePeriod
          })
        } else {
          couponArr.push({
            couponName: v.couponName,
            templateUuid: v.uuid,
            totalNumber: v.couponNum,
            expiryDay: v.effectiveDay,
            cityUuid: v.couponCityList,
            templateUuid: v.templateUuid,
            periodBegin: v.periodBegin,
            periodEnd: v.periodEnd,
            timeType: v.usePeriod
          })
        }
        
      })
      
      this.formInline.list = couponArr
    },
    changeModal(flag){ // modal状态改变触发事件
      if(!flag){
        this.isOther = this.isShowNum
      }
    },
    upLoad(data){
      this.formInline.fileUrl = data.data.fileUrl
      this.isShowNum = true
    },
    save(){
      let isFullCoupon = true
      let passengersArr = this.formInline.cityUuids
      if(passengersArr.length!==0){
        passengersArr.forEach((v, k) => {
          if(v==='_000'){
            this.formInline.cityUuids = ['ALL']
          }
        })
      }
      if(this.isOther !== true) delete this.formInline['fileUrl']
      if(!this.formInline.fileUrl && this.formInline.cityUuids.length===0){
        this.$Message.warning('发放人群未选择')
      } else if(this.formInline.list.length === 0){
        this.$Message.warning('请添加优惠券')        
      } else {
        this.formInline.list.forEach(item => {
          for(let val in item){
            isFullCoupon = (item[val] || item[val]===0) ? isFullCoupon : false
          }
        })
        if(isFullCoupon){
          oneOffCoupon(this.formInline).then(res => {
            this.$Message.success("一次性发券成功")
            this.$router.push({name:'once-couponsRecord'})
          })
        } else {
          this.$Message.warning('请将优惠券信息填写完整')
        }
      }
    },
    downLoadExcel(){ // 下载文档链接
      window.open(this.formInline.fileUrl)
    }
  }
}
</script>
<style lang="less" scoped>
.top{
  min-height: 600px;
}
.footer{
  width: 30%;
  margin: 50px auto;
}
</style>
