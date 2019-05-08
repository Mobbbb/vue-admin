<template>
  <div style="margin-top:20px">
    <Form ref="basicForm" :model="basicForm" :label-width="126" :rules="ruleBasicInfo">
      <Row>
        <Col span="9">
          <FormItem label="公司标识:" prop="companyId">
            <span v-if="!editable">{{basicInfo.companyId}}</span>
            <Input v-model="basicForm.companyId" v-if="editable" placeholder="请输入" :maxlength="length"></Input>
          </FormItem>
        </Col>
        <Col span="2" style="text-align: center">&nbsp</Col>
        <Col span="9">
          <FormItem label="经营业户经济类型:" prop="economicType">
            <span v-if="!editable">{{basicInfo.economicType}}</span>
            <Input v-model="basicForm.economicType" v-if="editable" placeholder="请输入" :maxlength="length"></Input>
          </FormItem>
        </Col>
        <Col span="3">
            <Button 
              class="button" 
              type="primary" 
              v-if="!editable" 
              v-hasAuth="'platform-center-info-edit'"
              @click="handleEdit">编辑
            </Button>
            <Button class="button" type="success" v-if="editable" @click="handleSave('basicForm')">保存</Button>
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="公司名称:" prop="companyName">
            <span v-if="!editable">{{basicInfo.companyName}}</span>
            <Input v-model="basicForm.companyName" v-if="editable" placeholder="请输入" :maxlength="length"></Input>
          </FormItem>
        </Col>
        <Col span="2" style="text-align: center">&nbsp</Col>
        <Col span="9">
          <FormItem label="注册资本（元）:" prop="regCapital">
            <span v-if="!editable">{{basicInfo.regCapital}}</span>
            <InputNumber v-model="basicForm.regCapital" v-if="editable" placeholder="请输入" :max="999999999999999" :min="0"></InputNumber>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="紧急联系电话:" prop="contactPhone">
            <span v-if="!editable">{{basicInfo.contactPhone}}</span>
            <Input v-model="basicForm.contactPhone" v-if="editable" placeholder="请输入"></Input>
          </FormItem>
        </Col>
        <Col span="2" style="text-align: center">&nbsp</Col>
        <Col span="9">
          <FormItem label="法人代表:" prop="legalName">
            <span v-if="!editable">{{basicInfo.legalName}}</span>
            <Input v-model="basicForm.legalName" v-if="editable" placeholder="请输入" :maxlength="length"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="统一信用代码:" prop="identifier">
            <span v-if="!editable">{{basicInfo.identifier}}</span>
            <Input v-model="basicForm.identifier" v-if="editable" placeholder="请输入" :maxlength="length"></Input>
          </FormItem>
        </Col>
        <Col span="2" style="text-align: center">&nbsp</Col>
        <Col span="9">
          <FormItem label="法人电话:" prop="legalPhone">
            <span v-if="!editable">{{basicInfo.legalPhone}}</span>
            <Input v-model="basicForm.legalPhone" v-if="editable" placeholder="请输入"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <Row>
            <Col span="24">
              <FormItem label="注册行政区(省):" prop="provinceID">
                <span v-if="!editable">{{basicInfo.provinceName}}</span>
                <Select v-model="basicForm.provinceID" placeholder="请选择" v-if="editable">
                  <Option v-for="(item,index) in cityList" :value="item.provinceID" :key="index" @click.native='changeProvince(item)'>{{item.province}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <FormItem label="注册行政区(市):" prop="address">
                <span v-if="!editable">{{basicInfo.city}}</span>
                <Select v-model="basicForm.address" placeholder="请选择" v-if="editable">
                  <Option v-for="(item,index) in cityChild" :key="index" :value="item.cityID">{{item.city}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
        </Col>
        <Col span="2" style="text-align: center">&nbsp</Col>
        <Col span="9">
          <FormItem label="法人身份证扫描件(jpg 格式，小于200k 的图片）" prop="legalJpgPhoto">
            <div class="demo-upload-list" v-if="!editable">
              <img
                v-if="basicInfo.legalJpgPhoto!=''"
                :src="basicInfo.legalJpgPhoto"
                style="vertical-align: top;"
                @click="handleView"
              >
            </div>
            <div class="demo-upload-list" v-if="editable">
              <input v-model="basicForm.legalJpgPhoto" type="hidden"/>
              <img
                v-if="basicForm.legalJpgPhoto!=''"
                :src="basicForm.legalJpgPhoto"
                style="vertical-align: top;"
              >
              <div class="demo-upload-list-cover" v-if="basicForm.legalJpgPhoto!=''">
                <Icon type="ios-eye-outline" @click.native="handleView2"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove"></Icon>
              </div>
              <Progress v-if="showProgress" :percent="upPercent" hide-info></Progress>
              <Upload
                :action="upBaseUrl"
                :format="['jpg']"
                :headers='headerSet'
                :max-size="200"
                :before-upload='beforeUpHandle'
                :on-exceeded-size="handleMaxSize"
                :on-format-error="handleFormatError"
                :on-success="handleSuccess">
                <div style="width: 58px;height:58px;line-height: 58px;" v-if="basicForm.legalJpgPhoto==''">
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
            </div>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="通信地址:" prop="contactAddress">
            <span v-if="!editable">{{basicInfo.contactAddress}}</span>
            <Input v-model="basicForm.contactAddress" v-if="editable" placeholder="请输入" :maxlength="length"></Input>
          </FormItem>
        </Col>
        <Col span="2" style="text-align: center">&nbsp</Col>
        <Col span="9">
          <FormItem label="法人身份证:" prop="legalId">
            <span v-if="!editable">{{basicInfo.legalId}}</span>
            <Input v-model="basicForm.legalId" v-if="editable" placeholder="请输入" :maxlength="length"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="平台联系人电话:" prop="responsibleWay">
            <span v-if="!editable">{{basicInfo.responsibleWay}}</span>
            <Input v-model="basicForm.responsibleWay" v-if="editable" placeholder="请输入"></Input>
          </FormItem>
        </Col>
        <Col span="2" style="text-align: center">&nbsp</Col>
        <Col span="9">
          <FormItem label="平台联系人姓名:" prop="responsible">
            <span v-if="!editable">{{basicInfo.responsible}}</span>
            <Input v-model="basicForm.responsible" v-if="editable" placeholder="请输入" :maxlength="length"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9" v-if="editable">
        <FormItem label="经营范围:" prop="businessScope">
          <Input v-model="basicForm.businessScope" v-if="editable" placeholder="请输入" type="textarea" :rows="4" :maxlength="lengthTwo"></Input>
        </FormItem>
        </Col>
        <Col span="20" v-if="!editable">
        <FormItem label="经营范围:" prop="businessScope">
          <span v-if="!editable">{{basicInfo.businessScope}}</span>
        </FormItem>
        </Col>
      </Row>
    </Form>
    <Modal title="查看大图" v-model="imgVisible">
      <img
        :src="basicInfo.legalJpgPhoto"
        style="width: 100%"
      >
    </Modal>
    <Modal title="查看大图" v-model="imgVisible2">
      <img
        :src="basicForm.legalJpgPhoto"
        style="width: 100%"
      >
    </Modal>
  </div>
</template>

<script>
  let timer = null;
  import {editBasicInfo} from "@/api/configData.js";
  import { regTest } from '@/libs/tools'

  export default {
  props: {
    cityList: {
      type: Array,
      default: []
    },
    upBaseUrl: String,
    headerSet: Object,
    basicInfo: Object
  },
  data() {
    const checkPhone = (rule, value, callback) => {
      if(regTest(value, 'phone&mobile')) callback()
      else callback(new Error('输入格式有误'))
    }
    return {
      cityChild:[],
      length:30,
      lengthTwo:150,
      basicForm: {},
      editable: false,
      imgVisible: false,
      imgVisible2: false,
      ruleBasicInfo:{
        companyId: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        companyName: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        contactPhone: [
          { required: true, message: '请输入', trigger: 'change' },
          { type: 'string', validator: checkPhone, message:'输入格式有误', trigger:'blur'},
        ],
        identifier: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        provinceID: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        contactAddress: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        businessScope: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        economicType: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        regCapital: [
          {required: true,type: 'number', message: '请输入', trigger: 'change'}
        ],
        legalName: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        legalPhone: [
          { required: true, message: '请输入', trigger: 'change' },
          { type: 'string',validator: checkPhone, message:'输入格式有误', trigger:'blur'},
        ],
        legalId: [
          { required: true, message: '请输入', trigger: 'change' },
          { type: 'string',pattern:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message:'输入格式有误', trigger:'blur'},
        ],
        legalJpgPhoto: [
          { required: true, message: '请上传', trigger: 'changge' }
        ],
        responsible: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        responsibleWay: [
          { required: true, message: '请输入', trigger: 'change' },
          { type: 'string', validator: checkPhone, message:'输入格式有误', trigger:'blur'},
        ]
      },
      showProgress:false,
      upPercent:0
    };
  },
  mounted() {

  },
  methods: {
    changeProvince(item) {
      this.cityChild=item.citys;
      this.basicForm.address=item.citys[0].cityID;
    },
    handleEdit() {
      this.basicForm = JSON.parse(JSON.stringify(this.basicInfo))
      for(var i=0;i<this.cityList.length;i++){
        if(this.cityList[i].provinceID==this.basicForm.provinceID){
          this.cityChild=this.cityList[i].citys;
          break;
        }
      }
      this.editable = true;
    },
    handleSave(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          editBasicInfo(this.basicForm).then(res => {
            if(res.data.success){
              this.$emit('on-editBasic',"success");
              this.editable = false;
              this.$Message.success('保存成功');
            }
          }).catch(err => {
            this.$Message.error(res.msg);
          })
        } else {
          this.$Message.error('保存失败!');
        }
      })
    },
    handleSuccess(res,file) {
      this.upPercent = 100;
      clearInterval(timer);
      this.showProgress = false;
      if(res.success){
        this.$Message.success('上传成功！')
        this.basicForm.legalJpgPhoto = res.data.picUrl
      }else{
        this.$Message.error(res.errorMsg)
      }
    },
    handleMaxSize(file) {
      clearInterval(timer)
      this.showProgress = false
      this.$Notice.warning({
        title: '上传失败',
        desc: '文件  ' + file.name + ' 不可超过200kb'
      });
    },
    handleFormatError(file) {
      clearInterval(timer)
      this.showProgress = false
      this.$Notice.warning({
        title: '文件类型不正确',
        desc: '文件  ' + file.name + ' 类型错误，请上传jpg格式的图片'
      });
    },
    beforeUpHandle(res, file) {
      this.upPercent = 0;
      this.showProgress = true;
      timer = setInterval(()=> {
          if (this.upPercent < 70) {
            this.upPercent = this.upPercent + parseInt(Math.random()*10)
          } else {
            clearInterval(timer);
          }
      }, 200)
    },
    handleView() {
      this.imgVisible = true;
    },
    handleView2() {
      this.imgVisible2 = true;
    },
    handleRemove() {
      this.basicForm.legalJpgPhoto='';
    }
  }
};
</script>
<style  lang="less" scoped>
.demo-upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
  img {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}
.demo-upload-list-cover{
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,.6);
}
.demo-upload-list:hover .demo-upload-list-cover{
  display: block;
}
.demo-upload-list-cover i{
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>


