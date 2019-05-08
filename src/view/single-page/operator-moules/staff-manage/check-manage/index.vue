<!-- 
  审批管理
  backEnd: 车厘子-王祥虎 
-->
<template>
  <div>
    <Form :model="searchData" inline :label-width='80'>
        <FormItem label='司机姓名'>
         <Input v-model='searchData.name' placeholder="请输入..." style="width: 150px;"></Input>
        </FormItem>
        <FormItem label='手机号'>
          <Input v-model='searchData.mobile' placeholder="请输入..." style="width: 150px;"></Input>         
        </FormItem>
        <FormItem label='城市' v-show="isShowMore">
          <Select v-model="searchData.cityUuid"  filterable style="width:200px">
            <Option v-for="(item, index) in cityList" :value="item.uuid" :key="index">{{ item.city }}</Option>
          </Select>
        </FormItem>
       <FormItem label='运营商' v-show="isShowMore">
          <Cascader
            :data="operatorTree"
            v-model="operatorArr"
            trigger="hover"
            placeholder="请选择运营商"
            style="width:190px;">
          </Cascader>
        </FormItem>
        <FormItem label='审批状态' v-show="isShowMore">
          <Select v-model="searchData.approvalStatus"  filterable style="width:200px">
            <Option  :value="2" >审批通过</Option>
            <Option  :value="3" >审批拒绝</Option>
            <Option  :value="1" >等待审批</Option>
          </Select>
        </FormItem >
        <FormItem label='请假类型' v-show="isShowMore">
          <Select v-model="searchData.leaveType"  filterable style="width:200px">
            <Option :value="1">事假</Option>
            <Option :value="2">病假</Option>
            <Option :value="3">正常休息</Option>
          </Select>
        </FormItem >
        <FormItem label='时间'  v-show="isShowMore">
          <DatePicker  v-model="validTime" split-panels @on-change='selectDate' type="daterange" format="yyyy-MM-dd"></DatePicker>
        </FormItem>
        <FormItem label='司机ID' v-show="isShowMore">
          <Input v-model='searchData.driverUniqueId' placeholder="请输入..." style="width: 150px;"></Input>         
        </FormItem>  
        <FormItem :label-width='0'>
          <div class="query-btn">
            <a class="show-more" @click='isShowMore = !isShowMore'>
              <Icon type="md-remove" v-show="isShowMore"/>
              <Icon type="md-add"  v-show="!isShowMore"/>
              <span v-show="!isShowMore">查看更多</span>
              <span v-show="isShowMore">收起更多</span>
            </a>
            <Button @click='clearQueryData'>清空</Button>
            <Button  type="primary"  @click='queryData'>查询</Button>
          </div>
        </FormItem>
    </Form>
    <CustomColumns
      :selectedOriginList='tableColumnsChecked'
      :customList='customList'
      @changeColumns='changeTableTitle'
      @checkedColumns='storeTableHandle'>
    </CustomColumns>
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
      style="margin-top: 15px;">
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
          <Input v-model="commonFormData.comment" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
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
      :footer-hide='true'
      >  
      <Form :model="detailFormData" :label-width="80" inline :rules='operateRule' ref='operateForm'>
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
            <Option :value='1'>事假</Option>
            <Option :value='2'>病假</Option>
            <Option :value='1'>正常休息</Option>
          </Select>
        </FormItem>
         <FormItem label='开始时间'  style="width: 45%;">
          <Input v-model="detailFormData.startTime" readonly></Input>
        </FormItem>
         <FormItem label='结束时间'  style="width: 45%;">
          <Input v-model="detailFormData.endTime" readonly></Input>
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
            <Option :value='1'>待审批</Option>
            <Option :value='2'>审批通过</Option>
            <Option :value='3'>审批不通过</Option>
          </Select>
        </FormItem>
        <FormItem label='审批人' style="width: 45%;" v-if='!isPending'>
          <Input v-model="detailFormData.approver" readonly></Input>
        </FormItem>
        <FormItem label='审批时间' style="width: 45%;" v-if='!isPending'>
          <Input v-model="detailFormData.approvalTime" readonly></Input>
        </FormItem>
        <FormItem label='备注' prop='comment' v-if='!isPending'>
          <Input v-model="detailFormData.comment" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import CustomColumns from '_a/custom-columns/custom-columns.vue';
import {mapState, mapActions} from 'vuex';
import {approvalPageList, approveOperate, viewApproveDetail} from '@/api/driver.js';
import { fields, pageData } from './fields.js';
import {getCitys, getTableTitle, setTableTitle} from '@/api/common.js';
export default {
   components: {
    CustomColumns,
  },
  computed: mapState([
    'cityList'
  ]),
  created() {
    /*getTableTitle({resourceId: this.resourceId}).then(res => { // 获取用户自定义的表头
      if (res.data.success && Array.isArray(res.data.data) && res.data.data.length>0) {
        this.tableColumnsChecked = res.data.data;
      }
      
    })*/
    this.operatorTree = JSON.parse(localStorage.getItem('pcOperatorList'))
    this.getTableColumns()
    this.getList();
    this.getCityList();
  },
  data() {
    return {
      resourceId: this.$route.name,
      ...pageData,
      operatorTree: [],
      operatorArr: []
    }
  },
  methods: {
    ...mapActions([
      'getCityList'
    ]),
    queryData(){
      this.current = 1;
      this.queryAjaxPramas = {};
      this.searchData.agentUuid = this.operatorArr[2]
      Object.keys(this.searchData).map(key=> {
        let item = this.searchData[key]
        if (item || item === 0) {
          this.queryAjaxPramas[key] = item;
        }
      })
      this.getList();
    },
    clearQueryData(){
      this.current = 1;
      this.validTime = '';
      this.searchData = {};
      this.queryAjaxPramas = {};
      this.operatorArr = []
      this.getList();
    },
    selectDate(data) {
      if (data && data[0]) {
        this.searchData.applyStartTime = data[0];
        this.searchData.applyEndTime = data[1];
      }
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
        minWidth: 230,
        render: (h, params) => {
          return h('div', [
             h('Button', { 
              props: {
                type: 'success',
                size: 'small'
              },
              attrs: {
                ghost: 'ghost'
              },
              style: {
                marginRight: '5px',
              //display: params.row.status == 4 ? 'inline-block' : 'none'
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
            h('Button', { 
              props: {
                type: 'primary',
                size: 'small',
                disabled: params.row.approvalStatus == 2 || params.row.approvalStatus == 3
              },
              attrs: {
                ghost: 'ghost'
              },
              style: {
                marginRight: '5px',
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
              style: {
                marginRight: '5px',
                //display: (params.row.status !=4 && params.row.status !=1) ? 'inline-block' : 'none'
              },
              on: {
                click: () => {
                  this.commonFormData = params.row;
                  this.checkFail();
                }
              }
            }, '拒绝审批')
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
      this.$refs.operateForm.validate(valid => {
        if (valid) {
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
        this.detailFormData = res.data.data;
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
<style lang="less">
  .time-section-container {
    float: right;
    padding-bottom: 10px;
  }
  .month-range-container {
    button {
      margin: 0 10px 0 0;
    }
  }
</style>
