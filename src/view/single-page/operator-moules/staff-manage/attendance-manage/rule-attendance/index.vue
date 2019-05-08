<template>
  <div class="month-attendance-container">
    <Form :model="searchData" class="search-input-wrap">
        <FormItem label='考勤类型'>
          <Select v-model="searchData.examineType"  filterable style="width:200px">
            <Option v-for="(item, index) in checkTypes" :value="item.value" :key="index">{{ item.text }}</Option>
          </Select>
        </FormItem>
        <FormItem label='城市'>
          <Select v-model="searchData.cityUuid"  filterable style="width:200px">
            <Option v-for="(item, index) in cityList" :value="item.cityUuid" :key="index">{{ item.city }}</Option>
          </Select>
        </FormItem>
        <FormItem label='所属运营商'>
          <Select v-model="searchData.agentUuid"  filterable style="width:160px">
            <Option v-for="(item, index) in agentList" :value="item.uuid" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label='选择年份'>
          <DatePicker type="year" v-model='year'  @on-change='selectYear' placeholder="请选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label='选择月份'>
          <Select v-model="month" @on-change="selectDate" filterable style="width:200px">
            <Option v-for="(item, index) in allMonths" :value="item.value" :key="index">{{ item.text }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click='queryData' style="margin-right: 15px;">搜索</Button>
          <Button @click='clearQueryData'>清空</Button>
        </FormItem>
      </Form>
      <Button type="primary" style="margin-bottom: 20px;" @click="addData">新增</Button>
      <VTable
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
      <Modal
        v-model="isShowRuleModal"
        :title="ruleModalTitle"
        :mask-closable="false"
        :footer-hide='isReadonly'
        width="800"
      >
      <Form :model="commonFormData" :label-width="100" ref='checkForm' :rules='checkRule'>
        <FormItem label='考勤类型'>
          <Select :disabled='isReadonly' v-model="commonFormData.examineType"  @on-change='selectCheckType'  filterable style="width:200px">
            <Option v-for="(item, index) in checkTypes" :value="item.value" :key="index">{{ item.text }}</Option>
          </Select>
        </FormItem>
        <!-- 日考勤 -->
        <div  v-if='isShowDayCard'>
          <FormItem label='日在线时长'  prop='onlineDuration'>
            <InputNumber v-model="commonFormData.onlineDuration" :min='1' :max='1440'  placeholder="请输入时长: 单位(分钟)" style="width:200px"></InputNumber> 分钟
          </FormItem>
          <FormItem label='日高峰时长'  prop='heightDuration'>
            <InputNumber v-model="commonFormData.heightDuration" :min='1' :max='1440'  placeholder="请输入时长: 单位(分钟)" style="width:200px"></InputNumber> 分钟
          </FormItem>
        </div>
        <!-- 月考勤 -->
        <Card  style="text-align:left;" v-else>
          <FormItem label='选择年'  prop="examineYear">
            <DatePicker type="year" v-model='commonFormData.examineYear'  @on-change='selectCheckYear' placeholder="请选择日期" style="width: 200px"></DatePicker>
            <!-- <Input v-model="commonFormData.examineYear" v-else :readonly='isReadonly'></Input> -->
          </FormItem>
          <Col v-for="(data, index) in commonFormData.list" :key='index'>
            <FormItem label='月份' style="display: inline-block;" >
              <Select v-model="data.month" clearable   filterable style="width:200px" >
                <Option v-for="(item, index) in allMonths" :value="item.value" :key="index">{{ item.text }}</Option>
              </Select>
              <!-- <Input v-model="data.month" v-show='isReadonly' :readonly='isReadonly'></Input> -->
            </FormItem>
            <FormItem label='出勤天数' style="display: inline-block;">
              <InputNumber v-model="data.day" :min='1' :max='31' placeholder="请选择天数" style="width:160px;"></InputNumber>
            </FormItem>
            <FormItem style="display: inline-block;" v-if="!isReadonly">
              <Button @click="deleteWorkTime(index)">
                <Icon type="md-close" />
              </Button>
            </FormItem>
          </Col>
          <div style="text-align: right;"  v-if="!isReadonly">
            <Button type="success" ghost @click='setWorkCheckTime'>
             <Icon type="md-add" />
             添加</Button>
          </div>
        </Card>
        <FormItem label='适用城市' prop="cityUuids" v-show='!isReadonly'>
          <Select v-model="commonFormData.cityUuids"   multiple  clearable filterable @on-change='getCity'>
            <Option v-for="(item, index) in includeAllCitys" :value="item.cityUuid" :key="index">{{ item.city }}</Option>
          </Select>
        </FormItem>
        <FormItem label='适用城市' v-show='isReadonly'>
          <Input v-model="commonFormData.cityName"  disabled  style="width:160px;"></Input>
        </FormItem>
        <FormItem label='适用运营商' prop="agentUuids" v-show='!isReadonly'>
          <Select v-model="commonFormData.agentUuids"  multiple clearable filterable @on-change='getAgent'>
            <Option v-for="(item, index) in includeAllAgents" :value="item.uuid" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label='适用运营商' v-show='isReadonly'>
          <Input v-model="commonFormData.agentName" disabled style="width:160px;"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="isShowRuleModal = false">关闭</Button>
        <Button v-if='isEdit' type="success" @click="auditRule">保存</Button>
        <Button @click="confirmHandle" v-show="!isEdit" type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import VTable from '_a/v-table/v-table.vue';
import {mapState} from 'vuex';
import {attendanceRuleList, 
        addAttendanceRule,
        attendanceRuleDetail,
        removeAttendanceRule,
        auditAttendanceRule} from '@/api/driver.js';
import {tableTitle, rulePageData} from './fields.js';
let editId = null;
  export default {
    name: 'RuleAttendance',
    components: {
      VTable
    },
    computed: mapState({
      cityList: state=> state.cityList,
      agentList: state => state.agentList
    }),
    created() {
      this.getTableColumns();
      this.getList();
    },
    mounted(){
      this.includeAllCitys = [];
      this.includeAllCitys = [...this.cityList];
      this.includeAllCitys.unshift({'city': "所有", 'cityUuid': 'AllCity'})
      this.includeAllAgents = [];
      this.includeAllAgents = [...this.agentList];
      this.includeAllAgents.unshift({'name': "所有", 'uuid': 'AllAgent'})
    },
    data() {
      return {
        ...rulePageData,
        includeAllCitys: [],
        includeAllAgents: []
      }
    },
    methods: {
      queryData() {
        this.current = 1;
        this.queryAjaxPramas = {};
        Object.keys(this.searchData).map(key=> {
          let item = this.searchData[key]
          if (item || item === 0) {
            this.queryAjaxPramas[key] = item;
          }
        })
       this.getList();
      },
      clearQueryData() {
        this.year = ''
        this.month = ''
        this.queryAjaxPramas = {};
        this.current = 1;
        this.searchData = {}
        this.getList();
      },
      getList() {
        let params = {
          currPage: this.current,
          pageSize: this.pageSize
        };
        let obj = Object.assign(params, this.queryAjaxPramas);
        attendanceRuleList(obj).then(res => {
          if (res.data.success) {
            this.isLoading = true;
            this.total = res.data.data.totalCount;
            this.current = res.data.data.currPage !== 0 ?  res.data.data.currPage : 1;
            this.pageSize = res.data.data.pageSize;
            this.tableData = res.data.data.list;
          }
        })
      },
      getTableColumns () {
        let data = [];
        let action = {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 200,
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
                  marginRight: '15px',
                  // display: this.authHandle('staff_manage_edit') ? 'inline-block' : 'none'
                },
                on: {
                  click: () => {
                    this.detailHandle(params.row.uuid);
                  }
                }
              }, '详情'),
               h('Button', { 
                props: {
                  type: 'warning',
                  size: 'small'
                },
                attrs: {
                  ghost: 'ghost'
                },
                style: {
                  marginRight: '15px',
                  // display: this.authHandle('staff_manage_edit') ? 'inline-block' : 'none'
                },
                on: {
                  click: () => {
                    editId = params.row.uuid;
                    this.auditHandle();
                  }
                }
              }, '编辑'),
              h('Button', { 
                props: {
                  type: 'error',
                  size: 'small'
                },
                attrs: {
                  ghost: 'ghost'
                },
                on: {
                  click: () => {
                    this.deleteHandle(params.row.uuid);
                  }
                }
              }, '删除'),
            ])
          }
        };
        // this.tableColumnsChecked.forEach(col => data.push(tableTitle[col]));
        data = [...tableTitle];
        data.push(action);
        this.tableColumns = data;
      },
      changePageSize(val) {
        this.pageSize = val;
        this.getList();
      },
      changePage (val) {
        this.current = val;
        this.getList();
      },
      detailHandle(id) {
        this.ruleModalTitle = '查看详情';
        this.isShowRuleModal = true;
        this.isReadonly = true;
        this.isEdit = false;
        this.getSingleData(id);
      },
      getSingleData(id){
         attendanceRuleDetail(id).then(res=>{
          if(res.data.success) {
            let data = res.data.data;
            this.isShowDayCard = true;
            this.commonFormData = data;
            if(data.examineType == 'M') {
               this.commonFormData.list = JSON.parse(data.examineValue)
               let isTrue = Array.isArray(this.commonFormData.list)
               isTrue && this.commonFormData.list.forEach(item=> {
                 item.day = Number(item.day)
               });
               this.commonFormData.examineYear = data.examineYear.toString()
               this.isShowDayCard = false;
            }
          }
        })
      },
      auditHandle() {
        this.getSingleData(editId);
        this.ruleModalTitle = '修改数据';
        this.isShowRuleModal = true;
        this.isReadonly = false;
        this.isEdit = true;
      },
      getCity(values){
        if (Array.isArray(values)) {
          let isAll = values.some(val => {
            return val === 'AllCity'
          })
          if (isAll) {
            this.commonFormData.cityUuids = [];
            this.cityList.map(item=> {
              this.commonFormData.cityUuids.push(item.cityUuid)
            })
          }
        }
      },
      getAgent(values) {
        if (Array.isArray(values)) {
          let isAll = values.some(val => {
            return val === 'AllAgent'
          })
          if (isAll) {
            this.commonFormData.agentUuids = [];
            this.agentList.map(item=> {
              this.commonFormData.agentUuids.push(item.uuid)
            })
          }
        }
      },
      auditRule() {
        let params = {
          uuid: editId,
          examineType: this.commonFormData.examineType,
          onlineDuration: this.commonFormData.onlineDuration,
          heightDuration:  this.commonFormData.heightDuration,
          list: this.commonFormData.list
        };
        auditAttendanceRule(params).then(res=> {
          if(res.data.success) {
            this.$Message.success('修改成功！')
            this.isShowRuleModal = false;
          }
        })
      },
      deleteHandle(id) {
        let self = this;
        this.$Modal.confirm({
            title: '删除',
            content: '<p>确定要删除这条规则吗？</p>',
            okText: '确定',
            cancelText: '关闭',
            onOk: ()=>{
              removeAttendanceRule(id).then(res=>{
                if(res.data.success) {
                  self.$Message.success('删除成功！')
                  self.getList();
                }
              })
            }
        });
      },
      addData(){
        this.ruleModalTitle = '新增数据';
        this.commonFormData = {
          list: []
        };
        this.isReadonly = false;
        this.isShowRuleModal = true;
        this.isEdit = false;
        this.$refs.checkForm.resetFields()
        this.commonFormData.examineType = 'D';
        this.isShowDayCard = true;
        this.commonFormData.onlineDuration = null
        this.commonFormData.heightDuration = null;
      },
      selectCheckType(value) {
        this.commonFormData.list = [];
        this.commonFormData.examineYear = '';
        if (value == 'D') {
          this.isShowDayCard = true;
        } else {
          this.isShowDayCard = false;
        }
      },
      selectCheckYear(data) {
        if (data) {
          this.commonFormData.examineYear = data;
        }
      },
      setWorkCheckTime() {
        let obj = {
          month: null,
          day: null
        }
        this.commonFormData.list.push(obj)
      },
      deleteWorkTime(i) {
        let items = this.commonFormData.list;
        items.splice(i,1);
      },
      confirmHandle() {
        this.$refs.checkForm.validate(valid=>{
          if(valid){
            let items  = this.commonFormData;
            let isEmit = false;
            isEmit = items.list.some(item=> {
              return item.month == null || item.day == null;
            })
            if(items.list.length == 0) {
              isEmit = false;
            }
            if (!isEmit) {
              addAttendanceRule(items).then(res=>{
                if(res.data.success) {
                  let msg = res.data.msg;
                  this.$Message.success(msg);
                  this.isShowRuleModal = false;
                  this.getList();
                }
              })
            } else {
              this.$Message.error('月份和天数不能为空！')
            }
          }
        })
      },
      selectDate(data) {
        if(data) {
          this.searchData.examineMonth = data;
        }
      },
      selectYear(data) {
         if(data) {
          this.searchData.examineYear = data;
        }
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
.search-input-wrap > div{
  display: flex;
  margin-right: 35px;
}
</style>