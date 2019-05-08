<!--坏账策略-->
<template>
	<div>
		<Row>
			<Col span="6">&nbsp </Col>
			<Col span="7"><span style="display:flex;height:29px;align-items:center;padding-left: 18px;">数值</span></Col>
      <Col span="7"><span style="display:flex;height:29px;align-items:center;padding-left: 10px;">参考值</span></Col>
			<Col span="4">
			  <Button type="primary" v-if="!editable" @click="edit">编辑</Button>
			</Col>
		</Row>
		<Divider />
		<Form :model="bdForm" label-position="left" :label-width="140" :rules="ruleValidate" ref="bdForm">
			<FormItem label="实名额度" prop='realNameFare'>
				<span v-if="!editable" style="width:90px">{{onedata.realNameFare}}</span>
				<Input v-if="editable" v-model="bdForm.realNameFare" style="width: 112px"></Input>
                <span   style="display:inline-block;float:right;margin-right:180px">0-100</span>
			</FormItem>
            <FormItem label="城市级别" prop="cityFare">
				<span v-if="!editable">{{onedata.cityFare}}</span>
				<Input v-if="editable" v-model="bdForm.cityFare" style="width: 112px"></Input>
                <span style="display:inline-block;float:right;margin-right:180px">0-100</span>
			</FormItem>
            <FormItem label="企业员工" prop="companyFare">
				<span v-if="!editable" sty>{{onedata.companyFare}}</span>
				<Input v-if="editable" v-model="bdForm.companyFare" style="width: 112px"></Input>
                <span style="display:inline-block;float:right;margin-right:180px">0-100</span>
			</FormItem>
            <FormItem label="用户等级A" prop="userLevelA">
				<span v-if="!editable">{{onedata.userLevelA}}</span>
				<Input v-if="editable" v-model="bdForm.userLevelA" style="width: 112px"></Input>
                <span style="display:inline-block;float:right;margin-right:180px">0-100</span>
			</FormItem>
            <FormItem label="用户等级B" prop="userLevelB">
				<span v-if="!editable">{{onedata.userLevelB}}</span>
				<Input v-if="editable" v-model="bdForm.userLevelB" style="width: 112px"></Input>
                <span style="display:inline-block;float:right;margin-right:180px">0-100</span>
			</FormItem>
            <FormItem label="用户等级C" prop="userLevelC">
				<span v-if="!editable">{{onedata.userLevelC}}</span>
				<Input v-if="editable" v-model="bdForm.userLevelC" style="width: 112px"></Input>
                <span style="display:inline-block;float:right;margin-right:180px">0-100</span>
			</FormItem>
            <FormItem label="用户等级D" prop="userLevelD">
				<span v-if="!editable">{{onedata.userLevelD}}</span>
				<Input v-if="editable" v-model="bdForm.userLevelD" style="width: 112px"></Input>
                <span style="display:inline-block;float:right;margin-right:180px">0-100</span>
			</FormItem>
            <FormItem label="用户等级E" prop="userLevelE">
				<span v-if="!editable">{{onedata.userLevelE}}</span>
				<Input v-if="editable" v-model="bdForm.userLevelE" style="width: 112px"></Input>
                <span style="display:inline-block;float:right;margin-right:180px">0-100</span>
			</FormItem>
            
			
		</Form>
        <div>
            <Button v-if="editable"  type="success" @click="handleSave('bdForm')">保存</Button>
        </div>
	</div>
</template>
<script>
import {editbdModel} from '@/api/configData.js'
//这是一个验证1-100数字的验证函数
		const validateZHNum =(rule, value, callback)=>{
			if(value=== ''){
				callback(new Error('请填写内容'));
			}else if (!/^(?:0|[1-9][0-9]?|100)$/.test(value)) {
				callback('只能0-100的整数');
				}else {
			callback();
				}   
			};
export default {
  name: "bd-tab",
  props:{
      strategyType: String,
      editable: {
          type:Boolean,
          default:false
      },
      onedata:{
          type: Object,
          default:()=>{
              return 
          }
      }
  },
  data() {
    return {
      formItem: "",
      editable2: false,
      bdForm: {
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
      ],
      ruleValidate:{
          realNameFare:[{ validator:validateZHNum, trigger: 'blur' }],
          cityFare:[{ validator:validateZHNum, trigger: 'blur' }],
          companyFare:[{ validator:validateZHNum, trigger: 'blur' }],
          userLevelA:[{ validator:validateZHNum, trigger: 'blur' }],
          userLevelB:[{ validator:validateZHNum, trigger: 'blur' }],
          userLevelC:[{ validator:validateZHNum, trigger: 'blur' }],
          userLevelD:[{ validator:validateZHNum, trigger: 'blur' }],
          userLevelE:[{ validator:validateZHNum, trigger: 'blur' }],
      }
    };
  },
  methods: {
    edit() {
      this.editable2 = this.editable;
      this.$emit("update:editable",true)
      this.bdForm = this.onedata

    },
    handleSave(name){
        // console.log(this.bdForm)
        let data = this.bdForm
        this.$refs[name].validate((valid) => {
                    if (valid) {
                         editbdModel(data).then(res =>{
                        if(res.data.success){
                            this.$Message.success('保存成功')
                            this.$emit("update:editable",false)
                        }
                        else{
                            this.$Message.error(res.data.errorMsg);
                        }
                    })
                    } else {
                        this.$Message.error('请合法填写');
                    }
                })
       
    }
  }
};
</script>
