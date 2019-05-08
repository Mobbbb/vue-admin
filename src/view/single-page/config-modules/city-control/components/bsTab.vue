<!--定价策略-->
<template>
	<div>
		<Row>
			<Col span="8">&nbsp</Col>
			<Col span="8">
				<span style="display:flex;height:29px;align-items:center;padding-left: 43px;">数值</span>
			</Col>
			<Col span="8">
				<Button type="primary" v-if="!editable" @click="edit">编辑</Button>
			</Col>
		</Row>
		<Divider style="margin-top: 15px;"/>
		<!-- {{onedata.orderTypeTime}} -->
		<Form :model="formLeft" label-position="left" :label-width="200" :rules='ruleValidate' ref="formLeft">
			<FormItem label="起步费(元）" prop="startFare">
				<span v-if="!editable">{{onedata.startFare}}</span>
				<Input v-if="editable" v-model="formLeft.startFare" style="width: 112px" ></Input>
			</FormItem>
			<FormItem label="起步里程（公里)" prop="startTrip">
				<span v-if="!editable">{{onedata.startTrip}}</span>
				<Input v-if="editable" v-model="formLeft.startTrip" style="width: 112px"></Input>
			</FormItem>
			<FormItem label="起步时长（分钟）" prop="startDuration">
				<span v-if="!editable">{{onedata.startDuration}}</span>
				<Input v-if="editable" v-model="formLeft.startDuration" style="width: 112px"></Input>
			</FormItem>
			<FormItem label="时长费(元/分钟)" prop="beyondTimeFare">
				<span v-if="!editable">{{onedata.beyondTimeFare}}</span>
				<Input v-if="editable" v-model="formLeft.beyondTimeFare" style="width: 112px"></Input>
			</FormItem>
			<FormItem label="里程费（元/公里)" prop="beyondTripFare">
				<span v-if="!editable">{{onedata.beyondTripFare}}</span>
				<Input v-if="editable" v-model="formLeft.beyondTripFare" style="width: 112px"></Input>
			</FormItem>
			<FormItem label="预约单免费等待时间（分钟）" prop="freeWaitTime" v-if="strategyType === '2'">
				<span v-if="!editable">{{onedata.freeWaitTime}}</span>
				<Input v-if="editable" v-model="formLeft.freeWaitTime" style="width: 112px"></Input>
			</FormItem>
			<FormItem label="超时等待费（元/分钟)" prop="beyondWaitFare">
				<span v-if="!editable">{{onedata.beyondWaitFare}}</span>
				<Input v-if="editable" v-model="formLeft.beyondWaitFare" style="width: 112px"></Input>
			</FormItem>

			<FormItem label="预约单司机可迟到时间（分钟)" prop="allowLateTime" v-if="strategyType === '2'">
				<span v-if="!editable">{{onedata.allowLateTime}}</span>
				<Input v-if="editable" v-model="formLeft.allowLateTime" style="width: 112px"></Input>
			</FormItem>
			<FormItem 
				:label="strategyType === '1' ? '实时单乘客免费取消时间（分钟)' : '预约单无责取消时间（分钟)'" 
				prop="freeCancelTime">
				<span v-if="!editable">{{onedata.freeCancelTime}}</span>
				<Input v-if="editable" v-model="formLeft.freeCancelTime" style="width: 112px"></Input>
			</FormItem>

			<FormItem label="远程里程（公里）" prop="haulBackTrip">
				<span v-if="!editable">{{onedata.haulBackTrip}}</span>
				<Input v-if="editable" v-model="formLeft.haulBackTrip" style="width: 112px"></Input>
			</FormItem>
			<FormItem label="远程里程费（元/公里)" prop="haulBackTripFare">
				<span v-if="!editable">{{onedata.haulBackTripFare}}</span>
				<Input v-if="editable" v-model="formLeft.haulBackTripFare" style="width: 112px"></Input>
			</FormItem>
			<FormItem label="夜间服务时段" v-if="strategyType === '1'">
				<span v-if="!editable">{{onedata.nightTimeStr}} </span>
				<TimePicker 
					:clearable="false"
					v-if="editable" 
					:value="nightTimestr.start" 
					v-model="nightTimestr.start" 
					format="HH:mm" 
					placeholder="Select time" 
					style="width: 112px" 
					@on-change="updateTime()">
				</TimePicker>
				<span v-if="editable" class="pd-lr-10">至</span>
				<TimePicker 
					:clearable="false"
					v-if="editable" 
					:value="nightTimestr.end" 
					v-model="nightTimestr.end" 
					format="HH:mm" 
					placeholder="Select time" 
					style="width: 112px" 
					@on-change="updateTime()">	
				</TimePicker>
			</FormItem>
			<FormItem label="夜间费（元/公里)"  prop="nightTripFare">
				<span v-if="!editable">{{onedata.nightTripFare}}</span>
				<Input v-if="editable" v-model="formLeft.nightTripFare" style="width: 112px"></Input>
			</FormItem>
			<FormItem label="平台取消费（元)"  prop="sysCancelFare">
				<span v-if="!editable">{{onedata.sysCancelFare}}</span>
				<Input v-if="editable" v-model="formLeft.sysCancelFare" style="width: 112px"></Input>
			</FormItem>
			<FormItem label="乘客取消费（元)"  prop="ownCancelFare">
				<span v-if="!editable">{{onedata.ownCancelFare}}</span>
				<Input v-if="editable" v-model="formLeft.ownCancelFare" style="width: 112px"></Input>
			</FormItem>
			<FormItem label="早高峰时段" v-if="strategyType === '1'">
				<span v-if="!editable">{{onedata.premiumOneTime}}</span>
				<TimePicker 
					v-if="editable" 
					:clearable="false"
					:value="premiumOneTime.start"
					v-model="premiumOneTime.start"
					format="HH:mm" 
					placeholder="Select time"
					@on-change="updateTime()" 
					style="width: 112px">
				</TimePicker>
				<span v-if="editable" class="pd-lr-10">至</span>
				<TimePicker 
					v-if="editable" 
					:clearable="false"
					:value="premiumOneTime.end" 
					v-model="premiumOneTime.end" 
					@on-change="updateTime()" 
					format="HH:mm" 
					placeholder="Select time" 
					style="width: 112px">	
				</TimePicker>
			</FormItem>
			<!--<FormItem label="高峰调价1（倍率)" prop="premiumOneRate">
				<span v-if="!editable">{{onedata.premiumOneRate}}</span>
				<Input v-if="editable" v-model="formLeft.premiumOneRate" style="width: 112px"></Input>
			</FormItem>-->
			<FormItem label="晚高峰时段" v-if="strategyType === '1'">
				<span v-if="!editable">{{onedata.premiumTwoTime}}</span>
				<TimePicker 
					:clearable="false"
					v-if="editable" 
					:value="premiumTwoTime.start" 
					v-model="premiumTwoTime.start" 
					format="HH:mm" 
					placeholder="Select time" 
					style="width: 112px" 
					@on-change="updateTime()">	
				</TimePicker>
				<span v-if="editable" class="pd-lr-10">至</span>
				<TimePicker 
					:clearable="false"
					v-if="editable" 
					:value="premiumTwoTime.end" 
					v-model="premiumTwoTime.end" 
					format="HH:mm" 
					placeholder="Select time" 
					style="width: 112px" 
					@on-change="updateTime()">
				</TimePicker>
			</FormItem>
			<!--<FormItem label="高峰调价2（倍率)" prop="premiumTwoRate">
				<span v-if="!editable">{{onedata.premiumTwoRate}}</span>
				<Input v-if="editable" v-model="formLeft.premiumTwoRate" style="width: 112px"></Input>
			</FormItem>-->
			<FormItem label="其他高峰时段" v-if="strategyType === '1'">
				<span v-if="!editable">{{onedata.premiumThreeTime}}</span>
				<TimePicker 
					:clearable="false"
					v-if="editable" 
					:value="premiumThreeTime.start" 
					v-model="premiumThreeTime.start" 
					format="HH:mm" 
					placeholder="Select time" 
					style="width: 112px" 
					@on-change="updateTime()">
				</TimePicker>
				<span v-if="editable" class="pd-lr-10">至</span>
				<TimePicker 
					:clearable="false"
					v-if="editable" 
					:value="premiumThreeTime.end" 
					v-model="premiumThreeTime.end" 
					format="HH:mm" 
					placeholder="Select time" 
					style="width: 112px" 
					@on-change="updateTime()">	
				</TimePicker>
			</FormItem>
		</Form>
		<Row>
			<Col span="5" offset="21">
				<Button @click="validating" type="success" v-if="editable">保存</Button>
			</Col>
		</Row>
	</div>
</template>

<script>
import {updateCarModel} from '@/api/configData.js'

export default {
  	name: "bs-tab",
  	props: {
		strategyType: String,
		editable: Boolean,
		wholeData: {
			type: Object,
			default: () =>{
				return 
			}
		},
		onedata: {
			type: Object,
			default: () =>{
				return 
			}
		}
	},
  	data() {
		//这是一个验证数字的验证函数
		const validateNum =(rule, value, callback)=>{
			if(value=== ''){
				callback(new Error('请填写内容'));
			} else if (!/^\d+(\.\d+)?$/.test(value)) {
				callback('只能输入数字');
			} else {
				callback();
			}
		};
	    return {
	     	formItem: "",
	      	editable1: false,
	      	formLeft: { 
				startFare:''	
			},
			nightTimestr:{
				start: '',
				end: ''
			},
			premiumOneTime:{
				start: '',
				end: ''
			},
			premiumTwoTime:{
				start: '',
				end: ''
			},
			premiumThreeTime:{
				start: '',
				end: ''
			},
			ruleValidate: {
				startFare: [{ validator:validateNum, trigger: 'change' }],
				startTrip: [{ validator:validateNum, trigger: 'change' }],
				startDuratio: [{ validator:validateNum, trigger: 'change' }],
				startDuration: [{ validator:validateNum, trigger: 'change' }],
				beyondTimeFare: [{ validator:validateNum, trigger: 'change' }],
				beyondTripFare: [{ validator:validateNum, trigger: 'change' }],
				freeWaitTime: [{ validator:validateNum, trigger: 'change' }],
				beyondWaitFare: [{ validator:validateNum, trigger: 'change' }],

				allowLateTime: [{ validator:validateNum, trigger: 'change' }],
				freeCancelTime: [{ validator:validateNum, trigger: 'change' }],

				haulBackTrip: [{ validator:validateNum, trigger: 'change' }],
				haulBackTripFare: [{ validator:validateNum, trigger: 'change' }],
				nightTripFare: [{ validator:validateNum, trigger: 'change' }],
				sysCancelFare: [{ validator:validateNum, trigger: 'change' }],
				ownCancelFare: [{ validator:validateNum, trigger: 'change' }],
				premiumOneRate: [{ validator:validateNum, trigger: 'change' }],
				premiumTwoRate: [{ validator:validateNum, trigger: 'change' }],
			},
	      	columns1: [
		        {
		          title: "",
		          key: "title"
		        },
		        {
		          title: "数值",
		          key: "value"
		        }
	      	]
	    };
  	},
  	methods: {
	    edit() {
			this.$emit("update:editable",true)
			this.editable1 = true
			this.$emit('recieve',true)
			this.formLeft = this.onedata;
			this.dealTime()
		},
		validating(){
			this.$refs['formLeft'].validate((valid) => {
	            if (valid) {
					let data = this.formLeft
					updateCarModel(data).then(res => {
						this.$Message.success('修改成功')
						this.$emit("update:editable",false)
					})
	            }
	      	})
		},
		dealTime(){ // 点击编辑拆分时间
			let [arr, arr2, arr3, arr4] = [
				this.formLeft.nightTimeStr, 
				this.formLeft.premiumOneTime, 
				this.formLeft.premiumTwoTime,
				this.formLeft.premiumThreeTime
			]
			let newarr = arr.split('-')
			let newarr2 = arr2.split('-')
			let newarr3 = arr3.split('-')
			let newarr4 = arr4 && arr4.split('-') || []
			this.nightTimestr.start = newarr[0]
			this.nightTimestr.end = newarr[1]
			this.premiumOneTime.start = newarr2[0]
			this.premiumOneTime.end = newarr2[1]
			this.premiumTwoTime.start = newarr3[0]
			this.premiumTwoTime.end = newarr3[1]
			this.premiumThreeTime.start = newarr4 && newarr4.length && newarr4[0]
			this.premiumThreeTime.end = newarr4 && newarr4.length && newarr4[1]
		},
		updateTime(){
			this.formLeft.nightTimeStr = this.nightTimestr.start + '-' + 	this.nightTimestr.end ;
			this.formLeft.premiumOneTime = this.premiumOneTime.start + '-' + 	this.premiumOneTime.end ;
			this.formLeft.premiumTwoTime = this.premiumTwoTime.start + '-' + 	this.premiumTwoTime.end ;
			this.formLeft.premiumThreeTime = this.premiumThreeTime.start + '-' + 	this.premiumThreeTime.end ;
		}
  	}
};
</script>
