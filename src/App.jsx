import { RouterProvider } from 'react-router-dom';
import { routes } from './routes/router-config';
import AuthProvider from 'react-auth-kit';
import store from './auth/store.js';

function App() {
  return (
    <AuthProvider store={store}>
      <RouterProvider router={routes} />
    </AuthProvider>
  );
}

export default App;
