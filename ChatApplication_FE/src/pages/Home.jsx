import React from 'react';
import { Route, Routes } from 'react-router-dom';
import SidePane from '../components/SidePane';
import AllChatRooms from './AllChatRooms';
import ChatRoom from './ChatRoom';
import Notifications from './Notifications';


function Home() {
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mx-auto flex h-[calc(100vh-2rem)] max-w-7xl overflow-hidden rounded-2xl bg-white shadow-lg md:h-[calc(100vh-3rem)]">
        <SidePane/>
        <Routes>
          <Route path="/" element={<AllChatRooms/>}/>
          <Route path="/notifications" element={<Notifications/>}/>
          <Route path="/:id" element={<ChatRoom/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default Home;
