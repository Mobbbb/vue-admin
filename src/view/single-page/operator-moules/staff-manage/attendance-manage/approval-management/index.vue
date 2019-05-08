<!-- 
  请假审批
  backEnd: 车厘子-王祥虎 
-->
<template>
  <div>
    <SearchList :inputList="inputList" @on-search="queryData" @on-reset="clearQueryData"></SearchList>
    <!--<CustomColumns
      style="margin-bottom: 15px;"
      :selectedOriginList='tableColumnsChecked'
      :customList='customList'
      @changeColumns='changeTableTitle'
      @checkedColumns='storeTableHandle'>
    </CustomColumns>-->
    <VTable
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :isLoading="isLoading"
      :parColumns="tableColumns"
      :parTableData="tableData"
      :pageSizeOpts="pageSizeOpts"
      @changePage="changePage"
      @changePageSize="changePageSize"
    >
    </VTable>
    <Modal
      v-model="isShowOutlets"
      :title="outletsTitle"
      width="800"
      :mask-closable="false"
      >  
      <Form :model="commonFormData" :label-width="80" :rules='operateRule' ref='operateForm'>
        <FormItem label='当前操作'>
          <Input v-model="currentMessage" readonly></Input>
        </FormItem>
        <FormItem label='司机姓名'>
          <Input v-model="commonFormData.driverName" readonly></Input>
        </FormItem>
        <FormItem label='备注' prop='comment'>
          <Input v-model="commonFormData.comment" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="isShowOutlets = false">关闭</Button>
        <Button @click="outletsConfirm" type="primary">确定</Button>
      </div>
    </Modal>
    <Modal
      v-model="isShowDetailModal"
      title="查看详情"
      width="800"
      :mask-closable="false"
      >  
      <Form :model="detailFormData" :label-width="80" inline ref='operateForm'>
        <FormItem label='所属城市' style="width: 45%;">
          <Input v-model="detailFormData.cityName" readonly></Input>
        </FormItem>
        <FormItem label='所属运营商'  style="width: 45%;">
          <Input v-model="detailFormData.agentName" readonly></Input>
        </FormItem>
         <FormItem label='司机姓名'  style="width: 45%;">
          <Input v-model="detailFormData.driverName" readonly></Input>
        </FormItem>
         <FormItem label='司机手机号'  style="width: 45%;">
          <Input v-model="detailFormData.driverMobile" readonly></Input>
        </FormItem>
         <FormItem label='司机ID'  style="width: 45%;">
          <Input v-model="detailFormData.driverNo" readonly></Input>
        </FormItem>
        <FormItem label='请假类型'  style="width: 45%;">
          <Select v-model="detailFormData.leaveType">
            <Option :value='1' disabled>事假</Option>
            <Option :value='2' disabled>病假</Option>
            <Option :value='3' disabled>正常休息</Option>
          </Select>
        </FormItem>
         <FormItem label='开始时间'  style="width: 45%;">
          <Input v-model="detailFormData.startTimeStr" readonly></Input>
        </FormItem>
         <FormItem label='结束时间'  style="width: 45%;">
          <Input v-model="detailFormData.endTimeStr" readonly></Input>
        </FormItem>
        <FormItem label='天数'  style="width: 45%;">
          <Input v-model="detailFormData.days" readonly></Input>
        </FormItem>
         <FormItem label='请假原因'  style="width: 45%;">
          <Input v-model="detailFormData.reason" readonly></Input>
        </FormItem>
         <FormItem label='申请时间'  style="width: 45%;">
          <Input v-model="detailFormData.applyDate" readonly></Input>
        </FormItem>
        <FormItem label='审批状态' style="width: 45%;">
          <Select v-model="detailFormData.approvalStatus">
            <Option :value='1' disabled>待审批</Option>
            <Option :value='2' disabled>审批通过</Option>
            <Option :value='3' disabled>审批不通过</Option>
          </Select>
        </FormItem>
        <FormItem label='审批人' style="width: 45%;" v-if='!isPending'>
          <Input v-model="detailFormData.approver" readonly></Input>
        </FormItem>
        <FormItem label='审批时间' style="width: 45%;" v-if='!isPending'>
          <Input v-model="detailFormData.approvalTime" readonly></Input>
        </FormItem>
        <FormItem label='备注' prop='comment' v-if='!isPending'>
          <Input v-model="detailFormData.comment" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注" readonly></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button v-if="false">关闭</Button>
        <Button v-if="false" type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import CustomColumns from '_a/custom-columns/custom-columns.vue';
import {approvalPageList, approveOperate, viewApproveDetail} from '@/api/driver.js';
import { fields, pageData, inputList } from './fields.js';
import {getTableTitle, setTableTitle} from '@/api/common.js';

export default {
  components: {
    CustomColumns,
  },
  data() {
    return {
      inputList: [],
      resourceId: this.$route.name,
      ...pageData,
      operatorTree: []
    }
  },
  created() {
    /*getTableTitle({resourceId: this.resourceId}).then(res => { // 获取用户自定义的表头
      if (res.data.success && Array.isArray(res.data.data) && res.data.data.length>0) {
        this.tableColumnsChecked = res.data.data;
      }
    })*/
    this.inputList = JSON.parse(JSON.stringify(inputList))
    this.inputList[3].cascaderList = JSON.parse(localStorage.getItem('provinceCityList'))
    this.inputList[4].cascaderList = JSON.parse(localStorage.getItem('pcOperatorList'))
    this.operatorTree = JSON.parse(localStorage.getItem('pcOperatorList'))
    this.getTableColumns()
    this.getList()
  },
  methods: {
    queryData(val){
      delete val.cityId
      delete val.provinceId2
      delete val.provinceId1
      if(typeof(val.applyEndTime) !== 'undefined'){
        val.applyEndTime = this.$moment(val.applyEndTime).format('YYYY-MM-DD')
      }
      if(typeof(val.applyStartTime) !== 'undefined'){
        val.applyStartTime = this.$moment(val.applyStartTime).format('YYYY-MM-DD')
      }
      this.current = 1
      this.queryAjaxPramas = val
      this.getList();
    },
    clearQueryData(){
      this.current = 1;
      this.queryAjaxPramas = {}
      this.getList();
    },
    getList() {
      let params = {
        currPage: this.current,
        pageSize: this.pageSize,
      };
      let obj = Object.assign(params, this.queryAjaxPramas);
      approvalPageList(obj).then(res => {
          this.total = res.data.data.totalCount;
          this.tableData = res.data.data.list;
          this.$store.commit('changeLoadingFlag', false)
      })
    },
    changeTableTitle(data) {
      this.tableColumnsChecked = data;
      this.getTableColumns();
    },
    getTableColumns () {
      let data = [];
      let action = {
        title: '操作',
        key: 'action',
        fixed: 'right',
        minWidth: 80,
        render: (h, params) => {
          return h('div', [
             h('Button', { 
              props: {
                type: 'success',
                size: 'small'
              },
              directives: [{
                name: 'hasAuth',
                value: 'attendance-manage-detail'
              }],
              attrs: {
                ghost: 'ghost'
              },
              style: {
                marginRight: '15px'
              },
              on: {
                click: () => {
                  this.isPending =  params.row.approvalStatus == 1;
                  let data = {
                    uuid: params.row.uuid,
                    cityUuid: params.row.cityUuid,
                    agentUuid: params.row.agentUuid
                  }
                  this.viewDetail(data);
                }
              }
            }, '详情'),
            /*h('Button', { 
              props: {
                type: 'primary',
                size: 'small',
                disabled: params.row.approvalStatus == 2 || params.row.approvalStatus == 3
              },
              attrs: {
                ghost: 'ghost'
              },
              style: {
                marginRight: '15px',
              //display: params.row.status == 4 ? 'inline-block' : 'none'
              },
              on: {
                click: () => {
                  this.commonFormData = params.row;
                  this.checkSuccess();
                }
              }
            }, '审批通过'),
            h('Button', {
              props: {
                type: 'warning',
                size: 'small',
                disabled: params.row.approvalStatus == 2 || params.row.approvalStatus == 3
              },
              attrs: {
                ghost: 'ghost'
              },
              on: {
                click: () => {
                  this.commonFormData = params.row;
                  this.checkFail();
                }
              }
            }, '拒绝审批')*/
          ]);
        }
      };
      this.tableColumnsChecked.forEach(col => data.push(fields[col]));
      data.push(action);
      this.tableColumns = data;
    },
    changePageSize(val) {
      if (val) {
        this.pageSize = val;
        this.getList();
      }
    },
    changePage (val) {
      if (val) {
        this.current = val;
        this.getList();
      }
    },
    checkSuccess(id) {//审批通过
      this.outletsTitle = '通过审批';
      this.currentMessage = '同意请假申请';
      this.isShowOutlets = true;
      this.commonFormData.approvalStatus = 2;
    },
    checkFail(id) {// 审批拒绝
      this.outletsTitle = '拒绝审批';
      this.currentMessage = '拒绝请假申请';
      this.isShowOutlets = true;
      this.commonFormData.approvalStatus = 3;
    },
    outletsConfirm() {
      let params = {
        uuid: this.commonFormData.uuid,
        comment: this.commonFormData.comment,
        approvalStatus:  this.commonFormData.approvalStatus
      }
      if (!params.comment) {
        this.$Message.warning('请填写备注')
        return false
      }
      this.$refs.operateForm.validate(valid => {
        if (!valid) {
          this.passHandle(params)
          this.isShowOutlets = true;
        }
      })
    },
    passHandle(params) {// 审批通过请求
      approveOperate(params).then(res => {
        if (res.data.success) {
          this.$Message.success('审批通过操作成功!')
          this.getList();
          this.isShowOutlets = false;
        } else {
          let msg = res.data.errorMsg || '服务器错误!';
          this.$Notice.error({
            desc: msg,
            duration: 10
          })
        }
      })
    },
    viewDetail(data) {
      this.isShowDetailModal = true;
      viewApproveDetail(data).then(res=>{
        if(res.data.success) {
          this.detailFormData = res.data.data;
        }
      })
    },
    // failHandle(params) {// 拒绝审批请求
    //    allowOnline(params).then(res => {
    //     if (res.data.success) {
    //       this.$Message.success('拒绝审批操作成功!')
    //       this.getList();
    //       this.isShowOutlets = false;
    //     } else {
    //       let msg = res.data.errorMsg || '服务器错误!';
    //       this.$Message.error(msg)
    //     }
    //   })
    // },
    storeTableHandle(data) {//将选择的表头发送到云端
      let params = {
        resourceId: this.resourceId,
        tableColumns: data
      }
      setTableTitle(params).then(res => {
        if (res.data.success) {
          this.$Message.success('表头设置成功!')
          this.getTableColumns();
        }else {
          let errorMsg=res.data.errorMsg || '表头设置失败！'
          this.$Message.error(errorMsg)
        }
      })
    }
  }
} 
</script>
<style scoped>
.content-container {
  margin: 10px 0 0 0;
}
.content-container .operate-wrap {
  margin: 0 0 10px 0;
  text-align: right;
}
.search-input-wrap{
  display: flex;
  flex-wrap: wrap;
}
.search-input-wrap > div {
  display: flex;
  margin-right: 35px;
}
</style>
