<template>
<div class="cardbox top20" id='hardware_info' >
    <Card style="width:100%">
        <p slot="title">硬件信息</p>
        <div slot="extra"> 
            <span class="likeA"  v-if="!editable" @click="editAction">编辑</span>
            <span class="likeA" v-if="!closed" style="margin-left:10px" @click="closeAction(true)">收起 </span>
            <span class="likeA" v-if="closed" style="margin-left:10px" @click="closeAction(false)">展开 </span>
        </div>
        <div v-if="!closed">
            <Form :label-width="100" :model="hardwareForm" :rules="ruleValidate" ref="hardwareForm">
                <div style="padding-bottom:10px">ADAS</div>
                <FormItem label='厂商:' prop="adasManufacturer">
                    <Row>
                         <Col span="5">
                              <Input v-model="hardwareForm.adasManufacturer" placeholder="请输入"  />
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='采购时间:' v-if="hardwareForm.adasManufacturer" prop="adasPurchaseTime">
                    <Row>
                         <Col span="5">
                            <DatePicker v-bind:disabled='!editable' type="date" placeholder="请选择日期" format="yyyy-MM-dd" v-model="hardwareForm.adasPurchaseTime"></DatePicker>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='安装时间:' v-if="hardwareForm.adasManufacturer" prop="adasInstallTime">
                    <Row>
                         <Col span="5">
                            <DatePicker v-bind:disabled='!editable' type="date" placeholder="请选择日期"  format="yyyy-MM-dd" v-model="hardwareForm.adasInstallTime" ></DatePicker>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='设备编号:' v-if="hardwareForm.adasManufacturer" prop="adasDeviceNumber">
                    <Row>
                         <Col span="5">
                            <Input  v-bind:disabled='!editable' v-model="hardwareForm.adasDeviceNumber" ></Input>
                        </Col>
                    </Row>
                </FormItem>
                <div style="padding-bottom:10px">摄像头信息</div>
                <FormItem label='厂商:' prop ='cameraManufacturer'>
                    <Row>
                         <Col span="5">
                            <Input v-model="hardwareForm.cameraManufacturer" placeholder="请输入"  />
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='采购时间:' prop ='cameraPurchaseTime'>
                    <Row>
                         <Col span="5">
                            <DatePicker v-bind:disabled='!editable' type="date" placeholder="请选择日期"  v-model="hardwareForm.cameraPurchaseTime"></DatePicker>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='安装时间:'  prop ='cameraInstallTime'>
                    <Row>
                         <Col span="5">
                            <DatePicker v-bind:disabled='!editable' type="date" placeholder="请选择日期" v-model="hardwareForm.cameraInstallTime" ></DatePicker>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='设备编号:'  prop ='cameraDeviceNumber' >
                    <Row>
                         <Col span="5">
                            <Input  v-bind:disabled='!editable' v-model="hardwareForm.cameraDeviceNumber" ></Input>
                        </Col>
                    </Row>
                </FormItem>
                <div style="padding-bottom:10px">T-BOX信息</div>
                <FormItem label='厂商:'  prop ='tBoxManufacturer' >
                    <Row>
                         <Col span="5">
                           <Input v-model="hardwareForm.tBoxManufacturer" placeholder="请输入"  />
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='采购时间:' prop ='tBoxPurchaseTime'>
                    <Row>
                         <Col span="5">
                            <DatePicker v-bind:disabled='!editable' type="date" placeholder="请选择日期" v-model="hardwareForm.tBoxPurchaseTime"></DatePicker>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='安装时间:' prop ='tBoxInstallTime'>
                    <Row>
                         <Col span="5">
                            <DatePicker v-bind:disabled='!editable' type="date" placeholder="请选择日期" v-model="hardwareForm.tBoxInstallTime" ></DatePicker>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='设备编号:'  prop ='tBoxDeviceNumber' >
                    <Row>
                         <Col span="5">
                            <Input  v-bind:disabled='!editable' v-model="hardwareForm.tBoxDeviceNumber" ></Input>
                        </Col>
                    </Row>
                </FormItem>
                  
                <Button type="primary" v-show="editable" @click="SaveAction('hardwareForm')">保存</Button>
            </Form>
        </div>
        <div v-if="closed">...</div>
    </Card>
</div>
</template>
<script>
import { saveHardwareInfo } from '@/api/vehicle.js'
export default {
    name:'hardware_info',
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
             this.hardwareForm = JSON.parse(JSON.stringify(this.infoData))
        }
    },
    data () {
        const validateNNull = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('不能为空'));
                }
                    callback();
                }
        return {
            closed:false,
            editable:true,
            hardwareForm:{},
            ruleValidate:{
                adasManufacturer: [
                        { required: true, message: '请填写', validator: validateNNull,  trigger: 'blur' }
                    ],
                adasPurchaseTime: [
                        { required: true, message: '请填写',  validator: validateNNull,  trigger: 'blur' }
                    ],
                adasInstallTime: [
                        { required: true, message: '请填写',  validator: validateNNull,  trigger: 'blur' }
                    ],
                adasDeviceNumber: [
                        { required: true, message: '请填写', validator: validateNNull,  trigger: 'blur' }
                    ],
                cameraManufacturer: [
                        { required: true, message: '请填写',validator: validateNNull,   trigger: 'blur' }
                    ],
                cameraPurchaseTime: [
                        { required: true, message: '请填写',validator: validateNNull,   trigger: 'blur' }
                    ],
                cameraInstallTime: [
                        { required: true, message: '请填写', validator: validateNNull,  trigger: 'blur' }
                    ],
                cameraDeviceNumber: [
                        { required: true, message: '请填写',validator: validateNNull,   trigger: 'blur' }
                    ],
                tBoxManufacturer: [
                        { required: true, message: '请填写', validator: validateNNull,  trigger: 'blur' }
                    ],
                tBoxPurchaseTime: [
                        { required: true, message: '请填写',validator: validateNNull,   trigger: 'blur' }
                    ],
                tBoxInstallTime: [
                        { required: true, message: '请填写',validator: validateNNull,   trigger: 'blur' }
                    ],
                tBoxDeviceNumber: [
                        { required: true, message: '请填写',validator: validateNNull,   trigger: 'blur' }
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
                        uuid : this.hardwareForm.uuid,
                        userUuid : this.$store.state.user.userId,
                        adasManufacturer: this.hardwareForm.adasManufacturer,
                        adasPurchaseTime:  this.$moment(this.hardwareForm.adasPurchaseTime).format('YYYY-MM-DD'),
                        adasInstallTime:  this.$moment(this.hardwareForm.adasInstallTime).format('YYYY-MM-DD'),
                        adasDeviceNumber: this.hardwareForm.adasDeviceNumber,
                        cameraManufacturer: this.hardwareForm.cameraManufacturer,
                        cameraPurchaseTime:  this.$moment(this.hardwareForm.cameraPurchaseTime).format('YYYY-MM-DD'),
                        cameraInstallTime:  this.$moment(this.hardwareForm.cameraInstallTime).format('YYYY-MM-DD'),
                        cameraDeviceNumber: this.hardwareForm.cameraDeviceNumber,
                        tBoxManufacturer: this.hardwareForm.tBoxManufacturer,
                        tBoxPurchaseTime:  this.$moment(this.hardwareForm.tBoxPurchaseTime).format('YYYY-MM-DD'),
                        tBoxInstallTime:  this.$moment(this.hardwareForm.tBoxInstallTime).format('YYYY-MM-DD'),
                        tBoxDeviceNumber: this.hardwareForm.tBoxDeviceNumber,
                    }
                    if (valid) {
                        saveHardwareInfo(data).then(res =>{
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