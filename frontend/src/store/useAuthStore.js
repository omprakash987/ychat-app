import toast from 'react-hot-toast';
import {axiosInstance} from '../lib/axios.js'

import {create} from 'zustand'; 
import axios from 'axios';
import LoginPage from '../pages/LoginPage.jsx';
import {io} from 'socket.io-client'


const baseURL = import.meta.env.MODE ==='development'?"http://localhost:8000":'/'


export const useAuthStore = create((set,get)=>({
    authUser:null,
    isSignup:false,
    isLogin:false,
    isUpdatingProfile:false,
    onlineUsers:[],
    socket:null,
    isCheckingAuth:true,

    checkAuth:async()=>{
        try {
            
            const res =await axiosInstance.get(`/auth/check`); 
            set({authUser:res.data}); 
            get().connectSocket();
            
        } catch (error) {
            console.log("error from check auth : ", error ); 

            set({authUser:null}); 
            set({isCheckingAuth:false}); 
        }
    },
    signup:async(data)=>{
        try {
            set({isSignup:true}); 
            const res =await axiosInstance.post(`/auth/signup`,data); 
            toast.success("signup successfull")
            set({authUser:res}); 
            get().connectSocket();
        } catch (error) {
            console.log("error from signup store : ", error); 
            toast.error(error.response.data.message)
            set({isSignup:false}); 

        }
    },
    login:async(data)=>{
       try {
        set({isLogin:true}); 
        const res = await axiosInstance.post(`/auth/login`,data); 
        set({authUser:res.data}); 
        toast.success("login successfull"); 

        get().connectSocket(); 
        
       } catch (error) {
        console.log("error from login store", error); 
        toast.error('error from login store'); 
        
       }

    },
    logout:async()=>{
        try {
            const res = await axiosInstance.post(`/auth/logout`); 
            set({authUser:null}); 
            toast.success("logout successfull")
            get().disconnectSocket();
            
        } catch (error) {
            console.log("error from logout : ", error); 
            toast(error.response.data.message);
        }
    },
    updateProfile:async(data)=>{
        set({isUpdatingProfile:true}); 

       try {
        const res = await axiosInstance.put(`/auth/update-profile`,data); 
        set({authUser:res.data}); 
        toast.success("profile update successfull"); 

        
       } catch (error) {
        console.log("error from update profile store: ", error); 
        toast("error from update profile ")
       }
    },
    connectSocket:async()=>{
        const {authUser} = get()
        if(!authUser&& get().socket?.connected){
            return; 
        }
        const socket = io(baseURL,{
            query:{
                userId:authUser._id,
            },
        }); 
        socket.connect(); 
        set({socket:socket}); 

        socket.on("getOnlineUser",(userIds)=>{
            set({onlineUsers:userIds}); 
            
        }); 


    },
    disconnectSocket:async()=>{
    if(get().socket?.connected) get().socket.disconnect();
    },


}))

