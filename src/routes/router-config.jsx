import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../components/RootLayout';
import Home from '../pages/Home';
import Post from '../pages/Post.jsx';

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },

    ],
  },
  {
    path: '/post',
    element: <Post />
  }
]);
