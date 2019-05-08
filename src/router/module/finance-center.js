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
    }
  ]
}