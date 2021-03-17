<template>
    <div class="multiselect">
        <div class="titlefont">{{titlefront}}</div>
        <Dropdown trigger="custom" :style="boxStyle" :visible="visible" @on-clickoutside='visible=!visible'>
            <div class="select_top" @click="visible=!visible" :class="visible ? 'border_color' : ''">
                <span style="line-height:30px;padding-left:10px;color:#c5c8ce;" v-show="!resultList.length">{{placeholder}}</span>
                <ul :style="style">
                    <li v-for="(item, index) in resultList" :key="index" @click.stop="closeItem(item)">
                        {{item[dataLabel]}}<span class="icon_span"><Icon type="md-close" /></span>
                    </li>
                </ul>
                <Icon type="ios-arrow-down" :size='14' class="select_icon" :class="visible ? 'icon_active' : ''" />
            </div>
            <DropdownMenu slot="list" style="position:relative;">
                <div style="padding:7px 16px;">
                    <Input v-model="searchText" placeholder="请输入搜索词" @on-change='changeInput'></Input>
                </div>
                <Spin fix v-show="loading">
                    <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                    <div>Loading</div>
                </Spin>
                <CheckboxGroup v-model="checkResult" @on-change='changeCheck'>
                    <Scroll :distance-to-edge="-23" :on-reach-bottom="loadMore">
                        <DropdownItem v-for="(item, index) in searchList" :key="item.key">
                            <Checkbox :label="item.key" :value='checkResult.includes(item.key)'>{{item.label}}</Checkbox>
                        </DropdownItem>
                        <p style="padding:7px 16px; text-align:center;" v-show="!searchList.length">暂无匹配数据</p>
                    </Scroll>
                </CheckboxGroup>
            </DropdownMenu>
        </Dropdown>
    </div>
</template>
<script>
import {vagueCommonHandle} from "@/api/common.js";
export default {
    props:{
        titlefront: {
            type: String,
            default: ''
        },
        placeholder:{ // 展示框的默认值
            type: String,
            default: '请选择...'
        },
        url:{
          type: String,
          default: '/api/assets/v1/vehicle/like'
        },
        query:{
          type: String,
          default: 'vin'
        },
        width:{ // 展示框的最大宽度
            type: Number,
            default: 300
        },
        height:{ // 展示框的最大高度
            type: Number,
            default: 80
        },
        params:{// 额外的参数
          type: Object,
          default: ()=>{
            return {}
          }
        },
        isLock:{
          type:Boolean,
          default: false
        },
        // dataList:{ // 父级传过来的数据
        //     type:Array,
        //     default:()=>{
        //         return []
        //     }
        // },
        dataKey:{ // 接口数据的key值字段
            type:String,
            default: 'key',
        },
        dataLabel:{ // 接口数据的文本描述字段
            type: String,
            default: 'label'
        },
        // loading: { // 接口是否在加载中
        //     type: Boolean,
        //     default: false
        // },
        // isMore:{ // 是否有更多的数据
        //     type: Boolean,
        //     default: false
        // }
    },
    data(){
        return {
            visible: false,
            isMore: true,
            loading: false,
            dataList: [],
            checkResult:[],
            parentData: [],
            resultList: [],
            searchText: '',
            boxStyle: '',
            style: '',
            currPage: 1,
            pageSize: 20,
        }
    },
    computed:{
        searchList:function(){
            let newData = []
            this.parentData = [...this.resultList, ...this.dataList] // 合并父级数据和已经点击过的数据
            this.removeRepeat(this.parentData, this.dataKey) // 数组去重
            this.parentData.forEach(element =>{
                let obj = {
                    key: element[this.dataKey],
                    label: element[this.dataLabel]
                }
                newData.push(obj)
            })
            return newData
        }
    },
    created(){
        this.style = 'max-height:' + this.height + 'px;overflow:auto;'
        this.boxStyle = 'width:' + this.width + 'px;'
    },
    methods:{
        loadMore(){
            if(this.isMore){
                this.currPage++
                this.getResult();
                // this.$emit('on-lazyload', {
                //     query: this.searchText,
                //     currPage: this.currPage,
                //     pageSize: this.pageSize
                // })
            } else {
                this.$Message.warning("已无更多的数据")
            }
        },
        clearValue() {
          this.checkResult = [];
          this.resultList = [];
          this.$emit('on-success', [])
        },
        getResult(){
          if(!this.searchText) return this.dataList = [];
          this.loading = true;
          let params = {
            pageSize: this.pageSize,
            currPage: this.currPage,
            ...this.params
          }
          params[this.query] = this.searchText;
          vagueCommonHandle(this.url, params).then(res=>{
            this.loading = false;
            if(res.data.success) {
              let resd = res.data.data
              let data = resd ? resd.list : []
              this.isMore = resd.hasMore
              if(this.currPage === 1){
                this.dataList = data
              } else {
                this.dataList = this.dataList.concat(data)
              }
            }
          }).catch(err=>{
             this.loading = false;
          })
        },
        changeInput(){
            this.searchList.filter((item)=>{
                return item.label.includes(this.searchText) // 对输入条件的搜索框进行排序
            })
            this.currPage = 1;
            if(!this.isLock) {
              this.getResult();
            }
            this.$emit("on-change", this.searchText);
        },
        changeCheck(data){
            let resultList = [] // 展示框数组
            let parentData = [...this.parentData] // 拷贝合并后的数据
            let searchList = [...this.searchList] // 拷贝下拉框数据
            searchList.forEach(item => {
                item.priority = 0 // 令下拉框内的数据所有的优先级设置为 0
                data.forEach(element => {
                    if(item.key === element) item.priority = 1 // 令在下拉框点击到的数据的优先级设置为 1
                })
            })
            searchList.sort((a, b) => { // 对数组内进行排序， priority为 1 的在前面
                return b.priority - a.priority
            })
            this.checkResult.forEach((item)=>{
                parentData.forEach((element, index)=> {
                    if(element[this.dataKey] === item){
                        resultList.push(element) // 如果在父级数据找到所有点击的元素，把完整的数据放在展示框的数组里
                    }
                })
            })
            this.removeRepeat(resultList, this.dataKey)
            this.resultList = resultList
            this.$emit('on-success', this.checkResult, resultList)
        },
        closeItem(item){ // 关闭展示框内的元素
            let checkResult = [...this.checkResult] // 拷贝最终结果数组
            checkResult.forEach((v, k) => {
                if(v === item[this.dataKey]) checkResult.splice(k, 1) // 如果在结果数据内找到点击的元素，删除它
            })
            this.resultList.forEach((element, index) =>{
                if(element[this.dataKey] === item[this.dataKey]) this.resultList.splice(index, 1) // 如果在展示框内找到点击的元素，删除它
            })
            this.checkResult = checkResult
            this.$emit('on-success', this.checkResult)
        },
        removeRepeat(arr, key){ // 数组去重
            for(let i = 0; i < arr.length; i++) {
                for(let j = i+1; j < arr.length; j++) {
                    if(arr[i][key] === arr[j][key]){
                        arr.splice(j, 1);
                        j = j-1;  // 关键，因为splice()删除元素之后，会使得数组长度减小，此时如果没有j=j-1的话，会导致相同id项在重复两次以上之后无法进行去重，且会错误删除id没有重复的项。
                    }
                }
            }
        }
    }
}
</script>
<style lang="less" scoped>
.multiselect{
    display: flex;
    align-items: center;
    .titlefont{
        width: 50px;
        margin-right: 20px;
    }
}
.select_top{
    border: 1px solid #e8eaec;
    border-radius: 5px;
    color: #515a6e;
    position: relative;
    display: flex;
    justify-content: space-between;
    padding-right: 24px;
    &:hover{
        cursor:pointer;
        border-color:#57a3f3;
    }
    .select_icon{
        position: absolute;
        top: 35%;
        right: 8px;
    }
    .icon_active{
        transform: rotate(180deg);
        transition: all .2s ease-in-out;
    }
    ul {
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        padding: 1px;
        li{
            height: 24px;
            line-height: 22px;
            padding: 0 8px;
            margin: 3px 4px 3px 0;
            border: 1px solid #e8eaec;
            margin: 2px;
            background: #f7f7f7;
            border-radius: 3px;
            white-space: nowrap;
            .icon_span{
                display: inline-block;
                height: 24px;
                margin-left: 2px;
            }
        }
    }
}
.border_color{
    border-color:#57a3f3;
}
.ivu-dropdown-item{
    padding: 0;
}
.ivu-checkbox-group-item{
    padding: 7px 16px;
    margin: 0;
    width: 100%;
}
.ivu-dropdown{
    /deep/ .ivu-select-dropdown{
        top: auto !important;
    }
}
/deep/ .ivu-scroll-container{
    overflow-y: auto;
    height: auto !important;
    max-height: 300px;
}
</style>
