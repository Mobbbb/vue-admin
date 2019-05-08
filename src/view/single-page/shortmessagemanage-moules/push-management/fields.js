export const fields = {
    inputList: [
      {
        name: 'text-input',
        bind_key: 'title',
        placeholder: '请输入',
        value: '',
        title: 'Push标题：',
        inputWidth: 250,
        titleWidth: 80,
        unicode: '1',
        isHide: false
      },
      {
        name: 'drop-input',
        bind_key: 'pushRole',
        placeholder: '请选择',
        value: '',
        titleWidth: 80,
        dropList: [{
            value: '1',
            label: '司机'
          },
          {
            value: '2',
            label: '乘客'
          },
        ],
        title: '发送对象：',
        inputWidth: 250,
        unicode: '2',
        isHide: false
      },
      {
        name: 'drop-input',
        bind_key: 'target',
        placeholder: '请选择',
        value: '',
        titleWidth: 80,
        dropList: [{
            value: '1',
            label: '指定乘客或指定司机'
          },
          {
            value: '2',
            label: '指定条件'
          },
          {
            value: '3',
            label: '批量'
          },
          
        ],
        title: '发送范围：',
        inputWidth: 250,
        unicode: '2',
        isHide: false
      },
      {
        name: 'date-input',
        bind_key: ['pushStartTime', 'pushEndTime'],
        placeholder: '请选择',
        value: '',
        titleWidth: 80,
        title: '发送时间：',
        inputWidth: 250,
        unicode: '2',
        isHide: false
      },
      {
        name: 'date-input',
        bind_key: ['createdStartTime', 'createdEndTime'],
        placeholder: '请选择',
        value: '',
        titleWidth: 80,
        title: '添加时间：',
        inputWidth: 250,
        unicode: '2',
        isHide: false
      }
    ]
  }