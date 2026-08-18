import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Sidebar from './Sidebar';
import Feed from './Feed';
import Suggestions from './Suggestions';
import StoryView from './StoryView';
import Profile from './Profile';
import './App.css';

// Layout component — the main Instagram page
function Layout() {
  return (
    <div className="d-flex" style={{ maxWidth: '935px', margin: '0 auto' }}>
      <Sidebar />
      <Feed />
      <Suggestions />
    </div>
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