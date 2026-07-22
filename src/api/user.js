import { api } from "@/utils/request";

export function register(data) {
  return api({ method: "post", url: "/user/add", data });
}

export function login(data) {
  return api({ method: "post", url: "/user/login", data });
}

export function getAllUser() {
  return api({ url: "/user" });
}

export function getUserPage(page = 1, size = 20) {
  return api({ url: `/user/page?page=${page}&size=${size}` });
}

export function getUserDetail(id) {
  return api({ url: `/user/detail?id=${id}` });
}

export function deleteUser(id) {
  return api({ method: "get", url: `/user/delete?id=${id}` });
}

export function updateUser(data) {
  return api({ method: "post", url: "/user/update", data });
}

export function updatePassword(data) {
  return api({ method: "post", url: "/user/updatePassword", data });
}

export function uploadAvatar(id, file) {
  const formData = new FormData();
  formData.append("file", file);
  return api({
    method: "post",
    url: `/user/avatar/update?id=${id}`,
    data: formData,
    config: { headers: { "Content-Type": "multipart/form-data" } }
  });
}
