<!--接单设备管理-->
<template>
  <div>
    <searchList :inputList="inputList" @on-search='handleSearch' @on-reset="reset"></searchList>
    <VTable
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :isLoading="isLoading"
      :parColumns="parColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize">
    </VTable>
    <Modal 
      :width="470"
      :mask-closable="false"
      v-model="popSwitch"
      title="切换接单设备"  
      footer-hide>
      <SwitchView :info="switchInfo" :popView="popSwitch" @on-confirm="confirm"></SwitchView>
    </Modal>
  </div>
</template>
<script>
  import { inputList, Columns } from "./index";
  import { getOrderEquipmentList, getVinInfo, saveNewEquipConfig } from '@/api/configData.js'
  import { changeKeyMethod } from '@/libs/tools.js'
  import SwitchView from './operation/switch.vue'
  export default {
    components: {
      SwitchView
    },
    data () {
      return {
        inputList: [],
        parColumns: [],
        tableData:[],
        current: 1,
        pageSize: 10,
        isLoading: true,
        popSwitch: false, // 是否弹出接单设备
        switchInfo: {}, // 切换接单设备入参
        total: 10,
        vinError: false,
        vinInfo:{},
        setDeviceName:'2',
        cityOpOriList: [],
        city:[],
        operator:[],
        opList:[]
      }
    },
    mounted () {
      this.inputList = JSON.parse(JSON.stringify(inputList));
      this.inputList[4].cascaderList = JSON.parse(localStorage.getItem('pcOperatorList'))
      Object.entries(Columns(this)).forEach(([key,value])=> {this.parColumns.push(value)})
      this.getTableList()
    },
    methods: {
      handleSearch (val) {
        delete val.provinId
        delete val.cityId
        this.current = 1
        this.getTableList(val)
      },
      checkoutVin(e){
        let vin = e.target.value
        let data = {plateNumber : vin}
        getVinInfo(data).then(res =>{
          this.vinInfo = res.data.data
          if(res.data.data == null){
            this.vinError = true
            this.vinInfo = {}
          }
        })
      },
      // 获取table数据
      getTableList:function (params) {
        let data = {currPage: this.current, pageSize: this.pageSize}
        if(params){
          data = Object.assign(data,params)
        }
        getOrderEquipmentList(data).then(res => {
          this.tableData = res.data.data.list
          this.total = res.data.data.totalCount
          this.$store.commit('changeLoadingFlag', false)
        })
      },
      //选择城市
      handleSeletedCity(item){
        this.operator = item.children
      },
      selectObj: function(val){
        this.current = val;
        this.getTableList({});
      },
      changePage: function(val){
        this.current = val;
        this.getTableList({});
      },
      changePageSize: function(val){
        this.pageSize = val;
        this.getTableList({});
      },
      reset(){
        this.current = 1
        this.getTableList()
      },
      confirm: function(data){
        if(data) this.getTableList()
        this.popSwitch = false
      }
    }
  }
</script>
<style>
  .index_header_line{
    display: flex;
    margin-bottom: 15px;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .deviceModelTitle p{line-height: 30px}
  .editName{
    width: 135px;
    display: inline-block;
    padding-left: 50px;
  }
</style>
