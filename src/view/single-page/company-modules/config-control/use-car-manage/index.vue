<template>
    <div>
        <Button type="primary" @click="addUseScene">新增用车场景</Button>
        <Modal title="新增用车场景" v-model="isShowAddModal"  :mask-closable='false'>
            <Form :label-width='100' :rules='addFormRule' :model='addForm' ref="addForm">
                <FormItem label='场景名称'
                prop='addRuleName'
                >
                    <Input v-model="addForm.addRuleName" :maxlength='10'></Input>
                </FormItem>
            </Form>
            <div slot='footer'>
                <Button  @click="isShowAddModal = false">取消</Button>
                <Button type="primary" @click="confirmAdd">确定</Button>
            </div>
        </Modal>
        <Modal title="场景详情" v-model="isShowRuleModal" :width='800'>
            <auditForm :isShowDetail='isShowDetail'></auditForm>
        </Modal>
        <VTable
      :total="total"
      :current="current"
      :pageSize="pageSize"
      :parColumns="columns"
      :parTableData="tableData"
      @changePage="changePage"
      @changePageSize="changePageSize"
      style="margin-top: 20px;"
    ></VTable>
    </div>
</template>
<script>
import auditForm from './auditForm';

import {
  listQuery,
  detail,
  scenesAdd,
  scenesRemove,
} from "@/api/company-api/config.js";


export default {
    components:{
        auditForm,
    },
    created(){
        this.getList()
    },
    data() {
        let self = this;
        return {
            pageSize: 10,
            current: 1,
            isShowRuleModal: false,
            isShowDetail: true,
            tableData: [],
            total: null,
            addRuleName: null,
            isShowAddModal: false,
            addForm:{
                addRuleName: ''
            },
            addFormRule:{
                addRuleName:[{required: true, message: '必填！'}]
            },
            columns:[
                {
                    title: '场景名称',
                    key: 'enteroriseName',
                },
                {
                    title: '操作',
                    key: 'action',
                    render(h,params) {
                        return h('div',[
                            h('a',{
                                style: {
                                    marginRight: "10px",
                                },
                                on:{
                                    click:()=>{
                                        let info = params.row;
                                        self.viewDetail(info)
                                    }
                                }
                            },'场景详情'),
                            h('a',{
                                style: {
                                    marginRight: "10px",
                                },
                                on:{
                                    click:()=>{
                                        let info = params.row;
                                        self.auditInfo(info)
                                    }
                                }
                            },'编辑'),
                            h('a',{
                                on:{
                                    click: ()=>{
                                        let info = params.row;
                                        self.deleteInfo(info)
                                    }
                                }
                            },'删除')
                        ])
                    },

                }
            ]
        }
    },
    methods:{
        addUseScene() {
            this.isShowAddModal = true;
        },
        getList() {
            //TODO
          let data = {
            currPage: this.current,
            pageSize: this.pageSize
          };
          this.$store.commit("changeLoadingFlag", true);
          listQuery(data).then(res => {
            this.tableData = res.data.data.list;
            this.total = res.data.data.totalCount;
            this.$store.commit("changeLoadingFlag", false);
          });
        },
        changePage(){
            this.current = val;
            this.getList();
        },
        changePageSize(){
            this.current = val;
            this.getList();
        },
        confirmAdd() {
            this.$refs.addForm.validate(valid=>{
                if(valid) {
                    //TODO
                }
            })
        },
        viewDetail(info) {
            //TODO 场景详情
            this.isShowRuleModal = true;
            this.isShowDetail = true;
            let data = {
              orgId: info.enteroriseId,
              orgType: 2  //组织结构类型 1：企业 2：部门 这里直接传1
            }
            detail(data).then(res => {
              this.tableData = res.data.data.list;
              this.total = res.data.data.totalCount;
              this.$store.commit("changeLoadingFlag", false);
            });
        },
        auditInfo(info) {
            //TODO 编辑
            this.isShowDetail = false;
            this.isShowRuleModal = true;
        },
        deleteInfo(info) {
            //TODO 删除
            this.$Modal.confirm({
                title:'删除',
                content: '<p>您确认要删除该用车场景么？</p>',
                onOk: ()=>{
                  let data = {
                    sceneId: info.enteroriseId,
                  }
                  scenesRemove(data).then(res => {
                    this.getList();
                  });
                }
            })
        }
    }
}
</script>

