<template>
  <div style="margin-top:20px">
    <Form ref="licenseForm" :model="licenseForm" :label-width="126" :rules="ruleLicenseInfo">
      <Row>
        <Col span="9">
          <FormItem label="许可地行政区(省):" prop="provinceID">
            <span v-if="!editable">{{licenseInfo.provinceName}}</span>
            <Select v-model="licenseForm.provinceID" placeholder="请选择" v-if="editable">
              <Option v-for="(item,index) in cityList" :value="item.provinceID" :key="index" @click.native='changeProvince(item)'>{{item.province}}</Option>
            </Select>
            </Select>
          </FormItem>
        </Col>
        <Col span="2" style="text-align: center">&nbsp</Col>
        <Col span="9">
          <FormItem label="是否有效:" prop="state">
            <span v-if="!editable && licenseInfo.state=='1'">是</span>
            <span v-if="!editable && licenseInfo.state=='2'">否</span>
            <RadioGroup v-if="editable" v-model="licenseForm.state">
              <Radio label="1"><span>是</span></Radio>
              <Radio label="2">否</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
        <Col span="3">
          <Button 
            class="button" 
            type="primary" 
            v-if="!editable" 
            v-hasAuth="'platform-center-permit-edit'"
            @click="handleEdit">编辑
          </Button>
          <Button class="button" type="success" v-if="editable" @click="handleSave('licenseForm')">保存</Button>
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="许可地行政区(市):" prop="address">
            <span v-if="!editable">{{licenseInfo.city}}</span>
            <Select v-model="licenseForm.address" placeholder="请选择" v-if="editable">
              <Option v-for="(item,index) in cityChild" :key="index" :value="item.cityID">{{item.city}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="2" style="text-align: center">&nbsp</Col>
        <Col span="9">
        <FormItem label="网络经营许可证号:" prop="certificate">
          <span v-if="!editable">{{licenseInfo.certificate}}</span>
          <Input v-if="editable" v-model="licenseForm.certificate" placeholder="请输入" :maxlength="length"></Input>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9">
        <FormItem label="业户名称:" prop="merchantName">
          <span v-if="!editable">{{licenseInfo.merchantName}}</span>
          <Input v-if="editable" v-model="licenseForm.merchantName" placeholder="请输入" :maxlength="length"></Input>
        </FormItem>
        </Col>
        <Col span="2" style="text-align: center">&nbsp</Col>
        <Col span="9">
        <FormItem label="发证机构:" prop="organization">
          <span v-if="!editable">{{licenseInfo.organization}}</span>
          <Input v-if="editable" v-model="licenseForm.organization" placeholder="请输入" :maxlength="length"></Input>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9" v-if="editable">
        <FormItem label="经营范围:" prop="operationArea">
          <Input v-if="editable" type="textarea" v-model="licenseForm.operationArea" placeholder="请输入" :maxlength="lengthTwo"></Input>
        </FormItem>
        </Col>
        <Col span="20" v-if="!editable">
          <FormItem label="经营范围:" prop="operationArea">
            <span v-if="!editable">{{licenseInfo.operationArea}}</span>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9">
        <FormItem label="初次发证日期:" prop="certify">
          <span v-if="!editable">{{licenseInfo.certifyDate}}</span>
          <DatePicker v-if="editable" v-model="licenseForm.certify" type="date" placeholder="请选择"></DatePicker>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="有效期起:" prop="start">
            <span v-if="!editable">{{licenseInfo.startDate}}</span>
            <DatePicker v-if="editable" v-model="licenseForm.start" type="date" placeholder="请选择"></DatePicker>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="有效期止:" prop="stop">
            <span v-if="!editable">{{licenseInfo.stopDate}}</span>
            <DatePicker v-if="editable" v-model="licenseForm.stop" type="date" placeholder="请选择"></DatePicker>
          </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>
<script>
  import {editLicenseInfo} from "@/api/configData.js";
export default {
  props: {
    cityList: {
      type:Array,
      default:[]
    },
    licenseInfo:Object
  },
  data() {
    const validateStart = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入'));
      } else {
        if (this.licenseForm.stop !== '') {
          // 对第二个密码框单独验证
          this.$refs.licenseForm.validateField('stop');
        }
        callback();
      }
    }
    const validateEnd= (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入'));
      } else if (Date.parse(value) < Date.parse(this.licenseForm.start)) {
        callback(new Error('有效期止不能小于有效期起'));
      } else {
        callback();
      }
    }
    return {
      length:20,
      lengthTwo:150,
      cityChild:[],
      licenseForm: {},
      ruleLicenseInfo: {
        provinceID: [
          {required: true, message: '请选择', trigger: 'change'}
        ],
        address: [
          {required: true, message: '请选择', trigger: 'change'}
        ],
        certificate: [
          {required: true, message: '请输入', trigger: 'change'}
        ],
        operationArea: [
          {required: true, message: '请输入', trigger: 'change'}
        ],
        merchantName: [
          {required: true, message: '请输入', trigger: 'change'}
        ],
        organization: [
          {required: true, message: '请输入', trigger: 'change'}
        ],
        certify: [
          {required: true, type:'date', message: '请选择', trigger: 'change'}
        ],
        start: [
          {required: true, validator: validateStart, trigger: 'change'}
        ],
        stop: [
          {required: true, validator: validateEnd, trigger: 'change'}
        ],
        state: [
          {required: true, message: '请输入', trigger: 'change'}
        ],
      },
      editable: false
    };
  },
  methods: {
    changeProvince(item) {
      this.cityChild=item.citys;
      this.licenseForm.address=item.citys[0].cityID;
    },
    handleEdit() {
      this.licenseForm  = JSON.parse(JSON.stringify(this.licenseInfo))
      for(var i=0;i<this.cityList.length;i++){
        if(this.cityList[i].provinceID==this.licenseForm.provinceID){
          this.cityChild=this.cityList[i].citys;
          break;
        }
      }
      this.editable = true;
    },
    handleSave(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.licenseForm.stopDate=Date.parse(this.licenseForm.stop);
          this.licenseForm.certifyDate=Date.parse(this.licenseForm.certify);
          this.licenseForm.startDate=Date.parse(this.licenseForm.start);
          editLicenseInfo(this.licenseForm).then(res => {
            if(res.data.success){
              this.$Message.success('保存成功');
              this.$emit('on-editLicense','success');
              this.editable = false;
            }
          }).catch(err => {
            this.$Message.error('保存失败!');
          })
        } else {
          this.$Message.error('信息有误或未填写完整');
        }
      })
    }
  }
};
</script>
