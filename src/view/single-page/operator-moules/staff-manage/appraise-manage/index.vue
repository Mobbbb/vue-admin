<!-- 
  评价管理
  backEnd: 车厘子-肖云惠 
-->
<template>
  <div>
    <Form  v-show='isShowMain' :model="searchData" inline :label-width='100'>
        <FormItem label='司机姓名'>
          <Input v-model='searchData.name' placeholder="请输入..." style="width: 200px;"></Input>
        </FormItem>
        <FormItem label='司机手机号'>
          <Input v-model='searchData.mobile' placeholder="请输入..." style="width: 200px;"></Input>         
        </FormItem>
        <!--<FormItem label='评价时间'>
         <DatePicker type="daterange" v-model="createdOn" @on-change='selectDate' split-panels placeholder="请选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label='运营商' v-show="isShowMore">
          <Cascader
            :data="operatorTree"
            v-model="operatorArr"
            trigger="hover"
            placeholder="请选择运营商"
            style="width:190px;">
          </Cascader>
        </FormItem>
        
        <FormItem label='城市' v-show="isShowMore">
          <Select v-model="searchData.cityUuid"  filterable style="width:200px">
            <Option v-for="(item, index) in cityList" :value="item.uuid" :key="index">{{ item.city }}</Option>
          </Select>
        </FormItem>-->
       
       <FormItem label='下单人姓名' v-show="isShowMore">
          <Input v-model='searchData.passengerName' placeholder="请输入..." style="width: 200px;"></Input>
        </FormItem>
        <FormItem label='下单人手机号' v-show="isShowMore">
          <Input v-model='searchData.passengerMobile' placeholder="请输入..." style="width: 200px;"></Input>         
        </FormItem>

        <FormItem label='评价属性' v-show="isShowMore">
          <Select v-model="searchData.evaluateType" clearable filterable style="width:200px">
            <Option :value="1" >正面</Option>
            <Option :value="2" >中性</Option>
            <Option :value="3" >负面</Option>
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
        <Button type="primary" @click="setTag" v-hasAuth="'appraise-manage-set'">评价标签设置</Button>
      </div>
      <div style="margin: 0 0 10px 0; text-align: left;" v-show='!isShowMain'>
        <Button  @click="back" :size='"large"'>返回</Button>
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
      <TagTable v-else :tagList='allTagList' @on-update='updateHadle'>
      </TagTable>
  </div>
</template>
<script>
import VTable from '_a/v-table/v-table.vue';
import TagTable from  './tagTable';
import {mapState, mapActions} from 'vuex';
import {appraiseManageList, tagList} from '@/api/driver.js';
import {tableTitle, pageData} from './fields.js';
  export default {
    components: {
      VTable,
      TagTable
    },
    computed: mapState({
      cityList: state=> state.cityList
    }),
    created() {
      this.operatorTree = JSON.parse(localStorage.getItem('pcOperatorList'))
      this.getTableColumns();
      this.getList();
      this.isLoading = true;
      this.getCityList();
    },
    data() {
      return {
        operatorTree: [],
        operatorArr: [],
        ...pageData
      }
    },
    methods: {
      ...mapActions([
        'getCityList'
      ]),
      queryData() {
        this.current = 1;
        this.isLoading = false;
        this.queryAjaxPramas = {};
        this.searchData.agentUuid = this.operatorArr[2]
        Object.keys(this.searchData).map(key=> {
          let item = this.searchData[key]
          if (item || item === 0) {
            this.queryAjaxPramas[key] = item;
          }
        })
        this.getList();
      },
      clearQueryData() {
        this.createdOn = '';
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
        appraiseManageList(obj).then(res => {
            this.total = res.data.data.totalCount;
            this.tableData = res.data.data.list;
            this.$store.commit('changeLoadingFlag', false)
        })
      },
      getTableColumns () {
        let data = [];
        data = [...tableTitle]
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
      // selectDate(data) {
      //   if (data) {
      //     this.searchData.startTime = data[0];
      //     this.searchData.endTime = data[1];
      //   }
      // },
      back() {
        this.isShowMain=true
      },
      setTag() {
        this.isShowMain = false
        tagList().then(res=> {
          this.allTagList = res.data.data
        })
      },
      updateHadle() {
        this.setTag();
      }
    }
  }
</script>