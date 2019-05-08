<template>
    <div class="DAP-popView">
        <div class="my-modal-wrap">
            <Form ref="formValidate" :label-width="100">
                <FormItem label="运营商：">
                    <div class="displayInput">{{params.agentName}}</div>
                </FormItem>
                <FormItem label="运营区域：">
                    <div class="displayInput">{{params.agentArea}}</div>
                </FormItem>
                <FormItem label="适用年月：">
                    <div class="displayInput">{{params.year}} - {{params.month}}月</div>
                </FormItem>
                <FormItem label="预计补贴：">
                    <div class="append-input-wrap _append-input-wrap">
                        <InputNumber
                            :min="0"
                            :max="999999"
                            class="my-number-input percent-input"
                            v-model="amount"
                            :formatter="value => `${value}`"
                            :parser="value => value.replace('%', '')">
                        </InputNumber>
                        <div class="append-input">元</div>
                    </div>
                </FormItem>
            </Form>
            <div class="popView-footer-wrap">
                <Button size="large" type="text" @click="commit(0)" style="margin-right: 8px;">取消</Button>
                <Button size="large" type="primary" @click="commit(1)">确定</Button>
            </div>
        </div>
    </div>
</template>

<script>
import '@/styles/cyk-style.css'
import '@/styles/icon-font/iconfont.css'
import { subsidyDetail, updateSubsidy } from '@/api/operator-carrier.js'

export default {
    props: {
        uuid: String,
        rowNum: {
            default: '',
            type: String
        },
        popView: Boolean
    },
    data () {
        return {
            amount: Number(),
            params: {}
        }
    },
    watch: {
        'popView': function(){
            if(this.popView){
                this.getSubsidyDetail()
            }
        }
    },
    methods: {
        getSubsidyDetail: function(){
            subsidyDetail({uuid: this.uuid}).then(res => {
                this.params = res.data.data
                this.amount = res.data.data.money
            })
        },
        commit: function(temp){
            if(temp){
                if(this.amount !== null && this.amount !== ''){
                    updateSubsidy({
                        uuid: this.uuid, 
                        money: this.amount
                    }).then(res => {
                        if(res.data.success){
                            this.$emit('on-confirm', 1)
                            this.$Message.success('编辑成功!')
                        }
                    })
                } else {
                    this.$Message.warning('预计补贴不可为空！')
                }             
            } else {
                this.$emit('on-confirm')
            }
        }
    }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .percent-input{
        width: 100px;
        line-height: 29px;
    }
    ._append-input-wrap{
        margin: 0 7px;
    }
</style>
