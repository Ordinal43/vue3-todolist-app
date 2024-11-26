<template>
  <v-menu
    v-model="menuDatePicker"
    :close-on-content-click="false"
    location="right"
  >
    <template #activator="{ props }">
      <slot name="activator" :props="props"></slot>
    </template>
    <v-card>
      <v-date-picker v-model="date" :min="minDate" hide-header></v-date-picker>

      <v-divider></v-divider>
      <div class="pa-3">
        <v-btn-group divided variant="outlined" density="compact">
          <v-btn :prepend-icon="mdiClock">
            {{ time ? formatTime(time) : 'Time' }}
            <v-menu
              activator="parent"
              v-model="menuTimePicker"
              :close-on-content-click="false"
            >
              <v-time-picker
                v-model="time"
                format="24hr"
                color="primary"
              ></v-time-picker>
            </v-menu>
          </v-btn>
          <v-btn v-if="time" @click="resetTime" :icon="mdiClose"></v-btn>
        </v-btn-group>
      </div>
    </v-card>
  </v-menu>
</template>

<script setup>
import { watch } from 'vue'
import { VTimePicker } from 'vuetify/labs/VTimePicker'
import { mdiClock, mdiClose } from '@mdi/js'
import { useStateDatePicker } from '@/composables/states/useStateDatePicker'
import { useStateTimePicker } from '@/composables/states/useStateTimePicker'
import { useMethodDateFormatter } from '@/composables/methods/useMethodDateFormatter'

const { minDate, menuDatePicker } = useStateDatePicker()
const { menuTimePicker } = useStateTimePicker()
const { formatTime } = useMethodDateFormatter()

const date = defineModel('date')
const time = defineModel('time')

const resetTime = () => {
  time.value = null
}

watch(date, () => {
  menuTimePicker.value = false
  menuDatePicker.value = false
})

watch(time, () => {
  menuTimePicker.value = false
})
</script>
