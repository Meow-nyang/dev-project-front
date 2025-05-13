import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/image.svg';
import searchIcon from '../assets/SearchImage.svg';
import styles from '../styles/Header.module.scss';
import SignIn from './SignIn';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

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

  return (
    <header className={styles.header}>
      {/* Logo */}
      <div className={styles.logo}>
        <img src={logo} alt='My Logo' className={styles.logo__img} />
        <span className={styles.logo__text}>세컨존</span>
      </div>

      {/* Search */}
      <div className={styles.search}>
        <img src={searchIcon} alt='Search' className={styles.search__icon} />
        <input
          type='text'
          placeholder='검색어를 입력하세요'
          className={styles.search__input}
        />
      </div>
      {/* Menu */}
      <nav className={styles.menu}>
        <Link to='/'>Home</Link>
        <Link to='/post'>Post</Link>

        <Link to='/chat' state={chatData}>
          <button className={styles.button}>Chat</button>
        </Link>
        <Link to='/mypage'>MyPage</Link>
        <Link to='/logout'>LogOut</Link>
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
