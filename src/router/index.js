import { createRouter, createWebHistory } from 'vue-router'
import { mdiCalendarToday, mdiCalendarRange } from '@mdi/js'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'today',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        icon: mdiCalendarToday,
        title: 'Today',
      },
    },
    {
      path: '/upcoming',
      name: 'upcoming',
      component: () => import('@/views/UpcomingView.vue'),
      meta: {
        icon: mdiCalendarRange,
        title: 'Upcoming',
      },
    },
  ],
})
