import { deleteAnnounce } from '@/api/announcement.js'

export const announceStatusMap = {
  1: '待发布',
  2: '在线中',
  3: '已过期',
  4: '已撤销'
}
export const announcePositionMap = {
  1: '首页轮播',
  2: '乘客公告',
  3: '司机公告'
}
export const announceTypeMap = {
  1: '政策通知',
  2: '培训通知',
  3: '其他通知'
}

export const page = (that) => {
  let detailBtn = (h, params) => {
    return h('Button', {
      props: {
        type: "info",
        ghost: true,
        size: "small"
      },
      directives: [{
        name: 'hasAuth',
        value: 'announcement-center-detail'
      }],
      style: {
        marginRight: '15px'
      },
      on: {
        click: () => {
          that.popDetail = true
          that.detailInfo = JSON.parse(JSON.stringify(params.row))
        }
      }
    }, '详情')
  }
  let deleteBtn = (h, params) => {
    let display = 'inline-block'
    if(params.row.status === 4 || params.row.status === 3) display = 'none'
    return h('Button', {
      props: {
        type: "error",
        ghost: true,
        size: "small"
      },
      directives: [{
        name: 'hasAuth',
        value: 'announcement-center-delete'
      }],
      style: {
        display: display
      },
      on: {
        click: () => {
          that.$Modal.confirm({
            title: '提示',
            content: '<p>您确定要撤销此公告的发布吗？</p>',
            cancelText: '取消',
            onOk: () => {
              deleteAnnounce({ uuid: params.row.uuid}).then(res => {
                if(res.data.success){
                  that.$Message.success('撤销成功')
                  that.getTableList({})
                } else {
                  that.$Message.error('撤销失败')
                }
              })
            }
          })
        }
      }
    }, '撤销公告')
  }

  return {
    total: 0,
    current: 1,
    pageSize: 10,
    announceColumn: [{
        key: 'localtion',
        minWidth: 100,
        title: '公告位置',
        fixed: 'left',
        render: (h, params) => {
          return h('span', announcePositionMap[params.row.localtion])
        }
      },
      {
        key: 'noticeTitle',
        minWidth: 190,
        title: '公告标题',
        tooltip: true
      },
      {
        key: 'noticeSubTitle',
        minWidth: 200,
        title: '公告副标题',
        tooltip: true,
      },
      {
        key: 'noticeBanner',
        minWidth: 200,
        title: 'banner',
        tooltip: true
      },
      {
        key: 'noticeLink',
        minWidth: 200,
        title: '链接',
        tooltip: true,
        render: (h, params) => {
          return h('a', {
            on: {
              click: () => {
                window.open('http://' + params.row.noticeLink)
              }
            }
          }, params.row.noticeLink)
        }
      },
      {
        key: 'xxxx',
        minWidth: 300,
        title: '有效期',
        render: (h, params) => {
          return h('span', params.row.upTime + ' 至 ' + params.row.downTime)
        }
      },
      {
        key: 'createTime',
        minWidth: 160,
        title: '添加时间',
        sortable: true,
        tooltip: true
      },
      {
        key: 'status',
        title: '状态',
        minWidth: 80,
        render: (h, params) => {
          return h('span', {
            domProps: {
              textContent: announceStatusMap[params.row.status]
            }
          })
        }
      },
      {
        key: 'action',
        title: '操作',
        fixed: 'right',
        minWidth: 170,
        render: (h, params) => {
          return h('span', [detailBtn(h, params), deleteBtn(h, params)])
        }
      },
    ]
  }
}

export const inputList = [
  {
    name: 'drop-input',
    bind_key: 'localtion',
    placeholder: '请选择',
    value: '',
    dropList: [
      {
        value: '1',
        label: '首页轮播'
      },
      {
        value: '2',
        label: '乘客公告'
      },
      {
        value: '3',
        label: '司机公告'
      }
    ],
    title: '公告位置：',
    inputWidth: 250,
    titleWidth: 80,
    unicode: '1',
    isHide: false
  },
  {
    name: 'drop-input',
    bind_key: 'status',
    placeholder: '请选择',
    value: '',
    titleWidth: 50,
    dropList: [
      {
        value: '1',
        label: '待发布'
      },
      {
        value: '2',
        label: '在线中'
      },
      {
        value: '3',
        label: '已过期'
      },
      {
        value: '4',
        label: '已撤销'
      },
    ],
    title: '状态：',
    inputWidth: 250,
    unicode: '2',
    isHide: false
  },
  {
    name: 'date-time-input',
    bind_key: ['createdOnStart', 'createdOnEnd'],
    placeholder: '请选择',
    value: '',
    titleWidth: 80,
    title: '添加时间：',
    inputWidth: 250,
    unicode: '2',
    isHide: false
  },
  {
    name: 'text-input',
    bind_key: 'noticeTitle',
    placeholder: '请填写',
    value: '',
    titleWidth: 80,
    title: '公告标题：',
    inputWidth: 250,
    unicode: '2',
    isHide: false
  },
  {
    name: 'date-time-input',
    bind_key: ['upTime', 'downTime'],
    placeholder: '请选择',
    value: '',
    titleWidth: 80,
    title: '有效期：',
    inputWidth: 250,
    unicode: '2',
    isHide: false
  },
]