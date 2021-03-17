<template>
  <div class="detail-container">
    <Tabs v-show='isShowTopMenu' :value='activeIndex' @on-click='switechDetail'>
      <TabPane name='0' label="订单记录"></TabPane>
      <TabPane name='1' label="封号记录"></TabPane>
      <TabPane name='2' label="黑名单记录"></TabPane>
      <TabPane name='3' label="上下线记录"></TabPane>
      <TabPane name='4' label="违章记录"></TabPane>
      <TabPane name='5' label="请假记录"></TabPane>
      <TabPane name='6' label="上线拍照记录"></TabPane>
      <TabPane name='7' label="档案详情"></TabPane>
      <TabPane name='8' label="被评价记录"></TabPane>
      <TabPane name='9' label="通话记录"></TabPane>
      <TabPane name='10' label="被投诉记录"></TabPane>
    </Tabs>
  <div class="layout layout-container" v-show='isShowRecord'>
    <Layout>
      <Row>
        <Col :md='6' :lg='5'>
          <Sider hide-trigger :style="{maxWidth: '100%', width: '100%', height: '666px', borderRight:'solid 1px #d7dde4'}">
            <div class="header">
              <h2>司机详情</h2>
              <Avatar :src="face" />
              <p>{{name}}</p>
              <p>
                <Rate disabled  v-model="starCount"></Rate>
              </p>
            </div>
            <main class="content">
              <ul>
                <li v-for="(item, key) in singleDriverDetail" :key='key' >
                  <span>{{item.title+':'}}</span>
                  <span class="item-value">{{item.value}}</span>
                </li>
              </ul>
            </main>
          </Sider>
        </Col>
        <Col :md='18' :lg='19'>
          <VTable
            v-show='isHideAppraiseRecord'
            :total="total"
            :current="current"
            :pageSize="pageSize"
            :parColumns="tableColumns"
            :parTableData="tableData"
            @changePage="changePage"
            @changePageSize="changePageSize">
          </VTable>

          <Layout  v-show='!isHideAppraiseRecord && activeIndex === "8"'>
            <Sider  :style="{height: '666px'}" :width='300'>
              <Table border :columns="tagColumns" :data="tagDatas" height='666'></Table>
            </Sider>
            <Content>
              <Form :model='tagSearchValue' inline :label-width='80'>
                <FormItem label="评价标签">
                  <Select v-model="tagSearchValue.evaluateTag"  clearable filterable style="width: 180px;">
                    <Option v-for='(tag,i) in allTagData' :key="i" :value='tag'>{{tag}}</Option>
                  </Select>
                </FormItem>
                <FormItem label="订单编号">
                  <Input v-model="tagSearchValue.orderNo" style="width: 180px;"></Input>
                </FormItem>
                <FormItem>
                  <Button @click="searchTagValue" type="primary">搜索</Button>
                </FormItem>
              </Form>
              <Table 
                border 
                height="606"
                :columns="evaluateColumns" 
                :data="evaluateData"> 
              </Table>
              <div style="margin: 10px;padding: 10px;overflow: hidden">
                <div style="float: right;">
                  <Page
                    show-total
                    :total="evaluateTotal"
                    :current="evaluateCurrentPage"
                    :page-size="evaluatePageSize"
                    @on-change="evaluateChangePage">
                  </Page>
                </div>
              </div>
            </Content>
          </Layout>
        </Col>
      </Row>
    </Layout>
  </div>
  <!-- 档案详情 -->
  <Record v-show='activeIndex === "7"' :auditId='driverUuid' :isAudit='isAudit'></Record>
  <!-- 上线拍照记录 -->
  <div v-show='activeIndex === "6"' class="pickure-wrap">
    <Form inline :label-width='65'>
      <FormItem label='车牌号'>
        <Select v-model="carUuid" filter clearable style="width:200px">
            <Option v-for="(item, i) in carNoList" :value="item.carUuid" :key="i">{{ item.plateNum }}</Option>
        </Select>
      </FormItem>
      <FormItem label='上传时间'>
        <DatePicker type="daterange" format="yyyy-MM-dd" v-model='searchDate' @on-change='selectDate' clearable placeholder="选择日期" style="width: 200px"></DatePicker>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="queryOnlinePhoto">搜索</Button>
      </FormItem>
    </Form>
    <ul class="pickure-container">
      <Row v-if="pickureList.length">
        <Col v-for='(item, index) in pickureList' :key='index' :md='8' :lg='4'>
          <li>
            <Tooltip :content="item.address" max-width="200"  placement="top-start">
              <img :src="item.fileName" alt="">
            </Tooltip>
          </li>
        </Col>
      </Row>
      <Row v-else>
        <Col>
          <div style="text-align: center;height: 550px;line-height: 550px;border: solid 1px #d7dde4;">暂无照片</div>
        </Col>
      </Row>
    </ul>
    <div style="margin: 10px;padding: 10px;overflow: hidden">
      <div style="float: right;">
        <Page
            show-total
            :total="photoTotal"
            :current="photoCurrentPage"
            :page-size="photoPageSize"
            @on-change="photoChangePage">
        </Page>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import Record from './record';
import { direverDetail, 
         getOrderList, 
         blockingRecord, 
         violationRecord,
         allEvaluateTag,
         callRecord,
         leaveRecord,
         driverComplaintedList,
         queryOnlinePhotosRecord,
         driverPlateNums,
         evaluateRecord,
         statisticalTagCount,
         blacklistRecord, 
         signLog } from '@/api/driver.js';
import { orderList, 
         detailData, 
         blockList, 
         signLogList,
         callTableList, 
         violationRecordList, 
         evaluateColumns,
         leaveRecordList,
         complainedList } from './fields.js';

let commonRequest = getOrderList;
let tableList = orderList;
export default {
  name: 'Detail',
  props:['isAudit', 'auditId'],
  components:{
    Record
  },
  beforeRouteUpdate(to, from, next) {
    this.driverUuid = to.params.id;
    this.switechDetail(0);
    next();
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.switechDetail(0);
    })
  },
  data() {
    return {
      driverUuid: this.$route.params.id ? this.$route.params.id : this.auditId,
      ...detailData
    }
  },
  methods: {
    switechDetail(name) {
      let lock = true;// 行为锁 
      this.current = 1;
      this.pageSize = 10;
      this.activeIndex = name.toString();
      this.tableColumns = [];
      this.isShowRecord = true;
      this.isHideAppraiseRecord = true;
      this.$store.commit('changeLoadingFlag', true)
      switch(this.activeIndex) {
        case '0':
          commonRequest = getOrderList;// 订单记录
          tableList = orderList;
          break;
        case '1':
          commonRequest = blockingRecord;// 封号记录
          tableList = blockList;
          break;
        case '2':
          commonRequest = blacklistRecord;// 黑名单记录
          tableList = blockList;
          break;
        case '3':
          commonRequest = signLog;// 上下线记录
          tableList = signLogList;
          break;
        case '4':
          commonRequest = violationRecord;// 违章记录
          tableList = violationRecordList;
          break;
        case '5':
          commonRequest = leaveRecord;// 请假记录
          tableList = leaveRecordList;
          break;
        case '6':
          this.isShowRecord = false;
          lock = false;
          this.historyCarNoList();
          this.queryOnlinePhoto()// 查询拍照记录
          break;
        case '7':
          lock = false;
          this.isShowRecord = false;
          break;
        case '8':// 被评价记录
          this.isHideAppraiseRecord = false; // 不隐藏被评价记录
          this.getAllTag();
          this.evaluateList();
          this.getTagCount();
          break;
        case '9':// 通话记录
          commonRequest = callRecord;
          tableList = callTableList;
          break;
        case '10': // 被投诉记录
          commonRequest = driverComplaintedList;
          tableList = complainedList;
          break;
        default:
          console.log('default')
      }
      if (lock) {
        this.viewDriverInfo();
        this.driverController();
      }
    },
    driverController() {
      this.tableColumns = tableList;
      this.tableData = [];
      this.total = 0;
      let params = {
        currPage: this.current,
        pageSize: this.pageSize,
        driverUuid: this.driverUuid,
      };
      commonRequest(params).then(res => {
        this.$store.commit('changeLoadingFlag', false)
        this.total = res.data.data.totalCount;
        this.tableData = res.data.data.list;
      })
    },
    queryOnlinePhoto() {// 查询上线拍照记录
      this.pickureList = []
      let params = {
        driverUuid: this.driverUuid, 
        currPage: this.photoCurrentPage,
        pageSize: this.photoPageSize,
        startTime: this.startTime,
        endTime: this.endTime,
        carUuid: this.carUuid
      }
      queryOnlinePhotosRecord(params).then(res => {
        this.photoTotal = res.data.data.totalCount;
        this.pickureList = res.data.data.list;
      })
    },
    evaluateList(){ // 查询被评价记录
      this.evaluateData = []
      this.evaluateColumns = evaluateColumns;
      let params = {
        driverUuid: this.driverUuid, 
        currPage: this.evaluateCurrentPage,
        pageSize: this.evaluatePageSize
      }
      let obj = Object.assign(params, this.tagSearchValue);
      evaluateRecord(params).then(res=> {
        this.evaluateTotal = res.data.data.totalCount;
        this.evaluateData = res.data.data.list;
      })
    },
    getAllTag() {// 获取所有的标签
      this.allTagData = [];
      let params = {
        driverUuid: this.driverUuid
      }
      allEvaluateTag(params).then(res=>{
        if (res.data.success) {
          this.allTagData = res.data.data;
        }
      })
    },
    getTagCount() {// 获取标签的次数
      this.tagDatas = [];
      let params = {
        driverUuid: this.driverUuid, 
      }
      statisticalTagCount(params).then(res=> {
        let tags = res.data.data;
        for(let[key, value] of Object.entries(tags)){
          let obj = {};
          obj['tag'] = key;
          obj['count'] = value;
          this.tagDatas.push(obj);
        }
      })
    },
    historyCarNoList() {// 查询拍照记录
      let params = {
        driverUuid: this.driverUuid,
      }
      driverPlateNums(params).then(res => {
        this.carNoList = res.data.data;
      })
    },
    selectDate(data) {
      this.startTime = data[0]
      this.endTime = data[1]
    },
    changePageSize(val) {
      this.pageSize = val;
      this.driverController();
    },
    changePage (val) {
      this.current = val;
      this.driverController();
    },
    photoChangePage(val) {
      this.photoCurrentPage = val;
      this.queryOnlinePhoto();
    },
    evaluateChangePage(val) {
      this.evaluateCurrentPage = val;
      this.evaluateList();
    },
    viewDriverInfo() {
      let params = {
        driverUuid: this.driverUuid
      }
      direverDetail(params).then(res => {
        let data = res.data.data;
        this.name = data.name;
        this.starCount = parseInt(data.starCount);
        this.face = data.face;
        this.singleDriverDetail.forEach(item => {
          item.value = data[item.key]
        })
      })
    },
    searchTagValue() {
      this.evaluateList();
    },
  },
  watch: {
    isAudit(value) {
      if (value) {
        this.isShowRecord = false;
        this.isShowTopMenu = false;
        this.activeIndex = '7';
      } else {
        this.isShowRecord = true;
        this.isShowTopMenu = true;
        this.activeIndex = '0';
      }
    },
    auditId(value) {
      this.driverUuid = value;
    }
  }
}
</script>

<style lang="less">
@import './index.less';
</style>