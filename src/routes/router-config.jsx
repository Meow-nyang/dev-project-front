import { redirect, Route, Routes } from 'react-router-dom';
import RootLayout from '../components/RootLayout.jsx';
import Home from '../pages/Home.jsx';
import Post from '../pages/Post.jsx';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path='/' element={<RootLayout />}>
        <Route index element={<Home />} />
      </Route>
      <Route path='/post' element={<Post />} />
    </Routes>
  );
};
