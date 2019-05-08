<!--坏账策略弹窗-->
<template>
    <div style="margin-top:20px">
            <p>所选城市：{{cityName}}</p>
            <br>
            <BdTab :strategyType='strategyTypeFlag' :editable.sync='editable' ref="tabChild1" :onedata='theData' ></BdTab>
    </div>
</template>
<script>
import BdTab from "./bdTab.vue";
import {getBdStrategy} from '@/api/configData.js'
export default {
  name: "bd-modal",
  props: {
    isShow: {
      type: Boolean
    },
    strategyType: String,
    cityuuid: String,
    cityName: String
  },
  components: { BdTab },
  data() {
    return {
      isShowP: "",
      formItem: "",
	  editable: false,
    strategyTypeFlag: 'instant',
    theData:{},
	  
    };
  },
  created(){
    this.getBdData()
  },
  watch: {
    isShow(newVal) {
      this.isShowP = newVal;
      this.$emit("update:isShow", false);
    }
  },
  methods: {
    cancel(val) {
      this.editable = false;
      this.$emit("modalClose", false);
      
    },
    getBdData(){
      let data ={cityUuid: this.cityuuid}
      getBdStrategy(data).then(res =>{
        this.theData = res.data.data
      })
    },
    save() {
      this.$emit("modalClose", false);
      this.editable = false;
    },
    getChild:function(val){
    }

  }
};
</script>
<style  lang="less" >
.pd-lr-10 {
  padding-left: 10px;
  padding-right: 10px;
}
</style>