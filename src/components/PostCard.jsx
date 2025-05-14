import styles from '../styles/PostCard.module.scss';
import locationIcon from '../assets/location.svg';
import sampleImage from '../assets/images/sample1.png';

const PostCard = ({ title, badge, location, imageUrl }) => {
  return (
    <div className={styles.card}>
      <img src={imageUrl} alt='썸네일' className={styles.thumbnail} />
      <div className={styles.content}>
        <div className={styles.heading}>
          <span className={styles.badge}>{badge}</span>
          <span className={styles.title}>{title}</span>
        </div>
        <div className={styles.shortInfo}>
          <img src={locationIcon} alt='위치' />
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
