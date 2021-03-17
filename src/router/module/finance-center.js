import Main from '@/components/main'

export default {
  path: '/fsManagement',
  name: 'fsManagement',
  component: Main,
  meta: {
    icon: 'md-car',
    title: '财务结算管理',
    showAlways: true
  },
  children: [
    {
      path: 'invoice-management',
      name: 'invoice-management',
      meta: {
        title: '发票管理'
      },
      component: () => import('@/view/single-page/financemanage-moules/invoice-management/index.vue')
    },
    {
      path: 'rechargeLevel-management',
      name: 'rechargeLevel-management',
      meta: {
        title: '充值档位管理'
      },
      component: () => import('@/view/single-page/financemanage-moules/rechargeLevel-management/index.vue')
    },
    {
      path: 'payway-management',
      name: 'payway-management',
      meta: {
        title: '支付方式管理'
      },
      component: () => import('@/view/single-page/financemanage-moules/payway-management/index.vue')
    },
    {
      path: 'financial-reconciliation',
      name: 'financial-reconciliation',
      meta: {
        title: '财务日对账'
      },
      component: () => import('@/view/single-page/financemanage-moules/financial-reconciliation/index.vue')
    },
    {
      path: 'history-list/:id',
      name: 'history-list',
      meta: {
        title: '历史清单'
      },
      component: () => import('@/view/single-page/financemanage-moules/history-list/index.vue')
    },
    {
      path: 'returns',
      // path: 'returns/:id',
      name: 'returns',
      meta: {
        title: '结果报告'
      },
      component: () => import('@/view/single-page/financemanage-moules/returns/index.vue')
    }
  ]
}
