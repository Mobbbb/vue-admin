<template>
  <div style="margin-top:20px">
    <Form ref="payForm" :model="payForm" :label-width="126" :rules="rulePayInfo">
      <Row>
        <Col span="9">
          <FormItem label="是否有效:" prop="state">
            <span v-if="!editable && payInfo.state=='0'">是</span>
            <span v-if="!editable && payInfo.state=='1'">否</span>
            <RadioGroup v-if="editable" v-model="payForm.state">
              <Radio label="0"><span>是</span></Radio>
              <Radio label="1"><span>否</span></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
        <Col span="11" style="text-align: center">&nbsp</Col>
        <Col span="3">
          <Button 
            class="button" 
            type="primary" 
            v-if="!editable" 
            v-hasAuth="'platform-center-pay-edit'"
            @click="handleEdit">编辑
          </Button>
          <Button class="button" type="success" v-if="editable" @click="handleSave('payForm')">保存</Button>
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="支付机构名称:" prop="payName">
            <span v-if="!editable">{{payInfo.payName}}</span>
            <Input v-if="editable" placeholder="请输入" v-model="payForm.payName" :maxlength="length"></Input>
          </FormItem>
        </Col>
        <Col span="9">
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="业务许可证:" prop="payId">
            <span v-if="!editable">{{payInfo.payId}}</span>
            <Input v-if="editable" placeholder="请输入" v-model="payForm.payId" :maxlength="length"></Input>
          </FormItem>
        </Col>
        <Col span="9">
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="支付业务类型:" prop="payType">
            <span v-if="!editable">{{payInfo.payType}}</span>
            <Input v-if="editable" placeholder="请输入" v-model="payForm.payType" :maxlength="lengthTwo"></Input>
          </FormItem>
        </Col>
        <Col span="9">
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="业务覆盖范围:" prop="payScope">
            <span v-if="!editable">{{payInfo.payScope}}</span>
            <Input v-if="editable" placeholder="请输入" v-model="payForm.payScope" :maxlength="lengthTwo"></Input>
          </FormItem>
        </Col>
        <Col span="9">
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="备存金存管银行:" prop="prepareBank">
            <span v-if="!editable">{{payInfo.prepareBank}}</span>
            <Input v-if="editable" placeholder="请输入" v-model="payForm.prepareBank" :maxlength="length"></Input>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9">
        <FormItem label="企业订单结算起止:" prop="accountDate">
          <span v-if="!editable">{{payInfo.accountBeginDate}}日-{{payInfo.accountEndDate}}日</span>
          <div v-if="editable" style="text-align: center;display: block;width: 100%;height: 30px">
            <Select v-model="payForm.accountBeginDate" style="width: 45%;float: left">
              <Option v-for="item in dataList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            -
            <Select v-model="payForm.accountEndDate" style="width: 45%;float: right">
              <Option v-for="item in dataList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
        </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="结算周期（天）:" prop="countDate">
            <span v-if="!editable">{{payInfo.countDate}}</span>
            <InputNumber  v-if="editable" v-model="payForm.countDate" placeholder="请输入"  :max="999999999999999" :min="0"></InputNumber >
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="9">
          <FormItem label="结算类型:" prop="settlementType">
            <span v-if="!editable && payInfo.settlementType=='1'">银行</span>
            <span v-if="!editable && payInfo.settlementType=='2'">非银行</span>
            <RadioGroup v-if="editable" v-model="payForm.settlementType">
              <Radio label="1"><span>银行</span></Radio>
              <Radio label="2"><span>非银行</span></Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
    </Form>
  </div>
</template>
<script>
  import {editPayInfo} from "@/api/configData.js";
export default {
  props: {
    payInfo:Object
  },
  data() {
    const AccountDate= (rule, value, callback) => {
      if (this.payForm.accountBeginDate=== '' || this.payForm.accountEndDate==='') {
        callback(new Error('请输入'));
      } else if (this.payForm.accountEndDate < this.payForm.accountBeginDate) {
        callback(new Error('企业订单结算止不能小于企业订单结算起'));
      } else {
        callback();
      }
    }
    return {
      length:32,
      lengthTwo:120,
      payForm: {},
      dataList: [],
      rulePayInfo: {
        state: [
          {required: true, message: '请输入', trigger: 'change'}
        ],
        payName: [
          {required: true, message: '请输入', trigger: 'change'}
        ],
        payId: [
          {required: true, message: '请输入', trigger: 'change'}
        ],
        payType: [
          {required: true, message: '请输入', trigger: 'change'}
        ],
        payScope: [
          {required: true, message: '请输入', trigger: 'change'}
        ],
        prepareBank: [
          {required: true, message: '请输入', trigger: 'change'}
        ],
        countDate: [
          {required: true,type: 'number', message: '请输入', trigger: 'change'}
        ],
        settlementType: [
          {required: true, message: '请选择', trigger: 'change'}
        ],
        accountDate: [
          {validator: AccountDate, trigger: 'change'}
        ]
      },
      editable: false
    };
  },
  mounted() {
    let dataLabel,dataValue;
    let dataBox={};
    for(var i=1;i<32;i++){
      dataLabel=i+'日';
      dataValue=i;
      dataBox={
        value:dataValue.toString(),
        label:dataLabel
      }
      this.dataList.push(dataBox);
    }
  },
  methods: {
    handleEdit() {
      this.payForm  = JSON.parse(JSON.stringify(this.payInfo))
      this.editable = true;
    },
    handleSave(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.payForm.settlementType=parseInt(this.payForm.settlementType);
          this.payForm.state=parseInt(this.payForm.state);
          editPayInfo(this.payForm).then(res => {
            if(res.data.success){
              this.$Message.success('保存成功');
              this.editable = false;
              this.$emit('on-editPay','success');
            }
          }).catch(err => {
            this.$Message.error(res.msg);
          })
        } else {
          this.$Message.error('修改失败');
        }
      })
//      this.editable = false;
    }
  }
};
</script>
<style>
  .ivu-input-number-input{
    float: left;
  }
</style>
