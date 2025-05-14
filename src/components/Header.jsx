import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/image.svg';
import styles from '../styles/Header.module.scss';
import SignIn from './SignIn';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { redirect } from 'react-router-dom';

const Header = () => {
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated); // 로그인 상태

  // 채팅 데이터 생성 (서버 연결 없이 테스트용)
  const chatData = {
    roomId: 1,
    roomName: '디지털 상품 채팅',
  };

  const toggleCategoryMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const openSignInModal = () => {
    setIsSignInOpen(true);
  };

  const closeSignInModal = () => {
    setIsSignInOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    signOut();
    redirect('/');
  };

  return (
    <header className={styles.header}>
      {/* Logo */}
      <div className={styles.logo}>
        <img src={logo} alt='My Logo' className={styles.logo__img} />
        <span className={styles.logo__text}>세컨존</span>
      </div>

      {/* Menu */}
      <nav className={styles.menu}>
        {/* 로그인 상태에 따라 메뉴 표시 */}
        {!isLoggedIn ? (
          <>
            <a onClick={openSignInModal} className={styles.loginbotton}>
              Login
            </a>
            <a href='/'>Home</a>
          </>
        ) : (
          <>
            <a href='/post'>Post</a>
            <Link to='/chat' state={chatData}>
              <button className={styles.button}>Chat</button>
            </Link>
            <a href='/mypage'>MyPage</a>
            <button onClick={handleLogout}>LogOut</button>
          </>
        )}
        {/* 햄버거 메뉴 버튼 */}
        <a className={styles.hamburger} onClick={toggleCategoryMenu}>
          ☰
        </a>
      </nav>

      {/* Category Modal */}
      {isMenuOpen && (
        <div className={styles.modal}>
          <ul>
            <li>디지털</li>
            <li>의류</li>
            <li>도서</li>
            <li>기타</li>
          </ul>
        </div>
      )}

      {/* SignIn Modal */}
      <SignIn isOpen={isSignInOpen} close={closeSignInModal} />
    </header>
  );
};

export default Header;
