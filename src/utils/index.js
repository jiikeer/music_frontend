import { getBaseURL } from "./request";

export function attachImageUrl(url){
    // 同时判断：空值 且 必须是字符串类型
    if(!url || typeof url !== 'string'){
        return "";
    }
    if(url.startsWith("http")){
        return url;
    }
    return getBaseURL()+"/"+url.replace(/^\/+/,"");
}