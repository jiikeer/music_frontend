import { api } from '@/utils/request'

export function getAllSinger() {
  return api({ url: '/singer' })
}

export function getSingerPage(page = 1, size = 20) {
  return api({ url: `/singer/page?page=${page}&size=${size}` })
}

export function getSingerDetail(id) {
  return api({ url: `/singer/detail?id=${id}` })
}

export function getSingerSongs(id) {
  return api({ url: `/singer/${id}/songs` })
}

export function addSinger(data) {
  return api({ method: 'post', url: '/singer/add', data })
}

export function updateSinger(data) {
  return api({ method: 'post', url: '/singer/update', data })
}

export function deleteSinger(id) {
  return api({ url: `/singer/delete?id=${id}` })
}

export function uploadSingerPic(id, file) {
  const formData = new FormData()
  formData.append('file', file)
  return api({
    method: 'post',
    url: `/singer/avatar/update?id=${id}`,
    data: formData
  })
}
