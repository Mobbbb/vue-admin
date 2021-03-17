<template>
	<div style="padding: 0 30px;">
		<Form ref="formInline" :label-width="90">
			<FormItem label="任务名称 :">
            	{{addParams.taskName}}
          	</FormItem>
	        <FormItem label="发送对象 :">
	          	{{sendMap[addParams.sendName]}}
	        </FormItem>
	        <FormItem label="发送范围 :">
	          	{{driverMap[addParams.driver]}}
	          	<!--导出-->
	          	<Button 
	          		ghost
	          		type="success"
	          		size="small"
	          		@click="exportFile"
	          		v-if="addParams.driver === 5 || addParams.driver === 7"
	          		style="margin-left: 10px;">数据导出
	          	</Button>
	        </FormItem>
	        <FormItem label="用户分群 :" v-if="addParams.driver === 10">
	          	{{addParams.userGroupName}}
	        </FormItem>
	        <FormItem label="业务类型 :" v-if="addParams.driver === 4">
	          	{{typeModuleMap[addParams.businessTypes]}}
	        </FormItem>
	        <FormItem label="运营商 :" v-if="addParams.driver === 4">
	          	<span v-if="addParams.operators.length">{{addParams.operators.join('、')}}</span>
	          	<span v-else>暂无</span>
	        </FormItem>
	        <!--指定乘客-->
	        <FormItem label="乘客列表 :" v-if="addParams.driver === 2">
	          	<div v-if="addParams.passengerList.length">
	        		<span v-for="item in addParams.passengerList">
		          		<span style="margin-right: 5px;">{{item.phone}}</span>
		          	</span>
	        	</div>
	          	<span v-else>暂无</span>
	        </FormItem>
	        <!--指定司机-->
	        <FormItem label="司机列表 :" v-if="addParams.driver === 3">
	        	<div v-if="addParams.driverList.length">
	        		<span v-for="item in addParams.driverList">
		          		<span style="margin-right: 5px;">{{item.phone}}</span>
		          	</span>
	        	</div>
	          	<span v-else>暂无</span>
	        </FormItem>
	        <FormItem label="对象数量 :">
	          	{{addParams.targetNum}}人
	        </FormItem>
	        <FormItem label="消息内容 :">
	          	{{addParams.content}}
	        </FormItem>
	        <FormItem label="状态 :">
	          	{{taskStatusMap[addParams.taskStatus]}}
	        </FormItem>
	        <FormItem label="发送时间 :">
	          	{{addParams.sendTime}}
	        </FormItem>
    	</Form>
    	<div class="popView-footer-wrap">
            <Button size="large" type="text" @click="commit" style="margin-right: 8px;">取消</Button>
            <Button size="large" type="primary" @click="commit">确定</Button>
        </div>
	</div>
</template>

<script>
import { messageDetail } from '@/api/announcement'
import { driverMap, sendMap, taskStatusMap } from '../fields'
import { typeModuleMap } from '@/libs/status-map'
import { exportFile } from '@/libs/tools'

export default {
	props: {
		value: {
			type: Boolean
		},
		uuid: {
			type: String
		}
	},
	data() {
	    return {
	    	sendMap,
	    	driverMap,
	    	taskStatusMap,
	    	typeModuleMap,
	    	addParams: {}
	    }
	},
	watch: {
		value () {
			if (this.value) {
				this.addParams = {}
				this.getDetail()
			}
		}
	},
	methods: {
		getDetail () {
			messageDetail({ uuid: this.uuid }).then(res => {
				this.addParams = res.data.data
			})
		},
		exportFile () {
			exportFile({}, '/admin/sms/export/' + this.addParams.batchNo, '数据导出', 'get')
		},
		commit (temp) {
			this.$emit('input', false)
		}
	}
}
</script>