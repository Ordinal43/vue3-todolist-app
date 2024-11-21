<template>
  <component :is="getComponent" :style="getStyle" v-bind="getComponentProps">
    <v-card>
      <v-form
        ref="form-task"
        v-model="isFormValid"
        validate-on="lazy"
        @submit.prevent="submitForm"
      >
        <v-card-text>
          <v-text-field
            ref="input-task-name"
            v-model="form.taskName.val"
            :rules="form.taskName.rules"
            :label="form.taskName.label"
            single-line
            variant="outlined"
            class="my-2"
          ></v-text-field>

          <v-textarea
            v-model="form.taskDesc.val"
            :rules="form.taskDesc.rules"
            :label="form.taskDesc.label"
            single-line
            no-resize
            auto-grow
            rows="1"
            variant="outlined"
            class="my-2"
          ></v-textarea>

          <v-menu
            v-model="menuDatePicker"
            :close-on-content-click="false"
            location="bottom"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                :prepend-icon="mdiCalendar"
                color="primary"
                variant="outlined"
                v-bind="props"
              >
                {{ formattedDate }}
              </v-btn>
            </template>

            <v-date-picker
              :model-value="form.taskDate.val"
              @update:model-value="setTaskDate"
              :min="minDate"
              hide-header
            ></v-date-picker>
          </v-menu>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeForm" text>Cancel</v-btn>
          <v-btn type="submit" color="primary" :disabled="isFormValid !== true">
            Add Task
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </component>

  <v-snackbar v-model="snackbar">
    Task added to inbox!

    <template v-slot:actions>
      <v-btn :icon="mdiClose" variant="text" @click="closeSnackbar" />
    </template>
  </v-snackbar>
</template>

<script setup>
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'
import { useDate } from 'vuetify'
import { mdiCalendar, mdiClose } from '@mdi/js'
import { useFormRules } from '@/composables/useFormRules'
import { useTaskStore } from '@/stores/useTaskStore'
import { VDialog } from 'vuetify/components/VDialog'

const dateAdapter = useDate()

// dialog logic
const show = defineModel()
const closeForm = () => {
  show.value = false
}

// component logic
const { variant } = defineProps({
  variant: String,
})
const VARIANT_DIALOG = 'dialog'

const getComponent = computed(() => {
  switch (variant) {
    case VARIANT_DIALOG:
      return VDialog
    default:
      return 'div'
  }
})
const getStyle = computed(() => {
  switch (variant) {
    case VARIANT_DIALOG:
      return null
    default:
      return { display: show.value ? '' : 'none' }
  }
})
const getComponentProps = computed(() => {
  switch (variant) {
    case VARIANT_DIALOG:
      return {
        modelValue: show.value,
        'onUpdate:modelValue': (value) => (show.value = value),
        maxWidth: '600',
      }
    default:
      return {}
  }
})

// date-picker logic
const menuDatePicker = ref(false)
const formattedDate = computed(() =>
  dateAdapter.format(form.value.taskDate.val, 'normalDateWithWeekday'),
)
const setTaskDate = (event) => {
  form.value.taskDate.val = event
  menuDatePicker.value = false
}

// input logic
const { ruleRequired, ruleMaxLen } = useFormRules()

const currentDate = new Date()
currentDate.setHours(0, 0, 0, 0)

const minDate = ref(currentDate)

const getInitialData = () => ({
  taskName: {
    val: '',
    label: 'Task Name',
    rules: [ruleRequired, (value) => ruleMaxLen(value, 150)],
  },
  taskDesc: {
    val: '',
    label: 'Task Description',
    rules: [(value) => ruleMaxLen(value, 300)],
  },
  taskDate: {
    val: currentDate,
  },
})

const form = ref(getInitialData())

// form logic
const formEl = useTemplateRef('form-task')
const inputTaskNameEl = useTemplateRef('input-task-name')
watch(show, async (newValue) => {
  if (newValue === false) {
    // reset form and its values
    form.value = getInitialData()
    formEl.value.reset()
  } else {
    await nextTick()
    inputTaskNameEl.value.focus()
  }
})

const isFormValid = ref()
const taskStore = useTaskStore()
const submitForm = () => {
  if (isFormValid.value === true) {
    const { taskName, taskDesc, taskDate } = form.value
    taskStore.addNewTask(taskName.val, taskDesc.val, taskDate.val)
    closeForm()
    if (dateAdapter.isAfterDay(new Date(taskDate.val), new Date())) {
      snackbar.value = true
    }
  }
}

// snackbar logic
const snackbar = ref(false)
const closeSnackbar = () => {
  snackbar.value = false
}
</script>
