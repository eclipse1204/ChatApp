import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router';
import Loader from '../components/Loader';
import { get, post } from '../config/config';
import toast from 'react-hot-toast';
import Button from '../components/Button';

function AllChatRooms() {
    const navigate=useNavigate();
    const [data,setData] = useState({
        rooms:[],
        currentPage:0,
        total:0,
        totalPages:0
    });
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const ROOMCODE = useRef(null);
    const ROOMNAME = useRef(null);
    const [loading, setLoading] = useState(true);
    const [btnLoading,setBtnLoading]=useState(false);
    const [searchQuery,setSearchQuery]=useState("");
    const [timeOut,setTimeOut] = useState(undefined);

    const fetchAllRooms=(page=0,q="")=>{
        setLoading(true);
        const trimmed=q.trim();
        const url=`/api/v1/rooms/fetchRooms?pageNumber=${page}&pageSize=10${trimmed?`&q=${trimmed}`:""}`;
        get(url,(e,r)=>{
            if(r){
                setData({
                    rooms:r?.items,
                    currentPage:page,
                    total:r?.total,
                    totalPages:r?.pages
                })
            }
            else if(e){
                toast.error(e?.data?.message);
            }
            setLoading(false)
        });
    }

    const debounce=(cb)=>{
        if(timeOut){
            clearTimeout(timeOut);
        }
        let val=setTimeout(cb,300);
        setTimeOut(val);
    }

    useEffect(()=>{
        setLoading(true)
        if(searchQuery?.length){
            debounce(()=>{fetchAllRooms(0,searchQuery)});
        }
        else{
            if(timeOut){
                clearTimeout(timeOut);
            }
            fetchAllRooms();
        }
    },[searchQuery]);

    const createRoom=()=>{
        let name=ROOMNAME?.current?.value;
        if(!name){
            toast.error("Please enter room name");
            return;
        }
        setBtnLoading(true);
        post("/api/v1/rooms/create",{roomName:name},(e,r)=>{
            if(r){
                fetchAllRooms();
                toast.success("Room created successfully");
                setIsCreateModalOpen(false);
            }
            else if(e){
                toast.error(e?.data?.message);
            }
            setBtnLoading(false);
        })
    }

    const joinRoom=()=>{
        let code=ROOMCODE?.current?.value;
        if(!code){
            toast.error("Please enter room code");
            return;
        }
        setBtnLoading(true);
        post(`/api/v1/rooms/join/${code}`,{},(e,r)=>{
            if(r){
                fetchAllRooms();
                toast.success("Room joined successfully");
                setIsJoinModalOpen(false);
            }
            else if(e){
                toast.error(e?.data?.message);
            }
            setBtnLoading(false);
        })
    }

    return (
        <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Chat Rooms</h1>
                    <p className="text-sm text-slate-500">
                    Choose a room to start chatting.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsJoinModalOpen(true)}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 cursor-pointer"
                    >
                        Join Room
                    </button>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 cursor-pointer"
                    >
                        Create Room
                    </button>
                </div>
            </div>
            <div className='flex w-full justify-end'>
                <div className="mb-5">
                    <div className='relative'>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 28 28"
                            strokeWidth={1.8}
                            stroke="currentColor"
                            style={{'top':'0.4rem',left:'0.4rem'}}
                            className="pointer-events-none absolute h-6 w-6 text-slate-400"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m21 21-4.3-4.3m1.8-5.2a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                            />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search rooms by name..."
                            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-9 text-sm text-slate-700 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>
                </div>
            </div>
            {
                loading?<div className="flex justify-center w-full h-full mt-4"><Loader/></div>:
                <>
                    <div className="flex flex-wrap gap-4">
                        {data?.rooms?.length === 0 && (
                            <div className="w-full rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                                {searchQuery ? `No rooms match "${searchQuery}".` : "No rooms yet."}
                            </div>
                        )}
                        {data?.rooms?.map((room) => (
                        <div
                            key={room}
                            onClick={() =>
                                navigate(`/home/${room.id}`)
                            }
                            className="flex flex-col text-center rounded-xl border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md md:w-[calc(33.333%-0.67rem)] lg:w-[calc(25%-0.75rem)] cursor-pointer"
                        >
                            {room?.roomName}
                            <span style={{'fontSize':'8px'}}>Room Id : {room?.id}</span>
                            <span style={{'fontSize':'8px'}}>{room?.roomId}</span>
                        </div>
                        ))}
                    </div>
                    {data?.totalPages > 0 && (
                        <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm sm:flex-row">
                            <div>
                                Page <span className="font-semibold text-slate-800">{data.currentPage + 1}</span> of{' '}
                                <span className="font-semibold text-slate-800">{data.totalPages}</span>
                                <span className="mx-2 text-slate-300">|</span>
                                Total <span className="font-semibold text-slate-800">{data.total}</span>{' '}
                                {data.total === 1 ? 'room' : 'rooms'}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => fetchAllRooms(data?.currentPage - 1, searchQuery)}
                                    disabled={data.currentPage <= 0}
                                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => fetchAllRooms(data?.currentPage + 1, searchQuery)}
                                    disabled={data.currentPage + 1 >= data.totalPages}
                                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            }

            {isJoinModalOpen && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
                        <h2 className="text-lg font-semibold text-slate-800">Join Room</h2>
                        <p className="mt-1 text-sm text-slate-500">Enter room code.</p>
                        <input
                            ref={ROOMCODE}
                            type="text"
                            placeholder="Room code"
                            className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <Button
                                onClick={() => {
                                    setIsJoinModalOpen(false);
                                }}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                            >
                                Cancel
                            </Button>
                            <Button
                                isLoading={btnLoading}
                                onClick={() => {
                                    joinRoom()
                                }}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
                            >
                                Join
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {isCreateModalOpen && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
                        <h2 className="text-lg font-semibold text-slate-800">Create Room</h2>
                        <p className="mt-1 text-sm text-slate-500">Set a name for your new room.</p>
                        <input
                            ref={ROOMNAME}
                            type="text"
                            placeholder="New room name"
                            className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <Button
                                onClick={() => {
                                    setIsCreateModalOpen(false)
                                }}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={()=>{
                                    createRoom();
                                }}
                                isLoading={btnLoading}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
                            >
                                Create
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AllChatRooms