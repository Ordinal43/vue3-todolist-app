<template>
  <v-app>
    <v-layout class="rounded rounded-md">
      <v-navigation-drawer v-model="showDrawer">
        <SideMenu />
      </v-navigation-drawer>

      <v-app-bar>
        <template v-if="mobile" v-slot:prepend>
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
import SideMenu from '@/components/SideMenu.vue'
import TaskDetail from './components/TaskDetail.vue'

// nav drawer logic
const showDrawer = ref(false)
const toggleDrawer = () => {
  showDrawer.value = !showDrawer.value
}

const { mobile } = useDisplay()
watchEffect(() => {
  if (!mobile.value) {
    showDrawer.value = true
  }
})

// nav bar logic
const route = useRoute()
</script>
