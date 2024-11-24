import { createRouter, createWebHistory } from 'vue-router'
import { mdiCalendarToday, mdiCalendarRange, mdiCalendarCheck } from '@mdi/js'
import {
  ROUTE_NAME_TODAY,
  ROUTE_NAME_UPCOMING,
  ROUTE_NAME_FINISHED,
} from '@/constants'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: ROUTE_NAME_TODAY,
      component: () => import('@/views/HomeView.vue'),
      meta: {
        icon: mdiCalendarToday,
        title: "Today's tasks",
      },
    },
    {
      path: '/upcoming',
      name: ROUTE_NAME_UPCOMING,
      component: () => import('@/views/UpcomingView.vue'),
      meta: {
        icon: mdiCalendarRange,
        title: 'Upcoming tasks',
      },
    },
    {
      path: '/finished',
      name: ROUTE_NAME_FINISHED,
      component: () => import('@/views/CompletedView.vue'),
      meta: {
        icon: mdiCalendarCheck,
        title: 'Finished tasks',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})
