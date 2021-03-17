<!--配置管理-审批管理-wx-->
<template>
  <div class="driver-order">
    <SearchList :inputList="inputList" @on-search="queryData" @on-reset="clearQueryData"></SearchList>
    <VTable
      :total="pageObj.total"
      :current="pageObj.current"
      :pageSize="pageObj.pageSize"
      :parColumns="parColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
    ></VTable>
    <Modal v-model="isDetail" @on-ok="isDetail=false" title="任务详情" :width="500">
      <div class="key-val-box">
        <span class="key-box">任务类型：</span>
        <span>{{detailData.type===1?'发送短信':''}}</span>
      </div>
      <div class="key-val-box">
        <span class="key-box">任务名称：</span>
        <span>{{detailData.taskName}}</span>
      </div>
      <div class="key-val-box">
        <span class="key-box">提交时间：</span>
        <span>{{detailData.createTime}}</span>
      </div>
      <div class="key-val-box">
        <span class="key-box">发送对象：</span>
        <span>{{sendMap[detailData.sendName]}}</span>
      </div>
      <div class="key-val-box">
        <span class="key-box">发送范围：</span>
        <span>{{driverMap[detailData.driver]}}</span>
      </div>
      <div class="key-val-box" v-if="detailData.sendName==0 && detailData.driver==10">
        <span class="key-box">用户分群：</span>
        <span>{{detailData.userGroupName}}</span>
      </div>
      <div class="key-val-box">
        <span class="key-box">发送数量：</span>
        <span>{{detailData.targetNum}}</span>
      </div>
      <div class="key-val-box">
        <span class="key-box">发送时间：</span>
        <span>{{detailData.sendTime}}</span>
      </div>
      <div class="key-val-box">
        <span class="key-box">消息内容：</span>
        <span>{{detailData.content}}</span>
      </div>
    </Modal>
  </div>
</template>
<script>
import VTable from "_a/v-table/v-table";
import { returnFields, inputList,pageObj,searchData,sendMap,driverMap } from "./fields";
import { timeFormat } from "@/libs/util";
import { axiosTaskApprovalList,axiosTaskApprovalSwitch,axiosTaskApprovalDetail } from '@/api/configData'
export default {
  name: "approvalControl",
  components: {
    VTable
  },
  data() {
    return {
      inputList,
      pageObj,
      searchData,
      sendMap,
      driverMap,
      parColumns: [],
      tableData: [],
      isDetail: false,
      detailData: {}
    };
  },
  created() {
    Object.entries(returnFields(this)).forEach(([key, value]) => {
      this.parColumns.push(value);
    });
  },
  mounted() {
    this.getList(this.searchData);
    // let nowDate = new Date();
    // let nowY = nowDate.getFullYear();
    // let nowM = nowDate.getMonth() + 1;
    // let nowD = nowDate.getDate();
    // // 产品需求：只能选择今天之前的时间
    // this.inputList[2].options = {
    //   disabledDate(date) {
    //     let y = date.getFullYear();
    //     let m = date.getMonth() + 1;
    //     let d = date.getDate();
    //     return (
    //       y > nowY ||
    //       (y === nowY && m > nowM) ||
    //       (y === nowY && m === nowM && d > nowD)
    //     );
    //   }
    // };
  },
  methods: {
    // 搜索回调
    queryData(data) {
      // 点击查询
      this.pageObj.current = 1;
      // 时间戳转日期格式，并删除原有时间戳
      data.d && (data.createTimeStart = timeFormat(data.d, "yyyy-mm-dd").substring(0,10));
      data.a && (data.createTimeEnd = timeFormat(data.a, "yyyy-mm-dd").substring(0,10));
      delete data.d;
      delete data.a;
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
    changePage(val) {
      this.pageObj.current = val;
      this.getList(this.searchData);
    },
    changePageSize(val) {
      this.pageObj.pageSize = val;
      this.getList(this.searchData);
    },
    // 获取列表
    getList(obj,notLoading) {
      !notLoading && this.$store.commit("changeLoadingFlag", true);
      let that = this;
      let params = {
        pageSize: this.pageObj.pageSize,
        currPage: this.pageObj.current
      };
      if (obj) {
        for (let key in obj) {
          params[key] = obj[key];
        }
      }

      axiosTaskApprovalList(params).then(res => {
        if(res.data.success){
          let resdata = res.data.data;
          this.tableData = (resdata && resdata.list) || [];
          this.pageObj.total = resdata && resdata.totalCount;
          this.$store.commit("changeLoadingFlag", false);
        }else{
          this.$Message.error(res.data.msg||'操作失败')
        }
      });
    },
    // 审批任务
    approvalSwitch(params){
      axiosTaskApprovalSwitch(params).then(res => {
        if(res.data.success){
          this.$Message.success('操作成功')
          this.getList('',true)
        }else{
          this.$Message.error(res.data.msg||'操作失败')
        }
      });
    },
    getDetailInfo(params){
      axiosTaskApprovalDetail(params).then(res => {
        if(res.data.success){
          this.detailData = res.data.data || {}
          this.isDetail = true
        }else{
          this.$Message.error(res.data.msg||'操作失败')
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.key-val-box{
  line-height:30px;
  display: flex;
  .key-box{
    display: inline-block;
    min-width:100px;
    width:100px;
    text-align: right;
    margin-right: 12px;
  }
}
</style>



