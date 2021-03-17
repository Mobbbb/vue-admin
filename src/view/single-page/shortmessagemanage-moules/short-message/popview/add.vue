<template>
	<div>
		<Form :model="addParams" ref="formInline" :label-width="90" :rules="rules">
			<FormItem label="任务名称 :" prop="taskName">
            	<Input
            		:maxlength="40"
            		v-model="addParams.taskName" 
            		placeholder="请输入名称" 
            		style="width: 200px"/>
          	</FormItem>
	        <FormItem label="发送对象 :" prop="sendName">
	          	<Select v-model="addParams.sendName" style="width: 200px">
		            <Option value="0">乘客</Option>
		            <Option value="1">司机</Option>
	          	</Select>
	        </FormItem>
	        <FormItem label="发送范围 :" prop="driver">
	          	<Select v-model="addParams.driver" style="width: 200px">
		            <Option
		            	v-for="(item, index) in passengerBoundary"
		            	:value="item.value"
		            	:key="index"
		            	v-if="addParams.sendName === '0'">{{item.label}}
		            </Option>
		            <Option
		            	v-for="(item, index) in driverBoundary"
		            	:value="item.value"
		            	:key="index"
		            	v-if="addParams.sendName === '1'">{{item.label}}
		            </Option>
	          	</Select>
	        </FormItem>
	        <FormItem
	        	label="用户分群 :"
	        	prop="userGroupUuid"
	        	v-if="addParams.sendName === '0' && addParams.driver === '1'">
	        	<Select
	                remote
	                filterable
	                v-model="addParams.userGroupUuid"
	                placeholder="请选择用户分群"
	                :remote-method="remoteMethod"
	                :loading="loading"
	                style="width: 200px">
	                <Option 
	                	v-for="(option, index) in userGroupList" 
	                	:value="option.uuid" 
	                	:key="index">{{option.userGroupName}}</Option>
	            </Select>
	        </FormItem>
	        <FormItem 
	        	prop="mobiles" 
	        	v-if="addParams.driver === '0'">
	          	<Input
	              	v-model="addParams.mobiles"
	              	type="textarea"
	              	:rows="4"
	              	placeholder="请输入手机号，以英文逗号隔开"/>
	        </FormItem>
	        <FormItem 
	        	label="业务类型 :"
	        	prop="businessType" 
	        	v-if="addParams.sendName === '1' && addParams.driver === '1'">
	          	<Select v-model="addParams.businessType" placeholder="请选择业务类型">
		            <Option value="1">出租车</Option>
		            <Option value="2">专车</Option>
		            <Option value="3">拼车</Option>
		            <Option value="4">快车</Option>
	          	</Select>
	        </FormItem>
	        <FormItem 
	        	label="运营商 :" 
	        	prop="agentUuid" 
	        	v-if="addParams.sendName === '1' && addParams.driver === '1'">
	          	<TreeInput
	                :data="operatorGroup"
	        		placeholder="请选择运营商"
	                @on-change="selectTree"
	                v-model="addParams.agentUuid">
                </TreeInput>
	        </FormItem>
	        <FormItem v-if="addParams.driver === '2'">
		        <ImportFile
		        	@on-success='importSuccess'
              		importFileUrl="/admin/sms/importExcel"
		        	toDownTemplateUrl="/download/MessageTemplate.xlsx">
		        </ImportFile>
	        </FormItem>
	        <FormItem label="消息内容 :" prop="sendContent">
	          	<Input
		            v-model="addParams.sendContent"
		            type="textarea"
		            :rows="4"
		            :maxlength="200"
		            placeholder="请输入短信内容"/>
	        </FormItem>
	        <FormItem label="发送时间 :" prop="createTime">
	          	<DatePicker 
	          		v-model="addParams.createTime" 
	          		type="datetime" 
	          		placeholder="请选择发送时间" 
	          		format="yyyy-MM-dd HH:mm:ss"
	          		@on-change="selectTime"
	          		style="width: 200px">
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
import ImportFile from "_a/import-file/index.vue"
import TreeInput from "_a/tree-input/tree-input.vue"
import { sendMessage, getUserGroupList } from '@/api/announcement'

export default {
	components: {
		ImportFile,
		TreeInput
	},
	props: {
		value: {
			type: Boolean
		}
	},
	data() {
		const createTime = (rule, value, callback) => {
            if(value === '') callback(new Error('请选择发送时间'))
            else callback()
        }
    	const agentUuid = (rule, value, callback) => {
    		let arr = value || []
            if(arr.length) callback()
            else callback(new Error('请选择运营商'))
        }
	    return {
			loading: false,
			userGroupList: [],
	    	rules: {
	    		taskName: [{required: true, message: '请填写任务名称', trigger: 'change'}],
				sendName: [{required: true, message: '请选择发送对象', trigger: 'change'}],
				driver: [{required: true, message: '请选择发送范围', trigger: 'change'}],
				userGroupUuid: [{required: true, message: '请选择用户分群', trigger: 'change'}],
				sendContent: [{required: true, message: '请填写发送内容', trigger: 'change'}],
				createTime: [{required: true, validator: createTime, trigger: 'change'}],
				businessType: [{required: true, message: '请选择业务类型', trigger: 'change'}],
				agentUuid: [{required: true, validator: agentUuid, trigger: 'change'}],
				mobiles: [{required: true, message: '请填写手机号', trigger: 'change'}],
	    	},
	    	addParams: {},
	    	operatorGroup: [],
	    	passengerBoundary: [
	    		{
	    			value: '0',
	    			label: '指定乘客'
	    		},
	    		{
	    			value: '1',
	    			label: '用户分群'
	    		},
	    		{
	    			value: '2',
	    			label: '批量'
	    		}
	    	],
	    	driverBoundary: [
	    		{
	    			value: '0',
	    			label: '指定司机'
	    		},
	    		{
	    			value: '1',
	    			label: '指定运营商'
	    		},
	    		{
	    			value: '2',
	    			label: '批量'
	    		}
	    	]
	    }
	},
	watch: {
		'value' () {
			if(this.value) {
				this.$refs.formInline.resetFields()
				this.addParams = {}
			}
		}
	},
	mounted () {
		this.operatorGroup = JSON.parse(localStorage.getItem('pcOperatorList'))
	},
	methods: {
		remoteMethod (query) {
			if (query !== '') {
				let params = {
					currPage: 1,
					pageSize: 10,
					userGroupStatus: 0,
					userGroupName: query
				}
                this.loading = true
                getUserGroupList(params).then(res => {
                	let data = res.data.data
                	this.userGroupList = data && data.list || []
                	this.loading = false
                })
            } else {
                this.userGroupList = []
            }
		},
		selectTime (date) { // 选择时间
			this.addParams.createTime = date
		},
		selectTree () { // 选择运营商
			this.$refs.formInline.validateField('agentUuid')
		},
		importSuccess (response) {
			this.addParams.sessionId = response.data
		},
		commit (temp) {
			if(temp) {
				this.$refs.formInline.validate(res => {
					if(res){
						let time = this.addParams.createTime
						if(Date.parse(time) < (new Date()).getTime()){
							this.$Message.error('发送时间不得早于当前时间！')
						} else {
							let params = {...this.addParams}
							if (this.addParams.sendName === '0') { // 乘客
								if (this.addParams.driver === '0') params.driver = 2 // 指定乘客
								if (this.addParams.driver === '1') params.driver = 10 // 用户群组
								if (this.addParams.driver === '2') params.driver = 5 // 乘客批量
							} else { // 司机
								if (this.addParams.driver === '0') params.driver = 3 // 指定司机
								if (this.addParams.driver === '1') params.driver = 4 // 指定运营商
								if (this.addParams.driver === '2') params.driver = 7 // 司机批量
							}
							if (this.addParams.driver === '0') { // 指定乘客/指定司机
								params.mobiles = params.mobiles.split(',')
							}
							if (this.addParams.driver === '2') { // 批量导入
								let sessionId = params.sessionId || null
								if (sessionId === null) this.$Message.warning('请先导入数据')
							}
							params.sendName = Number(params.sendName)
							sendMessage(params).then(res => {
								this.$emit('input', false)
								this.$emit('on-confirm')
								this.$Message.success('创建成功')
							})
						}
					}
				})
			} else {
				this.$emit('input', false)
			}
		}
	}
}
</script>