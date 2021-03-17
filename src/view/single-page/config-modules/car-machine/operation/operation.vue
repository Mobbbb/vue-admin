<template>
    <div>
        <Form ref="formValidate" :model="params" :rules="rules" :label-width="150">
            <FormItem :label="'请选择' + operationMap[parentParams.type] + '设备 :'">
                <Select v-model="params.type" style="width:200px">
                    <Option value="1">TBOX</Option>
                    <Option value="2">AIBOX</Option>
                </Select>
            </FormItem>
            <FormItem label="拉取日志时间范围 :" prop="time" v-if="parentParams.type === 2">
                <DatePicker 
                    format="yyyy-MM-dd HH:mm:ss"
                    v-model="params.time" 
                    type="datetimerange" 
                    style="width: 300px"
                    @on-change="selectDate">
                </DatePicker>
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
import { operationMap } from '../index'

export default {
    props: ['value', 'parentParams'],
    data () {
        const time = (rule, value, callback) => {
            let data = value || null
            if (data === null || data[0] === '') callback(new Error())
            else callback()
        }
        return {
            operationMap,
            params: {},
            rules: {
                time: [{ required: true, trigger: 'change', validator: time, message: '请选择时间范围' }]
            }
        }
    },
    watch: {
        value () {
            if (this.value) {
                this.$refs.formValidate.resetFields()
                this.params = { type: '1' }
            }
        }
    },
    methods: {
        selectDate (date) {
            this.params.time = date
        },
        commit (temp) {
            if(temp){ 
                if (this.parentParams.type === 0) { // 唤醒
                    this.$emit('on-confirm')
                    this.$emit('input', false)
                } else if (this.parentParams.type === 1) { // 重启
                    this.$emit('on-confirm')
                    this.$emit('input', false)
                } else { // 拉取日志
                    this.$refs.formValidate.validate(res => {
                        if (res) {
                            this.$emit('input', false)
                        }
                    })
                }
            } else {
                this.$emit('input', false)
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped> 
    
</style>