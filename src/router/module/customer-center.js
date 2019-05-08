import Main from '@/components/main'

export default {
  path: '/customer',
  name: 'customer',
  component: Main,
  meta: {
    icon: 'md-person',
    title: '乘客管理',
    showAlways: true
  },
  children: [
    {
      path: 'customer-basic',
      name: 'customer-basic',
      meta: {
        title: '乘客信息'
      },
      component: () => import('@/view/single-page/customer-moules/basic-info/index.vue')
    },
    {
      path: 'customer-detail/:id',
      name: 'customer-detail',
      meta: {
        title: '乘客详情',
        hideInMenu: true,
        parentName: 'customer-basic'
      },
      component: () => import('@/view/single-page/customer-moules/basic-info/detail.vue')
    }
  ]
}