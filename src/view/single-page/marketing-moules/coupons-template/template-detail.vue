<template>
	<Card class="template-detail-wrap">
		<Form ref="formValidate" :label-width="150">
            <FormItem label="券模板名称 :">
            	{{params.templateName}}
            </FormItem>
            <FormItem label="业务线 :">
                <span v-for="(item, index) in params.businessTypeList">
                    <span v-if="index < params.businessTypeList.length - 1">{{typeModuleMap[item]}}、</span>
                    <span v-else>{{typeModuleMap[item]}}</span>
                </span>
            </FormItem>
            <FormItem label="券类型 :">
                {{couponTypeMap[params.templateType]}}
            </FormItem>
            <FormItem label="订单类型 :" v-if="selectTypeModule">
                <span v-for="(item, index) in params.userLimitList">
                    <span v-if="index < params.userLimitList.length - 1">{{typeTimeMap[item]}}、</span>
                    <span v-else>{{typeTimeMap[item]}}</span>
                </span>
            </FormItem>
            <FormItem label="券面额 :" v-if="params.templateType === 2">
            	{{params.couponMoney}} 元
            </FormItem>
            <FormItem label="用券门槛 :" v-if="params.templateType === 2">
                <span v-if="params.needCondition === 0">不限门槛</span>
                <span v-if="params.needCondition === 1">满{{params.conditionMoney}}元可用</span>
            </FormItem>
            <FormItem label="折扣 :" v-if="params.templateType === 1">
            	{{params.discount}}折
            </FormItem>
            <FormItem label="用券条件 :" v-if="params.templateType === 1">
                最高抵扣{{params.highestMoney}}元
            </FormItem>
        </Form>
        <div style="text-align: right;">
        	<Button style="margin-right: 15px;" @click="back">返回</Button>
        </div>
	</Card>
</template>

<script>
import { typeModuleMap, typeTimeMap, couponTypeMap } from '@/libs/status-map'
import { getCouponsTemplateDetail } from '@/api/marketing'

export default {
  	data () {
	    return {
	    	couponTypeMap,
	    	typeModuleMap,
	    	typeTimeMap,
	    	params: {
                businessTypeList: []
            }
	    }
	},
	computed: {
		selectTypeModule () { // 是否选择了快车 true：是
			let data = this.params.businessTypeList || []
			let temp = false
			data.forEach(item =>{ if (item === '4') temp = true })
			return temp
		}
	},
    watch: {
        '$route.query.uuid' () {
            this.getDetail()
        }
    },
	mounted () {
        this.getDetail()
  	},
  	methods: {
        getDetail () {
            getCouponsTemplateDetail({ uuid: this.$route.query.uuid }).then(res => {
                this.params = res.data.data || {}
            })
        },
  		back () {
  			this.$router.push({
				name: 'coupons-template'
			})
  		}
  	}
}
</script>

<style scoped>
	.template-detail-wrap{
		width: 550px;
		margin: 0 auto;
		padding: 10px 25px 10px 0;
		margin-top: 20px;
	}
</style>