<template>
  <v-app>
    <v-layout class="rounded rounded-md">
      <v-navigation-drawer v-model="showDrawer">
        <SideNav />
      </v-navigation-drawer>

      <v-app-bar>
        <template v-if="mobile" #prepend>
          <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
        </template>
        <v-app-bar-title>{{ route.meta.title }}</v-app-bar-title>
      </v-app-bar>

      <v-main>
        <v-container max-width="700">
          <RouterView />
        </v-container>
      </v-main>
    </v-layout>

    <TaskDetail />
  </v-app>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import SideNav from '@/components/SideNav.vue'
import TaskDetail from './components/TaskDetail.vue'

const route = useRoute()
const { mobile } = useDisplay()

// nav drawer logic
const showDrawer = ref(false)
const toggleDrawer = () => {
  showDrawer.value = !showDrawer.value
}

watchEffect(() => {
  if (!mobile.value) {
    showDrawer.value = true
  }
})
</script>
