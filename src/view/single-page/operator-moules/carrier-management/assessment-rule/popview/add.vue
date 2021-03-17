<template>
	<div>
		<Form :model="commonFormData" :label-width="100" ref='checkForm' :rules='checkRule'>
            <!-- 日考勤 -->
            <div v-if="type === 'D'">
                <FormItem label='日在线时长' prop='onlineDuration'>
                    <InputNumber v-model="commonFormData.onlineDuration" :min='1' :max='1440' placeholder="请输入时长: 单位(分钟)" style="width:200px"></InputNumber> 分钟
                </FormItem>
                <FormItem label='日高峰时长' prop='heightDuration'>
                    <InputNumber v-model="commonFormData.heightDuration" :min='1' :max='1440' placeholder="请输入时长: 单位(分钟)" style="width:200px"></InputNumber> 分钟
                </FormItem>
                <FormItem label='使用城市' prop="cityUuids" style="margin-top: 25px;">
                    <Cascader :data="cityList" v-model="commonFormData.cityUuids" style="width: 200px;"></Cascader>
                </FormItem>
            </div>
            <!-- 月考勤 -->
            <div v-else>
                <FormItem label='选择年' prop="examineYear">
                    <DatePicker 
                    	type="year" 
                    	v-model='commonFormData.examineYear' 
                    	:editable='false' 
                    	@on-change='selectYear' 
                    	placeholder="请选择日期" 
                    	style="width: 200px">
                    </DatePicker>
                </FormItem>
            	<Card v-for="(item, index) in commonFormData.list" :key='index'>
                    <FormItem
                        :label-width="0"
                        :prop="'list.' + index"
                        :rules="ruleValidate">
                        <div class="assenssment-item">
                            <div style="display: flex;align-items: flex-start;">
                                <span class="assenssment-title">月份</span>
                                <TreeInput
                                    :data="allMonths"
                                    placeholder="请选择月份"
                                    inputHeight="50px"
                                    inputWidth="200px"
                                    v-model="item.month"
                                    @on-change="selectMonth">
                                </TreeInput>
                            </div>
                            <div>
                                <span class="assenssment-title">休息天数</span>
                                <Select v-model="item.day" placeholder="请选择" style="width: 100px;">
                                    <Option v-for="cell in restDayList" :value="cell.value" :key="cell.value">{{cell.label}}</Option>
                                </Select>
                            </div>
                            <Button 
                                type="error"
                                v-if="index"
                                @click="deleteWorkTime(index)"
                                style="margin-bottom: 20px;">
                                删除
                            </Button>
                            <div v-else style="width: 56px;"></div>
                        </div>
                        <div class="assenssment-item" style="margin-top: 10px;">
                            <div>
                                <span class="assenssment-title">日均在线时长</span>
                                <InputNumber 
                                    v-model="item.onlineDuration"
                                    :min="1"
                                    :max="1440"
                                    placeholder="请输入时长"
                                    style="width: 115px">
                                </InputNumber> 分钟
                            </div>
                            <div>
                                <span class="assenssment-title">日均高峰时长</span>
                                <InputNumber 
                                    v-model="item.heightDuration"
                                    :min="1"
                                    :max="1440"
                                    placeholder="请输入时长"
                                    style="width: 115px">
                                </InputNumber> 分钟
                            </div>
                            <Button type="success" ghost @click='setWorkCheckTime' style="height: 30px;margin-top: 2px;">添加</Button>
                        </div>
                    </FormItem>
	            </Card>
	            <FormItem label='使用城市' prop="cityUuids" style="margin-top: 25px;">
                    <Cascader :data="cityList" v-model="commonFormData.cityUuids" style="width: 200px;"></Cascader>
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
import { allMonths, restDayList } from "../fields"
import { treeDataTranslate, getIntersection } from '@/libs/tools'
import { addAttendanceRule } from '@/api/driver.js'
import TreeInput from '_a/tree-input/tree-input.vue'

export default {
	props: {
        type: {
            type: String
        }, 
        value: {
            type: Boolean
        }
    },
    components: {
        TreeInput
    },
	data() {
        const list = (rule, value, callback) => {
            let temp = true
            if(value.month.length){
                this.commonFormData.list.forEach((item, index) => {
                    let arr = JSON.parse(JSON.stringify(this.commonFormData.list))
                    arr.splice(index, 1)
                    arr.forEach((cell, index) => {
                        let res = getIntersection(item.month, cell.month)
                        if(res.length) {
                            temp = false
                            callback(new Error('不可设置重复月份'))
                        }
                    })
                })
            } else {
                temp = false
                callback(new Error('月份不得为空'))
            }
            if(value.day === null) {
                temp = false
                callback(new Error('休息天数不得为空'))
            }
            if(value.onlineDuration === null) {
                temp = false
                callback(new Error('日均在线时长不得为空'))
            }
            if(value.heightDuration === null) {
                temp = false
                callback(new Error('日均高峰时长不得为空'))
            }
            if(temp) callback()
        }
        const cityUuids = (rule, value, callback) => {
            if(value.length) callback()
            else callback(new Error('请选择城市'))
        }
	    return {
	    	restDayList,
	    	cityList: [],
            allMonths: [],
            commonFormData: {},
            initParams: {
                onlineDuration: null,
                heightDuration: null,
                list: [{
                    month: [],
                    onlineDuration: null,
                    heightDuration: null,
                    day: ''
                }],
                cityUuids: []
            },
            checkRule: {
                onlineDuration: [{required: true, message: '请填写日在线时间'}],
                heightDuration: [{required: true, message: '请填写日高峰时间'}],
                examineYear: [{required: true, message: '请选择年份'}],
                cityUuids: [{required: true, validator: cityUuids}],
            },
            ruleValidate: {required: true, validator: list, trigger: 'change'}
	    }
	},
	watch: {
		'value' () {
			if(this.value) {
                this.commonFormData = JSON.parse(JSON.stringify(this.initParams))
            	this.$refs.checkForm.resetFields()
			}
		}
	},
	mounted () {
        let month = JSON.parse(JSON.stringify(allMonths))
    	this.cityList = JSON.parse(localStorage.getItem('provinceCityList'))
        this.allMonths = treeDataTranslate(month, 'value')
	},
	methods: {
        selectYear(data) {
            this.commonFormData.examineYear = data
        },
        selectMonth() {
            this.commonFormData.list.forEach((item, index) => {
                this.$refs.checkForm.validateField('list.' + index)
            })
        },
        deleteWorkTime(index) {
            this.commonFormData.list.splice(index, 1)
        },
        setWorkCheckTime() { 
            this.commonFormData.list.push({
                month: [],
                onlineDuration: null,
                heightDuration: null,
                day: ''
            })
        },
        commit (temp) {
            if(temp) {
                this.$refs.checkForm.validate(valid => {
                    if(valid){
                        let params = JSON.parse(JSON.stringify(this.commonFormData))
                        params.examineType = this.type
                        params.list.forEach(item => { item.month = item.month.join(',') })
                        addAttendanceRule(params).then(res => {
                            this.$Message.success('新建成功！')
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