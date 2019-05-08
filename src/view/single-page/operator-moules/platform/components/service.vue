<template>
  <div style="margin-top:20px">
    <Form ref="serviceForm" :model="serviceForm" :rules="ruleServiceInfo" :label-width="126">
      <Row>
        <Col span="9">
          <FormItem label="服务机构名称" prop="serviceName">
            <span v-if="!editable">{{serviceInfo.serviceName}}</span>
            <Input v-if="editable" v-model="serviceForm.serviceName" placeholder="请输入" :maxlength="length"></Input>
          </FormItem>
        </Col>
        <Col span="2" style="text-align: center">&nbsp</Col>
        <Col span="9">
          <FormItem label="负责人联系电话" prop="responsiblePhone">
            <span v-if="!editable">{{serviceInfo.responsiblePhone}}</span>
            <Input v-if="editable" v-model="serviceForm.responsiblePhone"   :maxlength="length"  placeholder="请输入"></Input>
          </FormItem>
        </Col>
        <Col span="3">
          <Button 
            class="button" 
            type="primary" 
            v-if="!editable" 
            v-hasAuth="'platform-center-service-edit'"
            @click="handleEdit">编辑
          </Button>
          <Button class="button" type="success" v-if="editable" @click="handleSave('serviceForm')">保存</Button>
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="服务机构代码" prop="serviceNo">
            <span v-if="!editable">{{serviceInfo.serviceNo}}</span>
            <Input v-if="editable" v-model="serviceForm.serviceNo" placeholder="请输入" :maxlength="length"></Input>
          </FormItem>
        </Col>
        <Col span="2" style="text-align: center">&nbsp</Col>
        <Col span="9">
          <FormItem label="管理员姓名" prop="managerName">
            <span v-if="!editable">{{serviceInfo.managerName}}</span>
            <Input v-if="editable" v-model="serviceForm.managerName" placeholder="请输入" :maxlength="length"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="所在地的行政区(省)" prop="provinceID">
            <span v-if="!editable">{{serviceInfo.provinceName}}</span>
            <Select v-model="serviceForm.provinceID" placeholder="请选择" v-if="editable">
              <Option v-for="(item,index) in cityList" :value="item.provinceID" :key="index" @click.native='changeProvince(item)'>{{item.province}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="2" style="text-align: center">&nbsp</Col>
        <Col span="9">
          <FormItem label="管理员联系电话" prop="managerPhone">
            <span v-if="!editable">{{serviceInfo.managerPhone}}</span>
            <Input v-if="editable" v-model="serviceForm.managerPhone" placeholder="请输入"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="所在地的行政区(市)" prop="address">
            <span v-if="!editable">{{serviceInfo.city}}</span>
            <Select v-model="serviceForm.address" placeholder="请选择" v-if="editable">
              <Option v-for="(item,index) in cityChild" :key="index" :value="item.cityID">{{item.city}}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="2" style="text-align: center">&nbsp</Col>
        <Col span="9">
          <FormItem label="行政文书送达地址" prop="mailAddress">
            <span v-if="!editable">{{serviceInfo.mailAddress}}</span>
            <Input v-if="editable" v-model="serviceForm.mailAddress" placeholder="请输入" :maxlength="length"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="成立时间" prop="Date">
            <span v-if="!editable">{{serviceInfo.createDate}}</span>
             <DatePicker v-model="serviceForm.Date" format="yyyy-MM-dd" v-if="editable" type="date" placeholder="请选择"></DatePicker>
          </FormItem>
        </Col>
        <Col span="2" style="text-align: center">&nbsp</Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="联系电话" prop="contactPhone">
            <span v-if="!editable">{{serviceInfo.contactPhone}}</span>
            <Input v-if="editable" v-model="serviceForm.contactPhone" placeholder="请输入"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="联系地址" prop="detailAddress">
            <span v-if="!editable">{{serviceInfo.detailAddress}}</span>
            <Input v-if="editable" v-model="serviceForm.detailAddress" placeholder="请输入" :maxlength="length"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="负责人姓名" prop="responsibleName">
            <span v-if="!editable">{{serviceInfo.responsibleName}}</span>
            <Input v-if="editable" v-model="serviceForm.responsibleName" placeholder="请输入" :maxlength="length"></Input>
          </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>

<script>
import {editServiceInfo} from "@/api/configData.js";
import { regTest } from '@/libs/tools'

export default {
  props: {
    cityList: {
      type:Array,
      default:[]
    },
    serviceInfo:Object
  },
  data() {
    const checkPhone = (rule, value, callback) => {
      if(regTest(value, 'phone&mobile')) callback()
      else callback(new Error('输入格式有误'))
    }
    return {
      length:32,
      lengthTwo:120,
      cityChild:[],
      serviceForm: {},
      ruleServiceInfo:{
        serviceName: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        serviceNo: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        provinceID: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        Date: [
          { required: true,type: 'date', message: '请选择', trigger: 'change' }
        ],
        contactPhone: [
          { required: true, message: '请输入', trigger: 'change' },
          { type: 'string',validator: checkPhone, message:'输入格式有误', trigger:'blur'},
        ],
        detailAddress: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        responsibleName: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        responsiblePhone: [
          { required: true, message: '请输入', trigger: 'change' },
          { type: 'string',validator: checkPhone, message:'输入格式有误', trigger:'blur'},
        ],
        managerName: [
          { required: true, message: '请输入', trigger: 'change' }
        ],
        managerPhone: [
          { required: true, message: '请输入', trigger: 'change' },
          { type: 'string',validator: checkPhone, message:'输入格式有误', trigger:'blur'},
        ],
        mailAddress: [
          { required: true, message: '请输入', trigger: 'change' }
        ]
      },
      editable: false
    };
  },
  methods:{
    changeProvince(item) {
      this.cityChild=item.citys;
      this.serviceForm.address=item.citys[0].cityID;
    },
    handleEdit() {
      this.serviceForm  = JSON.parse(JSON.stringify(this.serviceInfo))
      for(var i=0;i<this.cityList.length;i++){
        if(this.cityList[i].provinceID==this.serviceForm.provinceID){
          this.cityChild=this.cityList[i].citys;
          break;
        }
      }
      this.editable = true;
    },
    handleSave(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.serviceForm.createDate=Date.parse(this.serviceForm.Date);
          editServiceInfo(this.serviceForm).then(res => {
            if(res.data.success){
              this.$Message.success('保存成功');
              this.editable = false;
              this.$emit('on-editService','success');
          }
          }).catch(err => {
            this.$Message.error('保存失败!');
          })


        } else {
          this.$Message.error('保存失败!');
        }
      })
    },
  }
};
</script>
