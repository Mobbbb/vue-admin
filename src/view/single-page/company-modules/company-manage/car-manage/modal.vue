<template>
    <Modal class="carWrap" v-model="modalFrom.showModal" :mask-closable="false"
        :title="'场景详情'+ '（' + enteroriseName + '）'"  width="600"> 
			<Tabs v-model="tabIndex" @on-click="tabClick" class="new-tabs">
				<TabPane v-for="(list, index) in tabList" :key="index" :label="list.sceneName">
					<Form style="margin-left: 60px">
                        <FormItem>
                            <Checkbox v-model="list.checkAll" :indeterminate="list.indeterminate"
                                @click.prevent.native="clickFirstLevel(list)">全选</Checkbox>
                        </FormItem>
                        <FormItem label="条件：" >
                            <div v-for="(item,index) in list.sceneRuleList" :key="item.name">
                                <div  class="checkTitle" style="margin-left: 48px">
                                    <Checkbox v-model="item.checkAll" :indeterminate="item.indeterminate"
                                    @click.prevent.native="clickSecondLevel(item)">
                                        {{ item.name }}
                                    </Checkbox>
                                </div>
                                <div class="checkItem" >	
                                    <CheckboxGroup v-model="item.checkAllGroup" 
                                        @on-change="clickThirdLevel(item)">
                                        <Checkbox  v-for="(key, ele) in item.list" :label="key.label" :key="key.value" :disabled="item.name=='审批人设置' && isDisabled && !!ele">
                                            {{ key.value }}
                                        </Checkbox>
                                    </CheckboxGroup>
                                </div>
                            </div>
                        </FormItem>
					</Form>
				</TabPane>
			</Tabs>
			<div slot="footer">
				<Button size="large" type="text" style="margin-right: 8px;" @click="modalFrom.showModal = false">取消</Button>
				<Button size="large" type="primary" @click="confirm">确定</Button>
			</div>
		</Modal>
</template>
<script>
import { pageData, modalData, mapObj, arrData, modalForm } from "./fields.js";
export default {
    props: {
        enteroriseName: {
            type: String
        },
    },
    data() {
        return {
           ...pageData,
            tabIndex: 0,
            tabList: [],
            isDisabled: true
        }
    },
    methods: {
        // 初始加载数据
        init(data, reslove) {
            this.tabList = [];
            for(let list of data) {
                this.tabList.push(this.dealData(list));
            }
        
            this.tabIndex = 0;
            reslove();
            this.whetherAllCheck();
        },
        // 初步处理数据
        dealData(data) {
            let content = JSON.parse(data.sceneContent);
            
            let _arr = [];
            content.forEach((list, index) => {
                _arr.push(this.composeData(list, index))
            });
            
            for(let list of _arr) {
                if(list.checkAllGroup.length > 0) {
                    list.indeterminate = true;
                    list.checkAll = false;
                    if(list.checkAllGroup.length == list.list.length) {
                        list.checkAll = true;
                        list.indeterminate = false;
                    }
                }
            }
            data.sceneRuleList = _arr;
			
            return data;
        },
        // 数据组装
        composeData(data, index) {
            let name = arrData[Number(data.sceneType) - 1].name;
            let list = arrData[Number(data.sceneType) - 1].list;

            let key = mapObj[data.sceneType];
            let arr = [];
            
            if(data[key]) {
                if(index == 3) {
                    if(data[key]) {
                        list.map(item => {
                            arr.push(item.label);
                        })
                    }
                }else if(index == 6) {
                    if(data[key]) {
                        list.map(item => {
                            arr.push(item.label);
                        })
                    }
                }else if(index == 7) {
                    
                    if(data[key][0]) {
                        if(data[key][0].value.length) {
                          
                            data[key][0].value.map(item => {
                                arr.push(item.grade);
                            })
                        }
                        if (this.source(arr, '1')) {
                            this.isDisabled = false;
                        }else {
                            this.isDisabled = true;
                            arr = []
                        }

                    }
                    
                }else {
                    data[key].map((item, index) => {
						arr.push(item.model);
                    })
                }
            }
            return {
                name: name,
                list: list,
                checkAll: false,
                indeterminate: false,
                checkAllGroup: arr
            }
        },
        source(arrays, types) {
            return arrays.some(item => {
                return item == types
            })
        },
        // 点击第三层
        clickThirdLevel(item) {
            // 判断条件时候全选
            // const source = (arrays, types) => {
            //     return arrays.some(item => {
            //         return item == types
            //     })
            // }
            if(item.name == "审批人设置"){
                if (this.source(item.checkAllGroup, '1')) {
                    this.isDisabled = false;
                }else {
                    this.isDisabled = true;
                    item.checkAllGroup = [];
                }
            }
            if(item.checkAllGroup.length > 0) {
                item.indeterminate = true;
                item.checkAll = false;
                if(item.checkAllGroup.length == item.list.length) {
                    item.indeterminate = false;
                    item.checkAll = true;
                }
            }else {
                item.indeterminate = false;
                item.checkAll = false;
            }

            this.whetherAllCheck();
        },
        // 点击第二层
        clickSecondLevel(item) {
           
            if (item.indeterminate) {
				item.checkAll = false;
				item.indeterminate = false;
            } else {	

				item.checkAll = !item.checkAll;
            }
            if (item.checkAll) {
                item.list.map(list => {
                    item.checkAllGroup.push(list.label);
                })
			}else{
				item.checkAllGroup = [];
            }    
            this.whetherAllCheck();
        },
        // 点击第一层
        clickFirstLevel(list) {

            // list.indeterminate = false;
            // if(list.checkAll) {
            //     list.checkAll = false;
            //     for(let item of list.sceneRuleList) {
            //         item.checkAll = false;
            //         item.indeterminate = false;
            //         item.checkAllGroup = [];
            //     }
            // }else {
            //     list.checkAll = true;
            //     for(let item of list.sceneRuleList) {
            //         item.checkAll = true;
            //         item.indeterminate = false;
            //         item.list.map(list => {
            //             item.checkAllGroup.push(list.label);
            //         })
            //     }
            // }
            if (list.indeterminate) {
				list.checkAll = false;
			} else {
				list.checkAll = !list.checkAll;
            }
            list.indeterminate = false;
            if (list.checkAll) {
				for(let item of list.sceneRuleList) {
                    item.checkAll = true;
                    item.list.map(list => {
                        item.checkAll = true;
                        item.indeterminate = false;
                        item.checkAllGroup.push(list.label);
                    })
                }
			}else{
				for(let item of list.sceneRuleList) {
                    item.checkAllGroup = [];
                    item.checkAll = false;
                    item.indeterminate = false;
                }
			}


        },
        // 判断是否全部全选
        whetherAllCheck() {
            let list = this.tabList[this.tabIndex];

            // list.indeterminate = list.sceneRuleList.some(item => item.indeterminate || item.checkAll)
            // list.checkAll = !list.sceneRuleList.some(item => item.checkAll == false)
            // if(list.checkAll) {
            //     list.indeterminate = false;
            // }

            if( list.sceneRuleList.every(item => item.checkAll) ) {
                list.checkAll = true;
                list.indeterminate = false;
            }else if(!list.sceneRuleList.some(item => item.checkAllGroup.length)){
                list.checkAll = false;
                list.indeterminate = false;
            }else{
                list.checkAll = false;
                list.indeterminate = true;
            }
        },
        // tab也切换方法
        tabClick() {
            this.whetherAllCheck();
        },
        confirm() {
            let params = this.composeParams();
            this.$emit('confirm',params)
        },
        // 组装后台传参
        composeParams() {
            let arr = [];
            let obj = JSON.parse(JSON.stringify(this.tabList));
            for(let content of obj) {
                arr.push(this.dealParams(content))
			}
		
            return arr
        },
        // 初步组装参数
        dealParams(content) {
            delete content.checkAllGroup;
            delete content.checkAll;
            delete content.indeterminate;

            let arr = [];
            content.sceneRuleList.forEach((list, index) => {
                let obj = {
                    sceneType: index + 1,
                }
                let key = mapObj[index + 1];
				this.detailParams(list, index) && (obj[key] = this.detailParams(list, index))
                arr.push(obj);
            })
			
			content.sceneContent = arr;
            delete content.sceneRuleList;
            return content;
        },
        // 具体组装参数
        detailParams(list, index) {
            let arr = [];
            if(index == 3) {
                if(list.checkAllGroup.length > 0) {
                    return {}
                }else {
                    return false
                }
            }else if(index == 6) {
                if(list.checkAllGroup.length > 0) {
                    return []
                }else {
                    return false
                }
            }else if(index == 7) {
                if(list.checkAllGroup.length > 0) {
                    let obj = {
                        model: 2,
                        value: []
                    }
                    list.checkAllGroup.map(item => {
                        obj.value.push({
                            grade: item
                        })
                    })
                    arr.push(obj);
                }else {
                    return false
                }
            }else {
                if(list.checkAllGroup.length > 0) {
                    list.checkAllGroup.map(item => {
						if(item != null){
							arr.push({
								model: item
							})
						}	
                    })
                }else {
                    return false;
                }
			}
            return arr;
        }
    }
}
</script>
<style>
	.carWrap .checkItem{
		margin-left: 80px;
		
	}
	.carWrap .ivu-form-item{
		margin-bottom: 10px!important;
	}
	.carWrap .operate-left{
		width: 200px;
		line-height: 40px;
		text-align: right;
		margin-right: 10px
	}
	.carWrap .operate-right{
		line-height: 40px
	}
	.carWrap .new-tabs .ivu-tabs-ink-bar-animated{
		width: 88px!important;
	}
</style>