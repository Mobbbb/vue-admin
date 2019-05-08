<template>
  <div>
    <Tabs :value="tabName" @on-click="getTabName">
      <!--<TabPane label="会话记录" name="conversation">
				<Row>
					<searchList
						:inputList="inputList"
						@on-search='handleSearch'
						@on-reset="reset"
					></searchList>
				</Row>
				<VTable
					:total="conversationData.total"
					:current="conversationData.current"
					:pageSize="conversationData.pageSize"
					:isLoading="conversationData.isLoading"
					:parColumns="conversationData.parColumns"
					:parTableData="conversationData.tableData"
					@changePage="changePage"
					@changePageSize="changePageSize"
					style="margin-top: 25px;">
				</VTable>
				<modal v-model="chartRecord" title="会话详情" width ="500" :mask-closable="false">
					<div class="outerdis">
						<div class="chat-record">
							<p class="chatTime" style="text-align:center;">2019-03-05 17:00</p>
							<div class="chatContent">
								<div class="chartlitem">
									<div class="logo_avatar"><img src="https://avatars0.githubusercontent.com/u/20942571?s=460&v=4" alt=""></div>
									<div class="nickname">小美女</div>
								</div>
								<div class="cahrtconts">你好！我在某某街道等你哦，帅哥！！！</div>
							</div>
							<div class="chatContent specialstyle">
								<div class="chartlitem">
									<div class="logo_avatar"><img src="https://avatars0.githubusercontent.com/u/20942571?s=460&v=4" alt=""></div>
									<div class="nickname">帅哥</div>
								</div>
								<div class="cahrtconts">你好！我马上就来了喽/斜眼笑</div>
							</div>
							<div class="chatContent">
								<div class="chartlitem">
									<div class="logo_avatar"><img src="https://avatars0.githubusercontent.com/u/20942571?s=460&v=4" alt=""></div>
									<div class="nickname">小美女</div>
								</div>
								<div class="cahrtconts">你好！我在某某街道等你哦，美女！！！</div>
							</div>
							<div class="chatContent specialstyle">
								<div class="chartlitem">
									<div class="logo_avatar"><img src="https://avatars0.githubusercontent.com/u/20942571?s=460&v=4" alt=""></div>
									<div class="nickname">帅哥</div>
								</div>
								<div class="cahrtconts">你好！我在某某街道等你哦，美女！！！</div>
							</div>
							<div class="chatContent">
								<div class="chartlitem">
									<div class="logo_avatar"><img src="https://avatars0.githubusercontent.com/u/20942571?s=460&v=4" alt=""></div>
									<div class="nickname">小美女</div>
								</div>
								<div class="cahrtconts">你好！我在某某街道等你哦，美女！！！</div>
							</div>
							<div class="chatContent specialstyle">
								<div class="chartlitem">
									<div class="logo_avatar"><img src="https://avatars0.githubusercontent.com/u/20942571?s=460&v=4" alt=""></div>
									<div class="nickname">帅哥</div>
								</div>
								<div class="cahrtconts">你好！我在某某街道等你哦，美女！！！</div>
							</div>
						</div>
					</div>
					<div slot="footer">
						<Button type="primary" @click="closeCharRecord">关闭</Button>
					</div>
				</modal>
      </TabPane>-->
      <TabPane label="司机端聊天模板" name="driverSide">
        <div class="index_header" v-if="this.driverSide.total < 5">
          <Button 
            type="primary" 
            @click="addDriverIm" 
            style="margin-top: 4px;"
            v-hasAuth="'shortmessage-IM-driverAdd'">新建模板
          </Button>
        </div>
        <div class="index_content">
          <VTable
            :isShowPage="false"
            :total="driverSide.total"
            :current="driverSide.current"
            :pageSize="driverSide.pageSize"
            :isLoading="driverSide.isLoading"
            :parColumns="driverSide.parColumns"
            :parTableData="driverSide.tableData"
            @changePage="changePage"
            @changePageSize="changePageSize"
            class="top20"
          ></VTable>
        </div>
      </TabPane>
      <TabPane label="乘客端聊天模板" name="passengerInterminal">
        <div class="index_header" v-if="this.passengerInterminal.total < 5">
          <Button 
            type="primary" 
            @click="addPassengerIm" 
            style="margin-top: 4px;"
            v-hasAuth="'shortmessage-IM-passangerAdd'">新建模板
          </Button>
        </div>
        <div class="index_content">
          <VTable
            :isShowPage="false"
            :total="passengerInterminal.total"
            :current="passengerInterminal.current"
            :pageSize="passengerInterminal.pageSize"
            :isLoading="passengerInterminal.isLoading"
            :parColumns="passengerInterminal.parColumns"
            :parTableData="passengerInterminal.tableData"
            @changePage="changePage"
            @changePageSize="changePageSize"
            class="top20"
          ></VTable>
        </div>
      </TabPane>
      <modal v-model="addMobel" title="新建模板" width="500" :mask-closable="false">
        <Form ref="imForm" :model="imForm" :rules="ruleInline" :label-width="120">
          <div class="top15">
            <FormItem prop="sendName" label="模板对象：">
              <span>{{sendObject}}</span>
            </FormItem>
          </div>
          <div class="top15">
            <FormItem prop="imContent" label="消息内容：">
              <Input
                type="textarea"
                placeholder="请输入消息内容"
                style="width: 300px"
                v-model="imForm.imContent"
              />
            </FormItem>
          </div>
        </Form>
        <div slot="footer">
          <Button @click="addMobel=false">取消</Button>
          <Button type="primary" @click="deviceAdd('imForm')">确定</Button>
        </div>
      </modal>
      <modal v-model="editMobel" title="编辑" :mask-closable="false">
        <Form ref="editForm" :model="editForm" :rules="ruleInline" :label-width="120">
          <div class="top15">
            <FormItem prop="sendName" label="模板对象：">
              <span>{{sendObject}}</span>
            </FormItem>
          </div>
          <FormItem label="消息内容：" prop="imContent">
            <Input
              placeholder="请输入消息内容"
              type="textarea"
              style="width: 300px"
              v-model="editForm.imContent"
            />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button @click="editMobel=false">取消</Button>
          <Button type="primary" @click="deviceEdit('editForm')">确定</Button>
        </div>
      </modal>
    </Tabs>
  </div>
</template>

<script>
import { Columns, conversationColumns, dataDevice, inputList } from "./index";
import {
  addIM,
  getIMList,
  deleteImItem,
  editIMItem
} from "@/api/announcement.js";

const validateNNull = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("不能为空"));
  } else if (value.length > 20) {
    callback(new Error("内容最多20字"));
  }
  callback();
};
export default {
  data() {
    return {
      addMobel: false, //添加弹出层是否显示
      editMobel: false, //编辑弹出层是否显示
      isDelete: false, //删除弹出层是否显示
      editorInfo: {}, //要传递给编辑弹出层的数据
      deleteInfo: {}, //要传递给删除弹出层的数据
      imForm: {
        imContent: ""
      },
      editForm: {
        imContent: ""
      },
      ruleInline: {
        imContent: [
          { required: true, message: "请填写消息内容", trigger: "blur" },
          { type: "string", max: 20, message: "内容最多20字", trigger: "blur" }
        ]
      },
      objList: [{ label: "司机", value: "1" }, { label: "乘客", value: "2" }],
      tabName: "driverSide",
      inputList: [],
      conversationData: {
        total: 0,
        current: 1,
        pageSize: 15,
        parColumns: [],
        tableData: [],
        isLoading: true
      },
      driverSide: {
        total: 0,
        current: 1,
        pageSize: 15,
        parColumns: [],
        tableData: [],
        isLoading: true
      },
      passengerInterminal: {
        total: 0,
        current: 1,
        pageSize: 15,
        parColumns: [],
        tableData: [],
        isLoading: true
      },
      sendObject: "",
      chartRecord: false
    };
  },
  created() {
    Object.entries(conversationColumns(this)).forEach(([key, value]) => {
      this.conversationData.parColumns.push(value);
    });
    Object.entries(Columns(this)).forEach(([key, value]) => {
      this.driverSide.parColumns.push(value);
      this.passengerInterminal.parColumns.push(value);
    });
  },
  mounted() {
    this.inputList = JSON.parse(JSON.stringify(inputList));
    this.getSideTableList(this.tabName);
  },
  methods: {
    closeCharRecord() {
      this.chartRecord = false;
    },
    addDriverIm() {
      this.sendObject = "司机";
      this.addMobel = true;
      this.$refs["imForm"].resetFields();
    },
    addPassengerIm() {
      this.sendObject = "乘客";
      this.addMobel = true;
      this.$refs["imForm"].resetFields();
    },
    getTabName(name) {
      this.tabName = name;
      this.$store.commit("changeLoadingFlag", true);
      this.getSideTableList(name);
    },
    handleSearch(val) {
      let params = val;
      this.getTableList(params);
    },
    reset() {
      this.getTableList();
    },
    getTableList(params) {
      // 获取会话记录table数据
    },
    getSideTableList(name) {
      // 获取table数据
      let sendList = {
        driverSide: 1,
        passengerInterminal: 2
      };
      let data = {
        page: this.driverSide.current,
        pageSize: this.driverSide.pageSize,
        sendName: sendList[name]
      };
      getIMList(data).then(res => {
        this.$store.commit("changeLoadingFlag", false);
        if (name == "driverSide") {
          this.driverSide.tableData = res.data.data.list;
          this.driverSide.total = res.data.data.totalCount;
        } else {
          this.passengerInterminal.tableData = res.data.data.list;
          this.passengerInterminal.total = res.data.data.totalCount;
        }
      });
    },
    changePage: function(val) {
      if (this.tabName == "driverSide") {
        this.driverSide.current = val;
        this.getSideTableList(this.driverSide);
      } else if (this.tabName == "conversationData") {
        this.conversationData.current = val;
        this.getTableList(this.driverSide);
      } else if (this.tabName == "passengerInterminal") {
        this.passengerInterminal.current = val;
        this.getSideTableList(this.driverSide);
      }
    },
    changePageSize: function(val) {
      if (this.tabName == "driverSide") {
        this.driverSide.pageSize = val;
        this.getSideTableList(this.tabName);
      } else if (this.tabName == "conversationData") {
        this.conversationData.pageSize = val;
        this.getTableList();
      } else if (this.tabName == "passengerInterminal") {
        this.passengerInterminal.pageSize = val;
        this.getSideTableList(this.tabName);
      }
    },
    deviceAdd(name) {
      // 新增
      this.$refs[name].validate(valid => {
        if (valid) {
          let data = this.imForm;
          data.sendName = this.tabName == "driverSide" ? 1 : 2;
          addIM(data).then(res => {
            this.$Message.success(res.data.msg);
            this.getSideTableList(this.tabName);
            this.addMobel = false;
          });
        }
      });
    },
    deviceEdit(name) {
      //编辑
      this.$refs[name].validate(valid => {
        if (valid) {
          let data = this.editForm;
          editIMItem(data).then(res => {
            this.$Message.success(res.data.msg);
            this.getSideTableList(this.tabName);
            this.editMobel = false;
          });
        }
      });
    },
    handleDeleteItem(id) {
      // 删除
      let data = { uuid: id };
      deleteImItem(data).then(res => {
        if (res.data.success) {
          this.$Message.success("删除成功!");
          this.getSideTableList(this.tabName);
        }
      });
    }
  }
};
</script>

<style lang="less">
.normalBtn {
  border: none;
  color: white;
  background: #609ef3;
}
.normalBtn:hover {
  color: #ffffff;
  background: #95c1fe;
}
.normalBtn:active {
  color: #ffffff;
  background: #437cc9;
}
.tableBtn {
  color: #609ef3;
  cursor: pointer;
}
.deleteBtn {
  color: #ef5b5e;
}
.outerdis {
  max-height: 400px;
  overflow-y: scroll;
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
  .chat-record {
    .chatTime {
      text-align: center;
    }
    .chatContent {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-top: 20px;
      .chartlitem {
        width: 60px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        .logo_avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .nickname {
          color: #000;
          font-size: 14px;
          margin-top: 5px;
        }
      }
      .cahrtconts {
        max-width: 350px;
        font-size: 14px;
        color: #000;
        background: #f4f4f4;
        padding: 6px 10px;
        border-radius: 10px 10px;
      }
    }
    .specialstyle {
      display: flex;
      justify-content: flex-start;
      flex-direction: row-reverse;
    }
  }
}
</style>
