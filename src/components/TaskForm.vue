<template>
  <v-dialog v-model="dialog" max-width="500px">
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
          <v-btn @click="closeDialog" text>Cancel</v-btn>
          <v-btn type="submit" color="primary" :disabled="isFormValid !== true">
            Add Task
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, nextTick, reactive, ref, useTemplateRef, watch } from 'vue'
import { useDate } from 'vuetify'
import { mdiCalendar } from '@mdi/js'
import { useFormRules } from '@/composables/useFormRules'

const dateAdapter = useDate()

// dialog logic
const dialog = defineModel()
const closeDialog = () => {
  dialog.value = false
}

// date-picker logic
const menuDatePicker = ref(false)
const formattedDate = computed(() =>
  dateAdapter.format(form.taskDate.val, 'normalDateWithWeekday'),
)
const setTaskDate = (event) => {
  form.taskDate.val = event
  menuDatePicker.value = false
}

// input logic
const { ruleRequired, ruleMaxLen } = useFormRules()

const currentDate = new Date()
const minDate = ref(currentDate)

const form = reactive({
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

// form logic
const formEl = useTemplateRef('form-task')
const inputTaskNameEl = useTemplateRef('input-task-name')
watch(dialog, async (newValue) => {
  if (newValue === false) {
    formEl.value.reset()
  } else {
    await nextTick()
    inputTaskNameEl.value.focus()
  }
})
const isFormValid = ref()
const submitForm = () => {
  if (isFormValid.value === true) {
    console.log(form.taskName.val)
    console.log(form.taskDesc.val)
    console.log(form.taskDate.val)
  }
}
</script>
