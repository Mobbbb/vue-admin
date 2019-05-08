<template>
  <div>
    <div class="searchBox">
      <Form inline :label-width='65'>
        <FormItem label='添加时间'>
          <DatePicker
            clearable="clearable"
            placeholder="请输入"
            type='daterange'
            style="width:200px"
            v-model='timeArea'
            @on-change='changeTime'>
          </DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="search" style="margin-right: 15px">搜索</Button>
          <Button @click="reset">清空</Button>
        </FormItem>
      </Form>
    </div>
    <VTable
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="tableColumns"
      :parTableData="tableData"
      @sort="sort"
      @selectObj="selectObj"
      @changePage="changePage"
      @changePageSize="changePageSize"></VTable>
    <Modal v-model="isShowModal" :mask-closable='false'>
      <p slot="header" style="color:#f60;text-align:center">{{modalTitle}}</p>
      <div class="coupon" v-for="(item, index) in detailList" :key="index">
        <div class="detailIndex">券{{index + 1}}:</div>
        <div class="detailContent">
          <div class="contentLeft">
            <p v-show="item.couponType===1">{{item.discount}}折</p>
            <p v-show="item.couponType===1">最高减免{{item.highestMoney}}元</p>
            <p v-show="item.couponType===2">{{item.couponMoney}}元</p>
            <p v-show="item.couponType===2">满{{item.astrict}}可用</p>
          </div>
          <div class="contentRight">
            <span class="type">{{couponTypeMap[item.couponType]}}</span>
            <p>{{item.couponName}}</p>
            <p>有效期：获取后{{item.expiryDay}}天内可用</p>
            <p>{{item.area}}</p>
          </div>
        </div>
      </div>
    </Modal>
    <Modal v-model="isShowPassenger" :mask-closable='false'>
      <p slot="header" style="color:#f60;text-align:center">发放用户：{{modalTitle}}个</p>
      <div v-show="!isShowExport">
        <table cellspacing="0" border="1" class="Table">
          <thead>
            <td width='100'>序号</td>
            <td width='200'>手机号</td>
          </thead>
          <tbody>
            <tr v-for="(item, index) in passengerList" :key="index">
              <td>{{index+1}}</td>
              <td>{{item}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-show="isShowExport" style="text-align:center;padding:20px;">
        <ExportFile :exportUrl='exportUrl' :queryData='queryData'></ExportFile>
      </div>
    </Modal>
  </div>  
</template>
<script>
import VTable from '_a/v-table/v-table.vue';
import ExportFile from '_a/export-file/exportFile'
import { pageData, oneOffCoupon } from './fields'
import { oneOffCouponList, oneOffCouponDetail, passengerNumber, passengerMobile } from '@/api/passenger'
export default {
  components:{
    VTable,
    ExportFile
  },
  data(){
    return {
      ...pageData,
      searchData:{},
      timeArea: [], // 起始时间范围
      isShowModal: false, // 是否显示优惠券详情
      isShowPassenger: false, // 是否显示乘客信息
      isShowExport: false, // 是否显示十个以上乘客的导出框
      modalTitle: '',
      detailList: [], // 详情接口数据
      passengerList: [], // 乘客详情接口数据
      queryData: {}, // 导出时的携带参数
      exportUrl: '/admin/coupon/exportMobile', // 导出文件的url
      couponTypeMap: {
        1: '折扣',
        2: '抵扣'
      },
      useTypeMap: {
        1: '出租车',
        2: '专车',
        4: '快车'
      },
      useLimitMap: {
        1: '实时',
        2: '预约'
      }
    }
  },
  created(){
    this.tableColumnsChecked = ['couponMoney', 'createTime', 'createName']
    this.getList()
  },
  mounted() {
    this.getTableColumns();
  },
  methods:{
    changeTime(time){
      this.searchData.beginTime = time[0]
      this.searchData.endTime = time[1]
    },
    search(){
      this.current = 1
      this.getList()
    },
    reset(){
      this.current = 1
      this.searchData = {}
      this.timeArea = []
      this.getList()
    },
    getList(){
      let params = {}
      if(this.searchData){
        params = this.searchData
      }
      params.currPage = this.current
      params.pageSize = this.pageSize
      this.$store.commit('changeLoadingFlag', true)
      oneOffCouponList(params).then(res => {
        let data = res.data.data
        this.isLoading = true;
        this.total = data.totalCount
        data.list.forEach((v, k) => {
          let couponMoney = v.couponMoney ? v.couponMoney : '0' // 优惠券金额
          let discountNum = v.discountNum ? v.discountNum : '0' // 折扣券数量
          let deductionNum = v.deductionNum ? v.deductionNum : '0' // 抵扣券数量
          v.result = couponMoney + '元('+ discountNum +'张折扣券，'+ deductionNum +'张抵扣券)'
        })
        this.tableData = data.list;
        this.$store.commit('changeLoadingFlag', false)
      })
    },
    changePageSize(val) {
      this.pageSize = val;
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
      this.current = val;
      this.getList();
    },
    changeTableTitle(data) {
      this.tableColumnsChecked = data;
      this.getTableColumns();
    },
    getTableColumns () {
      let data = [];
      let passenger = {
        title: '发放人群',
        key: 'objectName',
        ellipsis: true,
        width: 180,
        render:(h, params) => {
          return h('div', [
            h('span', {
              style: {
                borderBottom: (params.row.objectType==='user') ? '1px solid #2D8cF0' : '',
                color: (params.row.objectType==='user') ? '#2D8cF0' : '#000000',
                cursor: (params.row.objectType==='user') ? 'pointer' : ''
              },
              on: {
                click: () => {
                  if(params.row.objectType === 'user'){
                    this.isShowPassenger = true
                    let obj = {
                      grantTime: params.row.createTime,
                      userId: params.row.createdBy
                    }
                    passengerNumber(obj).then(res => {
                      if(res.data.success){
                        this.modalTitle = res.data.data.userNumber
                        if(res.data.data.userNumber<10){
                          this.isShowExport = false
                          this.getPassenger(obj)
                        } else {
                          this.isShowExport = true
                          this.queryData = {
                            grantTime: params.row.createTime,
                            userId: params.row.createdBy
                          }
                        }
                      }
                    })
                  }
                } 
              }
            }, params.row.objectName)
          ])
        }
      }
      let action = {
        title: '操作',
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
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.modalTitle = params.row.couponMsg
                  this.isShowModal = true
                  this.getDetail(params.row)
                }
              }
            }, '详情')
          ]);
        }
      };
      data.push(passenger)
      this.tableColumnsChecked.forEach(col => data.push(oneOffCoupon[col]));
      data.push(action);
      this.tableColumns = data;
    },
    getDetail(data){ // 获取优惠券详情
      // let params = {
      //   grantTime: data.createTime,
      //   userId: data.createdBy,
      //   queryValue: data.objectType
      // }
      // if(data.objectType === 'user'){ // 1：特定用户，2：APP全部用户和南京全部用户
      //   params.queryType = 1
      //   delete params['queryValue']
      // } else {
      //   params.queryType = 2
      // }
      let params = {
        cityUuid: data.cityUuid,
        grantUuid: data.grantUuid
      }
      this.detailList = []
      oneOffCouponDetail(params).then(res => {
        if(res.data.success){
          this.detailList= res.data.data
          this.detailList.forEach((v, k) => {
            let city = []
            v.useType = this.useTypeMap[v.useType]
            v.useLimit = this.useLimitMap[v.useLimit] + '订单'
            v.listCity.forEach(item => { city.push(item.cityName) })
            if(v.beginTime === 0 && v.endTime === 24){
              v.limit = '全天可用'
            } else {
              v.limit = '限时时段(' + v.periodBegin + '-' + v.periodEnd + ')'
            }
            v.area = v.useType + '-' + v.useLimit + '-' + city.join() + '-' + v.limit
          })
        }
      })
    },
    getPassenger(data){ // 获取乘客详情
      passengerMobile(data).then(res => {
        if(res.data.success){
          this.modalTitle = res.data.data.size
          this.passengerList = res.data.data.mobiles
        }
      })
    }
  }
}
</script>
<style lang="less">
.coupon{
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
.Table{
  text-align: center;
  margin: 0 auto;
}
</style>
