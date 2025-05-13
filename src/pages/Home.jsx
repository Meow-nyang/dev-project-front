import { useState } from 'react';
import PostCard from '../components/PostCard';
import styles from '../styles/Home.module.scss';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const dummyData = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  title: `게시물 제목 ${i + 1}`,
  content: `게시물 내용 ${i + 1}`,
}));

const ITEMS_PER_PAGE = 9;

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const currentItems = dummyData.slice(start, end);
  const totalPages = Math.ceil(dummyData.length / ITEMS_PER_PAGE);

  return (
    <div className={styles.home}>
      <div className={styles.cardGrid}>
        {currentItems.map((item) => (
          <PostCard key={item.id} title={item.title} content={item.content} />
        ))}
      </div>

      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={currentPage === i + 1 ? styles.active : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
