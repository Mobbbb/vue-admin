<!-- 出租车弹窗 -->
<template>
  <div>
    <div class="pageTop">      
      <Row>
        <Form ref="formInline" :model="formInline" :label-width="80">
          <FormItem label='状态'>
            {{formInline.statusTxt}}
          </FormItem>
          <FormItem label='广告名称'>
            {{formInline.name}}
          </FormItem>
          <FormItem label="起始时间">
            {{startEndTime}}
          </FormItem>
          <FormItem label='针对城市'>
            <p v-show="!isOther">{{formInline.cityName}}</p>
            <ul v-show="isOther" style="display:flex">
              <li v-for="(item, index) in formInline.citys" :key="index" style="margin-right:15px">{{item}}</li>
            </ul>
          </FormItem>
          <FormItem label='优先级'>
            {{formInline.level}}
          </FormItem>
          <div v-for="(item, index) in formInline.advertisementPicLinks" :key="index" class="imgWarp">
            <FormItem label='广告图'>
              <div class="imgBox">
                <img :src="item.adPicture" alt="">
              </div>            
            </FormItem>
            <FormItem label='跳转链接'>
              {{item.adLink}}
            </FormItem>
          </div>
        </Form>
      </Row>
      <div class="bottomInfo">
        <p>创建者：{{formInline.creator}}</p>
        <p>创建时间：{{formInline.createTime}}</p>
        <p v-show="isClose">关闭者：{{formInline.updater}}</p>
        <p v-show="isClose">关闭时间：{{formInline.updateTime}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { getAdByAdId } from '@/api/passenger'
import { getCitys } from '@/api/common'
import { defaultData } from './field'
import { adStatusMap } from '@/config/passengerTable'
export default {
  data(){
    return {
      ...defaultData,
      cityRelationList: [],
      isOther: false, // 是否显示其他城市
      isClose: false, // 是否是已关闭广告
      startEndTime: '', // 时间临时存放
      adLink: '', // 跳转连接临时存放
      imgSrc: '', // 图片临时存放
      params: {
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
      getAdByAdId(params).then(res => {
        if(res.data.success){
          let data = res.data.data
          data.statusTxt = adStatusMap[data.status]
          data.cityName = this.cityName[data.cityType]
          this.startEndTime = data.upTime + '-' + data.downTime
          this.isOther = data.cityType === 3 ? true : false
          this.isClose = data.status === 4 ? true : false
          this.formInline = data
        }        
      })
    }
  }
}
</script>
<style lang="less">
.imgBox{
  width: 300px;
  height: 200px;
  img{
    width: 100%;
    height: 100%;
  }
}
.bottomInfo{
  width: 350px;
  padding: 20px;
  border:1px dashed #F0F0F0;
  p{
    padding: 10px;
  }
}
</style>