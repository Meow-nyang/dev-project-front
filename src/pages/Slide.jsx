import { useState, useEffect } from 'react';
import styles from '../styles/Slide.module.scss';
const Slide = () => {
  const slideImages = [
    {
      id: 0,
      img: 'https://pethroom.com/web/upload/images/3F_restaurant_web.gif',
    },
    {
      id: 1,
      img: 'https://shop-phinf.pstatic.net/20230412_132/1681308834579IXC0M_JPEG/PC_main_bnr_C0CCC1EEC4AD_BFC3B6F3C0CCC7C110kg_C3E2BDC3.jpg?type=m10000_10000',
    },
    {
      id: 2,
      img: 'https://pethroom.com/web/upload/images/1F_playroom_web.gif',
    },
    {
      id: 3,
      img: 'https://shop-phinf.pstatic.net/20230508_291/1683539721258Oj7Em_JPEG/PC-1.jpg?type=m10000_10000',
    },
  ];

  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval); // 클리어 필요
  }, [currentIdx]);

  // 이미지 앞, 뒤로 넘어가는 함수
  const preSlide = () => {
    setCurrentIdx(
      (preIdx) => (preIdx - 1 + slideImages.length) % slideImages.length,
    );
  };
  const nextSlide = () => {
    setCurrentIdx((preIdx) => (preIdx + 1) % slideImages.length);
  };

  return (
    <div className={styles.banner_wrap}>
      <div className={styles.slide_banner}>
        {slideImages.map((image, index) => (
          <img
            key={index}
            className={`${styles.banner_image} ${
              index === currentIdx ? styles.active : ''
            }`}
            src={image.img}
            // src={slideImages[currentIdx].img}
            alt={`slide ${index}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slide;
