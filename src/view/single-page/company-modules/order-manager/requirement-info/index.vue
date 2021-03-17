<template>
  <div class="dispatchcar">
    <div class="searchlist">
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
  </div>
</template>
<script>
import {
  returnFields,
  inputList,
} from "./fields.js";
import {
  getApplyOrderList
} from "@/api/enterpriseVehicle.js";
export default {
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
      madalParams: {},
      modalData: [],
    };
  },
  created() {
    this.inputList = JSON.parse(JSON.stringify(inputList));
    Object.entries(returnFields(this)).forEach(([key, value]) => {
      this.tabelData.parColumns.push(value);
    });
  },
  mounted() {
    this.getList();
  },
  methods: {
    search(data) {
      this.searchParams = data;
      this.tabelData.current = 1;
      this.getList();
    },
    reset() {
      this.searchParams = {};
      this.tabelData.current = 1;
      this.tabelData.pageSize = 10;
      this.getList();
    },
    changePage(val) {
      this.tabelData.current = val;
      this.getList();
    },
    changePageSize(val) {
      this.tabelData.pageSize = val;
      this.getList();
    },
    getList() {
      let data = Object.assign({}, {
        currPage: this.tabelData.current,
        pageSize: this.tabelData.pageSize
      }, this.searchParams)
      getApplyOrderList(data).then(res => {
        this.tabelData.total = res.data.data.totalCount
        this.tabelData.tableDataCom = res.data.data.list
        this.$store.commit("changeLoadingFlag", false);
      }).catch(err => {
        this.tabelData.total = 0
        this.tabelData.tableDataCom = []
        this.$store.commit("changeLoadingFlag", false);
      })
    },
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
// }
</style>
