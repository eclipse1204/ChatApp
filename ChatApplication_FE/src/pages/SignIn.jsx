import React, { useEffect, useRef, useState } from 'react';
import Button from '../components/Button.jsx';
import toast from 'react-hot-toast';
import { post } from '../config/config.js';
import {useDispatch} from 'react-redux';
import { login as storeToken } from '../redux/slices/userSlice.js'; 
import { useNavigate } from 'react-router';

function SignIn() {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const USERNAME = useRef() ,PASSWORD = useRef(), CONFIRMPASSWORD = useRef();

  const signup = async(username,password)=>{
    setIsLoading(true);
    post("/auth/signup",{username,password},(e,r)=>{
      if(r){
        toast.success("User Created Successfully");
        setIsSignUp(false);
      }
      else if(e){
        toast.error(e?.data?.message);
      }
      setIsLoading(false);
    });
  }

  const login = async(username,password)=>{
    setIsLoading(true);
    post("/auth/login",{username,password},(e,r)=>{
      if(r){
        dispatch(storeToken({token:r?.jwt,userName:r?.userName}));
        toast.success("User Logged-in");
        navigate('/home');
        setIsSignUp(false);
      }
      else if(e){
        toast.error(e?.data?.message);
      }
      setIsLoading(false);
    });
  }

  const handleClick = async () => {
    let username=USERNAME.current.value;
    let password=PASSWORD.current.value;
    if(!username){
      toast.error("Please enter the username");
      return;
    }
    if(!password){
      toast.error("Please enter the password");
      return;
    }
    if(isSignUp){
      let confirmPassword=CONFIRMPASSWORD.current.value;
      if(!confirmPassword){
        toast.error("Please enter password again");
        return;
      }
      if(password!==confirmPassword){
        toast.error("Passwords do not match");
        return;
      }
    }
    if(isSignUp){
      signup(username,password);
    }
    else{
      login(username,password);
    }
    
  };

  useEffect(()=>{
    USERNAME.current.value="";
    PASSWORD.current.value="";
  },[isSignUp]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-slate-800 text-center">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-sm text-slate-500 text-center mt-1">
          {isSignUp ? 'Sign up to get started.' : 'Sign in to continue.'}
        </p>

        <div className="mt-6 grid grid-cols-2 bg-slate-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`py-2 text-sm rounded-md transition ${
              !isSignUp
                ? 'bg-white shadow text-slate-800 font-medium'
                : 'text-slate-500'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`py-2 text-sm rounded-md transition ${
              isSignUp
                ? 'bg-white shadow text-slate-800 font-medium'
                : 'text-slate-500'
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Username
            </label>
            <input
              ref={USERNAME}
              type="text"
              placeholder="john_doe"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              ref={PASSWORD}
              type="password"
              placeholder="Enter your password"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirm Password
              </label>
              <input
                ref={CONFIRMPASSWORD}
                type="password"
                placeholder="Re-enter your password"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          <Button
            type="submit"
            isLoading={isLoading}
            onClick={(e) => {
              e.preventDefault();
              handleClick();
            }}
            className="w-full bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-700 transition"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
