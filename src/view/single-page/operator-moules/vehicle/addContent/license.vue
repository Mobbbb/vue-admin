<template>
<div class="cardbox "  id="license_info" style="margin-top:20px">
    <Card style="width:100%">
        <p slot="title">行驶证信息</p>
        <div slot="extra"> 
            <span class="likeA"  v-if="!editable" @click="editAction">编辑</span>
            <span class="likeA" v-if="!closed" style="margin-left:10px" @click="closeAction(true)">收起 </span>
            <span class="likeA" v-if="closed" style="margin-left:10px" @click="closeAction(false)">展开 </span>
        </div>
        <div v-if="!closed">
            <Form :label-width="100" :model="licenseForm" :rules="ruleValidate" ref="licenseForm">
                
                <FormItem label='车辆类型:' prop='vehicleType'>
                    <Row>
                         <Col span="5">
                            <Input  v-bind:disabled='!editable' v-model="licenseForm.vehicleType"></Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='车辆注册时间:'   prop='carRegisterTime'>
                    <Row>
                         <Col span="5">
                            <DatePicker type="date" placeholder="" style="width: 200px" v-model="licenseForm.carRegisterTime" v-bind:disabled='!editable'></DatePicker>
                        </Col>
                    </Row>
                </FormItem>
            
                <FormItem label='行驶证号:'  prop='drivingPermit'>
                    <Row>
                         <Col span="5">
                            <Input  v-bind:disabled='!editable'  v-model="licenseForm.drivingPermit"></Input>
                        </Col>
                    </Row>
                </FormItem>
                
                <Button type="primary" v-show="editable" @click="SaveAction ('licenseForm')">保存</Button>
            </Form>
        </div>
        <div v-if="closed">...</div>
    </Card>
</div>
</template>
<script>
import { saveDrivingLicense } from '@/api/vehicle.js'
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
             this.licenseForm = JSON.parse(JSON.stringify(this.infoData))
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
            licenseForm:{},
            ruleValidate:{
                vehicleType: [
                        { required: true,validator: validateNNull, trigger: 'blur' }
                    ],
                drivingPermit:[
                    { type:'string', max: 15,message: "请输入合法行驶证号"}
                ]
            }
        }
    },
    methods:{
        closeAction(val) {
        this.closed = val
        },
        SaveAction(name){
           
            let data = {
                uuid : this.licenseForm.uuid,
                vehicleType: this.licenseForm.vehicleType,
                userUuid : this.$store.state.user.userId,
                drivingPermit: this.licenseForm.drivingPermit,
                carRegisterTime:  this.$moment( this.licenseForm.carRegisterTime).format('YYYY-MM-DD hh:mm:ss')
               
            }
            this.$refs[name].validate((valid) => {
                    if (valid) {
                        // this.$Message.success('请完成表单!');
                        // console.log(data)
                        saveDrivingLicense(data).then(res =>{
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
            // console.log(data)
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
