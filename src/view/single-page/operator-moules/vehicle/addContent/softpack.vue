<template>
<div class="cardbox top20" id='softpack_info' style="margin-top:20px">
    <Card style="width:100%">
        <p slot="title">软装信息</p>
        <div slot="extra"> 
            <span class="likeA"  v-if="!editable" @click="editAction">编辑</span>
            <span class="likeA" v-if="!closed" style="margin-left:10px" @click="closeAction(true)">收起 </span>
            <span class="likeA" v-if="closed" style="margin-left:10px" @click="closeAction(false)">展开 </span>
        </div>
        <div v-if="!closed">
            <Form :label-width="100" :model="softpackForm"  ref="softpackForm">
                <FormItem label='脚垫:' prop="footPad">
                    <Row>
                         <Col span="5">
                            <Select  placeholder="请选择" v-bind:disabled='!editable' v-model="softpackForm.footPad">
                                <Option :value= 1 >有</Option>
                                <Option :value= 0 >无</Option>
                            </Select>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='贴膜:'>
                    <Row>
                         <Col span="5">
                            <Select  placeholder="请选择" v-bind:disabled='!editable' v-model="softpackForm.film">
                                <Option :value= "1" >有</Option>
                                <Option :value= "0" >无</Option>
                            </Select>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label='车身喷漆:'  >
                    <Row>
                         <Col span="5">
                            <Input  v-bind:disabled='!editable'  v-model="softpackForm.diyColour"></Input>
                        </Col>
                    </Row>
                </FormItem>    
                <Button type="primary" v-show="editable" @click="SaveAction('softpackForm')">保存</Button>
            </Form>
        </div>
        <div v-if="closed">...</div>
    </Card>
</div>
</template>
<script>
import { saveInteriorInfo } from '@/api/vehicle.js'
export default {
    name:'softpack_info',
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
             this.softpackForm = JSON.parse(JSON.stringify(this.infoData))
        }
    },
    data () {
        return {
            closed:false,
            editable:true,
            softpackForm:{},
            ruleValidate:{}
        }
    },
    methods:{
        closeAction(val) {
        this.closed = val
        },
        SaveAction(name){
    
                    let data = {
                        uuid : this.softpackForm.uuid,
                        userUuid : this.$store.state.user.userId,
                        footPad: Number(this.softpackForm.footPad),
                        film: Number(this.softpackForm.film),
                        diyColour: this.softpackForm.diyColour
                    }
               
                        saveInteriorInfo(data).then(res =>{
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