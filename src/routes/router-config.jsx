import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

import RootLayout from '../components/RootLayout.jsx';
import Home from '../pages/Home.jsx';
import Post from '../pages/Post.jsx';
import Chatting from '../pages/Chatting.jsx';
import Signup from '../pages/SignupForm.jsx';
import BoardDetailPage from '../pages/BoardDetailPage.jsx';
import MyPage from '../pages/MyPage.jsx'; // ✅ 회원가입 컴포넌트 import

export const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='chat' element={<Chatting />} />
        <Route
          path='/board/:boardId'
          loader={async ({ params }) => {
            const res = await fetch(
              `${import.meta.env.VITE_BACKEND_API}${import.meta.env.VITE_BOARD}/${params.boardId}`,
            );
            const data = await res.json();
            console.log(data);

            return data;
          }}
          element={<BoardDetailPage />}
        />
        <Route path='/mypage' element={<MyPage />} />
      </Route>
      <Route path='/post' element={<Post />} />
      <Route path='/signup' element={<Signup />} />
    </>,
  ),
);
