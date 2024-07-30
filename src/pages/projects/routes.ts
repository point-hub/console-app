export default {
  path: '/projects',
  component: () => import('@/layouts/app.vue'),
  children: [
    {
      path: '',
      component: () => import('@/pages/projects/list/index.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: 'create',
      component: () => import('@/pages/projects/create/index.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: ':id',
      component: () => import('@/pages/projects/detail/index.vue'),
      meta: { requiresAuth: true }
    }
  ]
}
