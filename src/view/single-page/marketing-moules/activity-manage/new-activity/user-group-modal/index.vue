<template>
    <div class="modal-content">
      <SearchList :inputList="inputList" @on-search="queryData" @on-reset="clearQueryData"></SearchList>
      <VTable
        ref="userGroup"
        :total="pageObj.total"
        :current="pageObj.current"
        :pageSize="pageObj.pageSize"
        :parColumns="parColumns"
        :parTableData="tableData"
        @changePage="changePage"
        @changePageSize="changePageSize"
        @selectHandle="selectHandle"
      ></VTable>
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
import { axiosUserGroupList } from '@/api/market'
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: ()=>[]
    }
  },
  data(){
    return {
      ...cacheData
    }
  },
  mounted(){
    this.getList()
  },
  methods:{
    // 条件搜索后回调方法
    queryData(data) {
      // 点击查询
      this.pageObj.current = 1;
      for(let key in this.searchData){
        delete this.searchData[key]
      }
      for(let key in data){
        this.searchData[key] = data[key]
      }
      this.getList(data);
    },
    clearQueryData() {
      // 点击清空
      this.pageObj.current = 1;
      for(let key in this.searchData){
        delete this.searchData[key]
      }
      this.getList();
    },
    getList(obj){
      let params = {
        pageSize: this.pageObj.pageSize,
        currPage: this.pageObj.current,
        userGroupStatus: 0//可用且有人数的用户群
      }
      if(obj){
        Object.keys(obj).forEach(key=>{
          params[key] = obj[key]
        })
      }
      this.$store.commit("changeLoadingFlag", true);
      axiosUserGroupList(params).then(res => {
        if(res.data.success){
          let data = res.data.data||{}
          this.tableData = data?data.list:[]
          this.pageObj.total = data?data.totalCount:0
          
          let selectedHash = {}
          this.selectedList.forEach(item=>{
            selectedHash[item.uuid] = true
          })
          let isFull = this.selectedList.length>=15
          this.tableData.forEach(item=>{
            item._checked = false
            item._disabled = false
            if(selectedHash[item.uuid]) item._checked = true
            else isFull && (item._disabled = true)
          })

          this.$store.commit("changeLoadingFlag", false);
        }else{
          this.$Message.error(res.data.msg||'服务器请求异常')
        }
      });
    },
    changePage: function(val) {                        
      this.pageObj.current = val;
      this.getList(this.searchData);
    },
    changePageSize: function(val) {
      this.pageObj.pageSize = val;
      this.getList(this.searchData);
    },
    selectHandle(list){
      this.tableData.forEach(item=>{
        this.selectedList.forEach((sub,index)=>{
          item.uuid===sub.uuid && this.selectedList.splice(index,1)
        })
      })
      let listHash = {}

      list.forEach(item=>{
        this.selectedList.push(item)
        listHash[item.uuid] = true
      })
      // return false
      this.tableData.forEach(item=>{
        item._checked = false
        item._disabled = false
        if(listHash[item.uuid]) item._checked = true
      })
      this.tableData.splice(0,1,this.tableData[0])
    },
    cancelFun(){
      this.$emit('close')
      this.selectedList.splice(0,this.selectedList.length)
      this.$refs.userGroup.handelSelectAll(false);
      this.tableData.splice(0,this.tableData.length)
      this.pageObj.current = 1
      this.pageObj.total = 100
      this.pageObj.pageSize = 10
      Object.keys(this.searchData).forEach(key=>{
        this.searchData[key]=''
      })
    },
    selectSubmit(){
      let params = [...this.selectedList]
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
        this.selectedList = [...this.list]
        if(this.tableData.length===0){
          this.getList()
        }else{
          let selectedHash = {}
          this.selectedList.forEach(item=>{
            selectedHash[item.uuid] = true
          })
          let isFull = this.selectedList.length>=15
          this.tableData.forEach(item=>{
            item._checked = false
            item._disabled = false
            if(selectedHash[item.uuid]) item._checked = true
            else isFull && (item._disabled = true)
          })
          this.tableData.splice(0,1,this.tableData[0])
        }
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
