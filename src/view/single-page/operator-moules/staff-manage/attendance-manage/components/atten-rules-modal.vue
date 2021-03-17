<template>
  <Modal v-model="isModel" title="考勤规则版本" width="830" @on-ok="close" @on-cancel="close">
    <p>{{provinceCity}}</p>
    <Table class="top15" :columns="modalType===1?dColumns:mColumns" :data="tableData" :loading="isLoading"></Table>
  </Modal>
</template>
<script>
import { axiosExamineInfo } from '@/api/driver.js';
export default {
  props: {
    isAttenRulesModal: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: ()=>{
        return {}
      }
    },
    modalType: {
      type: String,
      default: '1'//1日考勤管理，2月考勤管理
    }
  },
  data() {
    return {
      isModel: false,
      dColumns: [
        {
          title: "日在线时长",
          key: "onlineDuration"
        },
        {
          title: "日高峰在线时长",
          key: "heightDuration"
        },
        {
          title: "创建时间",
          key: "createTime"
        },
        {
          title: "版本号",
          key: "version"
        }
      ],
      mColumns: [
        {
          title: "日均在线时长",
          key: "onlineDuration"
        },
        {
          title: "日均高峰在线时长",
          key: "heightDuration"
        },
        {
          title: "创建时间",
          key: "createTime"
        },
        {
          title: "版本号",
          key: "version"
        }
      ],
      isLoading:false,
      tableData: [],
      provinceCity:''
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    getInfo(){
      this.isLoading = true
      axiosExamineInfo(this.params).then(res => {
        if(res.data.success){
          let data = res.data.data||{}
          this.tableData = [data]
          this.provinceCity = data.cityName
          this.isLoading = false
        }else{
          this.isLoading = false
          this.$Message.error('请求数据出错')
        }
      })
    }
  },
  watch: {
    isAttenRulesModal(newVal) {
      this.isModel = newVal;
      if(newVal){
        this.getInfo()
      }
    }
  }
};
</script>
