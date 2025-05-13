import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import RootLayout from '../components/RootLayout.jsx';
import Home from '../pages/Home.jsx';
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

// export const AppRouter = () => {
//   return (
//     <Routes>
//       <Route path='/' element={<RootLayout />}>
//         <Route index element={<Home />} />
//       </Route>
//       <Route path='/post' element={<Post />} />
//     </Routes>
//   );
// };

export const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<RootLayout />}>
        <Route index element={<Home />} />
      </Route>
      <Route path='/post' element={<Post />} />
    </>,
  ),
);
