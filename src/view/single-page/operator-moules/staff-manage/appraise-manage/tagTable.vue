<template>
  <div>
    <Table border :columns="tableColumns" :data="tableData"></Table>
    <Modal v-model="isShowAddModal" :title="modalTitle" :mask-closable="false">
      <Form
        ref="formValidate"
        :model="addData"
        :label-width="80"
        :rules="ruleValidate"
        style="padding: 15px 20px 0 0;"
      >
        <FormItem label="评价属性">
          <Input v-model="addData.text" readonly></Input>
        </FormItem>
        <FormItem label="评价标签" prop="tag">
          <Input v-model="addData.tag"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="isShowAddModal=false">关闭</Button>
        <Button type="primary" @click="confirmAddTag">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { updateTag, addNewTag } from "@/api/driver.js";
export default {
  name: "TagTable",
  props: {
    tagList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      currentStar: 1,
      isShowAddModal: false,
      tableColumns: [],
      addData: {},
      currentRowTags: [],
      modalTitle: "新增标签",
      tableData: [],
      ruleValidate: {
        tag: [
          { required: true, trigger: "change", message: "评价标签不得为空" }
        ]
      }
    };
  },
  created() {
    this.initTageTitle();
    this.getTagData();
  },
  methods: {
    getTagData() {
      this.tableData = [];
      let items = [
        {
          star: 1,
          text: "正面",
          tags: [],
          uuid: ""
        },
        {
          star: 2,
          text: "中性",
          tags: [],
          uuid: ""
        },
        {
          star: 3,
          text: "负面",
          tags: [],
          uuid: ""
        }
      ];
      let starMap = {//经叶进权威认证
        1: "正面",
        2: "中性",
        3: "负面"
      };
      this.tagList.map(item => {
        let star = item.star;
        switch (star) {
          case 1:
            items[0].uuid = item.uuid;
            items[0].tags = item.content&&item.content.split(",");
            break;
          case 2:
            items[1].uuid = item.uuid;
            items[1].tags = item.content&&item.content.split(",");
            break;
          case 3:
            items[2].uuid = item.uuid;
            items[2].tags = item.content&&item.content.split(",");
            break;
        }
      });
      this.tableData = [...items];
    },
    initTageTitle() {
      this.tableColumns = [
        {
          key: "text",
          title: "评价属性",
          width: 160
        },
        {
          key: "tags",
          title: "评价标签",
          render: (h, params) => {
            let items = params.row.tags;
            let btns = [];
            Array.isArray(items)&&items.map((item, index) => {
              btns.push(
                h(
                  "Tag",
                  {
                    props: {
                      color: "default",
                      closable: true
                    },
                    on: {
                      "on-close": () => {
                        this.deleteTag(params.row, index);
                      }
                    }
                  },
                  item
                )
              );
            });
            return h("div", btns);
          }
        },
        {
          title: "操作",
          key: "action",
          fixed: "right",
          width: 160,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary"
                  },
                  on: {
                    click: () => {
                      this.addTag(params.row);
                    }
                  }
                },
                "新增标签"
              )
            ]);
          }
        }
      ];
    },
    operateTag() {
      let params = {
        uuid: this.currentRow.uuid,
        star: this.currentRow.star,
        content: this.currentRowTags.join()
      };
      updateTag(params).then(res => {
        this.$Message.success("操作成功");
        this.$emit("on-update");
      });
    },
    deleteTag(row, index) {
      this.$Modal.confirm({
        title: "删除",
        content: "确认删除这条数据吗？",
        onOk: () => {
          row.tags.splice(index,1);
          this.currentRow = row;
          this.currentRowTags = [...row.tags];
          this.operateTag();
        }
      });
    },
    addTag(row) {
      this.addData = {};
      this.currentRowTags = [...row.tags];
      this.currentRow = row;
      this.isShowAddModal = true;
      this.addData.text = row.text;
    },
    confirmAddTag() {
      this.$refs.formValidate.validate().then(res => {
        if (res) {
          this.isShowAddModal = false;
          this.currentRowTags.push(this.addData.tag)
          this.operateTag();
        }
      });
    }
  },
  watch: {
    tagList(value) {
      this.getTagData(value);
    }
  }
};
</script>