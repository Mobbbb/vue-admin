<!-- 
  营运管理
  backEnd: 车厘子-彭旭 
-->
<template>
  <div>
    <Form :model="searchData" inline :label-width='60'>
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
          <Select v-model="searchData.cityUuid"  filterable style="width: 200px">
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
        <FormItem label='司管' v-show="isShowMore">
          <Select v-model="searchData.operator"  filterable style="width:160px" :disabled="hasoperator">
            <Option v-for="(item, index) in managerDriverList" :value="item.uuid" :key="index">{{ item.realName }}</Option>
          </Select>
        </FormItem>
        <FormItem label='车牌号' v-show="isShowMore">
          <Input v-model='searchData.plateNum' placeholder="请输入车牌号" style="width: 200px;"></Input>
        </FormItem >
        <FormItem label='状态' v-show="isShowMore">
          <Select v-model="searchData.status"  filterable style="width:200px">
            <Option :value="1">已下线</Option>
            <Option :value="2">听单中</Option>
            <Option :value="3">行程中</Option>
            <Option :value="4">强制下线</Option>
          </Select>
        </FormItem >
        <FormItem label='时间'  v-show="isShowMore">
          <DatePicker
            split-panels
            v-model="validTime"
            @on-change='selectDate'
            type="daterange"
            format="yyyy-MM-dd"
            style="width: 200px;">
          </DatePicker>
        </FormItem>
        <FormItem label='司机ID' v-show="isShowMore">
          <Input v-model='searchData.driverNo' placeholder="请输入司机ID" style="width: 200px;"></Input>         
        </FormItem>
        <FormItem  class="month-range-container">
          <Button type="primary" @click="searchCurrentDateRange(1)">本日</Button>
          <Button type="primary" @click="searchCurrentDateRange(2)">本周</Button>
          <Button type="primary" @click="searchCurrentDateRange(3)">本月</Button>
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
    <!--<CustomColumns
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
      style="margin-top: 15px;">
    </VTable>
    <Modal
      v-model="isShowOutlets"
      :title="outletsTitle"
      :mask-closable="false"
      width="800"
      >  
      <Form :model="commonFormData" :label-width="80" :rules='operateRule' ref='operateForm'>
        <FormItem label='司机ID'>
          <Input v-model="commonFormData.driverNo" readonly></Input>
        </FormItem>
        <FormItem label='司机姓名'>
          <Input v-model="commonFormData.name" readonly></Input>
        </FormItem>
        <FormItem label='司机电话'>
          <Input v-model="commonFormData.mobile" readonly></Input>
        </FormItem>
        <FormItem label='备注' prop='operateRemark'>
          <Input v-model="commonFormData.operateRemark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click.native="isShowOutlets = false">关闭</Button>
        <Button @click.native="outletsConfirm" type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import CustomColumns from '_a/custom-columns/custom-columns.vue';
import {mapState, mapActions} from 'vuex';
import {operationList, querySimpleInfo, forcedOffline, allowOnline, getManagerDriver} from '@/api/driver.js';
import { fields, pageData } from './fields.js';
import { getCarModel, getCitys, getTableTitle, setTableTitle} from '@/api/common.js';

export default {
  components: {
    CustomColumns,
  },
  computed: mapState([
    'cityList',
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
      hasoperator: true,
      managerDriverList: [],
      operatorTree: [],
      operatorArr: []
    }
  },
  methods: {
    ...mapActions([
      'getCityList',
    ]),
    getOperator (val) {
      this.hasoperator = val? false : true
      getManagerDriver({ agentUuid: val }).then(res => {
        this.managerDriverList = res.data.data
      })
    },
    authHandle(name) {
      return this.$utils.pkAccess(name)
    },
    queryData(){
      this.current = 1;
      this.queryAjaxPramas = {};
      this.searchData.operator = this.operatorArr[2]
      Object.keys(this.searchData).map(key=> {
        let item = this.searchData[key]
        if (item || item === 0) {
          this.queryAjaxPramas[key] = item;
        }
      })
      this.getList();
    },
    searchCurrentDateRange(type) {
      if (type) {
        this.queryAjaxPramas = {};
        this.queryAjaxPramas['type'] = type;
        this.getList();
      }
    },
    clearQueryData(){
      this.current = 1;
      this.pageSize = 10;
      this.validTime = '';
      this.searchData = {};
      this.operatorArr = []
      this.queryAjaxPramas = {};
      this.getList();
    },
    selectDate(data) {
      if (data && data[0]) {
        this.searchData.startTime = data[0];
        this.searchData.endTime = data[1];
        this.searchData.type = 4;
      }
    },
    getList() {
      let params = {
        currPage: this.current,
        pageSize: this.pageSize,
      };
      let obj = Object.assign(params, this.queryAjaxPramas);
      operationList(obj).then(res => {
          this.$store.commit('changeLoadingFlag', false)
          this.total = res.data.data.totalCount;
          this.tableData = res.data.data.list;
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
        minWidth: 100,
        render: (h, params) => {
          return h('div', [
            h('Button', { 
              props: {
                type: 'primary',
                size: 'small'
              },
              attrs: {
                ghost: 'ghost'
              },
              style: {
                marginRight: '5px',
                display: (params.row.status == 4 && this.authHandle('operation_manage_allow_online')) ? 'inline-block' : 'none'
              },
              on: {
                click: () => {
                  this.enableOnlineHandle(params.row.uuid);
                }
              }
            }, '允许上线'),
            h('Button', {
              props: {
                type: 'warning',
                size: 'small'
              },
              attrs: {
                ghost: 'ghost'
              },
              style: {
                marginRight: '5px',
                display: (params.row.status !=4 && params.row.status !=1 && this.authHandle('operation_manage_force_offline')) ? 'inline-block' : 'none'
              },
              on: {
                click: () => {
                  this.forceDownLineHandle(params.row.uuid);
                }
              }
            }, '强制下线')
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
    enableOnlineHandle(id) {
      this.outletsTitle = '允许上线';
      this.isShowOutlets = true;
      this.queryDriverInfo(id);
    },
    forceDownLineHandle(id) {
      this.outletsTitle = '强制下线';
      this.isShowOutlets = true;
      this.queryDriverInfo(id);
    },
    outletsConfirm() {
      let params = {
        driverUuid: this.commonFormData.uuid,
        operateRemark: this.commonFormData.operateRemark
      }
      this.$refs.operateForm.validate(valid => {
        if (valid) {
          if ( this.outletsTitle === '强制下线') {
            this.forceOffHandle(params)
          } else {
            this.allowOnlineHandle(params)
          }
          this.isShowOutlets = true;
        }
      })
     
    },
    forceOffHandle(params) {// 强制下线
      forcedOffline(params).then(res => {
        if (res.data.success) {
          this.$Message.success('强制下线操作成功!')
          this.getList();
          return this.isShowOutlets = false;
        } else {
          let msg = res.data.errorMsg || '服务器错误!';
          this.$Notice.error({
            desc: msg,
            duration: 10
          })
        }
      })
    },
    allowOnlineHandle(params) {// 允许上线
       allowOnline(params).then(res => {
        if (res.data.success) {
          this.$Message.success('允许上线操作成功!')
          this.getList();
          return this.isShowOutlets = false;
        } else {
          let msg = res.data.errorMsg || '服务器错误!';
          this.$Message.error(msg)
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
