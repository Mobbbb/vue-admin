<!-- 
  人员管理
  backEnd: 车厘子-彭旭
-->
<template>
  <div>
    <div v-show='!isShowAudit'>
      <Form :model="searchData" inline :label-width='75'>
        <FormItem label='司机姓名'>
          <Input v-model='searchData.name' placeholder="请输入司机姓名" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label='手机号'>
          <Input v-model='searchData.mobile' placeholder="请输入手机号" style="width: 200px;"></Input>         
        </FormItem>
        <FormItem label='车型'>
          <Input v-model='searchData.modelName' placeholder="请输入车型" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label='城市' v-show="isShowMore">
          <Select v-model="searchData.cityUuid"  filterable style="width:200px">
            <Option v-for="(item, index) in cityList" :value="item.cityUuid" :key="index">{{ item.city }}</Option>
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
        <FormItem label='司机ID' v-show="isShowMore">
          <Input v-model='searchData.driverNo' placeholder="请输入司机ID" style="width: 200px;"></Input>         
        </FormItem>
        <FormItem label='车牌号' v-show="isShowMore">
          <Input v-model='searchData.plateNum' placeholder="请输入车牌号" style="width: 200px;"></Input> 
        </FormItem >
        <FormItem label='入职时间'  v-show="isShowMore">
          <DatePicker
            split-panels
            v-model="joinTime"
            @on-change='selectDate'
            type="daterange"
            format="yyyy-MM-dd"
            style="width:200px"> 
          </DatePicker>
        </FormItem>
        <FormItem label='状态' v-show="isShowMore">
          <Select v-model="searchData.status"  filterable style="width:150px">
            <Option :value="1">正常</Option>
            <Option :value="2">短期封号</Option>
            <Option :value="3">长期封号</Option>
            <Option :value="4">未审核</Option>
            <Option :value="5">删除</Option>
            <Option :value="6">离职</Option>
            <Option :value="7">黑名单</Option>
            <Option :value="8">强制下线</Option>
          </Select>
        </FormItem >
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
      <div class="operate-wrap">
        <!--<ImportFile style="display: inline-block;" @on-success='importSuccess' :importFileUrl='importUrl' :toDownTemplateUrl='templateUrl'></ImportFile>
        <ExportFile style="display: inline-block;" :queryData='queryAjaxPramas' :columnsTitle='tableColumnsChecked' :exportUrl='exportUrl'></ExportFile>
        <CustomColumns
          style="display: inline-block;"
          :selectedOriginList='tableColumnsChecked'
          :customList='customList'
          @changeColumns='changeTableTitle'
          @checkedColumns='storeTableHandle'
        ></CustomColumns>-->
      </div>
      
      <VTable
        class="staff-table-container"
        :total="total"
        :current="current"
        :pageSize="pageSize"
        :isLoading="isLoading"
        :parColumns="tableColumns"
        :parTableData="tableData"
        @changePage="changePage"
        @changePageSize="changePageSize"
      >
      </VTable>
    </div>
    <!-- 修改 或者 详情 
    <Detail v-show='isShowAudit' :isAudit='isAudit' :auditId='auditId'></Detail>
    <div v-show='isShowAudit' class="back-container">
      <Button type="default" :size='"large"' @click="backList">返回列表</Button>
    </div>-->
    <!-- 封号 -->
    <Modal
      v-model="isShowBlockade"
      :title="blockadeTitle"
      :mask-closable="false"
      width="800"
      >
      <Form :model="commonFormData" :label-width="80" ref='blockForm' :rules='blockadeRule'>
        <FormItem label='司机ID'>
          <Input v-model="commonFormData.driverNo" readonly></Input>
        </FormItem>
        <FormItem label='司机姓名'>
          <Input v-model="commonFormData.name" readonly></Input>
        </FormItem>
        <FormItem label='司机电话'>
          <Input v-model="commonFormData.mobile" readonly></Input>
        </FormItem>
        <FormItem label="封号类型" prop='type'>
           <Select v-model="commonFormData.type"  @on-change='changeStatus' style="width:200px">
            <Option :value="3">长期封号</Option>
            <Option :value="2">短期封号</Option>
          </Select>
        </FormItem> 
        <FormItem label='解封时间' prop='blockEnd' v-if='isShowUnblockTime'>
           <DatePicker type="date" v-model="commonFormData.blockEnd" @on-change='slectBlockDate' placeholder="请选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label='备注' prop='operateRemark'>
          <Input v-model="commonFormData.operateRemark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click.native="isShowBlockade = false">关闭</Button>
        <Button @click.native="blockadeConfirm" type="primary">确定</Button>
      </div>
    </Modal>
    <!-- 加入黑名单 离职 移出黑名单 解封-->
    <Modal
      v-model="isShowOtherModal"
      :title="otherOperateModalTitle"
      width="800"
      :mask-closable="false"
      >
      <Form :model="commonFormData" :label-width="80" :rules='otherOperateRule' ref='operateForm'>
        <FormItem label='司机ID'>
          <Input v-model="commonFormData.driverNo" readonly></Input>
        </FormItem>
        <FormItem label='司机姓名'>
          <Input v-model="commonFormData.name" readonly></Input>
        </FormItem>
        <FormItem label='司机电话'>
          <Input v-model="commonFormData.mobile" readonly></Input>
        </FormItem>
        <FormItem v-show="isShowAlert">
           <Alert type="warning">离职后司机将解除运营商、司管和车辆关系, 请确定司机是否离职</Alert>
        </FormItem>
        <FormItem label='备注' prop='operateRemark'>
          <Input v-model="commonFormData.operateRemark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
        </FormItem>
      </Form>
       <div slot="footer">
        <Button @click.native="isShowOtherModal = false">关闭</Button>
        <Button @click.native="otherOperateConfirm" type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex';
import CustomColumns from '_a/custom-columns/custom-columns.vue';
import {
  staffList, 
  querySimpleInfo, 
  blocking, 
  addToBlacklist,
  removeFromBlacklist,
  unblocking,
  leave, 
  exportDriverInfo
} from '@/api/driver.js';
import {setTableTitle, getTableTitle} from '@/api/common.js';
import ExportFile from '_a/export-file/exportFile.vue';
import { driverList, pageData } from './fields.js';
import Detail from './detail.vue';
import VUpload from '_a/v-upload/v-upload';
import ImportFile from '_a/import-file/index.vue';

export default {
  components: {
    VUpload,
    CustomColumns,
    Detail,
    ImportFile,
    ExportFile
  },
  computed: mapState({
    cityList: state => state.common.cityList
  }),
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
      operatorTree: [],
      operatorArr: [],
      exportUrl: '/admin/driver/exportDriverInfo',
      templateUrl: '/download/driverImportTemplate.zip',
      importUrl: '/admin/driver/importDriverInfo',
      resourceId: this.$route.name,
      ...pageData
    }
  },
  methods: {
    ...mapActions([
      'getCityList',   
    ]),
    clearQueryData () {
      this.current = 1;
      this.pageSize = 10
      this.searchData = {};
      this.joinTime = '';
      this.queryAjaxPramas = {};
      this.operatorArr = []

      this.getList();
    },
    queryData () {
      this.queryAjaxPramas = {};
      this.current = 1;
      this.searchData.operator = this.operatorArr[2]
      Object.keys(this.searchData).map(key=> {
        let item = this.searchData[key]
        if (item || item === 0) {
          this.queryAjaxPramas[key] = item;
        }
      })
      this.getList();
    },
    getList() {
      let params = {
        currPage: this.current,
        pageSize: this.pageSize
      };
      let obj = Object.assign(params, this.queryAjaxPramas);
      this.$store.commit('changeLoadingFlag', true)
      staffList(obj).then(res => {
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
        minWidth: 240,
        render: (h, params) => {
          return h('div', [
            /*h('Button', { 
              props: {
                type: 'warning',
                size: 'small'
              },
              attrs: {
                ghost: 'ghost'
              },
              style: {
                marginRight: '5px',
                编辑暂时砍掉隐藏起来（叶进大佬说的）
                display: 'none'
              },
              on: {
                click: () => {
                  this.auditHandle(params.row.uuid);
                }
              }
            }, '编辑'),*/
            h('Button', {
              props: {
                type: 'warning',
                size: 'small'
              },
              directives: [{
                name: 'hasAuth',
                value: 'staff-manage-blockade'
              }],
              attrs: {
                ghost: 'ghost'
              },
              style: {
                marginRight: '15px',
                display: params.row.status === 1 ? 'inline-block' : 'none'
              },
              on: {
                click: () => {
                  this.blockadeHandle(params.row.uuid);
                }
              }
            }, '封号'),
             h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              directives: [{
                name: 'hasAuth',
                value: 'staff-manage-addToBlack'
              }],
              attrs: {
                ghost: 'ghost'
              },
              style: {
                marginRight: '15px',
                display: params.row.status === 7 ? 'inline-block' : 'none'
              },
              on: {
                click: () => {
                  this.removeBlack(params.row.uuid);
                }
              }
            }, '解除黑名单'),
            h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              directives: [{
                name: 'hasAuth',
                value: 'staff-manage-addToBlack'
              }],
              attrs: {
                ghost: 'ghost'
              },
              style: {
                marginRight: '15px',
                display: (params.row.status === 1 || params.row.status === 2 || params.row.status === 3) ? 'inline-block' : 'none'
              },
              on: {
                click: () => {
                  this.blacklistHandle(params.row.uuid);
                }
              }
            }, '加入黑名单'),
            /*h('Button', {
              props: {
                type: 'info',
                size: 'small'
              },
              attrs: {
                ghost: 'ghost'
              },
              style: {
                marginRight: '5px',
                display: params.row.status !== 6 ? 'inline-block' : 'none'
              },
              on: {
                click: () => {
                  this.leaveJobHandle(params.row.uuid);
                }
              }
            }, '离职'),*/
            h('Button', {
              props: {
                type: 'info',
                size: 'small'
              },
              directives: [{
                name: 'hasAuth',
                value: 'staff-manage-unblockade'
              }],
              attrs: {
                ghost: 'ghost'
              },
              style: {
                marginRight: '15px',
                display: (params.row.status === 2 || params.row.status === 3) ? 'inline-block' : 'none'
              },
              on: {
                click: () => {
                  this.unblock(params.row.uuid);
                }
              }
            }, '解封'),
            h('Button', {
              props: {
                type: 'success',
                size: 'small'
              },
              directives: [{
                name: 'hasAuth',
                value: 'staff-manage-detail'
              }],
              attrs: {
                ghost: 'ghost'
              },
              on: {
                click: () => {
                  this.detailHandle(params.row.uuid);
                }
              }
            }, '详情')
          ]);
        }
      };
      this.tableColumnsChecked.forEach(col => data.push(driverList[col]));
      data.push(action);
      this.tableColumns = data;
    },
    changePageSize(val) {
      this.pageSize = val;
      this.getList();
    },
    selectDate(data) {
      if (data) {
        this.searchData.startTime = data[0];
        this.searchData.endTime = data[1];
      }
    },
    changePage (val) {
      this.current = val;
      this.getList();
    },
    auditHandle(id) { //修改
      this.isAudit = true;
      this.isShowAudit = true;
      this.auditId = id;
    },
    detailHandle (id) { // 详情
      this.auditId = id;
      this.isAudit = false;
      this.$router.push({path: 'staff-detail/'+id})
    },
    queryDriverInfo(id) {// 查看司机基本信息
      let params = {
        driverUuid: id
      }
      querySimpleInfo(params).then(res => {
        if (res.data.success) {
         this.commonFormData = res.data.data;
        }
      })
    },
    blockadeHandle(id) {//封号
      this.isShowBlockade = true;
      this.commonFormData = {};
      this.queryDriverInfo(id);
    },
    blacklistHandle(id) {// 加入黑名单
      this.isShowOtherModal = true;
      this.isShowAlert = false;
      this.commonFormData = {};
      this.otherOperateModalTitle = '加入黑名单';
      this.queryDriverInfo(id);
    },
    leaveJobHandle(id) {
      this.isShowOtherModal = true;
      this.isShowAlert = true;
      this.commonFormData = {};
      this.otherOperateModalTitle = '离职';
      this.queryDriverInfo(id);
    },
    removeBlack(id) {// 移出黑名单
      this.isShowOtherModal = true;
      this.isShowAlert = false;
      this.commonFormData = {};
      this.otherOperateModalTitle = '移出黑名单';
      this.queryDriverInfo(id);
    },
    unblock(id) {// 解封
      this.isShowOtherModal = true;
      this.isShowAlert = false;
      this.commonFormData = {};
      this.otherOperateModalTitle = '解封';
      this.queryDriverInfo(id);
    },
    changeStatus(status) {
      if (status == 3) {
        delete this.commonFormData.blockEnd;
        this.isShowUnblockTime = false;
      }else {
        this.isShowUnblockTime = true;
      }
      this.commonFormData.type = status
    },
    slectBlockDate(date) {
      if (date) {
        this.commonFormData.blockEnd = date;
      }
    },
    blockadeConfirm() {// 封号操作
      this.$refs.blockForm.validate(valid => {
        if (!valid) return false;
        let params = {
          driverUuid: this.commonFormData.uuid,
          blockEnd: this.commonFormData.blockEnd,
          type: this.commonFormData.type,
          operateRemark: this.commonFormData.operateRemark
        }
        blocking(params).then(res => {
          if (res.data.success) {
            this.$Message.success('封号成功!')
            this.isShowBlockade = false;
            this.getList();
          } else {
            let errormsg = res.data.errorMsg || '服务器错误!';
            this.$Message.error(errormsg)
          }
        })
      })
    },
    otherOperateConfirm() {
      this.$refs.operateForm.validate(valid => {
        if(!valid) return false;
        let params = {
          driverUuid: this.commonFormData.uuid,
        }
        switch(this.otherOperateModalTitle) {
          case '加入黑名单':
          params.operateRemark = this.commonFormData.operateRemark
          this.addToBlackHandle(params);
          break;
          case '离职':
          params.dimissionRemark = this.commonFormData.operateRemark
          this.leaveHandle(params)
          break;
          case '移出黑名单':
          params.operateRemark = this.commonFormData.operateRemark
          this.removeBlackHandle(params)
          break;
          case '解封':
          params.operateRemark = this.commonFormData.operateRemark
          this.unblockHandle(params)
          break;
        }
        this.isShowOtherModal = true;
      })
    },
    addToBlackHandle(params) {//加入黑名单
      addToBlacklist(params).then(res => {
          if (res.data.success) {
            this.$Message.success('加入黑名单成功!')
            this.getList();
            return this.isShowOtherModal = false;
          } else {
            let errormsg = res.data.errorMsg || '服务器错误!';
            this.$Message.error(errormsg)
          }
      })
    },
    leaveHandle(params) {//离职操作
      leave(params).then(res => {
        if (res.data.success) {
          this.$Message.success('离职操作成功!')
          this.getList();
          return this.isShowOtherModal = false;
        } else {
          let errormsg = res.data.errorMsg || '服务器错误!';
          this.$Message.error(errormsg)
        }
      })
    },
    removeBlackHandle(params) {// 移出黑名单
       removeFromBlacklist(params).then(res => {
        if (res.data.success) {
          this.$Message.success('移出黑名单成功!')
          this.getList();
          return this.isShowOtherModal = false;
        } else {
          let errormsg = res.data.errorMsg || '服务器错误!';
          this.$Message.error(errormsg)
        }
      })
    },
    unblockHandle(params) {// 解封
      unblocking(params).then(res => {
        if (res.data.success) {
          this.$Message.success('解封成功!')
          this.getList();
          return this.isShowOtherModal = false;
        } else {
          let errormsg = res.data.errorMsg || '服务器错误!';
          this.$Message.error(errormsg)
        }
      })
    },
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
    },
    backList() {
      this.isShowAudit = false;
      this.isAudit = false
    },
    importSuccess() {
      this.getList()
    }
  }
}
</script>
<style lang='less'>
  @import './index.less'; 
</style>