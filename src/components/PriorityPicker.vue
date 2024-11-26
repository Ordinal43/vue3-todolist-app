<template>
  <v-menu
    v-model="menuPriority"
    :close-on-content-click="false"
    location="bottom"
  >
    <template #activator="{ props }">
      <slot name="activator" :props="props"></slot>
    </template>

    <v-list>
      <v-list-item
        v-for="(item, i) in priorityOptions"
        :key="`prio-${i}`"
        :base-color="item.color"
        @click="setTaskPriority(item.value)"
      >
        <template #prepend>
          <v-icon :icon="mdiFlag"></v-icon>
        </template>
        <v-list-item-title> Priority {{ item.value }} </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { mdiFlag } from '@mdi/js'
import { useStateTaskPriority } from '@/composables/states/useStateTaskPriority'

const { menuPriority, priorityOptions } = useStateTaskPriority()

const priority = defineModel()

const setTaskPriority = (value) => {
  priority.value = value
  menuPriority.value = false
}
</script>
