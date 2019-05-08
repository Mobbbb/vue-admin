<template>
  <div class="layout layout-container record-container">
    <!-- 档案详情 -->
    <Layout>
      <Sider :style="{maxWidth: '100%', width: '100%'}">
        <Menu mode="vertical" :active-name="activeIndex" @on-select="init">
          <MenuItem name="1">基本信息</MenuItem>
          <MenuItem name="2">驾驶证信息</MenuItem>
          <MenuItem name="3">网约车资质信息</MenuItem>
          <MenuItem name="4">车辆信息</MenuItem>
          <MenuItem name="5">其他信息</MenuItem>
          <!-- <MenuItem name='6'>
            培训信息
          </MenuItem>
          <MenuItem name='5'>
            人脸信息
          </MenuItem>
          <MenuItem name='6'>
            司管信息
          </MenuItem>-->
        </Menu>
      </Sider>
      <Layout class="record-content">
        <Content>
          <!-- 基本信息 -->
          <Form
            v-show="activeIndex == 1"
            label-position="left"
            :style="{margin:'10px 0 0 0'}"
            ref="baseDetail"
            :label-width="100"
            :model="driverBaseInfo"
            inline
            :rules="baseDetailRule"
          >
            <Row type="flex">
              <Col>
                <FormItem label="姓名" prop="name" v-show="isAudit">
                  <Input v-model="driverBaseInfo.name" style="width: 200px;"></Input>
                </FormItem>
                <FormItem label="姓名" v-show="!isAudit">
                  <Input v-model="driverBaseInfo.name" :readonly="!isAudit" style="width: 200px;"></Input>
                </FormItem>
              </Col>
              <Col>
                <FormItem label="民族">
                  <Input
                    v-model="driverBaseInfo.driverNation"
                    :readonly="!isAudit"
                    style="width: 200px;"
                  ></Input>
                </FormItem>
              </Col>
              <Col>
                <FormItem label="性别">
                  <Select
                    v-model="driverBaseInfo.sex"
                    :readonly="!isAudit"
                    filter
                    disabled
                    placeholder=""
                    style="width:200px">
                    <Option :value="1">男</Option>
                    <Option :value="2">女</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col>
                <FormItem label="身份证号" prop="idCard" v-show="isAudit">
                  <Input v-model="driverBaseInfo.idCard" style="width: 200px"></Input>
                </FormItem>
                <FormItem label="身份证号" v-show="!isAudit">
                  <Input
                    v-model="driverBaseInfo.idCard"
                    readonly
                    style="width: 200px"
                  ></Input>
                </FormItem>
              </Col>
              <Col>
                <FormItem label="年龄" prop="age">
                  <Input
                    v-model="driverBaseInfo.age"
                    number
                    :readonly="!isAudit"
                    style="width: 200px;"
                  ></Input>
                </FormItem>
                <!-- <FormItem label='年龄' >
                  <Input v-model='driverBaseInfo.age' number readonly style="width: 200px;"></Input>
                </FormItem>-->
              </Col>
              <Col>
                <FormItem label="手机号">
                  <Input
                    v-model="driverBaseInfo.mobile"
                    :readonly="!isAudit"
                    style="width: 200px"
                  ></Input>
                </FormItem>
                <!-- <FormItem label='手机号' v-show="!isAudit">
                  <Input v-model='driverBaseInfo.mobile' readonly style="width: 200px" ></Input>
                </FormItem>-->
              </Col>
              <Col>
                <FormItem label="紧急联系人">
                  <Input
                    v-model="driverBaseInfo.emergencyContact"
                    :readonly="!isAudit"
                    style="width: 200px;"
                  ></Input>
                </FormItem>
              </Col>
              <Col>
                <FormItem label="紧急联系人电话" >
                  <Input
                    v-model="driverBaseInfo.emergencyContactPhone"
                    :readonly="!isAudit"
                    style="width: 200px"
                  ></Input>
                </FormItem>
              </Col>
              <Col>
                <FormItem label="司机ID">
                  <Input
                    readonly
                    v-model="driverBaseInfo.driverNo"
                    style="width: 200px"
                  ></Input>
                </FormItem>
              </Col>
              <Col>
                <FormItem label="入职时间" prop="entryTime" v-show="isAudit">
                  <DatePicker
                    type="date"
                    format="yyyy-MM-dd"
                    @on-change="selectEntryTime"
                    :value="driverBaseInfo.entryTime"
                    style="width: 200px;"
                    v-model="driverBaseInfo.entryTime"
                  ></DatePicker>
                </FormItem>
                <FormItem label="入职时间" v-show="!isAudit">
                  <DatePicker
                    type="date"
                    readonly
                    v-model="driverBaseInfo.entryTime"
                    style="width: 200px"
                  ></DatePicker>
                </FormItem>
              </Col>
              <Col>
                <FormItem label="家庭住址">
                  <Input
                    style="width: 300px; margin-right: 10px;"
                    v-model="homeAddress"
                    :readonly="!isAudit"
                  ></Input>
                  <a @click="selectHomeAddress" v-show="isAudit">选择地址</a>
                </FormItem>
              </Col>
              <!-- <Col >
                <FormItem label='司机来源'>
                  <Input v-model='driverBaseInfo.driverOrigin' style="width: 200px"></Input>
                </FormItem>
              </Col>-->
            </Row>
            <Row>
              <Col :md="12" :lg="6">
                <FormItem label="头像" >
                  <VUpload
                    :defaultList="faceImg"
                    :isDetail="!isAudit"
                    :action="uploadUrl"
                    @on-upsuccess="uploadFaceHandle"
                    class="no-delete-pic"
                  ></VUpload>
                </FormItem>
              </Col>
              <Col :md="12" :lg="6">
                <FormItem label="身份证照人像面" >
                  <VUpload
                    :defaultList="idCardFaceImg"
                    :action="uploadUrl"
                    :isDetail="!isAudit"
                    @on-upsuccess="uploadIdCard"
                    class="no-delete-pic"
                  ></VUpload>
                </FormItem>
              </Col>
              <Col :md="12" :lg="6">
                <FormItem label="身份证照国徽面" >
                  <VUpload
                    :defaultList="idCardBackImg"
                    :action="uploadUrl"
                    :isDetail="!isAudit"
                    @on-upsuccess="uploadBackIdCard"
                    class="no-delete-pic"
                  ></VUpload>
                </FormItem>
              </Col>
              <Col :md="12" :lg="6">
                <FormItem label="手持身份证照" >
                  <VUpload
                    :defaultList="driverIdCardImg"
                    :action="uploadUrl"
                    :isDetail="!isAudit"
                    @on-upsuccess="uploladIdcardDriver"
                    class="no-delete-pic"
                  ></VUpload>
                </FormItem>
              </Col>
            </Row>
            <FormItem>
              <Button type="primary" v-show="isAudit" @click.native="saveBaseInfo">保存</Button>
              <Button type="default" style="margin-left: 8px" v-show="isAudit" @click="reset">重置</Button>
            </FormItem>
          </Form>
          <!-- 驾驶证信息 -->
          <Form
            v-show="activeIndex == 2"
            label-position="left"
            :style="{margin:'10px 0 0 0'}"
            ref="driveLicenceDetail"
            :label-width="100"
            :model="driverBaseInfo"
            :rules="driveLicenceDetailRule"
          >
            <FormItem label="驾驶证号" prop="licenseId" v-show="isAudit">
              <Input v-model="driverBaseInfo.licenseId" style="width: 200px"></Input>
            </FormItem>
            <FormItem label="驾驶证号" v-show="!isAudit">
              <Input :readonly="!isAudit" v-model="driverBaseInfo.licenseId" style="width: 200px"></Input>
            </FormItem>
            <FormItem label="准驾车型" prop="driverType" v-show="isAudit">
              <Input v-model="driverBaseInfo.driverType" style="width: 200px"></Input>
            </FormItem>
            <FormItem label="准驾车型" v-show="!isAudit">
              <Input :readonly="!isAudit" v-model="driverBaseInfo.driverType" style="width: 200px"></Input>
            </FormItem>
            <FormItem label="初次领证日期">
              <DatePicker
                :readonly="!isAudit"
                type="date"
                @on-change="selectFistCredentials"
                style="width: 200px"
                v-model="driverBaseInfo.getDriverLicenseDate"
              ></DatePicker>
            </FormItem>
            <FormItem label="驾驶证有效期">
              <DatePicker
                :readonly="!isAudit"
                type="date"
                @on-change="driverStartTime"
                style="width: 200px"
                v-model="driverBaseInfo.driverLicenseOn"
              ></DatePicker>-
              <DatePicker
                :readonly="!isAudit"
                type="date"
                @on-change="driverEndTime"
                style="width: 200px"
                v-model="driverBaseInfo.driverLicenseOff"
              ></DatePicker>
            </FormItem>
            <Row>
              <Col span="12">
                <FormItem label="驾驶证正页">
                  <!-- <div class="img-box">
                    <img :src="driverBaseInfo.drivingLicenceHomeImg" >
                  </div>-->
                  <VUpload
                    :defaultList="drivingLicenceHomeImg"
                    :action="uploadUrl"
                    :isDetail="!isAudit"
                    @on-upsuccess="upDriverHome"
                    class="no-delete-pic"
                  ></VUpload>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="驾驶证副页" >
                  <VUpload
                    :defaultList="drivingLicenceSubImg"
                    :isDetail="!isAudit"
                    :action="uploadUrl"
                    @on-upsuccess="upDriverBack"
                    class="no-delete-pic"
                  ></VUpload>
                </FormItem>
              </Col>
            </Row>
            <FormItem>
              <Button type="primary" v-show="isAudit" @click.native="saveDriverLicense">保存</Button>
              <Button type="default" style="margin-left: 8px" v-show="isAudit" @click="reset">重置</Button>
            </FormItem>
          </Form>
          <!-- 网约车资质信息 -->
          <Form
            v-show="activeIndex == 3"
            inline
            label-position="left"
            :style="{margin:'10px 0 0 0'}"
            ref="qualificationDetail"
            :label-width="110"
            :model="driverBaseInfo"
            :rules="qualificationDetailRule"
          >
            <FormItem label="网约车资格证号">
              <Input
                :readonly="!isAudit"
                v-model="driverBaseInfo.certificateNo"
                style="width: 200px"
              ></Input>
            </FormItem>
            <FormItem label="发证机构">
              <Input
                :readonly="!isAudit"
                v-model="driverBaseInfo.networkCarIssueOrganization"
                style="width: 200px"
              ></Input>
            </FormItem>
            <FormItem label="发证日期">
              <Input
                :readonly="!isAudit"
                v-model="driverBaseInfo.networkCarIssueDate"
                style="width: 200px"
              ></Input>
            </FormItem>
            <FormItem label="有效期">
              <DatePicker
                :readonly="!isAudit"
                type="date"
                @on-change="startTimeValidate"
                style="width: 200px"
                v-model="driverBaseInfo.networkCarProofOn"
              ></DatePicker>-
              <DatePicker
                :readonly="!isAudit"
                type="date"
                @on-change="endTimeValidate"
                style="width: 200px"
                v-model="driverBaseInfo.networkCarProofOff"
              ></DatePicker>
            </FormItem>
            <FormItem label="初次领证日期">
              <DatePicker
                :readonly="!isAudit"
                type="date"
                format="yyyy-MM-dd"
                @on-change="firstCertificateNoTime"
                style="width: 200px;"
                v-model="driverBaseInfo.getNetworkCarProofDate"
              ></DatePicker>
            </FormItem>
            <FormItem label="报备日期">
              <DatePicker
                :readonly="!isAudit"
                type="date"
                format="yyyy-MM-dd"
                @on-change="reportTime"
                style="width: 200px;"
                v-model="driverBaseInfo.registerDate"
              ></DatePicker>
            </FormItem>
            <Row>
              <Col span="8">
                <FormItem label="是否巡游">
                  <RadioGroup v-model="driverBaseInfo.taxiDriver">
                    <Radio :label="1" disabled>是</Radio>
                    <Radio :label="0" disabled>否</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="是否专职">
                  <RadioGroup v-model="driverBaseInfo.fullTimeDriver">
                    <Radio :label="1" disabled>是</Radio>
                    <Radio :label="0" disabled>否</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <FormItem>
              <Button type="primary" v-show="isAudit" @click.native="saveCarNet">保存</Button>
              <Button type="default" style="margin-left: 8px" v-show="isAudit" @click="reset">重置</Button>
            </FormItem>
          </Form>
          <!-- 车辆信息 -->
          <Form
            v-show="activeIndex == 4"
            label-position="left"
            :style="{margin:'10px 0 0 0'}"
            ref="carDetail"
            :label-width="80"
            :model="driverBaseInfo"
          >
            <FormItem label="车牌号">
              <Input v-model="driverBaseInfo.plateNum" readonly style="width: 200px"></Input>
            </FormItem>
            <FormItem label="VIN码">
              <Input v-model="driverBaseInfo.vin" readonly style="width: 200px"></Input>
            </FormItem>
            <FormItem label="燃料类型">
              <Select
                v-model="driverBaseInfo.fuelType"
                :readonly="!isAudit"
                filter
                disabled
                placeholder=""
                style="width:200px">
                <Option :value="0">汽油车</Option>
                <Option :value="1">纯电动汽车</Option>
                <Option :value="2">插电式混合动力汽车</Option>
                <Option :value="3">燃料电池汽车</Option>
              </Select>
              <!-- <Input v-model='driverBaseInfo.fuelType' readonly style="width: 200px"></Input> -->
            </FormItem>
            <FormItem label="车辆型号">
              <Input v-model="driverBaseInfo.model" readonly style="width: 200px"></Input>
            </FormItem>
            <FormItem label="车辆颜色">
              <Input v-model="driverBaseInfo.carColor" readonly style="width: 200px"></Input>
            </FormItem>
          </Form>
          <!-- 其他信息 -->
          <Form
            v-show="activeIndex == 5"
            label-position="left"
            inline
            :style="{margin:'10px 0 0 0'}"
            :label-width="100"
            :model="driverBaseInfo"
          >
            <Row type="flex">
              <Col>
                <FormItem label="婚姻状况">
                  <Select
                    v-model="driverBaseInfo.driverMaritalStatus"
                    filter
                    disabled
                    placeholder=""
                    style="width:200px">
                    <Option value="10">未婚</Option>
                    <Option value="20">已婚</Option>
                    <Option value="40">离婚</Option>
                  </Select>
                  <!-- <Input v-model='driverBaseInfo.marriage' readonly style="width: 200px"></Input> -->
                </FormItem>
              </Col>
              <Col>
                <FormItem label="外语能力">
                  <Select
                    v-model="driverBaseInfo.driverLanguageLevel"
                    filter
                    disabled
                    placeholder=""
                    style="width:200px">
                    <Option value="1">精通</Option>
                    <Option value="2">熟练</Option>
                    <Option value="3">良好</Option>
                    <Option value="4">一般</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col>
                <FormItem label="学历水平">
                  <Select
                    v-model="driverBaseInfo.driverEducation"
                    filter
                    disabled
                    placeholder=""
                    style="width:200px">
                    <Option
                      v-for="(item, index) in educationalRecord"
                      :value="item.value"
                      :key="index"
                    >{{item.text}}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col>
                <FormItem label="户口登记机关" >
                  <Input
                    v-model="driverBaseInfo.driverCensus"
                    :readonly="!isAudit"
                    style="width: 200px"
                  ></Input>
                </FormItem>
              </Col>
              <Col>
                <FormItem label="户口登记地址" >
                  <Input
                    v-model="driverBaseInfo.driverAddress"
                    :readonly="!isAudit"
                    style="width: 200px"
                  ></Input>
                </FormItem>
              </Col>
              <Col>
                <FormItem label="紧急联系人" >
                  <Input
                    v-model="driverBaseInfo.emergencyContact"
                    :readonly="!isAudit"
                    style="width: 200px"
                  ></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem label="紧急联系人电话" >
                  <Input
                    v-model="driverBaseInfo.emergencyContactPhone"
                    :readonly="!isAudit"
                    style="width: 200px"
                  ></Input>
                </FormItem>
              </Col>
              <Col>
                <FormItem label="地址">
                  <Input
                    v-model="driverBaseInfo.emergencyContactAddress"
                    :readonly="!isAudit"
                    style="width: 200px"
                  ></Input>
                </FormItem>
              </Col>
            </Row>
            <FormItem>
              <Button type="primary" v-show="isAudit" @click="saveOtherInfo">保存</Button>
              <Button type="default" style="margin-left: 8px" v-show="isAudit" @click="reset">重置</Button>
            </FormItem>
          </Form>
          <!-- 培训信息 -->
          <Form
            v-show="activeIndex == 6"
            label-position="left"
            :style="{margin:'10px 0 0 0'}"
            :label-width="100"
            :model="driverBaseInfo"
          >
            <FormItem label="培训类型">
              <Select
                v-model="driverBaseInfo.type"
                filter
                disabled
                placeholder=""
                style="width:200px">
                <Option :value="1">岗前培训</Option>
                <Option :value="2">日常培训</Option>
              </Select>
            </FormItem>
            <FormItem label="培训课程日期">
              <DatePicker
                type="date"
                format="yyyy-MM-dd"
                @on-change="selectSubjectTime"
                style="width: 200px;"
                v-model="driverBaseInfo.courseDate"
              ></DatePicker>
            </FormItem>
            <FormItem label="培训开始时间">
              <DatePicker
                type="date"
                format="yyyy-MM-dd"
                @on-change="selectTrainInfoStartTime"
                style="width: 200px;"
                v-model="driverBaseInfo.startTime"
              ></DatePicker>
            </FormItem>
            <FormItem label="培训结束时间">
              <DatePicker
                type="date"
                format="yyyy-MM-dd"
                @on-change="selectTrainInfoEndTime"
                style="width: 200px;"
                v-model="driverBaseInfo.stopTime"
              ></DatePicker>
            </FormItem>
            <FormItem label="培训课程名称">
              <Input v-model="driverBaseInfo.courseName" :readonly="!isAudit" style="width:200px"></Input>
            </FormItem>
            <FormItem label="培训时长">
              <Input v-model="driverBaseInfo.duration" :readonly="!isAudit" style="width:200px"></Input>
            </FormItem>
            <FormItem>
              <Button type="primary" v-show="isAudit" @click="saveCultivateInfo">保存</Button>
              <Button type="default" style="margin-left: 8px" v-show="isAudit" @click="reset">重置</Button>
            </FormItem>
          </Form>

          <!-- 人脸信息 -->
          <!-- <Form v-show='activeIndex == 5' label-position='left' :style="{margin:'10px 0 0 0'}" ref='carDetail' :label-width="80" :model='carDetail' inline >
            <FormItem label='人脸信息'>
              <VUpload
                  :defaultList='facePhotoList'
                  :maxUpLoadCount='maxUpLoadCount'
                  class="no-delete-pic"
              ></VUpload>
            </FormItem>
          </Form>-->
          <!-- 司管信息 -->
          <!-- <Form v-show='activeIndex == 6' label-position='left' :style="{margin:'10px 0 0 0'}" ref='driverLeaderDetail' :label-width="80" :model='driverLeaderDetail'>
            <FormItem label='所属城市'>
              <Input v-model='driverLeaderDetail.city' readonly style="width:200px"></Input>
            </FormItem>
            <FormItem label='所属城市'>
              <Input v-model='driverLeaderDetail.city' readonly style="width:200px"></Input>
            </FormItem>
            <FormItem label='所属运营商'>
              <Input v-model='driverLeaderDetail.outlets' readonly style="width:200px"></Input>
            </FormItem>
            <FormItem label='司管姓名'>
              <Input v-model='driverLeaderDetail.name' readonly style="width:200px"></Input>
            </FormItem>
            <FormItem label='司管手机号'>
              <Input v-model='driverLeaderDetail.phoneNumber' readonly style="width:200px"></Input>
            </FormItem>
          </Form>-->
        </Content>
      </Layout>
    </Layout>
    <Modal v-model="isShowMap" title="选择地址" :mask-closable="false" :width="800">
      <VMapMaker @listenMap="reserveAddress"></VMapMaker>
    </Modal>
  </div>
</template>
<script>
import { recordData } from "./fields.js";
import VUpload from "_a/v-upload/v-upload";
import '@/styles/cyk-style.css'
import {
  queryBaseInfo,
  queryDriverLicense,
  queryNetCarQualification,
  editDriverLicense,
  editNetCarQualification,
  queryTrainInfo,
  editTrainInfo,
  editOtherInfo,
  queryOtherInfo,
  queryCarInfo,
  editBaseInfo
} from "@/api/driver.js";
import VMapMaker from "_a/VmapPicker/v-mapPicker.vue";
let commonRequest = queryBaseInfo;
export default {
  name: "Record",
  props: ["auditId", "isAudit"],
  components: {
    VUpload,
    VMapMaker
  },
  data() {
    return {
      uploadUrl: this._baseUrl + "/common/uploadPics",
      upParams: { driverUuid: this.auditId },
      ...recordData
    };
  },
  created() {
    this.auditId && this.init("1");
  },
  methods: {
    init(name) {
      this.activeIndex = name;
      this.operateDetail();
    },
    operateDetail() {
      switch (this.activeIndex) {
        case "1":
          commonRequest = queryBaseInfo;
          break;
        case "2":
          commonRequest = queryDriverLicense;
          break;
        case "3":
          commonRequest = queryNetCarQualification;
          break;
        case "4":
          commonRequest = queryCarInfo;
          break;
        case "5":
          commonRequest = queryOtherInfo;
          break;
        case "6":
          commonRequest = queryTrainInfo;
          break;
      }
      this.driverBaseInfo = {};
      this.viewInfoController();
    },
    viewInfoController() {
      // 查询信息
      let data = {
        driverUuid: this.auditId
      };
      commonRequest(data).then(res => {
        if (res.data.success) {
          let result = res.data.data;
          switch (this.activeIndex) {
            case "1":
              this.homeAddress = result.homeAddress
                ? result.homeAddress.address
                : "";
              this.faceImg = result.face ? [{ url: result.face }] : [];
              this.idCardFaceImg = result.idCardFaceImg
                ? [{ url: result.idCardFaceImg }]
                : [];
              this.idCardBackImg = result.idCardBackImg
                ? [{ url: result.idCardBackImg }]
                : [];
              this.driverIdCardImg = result.driverIdCardImg
                ? [{ url: result.driverIdCardImg }]
                : [];
              break;
            case "2":
              this.drivingLicenceHomeImg = result.drivingLicenceHomeImg
                ? [{ url: result.drivingLicenceHomeImg }]
                : [];
              this.drivingLicenceSubImg = result.drivingLicenceSubImg
                ? [{ url: result.drivingLicenceSubImg }]
                : [];
              break;
          }
          this.driverBaseInfo = result;
        }
      });
    },
    uploadFaceHandle(res) {
      // 上传头像
      let imgUrl = res.data.picUrl;
      this.faceImg = [{ url: imgUrl }];
      this.driverBaseInfo.face = imgUrl;
    },
    uploadIdCard(res) {
      // 上传身份证人像面
      let imgUrl = res.data.picUrl;
      this.idCardFaceImg = [{ url: imgUrl }];
      this.driverBaseInfo.idCardFaceImg = imgUrl;
    },
    uploadBackIdCard(res) {
      // 上传身份证国徽面
      let imgUrl = res.result.picUrl;
      this.idCardBackImg = [{ url: imgUrl }];
      this.driverBaseInfo.idCardBackImg = imgUrl;
    },
    uploladIdcardDriver(res) {
      // 上传手持身份证照
      let imgUrl = res.result.picUrl;
      this.driverIdCardImg = [{ url: imgUrl }];
      this.driverBaseInfo.driverIdCardImg = imgUrl;
    },
    upDriverHome(res) {
      // 上传驾驶证正面照
      let imgUrl = res.result.picUrl;
      this.drivingLicenceHomeImg = [{ url: imgUrl }];
      this.driverBaseInfo.drivingLicenceHomeImg = imgUrl;
    },
    upDriverBack(res) {
      // 上传驾驶证背面照
      let imgUrl = res.result.picUrl;
      this.drivingLicenceSubImg = [{ url: imgUrl }];
      this.driverBaseInfo.drivingLicenceSubImg = imgUrl;
    },
    saveBaseInfo() {
      // 修改基本信息
      let params = {
        uuid: this.auditId,
        ...this.driverBaseInfo
      };
      this.$refs.baseDetail.validate(valid => {
        if (valid) {
          editBaseInfo(params).then(res => {
            if (res.data.success) {
              this.$Message.success("修改成功!");
            } else {
              let msg = res.data.errorMsg || "服务器错误!";
              this.$Message.error(msg);
            }
          });
        }
      });
    },
    saveDriverLicense() {
      // 修改驾驶证信息
      let params = {
        uuid: this.auditId,
        ...this.driverBaseInfo
      };
      this.$refs.driveLicenceDetail.validate(valid => {
        editDriverLicense(params).then(res => {
          if (res.data.success) {
            this.$Message.success("修改成功!");
          } else {
            let msg = res.data.errorMsg || "服务器错误!";
            this.$Message.error(msg);
          }
        });
      });
    },
    saveCarNet() {
      // 修改网约车资质信息
      let params = {
        uuid: this.auditId,
        ...this.driverBaseInfo
      };
      editNetCarQualification(params).then(res => {
        if (res.data.success) {
          this.$Message.success("修改成功!");
        } else {
          let msg = res.data.errorMsg || "服务器错误!";
          this.$Message.error(msg);
        }
      });
    },
    saveOtherInfo() {
      //保存其他信息
      let params = {
        uuid: this.auditId,
        ...this.driverBaseInfo
      };
      editOtherInfo(params).then(res => {
        if (res.data.success) {
          this.$Message.success("修改成功!");
        } else {
          let msg = res.data.errorMsg || "服务器错误!";
          this.$Message.error(msg);
        }
      });
    },
    saveCultivateInfo() {
      // 保存培训信息
      let params = {
        ...this.driverBaseInfo
      };
      editTrainInfo(params).then(res => {
        if (res.data.success) {
          this.$Message.success("修改成功!");
        } else {
          let msg = res.data.errorMsg || "服务器错误!";
          this.$Message.error(msg);
        }
      });
    },
    driverStartTime(data) {
      // 选择驾驶证有效期
      if (data) {
        this.driverBaseInfo.driverLicenseOn = data;
      }
    },
    driverEndTime(data) {
      if (data) {
        this.driverBaseInfo.driverLicenseOff = data;
      }
    },
    startTimeValidate(data) {
      // 选择网约车资质信息有效期
      if (data) {
        this.driverBaseInfo.networkCarProofOn = data;
      }
    },
    endTimeValidate(data) {
      // 选择网约车资质信息有效期
      if (data) {
        this.driverBaseInfo.networkCarProofOff = data;
      }
    },
    firstCertificateNoTime() {
      // 网约车资质第一次领证日期
      if (data) {
        this.driverBaseInfo.getNetworkCarProofDate = data;
      }
    },
    reportTime() {
      // 网约车报备日期
      if (data) {
        this.driverBaseInfo.registerDate = data;
      }
    },
    selectEntryTime(data) {
      // 选择入职时间
      if (data) {
        this.driverBaseInfo.entryTime = data;
      }
    },
    selectTrainInfoStartTime(data) {
      if (data) {
        this.driverBaseInfo.startTime = data;
      }
    },
    selectTrainInfoEndTime(data) {
      if (data) {
        this.driverBaseInfo.stopTime = data;
      }
    },
    selectSubjectTime(data) {
      if (data) {
        this.driverBaseInfo.courseDate = data;
      }
    },
    selectFistCredentials(data) {
      // 驾驶证信息->初次领证日期
      if (data) {
        this.driverBaseInfo.getDriverLicenseDate = data;
      }
    },
    reset() {
      this.activeIndex = "1";
      this.driverBaseInfo = {};
    },
    reserveAddress(data) {
      if (data) {
        this.homeAddress = data.address;
        this.driverBaseInfo.homeAddress["province"] = data.province;
        this.driverBaseInfo.homeAddress["city"] = data.city;
        this.driverBaseInfo.homeAddress["address"] = data.address;
        this.driverBaseInfo.homeAddress["lng"] = data.longitude;
        this.driverBaseInfo.homeAddress["lat"] = data.latitude;
        this.driverBaseInfo.homeAddress["adCode"] = data.areaCode;
        this.isShowMap = false;
      }
    },
    selectHomeAddress() {
      this.driverBaseInfo.homeAddress = {};
      this.isShowMap = true;
    }
  },
  watch: {
    isAudit(value) {
      if (value) {
        this.reset();
        this.init("1");
      }
    },
    auditId(value) {
      if (value) {
        this.init("1");
      }
    }
  }
};
</script>
<style lang="less" scoped>
  .no-delete-pic .demo-upload-list .demo-upload-list-cover .ivu-icon-ios-trash-outline{
    display: none;
  }
</style>