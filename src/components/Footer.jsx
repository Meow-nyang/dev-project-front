import styles from '../styles/Footer.module.scss';
import logo from '../assets/image.svg';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      <div className={styles.bottom}>
        <div className={styles.menuWrapper}>
          <div className={styles.leftGroup}>
            <div className={styles.logo}>
              <img src={logo} alt='My Logo' className={styles.logo__img} />
              <Link to='/' className={styles.logo__text}>
                세컨존
              </Link>
            </div>
            <div className={styles.location}>
              <p>서울특별시 송파구</p>
            </div>
          </div>
          <div className={styles.list}>
            <Link to='/' className={styles.menuItem}>
              Home
            </Link>
            <Link to='/post' className={styles.menuItem}>
              Post
            </Link>
            <Link to='/chat' className={styles.menuItem}>
              Chat
            </Link>
            <Link to='/mypage' className={styles.menuItem}>
              MyPage
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.line}></div>
    </>
  );
};

export default Footer;
