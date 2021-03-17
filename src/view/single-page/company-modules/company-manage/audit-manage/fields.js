/** 审核状态 */
const auditStatus = {
    1: '待审核',
    2: '审核通过',
    3: '审核不通过'
}

export const tableTitle = [{
        title: '企业名称',
        key: 'fullName',
        align: 'center',
        width: '300'
    },
    {
        title: '联系人',
        key: 'contactName',
        align: 'center'
    },
    {
        title: '联系电话',
        key: 'contactPhone',
        align: 'center'
    },
    {
        title: '统一社会信用代码',
        key: 'identifier',
        align: 'center',
        render (h, params) {
            return h('div', params.row.identifier || '暂无')
        }
    },
    {
        title: '申请时间',
        key: 'applyTime',
        align: 'center'
    },
    {
        title: '审核状态',
        key: 'status',
        align: 'center',
        render: (h, params) => {
            // 状态 1待审核;2审核通过;3拒绝;
            let statusMap = {
                1: '待审核',
                2: '审核通过',
                3: '审核不通过'
            }
            return h('div', statusMap[params.row.status])
        }
    }
]

export const pageData = {
    total: 1,
    current: 1,
    pageSize: 10,
    tableColumns: [],
    tableData: [],
    isLoading: false,
    isShowDetail: false,
    isShowModal: false,
    searchParams: {}
}

export const detailData = [
    {
        title: '企业名称',
        keytitle: 'fullName',
        value: ''
    },
    // {
    //     title: '成立日期',
    //     keytitle: 'noshow',
    //     value: ''
    // },
    {
        title: '联系人',
        keytitle: 'contactName',
        value: ''
    },
    {
        title: '联系人电话',
        keytitle: 'contactPhone',
        value: ''
    },
    {
        title: '统一社会信用代码 ',
        keytitle: 'identifier',
        value: '暂无'
    },
    // {
    //     title: '营业执照',
    //     keytitle: 'businesslicense',
    //     value: '点击下载',
    //     isLoad: true
    // },
    // {
    //     title: '申请用车分类',
    //     keytitle: 'noshow',
    //     value: ''
    // },
    // {
    //     title: '用车员工规模',
    //     keytitle: 'noshow',
    //     value: ''
    // },
    // {
    //     title: '预计年用车量',
    //     keytitle: 'noshow',
    //     value: ''
    // },
]

export const inputList = [
    {
        name: 'text-input',
        bind_key: 'fullName',
        placeholder: '请输入',
        value: '',
        title: '企业名称：',
        titleWidth: 75,
        inputWidth: 200,
        key: "6",
        isHide: false
    }, 
    {
        name: 'text-input',
        bind_key: 'identifier',
        placeholder: '请输入',
        value: '',
        title: '统一社会信用代码：',
        titleWidth: 125,
        inputWidth: 200,
    },
    {
        name: 'drop-input',
        bind_key: 'status', // 返回数据的key名
        placeholder: '请选择',
        value: '',
        titleWidth: 75,
        title: '审核状态：',
        dropList: [{
                value: 1,
                label: '待审核'
            },
            {
                value: 2,
                label: '审核通过'
            },
            {
                value: 3,
                label: '审核不通过'
            }
        ],
        inputWidth: 200,
    },
]