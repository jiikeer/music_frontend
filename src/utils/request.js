import axios from "axios";
import router from "@/router";

const BASE_URL =
process.env.VUE_APP_NODE_HOST ||
process.env.NODE_HOST ||
"";

const request = axios.create({
    baseURL:BASE_URL,
    timeout:500000,
    withCredentials:true
});
// 请求拦截器
request.interceptors.request.use(
config=>{
    /*
      后期JWT Token放这里
      const token =
      localStorage.getItem("token");
      if(token){
        config.headers.Authorization =
        token;
      }
    */
    return config;
},
error=>{
    return Promise.reject(error);
}
);
// 响应拦截器
request.interceptors.response.use(
response=>{
    return response;
},
error=>{
    if(error.response){
        switch(error.response.status){
            case 401:
                router.replace("/sign-in");
                break;
            case 403:
                router.replace("/");
                break;
            case 404:
                console.log(
                    "接口不存在"
                );

                break;
        }
    }
    return Promise.reject(error);
}
);
// ========================
// 统一api方法
// ========================
export function api(options){
    const method =
    options.method || "get";
    switch(method){
        case "post":
            return request
            .post(
                options.url,
                options.data,
                options.config
            )
            .then(res=>res.data);
        case "delete":
            return request
            .delete(
                options.url,
                options.config
            )
            .then(res=>res.data);
        case "put":
            return request
            .put(
                options.url,
                options.data,
                options.config
            )
            .then(res=>res.data);
        default:
            return request
            .get(
                options.url,
                options.config
            )
            .then(res=>res.data);
    }
}

export function getBaseURL(){
    return BASE_URL;
}
export default request;