<!--定价策略弹窗-->
<template>
    <div class="modal-box" style="padding: 0 10px;">
        <p style="padding: 0 0 10px 5px;">所选城市：{{wholeData.city}}</p>
        <!-- 切换框样式 -->
        <div class="ivu-tabs-nav-scroll long-border-bottom">
            <div class="nav-text ivu-tabs-nav">
                <div class="ivu-tabs-ink-bar ivu-tabs-ink-bar-animated" style="visibility: visible; width: 88px; transform: translate3d(0px, 0px, 0px);"></div>
                <div class="ivu-tabs-tab" :class="names === '1' ? 'ivu-tabs-tab-focused border-bottom' : ''" @click="changeTab('1')">
                    即时用车
                </div>
                <div class="ivu-tabs-tab" :class="names === '2' ? 'ivu-tabs-tab-focused border-bottom' : ''" @click="changeTab('2')">
                    预约用车
                </div>
            </div>
        </div>
     
        <div label="即时用车" name="1" v-if="names == '1'" :style="{marginTop:'10px'}">
            <BsTab 
                :strategyType='names' 
                :wholeData='wholeData' 
                ref="tabChild1" 
                :editable.sync='editable' 
                @revive='changeEdit' 
                :onedata='data1'>
            </BsTab>
        </div>
        <div label="预约用车" name="2" v-if="names == '2'" :style="{marginTop:'10px'}">
            <BsTab 
                :strategyType='names' 
                :wholeData='wholeData' 
                ref="tabChild2" 
                :editable.sync='editable' 
                :onedata='data2'>   
            </BsTab>
        </div>
    </div>
</template>

<script>
import BsTab from "./bsTab.vue";
import { getModelRules } from "@/api/configData.js";

export default {
    name: "bs-modal",
    props: {
        strategyType: String,
        typeModule: String,
        wholeData: {
            type: Object,
            default: () => {
                return;
            }
        }
    },
    components: {
        BsTab
    },
    data() {
        return {
            isShowP: "",
            formItem: "",
            editable: false,
            loading: "",
            strategyTypeFlag: "1",
            data1: {},
            data2: {},
            names: "1"
        };
    },
     mounted() {
        this.getRules();
    },
    watch: {
        isShow(newVal) {
            this.isShowP = newVal;
            this.$emit("update:isShow", false);
        }
    },
    methods: {
        cancel(val) {
            this.editable = false;
        },
        save() {
            this.editable = false;
        },
        changeEdit(val) {
            this.editable = val;
        },
        changeTab(name) {
            if (this.editable) {
                this.alertModal(name)
                return false;
            }
            this.names = name;
            this.editable = false;
        },
        alertModal(name){
            this.$Modal.confirm({
                title: '保存修改',
                content: '<p>当前正在编辑，是否保存修改？</p>',
                onOk: () => {
                    this.names = name;
                    if(name == 2){
                      this.$refs.tabChild1.validating()
                    } else {
                      this.$refs.tabChild2.validating()
                    }
                    this.editable = false;
                },
                onCancel: () => {
                    this.$Message.info('未保存');
                    this.names = name;
                    this.editable = false;
                }
            });
        },
        //获取计费规则详情
        getRules() {
            let tm = Number(this.typeModule);
            let data = {
                typeModule: tm,
                cityUuid: this.wholeData.cityUuid
            };
            getModelRules(data).then(res => {
                let All = res.data.data;
                All.forEach(item => {
                    if (item.typeTime == 1) {
                        this.data1 = item;
                    } else if (item.typeTime == 2) {
                        this.data2 = item;
                    } else {
                        this.$Message.warning('typeTime类型有误')
                    }
                })
            });
        }
    }
}
</script>

<style lang="less" scoped>
.pd-lr-10 {
    padding-left: 10px;
    padding-right: 10px;
}

.border-bottom {
    border-bottom: 2px solid #2d8cf0;
    color: #2d8cf0;
}

.long-border-bottom {
    border-bottom: 1px solid #e8eaec;
    margin-bottom: 2px;
}

.ivu-tabs-ink-bar {
    display: none;
}
</style>
