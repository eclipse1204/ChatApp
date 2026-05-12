import React, { useEffect, useState } from 'react'
import { get } from '../config/config';
import toast from 'react-hot-toast';

function useConnectionHook() {
    const [connection,setConnection]=useState({
        loading:sessionStorage.getItem("loadingSession")?sessionStorage.getItem("loadingSession")==="true":true,
        connected:sessionStorage.getItem("connectedSession")?sessionStorage.getItem("connectedSession")==="true":false,
    })

    useEffect(()=>{
        if(connection?.loading){
            get("/connection",(e,r)=>{
                if(r){
                    setConnection({
                        loading:false,
                        connected:true
                    })
                    sessionStorage.setItem("loadingSession",false)
                    sessionStorage.setItem("connectedSession",true)
                }
                else if(e){
                    toast.error(e?.data?.message);
                    setConnection({
                        loading:false,
                        connected:false
                    })
                    sessionStorage.setItem("connectedSession",false)
                }
            })   
        }
    },[connection])
    

    return connection;
}

export default useConnectionHook