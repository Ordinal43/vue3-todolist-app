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
              <template #activator="{ props }">
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
                    (event) => setTaskStatus(getTaskDetails.key, event)
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
                <DateTimePicker
                  v-model:date="form.taskDate.val"
                  v-model:time="form.taskTime.val"
                >
                  <template #activator="{ props }">
                    <v-btn
                      :prepend-icon="mdiCalendar"
                      color="primary"
                      variant="text"
                      size="small"
                      block
                      v-bind="props"
                    >
                      {{ formatDate(form.taskDate.val) }}
                      {{ formatTime(form.taskTime.val) }}
                    </v-btn>
                  </template>
                </DateTimePicker>
              </TaskDetailMenu>

              <TaskDetailMenu>
                <template #title> Priority </template>
                <PriorityPicker v-model="form.taskPriority.val">
                  <template #activator="{ props }">
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
                </PriorityPicker>
              </TaskDetailMenu>
            </template>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, nextTick, provide, ref, watch } from 'vue'
import {
  mdiCalendar,
  mdiCheck,
  mdiChevronRight,
  mdiClose,
  mdiFileTree,
  mdiFlag,
} from '@mdi/js'
import { useTaskStore } from '@/stores/useTaskStore'
import { useDetailStore } from '@/stores/useDetailStore'
import { useStateTaskDetailModal } from '@/composables/states/useStateTaskDetailModal'
import { useStateTaskPriority } from '@/composables/states/useStateTaskPriority'
import { useStateFormInputs } from '@/composables/states/useStateFormInputs'
import { useMethodDateFormatter } from '@/composables/methods/useMethodDateFormatter'
import TaskList from './TaskList.vue'
import TaskDetailMenu from './TaskDetailMenu.vue'
import DateTimePicker from './DateTimePicker.vue'
import PriorityPicker from './PriorityPicker.vue'

const taskStore = useTaskStore()
const detailStore = useDetailStore()
const { openTaskDetail } = useStateTaskDetailModal()
const { getPriorityColor } = useStateTaskPriority()
const { form, isFormValid, inputTaskNameRef, setFormData } =
  useStateFormInputs()
const { formatDate, formatTime } = useMethodDateFormatter()

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

// edit form logic
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
  const { name, desc, date, time, priority } = getTaskDetails.value
  setFormData({
    name: name,
    desc: desc,
    dateStr: date,
    time: time,
    priority: priority,
  })
}

watch(getTaskDetails, (newValue) => {
  if (newValue) {
    setFormToInitial()
  }
})

watch(showTaskDetail, async (newValue) => {
  if (newValue === false) {
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

// right sidebar input logic
watch(form.value.taskDate, (newDate) => {
  taskStore.updateTaskDate(detailStore.activeKey, newDate.val)
})

watch(form.value.taskTime, (newTime) => {
  taskStore.updateTaskTime(detailStore.activeKey, newTime.val)
})

watch(form.value.taskPriority, (newPriority) => {
  taskStore.updateTaskPriority(detailStore.activeKey, newPriority.val)
})
</script>
