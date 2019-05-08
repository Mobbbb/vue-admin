<template>
    <div class="popView" v-show="popView">
        <div class="ivu-modal-mask"></div>
        <div class="popView-wrap" :style="{'top': top + 'px'}">
            <div class="popView-content" :style="{'width': width + 'px'}">
                <div class="popView-title-wrap" :style="{'width': width + 'px','top': top + 'px'}">
                    <span class="popView-title">{{title}}</span>
                    <div class="popView-icon">
                        <Icon class="close-icon" type="md-close" @click="commit(0)"/>
                    </div>
                </div>
                <router-view></router-view>
                <div class="popView-body-wrap">
                    <ul class="popView-body" :class="rowNum">
                        <li class="popView-body-row">
                            <span class="popView-name">角色名称:</span>
                            <div class="popView-input">
                                <Input clearable v-model="params.roleName" :maxlength="32"></Input> 
                            </div>
                        </li>
                        <li class="popView-body-row">
                            <span class="popView-name">功能权限:</span>
                        </li>
                        <li class="popView-body-row" style="position: relative;">
                            <Spin :style="{margin: '10px 0'}" v-if="params.Loading" fix size="large"></Spin>
                            <Tree
                                v-else
                                ref="tree"
                                :data="params.treeData" 
                                :show-checkbox="true" 
                                :multiple="true" 
                                style="margin: -15px 0 0 27px;"
                                empty-text="">
                            </Tree>
                        </li>
                    </ul>
                    <div class="popView-footer-wrap">
                        <Button size="large" type="text" @click="commit(0)" style="margin-right: 8px;">取消</Button>
                        <Button size="large" type="primary" @click="commit(1)" :loading="loading">确定</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { treeDataTranslate, getCheckedNode } from '@/libs/tools'
import { getMenuList, getSaveRole, getUpdateRole } from '@/api/power-data'
import Choose from '../../choose-group.vue'
import '@/styles/cyk-style.css'

export default {
    components: {
        Choose
    },
    props: {
        popView: Boolean,
        width: Number,
        top: {
            default: 200,
            type: Number
        },
        title: {
            default: '新建弹窗',
            type: String
        },
        rowNum: {
            default: '',
            type: String
        },
        params: {
            default: {},
            type: Object
        }
    },
    data () {
        return {
            loading: false,
            roleId: '',
            menuIdList: [],
        }
    },
    watch: {
        'popView': function(){
            if(this.popView){
                this.loading = false
            }
        }
    },
    methods: {
        commit: function(temp){
            let resourceIds = ''
            let menuIdList = [] // 传给后台的数据，菜单id数组
            let showIdList = [] // 无用
            if(temp){
                if(this.params.roleName.length > 0){
                    getCheckedNode(menuIdList, showIdList, this.params.listData ,this.$refs.tree.getCheckedNodes())
                    for(let i = 0; i < menuIdList.length; i++){
                        resourceIds += menuIdList[i] + ','
                    }
                    this.params.resourceIds = resourceIds
                    this.loading = true
                    if(this.params.type === 'add'){
                        getSaveRole(this.params).then(res => {
                            this.loading = false
                            this.$Message.success('添加成功!')
                            this.$emit('on-confirm', 1)
                        }).catch(e => {
                            this.loading = false
                        })
                    } else {
                        getUpdateRole(this.params).then(res => {
                            this.loading = false
                            this.$Message.success('修改成功!')
                            this.$emit('on-confirm', 1)
                        }).catch(e => {
                            this.loading = false
                        })
                    }
                } else {
                    this.$Message.warning('角色名称不得为空!')
                }            
            } else {
                this.$emit('on-confirm')
            }
        }
    }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
