<template>
  <div>
    <Table
      border 
      :columns="tableColumns"
      :data="tableData"
      :loading="loading"
    ></Table>
    <Modal
      v-model="isShowAddModal"
      title="新增标签"
      :mask-closable="false">
      <Form ref="formValidate" :model="addData" :label-width='80' :rules="ruleValidate" style="padding: 15px 20px 0 0;">
        <FormItem label='问题类型'>
          <Input v-model='addData.tagName' readonly></Input>
        </FormItem>
        <FormItem label='问题标签' prop="tagLabel">
          <Input v-model='addData.tagLabel'></Input>
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
import {problemTagList, deleteProblemTag, addProblemTag} from '@/api/driver.js'

export default {
  name: 'ProblemTag',
  data(){
    return {
      isShowAddModal: false,
      tableColumns: [],
      addData: {},
      loading: true,
      tableData: [],
      ruleValidate: {
        tagLabel: [{required: true, trigger: 'change', message: '问题标签不得为空'}]
      }
    }
  },
  created() {
    this.getList()
    this.initTagTitle()
  },
  methods: {
    initTagTitle() {
      this.tableColumns= [
        {
          key: 'tagName',
          title: '问题类型',
          width: 160
        },
        {
          key: 'tags',
          title: '问题标签',
          render: (h, params) => {
            let items = params.row.tags;
            let btns = [];
            items.map((item, index) => {
              btns.push( h('Tag', {
                props: {
                  color: 'default',
                  closable: true
                },
                on: {
                  'on-close':()=> {
                    this.deleteTag(items, index, params.row)
                  }
                }
              }, item))
            })
            return h('div', btns)
          }
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 160,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary'
                },
                on: {
                  click: ()=> {
                    this.addTag(params.row);
                  }
                }
              }, '新增标签')
            ])
          }
        }
      ]
    },
    getList(){
      this.tableData = []; 
      problemTagList().then(res=> {//列表中查询条件中问题标签也用到了这个方法
        this.loading = false;
        if (res.data.success) {
          let items = res.data.data
          if (items.length>0) {
            items.map(item => { 
              item.tags = item.tagLabel ? item.tagLabel.split(',') : [];
            })
           this.tableData = [...items];
          }
        }
      })
    },
    deleteTag(items, i, data) {
      let tagStr = '';
      this.$Modal.confirm({
        title: '删除',
        content: '确认删除这条数据吗？',
        onOk: ()=> {
          items.splice(i, 1);
          if (items.length > 0) {
            tagStr = [...items].join();
          }
          deleteProblemTag({
            uuid: data.uuid,
            tagLabel: tagStr
            }).then(res=> {
            this.$Message.success('删除成功');
          })
        }
      })
    },
    addTag(row) {
      this.isShowAddModal = true;
      this.addData = {};
      this.addData.tagName = row.tagName;
      this.addData.tags = Array.isArray(row.tags) ? row.tags : [];
      this.addData.uuid = row.uuid;
    },
    confirmAddTag() {
      this.$refs.formValidate.validate().then(res => {
        if(res){
          let tagsLength = this.addData.tagLabel.length;
          if (this.addData.tagLabel && tagsLength < 11) {
            this.addData.tags.push(this.addData.tagLabel)
           let params = {
             tagType: 5,
             tagName: this.addData.tagName,
             uuid: this.addData.uuid,
             tagLabel:this.addData.tags.join()
           }
            addProblemTag(params).then(res => {
              this.$Message.success('添加成功！')
              this.isShowAddModal = false;
              this.getList()
            })
          } else {
            this.$Message.error('标签最多设置10个字符!')
          }
        }
      })
    }
  }
}
</script>