<template>
  <div>
    <div class="customer">
      <SearchList :inputList="inputList" @on-search='search' @on-reset="reset"></SearchList>
    </div>
    <Modal
        title="封号"
        v-model="isShow"
        @on-ok="ban"
        class-name="vertical-center-modal">
        <div>
          <Form ref="queryForm" :model="queryForm" :label-width="120" :rules='formRule'>
            <FormItem label="乘客姓名">
              <Input v-model="queryForm.realName" style="width:300px" disabled></Input>
            </FormItem>
            <FormItem label="乘客手机号">
              <Input v-model="queryForm.mobile" style="width:300px" disabled></Input>
            </FormItem>
            <FormItem label="封号类型" prop='blockType'>
              <Select v-model="queryForm.blockType" style="width:300px" clearable @on-change='banType'>
                <Option value="2">短期封号</Option>
                <Option value="3">长期封号</Option>
              </Select>
            </FormItem>
            <FormItem label="解封时间" v-if="isShowTime" prop='date'>
              <DatePicker
                  clearable="clearable"
                  placeholder="请输入"
                  type="date"
                  :options="options"
                  style="width:300px"
                  v-model='queryForm.date'
                  @on-change='banTime'>
                </DatePicker>
            </FormItem>
            <FormItem label="封号备注" prop='comment'>
              <Input clearable="clearable" type="textarea" placeholder="请输入" v-model="queryForm.comment" style="width:300px"></Input>
            </FormItem>
          </Form>          
        </div>
        <div slot="footer">
          <Button type="primary" @click="ban" style="margin-right:20px">确定</Button>
          <Button @click="isShow = false">取消</Button>
        </div>
    </Modal>
    <VTable
      :total="pageData.total"
      :current="pageData.current"
      :pageSize="pageData.pageSize"
      :parColumns="tableColumns"
      :parTableData="tableData"
      @sort="sort"
      @selectObj="selectObj"
      @changePage="changePage"
      @changePageSize="changePageSize">
    </VTable>
  </div>
</template>

<script>
import { fields, pageData, inputList } from './fields';
import {queryList, deblock, block} from '@/api/passenger.js';

export default {
  mounted() {
    this.getTableColumns();
    
    let isReload = this.$store.state.cache['customer-basic']
    if(isReload){
      Object.keys(this.searchData).forEach(key=>{
        this.searchData[key] = ''
      })
      this.pageData = {
        total: 0,
        current: 1,
        pageSize: 10
      }
      this.inputList.forEach(item=>{
        item.value = ''
      })
      this.getList();
      this.$store.commit('switchCacheState',['customer-basic',false])
    }else{
      this.$store.commit('changeLoadingFlag', false)
      this.tableData.length===0 && this.getList();
    }
  },
  data() {
    return {
      options: {
        disabledDate (date) {
            return date && date.valueOf() < Date.now()
        }
      },
      inputList,
      tableColumnsChecked: ['realname', 'mobile', 'sex', 'age', 'grealnameOrNot', 'cash', 'status', 'registerTime'],
      // customList: {...fields},
      ...pageData,
    }
  },
  methods: {
    search: function(data){
      Object.keys(data).forEach(key=>{
        this.searchData[key] = data[key]
      })
      this.pageData.current = 1
      this.getList()
    },
    reset: function(data){
      Object.keys(this.searchData).forEach(key=>{
        this.searchData[key] = ''
      })
      this.pageData.current = 1
      this.getList()
    },
    getList() {
      let params = {
        currPage: this.pageData.current,
        pageSize: this.pageData.pageSize
      };
      if(this.searchData) {
        Object.assign(params, this.searchData)
      }
      queryList(params).then(res => {
        let data = res.data.data.pageResult
        this.pageData.total = data.totalCount
        this.tableData = data.list
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
        width: 150,
        render: (h, params) => {
          let info = {
            passengerUuid: params.row.passengerUuid,
            realName: params.row.realname,
            mobile: params.row.mobile
          }
          return h('div', [
            h('Button', {
              props: {
                type: 'warning',
                size: 'small'
              },
              directives: [{
                name: 'hasAuth',
                value: 'customer-basic-update'
              }],
              attrs: {
                ghost: 'ghost'
              },
              style: {
                marginRight: '15px',
                display: params.row.status === '0' ? 'inline-block' : 'none'
              },
              on: {
                click: () => {
                  this.isShow = true
                  this.queryForm = {}
                  this.queryForm = info
                }
              }
            }, '封号'),
            h('Button', {
              props: {
                type: 'warning',
                size: 'small'
              },
              directives: [{
                name: 'hasAuth',
                value: 'customer-basic-update'
              }],
              attrs: {
                ghost: 'ghost'
              },
              style: {
                marginRight: '15px',
                display: params.row.status !== '0' ? 'inline-block' : 'none'
              },
              on: {
                click: () => {
                  this.deblockAccountTry(info)
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
                value: 'customer-basic-detail'
              }],
              attrs: {
                ghost: 'ghost'
              },
              on: {
                click: () => {
                  this.$router.push({name:'customer-detail', params:{ id:params.row.passengerUuid }})
                }
              }
            }, '详情')
          ]);
        }
      };
      this.tableColumnsChecked.forEach(col => data.push(fields[col]));
      data.push(action);
      this.tableColumns = data;
    },
    changePageSize(val) {
      this.pageData.pageSize = val;
      this.getList();
    },
    sort(data) {
      if (data.order === 'normal') {
        this.sidx = 'csmId';
        this.sord = 'desc';
      } else {
        let str = data.key;
        str = str.replace(/Text$/, '');
        this.sidx = str;
        this.sord = data.order;
      }
        this.getList();
    },
    selectObj (data) {
      let strIds = [];
      data[0].forEach((currentValue, index, arr) => {
          strIds.push(currentValue.csmId);
      });
      this.ids = strIds.join();
    },
    changePage (val) {
      this.pageData.current = val;
      this.getList();
    },
    registerTime (value) {
      value[0] = new Date(value[0])
      value[1] = new Date(value[1])
      value[0] = value[0].getTime()
      value[1] = value[1].getTime()
      this.searchData.startTime = value[0]
      this.searchData.endTime = value[1]
    },
    banTime(value) {
      this.queryForm.deblockTime = new Date(value)
      this.queryForm.deblockTime = this.queryForm.deblockTime.getTime()
    },
    banType(value) {
      if (value !== '2') {
        this.isShowTime = false
      } else {
        this.isShowTime = true
      }
    },
    ban() { // 封号接口
      let params = {
        passengerUuid: this.queryForm.passengerUuid,
        blockType: this.queryForm.blockType,
        deblockTime: this.queryForm.deblockTime,
        comment: this.queryForm.comment
      }
      if(params.blockType === '3'){
        delete params['deblockTime']
      }
      this.$refs['queryForm'].validate((valid) => {
        if (valid) {
          block(params).then(res => {
            this.$Message.success('操作成功')
            this.isShow = false
            this.getList()
          })
        } else {
          this.$Message.error('请重新确认内容!');
        }
      })      
    },
    deblock(params) { // 解封接口
      deblock(params).then(res => {                  
        this.$Message.success('此用户已解封')          
        this.getList()
      })
    },
    deblockAccountTry (data) { // 解封对话框
      let params = {
        passengerUuid: data.passengerUuid
      }
      this.$Modal.confirm({
        title: '解封',
        content: '确定要解封吗',
        onOk: () => {
          this.deblock(params)
        }
      })
    }
  }
}
</script>