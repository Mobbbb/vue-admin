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
                            <span class="popView-name">上级分组:</span>
                            <div class="popView-input">
                                <div class="clickInput" @click="popGroupView">{{params.parentName}}</div>
                            </div>
                            <Choose
                                @on-confirm="getParentGroup"
                                :popView="popGroup"
                                :width='400'>   
                            </Choose>
                        </li>
                        <li class="popView-body-row">
                            <span class="popView-name">分组名称:</span>
                            <div class="popView-input">
                                <Input clearable v-model="params.groupName"></Input> 
                            </div>
                        </li>
                        <li class="popView-body-row">
                            <span class="popView-name">备注(选填):</span>
                            <div class="popView-input">
                                <Input clearable v-model="params.remark"></Input> 
                            </div>
                        </li>
                    </ul>
                    <div class="popView-footer-wrap">
                        <Button size="large" type="text" @click="commit(0)" style="margin-right: 8px;">取消</Button>
                        <Button size="large" type="primary" @click="commit(1)">确定</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { treeDataTranslate, getCheckedNode } from '@/libs/tools'
import { addGroup, updateGroup } from '@/api/power-data'
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
            popGroup: false
        }
    },
    methods: {
        getParentGroup: function(data){
            this.popGroup = false
            if(data !== 0){
                this.params.parentName = data.groupName
                this.params.parentUuid = data.uuid
            }
        },
        popGroupView: function(){
            if(this.params.type === 'edit'){
                this.popGroup = true
            }
        },
        commit: function(temp){
            if(temp){
                if(this.params.type === 'add'){
                    addGroup(this.params).then(res => {
                        if(res.data.success){
                            this.$Message.success('添加成功!')
                            this.$emit('on-confirm', 1)
                        }
                    })
                } else {
                    updateGroup(this.params).then(res => {
                        if(res.data.success){
                            this.$Message.success('修改成功!')
                            this.$emit('on-confirm', 1)
                        }
                    })
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
