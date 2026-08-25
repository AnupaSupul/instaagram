
import { useState } from 'react';
import { createBrowserRouter, RouterProvider,Navigate  } from 'react-router-dom';

import Sidebar from './components/Sidebar/Sidebar';
import Feed from './components/Feed/Feed';
import Suggestions from './components/Suggestions/Suggestions';
import StoryView from './pages/StoryView/StoryView';
import Profile from './pages/Profile/Profile';
import CreatePostModal from './components/Feed/CreatePostModal';

import Login from './pages/Login/Login';
import Signup from './pages/Login/Signup';

import './App.css';

// Layout component — the main Instagram page
// src/App.jsx
function Layout() {
    const [showCreate, setShowCreate] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

if (!user) {
    return <Navigate to="/login" replace />;  // redirect if not logged in
  }
  return (
    <>
      <div
        className="d-flex"
        style={{ maxWidth: '935px', margin: '0 auto' }}
      >
        <Sidebar onCreate={() => setShowCreate(true)} />

        <Feed />

        <Suggestions />
      </div>

      {showCreate && (
        <CreatePostModal
          onClose={() => setShowCreate(false)}
        />
      )}
    </>
  );
}

// Router config
const router = createBrowserRouter([
  {
    path: '/',element: <Layout />,
  },
  {
    path: '/story/:id',element: <StoryView />,
  },
  {
    path: '/profile',element: <Profile />,
  },
  { path: '/login',     element: <Login /> },      // ← new
  { path: '/signup',    element: <Signup /> },      // ← new
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;