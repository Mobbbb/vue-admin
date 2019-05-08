<!--app协议管理-->
<template>
  <div class="appidenty">
    <SearchList :inputList="inputList" @on-search='search' @on-reset="reset"></SearchList>
    <Button type="primary" @click="addlistem" v-hasAuth="'agreement_control-add'">新建</Button>
    <VTable
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :isLoading="isLoading"
      :parColumns="parColumns"
      :parTableData="tableDataCom"
      @changePage="changePage"
      @changePageSize="changePageSize"
      class="top20">
    </VTable>
    <!-- 弹框 -->
    <modal v-model="newMobel" :title="modaltitle" :mask-closable="false" :width="450">
      <div style="padding: 0 20px;">
        <div class="top15">协议名称&nbsp;&nbsp;&nbsp;&nbsp;
          <Select v-model="addparams.protocolName" style="width:300px">
            <Option
              v-for="item in platformList"
              :value="item.value"
              :key="item.value">{{ item.label }}
            </Option>
          </Select>
        </div>
        <div class="top15">更新机制：
          <Checkbox v-model="addparams.updateRule" disabled>强制更新</Checkbox>
        </div>
        <div class="top15">协议版本：
          <Input v-model="addparams.protocolVersion" placeholder style="width: 300px"/>
        </div>
        <div style="margin: 15px 0">协议连接：
          <Input v-model="addparams.protocolLink" placeholder style="width: 300px"/>
        </div>
      </div>
      <div slot="footer">
        <Button type="text" @click="newMobel = false">取消</Button>
        <Button type="primary" @click="asyncOK">确认</Button>
      </div>
    </modal>
    <modal v-model="lookMobel" title="查看" :mask-closable="false">
      <div>
        点击地址查看协议内容：
        <span
          class="protocol-link"
          @click="tosightweb"
        >{{ protocolLink || '' }}</span>
      </div>
    </modal>
  </div>
</template>

<script>
import { returnFields } from "./fields";
import {
  protocolListdata,
  protocolSave,
  protocolDetail,
  protocolEdit
} from "@/api/configData.js";
import { timeFormat } from "@/libs/util";

export default {
  name: "agreementControl",
  data() {
    return {
      inputList: [
        {
          name: 'drop-input',
          bind_key: 'protocolName',
          placeholder: '请选择',
          value: '',
          dropList: [],
          title: '协议名称：',
          inputWidth: 250,
          titleWidth: 70,
          unicode: '1',
          isHide: false
        },
      ],
      modaltitle: '新建',
      total: 0,
      current: 1,
      pageSize: 10,
      isLoading: true,
      tableColumns: [],
      agreementColumns: [],
      newMobel: false, //新建弹出框
      lookMobel: false, //查看弹出框
      platformList: [
        /*{
          value: '3',
          label: "全部端"
        },*/
        {
          value: "1",
          label: "乘客端"
        },
        {
          value: "2",
          label: "司机端"
        }
      ],
      parColumns: [],
      searchParams: {},
      tableData: [],
      addparams: {
        protocolVersion: "", // 协议版本
        updateRule: true, // 更新机制(0.否，1.是)
        protocolName: "", // 客户端类型（1:乘客端，2:司机端）
        protocolLink: "" // 协议连接
      },
      controlbtn: {
        // 控制公用弹窗为新建还是更新
        savebtn: false, // 保存（新建）
        updatebtn: false // 更新
      },
      protocolLink: "",
      editorModal: false
    };
  },
  created() {
    Object.entries(returnFields(this)).forEach(([key, value]) => {
      this.parColumns.push(value);
    });
  },
  mounted() {
    this.inputList[0].dropList = this.platformList
    this.getList();
  },
  computed: {
    tableDataCom() {
      let tableData = this.tableData;
      tableData.forEach((item, index) => {
        item.protocolName = item.protocolName == 1 ? "乘客端" : item.protocolName == 2 ? "司机端": '全部'
        item.protocolLink = item.protocolLink? item.protocolLink : '暂无'
        item.updatedOn = item.updatedOn? item.updatedOn: '暂无'
        item.updatedBy = item.updatedBy? item.updatedBy:'暂无'
        item.idxs = index + 1
      });
      return tableData;
    }
  },
  methods: {
    search: function(data) {
      this.searchParams = data
      this.current = 1
      this.getList()
    },
    reset: function() {
      this.searchParams = {}
      this.current = 1
      this.getList()
    },
    asyncOK: function() {
      let addparams = JSON.parse(JSON.stringify(this.addparams))
      const validator  = value => {
        let reg = /((ht|f)tps?:)\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g
        let flag = reg.test(value)
        return flag
      }
      if (!addparams.protocolName) {
        this.$Message.warning('请输入协议名称')
        return
      }
      if (!addparams.protocolVersion) {
        this.$Message.warning('请选择协议版本')
        return
      }
      if (!addparams.protocolLink) {
        this.$Message.warning('请输入网址')
        return
      }
      if (!validator(addparams.protocolLink)) {
        this.$Message.warning('请输入正确的网址')
        return
      }
      addparams.updateRule = addparams.updateRule ? 1 : 0
      if (this.editorModal) {
          protocolEdit(addparams).then(res => {
            this.getList()
            this.newMobel=false
            this.$Message.success(res.data.msg)
          })
      } else {
        protocolSave(addparams).then(res => {
          this.getList()
          this.newMobel=false
          this.$Message.success(res.data.msg)
        })
      }
    },
    changePage: function(val) {
      this.current = val
      this.getList();
    },
    changePageSize: function(val) {
      this.pageSize = val
      this.getList();
    },
    getList: function() {
      let that = this;
      let data = JSON.parse(JSON.stringify(this.searchParams))
      data.pageSize = this.pageSize,
      data.currPage = this.current
      protocolListdata(data).then(res => {
        let resdata = res.data.data
        this.tableData = resdata && resdata.list || []
        this.total = resdata && resdata.totalCount
        this.$store.commit('changeLoadingFlag', false)
      });
    },
    addlistem: function() {
      let addparams = this.addparams;
      for (var key in addparams) {
        addparams[key] = ""
      }
      addparams.updateRule = true
      this.addparams = addparams
      this.controlbtn = {
        savebtn: true,
        updatebtn: false
      };
      this.modaltitle = '新建'
      this.editorModal = false
      this.newMobel = true
    },
    tosightweb: function() {
      window.open(this.protocolLink, "_blank")
    }
  }
};
</script>

<style lang="less">
.appidenty {
  .searchlines {
    display: flex;
    align-items: center;
    .btnarea {
      button {
        margin-right: 15px;
      }
    }
  }
}
.protocol-link{
  color: #3399ff;
  cursor: pointer;
  font-size: 13px;
}
</style>
