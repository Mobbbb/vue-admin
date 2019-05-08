<template>
    <div>
        <Form ref="formValidate" :model="params" :rules="validateRule" :label-width="120">
            <FormItem label="车辆VIN码：">
                <p>{{info.carVin}}</p>
            </FormItem>
            <FormItem label="车牌号：">
                <p>{{info.plateNumber}}</p>
            </FormItem>
            <FormItem label="当前接单设备：">
                <p>{{receiveDevice}}</p>
            </FormItem>
            <FormItem label="接单设备切换为：">
                <p class="error_text">{{_receiveDevice}}</p>
            </FormItem>
            <FormItem label="生效 / 失效时间：" prop="time">
                <DatePicker
                    v-model="params.time"
                    type="datetimerange"
                    style="width: 100%;"
                    placeholder="请选择生效时间和失效时间">
                </DatePicker>
            </FormItem>
            <FormItem label="备注：" prop="remark">
                <Input v-model="params.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注" />
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
import { switchDevice } from '@/api/configData'

export default {
    props: ['info', 'popView'],
    data () {
        const remark = (rule, value, callback) => {
            if(value){
                if(value.length > 200){
                   callback(new Error('字数不可超过200字')) 
                } else callback()
            }  callback()
        }
        const time = (rule, value, callback) => {
            if(value.length && value[0] !== '') callback()
            else callback(new Error('请选择生效时间和失效时间'))
        }
        return {
            params: {
                time: []
            },
            validateRule: {
                time: [{
                    required: true, trigger: 'change', validator: time
                }],
                remark: [{
                    validator: remark, trigger: 'change'
                }]
            }
        }
    },
    computed: {
        receiveDevice: function(){
            return this.info.receiveDevice === 1 ? '手机' : '车机'
        },
        _receiveDevice: function(){
            return this.info.receiveDevice === 1 ? '车机' : '手机'
        }
    },
    mounted () {
        
    },
    watch: {
        'popView': function(){
            if(this.popView){
                this.params = { time: [] }
                this.$refs.formValidate.resetFields()
            }
        }
    },
    methods: {
        commit: function(temp){
            if(temp){
                this.$refs.formValidate.validate().then(res => {
                    if(res){
                        this.params.effectStart = this.$moment(this.params.time[0]).format('YYYY-MM-DD HH:mm:ss')
                        this.params.effectEnd = this.$moment(this.params.time[1]).format('YYYY-MM-DD HH:mm:ss')
                        this.params.carVin = this.info.carVin
                        this.params.receiveDevice = !this.info.receiveDevice
                        switchDevice(this.params).then(res => {
                            this.$Message.success('切换成功')
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
    .error_text{
        color: #ff6f6f;
        font-weight: bold;
        font-size: 13px;
    }
</style>
