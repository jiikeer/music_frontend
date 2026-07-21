<template>
  <el-dialog v-model="visible" title="提示" width="300px" align-center>
    <span>确定删除吗？</span>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
let resolveFn = null

const open = () => {
  visible.value = true
  return new Promise((resolve) => {
    resolveFn = resolve
  })
}

const confirm = () => {
  visible.value = false
  if (resolveFn) resolveFn(true)
}

const cancel = () => {
  visible.value = false
  if (resolveFn) resolveFn(false)
}

defineExpose({ open })
</script>
