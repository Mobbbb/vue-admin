<template>
  <div class="layout layout-container platform-container">
    <Layout>
      <Sider :style="{maxWidth: '100%', width: '100%'}">
        <Menu mode="vertical" active-name="0" @on-select="init">
          <MenuItem name="0">
            <span>平台基本信息</span>
          </MenuItem>
          <!--<MenuItem name="1">
            <span>运营规模信息</span>
          </MenuItem>-->
          <MenuItem name="2">
            <span>支付信息</span>
          </MenuItem>
          <MenuItem name="3">
            <span>服务机构信息</span>
          </MenuItem>
          <MenuItem name="4">
            <span>经营许可信息</span>
          </MenuItem>
        </Menu>
      </Sider>

      <Layout class="record-content">
        <Content>
            <div v-if="activeIndex=='0'">
              <BasicInfo :basicInfo="basicInfo" :cityList="cityList" :upBaseUrl="upBaseUrl" :headerSet="headerSet" @on-editBasic="editBasic"></BasicInfo>
            </div>
            <div v-if="activeIndex=='1'">
              <ScaleInfo :scaleInfo="scaleInfo"></ScaleInfo>
            </div>
            <div v-if="activeIndex=='2'">
              <PayInfo :payInfo="payInfo" @on-editPay="editPay"></PayInfo>
            </div>
            <div v-if="activeIndex=='3'">
              <ServiceInfo :serviceInfo="serviceInfo" :cityList="cityList" @on-editService="editService"></ServiceInfo>
            </div>
            <div v-if="activeIndex=='4'">
              <LicenseInfo :licenseInfo="licenseInfo" :cityList="cityList" @on-editLicense="editLicense"></LicenseInfo>
            </div>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import BasicInfo from "./components/basicInfo.vue";
import ScaleInfo from "./components/scaleInfo.vue";
import LicenseInfo from "./components/licenseInfo.vue";
import PayInfo from "./components/payInfo.vue";
import ServiceInfo from "./components/service.vue";
import {getScaleInfo,getBasicInfo,getCityList,getLicenseInfo,getServiceInfo,getPayInfo} from "@/api/configData.js";
import {getToken } from '@/libs/util'

export default {
  components: { BasicInfo,ScaleInfo,ServiceInfo,PayInfo,LicenseInfo},
  computed:{
    upBaseUrl(){
      return  this.baseUrl2 + '/common/uploadPics'
    }
  },
  data() {
    return {
      activeIndex: "0",
      cityList:[],
      scaleInfo:{},
      basicInfo:{},
      serviceInfo:{},
      licenseInfo:{},
      payInfo:{},
      baseUrl2:this._baseUrl,
      headerSet:{
        Authorization: getToken()
      },
    };
  },
  mounted() {
    //  城市列表查询
    getCityList().then(res => {
      if (res.data.success){
       this.cityList=res.data.data;
      }
    }).catch(err => {

    });
    this.getBasic();
    //this.getScale();
    this.getService();
    this.getLicense();
    this.getPay();
  },
  methods: {
    init(name) {
      this.activeIndex = name;
    },
    //    平台基本信息查询
    getBasic() {
      getBasicInfo().then(res => {
        if (res.data.success){
          // if(res.data.data[0].legalJpgPhoto==null){
          //   res.data.data[0].legalJpgPhoto=''
          // }
          res.data.data.regCapital=Number(res.data.data.regCapital);
          this.basicInfo=res.data.data;
        }
      }).catch(err => {

      })
    },
    //    运营规模信息查询
    getScale() {
      getScaleInfo().then(res => {
        if (res.data.success){
          this.scaleInfo=res.data.data.list;
        }
      }).catch(err => {

      })
    },
//    服务机构查询
    getService() {
      getServiceInfo().then(res => {
        if (res.data.success){
          if(res.data.data.createDate==null || res.data.data.createDate==''){
            res.data.data.createDate=''
          }else {
            res.data.data.createDate=res.data.data.createDate.split(' ')[0]
          }
          res.data.data.Date=res.data.data.createDate;
          this.serviceInfo=res.data.data;
        }
      }).catch(err => {

      })
    },
//    经营许可查询
    getLicense() {
      getLicenseInfo().then(res => {
        if (res.data.success){
        if(res.data.data.stopDate==null || res.data.data.stopDate==''){
          res.data.data.stopDate=''
        }else {
          res.data.data.stopDate=res.data.data.stopDate.split(' ')[0]
        }
        if(res.data.data.certifyDate==null || res.data.data.certifyDate==''){
          res.data.data.certifyDate=''
        }else {
          res.data.data.certifyDate=res.data.data.certifyDate.split(' ')[0]
        }
        if(res.data.data.startDate==null || res.data.data.startDate==''){
          res.data.data.startDate=''
        }else {
          res.data.data.startDate=res.data.data.startDate.split(' ')[0]
        }
          res.data.data.start=res.data.data.startDate;
          res.data.data.certify=res.data.data.certifyDate;
          res.data.data.stop=res.data.data.stopDate;
          this.licenseInfo = res.data.data;
        }
      }).catch(err => {

      })
    },
    // 支付信息查询
    getPay() {
      getPayInfo().then(res => {
        if (res.data.success){
          res.data.data.state=res.data.data.state.toString();
          res.data.data.settlementType=res.data.data.settlementType.toString();
          this.payInfo=res.data.data;
          if(res.data.data.accountBeginDate==null||res.data.data.accountBeginDate==undefined){
            res.data.data.accountBeginDate='';
          }
          if(res.data.data.accountEndDate==null||res.data.data.accountEndDate==undefined){
            res.data.data.accountEndDate='';
          }
        }
      }).catch(err => {

      })
    },
//    编辑支付信息
    editPay(data) {
      if(data=='success'){
        this.getPay();
      }
    },
    //    编辑服务机构信息
    editService(data) {
      if(data=='success'){
        this.getService();
      }
    },
//    编辑经营许可信息
    editLicense(data) {
      if(data=='success'){
        this.getLicense();
      }
    },
    //    编辑平台基本信息
    editBasic(data) {
      if(data=='success'){
        this.getBasic();
      }
    },

  }
};
</script>

<style lang="less">
.layout-container {
  margin: 15px 0 0 0;
  border: 1px solid #d7dde4;
  // background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.platform-container {
  height: 150%;
  padding-bottom: 20px;
  overflow-y: hidden;
  .ivu-input-number-handler-wrap{
    display: none;
  }
  .ivu-input-number{
    width: 100%;
  }
  .ivu-layout {
    background: #ffffff;
  }
  .ivu-form-item-label{
    text-align: left;
  }
  .button{
    float: right;
  }
  .record-content {
    margin-left: 50px;
    background: #ffffff;
  }
  .ivu-menu {
    padding-bottom: 1000px;
  }
  .ivu-form-item-content{
    line-height: 24px;
    padding-top: 4px;
  }

}
</style>
