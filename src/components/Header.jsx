import React, { useState } from 'react';
import logo from '../assets/image.svg';
import styles from '../styles/Header.module.scss';
import SignIn from './SignIn';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태

  const toggleCategoryMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const openSignInModal = () => {
    setIsSignInOpen(true);
  };

  const closeSignInModal = () => {
    setIsSignInOpen(false);
    setIsLoggedIn(true); // 예시용 로그인 처리
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
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
        {!isLoggedIn ? (
          <div className={styles.menuLeft}>
            <a onClick={openSignInModal} className={styles.loginbotton}>
              Login
            </a>
            <a href='/'>Home</a>
          </div>
        ) : (
          <>
            <a href='/post'>Post</a>
            <a href='/chat'>Chat</a>
            <a href='/mypage'>MyPage</a>
            <a onClick={handleLogout}>LogOut</a>
          </>
        )}
        <button className={styles.hamburger} onClick={toggleCategoryMenu}>
          ☰
        </button>
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
