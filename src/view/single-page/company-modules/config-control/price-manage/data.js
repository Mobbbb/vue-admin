export const pagedata = {
    inputList: [
      {
        name: 'text-input',
        bind_key: 'enteroriseName',
        placeholder: '请输入企业名称',
        value: '',
        title: '企业名称：',
        inputWidth: 200,
        titleWidth: 60,
        unicode: '1',
        isHide: false,
      }
    ],
    addModal: false,
    addForm: {
      
    },
    companyInfo:{},
    companyName: '',
    pageSize: 10,
    cityData: [],
    historyData: [],
    current: 1,
    tabValue: '1',
    total: null,
    isShowCommerceModal: false,
    isViewDetail: true,
    isShowHistoryModal: false,
    bespeakForm:{},
    addFormRule:{
        companyValue:[{required: true, message: '必填'}]
    }
}
