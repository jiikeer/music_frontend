import { api } from '@/utils/request'

export function getAllCollection() {
  return api({ url: '/collection' })
}

export function getCollectionPage(page = 1, size = 20) {
  return api({ url: `/collection/page?page=${page}&size=${size}` })
}

export function deleteCollection(id) {
  return api({ url: `/collection/delete?id=${id}` })
}
