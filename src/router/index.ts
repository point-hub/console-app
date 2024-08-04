import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized
} from 'vue-router'

import axios from '@/axios'
import OrganizationRoutes from '@/pages/organizations/routes'
import ProjectRoutes from '@/pages/projects/routes'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/signup',
      component: () => import('../layouts/auth.vue'),
      children: [
        {
          path: '',
          component: () => import('@/pages/signup/index.vue')
        }
      ]
    },
    {
      path: '/',
      component: () => import('../layouts/app.vue'),
      children: [
        {
          path: '',
          redirect: '/menu',
          meta: { requiresAuth: true }
        },
        {
          path: 'home',
          component: () => import('@/pages/home/index.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'menu',
          component: () => import('@/pages/menu/index.vue'),
          meta: { requiresAuth: true }
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
const getProjectId = (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  const authStore = useAuthStore()
  // pass project_id from previous to the next route
  if (from.query.project_id && !to.query.project_id) {
    return from.query.project_id
  }
  // pass project_id from memory to the next route
  else if (!to.query.project_id && authStore.projectId) {
    return authStore.projectId
  }

  return
}

const isAuthenticated = async () => {
  try {
    const response = await axios.post('/v1/auth/verify-token')
    console.log(response.data)
    // signin success and store user data into memory
    const authStore = useAuthStore()
    authStore.update({
      name: response.data.name,
      projectId: response.data.project._id
    })
    return true
  } catch (error) {
    return false
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  authStore.update({ projectId: from.query.project_id as string })
  // 1. check if client is authenticated
  if (to.meta.requiresAuth && !(await isAuthenticated())) {
    // err 1. redirect to signin page if not authenticated
    // window.location.href = `http://localhost:4111?${new URLSearchParams(to.query as any).toString()}`
  }

  const projectId = getProjectId(to, from)

  if (projectId) {
    to.query.project_id = projectId
    next(to)
  } else {
    next()
  }
})

export default router
