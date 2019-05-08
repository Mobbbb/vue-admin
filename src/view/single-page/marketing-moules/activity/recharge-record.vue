<template>
  <div class="recharge-record">
    <Row>
      <Form inline :label-width='100'>
          <FormItem label='充值名称'>
            <Input v-model="searchData.activityName" style="width:250px"></Input>
          </FormItem>
          <FormItem label='乘客姓名'>
            <Input v-model="searchData.realName" style="width:250px"></Input>
          </FormItem>
          <FormItem label='乘客昵称'>
            <Input v-model="searchData.nickname" style="width:250px"></Input>
          </FormItem>
          <FormItem label='乘客手机号'>
            <Input v-model="searchData.mobile" style="width:250px"></Input>
          </FormItem>
          <FormItem label='充值时间'>
            <DatePicker
              v-model="searchData.time"
              type='datetimerange'
              style="width:250px"
              @on-change='changeTime'></DatePicker>
          </FormItem>
          <FormItem :label-width='40'>
            <Button type="primary" @click="search" style="margin-right:20px">查询</Button>
            <Button style="margin-right: 100px" @click="reset">清空</Button>
          </FormItem>
      </Form>
    </Row>
    <VTable
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :isLoading="isLoading"
      :parColumns="tableColumns"
      :parTableData="tableData"
      @selectObj="selectObj"
      @changePage="changePage"
      @changePageSize="changePageSize">
    </VTable>
    <Modal v-model="isShowModal" :mask-closable='false'>
      <p slot="header" style="color:#f60;text-align:center">{{title}}</p>
      <div class="registrationDetail" v-for="(item, index) in detailList" :key="index">
        <div class="detailIndex">券{{index + 1}}:</div>
        <div class="detailContent">
          <div class="contentLeft">
            <p>{{item.couponMoney}}元</p>
            <p>满{{item.astrict}}元可用</p>
          </div>
          <div class="contentRight">
            <span class="type">{{item.couponType}}</span>
            <p>{{item.couponName}}</p>
            <p>有效期：获取后{{item.effectiveDay}}天内可用</p>
            <p>{{item.useType}}-{{item.useLimit}}订单-{{item.usePeriod}}</p>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import VTable from '_a/v-table/v-table'
import {defaultData, recharge} from './fields'
import { orderRecordList, awardRecord } from '@/api/passenger';
import { couponTypeMap, useTypeMap, useLimitMap } from '@/config/passengerTable'
export default {
  components:{
    VTable
  },
  data(){
    return {
      ...defaultData,
      tableColumnsChecked: ['nickname', 'mobile', 'realName', 'rechargeAmount', 'giftmoney', 'activityName', 'createdOn'],
      isShowModal: false, // 是否显示详情
      detailList: [], // 详情内容列表
      title: ''
    }
  },
  created() {
    this.getList()
  },
  mounted(){
    this.getTableColumns()
  },
  methods: {
    search(){
      this.getList()
    },
    reset(){
      this.searchData = {}
      this.current = 1
      this.getList()
    },
    selectObj(data){
      let strIds = [];
      data[0].forEach((currentValue, index, arr) => {
          strIds.push(currentValue.csmId);
      });
      this.ids = strIds.join();
    },
    changePage(val){
      this.current = val;
      this.getList();
    },
    changePageSize(val){
      this.pageSize = val;
      this.getList();
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
        maxWidth: 100,
        minWidth:80,
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
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.isShowModal = true;
                  this.detail(params.row.activityUuid)
                  let rewardSum = params.row.rewardSum + '元'
                  let givingMoneySum = params.row.givingMoneySum ? params.row.givingMoneySum : '0'
                  let discountNum = params.row.discountNum ? params.row.discountNum : '0'
                  let deductionNum = params.row.deductionNum ? params.row.deductionNum : '0'
                  this.title = rewardSum + '(含'+ givingMoneySum + '个赠送币、' + discountNum + '张折扣券、' + deductionNum + '张抵扣券' + ')'
                }
              }
            }, '详情')
          ]);
        }
      };
      this.tableColumnsChecked.forEach(col => data.push(recharge[col]));
      data.push(action);
      this.tableColumns = data;
    },
    getList(){
      let params = {
        currPage: this.current,
        pageSize: this.pageSize
      }
      if(this.searchData) {
        Object.assign(params, this.searchData)
      }
      if(params.time){
        delete params['time']
      }
      orderRecordList(params).then(res=> {        
        if(res.data.success){
          let data = res.data.data
          this.isLoading = true;
          this.total = data.totalCount;
          this.current = data.currPage !== 0 ? res.data.data.currPage : 1;
          this.pageSize = data.pageSize;
          this.tableData = data.list;
        } else {
          this.$Message.error(res.data.errorMsg)
        }
      })
    },
    detail(id){
      let params = { 
        activityUuid: id
       }
      awardRecord(params).then(res => {
        if(res.data.success){
          let data = res.data.data.list
          this.detailList = data
          this.detailList.forEach((v, k) => {
            v.couponType = couponTypeMap[v.couponType]
            v.useType = useTypeMap[v.useType]
            v.useLimit = useLimitMap[v.useLimit]
            if(v.usePeriod === 1){
              v.usePeriod = '全天可用'
            } else if(v.usePeriod === 2){
              v.usePeriod = '限制时段'
            }
          })
        }
      })
    },
    changeTime(value){
      this.searchData.startingTime = value[0]
      this.searchData.endTime = value[1]
    }
  }
}
</script>
<style lang="less">
.rechargeDetail{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 150px;
  margin: 20px;
  .detailIndex{
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border: 1px solid;
    border-radius: 5px;
  }
  .detailContent{
    height: 150px;
    width: 85%;
    border: 1px solid;
    display: flex;
    .contentLeft{
      width: 100px;
      border-right: 1px solid;
      height: 100%;
      text-align: center;
      display: flex;
      justify-content: center;
      flex-direction: column;
    }
    .contentRight{
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      width: 100%;
      padding-left: 20px;
      position: relative;
      .type{
        position: absolute;
        right: 0px;
        top: 0px;
        border-left: 1px solid;
        border-bottom: 1px solid;
        padding: 5px;
      }
    }
  }
}
</style>
