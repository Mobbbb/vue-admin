<template>
    <div class="modal-content">
      <SearchList :inputList="inputList" @on-search="queryData" @on-reset="clearQueryData"></SearchList>
      <VTable
        ref="couponSelection"
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
import { axiosTemplateList } from '@/api/market'
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: ()=>[]
    },
    limitNumber: {
      type:Number,
      default: 15
    },
    isRepeat: {
      type: Boolean,
      default: false
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
      this.getList();
    },
    clearQueryData() {
      // 点击清空
      this.pageObj.current = 1;
      for(let key in this.searchData){
        delete this.searchData[key]
      }
      this.getList();
    },
    getList(){
      let params = {
        currPage: this.pageObj.current,
        pageSize: this.pageObj.pageSize,
        templateStatus: 1
      }
      params = Object.assign(params,this.searchData)
      this.$store.commit("changeLoadingFlag", true);

      axiosTemplateList(params).then(res => {
        if (res.data.success) {
          let data = res.data.data||{}
          this.tableData = data.list || []
          this.pageObj.total = data.totalCount
          this.$store.commit("changeLoadingFlag", false);

          // 本页数据，已被选中的，设置为选中状态
          let selectedHash = {}
          // 冒泡发券，模板可重复
          this.selectedList.forEach(item=>{
            selectedHash[item.templateCode] = true
          })
          let isFull = this.selectedList.length>=this.limitNumber
          this.tableData.forEach(item=>{
            item._checked = false
            item._disabled = false
            if(selectedHash[item.templateCode]) item._checked = true
            else isFull && (item._disabled = true)
          })
          
        } else {
          that.$Message.error(res.data.msg);
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
      // 本页面所有选中取消选中
      this.tableData.forEach(item=>{
        this.selectedList.forEach((sub,index)=>{
          item.templateCode===sub.templateCode && this.selectedList.splice(index,1)
        })
      })
      let len = this.selectedList.length
      let addLen = list.length
     
      let listHash = {}
      if(len+addLen<this.limitNumber){
        list.forEach(item=>{
          this.selectedList.push(item)
          listHash[item.templateCode] = true
        })
        // return false
        this.tableData.forEach(item=>{
          item._checked = false
          item._disabled = false
          if(listHash[item.templateCode]) item._checked = true
        })
      }else{
        for(let val of list){
          if(this.selectedList.length<this.limitNumber){
            this.selectedList.push(val)
            listHash[val.templateCode] = true
          }else{
            let num = this.limitNumber
            this.isRepeat && ( num = 15 )
            this.$Message.warning('最多选择'+num+'个模板')
            break;
          }
        }
        this.tableData.forEach(item=>{
          item._checked = false
          item._disabled = false
          if(listHash[item.templateCode]) item._checked = true
          else item._disabled = true
        })
      }
      this.tableData.splice(0,1,this.tableData[0])
    },
    cancelFun(){
      this.$emit('close')
      this.selectedList.splice(0,this.selectedList.length)
      this.$refs.couponSelection.handelSelectAll(false);
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
        // 如果可以选择重复模板
        if(this.isRepeat){
          this.selectedList.splice(0,this.selectedList.length)
          if(this.tableData.length===0){
            this.getList()
          }else{
            this.tableData.forEach(item=>{
              item._checked = false
              if(this.limitNumber===0) item._disabled = true
              else item._disabled = false
            })
            this.tableData.splice(0,1,this.tableData[0])
          }
          return false
        }
        this.selectedList = [...this.list]
        if(this.tableData.length===0){
          this.getList()
        }else{
          let selectedHash = {}
          this.selectedList.forEach(item=>{
            selectedHash[item.templateCode] = true
          })
          let isFull = this.selectedList.length>=this.limitNumber
          this.tableData.forEach(item=>{
            item._checked = false
            item._disabled = false
            if(selectedHash[item.templateCode]) item._checked = true
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

