export const accountType = {
    1: '现金账户',
    2: '授信账户',
    3: '现金账号&授信账户'
}

export const tableTitle = [{
        title: '企业名称',
        key: 'name'
    },
    {
        title: '联系人',
        key: 'contactName'
    },
    {
        title: '联系电话',
        key: 'contactTel'
    },
    {
        title: '生效时间',
        key: 'contractEffictStart'
    },
    {
        title: '失效时间',
        key: 'contractEffictEnd'
    },
    {
        title: '账户类型',
        key: 'accountType',
        render: (h, params) => {
            return h('span', {}, accountType[params.row.accountType ])
           
        }
    },
    {
        title: '开通状态',
        key: 'status',
        render: (h, params) => {
            let text;
            if(params.row.status == '0') {
                text = '关闭'
            }else if(params.row.status == '1') {
                text = '开通'
            }else {
                text = '合同到期'
            }
            return h('span', {}, text)
           
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
}

export const inputList = [
    {
        name: 'text-input',
        bind_key: 'name',
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
        bind_key: 'orgCode',
        placeholder: '请输入',
        value: '',
        title: '统一社会信用代码：',
        titleWidth: 125,
        inputWidth: 200
    },
    {
        name: 'drop-input',
        bind_key: 'status', // 返回数据的key名
        placeholder: '请选择',
        value: '',
        titleWidth: 75,
        title: '开通状态：',
        dropList: [{
                value: '0',
                label: '关闭'
            },
            {
                value: '1',
                label: '开通'
            }
        ],
        inputWidth: 200,
    },
]