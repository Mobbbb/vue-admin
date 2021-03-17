export const protocolNameMap = {
  1: '乘客用户协议',
  2: '司机用户协议'
}

export const updateRuleMap = {
  1: '强制更新'
}

/* 公共服务-会员服务-账号基本信息 */
export const returnFields = (that) => {
  return [
    {
      title: '序号',
      key: 'index',
      tooltip: true,
      width: 70,
      slot: 'index'
    },
    {
      title: '协议ID',
      key: 'uuid',
      tooltip: true,
      minWidth: 270
    },
    {
      title: '协议类型',
      key: 'protocolName',
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        return h('span', protocolNameMap[params.row.protocolName])
      }
    },
    {
      title: '更新机制',
      key: 'updateRule',
      tooltip: true,
      minWidth: 190,
      render: (h, params) => {
        return h('div', updateRuleMap[params.row.updateRule])
      }
    },
    {
      title: '协议链接',
      key: 'protocolLink',
      tooltip: true,
      minWidth: 220
    },
    {
      title: '创建时间',
      key: 'createTime',
      tooltip: true,
      minWidth: 220
    },
    {
      title: '创建人',
      key: 'creator',
      ellipsis: true,
      tooltip: true,
      minWidth: 140
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 90,
      render: (h, params) => {
        return h('div', [
          h('Button', {
            props: {
              type: "info",
              ghost: true,
              size: "small"
            },
            directives: [{
              name: 'hasAuth',
              value: 'agreement_control-detail'
            }],
            on: {
              click: () => {
                that.lookMobel = true
                that.protocolLink = params.row.protocolLink
              }
            }
          }, '详情')
        ])
      }
    }
  ]
}
