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
            v-model="form.taskName.val"
            :rules="form.taskName.rules"
            :label="form.taskName.label"
            single-line
            variant="outlined"
            class="my-2"
          ></v-text-field>

          <v-textarea
            :model-value="form.taskDesc.val"
            :rules="form.taskDesc.rules"
            :label="form.taskDesc.label"
            single-line
            no-resize
            auto-grow
            rows="1"
            variant="outlined"
            class="my-2"
          ></v-textarea>

          <v-btn :prepend-icon="mdiCalendar" color="primary" variant="outlined">
            {{ formattedDate }}
            <v-menu activator="parent">
              <v-date-picker
                v-model="form.taskDate.val"
                :min="minDate"
              ></v-date-picker>
            </v-menu>
          </v-btn>
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
import { computed, reactive, ref, useTemplateRef, watch } from 'vue'
import { useDate } from 'vuetify'
import { mdiCalendar } from '@mdi/js'
import useFormRules from '@/composables/useFormRules'

// dialog logic
const dialog = defineModel()
const closeDialog = () => {
  dialog.value = false
}

// input logic
const { ruleRequired, ruleMaxLen } = useFormRules()
const dateAdapter = useDate()

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

const formattedDate = computed(() =>
  dateAdapter.format(form.taskDate.val, 'normalDateWithWeekday'),
)

// form logic
const formElement = useTemplateRef('form-task')
watch(dialog, (newValue) => {
  if (newValue === false) {
    formElement.value.reset()
  }
})
const isFormValid = ref()
const submitForm = () => {
  if (isFormValid.value === true) {
    console.log(form)
  }
}
</script>
