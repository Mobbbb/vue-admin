<template>
    <div>
        <Table
            border
            stripe
            highlight-row
            ref="vtable"
            v-if="!getLoadingFlag"
            :width="width"
            :height="height"
            :columns="parColumns"
            :data="parTableData"
            :no-data-text="nodatatext"
            @on-sort-change="sortChange"
            @on-selection-change="onSelect"
            @on-row-click="onRowClick">
            >
            <template slot-scope="params" :slot="item.slot" v-for="item in parColumns">
                <slot :name="item.slot" :data="params"></slot>
            </template>
        </Table>
        <div v-else :style="{ height: height + 'px'}" class="table-spin-wrap">
            <Spin fix>
                <Icon type="ios-loading" size=20 class="table-spin-icon-load"></Icon>
                <div style="margin-top: 5px;">加载中...</div>
            </Spin>
        </div>
        <div style="margin: 10px; padding: 10px; overflow: hidden" v-if='isShowPage'>
            <div style="float: right;">
                <Page
                    show-total
                    show-elevator
                    :show-sizer='isShowSizer'
                    :total="total"
                    :current="current"
                    :page-size="pageSize"
                    :page-size-opts="pageSizeOpts"
                    @on-change="changePage"
                    @on-page-size-change="changePageSize">
                </Page>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'VTable',
    props: {
        total: Number,
        current: Number,
        pageSize: Number,
        isLoading: Boolean,
        pageSizeOpts: Array,
        isShowSizer: {
            type: Boolean,
            default: true
        },
        isShowLoading: {
            type: Boolean,
            default: true
        },
        isShowPage: {
            type: Boolean,
            default: true
        },
        width: {
            type: Number,
            default: 0
        },
        height: {
            type: Number,
            default: 666
        },
        parColumns: Array,
        parTableData: Array,
        nodatatext: {
            type: String,
            default: '暂无数据'
        }
    },
    computed: {
        getLoadingFlag: function(){
            return this.$store.getters.getLoadingFlag
        }
    },
    methods: {
        changePage (val) {
            this.$store.commit('changeLoadingFlag', true)
            this.$emit('changePage', val);
        },
        changePageSize(val) {
            this.$store.commit('changeLoadingFlag', true)
            this.$emit('changePageSize', val);
        },
        sortChange (obj) {
            this.$emit('sortHandle', obj);
        },
        onSelect (obj) {
            this.$emit('selectHandle', obj);
        },
        onRowClick (obj) {
            this.$emit('rowClickHandle', obj);
        },
        handelSelectAll(status){
            this.$refs.vtable.selectAll(status);
        }
    }
}
</script>
<style scoped>
    .table-spin-wrap{
        position: relative;
        border: 1px solid #e8eaec;
    }
    .table-spin-icon-load{
        animation: ani-table-spin 1s linear infinite;
    }
    @keyframes ani-table-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
</style>