const stateType = {
  0:'未开始',
  1:'平账',
  2:'平台长款',
  3:'平台短款',
}

export const returnFields = (that) => {
  return {
    total: 0,
    currPage: 1,
    pageSize: 20,
    columns: {
      indexline: {
        title: '序号',
        key: 'indexline',
        align:"center",
        width: 70,
        render:(h, params) => {
          let idx = params.index + 1;
          return h('div', idx)
        }
      },
      billName: {
        title: '任务名称',
        key: 'billName',
        align:"center",
        minWidth: 100
      },
      reconciliationDate: {
        title: '最新对账日',
        key: 'reconciliationDate',
        align:"center",
        minWidth: 100
      },
      reconciliationStatus: {
        title: '状态',
        key: 'reconciliationStatus',
        align:"center",
        minWidth: 100,
        render:(h, parmas) => {
          return h('span',{
            domProps: {
              textContent: stateType[parmas.row.reconciliationStatus]
            }
          })
        }
      },
      resultReportName: {
        title: '对账记录',
        key: 'resultReportName',
        align:"center",
        minWidth: 200,
        render:(h, params) => {
          return h('div', [
            h('a',{
              style: {
                marginRight: '15px'
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
            },params.row.resultReportName),
            h('a',{
              on: {
                click: () => {
                  console.log(params.row.channelId)
                  that.$router.push({
                    name: 'history-list',
                    params: {
                      id: params.row.channelId,
                      billName: params.row.billName
                    }
                  })
                }
              }
            },'历史清单')
          ])
        }
      },
    }
  }
}
