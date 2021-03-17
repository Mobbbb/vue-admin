<template>
    <div class="modal-content">
      <Table
        border
        highlight-row 
        ref="areaTable" 
        :columns="parColumns" 
        :data="tableData"
        :loading="isLoading"
        @on-current-change="selectChange"
      ></Table>
      <div style="margin: 10px; padding: 10px; overflow: hidden">
        <div style="float: right;">
          <Page
            show-total
            show-elevator
            show-sizer
            :total="pageObj.total"
            :current="pageObj.current"
            :page-size="pageObj.pageSize"
            @on-change="changePage"
            @on-page-size-change="changePageSize">
          </Page>
        </div>
      </div>
      <div class="modal-foot">
        <div class="pull-right">
          <Button @click="cancelFun" class="right15">取消</Button>
          <Button type="primary" @click="selectSubmit()">确定</Button>
        </div>
      </div>
    </div>
</template>
<script>
import { cacheData } from './fields'
import { selectPen } from '@/api/configData.js'
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    selectAreaUuid: {
      type: String,
      default: ''
    },
    cityList: {
      type: Array,
      default: []
    }
  },
  data(){
    return {
      ...cacheData,
      isLoading: false,
    }
  },
  methods:{
    selectChange(currentRow){
      if(this.isShow){
        this.selectedObj.name = currentRow.name
        this.selectedObj.uuid = currentRow.uuid
      }
    },
    getList(){
      let params = {
        pageSize: this.pageObj.pageSize,
        currPage: this.pageObj.current,
        railType: 3,
        status: 1
      }
      // 城市
      if(this.cityList.length===0){
        this.$Message.warning('请先选择活动城市')
        return false
      }else{
        if(this.cityList.indexOf('1')>-1){
          params.chooseCityTye = 1
        }else if(this.cityList.indexOf('2')>-1){
          params.chooseCityTye = 2
        }else{
          params.chooseCityTye = 3
          params.cityCodeList = this.cityList
        }
      }
      this.isLoading=true
      selectPen(params).then(res => {
        if(res.data.success){
          let data = res.data.data
          this.tableData = data?data.list:[]
          this.pageObj.total = data?data.totalCount:0
          this.tableData.forEach(item=>{
            item._highlight = false
            if(this.selectedObj.uuid===item.uuid) item._highlight = true
          })
          this.isLoading=false
        }else{
          this.$Message.error(res.data.msg||'服务器请求异常')
        }
      });
    },
    changePage: function(val) {                        
      this.pageObj.current = val;
      this.getList();
    },
    changePageSize: function(val) {
      this.pageObj.pageSize = val;
      this.getList();
    },
    cancelFun(){
      this.$emit('close')
      this.$refs.areaTable.clearCurrentRow(false);
      this.tableData.splice(0,this.tableData.length)
      this.pageObj.current = 1
      this.pageObj.total = 100
      this.pageObj.pageSize = 10
      Object.keys(this.selectedObj).forEach(key=>{
        this.selectedObj[key]=''
      })
    },
    selectSubmit(){
      let params = {...this.selectedObj}
      console.log(params)
      this.$emit('selectDown',params)
      this.$emit('close')
    }
  },
  beforeDestroy () {
    this.cancelFun()
  },
  watch: {
    isShow(newVal){
      if(newVal){
        this.selectedObj.uuid=this.selectAreaUuid
        this.getList()
        console.log(1234)
      }
    }
  }
};
</script>
<style lang="less" scoped>
.modal-foot{
  min-height:45px;
  padding-top: 15px;
  border-top:1px solid #e8eaec;
}

</style>

