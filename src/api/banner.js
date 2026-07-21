import { api } from '@/utils/request'

export function getAllBanner() {
  return api({ url: '/banner' })
}

export function getBannerPage(page = 1, size = 20) {
  return api({ url: `/banner/page?page=${page}&size=${size}` })
}

export function addBanner(data) {
  return api({ method: 'post', url: '/banner/add', data })
}

export function updateBanner(data) {
  return api({ method: 'post', url: '/banner/update', data })
}

export function deleteBanner(id) {
  return api({ method: 'delete', url: `/banner/delete?id=${id}` })
}

export function uploadBannerPic(id, file) {
  const formData = new FormData()
  formData.append('file', file)
  return api({
    method: 'post',
    url: `/banner/pic/update?id=${id}`,
    data: formData,
    config: { headers: { 'Content-Type': 'multipart/form-data' } }
  })
}
