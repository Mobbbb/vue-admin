<template>
  <div>
    <div class="order">
      <Row>        
        <Form class="formQueryStyle" inline="inline" :model="searchData" :label-width="85">
          <Col>
            <FormItem label="下单人姓名">
              <Input clearable="clearable" v-model="searchData.passengerName" style="width:250px"></Input>
            </FormItem>
            <FormItem label="下单人手机号">
              <Input clearable="clearable" v-model="searchData.passengerMobile" style="width:250px"></Input>
            </FormItem>
            <FormItem label="订单编号">
              <Input clearable="clearable" v-model="searchData.orderNo" style="width:250px"></Input>
            </FormItem>
            <FormItem label="业务类型" v-show="isShowMore">
              <Select v-model="searchData.typeModule" style="width:250px" clearable>
                <Option value="1">出租车</Option>
                <Option value="2">专车</Option>
                <!-- <Option value="3">拼车</Option> -->
                <Option value="4">快车</Option>
                <!-- <Option value="5">货的</Option> -->
                <!-- <Option value="6">骑手</Option> -->
                <!-- <Option value="7">搬家</Option> -->
              </Select>
            </FormItem>
            <FormItem label="订单类型" v-show="isShowMore">
              <Select v-model="searchData.typeTimeNew" style="width:250px" clearable>
                <Option value="1">实时</Option>
                <Option value="2">预约</Option>
              </Select>
            </FormItem>
            <FormItem label="车牌号" v-show="isShowMore">
              <Input clearable="clearable" v-model="searchData.plateNum" style="width:250px"></Input>
            </FormItem>
            <FormItem label="司机姓名" v-show="isShowMore">
              <Input clearable="clearable" v-model="searchData.driverName" style="width:250px"></Input>
            </FormItem>
            <FormItem label="司机手机号" v-show="isShowMore">
              <Input clearable="clearable" v-model="searchData.driverMobile" style="width:250px"></Input>
            </FormItem>
            <FormItem label="订单状态" v-show="isShowMore">
              <Select v-model="searchData.mainStatus" style="width:250px" clearable>
                <Option value="0">约车中</Option>
                <Option value="1">预约中</Option>
                <Option value="2">接乘中</Option>
                <Option value="3">已抵达接乘地</Option>
                <Option value="4">载乘中</Option>
                <Option value="5">已抵达目的地</Option>
                <Option value="6">待支付</Option>
                <Option value="7">待评价</Option>
                <Option value="8">行程结束</Option>
                <Option value="9">行程取消</Option>
              </Select>
            </FormItem>
            <FormItem label="下单时间" v-show="isShowMore">
                <DatePicker
                  clearable="clearable"
                  placeholder="请输入"
                  type='datetimerange'
                  format="yyyy-MM-dd"
                  style="width:250px"
                  v-model='searchData.createdTime'
                  @on-change='createdTime'>
                </DatePicker>
            </FormItem>
            <FormItem :label-width='0'>
              <div class="query-btn">
                <a class="show-more" @click='isShowMore = !isShowMore'>
                  <Icon type="md-remove" v-show="isShowMore"/>
                  <Icon type="md-add"  v-show="!isShowMore"/>
                  <span v-show="!isShowMore">查看更多</span>
                  <span v-show="isShowMore">收起更多</span>
                </a>                
                <Button @click="reset">清空</Button>
                <Button type="primary" @click="search" style="margin-right:20px">查询</Button>
              </div>
            </FormItem>
          </Col>
        </Form>
      </Row>
    </div>
    <!--
    <CustomColumns
      :selectedOriginList='tableColumnsChecked'
      :customList='customList'
      @changeColumns='changeTableTitle'
      @checkedColumns='storeTableHandle'>
    </CustomColumns>
    -->
    <VTable
      :total="pageData.total"
      :current="pageData.current"
      :pageSize="pageData.pageSize"
      :isLoading="isLoading"
      :parColumns="tableColumns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize">
    </VTable>
    <Modal :mask-closable=false v-model="isShow">
      <p class="cancleText">确定要取消订单吗？</p>
      <div slot="footer">
        <Button type="primary" size="large" long @click="cancel">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { fields, pageData } from './fields'
import { orderList, orderCancel } from '@/api/passenger'
import { getTableTitle, setTableTitle } from '@/api/common.js'
// import CustomColumns from '_a/custom-columns/custom-columns.vue'

export default {
  components: {
    // CustomColumns
  },
  data() {
    return {
      ...pageData,
      isShow: false, // 是否显示取消框
      isShowMore: false, //是否显示更多搜索框
      orderId: String,
      resourceId: this.$router.currentRoute.name
    }
  },
  mounted() {
    this.getTableColumns()
    let isReload = this.$store.state.cache['order-info']
    if (isReload) {
      Object.keys(this.searchData).forEach(key => {
        this.searchData[key] = ''
        delete this.searchData[key]
      })
      this.getList()
      this.$store.commit('switchCacheState',['order-info',false])
    } else {
      this.$store.commit('changeLoadingFlag', false)
      this.tableData.length===0 && this.getList()
    }
  },
  methods: {
    search: function(){
      this.searchData.createdTime = this.searchData.createdTime || ['', '']
      for(let item in this.searchData){
        if(this.searchData[item] === '' || this.searchData[item] === null){
          delete this.searchData[item]
        }
      }
      if(this.searchData.createdTime[0] === '' || this.searchData.createdTime[1] === '') {
        delete this.searchData.createdTime
      }
      this.pageData.current = 1
      this.getList()
    },
    reset: function(){
      Object.keys(this.searchData).forEach(key=>{
        this.searchData[key] = ''
        delete this.searchData[key]
      })
      this.pageData.current = 1
      this.getList()
    },
    getList() {
      let that = this
      let params = {
        currPage: this.pageData.current,
        pageSize: this.pageData.pageSize,
      };
      if(this.searchData) {
        Object.assign(params, this.searchData)
      }
      this.$store.commit('changeLoadingFlag', true)
      orderList(params).then(res => {
        if (res.data.success) {
          this.pageData.total = res.data.data.totalCount;
          this.tableData.splice(0,this.tableData.length)
          res.data.data.list.forEach(item=>{
            this.tableData.push(item)
          })
          // this.tableData = res.data.data.list;
        }
        this.$store.commit('changeLoadingFlag', false)
      })
    },
    // changeTableTitle(data) {
    //   this.tableColumnsChecked = data;
    //   this.getTableColumns();
    // },
    getTableColumns () {
      let data = [];
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
              directives: [{
                name: 'hasAuth',
                value: 'order-info-detail'
              }],
              on: {
                click: () => {
                  this.$router.push({name:'order-detail', params:{ id:params.row.uuid }})
                }
              }
            }, '详情'),
            // h('Button', {
            //   props: {
            //     type: 'warning',
            //     size: 'small'
            //   },
            //   attrs: {
            //     ghost: 'ghost'
            //   },
            //   style: {
            //     marginRight: '5px',
            //     display: (params.row.mainStatus !== 4 && params.row.mainStatus !== 5) ? 'inline-block' : 'none'
            //   },
            //   on: {
            //     click: () => {
            //       this.isShow = true
            //       this.orderId = params.row.uuid
            //     }
            //   }
            // }, '取消')
          ]);
        }
      };
      this.tableColumnsChecked.forEach(col => data.push(fields[col]))
      data.push(action);
      this.tableColumns = data;
    },
    changePageSize(val) {
      this.pageData.pageSize = val;
      this.getList();
    },
    changePage (val) {
      this.pageData.current = val;
      this.getList();
    },
    createdTime(value) {
      if(value[0]) {
        this.searchData.startTime = value[0]
        this.searchData.endTime = value[1]
      }
    },
    cancel(){ // 取消订单
      orderCancel({ orderUuid: this.orderId }).then(res => {
        this.isShow = false
        this.$Message.success('操作成功')
        this.getList()
      })
    },
    /*storeTableHandle(data) {//将选择的表头发送到云端
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
    }*/
  }
}
</script>

<style lang="less">
.cancleText{
  text-align: center;
  padding: 60px 0;
  font-size: 16px;
}
</style>
