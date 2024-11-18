<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <div class="ma-2">
        <v-form
          v-model="isFormValid"
          validate-on="lazy"
          @submit.prevent="submitForm"
        >
          <v-text-field
            v-model="form.taskName.value"
            :rules="form.taskName.rules"
            :label="form.taskName.label"
            variant="outlined"
          ></v-text-field>
          <v-textarea
            :model-value="form.taskDesc.value"
            :rules="form.taskDesc.rules"
            :label="form.taskDesc.label"
            counter
          ></v-textarea>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="closeDialog" text>Cancel</v-btn>
            <v-btn type="submit" color="primary">OK</v-btn>
          </v-card-actions>
        </v-form>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import useFormRules from '@/composables/useFormRules'

// dialog logic
const dialog = defineModel()
const closeDialog = () => {
  dialog.value = false
}

// input logic
const { ruleRequired, ruleMaxLen } = useFormRules()

const form = reactive({
  taskName: {
    value: '',
    label: 'Task Name',
    rules: [ruleRequired, (value) => ruleMaxLen(value, 150)],
  },
  taskDesc: {
    value: '',
    label: 'Task Description',
    rules: [ruleRequired, (value) => ruleMaxLen(value, 300)],
  },
})

// form logic
const isFormValid = ref()
const submitForm = () => {
  if (isFormValid.value === true) {
    alert('form submitted!')
  }
}
</script>
