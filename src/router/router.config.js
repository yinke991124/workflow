import BasicLayout from '@/App'
export const constantRouterMap = [
  {
    path: '/',
    name: 'root',
    component: BasicLayout,
    meta: {
      title: '数园智联官网'
    },
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/index'),
        meta: {
          title: '首页'
        }
      },
    ]
  }
]