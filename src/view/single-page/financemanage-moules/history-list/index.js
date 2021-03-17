export const billName = {
  0:'银联日对账',
  1:'支付宝日对账',
  2:'微信支付日对账',
  3:'网通日对账'
}

export const stateType = {
  1:'平账',
  2:'平台长款',
  3:'平台短款',
}

export const operationType = {
  0:'未处理',
  1:'已处理',
}

export const returnFields = (that) => {
  return {
    total: 0,
    currPage: 1,
    pageSize: 20,
    columns: {
      reconciliationDate: {
        title: '账单日',
        key: 'reconciliationDate',
        align:"center",
        width: 110,
        fixed: 'left'
      },
      channelBillName: {
        title: '渠道账单',
        key: 'channelBillName',
        ellipsis: true,
        align:"center",
        minWidth: 170,
        render:(h, params) => {
          return h('a',{
            domProps: {
              textContent: params.row.channelBillName
            },
            on: {
              click: () => {
                console.log("打开链接");
                window.open(params.row.channelBillAddr);
              }
            }
          })
        }
      },
      platformBillName: {
        title: '平台账单',
        key: 'platformBillName',
        ellipsis: true,
        align:"center",
        minWidth: 170,
        render:(h, params) => {
          return h('a',{
            domProps: {
              textContent: params.row.platformBillName
            },
            on: {
              click: () => {
                console.log("打开链接");
                window.open(params.row.platformBillAddr);
              }
            }
          })
        }
      },
      reconciliationStatus: {
        title: '对账结果',
        key: 'reconciliationStatus',
        align:"center",
        minWidth: 100,
        render:(h, params) => {
          return h('span',{
            domProps: {
              textContent: stateType[params.row.reconciliationStatus] ? stateType[params.row.reconciliationStatus] : '未开始'
            }
          })
        }
      },
      resultReportName: {
        title: '结果报告',
        key: 'resultReportName',
        ellipsis: true,
        align:"center",
        minWidth: 160,
        render:(h, params) => {
          return h('a',{
            domProps: {
              textContent: params.row.resultReportName
            },
            on: {
              click: () => {
                let date = params.row.reconciliationDate.replace(/-/g,"");
                that.$router.push({
                  name: 'returns',
                  query: {
                    id: params.row.channelId,
                    reconciliationDate: date
                  }
                })
              }
            }
          })
        }
      },
      processStatus: {
        title: '操作结果',
        key: 'processStatus',
        align:"center",
        minWidth: 100,
        render:(h, params) => {
          return h('span',{
            domProps: {
              textContent: operationType[params.row.processStatus] ? operationType[params.row.processStatus] : '-'
            }
          })
        }
      },
      action: {
        title: '操作',
        key: 'action',
        align:"center",
        minWidth: 120,
        render:(h, params) => {
          return h('div', [
            h('a',{
              style: {
                marginRight: '15px',
                display:Number(params.row.processStatus) === 1 ? 'none' : 'inline-block'
              },
              on: {
                click: () => {
                  let data = {
                    uuid: params.row.uuid,
                    processStatus: 1
                  }
                  that.processed(data);
                }
              }
            },'处理'),
            h('a',{
              on: {
                click: () => {
                  let isModify = Number(params.row.processStatus) === 1 ?  false : true; // 已处理过备忘不能修改
                  that.memo = params.row.memo ? params.row.memo : '';
                  that.uuid = params.row.uuid;
                  that.memoAddr = params.row.memoAddr !='' ? JSON.parse(params.row.memoAddr) : [];
                  that.Memo(isModify);
                }
              }
            },'备忘')
          ])
        }
      },
    }
  }
}
