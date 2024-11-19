<template>
  <v-app>
    <v-layout class="rounded rounded-md">
      <v-navigation-drawer v-model="showDrawer">
        <SideMenu />
      </v-navigation-drawer>

      <v-app-bar title="Application bar">
        <template v-if="mobile" v-slot:prepend>
          <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
        </template>
      </v-app-bar>

      <v-main
        class="d-flex align-center justify-center"
        style="min-height: 300px"
      >
        <RouterView />
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { RouterView } from 'vue-router'
import SideMenu from '@/components/SideMenu.vue'
import { useDisplay } from 'vuetify'

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
</script>
