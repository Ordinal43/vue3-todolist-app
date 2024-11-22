import { createRouter, createWebHistory } from 'vue-router'
import { mdiCalendarToday, mdiCalendarRange, mdiCalendarCheck } from '@mdi/js'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'today',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        icon: mdiCalendarToday,
        title: "Today's tasks",
      },
    },
    {
      path: '/upcoming',
      name: 'upcoming',
      component: () => import('@/views/UpcomingView.vue'),
      meta: {
        icon: mdiCalendarRange,
        title: 'Upcoming tasks',
      },
    },
    {
      path: '/finished',
      name: 'finished',
      component: () => import('@/views/FinishView.vue'),
      meta: {
        icon: mdiCalendarCheck,
        title: 'Finished tasks',
      },
    },
  ],
})
