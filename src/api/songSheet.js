import { api } from '@/utils/request'

export function getAllSongSheet() {
  return api({ url: '/songSheet' })
}

export function getSongSheetPage(page = 1, size = 20) {
  return api({ url: `/songSheet/page?page=${page}&size=${size}` })
}

export function getSongSheetDetail(id) {
  return api({ url: `/songSheet/detail?id=${id}` })
}

export function addSongSheet(data) {
  return api({ method: 'post', url: '/songSheet/add', data })
}

export function updateSongSheet(data) {
  return api({ method: 'post', url: '/songSheet/update', data })
}

export function deleteSongSheet(id) {
  return api({ method: 'delete', url: `/songSheet/delete?id=${id}` })
}

export function uploadSongSheetPic(id, file) {
  const formData = new FormData()
  formData.append('file', file)
  return api({
    method: 'post',
    url: `/songSheet/pic/update?id=${id}`,
    data: formData,
    config: { headers: { 'Content-Type': 'multipart/form-data' } }
  })
}
