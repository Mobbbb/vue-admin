<template>
	<div>
		<Form :model="commonFormData" :label-width="100" ref='checkForm' :rules='checkRule'>
            <!-- 日考勤 -->
            <div v-if="parentParams.examineType === 'D'">
                <FormItem label='日在线时长' prop='onlineDuration'>
                    <InputNumber v-model="commonFormData.onlineDuration" :min='1' :max='1440' placeholder="请输入时长: 单位(分钟)" style="width:200px"></InputNumber> 分钟
                </FormItem>
                <FormItem label='日高峰时长' prop='heightDuration'>
                    <InputNumber v-model="commonFormData.heightDuration" :min='1' :max='1440' placeholder="请输入时长: 单位(分钟)" style="width:200px"></InputNumber> 分钟
                </FormItem>
            </div>
            <!-- 月考勤 -->
            <div v-else>
                <FormItem label='休息天数' prop='day'>
                    <Select v-model="commonFormData.day" placeholder="请选择" style="width: 100px;">
                        <Option v-for="cell in restDayList" :value="cell.value" :key="cell.value">{{cell.label}}</Option>
                    </Select>
                </FormItem>
	            <FormItem label='日均在线时长' prop='onlineDuration'>
                    <InputNumber v-model="commonFormData.onlineDuration" :min='1' :max='1440' placeholder="请输入时长: 单位(分钟)" style="width:200px"></InputNumber> 分钟
                </FormItem>
                <FormItem label='日均高峰时长' prop='heightDuration'>
                    <InputNumber v-model="commonFormData.heightDuration" :min='1' :max='1440' placeholder="请输入时长: 单位(分钟)" style="width:200px"></InputNumber> 分钟
                </FormItem>
            </div>
        </Form>
        <div class="popView-footer-wrap">
            <Button size="large" type="text" @click="commit(0)" style="margin-right: 8px;">取消</Button>
            <Button size="large" type="primary" @click="commit(1)">确定</Button>
        </div>
	</div>
</template>

<script>
import { restDayList } from "../fields"
import { editAttendanceRule } from '@/api/driver.js'

export default {
	props: {
        parentParams: {
            type: Object
        }, 
        value: {
            type: Boolean
        },
    },
	data() {
        const testNumber = (rule, value, callback) => {
            if(this.commonFormData[rule.field] === null){
                if (this.parentParams.examineType === 'D') {
                    if (rule.field === 'onlineDuration') callback(new Error('请填写日在线时间'))
                    if (rule.field === 'heightDuration') callback(new Error('请填写日高峰时间'))
                } else {
                    if (rule.field === 'onlineDuration') callback(new Error('请填写日均高峰时间'))
                    if (rule.field === 'heightDuration') callback(new Error('请填写日均在线时间'))
                }
            } else callback()
        }
        const day = (rule, value, callback) => {
            if(this.commonFormData.day) callback()
            else callback(new Error('请选择休息天数'))
        }
	    return {
	    	restDayList,
            commonFormData: {},
            checkRule: {
                onlineDuration: [{required: true, validator: testNumber, triger: 'change'}],
                heightDuration: [{required: true, validator: testNumber, triger: 'change'}],
                day: [{required: true, validator: day, triger: 'change'}]
            }
	    }
	},
	watch: {
		'value' () {
			if(this.value) {
            	this.$refs.checkForm.resetFields()
                this.commonFormData = {...this.parentParams}
			}
		}
	},
	methods: {
        commit (temp) {
            if(temp) {
                this.$refs.checkForm.validate(valid => {
                    if(valid) {
                        editAttendanceRule(this.commonFormData).then(res => {
                            this.$Message.success('编辑成功！')
                            this.$emit('on-confirm')
                            this.$emit('input', false)
                        })
                    }
                })
            } else {
                this.$emit('input', false)
            }
        }
	}
}
</script>

<style scoped>
    .assenssment-item{
        display: flex;
        justify-content: space-between;
    }
    .assenssment-title{
        margin-right: 5px;
    }
</style>