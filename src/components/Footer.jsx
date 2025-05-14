import styles from '../styles/Footer.module.scss';
import logo from '../assets/image.svg';

const Footer = () => {
  return (
    <>
      <div className={styles.bottom}>
        <div className={styles.menuWrapper}>
          <div className={styles.leftGroup}>
            <div className={styles.logo}>
              <img src={logo} alt='My Logo' className={styles.logo__img} />
              <span className={styles.logo__text}>세컨존</span>
            </div>
            <div className={styles.location}>
              <p>서울특별시 송파구</p>
            </div>
          </div>
          <div className={styles.list}>
            <p>Home</p>
            <p>Post</p>
            <p>Chat</p>
            <p>MyPage</p>
          </div>
        </div>
      </div>
      <div className={styles.line}></div>
    </>
  );
};

export default Footer;
