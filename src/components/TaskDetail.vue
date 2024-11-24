<template>
  <v-dialog
    :model-value="showTaskDetail"
    @update:model-value="closeForm"
    max-width="850"
    min-height="500"
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
            <v-row no-gutters cols="12">
              <v-col cols="1">
                <v-checkbox
                  :model-value="getTaskDetails.isCompleted"
                  @update:model-value="
                    (value) => setTaskStatus(getTaskDetails.key, value)
                  "
                  :base-color="getPriorityColor(getTaskDetails.priority)"
                  :color="getPriorityColor(getTaskDetails.priority)"
                  hide-details
                ></v-checkbox>
              </v-col>
              <v-col>
                <v-form
                  v-if="showEditForm"
                  ref="form-task"
                  v-model="isFormValid"
                  @submit.prevent="submitForm"
                >
                  <v-card variant="outlined">
                    <v-card-text class="pt-0">
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
                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        variant="text"
                        size="small"
                        class="ma-1"
                        @click="closeEditForm"
                        >Cancel</v-btn
                      >
                      <v-btn
                        color="primary"
                        size="small"
                        class="ma-1"
                        type="submit"
                        >Save</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-form>
                <div
                  v-else
                  @click="getTaskDetails.isCompleted ? null : openEditForm()"
                >
                  <h4
                    :class="
                      getTaskDetails.isCompleted
                        ? { 'text-decoration-line-through': true }
                        : null
                    "
                  >
                    {{ getTaskDetails.name }}
                  </h4>
                  <template v-if="!getTaskDetails.isCompleted">
                    <v-divider class="my-3"></v-divider>
                    <p v-if="getTaskDetails.desc">{{ getTaskDetails.desc }}</p>
                    <p v-else class="text-grey">No Description...</p>
                  </template>
                </div>
              </v-col>
            </v-row>
            <div class="my-5"></div>
            <TaskList
              v-if="getTaskDetails.level < 5"
              :tasks="getSubtasks"
              has-action
            >
              <template #header> Subtask </template>
            </TaskList>
          </v-col>

          <v-col cols="12" md="3" class="px-3">
            <TaskDetailMenu>
              <template #title> Due date </template>
              <v-menu
                v-model="menuDatePicker"
                :close-on-content-click="false"
                location="bottom"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    :prepend-icon="mdiCalendar"
                    color="primary"
                    variant="text"
                    size="small"
                    block
                    v-bind="props"
                  >
                    {{ formatDate(getTaskDetails.date) }}
                  </v-btn>
                </template>

                <v-date-picker
                  :model-value="form.taskDate.val"
                  @update:model-value="setTaskDate"
                  :min="minDate"
                  hide-header
                ></v-date-picker>
              </v-menu>
            </TaskDetailMenu>

            <TaskDetailMenu>
              <template #title> Priority </template>
              <v-menu
                v-model="menuPriority"
                :close-on-content-click="false"
                location="bottom"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    :prepend-icon="mdiFlag"
                    :color="getPriorityColor(form.taskPriority.val)"
                    variant="text"
                    size="small"
                    v-bind="props"
                    block
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
            </TaskDetailMenu>
          </v-col>
        </v-row>
      </v-card-text>
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
import {
  mdiCalendar,
  mdiCheck,
  mdiChevronRight,
  mdiClose,
  mdiFileTree,
  mdiFlag,
} from '@mdi/js'
import { useFormRules } from '@/composables/useFormRules'
import { useTaskStore } from '@/stores/useTaskStore'
import { useDatePicker } from '@/composables/useDatePicker'
import TaskList from './TaskList.vue'
import TaskDetailMenu from './TaskDetailMenu.vue'

const taskStore = useTaskStore()
const { minDate, menuDatePicker, formatDate, setDateAndClose } = useDatePicker()

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

// current task logic
const setTaskStatus = async (key, value) => {
  await taskStore.setTaskStatus(key, value)
}

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
  taskPriority: {
    val: 4,
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
  const { name, desc, date, priority } = getTaskDetails.value

  form.value.taskName.val = name
  form.value.taskDesc.val = desc
  form.value.taskDate.val = new Date(date)
  form.value.taskPriority.val = priority
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
const setTaskDate = (event) => {
  setDateAndClose(() => {
    taskStore.updateTaskDate(taskStore.activeKey, event)
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
const getPriorityColor = (value) => {
  switch (value) {
    case 1:
      return 'red'
    case 2:
      return 'yellow'
    case 3:
      return 'blue'
    default:
      return 'grey'
  }
}
const setTaskPriority = (priority) => {
  taskStore.updateTaskPriority(taskStore.activeKey, priority)
  menuPriority.value = false
}
</script>
