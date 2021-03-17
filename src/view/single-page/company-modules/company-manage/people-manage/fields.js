export const tableTitle = [{
        title: '企业名称',
        key: 'enterpriseName'
    },
    {
        title: '员工姓名',
        key: 'name'
    },
    {
        title: '员工手机号',
        key: 'phone'
    },
    {
        title: '员工ID',
        key: 'employeeNo'
    },
    {
        title: '所属部门',
        key: 'deptName'
    },
    {
        title: '是否内部用户',
        key: 'passenger',
        render: (h, params) => {
            let text = '是';
            if(params.row.passenger == '0') text = '否'
            
            return h('span', {}, text)
           
        }
    },
    {
        title: '当月用车次数',
        key: 'vehicleNum'
    },
    {
        title: '当月用车金额',
        key: 'usedFee'
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
    isShowModal: false

}


export const inputList = [
    {
        name: 'text-input',
        bind_key: 'enterpriseName',
        placeholder: '请输入',
        value: '',
        title: '企业名称：',
        titleWidth: 75,
        inputWidth: 200,
        key: "6",
        isHide: false
    }, {
        name: 'text-input',
        bind_key: 'name',
        placeholder: '请输入',
        value: '',
        title: '员工姓名：',
        titleWidth: 75,
        inputWidth: 200
    },
    {
        name: 'text-input',
        bind_key: 'phone',
        placeholder: '请输入',
        value: '',
        title: '员工手机号：',
        titleWidth: 85,
        inputWidth: 200
    },
    {
        name: 'text-input',
        bind_key: 'deptName',
        placeholder: '请输入',
        value: '',
        title: '所属部门：',
        titleWidth: 75,
        inputWidth: 200
    },
    {
        name: 'drop-input',
        bind_key: 'passenger', // 返回数据的key名
        placeholder: '请选择',
        value: '',
        titleWidth: 85,
        title: '是否内部用户：',
        dropList: [{
                value: '0',
                label: '否'
            },
            {
                value: '1',
                label: '是'
            }
        ],
        inputWidth: 200,
    },
]