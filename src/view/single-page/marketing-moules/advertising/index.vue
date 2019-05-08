<!--app广告位-->
<template>
  <div>
    <div class="search">
      <Row>
        <Form :model="searchData" inline :label-width='45'>
          <FormItem label='城市'>
            <Select v-model="searchData.cityID" clearable style="width:250px;" filterable>
              <Option value="1">全国所有城市</Option>
              <Option value="2">全部已开通城市</Option>
              <Option v-for="(item, index) in cityList" :key="index" :value="item.cityID">{{item.city}}</Option>
            </Select>
          </FormItem>
          <FormItem label='状态'>
            <Select v-model="searchData.status" clearable style="width:250px;">
              <Option value="2">在线中</Option>
              <Option value="4">已关闭</Option>
              <Option value="3">已结束</Option>
              <Option value="1">未开始</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="search" style="margin-right:15px;">搜索</Button>
            <Button @click="reset" style="margin-right:20px;">清空</Button>
            <Button style="margin-right: 100px" @click="toRouter('advertising')" v-if="tabsIndex === '1'">添加广告</Button>
            <Button style="margin-right: 100px" @click="toRouter('expressWindow')" v-else-if="tabsIndex === '2'">添加快车弹窗</Button>
            <Button style="margin-right: 100px" @click="toRouter('tailoredCarWindow')" v-else-if="tabsIndex === '3'">添加专车弹窗</Button>
            <Button style="margin-right: 100px" @click="toRouter('taxiWindow')" v-else-if="tabsIndex === '4'">添加出租车弹窗</Button>
          </FormItem>
        </Form>
      </Row>
    </div>
    <tabs @on-click='tabsChange' v-model="tabsIndex">
      <TabPane label="广告页" name="1">
        <Module 
          :pageSize='pageSize' 
          :dataList='dataList' 
          :current='current' 
          :total='total'
          :type='0'
          @changePage="changePage"
          @changePageSize="changePageSize"
          @closeAd='closeAd'
          v-show="isHasData===1"></Module>
        <div style="height:600px;" v-if="isHasData===0">
          <Spin size="large" fix></Spin>  
        </div>
        <div class="NoData" v-show="isHasData===2">暂无数据</div>
      </TabPane>
      <TabPane label="快车弹窗" name="2">
        <Module 
          :isCarousel='true' 
          :pageSize='pageSize' 
          :dataList='dataList' 
          :current='current' 
          :total='total' 
          :type='1' 
          @changePage="changePage"
          @changePageSize="changePageSize"
          @closeAd='closeAd'
          v-show="isHasData===1"></Module>
        <div style="height:600px;" v-if="isHasData===0">
          <Spin size="large" fix></Spin>  
        </div>
        <div class="NoData" v-show="isHasData===2">暂无数据</div>
      </TabPane>
      <TabPane label="专车弹窗" name="3">
        <Module 
          :isCarousel='true' 
          :pageSize='pageSize' 
          :dataList='dataList' 
          :current='current' 
          :total='total'
          :type='2' 
          @changePage="changePage"
          @changePageSize="changePageSize"
          @closeAd='closeAd'
          :isHasData='isHasData'
          v-show="isHasData===1"></Module>
        <div style="height:600px;" v-if="isHasData===0">
          <Spin size="large" fix></Spin>  
        </div>
        <div class="NoData" v-show="isHasData===2">暂无数据</div>
      </TabPane>
      <TabPane label="出租车弹窗" name="4">
        <Module 
          :isCarousel='true' 
          :pageSize='pageSize' 
          :dataList='dataList' 
          :current='current' 
          :total='total'
          :type='3' 
          @changePage="changePage"
          @changePageSize="changePageSize"
          @closeAd='closeAd'
          v-show="isHasData===1"></Module>
        <div style="height:600px;" v-if="isHasData===0">
          <Spin size="large" fix></Spin>  
        </div>
        <div class="NoData" v-show="isHasData===2">暂无数据</div>
      </TabPane>
    </tabs>
    <Modal v-model="isShowAdd" :mask-closable='false' :width="550" :title="title">
      <div class="pageTop" style="padding: 0 10px;">      
        <Row>
          <Form ref="formInline" :model="formInline" :label-width="80" :rules='formRule'>
            <FormItem label='广告名称' prop='name'>
              <Input v-model="formInline.name" style="width:300px" :maxlength="15"></Input>
            </FormItem>
            <FormItem label="起始时间" prop='time'>
              <DatePicker
                clearable="clearable"
                type='datetimerange'
                style="width:300px"
                :options="optionsTime"
                :editable='false' 
                :value='time'
                @on-change='changeTime'>
              </DatePicker>
            </FormItem>
            <FormItem label='针对城市' prop='city'>
              <Select style="width:300px" v-model="formInline.city" @on-change='chooseCity'>
                <Option :value="1">全国所有城市</Option>
                <Option :value="2">全部已开通城市</Option>
                <Option :value="3">按城市选择</Option>
              </Select>
              <FormItem prop='cityRelationList'  v-if="isOther">
                <CheckboxGroup v-model="formInline.cityRelationList" style="width:300px">
                  <Checkbox v-for="(item, index) in cityList" :key="index" :label="item.cityID">{{item.city}}</Checkbox>
                </CheckboxGroup>
              </FormItem>
            </FormItem>
            <FormItem label='优先级' prop='level'>
              <Select v-model="formInline.level" style="width:300px" clearable>
                <Option v-for="(item, index) in range" :value="item" :key="index">{{item}}</Option>
              </Select>
            </FormItem>
            <Col v-if="formInline.type === 1">
              <FormItem label='广告图' prop='advicePciture'> 
                <input type="hidden" v-model="formInline.advicePciture" />           
                <Vupload :action='upLoadUrl' :defaultList='bannerImg' @on-upsuccess="upload" v-on:before-upload='beforeUpload' v-on:on-uperror="uperror" :multiFile="false"></Vupload>
              </FormItem>
            </Col>
            <FormItem label='跳转链接' v-if="formInline.type === 1">
              <Input v-model="adLink" style="width:300px;" @on-change="changeLink"></Input>
            </FormItem>
            <FormItem 
                v-for="(item, index) in formInline.picLinkList"
                :key="index"
                :prop="'picLinkList.' + index + '.adPicture'"
                :label-width="0"
                :rules="ruleValidate" 
                v-if="formInline.type !== 1"
                class="itemArr">
                <div style="display: flex;align-items: center;padding-left: 17px;">
                    <span class="valadate-star">广告图{{index+1}}</span>
                    <Vupload
                      :multiFile="false"
                      @click.native="itemIndex = index"
                      :action='upLoadUrl' 
                      :defaultList='item.bannerImg' 
                      v-on:on-upsuccess="uploadArr" 
                      v-on:before-upload='beforeUpload' 
                      v-on:on-uperror="uperror"
                      style="margin: 0 8px;">
                    </Vupload>
                    <div style="margin: 0 7px;">
                      <span>跳转链接 ：</span>
                      <Input v-model="item.adLink" style="width:200px;"></Input>
                    </div>
                    <Button v-if="index" type="error" @click="deleteWindow(index)">删除</Button>
                </div>
            </FormItem>
            <div class="add-adv-btn-wrap">
              <Button type="dashed" @click="addWindow" class="add-adv-btn" v-if="formInline.type !== 1">新增弹窗广告图</Button>
            </div>
          </Form>
          <Form v-show="formInline.type !== 1" ref="formInline1" :model="formInline" :label-width="80" :rules='formRule1'>
            <FormItem 
              label='弹出频率'
              prop="frequency"
              style="margin-top: 20px;">
              <Select style="width:250px" v-model="formInline.frequency">
                <Option :value="1">当天首次打开应用弹</Option>
                <Option :value="2">打开应用弹</Option>
              </Select>
            </FormItem>
          </Form>
        </Row>        
      </div>
      <div class="footer" slot="footer" style="text-align:center;">
        <Button type="primary" size='large' style="width:30%;" @click="adPageSave" :loading='loading'>保存</Button>
      </div>
    </Modal>
    <Modal v-model="isShowClose" :mask-closable='false'>
      <p class="closeTxt">您确定要关闭{{activeName}}吗？</p>
      <div slot="footer" style="text-align:center;">
        <Button type="primary" size="large" style="width:30%;" @click="close">确定关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { defaultData } from './field'
import Module from './module'
import Vupload from '_a/v-upload/v-upload'
import { advertisementPageList, addAdvertisement, closeAdActivity } from '@/api/passenger'
import { getCitys } from '@/api/common'

export default {
  components:{
    Module,
    Vupload
  },
  data(){
    const validTime = (rule, value, callback) => {
      if(this.formInline.upTime) callback()
      else callback(new Error('请选择时间段'))
    }
    const validNowTime = (rule, value, callback) => {
      let now = new Date()
      let dataTime = new Date(this.formInline.upTime)
      if(dataTime < now){
        callback(new Error('选择时间不能小于当前时间'))
      } else {
        callback()
      }
    }
    const cityRelationList = (rule, value, callback) => {
      if(value.length) callback()
      callback(new Error('请勾选城市'))
    }
    const adPicture = (rule, value, callback) => {
      if(value === '') callback(new Error('请上传图片'))
      else callback()
    }
    const validfrequency = (rule, value, callback) => {
      if(value === null || typeof(value) === 'undefined') callback(new Error('请选择弹出频率'))
      else callback()
    }
    return {
      ...defaultData,
      searchData: {},
      isHasData: 0, // 0 请求中， 1 有内容 2 无数据
      cityList: [], // 城市信息
      title: '', // 新增标题栏
      activeName: String, // 关闭活动显示的名称
      tabsIndex: '1', // 当前tab的索引
      isShowAdd: false, // 是否显示新增弹窗
      isShowClose: false, // 是否显示关闭弹窗
      isOther: false, // 是否显示其他城市
      upLoadUrl: this._baseUrl + '/system/advertisement/uploadPics', // 上传图片路径
      adLink: '', // 跳转链接临时存放
      bannerImg: [], // 上传图片显示初始化
      time: '', // 时间临时存放
      itemIndex: Number, // 图片数组序号
      params: {}, // 关闭广告时的传入对象,
      loading: false, // 保存按钮的loading状态
      optionsTime: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      ruleValidate: {required: true, validator: adPicture, trigger: 'change'},
      formRule1: {
        frequency: [
          {required: true, type: 'number', validator: validfrequency, trigger: 'change'}
        ]
      },
      formRule:{
        name:[
          {required: true, message: '请填写广告名称', trigger: 'blur'}
        ],
        time:[
          { required: true, trigger: 'change', validator: validTime },
          { trigger: 'change', validator: validNowTime }
        ],
        city:[
          {required: true, type: 'number', message: '请选择城市', trigger: 'change'}
        ],
        level:[
          {required: true, type: 'number', message: '请选择优先级', trigger: 'change'}
        ],
        advicePciture:[
          {required: true, message: '请上传广告图片', trigger: 'change'}
        ],
        cityRelationList: [
          {required: true, validator: cityRelationList, trigger: 'change'}
        ]
      }
    }
  },
  created(){
    this.tabsChange(this.tabsIndex)
    getCitys({}).then(res => {
      if(res.data.success){
        this.cityList = res.data.data
      }
    })
  },
  methods:{
    search(){
      this.current = 1
      this.tabsChange(this.tabsIndex)
    },
    reset() {
      this.current = 1
      this.searchData = {}
      this.tabsChange(this.tabsIndex)
    },
    changePageSize(val){
      if(val){
        this.pageSize = val
        this.tabsChange(this.tabsIndex)
      }      
    },
    changePage(val){
      if(val){
        this.current = val;
        this.tabsChange(this.tabsIndex)
      }      
    },
    toRouter(type){
      this.formInline = {
        picLinkList: [{
          adLink: '',
          adPicture: ''
        }],
        cityRelationList: []
      }
      this.time = ''
      this.$refs['formInline'].resetFields();
      switch(type){
        case 'advertising':
          this.formInline = {
            type: 1,
            picLinkList: [
              {
                adLink: '',
                adPicture: ''
              }
            ],
            cityRelationList: []
          }
          this.adLink = ''
          this.bannerImg = []
          this.isShowAdd = true
          this.loading = false
          this.title = '新增广告页'
          break;
        case 'expressWindow':
          this.formInline.type = 2
          this.isShowAdd = true
          this.loading = false
          this.title = '新增快车弹窗'
          break;
        case 'tailoredCarWindow':
          this.formInline.type = 3
          this.isShowAdd = true
          this.loading = false
          this.title = '新增专车弹窗'
          break;
        case 'taxiWindow':
          this.formInline.type = 4
          this.isShowAdd = true
          this.loading = false
          this.title = '新增出租车弹窗'
          break;
      }
    },
    tabsChange(index){
      this.isHasData = 0
      let params = {
        currPage: this.current,
        pageSize: this.pageSize
      }
      if(this.searchData){
        Object.assign(params, this.searchData)
      }
      params.type = Number(index)
      advertisementPageList(params).then(res => {
        if(res.data.success){
          let data = res.data.data
          this.dataList = data.list
          this.pageSize = data.pageSize
          this.current = data.currPage
          this.total = data.totalCount
          this.isHasData = this.dataList.length ? 1 : 2
          this.dataList.forEach((v, k) =>{
            v.status = this.adStatusMap[v.status]
            v.cityText = ''
            switch(v.cityType){
              case 1:                    
                v.cityText = '全国所有城市'
                break;
              case 2:                    
                v.cityText = '全部已开通城市'
                break;
              case 3:
                v.citys.forEach((value, key) => {
                  v.cityText += key === (v.citys.length -1) ? value : value + ',' // 判断是否只有一个城市，如果多个城市，后面添加“，”
                })
                break;
            }
            if(v.advertisementPicLinks.length !== 0){
              v.singleImg = v.advertisementPicLinks[0].adPicture
            }
          })
        }
      })
    },
    changeTime(value){
      this.time = value
      this.formInline.upTime = value[0],
      this.formInline.downTime = value[1]
    },
    chooseCity(value){
      this.isOther = value === 3 ? true : false
    },
    beforeUpload(data){ // 图片上传前
      this.loading = true
    },
    uperror(data){ // 图片上传失败
      this.loading = false
    },
    upload(data){
      this.loading = false
      this.formInline.advicePciture = data.data.picUrl; // 广告图做必填校验
      if(this.formInline.picLinkList[0]){
        this.formInline.picLinkList[0].adPicture = data.data.picUrl 
      }else {
        this.formInline.picLinkList[0] = {adPicture: data.data.picUrl }
      }
      this.bannerImg = [{url: data.data.picUrl}]
    },
    uploadArr(data){
      this.loading = false
      this.formInline.picLinkList[this.itemIndex].bannerImg = [{url: data.data.picUrl}]
      this.formInline.picLinkList[this.itemIndex].adPicture = data.data.picUrl
    },
    changeLink(){
      if(this.formInline.picLinkList[0]){
        this.formInline.picLinkList[0].adLink = this.adLink
      } else (
        this.formInline.picLinkList[0] = {
          adLink: this.adLink
        }
      )
    },
    addWindow(){ // 新增上传图片框，限制最多三个
      if(this.formInline.picLinkList.length <= 2){
        let params = {
          adPicture: '',
          adLink: '',
          bannerImg: []
        }
        this.formInline.picLinkList.push(params)
      } else {
        this.$Message.warning('最多上传3张图片')
      }
    },
    deleteWindow(index){ // 删除上传图片框
      this.formInline.picLinkList.splice(index, 1)
    },
    adPageSave(){ // 保存广告
      this.loading = true
      console.log(this.formInline)
      if(this.formInline.type !== 1){
        this.$refs['formInline'].validate((valid) => {
          this.$refs['formInline1'].validate((valid1) => {
            if(valid && valid1){
              this.commitData()
            }else {
              this.loading = false
            }
          })
        })
      } else {
        this.$refs['formInline'].validate((valid) => {
          if(valid){
            this.commitData()
          }else {
            this.loading = false
          }
        })
      }     
    },
    commitData () {
      addAdvertisement(this.formInline).then(res => {
        this.loading = false
        if(res.data.success){
          this.$Message.success('操作成功')
          this.isShowAdd = false
          this.tabsChange(this.tabsIndex)
        } else {
          this.$Message.error(res.date.errorMsg)
        }
      }).catch(err =>{
        this.loading = false
      })
    },
    closeAd(data){ // 关闭广告
      this.activeName = data.name
      this.params.uuid = data.id
      this.isShowClose = true
    },
    close(){ // 二次确认关闭广告
      closeAdActivity(this.params).then(res => {
        if(res.data.success){
          this.isShowClose = false
          this.tabsChange(this.tabsIndex)
        }
      })
    }
  }
}
</script>
<style lang="less">
  .NoData{
    text-align: center;
    padding: 300px 0;
  }
  .itemArr{
    display: flex;
    padding: 14px 0 0 0;
    border-top: 1px dashed #eee;
    .ivu-form-item-content{
      line-height: 14px;
    }
  }
  .valadate-star{
    margin-right: 3px;
  }
  .valadate-star:before{
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014
  }
  .add-adv-btn-wrap{
    padding-top: 10px;
    border-top: 1px dashed #eee;
    text-align: center;
  }
  .add-adv-btn{
    width: 280px;
    height: 32px;
    color: #a7a5a5;
    line-height: 32px;
    border-radius: 4px;
    text-align: center;
    border: 1px dashed #dcdee2;
    transition: border 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out, -webkit-box-shadow 0.2s ease-in-out
  }
  .add-adv-btn:hover{
    color: #57a3f3;
    border-color: #57a3f3;
    cursor: pointer;
  }
</style>
