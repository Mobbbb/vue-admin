<template>
    <div class="popView" v-show="popView">
        <div class="ivu-modal-mask"></div>
        <div class="popView-wrap">
            <div class="popView-content" :style="{'width': width + 'px'}">
                <div class="popView-title-wrap" :style="{'width': width + 'px'}">
                    <span class="popView-title">{{title}}</span>
                    <div class="popView-icon">
                        <Icon class="close-icon" type="md-close" @click="commit(0)"/>
                    </div>
                </div>
                <router-view></router-view>
                <div class="popView-body-wrap">
                    <ul class="popView-body" :class="rowNum">
                        <Tabs style="width: 100%;">
                            <TabPane label="菜单" v-if="params.resourceType === 1" style="margin-top: 10px;">
                                <li class="popView-body-row">
                                    <span class="popView-name _popView-name">菜单名称:</span>
                                    <div class="popView-input">
                                        <Input clearable v-model="params.resourceName"></Input> 
                                    </div>
                                </li>
                                <li class="popView-body-row">
                                    <span class="popView-name _popView-name">图标:</span>
                                    <div class="popView-input">
                                        <Input clearable v-model="params.menuIcon"></Input> 
                                    </div>
                                </li>
                                <li class="popView-body-row">
                                    <span class="popView-name _popView-name">接口地址:</span>
                                    <div class="popView-input">
                                        <Input clearable v-model="params.permissionsUrl"></Input> 
                                    </div>
                                </li>
                                <li class="popView-body-row">
                                    <span class="popView-name _popView-name">菜单URL:</span>
                                    <div class="popView-input">
                                        <Input clearable v-model="params.resourceUrl"></Input> 
                                    </div>
                                </li>
                            </TabPane>
                            <TabPane label="按钮" v-else style="margin-top: 10px;">
                                <li class="popView-body-row">
                                    <span class="popView-name _popView-name">按钮名称:</span>
                                    <div class="popView-input">
                                        <Input clearable v-model="params.resourceName"></Input> 
                                    </div>
                                </li>
                                <li class="popView-body-row">
                                    <span class="popView-name _popView-name">接口地址:</span>
                                    <div class="popView-input">
                                        <Input clearable v-model="params.permissionsUrl"></Input> 
                                    </div>
                                </li>
                                <li class="popView-body-row">
                                    <span class="popView-name _popView-name">按钮标识:</span>
                                    <div class="popView-input">
                                        <Input clearable v-model="params.resourceUrl"></Input> 
                                    </div>
                                </li>
                            </TabPane>
                        </Tabs>
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
import { updateMenu } from '@/api/power-data'
import Choose from '../../choose-group.vue'
import '@/styles/cyk-style.css'

export default {
    components: {
        Choose
    },
    props: {
        popView: Boolean,
        width: Number,
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
            Loading: false // 是否加载中
        }
    },
    methods: {
        commit: function(temp){
            if(temp){
                updateMenu(this.params).then(res => {
                    if(res.data.success){
                        this.$Message.success('修改成功!')
                        this.$emit('on-confirm', 1)
                    }
                })
            }
            this.$emit('on-confirm')
        }
    }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    ._popView-name{
        width: 80px;
    }
</style>
