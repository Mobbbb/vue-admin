<template>
    <div class="my-modal-wrap">
        <Form ref="formValidate" :model="params" :rules="rules" :label-width="80">
            <FormItem label="档位：" prop="money">
                <InputNumber 
                    :min="1"
                    :precision="0"
                    v-model="params.money"
                    style="width: 200px;">
                </InputNumber>
            </FormItem>
        </Form>
        <div class="popView-footer-wrap">
            <Button size="large" type="text" @click="commit(0)" style="margin-right: 8px;">取消</Button>
            <Button size="large" type="primary" @click="commit(1)">保存</Button>
        </div>
    </div>
</template>

<script>
import '@/styles/cyk-style.css'
import { addRechargeLeve } from '@/api/finance'

export default {
    props: ['popView'],
    data () {
        const money = (rule, value, callback) => {
            if(this.params.money === null){
                callback(new Error('充值档位不得为空'))
            } else {
                callback()
            }
        }
        return {
            params: {},
            rules: {
                money: [{
                    required: true, validator: money, trigger: 'change'
                }]
            }
        }
    },
    watch: {
        'popView': function(){
            if(this.popView){ // 弹出窗口时
                this.params = { money: null }
                this.$refs.formValidate.resetFields()
            }
        }
    },
    methods: {
    	commit: function(temp){
            if(temp){
                this.$refs.formValidate.validate().then(res => {
                    if(res){
                        addRechargeLeve({ money: this.params.money }).then(res => {
                            this.$Message.success('新增成功')
                            this.$emit('on-confirm', 1) 
                        })
                    }
                })              
            } else {
                this.$emit('on-confirm')
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>