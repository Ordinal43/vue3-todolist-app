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
      <v-date-picker
        :model-value="props.modelValue"
        @update:model-value="setTaskDate"
        :min="minDate"
        hide-header
      ></v-date-picker>

      <v-divider></v-divider>
      <div class="pa-3">
        <v-btn-group divided variant="outlined" density="compact">
          <v-btn :prepend-icon="mdiClock">
            {{ time ?? 'Time' }}
            <v-menu
              activator="parent"
              v-model="menuTimePicker"
              :close-on-content-click="false"
            >
              <v-time-picker
                :model-value="time"
                @update:model-value="setTaskTime"
                format="24hr"
                color="primary"
              ></v-time-picker>
            </v-menu>
          </v-btn>
          <v-btn
            v-if="time"
            @click="setTaskTime(null)"
            :icon="mdiClose"
          ></v-btn>
        </v-btn-group>
      </div>
    </v-card>
  </v-menu>
</template>

<script setup>
import { VTimePicker } from 'vuetify/labs/VTimePicker'
import { mdiClock, mdiClose } from '@mdi/js'
import { useDatePicker } from '@/composables/useDatePicker'
import { useTimePicker } from '@/composables/useTimePicker'
import { watch } from 'vue'
import { useDateTimeFormatter } from '@/composables/useDateTimeFormatter'

const { minDate, menuDatePicker } = useDatePicker()
const { menuTimePicker, time } = useTimePicker()
const { formatTime } = useDateTimeFormatter()

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

watch(menuDatePicker, (newValue) => {
  const dateObj = props.modelValue
  if (
    newValue === true &&
    dateObj.getHours() !== 0 &&
    dateObj.getMinutes() !== 0
  ) {
    time.value = formatTime(dateObj)
  }
})

const setTaskTime = (event) => {
  time.value = event
  const newDate = new Date(props.modelValue)

  emitDate(newDate)
  menuTimePicker.value = false
}

const setTaskDate = (event) => {
  const newDate = event

  emitDate(newDate)
  menuTimePicker.value = false
  menuDatePicker.value = false
}

const emitDate = (newDate) => {
  if (time.value !== null) {
    newDate.setHours(...time.value.split(':'))
  } else {
    newDate.setHours(0, 0)
  }
  emit('update:modelValue', newDate)
}
</script>
