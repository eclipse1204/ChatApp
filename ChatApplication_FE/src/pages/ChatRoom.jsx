import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Loader from '../components/Loader.jsx';
import { baseURL, get, post } from '../config/config.js';
import toast from 'react-hot-toast';
import Button from '../components/Button.jsx';
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useSelector } from 'react-redux';
import moment from "moment";
import FileUpload from '../components/FileUpload.jsx';
import Attachment from '../components/Attachment/Attachment.jsx';

const SCROLL_TOP_THRESHOLD_PX = 100;

function ChatRoom() {
  const messagesScrollRef = useRef(null);
  const INPUT=useRef();
  const [fetchingMessages,setFetchingMessages]=useState(false);
  const navigate = useNavigate();
  const {id:roomId} = useParams();
  const [leaveRoomModal,setLeaveRoomModal] = useState(false);
  const [btnLoading,setBtnLoading] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const stompClientRef = useRef(null);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [typingUsers,setTypingUsers] = useState({});
  const userName=useSelector(state=>state.user.userName);
  const [typingTimeOut,setTypingTimeOut]=useState(undefined);
  const throttleTimeOut=useRef();
  const [count,setCount] = useState(0);
  const prevScrollHeightRef = useRef(0);
  const isPrependingRef = useRef(false)
  const [initialLoad,setInitialLoad] = useState(false);
  // const [addUserModal,setAddUserModal] = useState(false);
  // const [userSearchQuery,setUserSearchQuery] = useState("");
  // const [userSearchResults,setUserSearchResults] = useState([]);
  // const [userSearchLoading,setUserSearchLoading] = useState(false);
  // const [addingUser,setAddingUser] = useState(null);
  // const userSearchTimeoutRef = useRef(null);
  const [users,setUsers] = useState({
    users:{},
    count:0
  });

  const [data,setData]=useState({
    messages:[],
    endTimestamp:moment().valueOf(),
    roomName:"",
    countUser:undefined,
    noMoreMessages:false
  })

  const fetchMessages=()=>{
    if(fetchingMessages) return;

    if (messagesScrollRef.current && data?.messages?.length > 0) {
      //height->entire height, top -> cursor
      prevScrollHeightRef.current = messagesScrollRef.current.scrollHeight; //currentHeight before new messages
      isPrependingRef.current = true;
    }

    setFetchingMessages(true);
    setIsLoadingOlder(true);
    get(`/api/v1/rooms/fetchMessages/${roomId}?timestamp=${data?.endTimestamp}&pageSize=20`,(e,r)=>{
      if(r){
        let arr=(r?.messages && Array.isArray(r?.messages))?r?.messages.reverse():r?.messages;
        setData((prev)=>{
            return {
              ...prev,
              messages:[...arr,...prev.messages],
              endTimestamp:arr?.length?arr[0].timestamp:prev.endTimestamp,
              countUser:r?.countUsers,
              roomName:r?.roomName,
              noMoreMessages:arr?.length===0
            }
          }
        )
      }
      else if(e){
        toast.error(e.data.message);
        return;
      }
      setIsLoadingOlder(false);
      setFetchingMessages(false);
    })
  }

  const connectWebSocket = () => {
    const sock = new SockJS(`${baseURL}/chat`);
    const client = Stomp.over(sock);
    stompClientRef.current = client;

    client.connect({}, () => {
      setStompClient(client);

      console.log("CONNECTED");

      client.send(
        `/app/join/${roomId}`,
        {},
        JSON.stringify({ username:userName })
      );

      client.subscribe(`/topic/room/${roomId}`, (message) => {
  
        const newMessage = JSON.parse(message.body);
        setData((prev)=>{
          return {
            ...prev,
            endTimestamp:!prev?.endTimestamp?newMessage.timestamp:prev?.endTimestamp,
            messages:[...prev.messages,newMessage]
          }
        })
      });

      client.subscribe(`/topic/room/${roomId}/typing`, (message) => {
        
        const payload = JSON.parse(message.body);
        if(payload?.userName === userName) return;
        setTypingUsers((prev)=>{
          const next = {...prev};
          if(payload?.typing){
            next[payload.userName] = true;
          } else {
            delete next[payload.userName];
          }
          return next;
        });
      });

      client.subscribe(`/topic/rooms/${roomId}/users`, (message) => {
          const payload = JSON.parse(message.body);
          let obj={};
          payload.users.forEach(user=>{
            obj[user]=true;
          });
          setUsers((prev)=>{
            return {
              ...prev,
              users:obj,
              count:payload.count
            }
          });
        }
      );
    });
  };

  useEffect(() => {
    fetchMessages()
    connectWebSocket();

    return ()=>{
      const client = stompClientRef.current;
      if (client && client.connected) {
        client.disconnect();
      }
      stompClientRef.current = null;
    }
  }, [roomId]);
  //send message handle

  const sendMessage =() => {
    if (stompClient) {

      let input=INPUT.current.value;

      if(!input?.length){
        return
      }

      const message = {
        message: input,
        messageType: 'TEXT',
        userName:userName
      };

      sendTypingStatus(false);
      
      stompClient.send(
        `/app/sendMessage/room/${roomId}`,
        {},
        JSON.stringify(message)
      );

      INPUT.current.value="";
    }
  };

  const sendFile = (url,name)=>{
    if (stompClient) {

      let input=url;

      const message = {
        fileUrl: input,
        message: name,
        messageType: 'FILE',
        userName:userName
      };

      stompClient.send(
        `/app/sendMessage/room/${roomId}`,
        {},
        JSON.stringify(message)
      );
      
    }
  }

  const sendTypingStatus=(typing=false)=>{

    if (stompClient) {
      const message = {
        typing,
        userName:userName
      };

      stompClient.send(
        `/app/typing/room/${roomId}`,
        {},
        JSON.stringify(message)
      );
    }
  }

  const handleMessagesScroll = (scrollTop) => {
    clearTimeout(throttleTimeOut.current)
    throttleTimeOut.current=undefined
    if (scrollTop > SCROLL_TOP_THRESHOLD_PX) return;
    if(!data?.noMoreMessages){
      fetchMessages();
    }
  };

  const throttle=(cb)=>{
    if(throttleTimeOut.current){
      return;
    }
    let val=setTimeout(cb,10);
    throttleTimeOut.current=val
  }

  useEffect(() => {
    if (messagesScrollRef.current && count===0 && data?.messages?.length) {
      //initial load
      messagesScrollRef.current.scrollTo({
        top: messagesScrollRef.current.scrollHeight,
        behavior: "smooth",
      });

      setTimeout(()=>{
        setInitialLoad(true);
      },200)

      setCount(1);
    }
    else{
      //newHeight-oldHeight=position from new top
      const el = messagesScrollRef.current;
      if (!el) return;
      if (isPrependingRef.current) {
        el.scrollTop = el.scrollHeight - prevScrollHeightRef.current;
        isPrependingRef.current = false;
      }
    }
  }, [data?.messages]);

  // useEffect(() => {
  //   if (!addUserModal) return;

  //   if (userSearchTimeoutRef.current) {
  //     clearTimeout(userSearchTimeoutRef.current);
  //   }

  //   const q = userSearchQuery.trim();
  //   if (!q.length) {
  //     setUserSearchResults([]);
  //     setUserSearchLoading(false);
  //     return;
  //   }

  //   setUserSearchLoading(true);
  //   userSearchTimeoutRef.current = setTimeout(() => {
  //     get(`/api/v1/users/fetch?q=${q}&pageSize=10`, (e, r) => {
  //       if (r) {
  //         setUserSearchResults((r?.users || []).filter((u) => u !== userName));
  //       } else if (e) {
  //         toast.error(e?.data?.message || 'Search failed');
  //         setUserSearchResults([]);
  //       }
  //       setUserSearchLoading(false);
  //     });
  //   }, 300);
  // }, [userSearchQuery, addUserModal]);

  // const addUserToRoom = (target) => {
  //   setAddingUser(target);
  //   post('/api/v1/notifications/invite', { receiver: target, roomId }, (e, r) => {
  //     if (r?.success) {
  //       toast.success(`Invitation sent to ${target}`);
  //       setUserSearchResults((prev) => prev.filter((u) => u !== target));
  //     } else if (e) {
  //       toast.error(e?.data?.message || 'Unable to send invitation');
  //     }
  //     setAddingUser(null);
  //   });
  // };

  const leaveRoom = () => {
    if (!roomId) {
      navigate('/home');
      return;
    }
    setBtnLoading(true);
    post('/api/v1/rooms/leave', { id: roomId }, (e, r) => {
      if (r?.success) {
        toast.success('Left room successfully');
        setLeaveRoomModal(false);
        navigate('/home');
      } else if (e) {
        toast.error(e?.data?.message || 'Unable to leave room');
      }
      setBtnLoading(false);
    });
  };

  const typingIndicator=()=>{

    if(typingTimeOut){
      clearTimeout(typingTimeOut);
    }

    let val=setTimeout(()=>{
      sendTypingStatus(false);
    },2000);

    setTypingTimeOut(val);
    sendTypingStatus(true);
  }

  return (
    <div  className="flex-1">
      <div className="mx-auto flex flex-col h-full">
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-slate-800">{data?.roomName}</h1>
              {data?.countUser?<p className="text-sm text-slate-500">Total Members : {data?.countUser}</p>:null}
              <p className="text-sm text-slate-500">Active Members : {users?.count}</p>
            </div>
            <div className="flex items-center gap-2">
              {/* <Button
                type="button"
                onClick={()=>{
                  setUserSearchQuery("");
                  setUserSearchResults([]);
                  setAddUserModal(true);
                }}
                className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
              >
                Add User
              </Button> */}
              <Button
                type="button"
                onClick={()=>{
                  setLeaveRoomModal(true);
                }}
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
              >
                Leave Room
              </Button>
            </div>
          </div>
        </div>

        <div
          ref={messagesScrollRef}
          className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-6"
          onScroll={(e)=>{
            if(initialLoad){
              const el = e.currentTarget;
              let val=el.scrollTop
              throttle(()=>{handleMessagesScroll(val)})
            }
          }}
        >
          {isLoadingOlder && (
            <div className="flex justify-center py-2" aria-live="polite">
              <Loader size="h-6 w-6" color="border-slate-500" />
            </div>
          )}

          {data?.noMoreMessages && !isLoadingOlder && (
            <div className="flex justify-center py-2">
              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
                Beginning of conversation
              </span>
            </div>
          )}

          {data?.messages?.map((m) => (
            <div
              key={m.id}
              className={
                (m?.userName===userName)
                  ? 'ml-auto max-w-xs rounded-2xl rounded-br-sm bg-white px-4 py-3 text-sm text-slate-700 shadow'
                  : 'max-w-xs rounded-2xl rounded-bl-sm bg-blue-600 px-4 py-3 text-sm text-white shadow'
              }
            >
              {!(m?.userName===userName) && (
                <p className="mb-1 flex items-center gap-1 text-xs font-semibold text-blue-100">
                  {users?.users?.[m?.userName] && (
                    <span
                      className="inline-block h-2 w-2 rounded-full bg-green-400"
                      title="Online"
                    />
                  )}
                  {m?.userName || 'Unknown'}
                </p>
              )}

              {m?.fileUrl?<div className='flex items-center'>
                <Attachment url={m?.fileUrl}/>
                <div className='ml-1'>{m?.message}</div>
              </div>:m?.message}
              <div style={{fontSize:'8px'}} className='flex justify-end'>{moment(m?.timestamp).format("DD-MM-YYYY hh:mm a")}</div>
            </div>
          ))}

          {Object.keys(typingUsers).length > 0 && (
            <div className="flex items-center gap-2 max-w-xs rounded-2xl rounded-bl-sm bg-slate-200 px-4 py-3 text-sm text-slate-700 shadow">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-slate-500 animate-bounce" style={{animationDelay:'0ms'}}></span>
                <span className="h-2 w-2 rounded-full bg-slate-500 animate-bounce" style={{animationDelay:'150ms'}}></span>
                <span className="h-2 w-2 rounded-full bg-slate-500 animate-bounce" style={{animationDelay:'300ms'}}></span>
              </div>
              <span className="text-xs">
                {Object.keys(typingUsers)[0]}
                {Object.keys(typingUsers).length > 1 && ` and ${Object.keys(typingUsers).length - 1} other${Object.keys(typingUsers).length - 1 > 1 ? 's' : ''}`}
                {' '}{Object.keys(typingUsers).length > 1 ? 'are' : 'is'} typing...
              </span>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <FileUpload onUpload={(url,name)=>{
              sendFile(url,name)
            }}/>
            <input
              type="text"
              ref={INPUT}
              placeholder="Type your message..."
              onKeyDown={(e)=>{
                if(e.key==='Enter'){
                  e.preventDefault();
                  sendMessage();
                }
              }}
              onChange={()=>{typingIndicator()}}
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              type="button"
              onClick={()=>{sendMessage()}}
              isLoading={btnLoading}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
      {/* {addUserModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-800">Add User</h2>
            <p className="mt-1 text-sm text-slate-500">Search for a user to invite to this room.</p>

            <input
              type="text"
              autoFocus
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              placeholder="Search by username..."
              className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="mt-3 max-h-64 overflow-y-auto">
              {userSearchLoading ? (
                <div className="flex justify-center py-6">
                  <Loader size="h-6 w-6" color="border-slate-500" />
                </div>
              ) : userSearchQuery.trim().length === 0 ? (
                <p className="py-6 text-center text-xs text-slate-400">Start typing to search.</p>
              ) : userSearchResults.length === 0 ? (
                <p className="py-6 text-center text-xs text-slate-400">No users found.</p>
              ) : (
                <ul className="divide-y divide-slate-200">
                  {userSearchResults.map((u) => (
                    <li key={u} className="flex items-center justify-between gap-3 py-2">
                      <span className="text-sm text-slate-800">{u}</span>
                      <Button
                        isLoading={addingUser === u}
                        onClick={() => addUserToRoom(u)}
                        className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-blue-700"
                      >
                        Add
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => setAddUserModal(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )} */}
      {leaveRoomModal && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4">
                <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
                    <h2 className="text-lg font-semibold text-slate-800">Leave Room</h2>
                    <p className="mt-1 text-sm text-slate-500">Are you sure you want to leave the room ?</p>
                    
                    <div className="mt-4 flex justify-end gap-2">
                        <Button
                            onClick={() => {
                                setLeaveRoomModal(false);
                            }}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={()=>{
                                leaveRoom();
                            }}
                            isLoading={btnLoading}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
                        >
                            Leave
                        </Button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}

export default ChatRoom;
