import { createBrowserRouter } from 'react-router-dom';
// import { useIsAuthenticated } from 'react-auth-kit';

import RootLayout from '../components/RootLayout';
import Home from '../pages/Home';
import Post from '../pages/Post.jsx';
import Chatting from '../pages/Chatting.jsx';

// // 인증된 사용자만 접근 가능하게 하는 라우트
// const ProtectedRoute = ({ children }) => {
//   const isAuthenticated = useIsAuthenticated();

//   // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
//   if (!isAuthenticated()) {
//     return <LoginPage />;
//   }

//   return children;
// };

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/post',
        element: <Post />,
      },
      {
        path: '/chat',
        element: <Chatting />,
      },
    ],
  },
]);
