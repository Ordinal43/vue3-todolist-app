import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'today',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        icon: 'mdi-calendar-today',
        title: 'Today',
      },
    },
    {
      path: '/upcoming',
      name: 'upcoming',
      component: () => import('@/views/UpcomingView.vue'),
      meta: {
        icon: 'mdi-calendar-range',
        title: 'Upcoming',
      },
    },
  ],
})

export default router
