import React from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/userSlice';

function SidePane() {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const userName=useSelector((state)=>state.user.userName);
    const location=useLocation();
    const isNotifications=location.pathname.startsWith('/home/notifications');
    const isRooms=!isNotifications;

    const tabClass=(active)=>
        `w-full rounded-lg px-3 py-2 text-left text-sm font-medium cursor-pointer ${
            active
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
        }`;

    return (
        <div className="w-64 border-r border-slate-200 bg-slate-50 p-5 flex flex-col">
            <h2 className="text-xl font-bold text-slate-800">Dashboard</h2>
            <div className="mt-4 rounded-lg border border-slate-200 bg-white px-3 py-2">
                <div className="flex items-center gap-2 text-slate-800">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-slate-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.118a7.5 7.5 0 0 1 15 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.5-1.632Z"
                        />
                    </svg>
                    <p className="text-sm font-semibold">{userName || 'User'}</p>
                </div>
            </div>
            <div className="mt-8 space-y-2">
                <button
                    onClick={()=>navigate("/home")}
                    className={tabClass(isRooms)}
                >
                    Chat Rooms
                </button>
                {/* <button
                    onClick={()=>navigate("/home/notifications")}
                    className={tabClass(isNotifications)}
                >
                    Notifications
                </button> */}
            </div>

            <button
                onClick={() => {
                    dispatch(logout());
                    navigate('/login');
                }}
                className="text-center mt-auto w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white cursor-pointer"
            >
                Log Out
            </button>
        </div>
    )
}

export default SidePane