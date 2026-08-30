
import { useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';

import Sidebar from './components/Sidebar/Sidebar';
import Feed from './components/Feed/Feed';
import Suggestions from './components/Suggestions/Suggestions';
import StoryView from './pages/StoryView/StoryView';
import Profile from './pages/Profile/Profile';
import CreatePostModal from './components/Feed/CreatePostModal';

import Login from './pages/Login/Login';
import Signup from './pages/Login/Signup';
import Notifications from './pages/Notifications/Notifications';
import Messages from './pages/Messages/Messages';

import './App.css';

// Auth guard — redirects to /login if no user in localStorage
function RequireAuth() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

// Home layout with Sidebar + Feed + Suggestions
function HomeLayout() {
  const [showCreate, setShowCreate] = useState(false);
  return (
    <>
      <div className="d-flex" style={{ maxWidth: '935px', margin: '0 auto' }}>
        <Sidebar onCreate={() => setShowCreate(true)} />
        <Feed />
        <Suggestions />
      </div>
      {showCreate && (
        <CreatePostModal onClose={() => setShowCreate(false)} />
      )}
    </>
  );
}

// Router config
const router = createBrowserRouter([
  {
    // All authenticated routes live under RequireAuth
    element: <RequireAuth />,
    children: [
      { path: '/', element: <HomeLayout /> },
      { path: '/profile', element: <Profile /> },
      { path: '/notifications', element: <Notifications /> },
      { path: '/messages', element: <Messages /> },
      { path: '/story/:id', element: <StoryView /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;