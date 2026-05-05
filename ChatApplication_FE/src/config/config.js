import axios from "axios";
import { store } from "../redux/store";

export const baseURL = import.meta.env.VITE_API_URL;

const getToken=()=>{
    const token=store?.getState()?.user?.token;
    return token;
}

const checkForExpiredToken=(e)=>{
    if(e?.response?.data?.httpStatus==="401 UNAUTHORIZED"){
        localStorage.clear();
        window.location.href = "/login";
    }
}

const post=async (url,payload,cb)=>{
    try{
        let token=getToken();
        const res=await axios.post(`${baseURL}${url}`,payload,{headers:token?{Authorization:`Bearer ${token}`}:{}});
        if(res && res?.data){
            cb(null,res?.data);
        }
    }
    catch(e){
        checkForExpiredToken(e);
        cb(e?.response,null);
    }
}

const get=async (url,cb)=>{
   
    try{
        let token=getToken();
        const res=await axios.get(`${baseURL}${url}`,{headers:token?{Authorization:`Bearer ${token}`}:{}});
        if(res && res?.data){
            cb(null,res?.data);
        }
    }
    catch(e){
        checkForExpiredToken(e);
        cb(e?.response,null);
    }
}

export {post,get};