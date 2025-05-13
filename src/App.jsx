import { RouterProvider } from 'react-router-dom';
import { routes } from './routes/router-config';
import { UserProvider } from '../src/context/UserContext';

function App() {
  return;
  <UserProvider>
    <RouterProvider router={routes} />
  </UserProvider>;
}

export default App;
