import VueCookie from '@point-hub/vue-cookie'
import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized
} from 'vue-router'

import OrganizationRoutes from '@/pages/organizations/routes'
import ProjectRoutes from '@/pages/projects/routes'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/app.vue'),
      children: [
        {
          path: '',
          redirect: '/menu'
        },
        {
          path: 'home',
          component: () => import('@/pages/home/index.vue')
        },
        {
          path: 'menu',
          component: () => import('@/pages/menu/index.vue')
        }
      ]
    },
    OrganizationRoutes,
    ProjectRoutes,
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/pages/404.vue')
    }
  ]
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const manageOid = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (from.query.oid && !to.query.oid) {
    to.query.oid = from.query.oid
    next(to)
  } else {
    next()
  }
}

const isAuthenticated = () => {
  // window.location.replace('http://localhost:5173/auth/signin?ref=cloud.pointhub.net')
  VueCookie.get('')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.beforeEach((to, from, next) => {
  // 1. check if client is authenticated
  isAuthenticated()
  // 2. passing organization id to the next route
  manageOid(to, from, next)
})

export default router
