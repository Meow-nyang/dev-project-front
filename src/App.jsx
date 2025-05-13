import { BrowserRouter, RouterProvider } from 'react-router-dom';
import { AppRouter } from './routes/router-config';
import AuthProvider from 'react-auth-kit';
import store from './auth/store.js';

function App() {
  return (
    <AuthProvider store={store}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
