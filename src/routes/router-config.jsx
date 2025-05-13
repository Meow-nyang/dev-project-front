import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import RootLayout from '../components/RootLayout.jsx';
import Home from '../pages/Home.jsx';
import Post from '../pages/Post.jsx';
import Chatting from '../pages/Chatting.jsx';

export const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path='/chat' element={<Chatting />} />
      </Route>
      <Route path='/post' element={<Post />} />
    </>,
  ),
);
