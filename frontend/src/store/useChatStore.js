import {create} from 'zustand'; 
import toast from 'react-hot-toast'; 
import {axiosInstance} from '../lib/axios'; 
import { Socket } from 'socket.io-client';
import { useAuthStore } from './useAuthStore';
export const useChatStore = create((set,get)=>({
messages:[],
users:[],
selectedUser:null,
isUsersLoading:false,
isMessagesLoading:false,

getUsers:async()=>{
    set({isUsersLoading:true}); 
    try {
        const res = await axiosInstance.get(`/messages/users`); 
        console.log("user data : ",res.data)
        set({users:res.data}); 
 
    } catch (error) {
        console.log("error from usermessageStore: ", error); 
        toast.error(error.response.data.message); 
    }finally{
        set({isUsersLoading:false}); 
    }
},

getMessages:async(userId)=>{
    set({isMessagesLoading:true}); 
    try {
        const res = await axiosInstance.get(`/messages/${userId}`); 
        console.log("messages : ", res.data); 
        
        set({messages:res.data})
    } catch (error) {
        console.log("error from messsage store : ",error); 
        toast("error from message store"); 
    }finally{
        set({isMessagesLoading:false}); 
    }
},

sendMessage:async(messageData)=>{
  const {selectedUser,messages} = get(); 
  try {
    const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData)
    set({messages:[...messages,res.data]}); 

  } catch (error) {
    toast.error(error.response.data.message) ;
    console.log("error from sendmessage store : ", error); 

  }
},

subscribeToMessages:()=>{
    const selectedUser = get(); 
    if(!selectedUser){
        return; 
    }
    const socket = useAuthStore.getState().socket; 

    socket.on('newMessage',(newMessage)=>{
        const isMessageSendFromSelectedUser = newMessage.senderId === selectedUser._id; 

        if(!isMessageSendFromSelectedUser){return;}
        set({
            messages:[...get().messages,newMessage],
        }); 
    }); 
},
unsubscribeFromMessages:()=>{
    const socket = useAuthStore.getState().socket; 
    socket.off('newMessage'); 
},

setSelectedUser:(selectedUser)=>set({selectedUser})

}))