<template>
<div class="cardbox top20" id='others_info' style="margin-bottom:30px" >
    <Card style="width:100%">
        <p slot="title">其他信息</p>
        <div slot="extra"> 
            <span class="likeA"  v-if="!editable" @click="editAction">编辑</span>
            <span class="likeA" v-if="!closed" style="margin-left:10px" @click="closeAction(true)">收起 </span>
            <span class="likeA" v-if="closed" style="margin-left:10px" @click="closeAction(false)">展开 </span>
        </div>
        <div v-if="!closed">
            <Form :label-width="150" :model="othersForm" ref="othersForm">
               
                <FormItem label='车辆检修状态:'>
                    <Row>
                         <Col span="5">
                            <Select v-model="othersForm.annualSurveyState" placeholder="请选择" v-bind:disabled='!editable'>
                                <Option :value="0"> 未检修</Option>
                                <Option :value="1"> 已检修</Option>
                                <Option :value="2"> 未知</Option>
                            </Select>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='下次年检时间:'>
                    <Row>
                         <Col span="5">
                             <DatePicker v-bind:disabled='!editable' type="date" placeholder="请选择日期" v-model="othersForm.nextAnnualSurveyDate" ></DatePicker>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='车辆年审状态:'>
                    <Row>
                         <Col span="5">
                            <Select v-model="othersForm.annualVerificateState" placeholder="请选择" v-bind:disabled='!editable'>
                                <Option :value="0">未年审</Option>
                                <Option :value="1">年审合格</Option>
                                <Option :value="2">年审不合格</Option>
                            </Select>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='发票打印序列号:'>
                    <Row>
                         <Col span="5">
                            <Input  v-bind:disabled='!editable' v-model="othersForm.invoiceSerialNumber" >
                            </Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='卫星定位装置品牌:'>
                    <Row>
                         <Col span="5">
                            <Input  v-bind:disabled='!editable' v-model="othersForm.satellitePositionDeviceBrand" >
                            </Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='卫星定位装置型号:'>
                    <Row>
                         <Col span="5">
                            <Input  v-bind:disabled='!editable' v-model="othersForm.satellitePositionDeviceType" >
                            </Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='卫星定位装置IMEI号:'>
                    <Row>
                         <Col span="5">
                            <Input  v-bind:disabled='!editable' v-model="othersForm.satellitePositionDeviceIMEI" >
                            </Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='下次年检时间:'>
                    <Row>
                         <Col span="5">
                             <DatePicker v-bind:disabled='!editable' type="date" placeholder="请选择日期" v-model="othersForm.satellitePositionDeviceInstallDate"></DatePicker>
                        </Col>
                    </Row>
                </FormItem>
                
                <Button type="primary" v-show="editable" @click="SaveAction">保存</Button>
            </Form>
        </div>
        <div v-if="closed">...</div>
    </Card>
</div>
</template>
<script>
import { saveOtherInfo } from '@/api/vehicle.js'
export default {
    name:'others_info',
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
             this.othersForm = JSON.parse(JSON.stringify(this.infoData))
        }
    },
    data () {
        return {
            closed:false,
            editable:true,
            othersForm:{}
        }
    },
    methods:{
        closeAction(val) {
        this.closed = val
        },
        SaveAction(){
             let data = {
                        uuid : this.othersForm.uuid,
                        userUuid : this.$store.state.user.userId,
                        annualSurveyState: Number(this.othersForm.annualSurveyState),
                        annualVerificateState: Number(this.othersForm.annualVerificateState),
                        nextAnnualSurveyDate: this.othersForm.nextAnnualSurveyDate,
                        invoiceSerialNumber: this.othersForm.invoiceSerialNumber,
                        satellitePositionDeviceBrand: this.othersForm.satellitePositionDeviceBrand,
                        satellitePositionDeviceType: this.othersForm.satellitePositionDeviceType,
                        satellitePositionDeviceIMEI: this.othersForm.satellitePositionDeviceIMEI,
                        satellitePositionDeviceInstallDate: this.othersForm.satellitePositionDeviceInstallDate
                    }
                saveOtherInfo(data).then(res =>{
                    if(res.data.success){
                                this.$Message.success('保存成功!')
                                this.$emit('getInfo')
                                this.editable = false
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