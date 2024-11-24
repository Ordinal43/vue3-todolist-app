<template>
  <v-dialog
    :model-value="showTaskDetail"
    @update:model-value="closeForm"
    maxWidth="800"
  >
    <v-card v-if="getTaskDetails">
      <v-card-title class="d-flex mt-2 align-center">
        <template v-if="getParentTask !== null">
          <v-btn-group density="compact" variant="outlined" divided>
            <v-btn
              @click="openTaskDetail(getTaskDetails.parentKey)"
              size="x-small"
            >
              {{ getParentTask.name }}
            </v-btn>
            <v-menu
              v-model="menuSiblingTask"
              :close-on-content-click="false"
              location="bottom"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  :prepend-icon="mdiFileTree"
                  :append-icon="mdiChevronRight"
                  size="x-small"
                  v-bind="props"
                >
                  {{ getSiblingTasks.length }}
                </v-btn>
              </template>

              <v-list rounded variant="tonal">
                <v-list-item
                  v-for="(item, i) in getSiblingTasks"
                  :key="`sibling-${i}`"
                  @click="openTaskDetail(item.key)"
                >
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                  <template #append>
                    <v-icon
                      v-if="item.key === getTaskDetails.key"
                      :icon="mdiCheck"
                    ></v-icon>
                  </template>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-btn-group>
        </template>
        <v-spacer></v-spacer>
        <v-btn
          @click="closeForm"
          :icon="mdiClose"
          density="compact"
          variant="text"
        >
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12" md="9">
            <v-form
              v-if="showEditForm"
              ref="form-task"
              v-model="isFormValid"
              validate-on="lazy"
              @submit.prevent=""
            >
              <v-text-field
                ref="input-task-name"
                v-model="form.taskName.val"
                :rules="form.taskName.rules"
                :label="form.taskName.label"
                single-line
                variant="outlined"
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
              ></v-textarea>
            </v-form>
            <div v-else>
              <h4>{{ getTaskDetails.name }}</h4>
              <v-divider class="my-2"></v-divider>
              <p v-if="getTaskDetails.desc">{{ getTaskDetails.desc }}</p>
              <p v-else class="text-grey">No Description...</p>
            </div>
            <div class="my-5"></div>
            <TaskList
              v-if="getTaskDetails.level < 5"
              :tasks="getSubtasks"
              has-action
            >
              <template #header> Subtask </template>
            </TaskList>
          </v-col>
          <v-col cols="12" md="3" class="d-flex flex-column align-end">
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
                  size="small"
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
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="justify-start">
        <v-btn v-if="!showEditForm" color="primary" @click="openEditForm">
          Edit
        </v-btn>
        <template v-else>
          <v-btn variant="text" @click="closeEditForm">Cancel</v-btn>
          <v-btn color="primary" @click="submitForm">Save</v-btn>
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-card> </v-card>
</template>

<script setup>
import {
  computed,
  nextTick,
  provide,
  ref,
  useTemplateRef,
  watchEffect,
} from 'vue'
import { useDate } from 'vuetify'
import {
  mdiCalendar,
  mdiCheck,
  mdiChevronRight,
  mdiClose,
  mdiFileTree,
} from '@mdi/js'
import { useFormRules } from '@/composables/useFormRules'
import { useTaskStore } from '@/stores/useTaskStore'
import TaskList from './TaskList.vue'

const taskStore = useTaskStore()

// dialog logic
const showTaskDetail = computed(() => {
  return taskStore.showTaskDetail
})
const closeForm = () => {
  taskStore.setShowTaskDetail(false)
}
const getTaskDetails = computed(() => {
  return taskStore.tasks.get(taskStore.activeKey)
})

// parent task logic
const getParentTask = computed(() => {
  const parentKey = getTaskDetails.value.parentKey
  if (parentKey === null) return null
  return taskStore.tasks.get(parentKey)
})
const getSiblingTasks = computed(() => {
  return taskStore.getSubtasks(getTaskDetails.value.parentKey)
})
const openTaskDetail = (key) => {
  menuSiblingTask.value = false
  taskStore.setActiveKey(key)
}

const menuSiblingTask = ref(false)

// subtasks store logic
provide('isSubtaskForm', true)
const getSubtasks = computed(() => {
  return taskStore.getSubtasks(taskStore.activeKey)
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
    val: '',
  },
})

// form logic
const inputTaskNameEl = useTemplateRef('input-task-name')
const form = ref(getInitialData())

const showEditForm = ref(false)
const openEditForm = async () => {
  showEditForm.value = true
  await nextTick()
  inputTaskNameEl.value.focus()
}
const closeEditForm = () => {
  showEditForm.value = false
  resetForm()
}

const resetForm = () => {
  const { name, desc, date } = getTaskDetails.value

  form.value.taskName.val = name
  form.value.taskDesc.val = desc
  form.value.taskDate.val = new Date(date)
}

watchEffect(() => {
  if (getTaskDetails.value) {
    resetForm()
  }
})
watchEffect(async () => {
  if (showTaskDetail.value === false) {
    await nextTick()
    showEditForm.value = false
  }
})

const isFormValid = ref()
const submitForm = () => {
  if (isFormValid.value === true) {
    const { taskName, taskDesc } = form.value
    taskStore.updateTaskValue(taskStore.activeKey, {
      name: taskName.val,
      desc: taskDesc.val,
    })
    closeEditForm()
  }
}

// date-picker logic
const dateAdapter = useDate()
const currentDate = new Date()
currentDate.setHours(0, 0, 0, 0)
const minDate = ref(currentDate)

const menuDatePicker = ref(false)
const formattedDate = computed(() =>
  dateAdapter.format(getTaskDetails.value.date, 'normalDateWithWeekday'),
)
const setTaskDate = (event) => {
  taskStore.updateTaskDate(taskStore.activeKey, event)
  menuDatePicker.value = false
}
</script>
