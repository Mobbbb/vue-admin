<template>
  <div class="invite-record">
    <Row>
      <Form inline :label-width='100'>
          <FormItem label='推荐人角色'>
            <Select v-model="searchData.referrerRole" style="width:250px" clearable>
              <Option :value="1">司机</Option>
              <Option :value="2">乘客</Option>
            </Select>
          </FormItem>
          <FormItem label='推荐人名称'>
            <Input v-model="searchData.pRealName" style="width:250px" clearable></Input>
          </FormItem>
          <FormItem label='推荐人手机号'>
            <Input v-model="searchData.pMobile" style="width:250px" clearable></Input>
          </FormItem>
          <FormItem label='注册时间'>
            <DatePicker
              v-model="searchData.registerTime"
              type='datetimerange'
              style="width:250px"
              @on-change='changeRegisterTime'></DatePicker>
          </FormItem>
          <FormItem label='活动名称' v-show="isShowMore">
            <Input v-model="searchData.activityName" style="width:250px" clearable></Input>
          </FormItem>
          <FormItem label='被推荐人名称' v-show="isShowMore">
            <Input v-model="searchData.recommendedDriverName" style="width:250px" clearable></Input>
          </FormItem>
          <FormItem label='被推荐人手机号' v-show="isShowMore">
            <Input v-model="searchData.recommendedDriverPhone" style="width:250px" clearable></Input>
          </FormItem>
          <FormItem label='完成首单时间' v-show="isShowMore">
            <DatePicker
              v-model="searchData.orderTime"
              type='datetimerange'
              style="width:250px"
              @on-change='changeOrderTime'></DatePicker>
          </FormItem>
          <FormItem :label-width='0'>
            <Button type="primary" @click="search" style="margin-right:20px">查询</Button>
            <Button @click="reset">清空</Button>
            <a class="show-more" @click='isShowMore = !isShowMore'>
              <Icon type="md-remove" v-show="isShowMore"/>
              <Icon type="md-add"  v-show="!isShowMore"/>
              <span v-show="!isShowMore">查看更多</span>
              <span v-show="isShowMore">收起更多</span>
            </a>          
          </FormItem>
      </Form>
    </Row>
    <VTable
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="tableColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize">
    </VTable>
    <Modal v-model="isShowModal" :mask-closable='false'>
      <p slot="header" style="color:#f60;text-align:center">{{title}}</p>
      <div class="inviteDetail" v-for="(item, index) in detailList" :key="index">
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
import {defaultData, invite} from './fields'
import { inviteRecoreList, awardRecord } from '@/api/passenger';
import { roleMap, couponTypeMap, useTypeMap, useLimitMap } from '@/config/passengerTable'
export default {
  components:{
    VTable
  },
  data(){
    return {
      ...defaultData,
      tableColumnsChecked: ['referrerRole', 'pRealName', 'pMobile', 'activityName', 'recommendedDriverName', 'recommendedDriverPhone', 'firstTime', 'registerRewardSum', 'createTime', 'firstOrderSum'],
      isShowModal: false, // 是否显示详情
      title: '',
      detailList: [], // 详情内容列表
      isShowMore: false, // 是否显示更多搜索条件
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
      this.current = 1      
      this.getList()
    },
    reset(){
      this.searchData = {}
      this.current = 1
      this.getList()
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
                  this.getDetail(params.row.activityUuid)
                  let rewardSum = params.row.rewardSum ? params.row.rewardSum : '0'
                  let givingMoneySum = params.row.givingMoneySum ? params.row.givingMoneySum : '0'
                  let discountNum = params.row.discountNum ? params.row.discountNum : '0'
                  let deductionNum = params.row.deductionNum ? params.row.deductionNum : '0'
                  this.title = rewardSum + '元(含'+ givingMoneySum + '个赠送币、' + discountNum + '张折扣券、' + deductionNum + '张抵扣券' + ')'
                }
              }
            }, '详情')
          ]);
        }
      };
      this.tableColumnsChecked.forEach(col => data.push(invite[col]));
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
      if(params.registerTime){
        delete params['registerTime']
      }
      if (params.orderTime){
        delete params['orderTime']
      }
      inviteRecoreList(params).then(res=> {        
        this.$store.commit('changeLoadingFlag', false)
        let data = res.data.data
        this.isLoading = true;
        this.total = data.totalCount;
        this.current = data.currPage !== 0 ? res.data.data.currPage : 1;
        this.pageSize = data.pageSize;
        this.tableData = data.list;
        this.tableData.forEach((v, k) => {
          v.referrerRole = roleMap[v.referrerRole]
          let registerRewardSum = v.registerRewardSum ? v.registerRewardSum : '0'
          let givingMoneySum = v.giftmoney ? v.giftmoney : '0'
          let discountNum = v.discountNum ? v.discountNum : '0'
          let deductionNum = v.deductionNum ? v.deductionNum : '0'
          let firstOrderSum = v.firstOrderSum ? v.firstOrderSum : '0'
          let firstGiftmoneySum = v.firstGiftmoney ? v.firstGiftmoney : '0'
          let firstDiscountNum = v.firstDiscountNum ? v.firstDiscountNum : '0'
          let firstDeductionNum = v.firstDeductionNum ? v.firstDeductionNum : '0'
          v.registerRewardSum = registerRewardSum + '元(含'+ givingMoneySum + '个赠送币、' + discountNum + '张折扣券、' + deductionNum + '张抵扣券' + ')'
          v.firstOrderSum = firstOrderSum + '元(含'+ firstGiftmoneySum + '个赠送币、' + firstDiscountNum + '张折扣券、' + firstDeductionNum + '张抵扣券' + ')'
        })
      })
    },
    getDetail(id){
      let params = { 
        activityUuid: id
       }
      awardRecord(params).then(res => {        
        let data = res.data.data
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
      })
    },
    changeRegisterTime(value){
      this.searchData.registerStartingTime = value[0]
      this.searchData.registerEndTime = value[1]
    },
    changeOrderTime(value){
      this.searchData.orderStartingTime = value[0]
      this.searchData.orderEndTime = value[1]
    }
  }
}
</script>
<style lang="less">
.inviteDetail{
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
