<template>
  <component :is="getComponent" v-bind="getComponentProps">
    <v-card v-show="showForm" :variant="getVariant" rounded>
      <v-form
        ref="form-task"
        v-model="isFormValid"
        @submit.prevent="submitForm"
      >
        <v-card-text>
          <v-text-field
            ref="input-task-name"
            v-model="form.taskName.val"
            :rules="form.taskName.rules"
            :placeholder="form.taskName.label"
            single-line
            hide-details
            density="compact"
            variant="plain"
          ></v-text-field>

          <v-textarea
            v-model="form.taskDesc.val"
            :rules="form.taskDesc.rules"
            :placeholder="form.taskDesc.label"
            single-line
            hide-details
            no-resize
            auto-grow
            rows="1"
            density="compact"
            variant="plain"
          ></v-textarea>

          <div class="mt-5 d-flex ga-2">
            <DateTimePicker
              v-model:date="form.taskDate.val"
              v-model:time="form.taskTime.val"
            >
              <template #activator="{ props }">
                <v-btn
                  :prepend-icon="mdiCalendar"
                  variant="outlined"
                  size="small"
                  v-bind="props"
                >
                  {{ formatDate(form.taskDate.val) }}
                  {{ formatTime(form.taskTime.val) }}
                </v-btn>
              </template>
            </DateTimePicker>

            <PriorityPicker v-model="form.taskPriority.val">
              <template #activator="{ props }">
                <v-btn
                  :prepend-icon="mdiFlag"
                  :color="getPriorityColor(form.taskPriority.val)"
                  variant="outlined"
                  size="small"
                  v-bind="props"
                >
                  {{
                    form.taskPriority.val < 4
                      ? `P${form.taskPriority.val}`
                      : 'Priority'
                  }}
                </v-btn>
              </template>
            </PriorityPicker>
          </div>
        </v-card-text>

        <v-divider></v-divider>

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
    Task added!

    <template #actions>
      <v-btn :icon="mdiClose" variant="text" @click="closeSnackbar" />
    </template>
  </v-snackbar>
</template>

<script setup>
import { computed, inject, nextTick, ref, watchEffect } from 'vue'
import { VDialog } from 'vuetify/components/VDialog'
import { mdiCalendar, mdiClose, mdiFlag } from '@mdi/js'
import { useTaskStore } from '@/stores/useTaskStore'
import { useDetailStore } from '@/stores/useDetailStore'
import { useStateTaskPriority } from '@/composables/states/useStateTaskPriority'
import { useStateFormInputs } from '@/composables/states/useStateFormInputs'
import { useMethodDateFormatter } from '@/composables/methods/useMethodDateFormatter'
import DateTimePicker from './DateTimePicker.vue'
import PriorityPicker from './PriorityPicker.vue'

const taskStore = useTaskStore()
const detailStore = useDetailStore()
const { getPriorityColor } = useStateTaskPriority()
const { form, isFormValid, formRef, inputTaskNameRef, resetForm } =
  useStateFormInputs()
const { formatDate, formatTime } = useMethodDateFormatter()

// dialog logic
const showForm = defineModel()
const closeForm = () => {
  showForm.value = false
}

// component logic
const props = defineProps({
  variant: String,
})
const VARIANT_DIALOG = 'dialog'

const getComponent = computed(() => {
  switch (props.variant) {
    case VARIANT_DIALOG:
      return VDialog
    default:
      return 'div'
  }
})

const getComponentProps = computed(() => {
  switch (props.variant) {
    case VARIANT_DIALOG:
      return {
        modelValue: showForm.value,
        'onUpdate:modelValue': (event) => (showForm.value = event),
        maxWidth: '600',
      }
    default:
      return {}
  }
})

const getVariant = computed(() => {
  switch (props.variant) {
    case VARIANT_DIALOG:
      return 'flat'
    default:
      return 'outlined'
  }
})

// form logic
watchEffect(async () => {
  if (showForm.value === true) {
    resetForm()
    await nextTick()
    formRef.value.reset()
    inputTaskNameRef.value.focus()
  }
})

const isSubtaskForm = inject('isSubtaskForm', false)

const submitForm = () => {
  if (isFormValid.value === true) {
    const { taskName, taskDesc, taskDate, taskTime, taskPriority } = form.value
    const parentKey = isSubtaskForm ? detailStore.activeKey : null
    const parentLevel = taskStore.tasks.get(parentKey)?.level ?? 0

    taskStore.addNewTask(parentKey, parentLevel, {
      name: taskName.val,
      desc: taskDesc.val,
      date: taskDate.val,
      time: taskTime.val,
      priority: taskPriority.val,
    })
    closeForm()
    snackbar.value = true
  }
}

// snackbar logic
const snackbar = ref(false)
const closeSnackbar = () => {
  snackbar.value = false
}
</script>
