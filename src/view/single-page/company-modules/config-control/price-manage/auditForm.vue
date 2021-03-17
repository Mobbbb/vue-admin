<template>
  <div class="audit-form-container">
    <Form :model="auditForm" :rules="auditFormRule" ref="auditForm" v-show="!showDetail">
      <FormItem label="冻结倍率：" prop="rate">
        <span>
          该企业冻结金额为预估费用的&nbsp;
          <InputNumber v-model="auditForm.rate" :min="1" :step="0.01"></InputNumber>&nbsp;倍
        </span>
      </FormItem>
      <FormItem label="基准企业折扣：" prop="discount">
        <span>
          该企业采用基础定价的&nbsp;
          <InputNumber v-model="auditForm.discount" :min="0.01" :step="0.01" :max="9.99"></InputNumber>&nbsp;折
        </span>
      </FormItem>
      <FormItem label="企业直减：" prop="mimus">
        <InputNumber v-model="auditForm.mimus" :min="1" :max="99" :step="0.1"></InputNumber>&nbsp;元
      </FormItem>
      <div class="add-company" @click="addCompanyData">
        <Icon type="ios-add-circle-outline" color="#2d8cf0"/>
        <span class="addText">添加新的城市折扣</span>
      </div>
      <Card v-for="(single,index) in auditForm.discountlist" :key="index">
        <div class="delete-company">
          <Icon type="ios-trash-outline" size="16" color="#2d8cf0"/>
          <span class="addText" @click="deleteItem(index)">删除</span>
        </div>
        <FormItem
          label="选择城市:"
          :prop='"discountlist."+index+".citys"'
          :rules="{required: true, message: '必填'}"
        >
        <el-cascader  v-model='single.citys' ref="cascader" :props='cascaderProps' :options="cascaderList"></el-cascader>

          <!-- <al-cascader
            level="1"
            ref="alCascader"
            v-model="single.citys"
            style="display: inline-block;width:190px"
          /> -->
        </FormItem>
        <FormItem label="基准企业折扣：" :rules="discountRule" :prop='"discountlist."+index+".discount"'>
          <span>
            该企业采用基础定价的&nbsp;
            <InputNumber v-model="single.discount" :min="0.01" :step="0.01" :max="9.99"></InputNumber>&nbsp;折
          </span>
        </FormItem>
        <FormItem label="企业直减：" :rules="mimusRule" :prop='"discountlist."+index+".mimus"'>
          <InputNumber v-model="single.mimus" :min="1" :max="99" :step="0.1"></InputNumber>&nbsp;元
        </FormItem>
      </Card>
    </Form>
    <section class="detail-box" v-show="ishasData">
      <div>
        <span class="label">冻结倍率：</span>
        <span class="value">该企业冻结金额为预估费用的 {{detailData.rate}}倍</span>
      </div>
      <div>
        <span class="label">基准企业折扣：</span>
        <span class="value">该企业采用基础定价的 {{detailData.discount}} 折</span>
      </div>
      <div>
        <span class="label">企业直减：</span>
        <span class="value">{{detailData.mimus}}元</span>
      </div>
     <Table :columns="detailColumns" :data="detailData.discountlist"></Table>
    </section>
  </div>
</template>
<script>
let mimusRule = {
  pattern: /^([1-9]{1,2}|[1-9]{1,2}[.]\d{1,1})$/,
  message: "请输入大于等于1小于100的数字，可以保留1位小数"
};
let discountRule = {
  pattern: /^([0-9]{1,1}|[0-9]{1,1}[.]\d{1,2})$/,
  required: true,
  message: "请输入大于0小于10的数字，保留0-2位小数"
};
import { getCityList} from "@/api/company-api/common.js"
import { cpTranslate } from "@/libs/tools";
export default {
  name: "auditForm",
  components:{
  },
  props: {
    isShowDetail: {
      type: Boolean,
      default: true
    },
    detailData:{
        type: [Array, Object],
        default: ()=>{
            return [];
        }
    },
    tabName:{
         type: Number,
         default: 4
    }
  },
  computed:{
      ishasData(){
        return this.showDetail && Object.keys(this.detailData).length > 0;
      }
  },
  watch: {
    isShowDetail(value) {
      this.showDetail = value;
    }
  },
  data() {
    return {
      mimusRule,
      cascaderProps:{ multiple: true },
       loginName:this.$store.state.user.userName,
      cascaderList:JSON.parse(localStorage.getItem("companyCityList")),
      discountRule,
      showDetail: this.isShowDetail,
      detailColumns:[
            {
                key: 'cityName',
                title: '城市'
            },
            {
                key: 'discount',
                title: '折扣'
            },
            {
                key: 'mimus',
                title: '直减金额'
            }
      ],
      auditForm: {
        rate: null,
        discount: null,
        mimus: null,
        discountlist: [
          {
            citys: [],
            loginName: this.loginName,
            discount: null,
            mimus: null
          }
        ]
      },
      auditFormRule: {
        rate: [
          {
            pattern: /^([1-9]{1,}|[1-9]{1,}[.]\d{1,2})$/,
            required: true,
            message: "请输入大于1的数字，可以保留0-2位小数"
          }
        ], //倍率
        discount: [discountRule],
        mimus: [mimusRule]
      }
    };
  },
  created(){
      this.getSavedCity()
  },
  methods: {
    getSavedCity() {//获取城市列表
      let data = { bussniseType:this.tabName };
      getCityList(data).then(res => {
        if(res.data.success) {
            this.cascaderList = JSON.parse(JSON.stringify(cpTranslate(res.data.data)));
        }
      });
    },
    addCompanyData() {
      this.auditForm.discountlist.push({
        citys: [],
        loginName: this.loginName,
        discount: null,
        mimus: null
      });
    },
    deleteItem(i) {
      this.auditForm.discountlist.splice(i, 1);
    },
    resetForm() {
      this.$refs.auditForm.resetFields();
    },
    getCityLable(){//获取城市的名字
        let cityLabelMap = {}
        this.cascaderList.forEach(city=>{
            if(city.children.length>0){
                city.children.map(item=>{//仅获取省份下对应城市的名字
                    cityLabelMap[item.value] = item.label
                })
            }
        })
        return cityLabelMap;
    },
    saveInfo() {
        let isValid = false;
        this.$refs.auditForm.validate(valid => {
            isValid = valid;
        });
        if (isValid) {
            let resultForm = { ...this.auditForm };
            let cityLabels = this.getCityLable();
            resultForm.discountlist = []
            this.auditForm.discountlist.map(data => {
                data.citys.forEach(city=>{
                    let code = city[1];
                    let store = {
                        discount: data.discount,//城市折扣列表
                        mimus: data.mimus,//直减金额
                        loginName: this.loginName,//登录人
                        cityCode: code,//城市编码
                        cityName: cityLabels[code]//城市名称
                    };
                    resultForm.discountlist.push(store)
                })
            });
            return resultForm;
      }
      return null;
    },
  }
};
</script>
<style lang="less" scoped>
.audit-form-container {
  position: relative;
}
.detail-box {
  font-size: 16px;
}
.add-company {
  display: inline-block;
  cursor: pointer;
  padding: 10px;
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
.delete-company {
  //   float: right
  position: absolute;
  right: 10px;
  font-size: 16px;
  z-index: 1000;
  color: #2d8cf0;
  .addText {
    cursor: pointer;
  }
}
</style>
