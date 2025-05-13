import Header from '../components/Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div style={{ margin: '0 100px' }}>
      <Header />
      <main style={{ minHeight: '70vh', padding: '2rem', paddingTop: '80px' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
