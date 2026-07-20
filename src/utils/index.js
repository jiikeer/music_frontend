import request from "@/utils/request";

export function attachImageUrl(url) {
  return url
    ? `${request.getBaseURL()}${url}`
    : "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png";
}