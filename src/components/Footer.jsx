import '../styles/Footer.module.scss';

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footer__content'>
        <p>© 2025 Your Company. All rights reserved.</p>
        <div className='footer__links'>
          <a href='/privacy'>Privacy Policy</a>
          <a href='/terms'>Terms of Use</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
