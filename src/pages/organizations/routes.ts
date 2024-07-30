export default {
  path: '/organizations',
  component: () => import('@/layouts/app.vue'),
  children: [
    {
      path: '',
      component: () => import('@/pages/organizations/list/index.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: 'create',
      component: () => import('@/pages/organizations/create/index.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: ':id',
      component: () => import('@/pages/organizations/detail/index.vue'),
      meta: { requiresAuth: true }
    }
  ]
}
