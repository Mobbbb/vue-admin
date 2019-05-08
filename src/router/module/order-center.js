import Main from '@/components/main'

export default {
  path: '/order',
  name: 'order',
  component: Main,
  meta: {
    icon: 'md-list-box',
    title: '订单管理',
    showAlways: true
  },
  children: [
    {
      path: 'order-info',
      name: 'order-info',
      meta: {
        title: '订单信息'
      },
      component: () => import('@/view/single-page/order-moules/order-info/index.vue')
    },
    {
      path: 'order-detail/:id',
      name: 'order-detail',
      meta: {
        title: '订单详情',
        hideInMenu: true,
        parentName: 'order-info'
      },
      component: () => import('@/view/single-page/order-moules/order-info/detail.vue')
    }
  ]
}