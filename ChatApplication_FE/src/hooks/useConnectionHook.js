import React, { useEffect, useState } from 'react'
import { get } from '../config/config';
import toast from 'react-hot-toast';

function useConnectionHook() {
    const [connection,setConnection]=useState({
        loading:true,
        connected:false
    })

    useEffect(()=>{
        get("/connection",(e,r)=>{
            if(r){
                setConnection({
                    loading:false,
                    connected:true
                })
            }
            else if(e){
                toast.error(e?.data?.message);
                setConnection({
                    loading:false,
                    connected:false
                })
            }
        })
    },[])

    return connection;
}

export default useConnectionHook