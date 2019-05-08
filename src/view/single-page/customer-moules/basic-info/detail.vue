<template>
  <div class="customerMain">
    <div class="customerLeft">
      <Card class="order-detail-card" v-for="(item, index) in customerData" :key="index">
          <p slot="title">
              <Icon type="ios-film-outline"></Icon>
              {{item.title}}
          </p>
          <Col v-for="(cell, index) in item.value" :span="cell.span" :key="index">
              <Form class="display-div">
                  <FormItem :label="cell.name + ' :'">
                    <div class="detail-content" v-if="cell.key === 'face'">
                      <Button size="small" shape="circle" icon="ios-search" @click="popPic = true"></Button>
                      <Modal v-model="popPic" title="查看头像">
                        <img :src="cell.value" style="width: 100%;">
                      </Modal>
                    </div>
                    <p class="border-content1" v-else-if="cell.key === 'accountStatus'">{{cell.value}}</p>
                    <p class="border-content2" v-else-if="cell.key === 'realnameStatus'">{{cell.value}}</p>
                    <p class="detail-content" v-else>{{cell.value}}</p>
                  </FormItem>
              </Form>
          </Col>
      </Card>
    </div>
    <div class="customerRight">
      <Tabs type="card" @on-click="tabsName" v-model="tabsIndex" class="passenger-detail-card">
        <TabPane label="订单记录" name="0">
          <div v-show="tabsIndex === '0'">
            <div class="orderRecord" style="padding-bottom: 5px;">
              <p>总订单<span>{{orderTips.totalOrder}}</span>笔</p>
              <p>行程中<span>{{orderTips.doingRouteNum}}</span>笔</p>
            </div>
            <div class="orderRecord" style="padding-top: 5px;">
              <p>已完成<span>{{orderTips.completedOrder}}</span>笔</p>
              <p>已取消<span>{{orderTips.canceledOrder}}</span>笔</p>
              <p>待支付<span>{{orderTips.unpaidOrder}}</span>笔</p>
            </div>
          </div>
        </TabPane>
        <TabPane label="充值记录" name="1">
          <div v-show="tabsIndex === '1'">
            <div class="orderRecord" style="padding-bottom: 5px;">
              <p>充值<span>{{rechargeTips.totalRechargeCount}}</span>笔</p>
              <p>累计充值金额<span>{{rechargeTips.totalRechargeAmount}}</span>元</p>
            </div>
            <div class="orderRecord" style="padding-top: 5px;">
              <p>账户余额<span>{{rechargeTips.accountCash}}</span>元</p>
              <p>现金<span>{{rechargeTips.cashRemain}}</span>元</p>
              <p>赠送币<span>{{rechargeTips.giftBalance}}</span>元</p>
            </div>
          </div>
        </TabPane>
        <TabPane label="消费记录" name="2">
          <div class="orderRecord" v-show="tabsIndex === '2'">
            <p>消费次数<span>{{consumptionTips.totalConsumeCount}}</span>笔</p>
            <p>累计消费金额<span>{{consumptionTips.totalConsumeAmount}}</span>元</p>
          </div>
        </TabPane>
        <TabPane label="退款记录" name="3"></TabPane>
        <TabPane label="优惠券" name="4">
          <div class="orderRecord" v-show="tabsIndex === '4'">
            <p>共<span>{{couponsTips.count}}</span>张券</p>
            <p><span>{{couponsTips.useCount}}</span>张可用</p>
          </div>
        </TabPane>
        <TabPane label="账号管控记录" name="5">
          <div class="orderRecord" v-show="tabsIndex === '5'">
            <p>账号状态：<span>{{disableAccountTips.accountStatus}}</span></p>
            <p>封号次数<span>{{disableAccountTips.disableCount}}</span>次</p>
            <p>拉黑次数<span>{{disableAccountTips.pullBlack}}</span>次</p>
          </div>
        </TabPane>
        <TabPane label="紧急联系人" name="6">
          <div class="orderRecord" v-show="tabsIndex === '6'">
            <p>紧急联系人<span>{{emergencyContactTips.emergencyPeopleCount}}</span>位</p>
          </div>
        </TabPane>
        <TabPane label="行程分享记录" name="7">
          <div class="orderRecord" v-show="tabsIndex === '7'">
            <p>分享行程<span>{{tripShareTips.routeShareCount}}</span>次</p>
          </div>          
        </TabPane>
      </Tabs>
      <VTable
        :total="total"
        :current="current"
        :pageSize="pageSize"
        :parColumns="tableColumns"
        :parTableData="tableData"
        @changePage="changePage"
        @changePageSize="changePageSize">
      </VTable>
    </div>
  </div>  
</template>

<script>
import "@/styles/cyk-style.css"
import { accountStatusMap, sexMap, dautoynmStatusMap, registerSourceMap } from '@/libs/status-map'
import { 
  orderHistory, 
  rechargeHistory, 
  expenseHistory, 
  refundHistory, 
  coupons, 
  banHistory, 
  emergencyContact, 
  tripSharing, 
  pageData, 
  customerData 
} from './fields'
import {
  passengerDetail, 
  queryOrderList, 
  queryRechargeList, 
  queryConsumptionList, 
  queryRefundList, 
  queryCouponList, 
  queryDisableAccountList, 
  queryEmergencyContactList, 
  queryTripShareList
} from '@/api/passenger.js'

export default {
  data() {
    return {
      ...pageData,
      customerData,
      popPic: false,
      tabsIndex: '0',
      orderTips: {
        doingRouteNum: '0',
        canceledOrder: '0',
        completedOrder: '0',
        totalOrder: "0",
        unpaidOrder: "0"
      },
      rechargeTips: {
        giftBalance: '0',
        accountCash: '0',
        cashRemain: '0',
        totalRechargeAmount: '0',
        totalRechargeCount: '0'
      },
      consumptionTips: {
        totalConsumeAmount: '0',
        totalConsumeCount: '0',
      },
      disableAccountTips: {
        accountStatus: '暂无',
        disableCount: '0',
        pullBlack: '0'
      },
      emergencyContactTips: {
        emergencyPeopleCount: '0'
      },
      tripShareTips: {
        routeShareCount: '0'
      },
      couponsTips: {
        useCount: 0, // 可用
        count: 0 // 总数
      },
      passengerUuid: this.$router.currentRoute.params.id,
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.passengerUuid = to.params.id
    this.tabsIndex = '0'
    this.getList()
    this.tabsName('0')
    next()
  },
  created() {
    this.tabsIndex = '0'
    this.tabsName('0')
    this.getList()
  },
  methods: {
    getList() {        
      passengerDetail({ passengerUuid: this.passengerUuid }).then(res => {
        let data = res.data.data || {}
        for(let key in data) {
          this.customerData.forEach(item => {
            item.value.forEach(cell => {
              if(cell.key === key) {
                cell.value = data[key]
                if(key === 'deviceList') cell.value = cell.value.join()
                if(key === 'sex') cell.value = sexMap[cell.value]
                if(key === 'dautoynmStatus') cell.value = dautoynmStatusMap[cell.value]
                if(key === 'status') cell.value = accountStatusMap[cell.value]
                if(key === 'registerSource') cell.value = registerSourceMap[cell.value]
                if(key === 'registerChannel' && cell.value === 1) cell.value = 'app'
              }
            })
          })
        }
      })
    },
    changePageSize(val) {
      if(val){
        this.pageSize = val
        this.getTable(Number(this.tabsIndex))
      }      
    },
    changePage (val) {
      if(val){
        this.current = val
        this.getTable(Number(this.tabsIndex))
      }      
    },
    tabsName(index) { // tab切换
      this.current = 1
      this.pageSize = 10
      index = Number(index)
      switch(index) {
        case 0: // 订单记录
          this.tableColumns = [...orderHistory]
          this.tableColumns.push(this.order())
          this.getTable(index)
          break;
        case 1: // 充值记录
          this.getTable(index)
          this.tableColumns = [...rechargeHistory]
          break;
        case 2: // 消费记录
          this.getTable(index)
          this.tableColumns = [...expenseHistory]
          break;
        case 3: // 退款记录
          this.tableData = []
          this.tableColumns = [...refundHistory]
          break;
        case 4: // 优惠券
          this.getTable(index)
          this.tableColumns = [...coupons]
          this.tableColumns.push(this.coupons())
          break;
        case 5: // 账号管控记录
          this.getTable(index)
          this.tableColumns = [...banHistory]
          break;
        case 6: // 紧急联系人
          this.getTable(index)
          this.tableColumns = [...emergencyContact]
          break;
        case 7: // 行程分享记录
          this.getTable(index)
          this.tableColumns = [...tripSharing]
          break;
        default:
          console.log('default')
      }
    },
    getTable(index){
      let params = {
        passengerUuid: this.passengerUuid,
        currPage: this.current,
        pageSize: this.pageSize
      }
      this.$store.commit('changeLoadingFlag', true)
      switch(index){
        case 0:
          queryOrderList(params).then(res => {
            let data = res.data.data
            this.$store.commit('changeLoadingFlag', false)
            this.total = data && data.pageResult && data.pageResult.totalCount ? data && data.pageResult && data.pageResult.totalCount: 0;
            this.current = data.pageResult && data.pageResult.currPage ? data.pageResult && data.pageResult.currPage : 1;
            this.pageSize = data.pageResult && data.pageResult.pageSize ? data.pageResult && data.pageResult.pageSize : 10;
            this.tableData = data.pageResult && data.pageResult.list || []
            this.orderTips = {
              canceledOrder: data.canceledOrder ? data.canceledOrder : 0,
              completedOrder: data.completedOrder ? data.completedOrder : 0,
              totalOrder: data.totalOrder ? data.totalOrder : 0,
              unpaidOrder: data.unpaidOrder ? data.unpaidOrder : 0,
              doingRouteNum: data.doingRouteNum ? data.doingRouteNum: 0
            }
          })
          break
        case 1:
          queryRechargeList(params).then(res => {
            let data = res.data.data
            this.$store.commit('changeLoadingFlag', false)
            this.total = data.pageResult && data.pageResult.totalCount ? data.pageResult && data.pageResult.totalCount: 0;
            this.current = data.pageResult && data.pageResult.currPage ? data.pageResult && data.pageResult.currPage : 1;
            this.pageSize = data.pageResult && data.pageResult.pageSize ? data.pageResult && data.pageResult.pageSize : 10;
            this.tableData = data.pageResult && data.pageResult.list || []
            this.rechargeTips = {
              cashRemain: data.cashRemain ? data.cashRemain : '0',
              totalRechargeAmount: data.totalRechargeAmount ? data.totalRechargeAmount : '0',
              totalRechargeCount: data.totalRechargeCount ? data.totalRechargeCount : '0',
              accountCash: data.accountCash ? data.accountCash : '0',
              giftBalance: data.accountCash ? data.accountCash : '0'
            }
          })
          break
        case 2:
          queryConsumptionList(params).then(res => {
            let data = res.data.data
            this.$store.commit('changeLoadingFlag', false)
            this.total = data.pageResult && data.pageResult.totalCount ? data.pageResult && data.pageResult.totalCount: 0;
            this.current = data.pageResult && data.pageResult.currPage ? data.pageResult && data.pageResult.currPage : 1;
            this.pageSize = data.pageResult && data.pageResult.pageSize ? data.pageResult && data.pageResult.pageSize : 10;
            this.tableData = data.pageResult.list
            this.consumptionTips = {
              totalConsumeAmount: data.totalConsumeAmount ? data.totalConsumeAmount : '0',
              totalConsumeCount: data.totalConsumeCount ? data.totalConsumeCount : '0',
            }
          })
          break
        case 3:
          queryRefundList(params).then(res => {
            let data = res.data.data
            this.$store.commit('changeLoadingFlag', false)
            this.total = data.pageResult && data.pageResult.totalCount ? data.pageResult && data.pageResult.totalCount: 0;
            this.current = data.pageResult && data.pageResult.currPage ? data.pageResult && data.pageResult.currPage : 1;
            this.pageSize = data.pageResult && data.pageResult.pageSize ? data.pageResult && data.pageResult.pageSize : 10;
            this.tableData = data.pageResult && data.pageResult.list || []
          })
          break
        case 4:
          queryCouponList(params).then(res => {
            let data = res.data.data
            this.$store.commit('changeLoadingFlag', false)
            this.total = data.pageResult && data.pageResult.totalCount ? data.pageResult && data.pageResult.totalCount: 0;
            this.current = data.pageResult && data.pageResult.currPage ? data.pageResult && data.pageResult.currPage : 1;
            this.pageSize = data.pageResult && data.pageResult.pageSize ? data.pageResult && data.pageResult.pageSize : 10;
            this.tableData = data.pageResult && data.pageResult.list || []
            this.couponsTips = {
              useCount: data.useCount ? data.useCount : 0 ,
              count: data.count ? data.count : 0
            }
          })
          break
        case 5:
          queryDisableAccountList(params).then(res => {
            let data = res.data.data
            this.$store.commit('changeLoadingFlag', false)
            this.total = data.pageResult && data.pageResult.totalCount ? data.pageResult && data.pageResult.totalCount: 0;
            this.current = data.pageResult && data.pageResult.currPage ? data.pageResult && data.pageResult.currPage : 1;
            this.pageSize = data.pageResult && data.pageResult.pageSize ? data.pageResult && data.pageResult.pageSize : 10;
            this.tableData = data.pageResult && data.pageResult.list || []
            let status = accountStatusMap[data.accountStatus] || '暂无'
            this.disableAccountTips = {
              accountStatus: status,
              disableCount: data.disableCount ? data.disableCount : 0,
              pullBlack: data.pullBlack ? data.pullBlack : 0
            }
          })
          break
        case 6:
          queryEmergencyContactList(params).then(res => {
            let data = res.data.data
            this.$store.commit('changeLoadingFlag', false)
            this.total = data.pageResult && data.pageResult.totalCount ? data.pageResult && data.pageResult.totalCount: 0;
            this.current = data.pageResult && data.pageResult.currPage ? data.pageResult && data.pageResult.currPage : 1;
            this.pageSize = data.pageResult && data.pageResult.pageSize ? data.pageResult && data.pageResult.pageSize : 10;
            this.tableData = data.pageResult && data.pageResult.list || []
            this.emergencyContactTips = {
              emergencyPeopleCount: data.emergencyPeopleCount ? data.emergencyPeopleCount : 0
            }
          })
          break
        case 7:
          queryTripShareList(params).then(res => {
            let data = res.data.data
            this.$store.commit('changeLoadingFlag', false)
            this.total = data.pageResult && data.pageResult.totalCount ? data.pageResult && data.pageResult.totalCount: 0;
            this.current = data.pageResult && data.pageResult.currPage ? data.pageResult && data.pageResult.currPage : 1;
            this.pageSize = data.pageResult && data.pageResult.pageSize ? data.pageResult && data.pageResult.pageSize : 10;
            this.tableData = data.pageResult && data.pageResult.list || []
            this.tripShareTips = {
              routeShareCount: data.routeShareCount ? data.routeShareCount : 0
            }
          })
          break
        default:
          console.log('default')
      }
    },
    order() { // 订单记录自定义列渲染内容
      let orderAction = {
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
              attrs: {
                ghost: 'ghost'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.$router.push({name:'order-detail', params:{ id:params.row.orderUuid}})
                }
              }
            }, '详情')
          ]);
        }
      }
      
      return orderAction
    },
    coupons() { // 优惠券自定义列渲染内容
      let couponsAction = {
        title: '优惠券详情',
        key: 'action',
        fixed: 'right',
        minWidth: 120,
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
                  this.$router.push({name:'coupons-detail', params:{ id:params.row.uuid}})
                }
              }
            }, '详情')
          ]);
        }
      };
      return couponsAction
    }
  }
}
</script>

<style lang="less">
.passenger-detail-card .ivu-tabs-bar{
  margin-bottom: 0;
}
.passenger-detail-card .ivu-tabs-content .ivu-tabs-tabpane{
  border-left: 1px solid #dcdee2;
  border-right: 1px solid #dcdee2;
}
.customerMain {
  display: flex;
  background: #fff;
  .customerLeft {
    width: 45%;
    padding-right: 18px;
  }
  .customerRight {
    width: 55%;
    .orderRecord {
      display: flex;
      justify-content: space-around;
      font-size: 16px;
      padding: 15px 0;
      span {
        margin: 0 4px 0 5px;
        color: #2d8cf0;
      }
    }
  }
}
.detail-content{
  padding-right: 15px;
  line-height: 20px;
}
.border-content1{
  width: 75px;
  border: 1px solid #e8eaec;
  border-radius: 4px;
  margin-left: 70px;
  text-align: center;
  line-height: 20px;
}
.border-content2{
  width: 75px;
  border: 1px solid #e8eaec;
  border-radius: 4px;
  margin-left: 80px;
  text-align: center;
  line-height: 20px;
}
</style>