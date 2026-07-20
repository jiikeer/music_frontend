import { getBaseURL } from "./request";

export function attachImageUrl(url){
    if(!url){
        return "";
    }
    if(url.startsWith("http")){
        return url;
    }
    return getBaseURL()+"/"+url.replace(/^\/+/,"");
}