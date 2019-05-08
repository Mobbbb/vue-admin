<template>
  <div class="customerMain">
    <div class="customerLeft">
      <Form ref="formInline" :model="formInline" label-position='left'>
        <div class="lineOne">
          <img :src="formInline.face" alt="" class="customerImg">
          <p class="state">账号状态 : <span>{{formInline.status}}</span></p>
        </div>
        <div class="lineTwo">
          <Card class="order-detail-card">
            <Col span="12">
              <Form class="display-div">
                <FormItem label="乘客姓名 :">
                  <p class="detail-content">{{formInline.name}}</p>
                </FormItem>
              </Form>            
            </Col>
            <Col span="12">
              <Form class="display-div">
                <FormItem label="乘客手机号 :">
                  <div style="display: flex;align-items: center;">
                    <p class="detail-content">{{formInline.mobile}}</p>
                    <p class="isVerified">{{formInline.realnameOrNot}}</p>
                  </div>
                </FormItem>
              </Form>
            </Col>
            <Col span="12">
              <Form class="display-div">
                <FormItem label="证件类型 :">
                  <p class='detail-content'>身份证</p>
                </FormItem>
              </Form>
            </Col>
            <Col span="12">
              <Form class="display-div">
                <FormItem label="户籍 :">
                  <p class='detail-content'>{{formInline.domicilePlace}}</p>
                </FormItem>
              </Form>
            </Col>
            <Col span="12">
              <Form class="display-div">
                <FormItem label="身份证号 :">
                  <p class='detail-content'>{{formInline.iDNO}}</p>
                </FormItem>
              </Form>
            </Col>
            <Col span="12">
              <Form class="display-div">
                <FormItem label="性别 :">
                  <p class='detail-content'>{{formInline.sex}}</p>
                </FormItem>
              </Form>
            </Col>
            <Col span="12">
              <Form class="display-div">
                <FormItem label="年龄 :">
                  <p class='detail-content'>{{formInline.age}}</p>
                </FormItem>
              </Form>
            </Col>
          </Card>
          <Card class="order-detail-card">
            <Col span="12">
              <Form class="display-div">
                <FormItem label="注册时间 :">
                  <p class='detail-content'>{{formInline.registerTime}}</p>
                </FormItem>
              </Form>
            </Col>
            <Col span="12">
              <Form class="display-div">
                <FormItem label="注册区域 :">
                  <p class='detail-content'>{{formInline.registerArea}}</p>
                </FormItem>
              </Form>
            </Col>
            <Col span="12">
              <Form class="display-div">
                <FormItem label="注册渠道 :">
                  <p class='detail-content'>{{formInline.registerChannel}}</p>
                </FormItem>
              </Form>
            </Col>
            <Col span="12">
              <Form class="display-div">
                <FormItem label="注册来源 :">
                  <p class='detail-content'>{{formInline.registerSource}}</p>
                </FormItem>
              </Form>
            </Col>
          </Card>
          <!-- <Row>
            <Col span="6">
              <FormItem label="第三方登录">
                <span class="thridLogin">{{thridLogin}}</span>
              </FormItem>              
            </Col>
            <Col span="8">
              <FormItem label="免密授权">
                <span class="thridLogin">{{thridLogin}}</span>
                <span class="thridLogin">{{thridLogin}}</span>
              </FormItem>
            </Col>
          </Row> -->
          <Card class="order-detail-card">
            <Col span="12">
              <Form class="display-div">
                <FormItem label="昵称 :">
                  <p class='detail-content'>{{formInline.nickName}}</p>
                </FormItem>
              </Form>
            </Col>
            <Col span="12">
              <Form class="display-div">
                <FormItem label="行业 :">
                  <p class='detail-content'>{{formInline.industry}}</p>
                </FormItem>
              </Form>
            </Col>
            <Col span="12">
              <Form class="display-div">
                <FormItem label="公司 :">
                  <p class='detail-content'>{{formInline.company}}</p>
                </FormItem>
              </Form>
            </Col>
            <Col span="12">
              <Form class="display-div">
                <FormItem label="职业 :">
                  <p class='detail-content'>{{formInline.profession}}</p>
                </FormItem>
              </Form>
            </Col>
            <Col span="24">
              <Form class="display-div">
                <FormItem label="个性签名 :">
                  <p class='detail-content'>{{formInline.characterSignature}}</p>
                </FormItem>
              </Form>
            </Col>
          </Card>
          <Card class="order-detail-card">
            <Col span="12">
              <Form class="display-div">
                <FormItem label="是否黑名单 :">
                  <p class='detail-content'>{{formInline.blacklistOrNot}}</p>
                </FormItem>
              </Form>
            </Col>
            <!-- <Col span="12">
              <Form class="display-div">
                <FormItem label="最近所在地 :">
                  <p class='detail-content'>{{formInline.lastLoginCity}}</p>
                </FormItem>
              </Form>
            </Col> -->
            <Col span="12">
              <Form class="display-div">
                <FormItem label="现金 :">
                  <p class='detail-content'>{{formInline.cash}}</p>
                </FormItem>
              </Form>
            </Col>
            <Col span="12">
              <Form class="display-div">
                <FormItem label="信用额度 :">
                  <p class='detail-content'>{{formInline.creditLine}}</p>
                </FormItem>
              </Form>
            </Col>
            <Col span="12">
              <Form class="display-div">
                <FormItem label="app版本 :">
                  <p class='detail-content'>{{formInline.appVersion}}</p>
                </FormItem>
              </Form>
            </Col>
            <Col span="12">
              <Form class="display-div">
                <FormItem label="设备信息 :">
                  <p class='detail-content'>{{formInline.deviceInfo}}</p>
                </FormItem>
              </Form>
            </Col>
          </Card>
        </div>
      </Form>
    </div>
    <div class="customerRight">
      <Tabs type="card" @on-click="tabsName" v-model="tabsIndex" class="passenger-detail-card">
        <TabPane label="订单记录" name="0">
          <div class="orderRecord">
            <p>总订单<span>{{orderTips.totalOrder}}笔</span></p>
            <p>已完成<span>{{orderTips.completedOrder}}笔</span></p>
            <p>已取消<span>{{orderTips.canceledOrder}}笔</span></p>
            <p>待支付<span>{{orderTips.unpaidOrder}}笔</span></p>
          </div>
        </TabPane>
        <TabPane label="充值记录" name="1">
          <div class="orderRecord">
            <p>充值<span>{{rechargeTips.totalRechargeCount}}笔</span></p>
            <p>累计<span>{{rechargeTips.totalRechargeAmount}}元</span></p>
            <p>账户留存现金<span>{{rechargeTips.cashRemain}}元</span></p>
          </div>
        </TabPane>
        <TabPane label="消费记录" name="2">
          <div class="orderRecord">
            <p>消费<span>{{consumptionTips.totalConsumeCount}}笔</span></p>
            <p>累计<span>{{consumptionTips.totalConsumeAmount}}元</span></p>
          </div>
        </TabPane>
        <TabPane label="退款记录" name="3"></TabPane>
        <TabPane label="优惠券" name="4">
          <div class="orderRecord">
            <p>共<span>{{couponsTips.totalNum}}</span>张券</p>
            <p><span>{{couponsTips.validNum}}</span>张可用</p>
          </div>
        </TabPane>
        <TabPane label="封号记录" name="5">
          <div class="orderRecord">
            <p>账号状态：<span>{{disableAccountTips.accountStatus}}</span></p>
            <p>被封号<span>{{disableAccountTips.disableCount}}</span>次</p>
          </div>
        </TabPane>
        <TabPane label="紧急联系人" name="6">
          <div class="orderRecord">
            <p>紧急联系人<span>{{emergencyContactTips.emergencyPeopleCount}}</span>位</p>
          </div>
        </TabPane>
        <TabPane label="行程分享记录" name="7">
          <div class="orderRecord">
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
import { sexMap } from '@/libs/status-map'
import { orderHistory, rechargeHistory, expenseHistory, refundHistory, coupons, banHistory, emergencyContact, tripSharing, pageData } from './fields';
import {passengerDetail, queryOrderList, queryRechargeList, queryConsumptionList, queryRefundList, queryCouponList, queryDisableAccountList, queryEmergencyContactList, queryTripShareList} from '@/api/passenger.js';
import "@/styles/cyk-style.css";

export default {
  data() {
    return {
      ...pageData,
      formInline: {},
      count: 1,
      customList: {...orderHistory},
      tabsIndex: 0,
      orderTips: {
        canceledOrder: '0',
        completedOrder: '0',
        totalOrder: "0",
        unpaidOrder: "0"
      },
      rechargeTips: {
        cashRemain: '0',
        totalRechargeAmount: '0',
        totalRechargeCount: '0'
      },
      consumptionTips: {
        totalConsumeAmount: '0',
        totalConsumeCount: '0',
      },
      disableAccountTips: {
        accountStatus: '正常',
        disableCount: '0'
      },
      couponsTips: {
        validNum: 0, // 可用
        totalNum: 0 // 总数
      },
      passengerUuid: this.$router.currentRoute.params.id,
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.passengerUuid = to.params.id
    this.getList()
    this.tabsIndex = 0
    this.tabsName(0)
    next();
  },
  created() {
    this.tabsName(0);
    this.getList();    
  },
  methods: {
    getList() {        
      passengerDetail({passengerUuid:this.passengerUuid}).then(res => {
        this.formInline = res.data.data
        this.formInline.sex = sexMap[this.formInline.sex]
        this.formInline.realnameOrNot = this.formInline.realnameOrNot ? '已实名' : '未实名'
        this.formInline.blacklistOrNot = this.formInline.blacklistOrNot ? '是' : '否'
        this.formInline.idcardType = this.formInline.idcardType === 1 ? '身份证' : ''
        this.formInline.cash = this.formInline.cash !== '' ?  this.formInline.cash + '元' : ''
        this.formInline.creditLine = this.formInline.creditLine !== '' ? this.formInline.creditLine + '元' : ''
        this.formInline.status = statusMap[this.formInline.status]
      })
    },
    getTableColumns (tableName, index) { // 右侧表格自定义渲染列
      switch (index) {
        case 0: // 订单记录自定义列
          this.order(tableName);
          break;        
        case 2: // 消费记录自定义列
          this.expense(tableName);
          break;
        case 3: // 退款记录自定义列
          this.refund(tableName);
          break;
        case 4: // 优惠券自定义列
          this.coupons(tableName);
          break;
        default:
          let data = []
          this.tableColumnsChecked.forEach(col => {
            if (tableName[col]){
              data.push(tableName[col])
            }
          });
          this.tableColumns = data;
      }
    },
    order(tableName) { // 订单记录自定义列渲染内容
      let data = [];
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
      };
      this.tableColumnsChecked.forEach(col => {
        if (tableName[col]){
          data.push(tableName[col])
        }
      });
      data.push(orderAction);
      this.tableColumns = data;
    },
    expense(tableName) { // 消费记录自定义列渲染内容
      let data = [];
      let expenseAction = {
        title: '关联订单',
        key: 'action',
        fixed: 'right',
        maxWidth: 200,
        minWidth: 150,
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
                display: (params.row.orderUuid) ? 'block' : 'none'
              },
              on: {
                click: () => {
                  this.$router.push({
                    name:'order-detail', 
                    params: { id: params.row.orderUuid}
                  })
                }
              }
            }, params.row.relatedOrder)
          ]);
        }
      };
      this.tableColumnsChecked.forEach(col => {
        if (tableName[col]){
          data.push(tableName[col])
        }
      });
      data.push(expenseAction);
      this.tableColumns = data;
    },
    refund(tableName) { // 退款记录自定义列渲染内容
      let data = [];
      let refundAction = {
        title: '关联退款单',
        key: 'action',
        fixed: 'right',
        width: 100,
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
                display: (params.row.csmId) ? 'block' : 'none'
              },
              on: {
                click: () => {
                  // this.detailsRequest(params.row.csmId);
                }
              }
            }, params.row.csmId)
          ]);
        }
      };
      this.tableColumnsChecked.forEach(col => {
        if (tableName[col]){
          data.push(tableName[col])
        }
      });
      data.push(refundAction);
      this.tableColumns = data;
    },
    coupons(tableName) { // 优惠券自定义列渲染内容
      let data = [];
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
      this.tableColumnsChecked.forEach(col => {
        if (tableName[col]){
          data.push(tableName[col])
        }
      });
      data.push(couponsAction);
      this.tableColumns = data;
    },
    changePageSize(val) {
      if(val){
        this.pageSize = val;
        this.getTable(Number(this.tabsIndex))
      }      
    },
    changePage (val) {
      if(val){
        this.current = val;
        this.getTable(Number(this.tabsIndex))
      }      
    },
    tabsName(index) { // tab切换
      this.current = 1
      this.pageSize = 10
      index = Number(index)
      switch(index) {
        case 0: // 订单记录
          this.customList = {...orderHistory}
          this.tableColumnsChecked = ['orderType', 'orderNO', 'createTime', 'passengerName', 'passengerMobile', 'licensePlateNumber', 'vehicleType', 'driverName', 'driverMobile', 'orderFare', 'orderStatus']
          this.getTable(index)
          this.getTableColumns(orderHistory, index)
          break;
        case 1: // 充值记录
          this.customList = {...rechargeHistory}
          this.tableColumnsChecked = ['passengerName', 'rechargeType', 'payPattern', 'rechargeAmount', 'rechargeTime']
          this.getTable(index)
          this.getTableColumns(rechargeHistory, index)
          break;
        case 2: // 消费记录
          this.customList = {...expenseHistory}
          this.tableColumnsChecked = ['consumeType', 'payPattern', 'consumeAmount', 'consumeTime']
          this.getTable(index)
          this.getTableColumns(expenseHistory, index)
          break;
        case 3: // 退款记录
          this.customList = {...refundHistory}
          this.tableColumnsChecked = ['refundAmount', 'refundPattern', 'crediCardNum', 'AlipayNum', 'applyTime', 'refundStatus']
          //this.getTable(index)
          this.getTableColumns(refundHistory, index)
          break;
        case 4: // 优惠券
          this.customList = {...coupons}
          this.tableColumnsChecked = ['couponName', 'couponType', 'couponAmount', 'expiryDate', 'grantState', 'relatedOrder']
          this.getTable(index)
          this.getTableColumns(coupons, index)
          break;
        case 5: // 封号记录
          this.customList = {...banHistory}
          this.tableColumnsChecked = ['disableTime', 'disableDuration', 'operator', 'comment']
          this.getTable(index)
          this.getTableColumns(banHistory, index)
          break;
        case 6: // 紧急联系人
          this.customList = {...emergencyContact}
          this.tableColumnsChecked = ['name', 'mobile', 'autoShareOrNot', 'addTime', 'comment']
          this.getTable(index)
          this.getTableColumns(emergencyContact, index)
          break;
        case 7: // 行程分享记录
          this.customList = {...tripSharing}
          this.tableColumnsChecked = ['shareTime', 'shareType', 'emergencyContactPerson', 'content']
          this.getTable(index)
          this.getTableColumns(tripSharing, index)
          break;
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
              unpaidOrder: data.unpaidOrder ? data.unpaidOrder : 0
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
              totalRechargeCount: data.totalRechargeCount ? data.totalRechargeCount : '0'
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
          queryCouponList(params).then(res =>{
            let data = res.data.data
            this.$store.commit('changeLoadingFlag', false)
            this.total = data.pageResult && data.pageResult.totalCount ? data.pageResult && data.pageResult.totalCount: 0;
            this.current = data.pageResult && data.pageResult.currPage ? data.pageResult && data.pageResult.currPage : 1;
            this.pageSize = data.pageResult && data.pageResult.pageSize ? data.pageResult && data.pageResult.pageSize : 10;
            this.tableData = data.pageResult && data.pageResult.list || []
            this.couponsTips = {
              validNum: data.validNum,
              totalNum: data.totalNum
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
            let status = ''
            status = statusMap[data.accountStatus]
            this.disableAccountTips = {
              accountStatus: status,
              disableCount: data.disableCount
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
              emergencyPeopleCount: data.emergencyPeopleCount
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
              routeShareCount: data.routeShareCount
            }
          })
          break
        default:
          console.log('default')
      }
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
    .lineOne {
      display: flex;
      justify-content: center;
      position: relative;
      height: 150px;
      .customerImg {
        width: 100%;
        border: 1px solid #e8eaec;
        max-height: 150px;
        max-width: 150px;
        margin-bottom: 15px;
      }
      .state {
        position: absolute;
        right: 5%;
        display: flex;
        align-items: center;
        span {
          /*display: block;
          width: 11px;
          height: 11px;
          background: #12d070b8;
          color: #fff;
          border-radius: 6px;
          margin-left: 10px;*/
        }
      }
    }
    .lineTwo {
      .isVerified {
        display: inline-block;
        border: 1px solid #2d8cf0;
        border-radius: 5px;
        text-align: center;
        color: #2d8cf0;
        padding: 0 15px;
        height: 22px;
        line-height: 22px;
        margin-left: 10px;
      }
      .thridLogin {
        color: #fff;
        background: green;
        padding: 5px 10px;
        margin-right: 10px;
      }
    }
  }
  .customerRight {
    width: 55%;
    .orderRecord {
      display: flex;
      justify-content: space-around;
      font-size: 16px;
      padding: 15px 0;
      span {
        margin-left: 10px;
        color: #2d8cf0;
      }
    }
  }
  .detail-content{
    padding-right: 15px;
    line-height: 20px;
  }
}
</style>