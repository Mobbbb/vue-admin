import router from '@/router';
function add0(m){return m<10?'0'+m:m }
function format(aa)
{
var time = new Date(aa);
var y = time.getFullYear();
var m = time.getMonth()+1;
var d = time.getDate();
var h = time.getHours();
var mm = time.getMinutes();
var s = time.getSeconds();
return y+'-'+add0(m)+'-'+add0(d);
}
const billStatus = {
    1: '已付款',
    2: '未付款'
}
// 首页--financialManage
export const tableTitle = [{
    title: '企业名称',
    key: 'companyName',
    align: "center",
},
{
    title: '当期账单月份',
    align: "center",
    key: 'billMonth'
},
{
    title: '应付款总额',
    align: "center",
    key: 'totalAmount'
},
{
    title: '付款到期日',
    align: "center",
    key: 'paymentDueDate',
    render: (h, params)=>{
        let time = params.row.paymentDueDate ? format(params.row.paymentDueDate) : '';
        return h('span', time);
    }
},
{
    title: '实际付款日',
    align: "center",
    key: 'actualPaymentDate',
    render: (h, params)=>{
        let time = params.row.actualPaymentDate ? format(params.row.actualPaymentDate) : '';
        return h('span', time);
    }
},
{
    title: '账单状态',
    key: 'billStatus',
    align: "center",
    render: (h, params) => {
        let orderStatus = params.row.billStatus;
        let billStatusMap = {
            1: '未付款',
            2: '已付款',
        }
        return h('div', billStatusMap[orderStatus])
    }
}
]
// end
// 全部账单
export const detailTableTitle = [
    {
        title: '账单月份',
        key: 'billMonth',
        id: '1'
    },
    {
        title: '应付款总额',
        key: 'totalAmount',
    },
    {
        title: '已付款总额',
        key: 'paidAmount'
    },
    {
        title: '付款到期日',
        key: 'paymentDueDate',
        render: (h, params)=>{
            let time = params.row.paymentDueDate ? format(params.row.paymentDueDate) : '';
            return h('span', time);
        }
    },
    {
        title: '实际付款日',
        key: 'actualPaymentDate',
        render: (h, params)=>{
            let time = params.row.actualPaymentDate ? format(params.row.actualPaymentDate) : '';
            return h('span', time);
        }
    },
    {
        title: '账单状态',
        key: 'billStatus',
        render: (h, params) => {
            let orderStatus = params.row.billStatus;
            let billStatusMap = {
                1: '未付款',
                2: '已付款',
            }
            return h('div', billStatusMap[orderStatus])
        }
    },
    {
        title: '发票类型',
        key: 'invoiceType',
        render(h, params) {
            let typeMap = {
                1: '电子发票',
                2: '纸质发票'
            }
            return h('div', typeMap[params.row.invoiceType])
        },
    }
]

// /financialManage/billCompanyDetail 账单明细
export const tablecolumdetail = [
    {
        title: '订单类型',
        key: 'orderType',
        align: 'center',
        id: '1'
    },
    {
        title: '订单编号',
        align: 'center',
        key: 'orderNumber',
    },
    {
        title: '业务类型',
        align: 'center',
        key: 'businessType'
    },
    {
        title: '下单时间',
        align: 'center',
        key: 'orderTime',
        render: (h, params)=>{
            let time = params.row.orderTime ? format(params.row.orderTime) : '';
            return h('span', time);
        }
    },
    {
        title: '下单人',
        align: 'center',
        key: 'orderingPerson'
    },
    {
        title: '下单人电话',
        align: 'center',
        key: 'orderingPhone'
    },
    {
        title: '乘车人姓名',
        align: 'center',
        key: 'passengerName'
    },
    {
        title: '车牌',
        align: 'center',
        key: 'plateNumber'
    },
    {
        title: '车型',
        align: 'center',
        key: 'model'
    },
    {
        title: '出发地',
        align: 'center',
        key: 'departure'
    },
    {
        title: '目的地',
        align: 'center',
        key: 'destination'
    },
    {
        title: '订单金额',
        align: 'center',
        key: 'orderAmount'
    },
    {
        title: '订单状态',
        align: 'center',
        key: 'orderStatus',
        render: (h, params) => {
            let orderStatus = params.row.orderStatus;
            let billStatusMap = {
                '0':'约车中',
                '1':'预约中',
                '2':'接乘中',
                '3':'已抵达接乘地',
                '4':'载乘中',
                '5':'已抵达目的地',
                '6':'待支付',
                '7':'待评价',
                '8':'行程结束',
                '9':'行程取消'
            }
            return h('div', billStatusMap[orderStatus])
        }
    }
]
// end
export const pageData = {
    total: 1,
    current: 1,
    pageSize: 10,
    tableColumns: [],
    tableData: [],
    isLoading: false,
    isShowDetail: false

}

export const inputList = [
    {
        name: 'drop-input',
        bind_key: 'status', // 返回数据的key名
        placeholder: '请选择',
        value: '',
        titleWidth: 75,
        title: '账单状态：',
        dropList: [{
            value: '1',
            label: '未生成'
        },
        {
            value: '2',
            label: '未付款'
        },
        {
            value: '3',
            label: '已付款'
        }
        ],
        inputWidth: 200,
    },
]