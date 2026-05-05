import React, { useRef, useState } from 'react'
import { post } from '../config/config';
import toast from 'react-hot-toast';
import Loader from './Loader';

function FileUpload({onUpload=()=>{}}) {
    const fileInputRef = useRef(null);
    const [uploading,setUploading] = useState(false);

    const uploadFile = async (file) => {
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        setUploading(true);
        post('/api/v1/file/upload', formData, (err, res) => {
          if(res){
            if(onUpload){
                onUpload(res?.url,res?.name)
            }
          }
          else if(err){
            let message = "Something went wrong";
            if(err?.data?.message){
                message = err.data.message;
            }
            else if(err?.message){
                message = err.message;
            }
            toast.error(message);
          }
          setUploading(false);
        })  
      }
    };

    return (
        <div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              aria-hidden
              onChange={()=>{
                let fileInput = fileInputRef.current; 
                let file =fileInput.files[0];
                uploadFile(file)
                fileInputRef.current.value=null;
            }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="relative flex shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white p-2.5 text-slate-600 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-white/50 disabled:border-slate-200"
              aria-label="Attach file"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-opacity ${uploading ? 'opacity-30' : 'opacity-100'}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                />
              </svg>
              {uploading && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Loader size="h-5 w-5" />
                </span>
              )}
            </button>
        </div>
    )
}

export default FileUpload