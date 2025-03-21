import { createRouter, createWebHistory } from 'vue-router'
import BasicLayout from '@/layouts/BasicLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: BasicLayout,
      redirect: '/discover',
      children: [
        {
          path: 'discover',
          name: 'Discover',
          component: () => import('@/views/Discover.vue')
        },
        {
          path: 'notifications',
          name: 'Notifications',
          component: () => import('@/views/Notifications.vue')
        },
        {
          path: 'user/profile',
          name: 'Profile',
          component: () => import('@/views/Profile.vue')
        },
        {
          path: 'search',
          name: 'Search',
          component: () => import('@/views/SearchResult.vue')
        }
      ]
    }
  ]
})

export default router
