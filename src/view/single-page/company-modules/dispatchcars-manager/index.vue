<template>
  <div class="dispatchcar">
    <div class="searchlistarea">
      <div class="multstyle">
        <multiSselect
          :url="companyUrl"
          query="companyName"
          data-key="companyName"
          data-label="companyName"
          @on-success="getcompany"
          :width="200"
          :titlefront="titlefront"
          ref="muselect"
        ></multiSselect>
      </div>
      <SearchList :inputList="inputList" @on-search="search" @on-reset="reset"></SearchList>
    </div>
    <VTable
      :total="tabelData.total"
      :current="tabelData.current"
      :pageSize="tabelData.pageSize"
      :isLoading="tabelData.isLoading"
      :parColumns="tabelData.parColumns"
      :parTableData="tabelData.tableDataCom"
      @changePage="changePage"
      @changePageSize="changePageSize"
      class="top20"
    ></VTable>
    <modal
      v-model="newMobel"
      title="派车/改派"
      :mask-closable="false"
      :width="700"
      class="dispatchmodal"
    >
      <div class="ordedetail">
        <div class="titles">订单信息</div>
        <div class="detailcontent">
          <div class="lists">
            <p v-for="(item, index) in orderDetailMsg" :key="index">
              {{item.title}}
              <span>{{item.value}}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="ordedetail driverchoose">
        <div class="titles">选择司机</div>
        <SearchList :inputList="modalSearchList" @on-search="search" @on-reset="reset"></SearchList>
        <div class="tabelmstyles">
          <VTable
            :total="modalData.total"
            :current="modalData.current"
            :pageSize="modalData.pageSize"
            :isLoading="modalData.isLoading"
            :parColumns="modalData.parColumns"
            :parTableData="modalData.tableDataCom"
            @changePage="changeModalPage"
            @changePageSize="changeModalPageSize"
            @rowClickHandle="getitemData"
            class="top20"
          ></VTable>
        </div>
      </div>
      <div slot="footer">
        <Button type="text" @click="newMobel = false">取消</Button>
        <Button type="primary" @click="asyncOK">确认</Button>
      </div>
    </modal>
  </div>
</template>
<script>
import VTable from "_a/v-table/v-table";
import {
  returnFields,
  inputList,
  orderDetailMsg,
  modalSearchList,
  columns
} from "./fields.js";
import {
  dispatchCarQueryPage,
  OrderDetailByRouteUuid,
  queryDriverCarPage,
  dispatchOperation
} from "@/api/enterpriseVehicle.js";
import multiSselect from "_a/multi-select/multi-select";
export default {
  components: {
    VTable,
    multiSselect
  },
  data() {
    return {
      inputList: [],
      searchParams: {},
      tabelData: {
        total: 0,
        current: 1,
        pageSize: 10,
        isLoading: false,
        parColumns: [],
        tableDataCom: []
      },
      newMobel: false,
      orderDetailMsg: [],
      madalParams: {},
      modalData: {
        total: 0,
        current: 1,
        pageSize: 10,
        isLoading: false,
        parColumns: [],
        tableDataCom: []
      },
      companyUrl: "/company/wallet/list",
      titlefront: "企业名称",
      modalSearchList,
      dispatchOperationData: {
        routePlanUuid: "",
        actualDriverUuid: "",
        applyOrderUuid: "",
        mode: 1 //派单模式：目前都是指派–1，由rpc判断 （播单–0,改派–2）
      }
    };
  },
  created() {
    this.inputList = JSON.parse(JSON.stringify(inputList));
    this.orderDetailMsg = JSON.parse(JSON.stringify(orderDetailMsg));
    this.modalData.parColumns = JSON.parse(JSON.stringify(columns));
    Object.entries(returnFields(this)).forEach(([key, value]) => {
      this.tabelData.parColumns.push(value);
    });
    let newArray = []
    for (let i = 0; i<50;i++) {
      let newJson = {}
      let nums = 50 + i
      newJson['label'] = '4.' + nums + '以上'
      newJson['value'] = i + 1
      newArray.push(newJson)
    }
    this.modalSearchList[3].dropList = newArray
    if (this.modalSearchList[0].cascaderList.length === 0) {
      let operatorList = localStorage.getItem("pcOperatorList") || [];
      JSON.parse(operatorList).forEach(item => {
        this.modalSearchList[0].cascaderList.push(item);
      });
    }
  },
  watch: {
    newMobel: function() {
      this.modalSearchList = JSON.parse(JSON.stringify(modalSearchList));
      if (!this.newMobel) {
        this.madalParams = {};
      }
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    getcompany(value) {
      this.searchParams.companyName = value[0];
    },
    search(data) {
      if (this.newMobel) {
        this.$store.commit("changeLoadingFlag", false);
        this.madalParams = data;
        this.getdriverList();
      } else {
        this.$store.commit("changeLoadingFlag", false);
        for (let key in data) {
          this.searchParams[key] = data[key];
        }
        this.tabelData.current = 1;
        this.getList();
      }
    },
    reset() {
      if (this.newMobel) {
        this.$store.commit("changeLoadingFlag", false);
        this.madalParams = {};
        this.getdriverList();
      } else {
        this.searchParams = {};
        this.tabelData.current = 1;
        this.getList();
      }
    },
    changePage(val) {
      this.tabelData.current = val;
      this.getList();
    },
    changePageSize(val) {
      this.tabelData.pageSize = val;
      this.getList();
    },
    changeModalPage(val) {
      this.modalData.current = val;
      this.getdriverList();
    },
    changeModalPageSize(val) {
      this.modalData.pageSize = val;
      this.getdriverList();
    },
    getdriverList() {
      let data = Object.assign(
        {},
        {
          currPage: this.modalData.current,
          pageSize: this.modalData.pageSize
        },
        this.madalParams
      );
      queryDriverCarPage(data)
        .then(res => {
          this.modalData.total = res.data.data.totalCount;
          this.modalData.tableDataCom = res.data.data.list;
          this.$store.commit("changeLoadingFlag", false);
        })
        .catch(err => {
          this.$store.commit("changeLoadingFlag", false);
        });
    },
    getitemData(data) {
      this.dispatchOperationData.actualDriverUuid = data.driverId;
    },
    getList() {
      let data = Object.assign(
        {},
        {
          currPage: this.tabelData.current,
          pageSize: this.tabelData.pageSize
        },
        this.searchParams
      );
      dispatchCarQueryPage(data)
        .then(res => {
          this.tabelData.total = res.data.data.totalCount;
          this.tabelData.tableDataCom = res.data.data.list;
          this.$store.commit("changeLoadingFlag", false);
        })
        .catch(err => {
          this.tabelData.total = 0;
          this.tabelData.tableDataCom = [];
          this.$store.commit("changeLoadingFlag", false);
        });
    },
    getOrderDetailByRouteUuid(routePlanUuid) {
      OrderDetailByRouteUuid({ routePlanUuid }).then(res => {
        let OrderDetail = res.data.data;
        let dispatchStatusMap = {
          0: "待派车",
          1: "已派车"
        };
        let bussniseTypeMap = {
          2: "专车",
          4: "快车"
        };
        this.orderDetailMsg.forEach(item => {
          item.value = OrderDetail[item.keytitle] || "暂无";
          if (item.keytitle == "dispatchStatus") {
            item.value = dispatchStatusMap[OrderDetail["dispatchStatus"]];
          }
          if (item.keytitle == "bussniseType") {
            item.value = bussniseTypeMap[OrderDetail["bussniseType"]];
          }
        });
        this.newMobel = true;
      });
    },
    asyncOK() {
      dispatchOperation(this.dispatchOperationData)
        .then(res => {
          this.$Message.success(res.data.msg);
          this.newMobel = false;
          this.getList();
        })
        .catch(err => {});
    }
  }
};
</script>
<style lang="less" scope>
// .dispatchcar {
.ordedetail {
  border: 1px solid #f2f2f2;
  padding: 10px;
  letter-spacing: 1px;
  margin-bottom: 10px;
  .titles {
    font-size: 16px;
    color: #000;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .detailcontent {
    .lists {
      font-size: 14px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      p {
        width: 300px;
        span {
          font-weight: 600;
        }
      }
    }
  }
  .tabelmstyle {
    .ivu-table-overflowX {
      max-height: 200px;
      overflow: scroll;
      &::-webkit-scrollbar {
        //滚动条的宽度
        width: 9px;
        height: 9px;
        border-radius: 4.5px 4.5px;
      }
      &::-webkit-scrollbar-track-piece {
        //滚动条凹槽的颜色，还可以设置边框属性
        background-color: #f8f8f8;
      }
      &::-webkit-scrollbar-thumb {
        //滚动条的设置
        background-color: #dddddd;
        background-clip: padding-box;
        min-height: 28px;
      }
      &::-webkit-scrollbar-thumb:hover {
        background-color: #bbb;
      }
    }
  }
}
.searchlistarea {
  // display: flex;
  // align-items: center;
  // justify-content: flex-start;
  .multstyle {
    margin-right: 30px;
    margin-bottom: 20px;
  }
  .titlefont{
    width: 50px;
  }
}
// }
</style>
