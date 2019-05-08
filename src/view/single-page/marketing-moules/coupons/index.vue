<template>
  <div>
    <div class="coupons">
      <Row>        
        <Form class="formQueryStyle" inline="inline" :model="searchData" :label-width="80">
          <Col>
            <FormItem label="优惠券名称">
              <Input clearable="clearable" placeholder="请输入" v-model="searchData.couponName" style="width:250px"></Input>
            </FormItem>
            <FormItem label="针对城市">              
              <Select v-model="searchData.cityUuid" placeholder="请选择" style="width:250px">
                <Option v-for="(item, index) in citys" :key="index" :value="item.cityUuid">{{item.city}}</Option>
              </Select>
            </FormItem>            
            <FormItem>
                <Button type="primary" @click="search" style="margin-right:20px">查询</Button>
                <Button @click="reset">清空</Button>
            </FormItem>
          </Col>
        </Form>
      </Row>    
    </div>
    <Button type="primary" @click="newCoupons">新增活动</Button>
    <VTable
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :isLoading="isLoading"
      :parColumns="tableColumns"
      :parTableData="tableData"
      @selectObj="selectObj"
      @changePage="changePage"
      @changePageSize="changePageSize"
      style="margin-top: 20px;">
    </VTable>
    <Modal
      class-name="formModalStyle"
      v-model="isShow"
      :title="title"
      :mask-closable="false">
      <Form ref="formInline" :model="formInline" :label-width="100" :rules='formRule'>
        <FormItem label='优惠券名称' prop='couponName'>
          <Input v-model="formInline.couponName" :maxlength="8"></Input>
        </FormItem>
        <FormItem label='优惠券模板' prop='templateUuid'>
          <Select v-model="formInline.templateUuid" filterable>
            <Option v-for="(item, index) in templateName" :value="item.uuid" :key="item.uuid">{{item.templateName}}</Option>
          </Select>
        </FormItem>
        <FormItem label='使用城市' prop='cityUuid'>
          <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
            <Checkbox
              :indeterminate="indeterminate"
              :value="checkAll"
              @click.prevent.native="handleCheckAll">全选</Checkbox>
          </div>
          <CheckboxGroup v-model="checkAllGroup" @on-change="checkAllGroupChange">
            <Checkbox v-for="(item, index) in citys" :label="item.cityUuid" :key="index">{{item.city}}</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label='使用时段' prop='periodBegin'>
          <Select v-model="formInline.periodBegin" style="width:150px;">
            <Option v-for="(item, index) in timeArr" :value="item" :key="index">{{item}}</Option>
          </Select>-
          <Select v-model="formInline.periodEnd" style="width:150px;">
            <Option v-for="(item, index) in timeArr" :value="item" :key="index">{{item}}</Option>
          </Select>
        </FormItem>
        <FormItem label='有效期' prop='expiryDay'>
          <Input v-model="formInline.expiryDay" number>
            <span slot="prepend">获取后</span>
            <span slot="append">天内使用</span>
          </Input>
        </FormItem>
        <FormItem label='优惠券数量' prop='totalNumber'>
          <Input v-model="formInline.totalNumber" number></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" @click="save('add')" style="width: 80px" v-if="isAdd">保存</Button>
        <Button type="primary" size="large" @click="save('update')" style="width: 80px" v-else>保存</Button>
        <Button size="large" @click="close" style="width: 80px;">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { fields, pageData } from './fields';
import {couponList, couponInfo, couponSave, couponUpdate, templateAll } from '@/api/passenger';
import { getCitys } from '@/api/common'
export default {
  created() {
    this.getList();
    /*templateAll().then(res => {
      if(res.data.success) {
        this.templateName = res.data.data
      } else {
        this.$Message.error(res.data.errorMsg)
      }
    })*/
    getCitys({}).then(res => {
      if(res.data.success){
        this.citys = res.data.data
      }
    })
  },
  mounted() {
    this.getTableColumns();
  },
  data () {
    return {
      ...pageData,
      searchData: {},
      isAdd: true, // true为新增，false为修改
      isShow: false, // 是否显示Modal
      title: '',
    }
  },
  methods: {
    search: function(){
      this.current = 1
      this.getList()
    },
    reset: function(data){
      this.searchData = {}
      this.current = 1
      this.getList()
    },
    getList() {
      let params = {
        currPage: this.current,
        pageSize: this.pageSize,
      };
      if(this.searchData) {
        Object.assign(params, this.searchData)
      }
      couponList(params).then(res => {
        if (res.data.success) {
          let data = res.data.data
          this.isLoading = true;
          this.total = data.totalCount;
          this.current = data.currPage !== 0 ? res.data.data.currPage : 1;
          this.pageSize = data.pageSize;
          data.list.forEach((v, k) => {
            v.listCityText = ''
            v.listCity.forEach((val, key) => {
              v.listCityText += val.cityName + ' '
            })
          })
          this.tableData = data.list;
        } else {
          this.$Message.error(res.data.errorMsg)
        }
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
        minWidth: 140,
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'warning',
                size: 'small'
              },
              attrs: {
                ghost: 'ghost'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.title = '修改活动'
                  this.isShow = true
                  this.isAdd = false
                  this.formInline = {}
                  this.detail(params.row.uuid)
                }
              }
            }, '修改'),
            h('Button', {
              props: {
                type: 'success',
                size: 'small'
              },
              attrs: {
                ghost: 'ghost'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.$router.push({name:'coupons-detail', params:{ id:params.row.uuid }})
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
      this.pageSize = val;
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
      this.current = val;
      this.getList();
    },
    newCoupons () { // 新增优惠券
      this.isShow = true
      this.isAdd = true
      this.formInline = {}
      this.formInline.periodBegin = '0'
      this.formInline.periodEnd = '24'
      this.title = '新增活动'
      this.checkAllGroup = []
      this.checkAllGroupChange(this.checkAllGroup)
      this.$refs['formInline'].resetFields();
    },
    save(type) {
      let begin = this.formInline.periodBegin
      let end = this.formInline.periodEnd      
      let params = this.formInline
      this.formInline.cityUuid = this.checkAllGroup.toString()
      if (type === 'add') { // type=true为新增，false为修改
        this.$refs['formInline'].validate((valid) => {
          if (valid) {
            if (begin>end) {
              this.$Message.error('开始时段不能晚于结束时段')
            } else if(begin === end) {
              this.$Message.error('开始时段不能等于结束时段')
            } else {
              couponSave(params).then(res => {
                this.isShow = false
                this.getList()
                this.$Message.info(res.data.msg)
              })
            }            
          } else {
            this.$Message.error('请重新确认内容!');
          }
        })
      } else if(type === 'update') {        
        this.$refs['formInline'].validate((valid) => {
          if (valid) {
            if (begin>end) {
              this.$Message.error('开始时段不能晚于结束时段')
            } else if(begin === end) {
              this.$Message.error('开始时段不能等于结束时段')
            } else {
              couponUpdate(params).then(res => {
                if (res.data.success) {
                  this.isShow = false
                  this.getList()
                  this.$Message.info(res.data.msg)
                } else {
                  this.$Message.error(res.data.data)
                }
              })
            }
          } else {
            this.$Message.error('请重新确认内容!');
          }
        })
      }
    },
    close() {
      this.isShow = false;
    },
    detail(id) {
      this.checkAllGroup = []
      this.formInline = {}
      let THIS = this
      couponInfo(id).then(res => {
        if(res.data.success) {          
          this.formInline = res.data.data
          res.data.data.listCity.forEach(function(v, k) {
            THIS.checkAllGroup.push(v.cityUuid)
          })
          this.checkAllGroupChange(this.checkAllGroup)
        } else {
          this.$Message.error(res.data.errorMsg)
        }
      })
    },
    handleCheckAll () {
      this.indeterminate ? this.checkAll = false : this.checkAll = !this.checkAll
      this.indeterminate = false;      
      if(this.checkAll){
        for(let item of this.citys){
          this.checkAllGroup.push(item.cityUuid)
        }
      } else {
        this.checkAllGroup = []
      }
    },
    checkAllGroupChange (data) {
      if (data.length === this.citys.length) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    }
  }
}
</script>
<style lang="less">
.coupons{
  text-align: left
}
</style>