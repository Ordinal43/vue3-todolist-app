<template>
  <v-dialog
    :model-value="showTaskDetail"
    @update:model-value="closeDetailModal"
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
            <v-menu v-model="menuSiblingTask" location="bottom">
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

              <v-list rounded>
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
          @click="closeDetailModal"
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
            <template v-if="!getTaskDetails.isCompleted">
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

                  <v-card>
                    <v-date-picker
                      :model-value="form.taskDate.val"
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
                              @update:model-value="setTaskDate"
                              format="24hr"
                              color="primary"
                              hide-header
                            ></v-time-picker>
                          </v-menu>
                        </v-btn>
                        <v-btn
                          v-if="time"
                          @click="resetTimePicker"
                          :icon="mdiClose"
                        ></v-btn>
                      </v-btn-group>
                    </div>
                  </v-card>
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
            </template>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, nextTick, provide, ref, watchEffect } from 'vue'
import { VTimePicker } from 'vuetify/labs/VTimePicker'
import {
  mdiCalendar,
  mdiCheck,
  mdiChevronRight,
  mdiClock,
  mdiClose,
  mdiFileTree,
  mdiFlag,
} from '@mdi/js'
import { useTaskStore } from '@/stores/useTaskStore'
import { useDetailStore } from '@/stores/useDetailStore'
import { useDatePicker } from '@/composables/useDatePicker'
import { useTimePicker } from '@/composables/useTimePicker'
import { useTaskPriority } from '@/composables/useTaskPriority'
import { useTaskDetailModal } from '@/composables/useTaskDetailModal'
import { useFormInputs } from '@/composables/useFormInputs'
import TaskList from './TaskList.vue'
import TaskDetailMenu from './TaskDetailMenu.vue'

const taskStore = useTaskStore()
const detailStore = useDetailStore()
const { minDate, menuDatePicker, formatDate, setDateAndClose } = useDatePicker()
const { menuTimePicker, time, resetTimePicker, closeTimePicker } =
  useTimePicker()
const { menuPriority, priorityOptions, getPriorityColor, setPriorityAndClose } =
  useTaskPriority()
const { openTaskDetail } = useTaskDetailModal()
const { form, isFormValid, inputTaskNameRef, setFormData } = useFormInputs()

// dialog logic
const showTaskDetail = computed(() => {
  return detailStore.showTaskDetail
})

const closeDetailModal = () => {
  detailStore.setShowTaskDetail(false)
}

// task details logic
const getTaskDetails = computed(() => {
  return taskStore.tasks.get(detailStore.activeKey)
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

const menuSiblingTask = ref(false)

// current task logic
const setTaskStatus = async (key, value) => {
  await taskStore.setTaskStatus(key, value)
}

// subtasks store logic
provide('isSubtaskForm', true)
const getSubtasks = computed(() => {
  return taskStore.getSubtasks(detailStore.activeKey)
})

// input logic
const showEditForm = ref(false)

const openEditForm = async () => {
  showEditForm.value = true
  await nextTick()
  inputTaskNameRef.value.focus()
}

const closeEditForm = () => {
  showEditForm.value = false
  setFormToInitial()
}

const setFormToInitial = () => {
  const { name, desc, date, priority } = getTaskDetails.value
  setFormData({
    name: name,
    desc: desc,
    dateStr: date,
    priority: priority,
  })
}

watchEffect(() => {
  if (getTaskDetails.value) {
    setFormToInitial()
  }
})

watchEffect(async () => {
  if (showTaskDetail.value === false) {
    await nextTick()
    showEditForm.value = false
  }
})

const submitForm = () => {
  if (isFormValid.value === true) {
    const { taskName, taskDesc } = form.value
    taskStore.updateTaskValue(detailStore.activeKey, {
      name: taskName.val,
      desc: taskDesc.val,
    })
    closeEditForm()
  }
}

// menu date-picker logic
const setTaskDate = (event) => {
  setDateAndClose(() => {
    closeTimePicker()
    const formDate = form.value.taskDate
    if (event instanceof Date) {
      formDate.val = event
    } else {
      if (event !== null) {
        formDate.val.setHours(...event.split(':'))
      }
    }
    taskStore.updateTaskDate(detailStore.activeKey, formDate.val)
  })
}

// menu priority logic
const setTaskPriority = (priority) => {
  setPriorityAndClose(() => {
    taskStore.updateTaskPriority(detailStore.activeKey, priority)
  })
}
</script>
