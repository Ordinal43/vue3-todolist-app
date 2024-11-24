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
            <v-menu
              v-model="menuDatePicker"
              :close-on-content-click="false"
              location="bottom"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  :prepend-icon="mdiCalendar"
                  variant="outlined"
                  size="small"
                  v-bind="props"
                >
                  {{ formatDate(form.taskDate.val) }}
                </v-btn>
              </template>

              <v-date-picker
                :model-value="form.taskDate.val"
                @update:model-value="setTaskDate"
                :min="minDate"
                hide-header
              ></v-date-picker>
            </v-menu>

            <v-menu
              v-model="menuPriority"
              :close-on-content-click="false"
              location="bottom"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  :prepend-icon="mdiFlag"
                  :color="getPriorityColor"
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
                  <v-list-item-title
                    >Priority {{ item.value }}</v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-menu>
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

    <template v-slot:actions>
      <v-btn :icon="mdiClose" variant="text" @click="closeSnackbar" />
    </template>
  </v-snackbar>
</template>

<script setup>
import {
  computed,
  inject,
  nextTick,
  ref,
  useTemplateRef,
  watchEffect,
} from 'vue'
import { VDialog } from 'vuetify/components/VDialog'
import { mdiCalendar, mdiClose, mdiFlag } from '@mdi/js'
import { useFormRules } from '@/composables/useFormRules'
import { useTaskStore } from '@/stores/useTaskStore'
import { useDatePicker } from '@/composables/useDatePicker'

const taskStore = useTaskStore()
const { currentDate, minDate, menuDatePicker, formatDate, setDateAndClose } =
  useDatePicker()

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
        'onUpdate:modelValue': (value) => (showForm.value = value),
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

// menu date-picker logic
const setTaskDate = (event) => {
  setDateAndClose(() => {
    form.value.taskDate.val = event
  })
}

// menu priority logic
const menuPriority = ref(false)
const priorityOptions = [
  { value: 1, color: 'red' },
  { value: 2, color: 'yellow' },
  { value: 3, color: 'blue' },
  { value: 4, color: 'grey' },
]
const setTaskPriority = (priority) => {
  form.value.taskPriority.val = priority
  menuPriority.value = false
}
const getPriorityColor = computed(() => {
  switch (form.value.taskPriority.val) {
    case 1:
      return 'red'
    case 2:
      return 'yellow'
    case 3:
      return 'blue'
    default:
      return 'grey'
  }
})

// input logic
const { ruleRequired, ruleMaxLen } = useFormRules()

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
  taskPriority: {
    val: 4,
  },
})

const form = ref(getInitialData())

// form logic
const formEl = useTemplateRef('form-task')
const inputTaskNameEl = useTemplateRef('input-task-name')

watchEffect(async () => {
  if (showForm.value === true) {
    form.value = getInitialData()
    await nextTick()
    formEl.value.reset()
    inputTaskNameEl.value.focus()
  }
})

const isFormValid = ref()
const isSubtaskForm = inject('isSubtaskForm', false)

const submitForm = () => {
  if (isFormValid.value === true) {
    const { taskName, taskDesc, taskDate, taskPriority } = form.value
    const parentKey = isSubtaskForm ? taskStore.activeKey : null
    const parentLevel = taskStore.tasks.get(parentKey)?.level ?? 0

    taskStore.addNewTask(parentKey, parentLevel, {
      name: taskName.val,
      desc: taskDesc.val,
      date: taskDate.val,
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
