<template>
<div class="cardbox " id='operator_info' style="margin-top:20px" >
    <Card style="width:100%">
        <p slot="title">运营商信息</p>
        <div slot="extra"> 
            <span class="likeA"  v-if="!editable" @click="editAction">编辑</span>
            <span class="likeA" v-if="!closed" style="margin-left:10px" @click="closeAction(true)">收起 </span>
            <span class="likeA" v-if="closed" style="margin-left:10px" @click="closeAction(false)">展开 </span>
        </div>
        <div v-if="!closed">
            <Form :label-width="100" :model="operatorForm" :rules="ruleValidate" ref="operatorForm">
                <FormItem label='所属产品线:'  prop='businessType'>
                    <Row>
                         <Col span="5">
                         <input type="hidden" v-model="operatorForm.businessType">
                            <Select v-model="operatorForm.businessType" placeholder="请选择" v-bind:disabled='!editable'>
                                <Option :value= 1 >出租车</Option>
                                <Option :value= 2 >专车</Option>
                                <Option :value= 3 >跨城</Option>
                                <Option :value= 4 >快车</Option>
                            </Select>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='车辆所有者:'  prop='carOwner'>
                    <Row>
                         <Col span="5">
                            <Input v-model="operatorForm.carOwner"> </Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='所属运营区:'>
                    <Row>
                         <Col span="6">
                            <Cascader
                                trigger="hover"
                                placeholder="请选择运营商"
                                v-model="operatorForm.operatingArea"
                                :disabled='!editable'
                                :data="cityOpOriList"
                                :change-on-select='false'>
                            </Cascader>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='所属运营商:'>
                    <Row>
                         <Col span="5">
                            <Input v-model="operatorForm.operator"  disabled > </Input>
                            <Select v-model="operatorForm.operator" placeholder="请选择" v-bind:disabled='!editable'>
                                 <Option v-for="operator in operators"  :value="operator.uuid" :key="operator.uuid">{{operator.title}}</Option>
                            </Select>
                        </Col>
                    </Row>
                </FormItem>
                
                <FormItem label='网约车运输证号:'>
                    <Row>
                         <Col span="5">
                            <Input  v-bind:disabled='!editable'  v-model="operatorForm.onlineCarTransportationLicense"></Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='发证机构:'>
                    <Row>
                         <Col span="5">
                            <Input  v-bind:disabled='!editable' v-model="operatorForm.certifyingAuthority"></Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='有效日期起:'>
                    <Row>
                         <Col span="5">
                            <DatePicker v-bind:disabled='!editable' type="date" placeholder="请选择日期" v-model="operatorForm.validityStart" ></DatePicker>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='有效日期止:'>
                    <Row>
                         <Col span="5">
                            <DatePicker v-bind:disabled='!editable' type="date" placeholder="请选择日期" v-model="operatorForm.validityEnd" ></DatePicker>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='登记日期:'>
                    <Row>
                         <Col span="5">
                            <DatePicker v-bind:disabled='!editable' type="date" placeholder="请选择日期" v-model="operatorForm.recordDate" ></DatePicker>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='报备日期:'>
                    <Row>
                         <Col span="5">
                            <DatePicker v-bind:disabled='!editable' type="date" placeholder="请选择日期" v-model="operatorForm.reportDate"  ></DatePicker>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='服务类型:'>
                    <Row>
                         <Col span="5">
                            <Select v-model="operatorForm.serviceType" placeholder="请选择" v-bind:disabled='!editable'>
                                <Option value="巡游出租车">巡游出租车</Option>
                                <Option value="网络预约出租车">网络预约出租车</Option>
                                <Option value="私人小客车合乘">私人小客车合乘</Option>
                            </Select>
                        </Col>
                    </Row>
                </FormItem>
                
                <Button type="primary" v-show="editable" @click="SaveAction ('operatorForm')">保存</Button>
            </Form>
        </div>
        <div v-if="closed">...</div>
    </Card>
</div>
</template>

<script>
import { saveOperationInfo } from '@/api/vehicle.js'

export default {
    name:'operator_info',
    props:{
        infoData:{
            type: Object,
            default: () =>{
                return {}
            }
        }
    },
    watch:{
        'infoData': function(){
            this.operatorForm = JSON.parse(JSON.stringify(this.infoData))
        }
    },
    mounted (){
        this.getOpList()
    },
    data () {
        const validateNN = (rule, value, callback) => {
            if (value === '') callback(new Error('不能为空'));
            else callback();
        }   
          
        return {
            closed:false,
            editable:true,
            operatorForm: {
                businessType: ''
            },
            cityOpOriList: [],
            operators:[],
            ruleValidate: {
                carOwner: [
                    { required: true, message: '请填写',  trigger: 'blur' }
                ],
                businessType: [
                    { validator: validateNN, trigger: 'change' }
                ],
            }
        }
    },
    mounted(){
        this.cityOpOriList = JSON.parse(localStorage.getItem('pcOperatorList')) // 获取运营商信息
    },
    methods:{
        closeAction(val) {
            this.closed = val
        },
        handleSeletedCity(item){
            this.operators = item.children
        },
        SaveAction(name){
            let data = {
                uuid : this.operatorForm.uuid,
                userUuid : this.$store.state.user.userId,
                carOwner: this.operatorForm.carOwner,
                businessType: this.operatorForm.businessType,
                operator: this.operatorForm.operator,
                operatingArea: this.operatorForm.operatingArea,
                onlineCarTransportationLicense: this.operatorForm.onlineCarTransportationLicense,
                certifyingAuthority: this.operatorForm.certifyingAuthority,
                validityStart: this.$moment(this.operatorForm.validityStart).format('YYYY-MM-DD hh:mm:ss'),
                validityEnd:  this.$moment(this.operatorForm.validityEnd).format('YYYY-MM-DD hh:mm:ss') ,
                recordDate:  this.$moment( this.operatorForm.recordDate).format('YYYY-MM-DD hh:mm:ss'),
                reportDate:  this.$moment(this.operatorForm.reportDate).format('YYYY-MM-DD hh:mm:ss') ,
                serviceType: this.operatorForm.serviceType
            }
            this.$refs[name].validate((valid) => {
                if (valid) {
                    saveOperationInfo(data).then(res =>{
                        if(res.data.success){
                            this.$Message.success('保存成功!')
                            this.$emit('getInfo')
                            this.editable = false
                        }
                    })
                    
                } else {
                    this.$Message.error('表单验证有误!');
                }
            })
        },
        editAction(){
            this.editable = true
        }
    }
}
</script>

<style lang="less">
.cardbox{
    .likeA{
        color: #1890FF;
        cursor: pointer;
    }
}
</style>
