<template>
    <div class="container_box">
         <div class="detail">
             <div class="detail_item">
                <span>Push标题 :</span>
                <span class="item_content">{{theInfo.title}}</span>
             </div>
             <div class="detail_item">
                <span>Push副标题 :</span>
                <span class="item_content"> {{theInfo.subTitle}}</span>
             </div>
             <div class="detail_item">
                <span>发送对象 :</span>
                <span class="item_content" v-if="theInfo.pushRole==1"> 司机</span>
                <span class="item_content" v-if="theInfo.pushRole==2"> 乘客</span>
             </div>
             <div class="detail_item">
                <span>发送范围 :</span>
                <span class="item_content" v-if="theInfo.target==1 && theInfo.pushRole==1">  指定司机</span>
                <span class="item_content" v-if="theInfo.target==1 && theInfo.pushRole==2">  指定乘客</span>
                <span class="item_content" v-if="theInfo.target==2"> 指定条件</span>
                <span class="item_content" v-if="theInfo.target==3"> 批量</span>
             </div>
             <div class="detail_item">
                <span style="padding-left: 73px;"></span>
                <span v-if="theInfo.target==1">手机号
                    <span v-for="(item, index) in theInfo.mobile" :key="index"> {{item}}</span>
                </span>
                <span v-if="theInfo.target==2">
                    <span v-for="(item, index) in theInfo.operatorName" :key="index"> {{item}}</span>
                </span>
                <span v-if="theInfo.cityName">
                    <span v-for="(item, index) in theInfo.cityName" :key="index"> {{item}}</span>
                </span>
                <span class="item_content">{{theInfo.pushRangeDetail}}</span>
                <span v-if="theInfo.target==3"> <a @click="exportList">导出批量列表</a></span>
             </div>

             <div class="detail_item">
                <span>跳转链接 :</span>
                <span class="item_content">{{theInfo.pushLink}}</span>
             </div>
             <div class="detail_item">
                <span>发送时间 :</span>
                 <span class="item_content">{{theInfo.pushTime}}</span>
             </div>
             <div class="detail_item" v-if="theInfo.giveUpOn">
                <span>放弃时间 :</span>
                 <span class="item_content">{{theInfo.giveUpOn}}</span>
             </div>
         </div>
    </div>
</template>

<script>
export default {
    props: {
        theInfo: {
            type: Object,
            default:() =>{
                return {}
            }
        }
    },
    data(){
        return {
        }
    },
    methods:{
        exportList(){
            let url = this.theInfo.uploadFileUrl
            window.location.href = url
        }
    }
}
</script>

<style lang="less" scoped>
.container_box{
    width: 520px;
    .detail{
        padding: 0 50px;
        box-sizing: border-box;
        .detail_item{
            padding-top: 15px;
            .item_content{
                padding-left: 15px
            }
        }
    }
}
</style>

