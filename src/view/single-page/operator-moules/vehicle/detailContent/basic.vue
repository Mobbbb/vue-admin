<template>
  <div>
    <Card>
      <Row>
        <Col>
          <span class="title">基础信息</span>
        </Col>
      </Row>
      <br>
      <Row>
        <Col span="5">
          <span>车牌号: {{info.plateNumber}}</span>
        </Col>
        <Col span="5">
          <span>品牌: {{info.brandName}}</span>
        </Col>
        <Col span="5">
          <span>车型: {{info.modelName}}</span>
        </Col>
        <Col span="4">
          <span>颜色: {{info.colour}}</span>
        </Col>
        <Col span="5">
          <span>
            状态:
            <!-- {{info.state}}  -->
            <span v-if="info.status==1">正常</span>
            <span v-if="info.status==0">报废</span>
            <span v-if="info.status==2">库存</span>
            <span v-if="info.status==3">冻结</span>
          </span>
        </Col>
      </Row>
      <Row>
        <!--<Col span="5">
                <span>车辆图片: 
                    <a @click="previewImg(info.photo)" >查看</a>
                </span>
        </Col>-->
        <Col span="5">
          <span>
            车辆燃料类型:
            <span v-if="info.fuelType=='0'">汽油车</span>
            <span v-if="info.fuelType=='1'">纯电动汽车</span>
            <span v-if="info.fuelType=='2'">插电式混合动力汽车</span>
            <span v-if="info.fuelType=='3'">燃料电池汽车</span>
          </span>
        </Col>
        <Col span="5">
          <span>核定载客数: {{info.seats}}</span>
        </Col>
        <Col span="5" v-if="info.fuelType=='0' || info.fuelType=='2'">
          <span>油箱容量: {{info.fuelCapacity}}</span>
        </Col>
      </Row>
      <Row>
        <Col span="10">
          <span>备注: {{info.comment}}</span>
        </Col>
      </Row>
    </Card>
    <Card :style="{marginTop:'10px'}">
      <Row>
        <Col>
          <span class="title">行驶证信息</span>
        </Col>
      </Row>
      <br>
      <Row>
        <Col span="5">
          <span>车辆类型: {{info.vehicleType}}</span>
        </Col>
        <Col span="5">
          <span>车架号: {{info.vin}}</span>
        </Col>
        <Col span="5">
          <span>发动机号: {{info.engineId}}</span>
        </Col>
        <Col span="4">
          <span>行驶证号: {{info.drivingPermit}}</span>
        </Col>
        <Col span="5">
          <span>车辆注册日期: {{info.carRegisterTime}}</span>
        </Col>
      </Row>
    </Card>
    <Card :style="{marginTop:'10px'}">
      <Row>
        <Col>
          <span class="title">运营信息</span>
        </Col>
      </Row>
      <br>
      <Row>
        <Col span="5">
          <span>车辆所有人: {{info.carOwner}}</span>
        </Col>
        <Col span="5">
          <span>
            所属产品线:
            <span v-if="info.businessType==4">快车</span>
            <span v-if="info.businessType==2">专车</span>
          </span>
        </Col>
        <Col span="5">
          <span>运营商: {{info.operator}}</span>
        </Col>
        <Col span="5">
          <span>运营区: {{info.operatingArea}}</span>
        </Col>
        <Col span="4">
          <span>网约车运输证号: {{info.onlineCarTransportationLicense}}</span>
        </Col>
        <Col span="5">
          <span>发证机构: {{info.certifyingAuthority}}</span>
        </Col>
        <Col span="5">
          <span>有效日期起: {{info.validityStart}}</span>
        </Col>
        <Col span="5">
          <span>有效日期止: {{info.validityEnd}}</span>
        </Col>
        <Col span="5">
          <span>登记日期: {{info.recordDate}}</span>
        </Col>
        <Col span="4">
          <span>报备日期: {{info.reportDate}}</span>
        </Col>
        <Col span="6">
          <span>服务类型: {{info.serviceType}}</span>
        </Col>
      </Row>
    </Card>
    <Card :style="{marginTop:'10px'}">
      <Row>
        <Col>
          <span class="title">保险信息</span>
        </Col>
      </Row>
      <br>
      <Row>
        <Col span="8">
          <span>保险公司: {{info.insuranceCompany}}</span>
        </Col>
        <Col span="8">
          <span>保险号: {{info.insuranceNumber}}</span>
        </Col>
        <Col span="8">
          <span>保险类型: {{info.insuranceType}}</span>
        </Col>
        <Col span="8">
          <span>保险金额（元）: {{info.insuranceAmount}}</span>
        </Col>
        <Col span="8">
          <span>赔付额度（元）: {{info.compensationAmount}}</span>
        </Col>
        <Col span="8">
          <span>保险有效期起: {{info.insuranceStart}}</span>
        </Col>
        <Col span="8">
          <span>保险有效期止: {{info.insuranceEnd}}</span>
        </Col>
      </Row>
    </Card>
    <Card :style="{marginTop:'10px'}">
      <Row>
        <Col>
          <span class="title">购置信息</span>
        </Col>
      </Row>
      <br>
      <Row>
        <Col span="8">
          <span>完税证明编号: {{info.taxPaymentCertificateNumber}}</span>
        </Col>
        <Col span="8">
          <span>纳税人: {{info.taxPayer}}</span>
        </Col>
      </Row>
    </Card>
    <Card :style="{marginTop:'10px'}">
      <Row>
        <Col>
          <span class="title">上牌信息</span>
        </Col>
      </Row>
      <br>
      <Row>
        <Col span="8">
          <span>
            状态：
            <span v-if="info.plateState ==0">未上牌</span>
            <span v-if="info.plateState ==1">已上牌</span>
          </span>
        </Col>
        <Col span="8">
          <span>上牌时间: {{info.plateTime}}</span>
        </Col>
      </Row>
    </Card>
    <Card :style="{marginTop:'10px'}">
      <Row>
        <Col>
          <span class="title">软装信息</span>
        </Col>
      </Row>
      <br>
      <Row>
        <Col span="8">
          <span>脚垫：{{info.footPad}}</span>
        </Col>
        <Col span="8">
          <span>贴膜: {{info.film}}</span>
        </Col>
        <Col span="8">
          <span>车身喷漆: {{info.diyColour}}</span>
        </Col>
      </Row>
    </Card>
    <Card :style="{marginTop:'10px'}">
      <Row>
        <Col>
          <span class="title">硬件信息</span>
        </Col>
      </Row>
      <br>
      <Row>
        <Col span="24">
          <span>ADAS信息</span>
        </Col>
        <Col span="8">
          <span>厂商： {{info.adasManufacturer}}</span>
        </Col>
        <Col span="8">
          <span>采购时间: {{info.adasPurchaseTime}}</span>
        </Col>
        <Col span="8">
          <span>安装时间: {{info.adasInstallTime}}</span>
        </Col>
        <Col span="8">
          <span>设备编号: {{info.adasDeviceNumber}}</span>
        </Col>
        <Col span="24">
          <span>摄像头信息</span>
        </Col>
        <Col span="8">
          <span>厂商： {{info.cameraManufacturer}}</span>
        </Col>
        <Col span="8">
          <span>采购时间: {{info.cameraPurchaseTime}}</span>
        </Col>
        <Col span="8">
          <span>安装时间: {{info.cameraInstallTime}}</span>
        </Col>
        <Col span="8">
          <span>设备编号: {{info.cameraDeviceNumber}}</span>
        </Col>
        <Col span="24">
          <span>T-BOX信息</span>
        </Col>
        <Col span="8">
          <span>厂商： {{info.tBoxManufacturer}}</span>
        </Col>
        <Col span="8">
          <span>采购时间: {{info.tBoxPurchaseTime}}</span>
        </Col>
        <Col span="8">
          <span>安装时间: {{info.tBoxInstallTime}}</span>
        </Col>
        <Col span="8">
          <span>设备编号: {{info.tBoxDeviceNumber}}</span>
        </Col>
      </Row>
    </Card>
    <Card :style="{marginTop:'10px'}">
      <Row>
        <Col>
          <span class="title">其他信息</span>
        </Col>
      </Row>
      <br>
      <Row>
        <Col span="8">
          <span>发动机排量: {{info.engineCapacity}}</span>
        </Col>
        <Col span="8">
          <span>
            年度检修状态:
            <span v-if="info.annualSurveyState==0">未检修</span>
            <span v-if="info.annualSurveyState==1">已检修</span>
            <span v-if="info.annualSurveyState==2">未知状态</span>
          </span>
        </Col>
        <Col span="8">
          <span>下次年检时间: {{info.nextAnnualSurveyDate}}</span>
        </Col>
        <Col span="8">
          <span>
            车辆年审状态:
            <span v-if="info.annualVerificateState==0">未年审</span>
            <span v-if="info.annualVerificateState==1">合格</span>
            <span v-if="info.annualVerificateState==2">不合格</span>
          </span>
        </Col>

        <Col span="8">
          <span>发票打印序列号：{{info.invoiceSerialNumber}}</span>
        </Col>
        <Col span="8">
          <span>卫星定位装置品牌: {{info.satellitePositionDeviceBrand}}</span>
        </Col>
        <Col span="8">
          <span>卫星定位装置型号: {{info.satellitePositionDeviceType}}</span>
        </Col>
        <Col span="8">
          <span>卫星定位装置IMEI号: {{info.satellitePositionDeviceIMEI}}</span>
        </Col>
        <Col span="8">
          <span>卫星定位装置安装日期： {{info.satellitePositionDeviceInstallDate}}</span>
        </Col>
      </Row>
    </Card>
    <Modal title="图片预览" v-model="imgVisible">
      <img :src="imgURL" v-if="imgVisible" style="width: 100%">
    </Modal>
  </div>
</template>

<script>
import { getVehicleBasic } from "@/api/vehicle.js";
import { mapMutations, mapActions, mapGetters } from "vuex";
export default {
  mounted() {
    this.getData();
  },
  data() {
    return {
      info: {},
      imgVisible: false
    };
  },
  methods: {
    ...mapActions(["handleAddUuid", "handleDelUuid"]),
    getData() {
      let data = { otherIndex: this.$route.params.id };
      getVehicleBasic(data).then(res => {
        if (res.data.success) {
          this.handleDelUuid();
          this.info = res.data.data;
          let uuid = this.info.uuid;
          this.handleAddUuid(uuid);
        } else {
          this.$Message.error("读取数据出错");
        }
      });
    },
    previewImg(url) {
      this.imgURL = url;
      this.imgVisible = true;
    }
  }
};
</script>
<style lang="less" scoped>
.title {
  font-weight: 700;
}
.ivu-col {
  padding: 3px;
}
</style>
