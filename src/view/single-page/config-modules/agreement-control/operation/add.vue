<template>
    <div>
        <Form ref="formValidate" :model="params" :rules="rules" :label-width="100">
            <FormItem label="协议类型 :" prop="protocolName">
                <Select v-model="params.protocolName" style="width:200px">
                    <Option value="1">乘客用户协议</Option>
                    <Option value="2">司机用户协议</Option>
                </Select>
            </FormItem>
            <FormItem label="更新机制 :">
                强制更新
            </FormItem>
            <FormItem label="协议版本 :" prop="versionType">
                <RadioGroup v-model="params.versionType">
                    <Radio label="0">增加大版本</Radio>
                    <Radio label="1">增加小版本</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="协议链接 :" prop="protocolLink">
                <Input v-model="params.protocolLink" placeholder="请输入协议链接"></Input>
            </FormItem>
        </Form>
        <div class="popView-footer-wrap">
            <Button size="large" type="text" @click="commit(0)" style="margin-right: 8px;">取消</Button>
            <Button size="large" type="primary" @click="commit(1)">确定</Button>
        </div>
    </div>
</template>

<script>
import '@/styles/cyk-style.css'
import { regTest } from '@/libs/tools'
import { protocolSave } from '@/api/configData'

export default {
    props: {
        value: Boolean
    },
    data () {
        const protocolLink = (rule, value, callback) => {
            if (regTest(value, 'url')) callback()
            else callback(new Error('请输入正确的协议链接'))
        }
        return {
            params: {},
            rules: {
                protocolName: [{ required: true, trigger: 'change', message: '请选择协议类型' }],
                versionType: [{ required: true, trigger: 'change', message: '请选择协议版本' }],
                protocolLink: [{ required: true, trigger: 'change', validator: protocolLink }]
            }
        }
    },
    watch: {
        'value' () {
            if (this.value) {
                this.params = {}
                this.$refs.formValidate.resetFields()
            }
        }
    },
    mounted () {
        
    },
    methods: {
        commit (temp) {
            if (temp) {
                this.$refs.formValidate.validate(res => {
                    if (res) {
                        let params = {...this.params}
                        params.protocolName = Number(params.protocolName)
                        params.versionType = Number(params.versionType)
                        params.updateRule = 1
                        protocolSave(params).then(res => {
                            this.$emit('input', false)
                            this.$emit('on-confirm')
                            this.$Message.success('新建成功')
                        })
                    }
                })
            } else this.$emit('input', false)
        }
    }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped> 
    
</style>
