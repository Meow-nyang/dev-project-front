import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../components/RootLayout';
import Home from '../pages/Home';

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
]);
