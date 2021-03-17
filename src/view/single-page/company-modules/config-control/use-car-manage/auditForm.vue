<template>
  <div class="audit-form-container">
       <div class="operate-btn">
             <Button type="primary" v-if="showDetail" @click="showDetail = false">编辑</Button>
            <Button type="success" v-else @click="saveInfo">保存</Button>
        </div>
    <Form :model="auditForm" :rules="auditFormRule" ref="auditForm"  v-show="!showDetail">
      <FormItem label="时间范围：">
            <CheckboxGroup  v-model="auditFormRule.timeRange">
                <Checkbox  label="unlimit">
                    <span>不限</span>
                </Checkbox >
                <Checkbox  label="week">
                    <span>按星期</span>
                </Checkbox >
                <Checkbox  label="date">
                    <span>按日期</span>
                </Checkbox >
            </CheckboxGroup >
      </FormItem>
      <FormItem label="地点范围：">
          <CheckboxGroup  v-model="auditFormRule.placeRange">
                <Checkbox  label="toHome">
                    <span>下班后，从公司回家</span>
                </Checkbox >
                <Checkbox  label="toCompany">
                    <span>从家出发到公司</span>
                </Checkbox >
            </CheckboxGroup >
      </FormItem>
      <FormItem label="用车限额：">
          <CheckboxGroup  v-model="auditFormRule.useCarRange">
                <Checkbox  label="monthlimit">
                    <span>月限额</span>
                </Checkbox >
                <Checkbox  label="daylimit">
                    <span>日限额</span>
                </Checkbox >
                <Checkbox  label="singlelimit">
                    <span>单笔限额</span>
                </Checkbox >
            </CheckboxGroup >
      </FormItem>
      <FormItem label="同城限制：">
          <CheckboxGroup  v-model="auditFormRule.cityRange">
                <Checkbox  label="citylimit">
                    <span>起点和终点必须是同一个城市</span>
                </Checkbox >
            </CheckboxGroup >
      </FormItem>
      <FormItem label="订单类型：">
          <CheckboxGroup  v-model="auditFormRule.orderType">
                <Checkbox  label="imbediate">
                    <span>实时单</span>
                </Checkbox >
                <Checkbox  label="bespoke">
                    <span>预约单</span>
                </Checkbox >
            </CheckboxGroup >
      </FormItem>
      <FormItem label="用车分类：">
          <CheckboxGroup  v-model="auditFormRule.useCarType">
                <Checkbox  label="fast">
                    <span>快车</span>
                </Checkbox >
                <Checkbox  label="special">
                    <span>专车</span>
                </Checkbox >
            </CheckboxGroup >
      </FormItem>
       <FormItem label="用车备注：">
          <CheckboxGroup  v-model="auditFormRule.useCarRmark">
                <Checkbox  label="remark">
                    <span>备注</span>
                </Checkbox >
            </CheckboxGroup >
      </FormItem>
      <FormItem label="审批人设置：">
        <CheckboxGroup  v-model="auditFormRule.setApprover">
            <Checkbox  label="1">
                <span>1级</span>
            </Checkbox >
            <Checkbox  label="2">
                <span>2级</span>
            </Checkbox >
            <Checkbox  label="3">
                <span>3级</span>
            </Checkbox >
        </CheckboxGroup >
      </FormItem>
      <FormItem>
        <div class="add-company" @click="addRule">
            <Icon type="ios-add-circle-outline" style="color: #2d8cf0;"/>
            <span class="addText">添加条件：</span>
        </div>
        <Select v-model="addRuleValue" style="width:200px; display: inline-block;">
            <Option v-for="item in ruleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
    </Form>
    <section class="detail-box" v-show="showDetail">
        <div>
            <span class="label">时间范围：</span>
            <span class="value">不限</span>
        </div>
    </section>
  </div>
</template>
<script>
export default {
  name: "auditForm",
  props:{
     isShowDetail: {
          type: Boolean,
          default: true
     }
  },
  watch: {
      isShowDetail(value) {
          this.showDetail = value;
      }
  },
  data() {
    return {
        showDetail: this.isShowDetail,
        auditForm: {
        },
        auditFormRule: {
        },
        addRuleValue: null,
        ruleList:[
            {
                value: 1,
                label: '时间范围'
            },
             {
                value: 2,
                label: '地点范围'
            },
             {
                value: 3,
                label: '用车限制'
            },
             {
                value: 4,
                label: '同城限制'
            },
             {
                value: 5,
                label: '订单类型'
            },
             {
                value: 6,
                label: '用车分类'
            },
             {
                value: 7,
                label: '用车备注'
            },
             {
                value: 8,
                label: '审批人设置'
            },
        ]
    };
  },
  methods: {
    resetForm() {
        this.$refs.auditForm.resetFields();
    },
    saveInfo() {
        this.$refs.auditForm.validate(valid=>{
            if(valid) {
                this.$emit('saveForm', this.auditForm)
            }
        })
    },
    addRule() {
        console.log(this.addRuleValue)
    }
  }
};
</script>
<style lang="less" scoped>
    .operate-btn {
        position: absolute;
        right: 10px;
        z-index: 1000;
    }
    .audit-form-container {
        position: relative;
    }
    .detail-box {
         font-size: 16px;
    }
   .add-company {
    display: inline-block;
    cursor: pointer;
    .addText {
        display: inline-block;
         margin-left: 5px;
        font-size: 16px;
        color: #2d8cf0;
        letter-spacing: 0;
        text-align: left;
        line-height: 22px;
    }
  }
</style>
