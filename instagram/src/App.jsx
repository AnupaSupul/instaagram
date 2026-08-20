
import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Sidebar from './components/Sidebar/Sidebar';
import Feed from './components/Feed/Feed';
import Suggestions from './components/Suggestions/Suggestions';
import StoryView from './pages/StoryView/StoryView';
import Profile from './pages/Profile/Profile';
import CreatePostModal from './components/Feed/CreatePostModal';

import './App.css';

// Layout component — the main Instagram page
function Layout() {
  const [showCreate, setShowCreate] = useState(false);
  return (
    <>
    <div className="d-flex" 
          style={{ maxWidth: '935px', margin: '0 auto' }}>

      <Sidebar onCreate={()=>setShowCreate(true)} />
      <Feed />
      <Suggestions />
    </div>

    {showCreate && (
      <CreatePostModal onClose={()=>setShowCreate(false)} />
      )}
    </>
  );
}

// Router config
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
  },
  {
    path: '/story/:id',
    element: <StoryView />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;