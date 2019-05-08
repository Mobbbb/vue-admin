<template>
<div class="cardbox " id='board_info' style="margin-top:20px" >
    <Card style="width:100%">
        <p slot="title">上牌信息</p>
        <div slot="extra"> 
            <span class="likeA"  v-if="!editable" @click="editAction">编辑</span>
            <span class="likeA" v-if="!closed" style="margin-left:10px" @click="closeAction(true)">收起 </span>
            <span class="likeA" v-if="closed" style="margin-left:10px" @click="closeAction(false)">展开 </span>
        </div>
        <div v-if="!closed">
            <Form :label-width="100" :model="boardForm" :rules="ruleValidate" ref="boardForm">
                <FormItem label='状态:' prop="plateState">
                    <Row>
                         <Col span="5">
                            <Select v-model="boardForm.plateState" placeholder="请选择" v-bind:disabled='!editable'>
                                <Option :value= 1 >已上牌</Option>
                                <Option :value= 0 >未上牌</Option>
                            </Select>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='车牌:' v-if="boardForm.plateState ==1" prop="plateNumber">
                    <Row>
                         <Col span="5">
                            <Input  v-bind:disabled='!editable' v-model="boardForm.plateNumber" ></Input>
                        </Col>
                    </Row>
                </FormItem> 
                <FormItem label='上牌时间:' v-if="boardForm.plateState ==1" prop='plateTime'>
                    <Row>
                         <Col span="5">
                            <DatePicker v-bind:disabled='!editable' type="date" placeholder="请选择日期" v-model="boardForm.plateTime"></DatePicker>
                        </Col>
                    </Row>
                </FormItem>    
                <Button type="primary" v-show="editable" @click="SaveAction('boardForm')">保存</Button>
            </Form>
        </div>
        <div v-if="closed">...</div>
    </Card>
</div>
</template>
<script>
import { saveBoardInfo } from '@/api/vehicle.js'
export default {
    name:'board_info',
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
             this.boardForm = JSON.parse(JSON.stringify(this.infoData))
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
            boardForm:{},
            ruleValidate: {
                plateState: [
                        { required: true, message: '请填写',validator: validateNNull,  trigger: 'blur' }
                    ],
                plateNumber: [
                        { required: true, message: '请填写',  trigger: 'blur' }
                    ],   
                plateTime: [
                        { validator: validateNNull,  trigger: 'blur' }
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
                        uuid : this.boardForm.uuid,
                        userUuid : this.$store.state.user.userId,
                        plateState: this.boardForm.plateState,
                        plateNumber: this.boardForm.plateNumber,
                        plateTime:  this.$moment(this.boardForm.plateTime).format('YYYY-MM-DD hh:mm:ss'),
                    }
                    if (valid) {
                        saveBoardInfo(data).then(res =>{
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