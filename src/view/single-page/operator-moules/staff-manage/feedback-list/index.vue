<!-- 
  反馈列表
  backEnd: 华付-王栋 
-->
<template>
  <div>
    <Form  v-show='isShowMain' :model="searchData" inline :label-width='80'>
        <FormItem label='司机姓名'>
          <Input v-model='searchData.name' placeholder="请输入司机姓名" style="width: 200px;"></Input>
        </FormItem>
        <FormItem label='司机手机号'>
          <Input v-model='searchData.telephone' placeholder="请输入司机手机号" style="width: 200px;"></Input>         
        </FormItem>
        <!-- <FormItem label='司机ID'>
          <Input v-model='searchData.userUuid' placeholder="请输入司机ID" style="width: 150px;"></Input>         
        </FormItem> -->
        <FormItem label='运营商' v-show="isShowMore">
          <Cascader
              :data="operatorTree"
              v-model="operatorArr"
              trigger="hover"
              placeholder="请选择运营商"
              style="width:190px;">
          </Cascader>
        </FormItem>
         <FormItem label='提交时间'  v-show="isShowMore">
          <DatePicker  v-model="validTime" split-panels @on-change='selectDate' type="daterange" format="yyyy-MM-dd"></DatePicker>
        </FormItem>
        <FormItem label='城市' v-show="isShowMore">
          <Select v-model="searchData.cityOrigin"  filterable style="width:200px">
            <Option v-for="(item, index) in cityList" :value="item.cityUuid" :key="index">{{ item.city }}</Option>
          </Select>
        </FormItem>
        <FormItem label='问题标签' v-show="isShowMore">
          <Select v-model="searchData.title"  filterable style="width:200px">
            <Option  v-for="(item, index) in problemTags" :key="index" :value="item">{{item}}</Option>
          </Select>
        </FormItem>

        <FormItem :label-width='0'>
          <div class="query-btn">
            <a class="show-more" @click='isShowMore = !isShowMore'>
              <Icon type="md-remove" v-show="isShowMore"/>
              <Icon type="md-add"  v-show="!isShowMore"/>
              <span v-show="!isShowMore">查看更多</span>
              <span v-show="isShowMore">收起更多</span>
            </a>
            <Button @click='clearQueryData'>清空</Button>
            <Button  type="primary"  @click='queryData'>查询</Button>
          </div>
        </FormItem>
      </Form>
      <div style="margin: 0 0 10px 0; text-align: right;" v-show='isShowMain'>
        <Button type="primary" @click="isShowMain=false" v-hasAuth="'feedback-list-set'">问题标签设置</Button>
      </div>
      <div style="margin: 0 0 10px 0; text-align: left;" v-show='!isShowMain'>
        <Button  @click="goBack" :size='"large"'>返回</Button>
      </div>
      <VTable
        v-if='isShowMain'
        class="staff-table-container"
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
      <ProblemTag v-else></ProblemTag>
      <Modal
      title="评价详情"
      v-model='isShowModal'
      :mask-closable="false"
      width="800"
      :footer-hide='true'
      >
        <Form :model='detailData' inline :label-width='80'>
          <Row>
            <Col span="8">
              <FormItem label='司机姓名' >
                <Input v-model='detailData.name' readonly></Input>
              </FormItem>
            </Col>
            <!-- <Col span="8">
              <FormItem label='司机ID' >
                <Input v-model='detailData.userUuid' readonly></Input>
              </FormItem>
            </Col> -->
             <Col span="8">
              <FormItem label='司机电话' >
                <Input v-model='detailData.telephone' readonly></Input>
              </FormItem>
            </Col>
             <Col span="8">
              <FormItem label='发送时间' >
                <Input v-model='detailData.createTime' readonly></Input>
              </FormItem>
            </Col>
            <Col span="7">
              <FormItem label='城市' >
                <Input v-model='detailData.cityOrigin' readonly></Input>
              </FormItem>
            </Col>
            <Col span="9">
              <FormItem label='运营商' >
                <Input v-model='detailData.operator' readonly></Input>
              </FormItem>
            </Col>
            <Col span="8">
              <FormItem label='问题标签' >
                <Input v-model='detailData.title' readonly></Input>
              </FormItem>
            </Col>
             <Col span="8">
              <FormItem label='联系人' >
                <Input v-model='detailData.contactName' readonly></Input>
              </FormItem>
            </Col>
             <Col span="8">
              <FormItem label='联系人电话' >
                <Input v-model='detailData.contactPhone' readonly></Input>
              </FormItem>
            </Col>
          </Row>
          <Divider v-if="isHasImg">凭证图片</Divider>
          <!-- <Alert><h3 style="text-align: center;"></h3></Alert> -->
          <div>
             <img :src="item" v-for="(item, i) in detailData.fbPictureList" @click="viewBigImg(item)" :key="i" 
               style="max-width: 33%; padding: 0 10px; cursor: pointer; display:inline-block;">
          </div>
        </Form>
      </Modal>
      <Modal
      title="查看图片"
      width='600'
      :footer-hide='true'
      v-model='isShowViewImgModal'
      >
       <div class="view-img-box">
          <img :src="imgurl" >
       </div>
      </Modal>
  </div>
</template>
<script>
import VTable from '_a/v-table/v-table.vue';
import ProblemTag from  './problemTag';
import {mapState, mapActions} from 'vuex';
import {feedBackList, problemTagList} from '@/api/driver.js';
import {tableTitle, pageData} from './fields.js';
  export default {
    components: {
      VTable,
      ProblemTag
    },
    computed: {
      ...mapState({
        cityList: state => state.common.cityList
      })
    },
    created() {
      this.getTableColumns();
      this.getList();
      this.getCityList();
      this.operatorTree = JSON.parse(localStorage.getItem('pcOperatorList'))
      this.getProblemTag();
    },
    data() {
      return {
        ...pageData,
        operatorTree: [],
        problemTags: [],
        operatorArr: []
      }
    },
    methods: {
      ...mapActions([
        'getCityList'
      ]),
      queryData() {
          this.current = 1;
          this.queryAjaxPramas = {};
          this.searchData.operator = this.operatorArr[2]
          Object.keys(this.searchData).map(key=> {
            let item = this.searchData[key]
            if (item || item === 0) {
              this.queryAjaxPramas[key] = item;
            }
          })
          this.getList(); 
      },
      getProblemTag() {
        this.problemTags = [];
        problemTagList().then(res=>{
          if (res.data.success) {
          let items = res.data.data
            if (items.length>0) {
              items.map(item => { 
                let tags = []
                tags = item.tagLabel ? item.tagLabel.split(',') : [];
                this.problemTags = this.problemTags.concat(tags)
              })
            }
          }
        })
      },
      clearQueryData() {
        this.month = '';
        this.validTime = '';
        this.queryAjaxPramas = {};
        this.current = 1;
        this.pageSize = 10;
        this.searchData = {}
        this.operatorArr = []
        this.getList();
      },
      getList() {
        let params = {
          currPage: this.current,
          pageSize: this.pageSize
        };
        let obj = Object.assign(params, this.queryAjaxPramas);
        this.$store.commit('changeLoadingFlag', true)
        feedBackList(obj).then(res => {
            this.total = res.data.data.totalCount;
            this.tableData = res.data.data.list;
            this.$store.commit('changeLoadingFlag', false)
        })
      },
      getTableColumns () {
        let data = [];
        let actions = {
          key: 'action',
          title: '详情',
          width: 100,
          fixed: 'right',
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'success',
                size: 'small',
                ghost: true
              },
              directives: [{
                name: 'hasAuth',
                value: 'feedback-list-detail'
              }],
              on: {
                click: ()=> {
                  this.viewDetail(params.row)
                }
              }
            }, '详情')
          }
        }
        this.tableColumnsChecked.forEach(col => data.push(tableTitle[col]));
        data.push(actions);
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
      viewDetail(row) {
        this.detailData = {};
        this.isHasImg = Array.isArray(row.fbPictureList) && row.fbPictureList.length > 0;
        this.detailData = row;
        this.isShowModal = true;
      },
      viewBigImg(url) {
        this.isShowViewImgModal = true;
        this.imgurl = url;
      },
      exportFile() {

      },
      goBack() {
        this.isShowMain = true;
        this.getProblemTag();
      },
      selectDate(data) {
        if (data && data[0]) {
          this.searchData.beginTime = data[0];
          this.searchData.endTime = data[1];
        }
      }

    }
  }
</script>
<style lang="less">
.view-img-box {
  width: 550px;
  height: 500px;
  text-align: center;
  img {
    width: 100%;
    max-height: 100%;
  }
}
</style>