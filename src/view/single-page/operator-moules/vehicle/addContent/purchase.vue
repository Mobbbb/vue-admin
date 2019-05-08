<template>
<div class="cardbox top20" id='purchase_info'>
    <Card style="width:100%">
        <p slot="title">购置信息</p>
        <div slot="extra"> 
            <span class="likeA"  v-if="!editable" @click="editAction">编辑</span>
            <span class="likeA" v-if="!closed" style="margin-left:10px" @click="closeAction(true)">收起 </span>
            <span class="likeA" v-if="closed" style="margin-left:10px" @click="closeAction(false)">展开 </span>
        </div>
        <div v-if="!closed">
            <Form :label-width="100" :model="purchaseForm" :rules="ruleValidate" ref="purchaseForm">
                <FormItem label='完税证明编号:' prop="taxPaymentCertificateNumber">
                    <Row>
                         <Col span="5" >
                            <Input  v-bind:disabled='!editable'  v-model="purchaseForm.taxPaymentCertificateNumber"></Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='纳税人:' prop="taxPayer">
                    <Row>
                         <Col span="5">
                            <Input  v-bind:disabled='!editable' v-model="purchaseForm.taxPayer" ></Input>
                        </Col>
                    </Row>
                </FormItem>    
                <Button type="primary" v-show="editable" @click="SaveAction('purchaseForm')">保存</Button>
            </Form>
        </div>
        <div v-if="closed">...</div>
    </Card>
</div>
</template>
<script>
import { savePurchaseInfo } from '@/api/vehicle.js'
export default {
    name:'purchase_info',
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
             this.purchaseForm = JSON.parse(JSON.stringify(this.infoData))
        }
    },
    data () {
         
        return {
            closed:false,
            editable:true,
            purchaseForm:{} ,
            ruleValidate: {
                taxPaymentCertificateNumber: [
                        { required: true, message: '请填写',  trigger: 'blur' }
                    ],
                taxPayer: [
                        { required: true, message: '请填写',  trigger: 'blur' }
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
                        uuid : this.purchaseForm.uuid,
                        userUuid : this.$store.state.user.userId,
                        taxPaymentCertificateNumber: this.purchaseForm.taxPaymentCertificateNumber,
                        taxPayer: this.purchaseForm.taxPayer
                    }
                    if (valid) {
                        savePurchaseInfo(data).then(res =>{
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