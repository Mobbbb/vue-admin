export const invoicedInputList = [
    {
        name: 'text-input',
        bind_key: 'companyName',
        placeholder: '企业名称',
        value: '',
        title: '企业名称',
        titleWidth: 60,
        inputWidth: 200,
        key: 'companyName',
        isHide: false
    },
    {
        name: 'date-input',
        bind_key: 'dates',
        placeholder: '开始日期~结束日期',
        value: '',
        title: '开票日期',
        titleWidth: 60,
        inputWidth: 200,
        key: 'date',
        isHide: false
    },
  ]
export const invoicedPageData = {
    total: null,
    isShowDetailBox: false,
    current: 1,
    pageSize: 10,
    tableColumns: [],
    searchData:{},
    tableData: [],
    transportObj:{
        company: '顺丰快递',
        order: 'SF123',
        billNo: '121212'
    },
    giveObj:{
        giveTime: '2019-5-1 15:33:22',
        recipient: '张大壮',
        phone: '18557517778',
    },
    isTransport: true,
    downUrl: 'https://www.baidu.com/'
}
export const invoicedColumns = (that)=>{
    return [
        {
            title: '企业名称',
            key: 'companyName',
        },
        {
            title: '账单月份',
            key: 'billMonths',
        },
        {
            title: '账单金额',
            key: 'money',
        },
        {
            title: '开票日期',
            key: 'invoiceDate',
            render: (h, params)=>{
                let text = params.row.invoiceDate;
                let date = text ? that.$moment(params.row.invoiceDate).format('YYYY-MM-DD') : '';
                return h('span',date)
            }
        },
        {
            title: '操作',
            key:'action',
            render(h,params) {
                return h('a', {
                    on:{
                        click: ()=>{
                            let info = params.row;
                            that.viewDetail(info);
                        }
                    }
                },'查看详情')
            },
        }
    ]
}
export const applyInvoicePageData = {
    current: 1,
    pageSize: 10,
    isShowModalDetail: false,
    isShowOperateModal: false,
    total: null,
    method: '1',
    tableColumns: [],
    expressForm:{},
    transportForm:{},
    expressValue: 'sf',
    downUrl:'www.baidu.com',
    detailInfoObj:{

    },
    tableData: [
        {
            name: '阿里巴巴与四十大盗',
            bill: '烟花三月下扬州',
            money: '支付宝到账',
            date: '2025-10-05'
        }
    ],
    expressList:[]

}
export const applyColumns = (that)=>{
    return [
        {
            title: '企业名称',
            key: 'companyName',
        },
        {
            title: '账单月份',
            key: 'billMonths',
        },
        {
            title: '账单金额',
            key: 'money',
        },
        {
            title: '申请时间',
            key: 'applyTime',
            render: (h, params)=>{
                let text = params.row.applyTime;
                let date = text ? that.$moment(params.row.applyTime).format('YYYY-MM-DD') : '';
                return h('span',date)
            }
        },
        {
            title: '操作',
            key:'action',
            render(h,params) {
                return h('div', [
                    h('a', {
                        style:{
                            marginRight: '10px',
                        },
                        on:{
                            click: ()=>{
                                let info = params.row;
                                that.viewDetail(info)
                            }
                        }
                    },'申请详情'),
                    h('a', {
                        style:{
                            maginRight: '10px',
                        },
                        on:{
                            click: ()=>{
                                let info = params.row;
                                that.giveOperate(info)
                            }
                        }
                    },'送出操作')
                ])
            },
        }
    ]
}
export const invoiceTypeMap = {
    1: '电子发票',
    2: '纸质发票'
}