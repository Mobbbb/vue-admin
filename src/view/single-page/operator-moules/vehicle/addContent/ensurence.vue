<template>
<div class="cardbox top20 " id='ensurence_info' >
    <Card style="width:100%">
        <p slot="title">保险信息</p>
        <div slot="extra"> 
            <span class="likeA"  v-if="!editable" @click="editAction">编辑</span>
            <span class="likeA" v-if="!closed" style="margin-left:10px" @click="closeAction(true)">收起 </span>
            <span class="likeA" v-if="closed" style="margin-left:10px" @click="closeAction(false)">展开 </span>
        </div>
        <div v-if="!closed">
            <Form :label-width="100" :model="insuranceForm" :rules="ruleValidate" ref="insuranceForm">
                <FormItem label='保险公司:' prop= "insuranceCompany">
                    <Row>
                         <Col span="5">
                            <Input  v-bind:disabled='!editable'  v-model="insuranceForm.insuranceCompany"></Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='保险号:'  prop= "insuranceNumber">
                    <Row>
                         <Col span="5">
                            <Input  v-bind:disabled='!editable'  v-model="insuranceForm.insuranceNumber" ></Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='保险类型:' prop= "insuranceType">
                    <Row>
                         <Col span="5">
                            <Input  v-bind:disabled='!editable' v-model="insuranceForm.insuranceType"></Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='保险金额:' prop= "insuranceAmount">
                    <Row>
                         <Col span="5">
                            <Input  v-bind:disabled='!editable'  v-model="insuranceForm.insuranceAmount">
                            <span slot="append">元</span>
                            </Input>
                            
                        </Col>
                    </Row>
                </FormItem>
                 <FormItem label='赔付金额:' prop= "compensationAmount">
                    <Row>
                         <Col span="5">
                            <Input  v-bind:disabled='!editable'  v-model="insuranceForm.compensationAmount">
                            <span slot="append">元</span>
                            </Input>
                            
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='保险有效期起:' prop= "insuranceStart">
                    <Row>
                         <Col span="5">
                             <DatePicker v-bind:disabled='!editable' type="date" placeholder="请选择日期" v-model="insuranceForm.insuranceStart" ></DatePicker>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='保险有效期止:' prop= "insuranceEnd">
                    <Row>
                         <Col span="5">
                         <input type="hidden" v-model="insuranceForm.insuranceEnd">
                             <DatePicker v-bind:disabled='!editable' type="date" placeholder="请选择日期" v-model="insuranceForm.insuranceEnd"></DatePicker>
                        </Col>
                    </Row>
                </FormItem>
                
                <Button type="primary" v-show="editable" @click="SaveAction('insuranceForm')">保存</Button>
            </Form>
        </div>
        <div v-if="closed">...</div>
    </Card>
</div>
</template>
<script>
import { saveInsuranceInfo } from '@/api/vehicle.js'
export default {
    name:'lisence_info',
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
             this.insuranceForm = JSON.parse(JSON.stringify(this.infoData))
        }
    },
    data () {
         const validateNN = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('不能为空'));
                }
                else if(value < 0){
                    callback(new Error('不能小于0'));
                }
                else if( !/^[0-9]+$/.test(value)){
                    callback(new Error('请输入数字'));
                }
                    callback();
                }
        const validateNNull = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('不能为空'));
                }
                    callback();
                }
        
        return {
            closed:false,
            editable:true,
            insuranceForm:{},
            ruleValidate: {
                 insuranceCompany: [
                        { required: true, message: '请填写',  trigger: 'blur' }
                    ],
                insuranceNumber: [
                        { required: true, message: '请填写',  trigger: 'blur' }
                    ],
                insuranceType: [
                        { required: true, message: '请填写',  trigger: 'blur' }
                    ],
                insuranceStart: [
                        { validator: validateNNull, trigger: 'blur' }
                    ],
                insuranceEnd: [
                        { validator: validateNNull,  trigger: 'blur' }
                    ],
                insuranceAmount: [
                        { validator: validateNN, trigger: 'blur' }
                    ],
                compensationAmount: [
                        { validator: validateNN, trigger: 'blur' }
                    ],
            }
        }
    },
    methods:{
        closeAction(val) {
        this.closed = val
        },
        SaveAction(name){
            this.$refs[name].validate((valid) => {
                    let data = {
                        uuid : this.insuranceForm.uuid,
                        userUuid : this.$store.state.user.userId,
                        insuranceCompany: this.insuranceForm.insuranceCompany,
                        insuranceNumber: this.insuranceForm.insuranceNumber,
                        insuranceType: this.insuranceForm.insuranceType,
                        insuranceAmount: this.insuranceForm.insuranceAmount,
                        compensationAmount: this.insuranceForm.compensationAmount,
                        insuranceStart: this.$moment(this.insuranceForm.insuranceStart).format('YYYY-MM-DD hh:mm:ss'),
                        insuranceEnd: this.$moment(this.insuranceForm.insuranceEnd).format('YYYY-MM-DD hh:mm:ss'),
                    }
                    if (valid) {
                        saveInsuranceInfo(data).then(res =>{
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
            // this.editable = false
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