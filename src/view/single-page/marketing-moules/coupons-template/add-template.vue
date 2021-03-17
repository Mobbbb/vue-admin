<template>
	<Card class="add-template-wrap">
		<Form ref="formValidate" :model="params" :rules="rules" :label-width="100">
            <FormItem label="券模板名称 :" prop="templateName">
                <Input :maxlength="15" v-model="params.templateName" placeholder="请输入券模板名称"></Input> 
            </FormItem>
            <FormItem label="业务线 :" prop="businessType">
                <CheckboxGroup v-model="params.businessType">
			        <Checkbox label="4">快车</Checkbox>
			        <Checkbox label="2">专车</Checkbox>
			        <Checkbox label="1">出租车</Checkbox>
			    </CheckboxGroup>
            </FormItem>
            <FormItem label="订单类型 :" prop="userLimit" v-if="selectTypeModule">
                <CheckboxGroup v-model="params.userLimit">
			        <Checkbox label="1">实时</Checkbox>
			        <Checkbox label="2">预约</Checkbox>
			    </CheckboxGroup>
            </FormItem>
            <FormItem label="券类型 :" prop="templateType">
                <Select v-model="params.templateType" @on-change="selectCouponType">
                	<Option value="1">折扣券</Option>
                	<Option value="2">抵扣券</Option>
                </Select>
            </FormItem>
            <FormItem label="券面额 :" prop="couponMoney" v-if="params.templateType === '2'">
                <InputNumber
                    v-model="params.couponMoney"
                    :min="0"
                    :max="999.99"
                    :formatter="value => `${Math.floor(value * 100) / 100}`"
                    placeholder="请输入券面额"
                    class="number-input">
                </InputNumber>
                元
            </FormItem>
            <FormItem label="用券门槛 :" prop="needCondition" v-if="params.templateType === '2'">
                <RadioGroup v-model="params.needCondition">
			        <Radio label="0">不限门槛</Radio>
			        <Radio label="1">限定门槛</Radio>
			    </RadioGroup>
            </FormItem>
            <FormItem prop="conditionMoney" v-if="params.needCondition === '1'">
                满
                <InputNumber
                    v-model="params.conditionMoney"
                    :min="0"
                    :max="999.99"
                    :formatter="value => `${Math.floor(value * 100) / 100}`"
                    placeholder="请输入满减金额"
                    class="number-input">
                </InputNumber>
                元可用
            </FormItem>
            <FormItem label="折扣 :" prop="discount" v-if="params.templateType === '1'">
                <InputNumber
                    v-model="params.discount"
                    :min="0"
                    :max="10"
                    :formatter="value => `${Math.floor(value * 10) / 10}`"
                    placeholder="请输入折扣"
                    class="number-input">
                </InputNumber>
            </FormItem>
            <FormItem label="用券条件 :" prop="highestMoney" v-if="params.templateType === '1'">
                最高抵扣
                <InputNumber
                    v-model="params.highestMoney"
                    :min="0"
                    :formatter="value => `${Math.floor(value * 100) / 100}`"
                    placeholder="请输入抵扣金额"
                    class="number-input">
                </InputNumber>
                元
            </FormItem>
        </Form>
        <div style="text-align: right;">
        	<Button style="margin-right: 15px;" @click="commit(0)">取消</Button>
        	<Button type="primary" @click="commit(1)">完成</Button>
        </div>
	</Card>
</template>

<script>
import { addCouponsTemplate } from '@/api/marketing'
import { typeTimeMap, typeModuleMap } from '@/libs/status-map'

export default {
  	data () {
  		const validateArr = (rule, value, callback) => {
  			let data = value || []
  			if (data.length) callback()
  			else callback(new Error())
  		}
  		const validateNum = (rule, value, callback) => {
  			if (value !== null) callback()
  			else callback(new Error())
  		}
	    return {
            typeTimeMap,
            typeModuleMap,
	    	params: {
	    		couponMoney: null,      // 券面额
				needCondition: null,    // 用券门槛
				conditionMoney: null,   // 满减金额
				discount: null,         // 折扣
				highestMoney: null 	    // 用券条件
	    	},
			rules: {
				templateName: [{ required: true, message: '请输入', trigger: 'change' }],
				businessType: [{ required: true, validator: validateArr, message: '请选择业务线', trigger: 'change' }],
				userLimit: [{ required: true, validator: validateArr, message: '请选择订单类型', trigger: 'change' }],
				templateType: [{ required: true, message: '请输入', trigger: 'change' }],
				couponMoney: [{ required: true, validator: validateNum, message: '请输入券面额', trigger: 'change' }],
				needCondition: [{ required: true, validator: validateNum, message: '请输入用券门槛', trigger: 'change' }],
				conditionMoney: [{ required: true, validator: validateNum, message: '请输入满减金额', trigger: 'change' }],
				discount: [{ required: true, validator: validateNum, message: '请输入折扣', trigger: 'change' }],
				highestMoney: [{ required: true, validator: validateNum, message: '请输入用券条件', trigger: 'change' }]
			}
	    }
	},
	computed: {
		selectTypeModule () {
			let data = this.params.businessType || []
			let temp = false
			data.forEach(item =>{ if (item === '4') temp = true })
			return temp
		}
	},
	methods: {
		selectCouponType () {
			this.params.couponMoney = null
			this.params.needCondition = null
			this.params.conditionMoney = null
			this.params.discount = null
			this.params.highestMoney = null
		},
		commit (temp) {
			if (temp) {
				this.$refs.formValidate.validate().then(res => {
					if (res) {
                        let params = JSON.parse(JSON.stringify(this.params))
                        params.businessType = []
                        this.params.businessType.forEach(item => {
                            params.businessType.push({
                                dictType: 'business_type',
                                dictVal: item,
                                dictValName: this.typeModuleMap[item]
                            })
                        })
                        if (this.selectTypeModule) { // 选择了快车
                            params.userLimit = []
                            this.params.userLimit.forEach(item => {
                                params.userLimit.push({
                                    dictType: 'user_limit',
                                    dictVal: item,
                                    dictValName: this.typeTimeMap[item]
                                })
                            })
                        }
                        params.templateType = Number(params.templateType)
                        params.needCondition = Number(params.needCondition)
                        addCouponsTemplate(params).then(res => {
                            this.$Message.success('新建成功')
                            this.$router.push({ name: 'coupons-template' })
                        })	
					}
				})
			} else {
				this.$Modal.confirm({
                    title: '提示',
                    content: '确认取消创建券模板？',
                    onOk: () => {
                        this.$router.push({ name: 'coupons-template' })
                    }
                })
			}
		}
  	}
}
</script>

<style scoped>
	.add-template-wrap{
		width: 550px;
		margin: 0 auto;
		padding: 10px 25px 10px 0;
		margin-top: 20px;
	}
	.number-input{
		line-height: 20px;
	}
</style>