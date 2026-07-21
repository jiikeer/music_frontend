import { useRouter } from 'vue-router'

export function useRouterHelper() {
  const router = useRouter()
  const goBack = () => router.back()
  const navigateTo = (path) => router.push(path)
  return { goBack, navigateTo }
}

export function getSex(value) {
  if (value === 0 || value === '0') return '女'
  if (value === 1 || value === '1') return '男'
  return '保密'
}

export function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    return '只支持 JPG/PNG 格式!'
  }
  if (!isLt2M) {
    return '图片大小不能超过 2MB!'
  }
  return true
}
