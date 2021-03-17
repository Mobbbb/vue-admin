<!--充电站管理-wx-->
<template>
  <div style="position:relative;">
    <Spin size="large" fix v-if="isLoading"></Spin>
    <div v-if="noData" class="fontsize20 text-center top40">暂无数据</div>
    <div v-else class="charge-station-manage">
      <Tabs v-model="tabObj.tabVal">
        <TabPane
          v-for="tab in supplierList"
          :key="tab.supplierId"
          :label="tab.supplierName"
          :name="tab.supplierId"
        >
          <ul class="flex-ul">
            <li>
              <span class="name-info name-info-large">供应商名称</span>：
              <span class="val-info">{{tab.supplierName}}</span>
            </li>
            <li>
              <span class="name-info name-info-shot">联系人</span>：
              <span class="val-info">{{tab.contact}}</span>
            </li>
            <li>
              <span class="name-info">联系电话</span>：
              <span class="val-info">{{tab.phone}}</span>
            </li>
            <li>
              <Button type="primary" @click="synStationData" v-hasAuth="'charge-station-synchro'">同步数据</Button>
            </li>
          </ul>
        </TabPane>
      </Tabs>
      <ul class="my-tabs">
        <li class="inline-box" :class="{'active':isList}" @click="isList=true">充电站列表</li>
        <li class="inline-box" :class="{'active':!isList}" @click="isList=false">充电站地图</li>
      </ul>
      <div v-if="tabObj.tabVal">
        <charge-station-list v-show="isList" :id="tabObj.tabVal"></charge-station-list>
        <charge-station-map v-if="!isList" :id="tabObj.tabVal" :index="tabObj.tabVal"></charge-station-map>
      </div>
    </div>
  </div>
</template>
<script>
import chargeStationList from "./components/charge-station-list/index.vue";
import chargeStationMap from "./components/charge-station-map.vue";
import { axiosAllSupplier,axiosSynStationData } from "@/api/charge.js";
import { tabObj,supplierList } from "./fields";
export default {
  components: {
    chargeStationList,
    chargeStationMap
  },
  data() {
    return {
      tabObj, //供应商tab的值
      supplierList,//供应商列表
      isLoading: true,
      noData: false, //是否有数据，默认有数据，
      isList: true //是否显示列表，否则为地图
    };
  },
  computed: {
    nowSupplier() {
      let obj = {};
      this.supplierList.forEach(item => {
        item.supplierId === this.tabObj.tabVal && (obj = item);
      });
      return obj;
    }
  },
  mounted() {
    // 获取供应商列表
    this.getSupplierList(this.$route.query.id)
  },
  methods: {
    // 从供应商拉取最新数据
    synStationData() {
      axiosSynStationData({ supplierId: tabObj.tabVal }).then(res => {
        let status = res.data.data.status;
        if (status == "1") {
          this.$Message.success("已请求同步，请稍后刷新查看");
        } else {
          this.$Message.error("同步数据失败");
        }
      });
    },
    getSupplierList(queryId) {
      axiosAllSupplier({ status: 1 }).then(res => {
        this.supplierList = res.data.data || [];
        if (this.supplierList.length === 0) {
          this.noData = true;
          this.isLoading = false;
          return false;
        }
        this.tabObj.tabVal = this.supplierList[0] && this.supplierList[0].supplierId;
        if (queryId) {
          // 如果给的供应商id是对的，跳转到对应供应商
          let isQuery = this.supplierList.some(item => {
            return item.supplierId == queryId;
          });

          isQuery && (this.tabObj.tabVal = queryId);
        }
        this.isLoading = false;
      });
    }
  },
  beforeRouteUpdate(to, from, next) {
    if (to.name === from.name && to.query.id !== from.query.id) {
      this.getSupplierList(to.query.id)
    }
    next();
  },
  watch: {
    tabObj: {
      handler(newVal, oldVal) {
        this.isList = true;
      },
      deep: true
    }
  }
};
</script>
<style lang="less" scoped src="../charge.less"></style>
<style lang="less" scoped>
.my-tabs {
  line-height: 24px;
  font-size: 14px;
  color: #515a6e;
  margin: 20px 0;
  border-bottom: 1px solid #dcdee2;
  li {
    padding: 5px 16px;
    margin-right: 5px;
    border-radius: 4px 4px 0 0;
    border: 1px solid #dcdee2;
    border-bottom: 1px solid #dcdee2;
    position: relative;
    bottom: -1px;
    background: #f8f8f9;
    cursor: pointer;
  }
  li.active {
    color: #2d8cf0;
    border-bottom-color: #fff;
    background: #fff;
  }
}
</style>
<style lang="less">
.charge-station-manage .ivu-tabs-ink-bar {
  z-index: 0;
}
</style>
