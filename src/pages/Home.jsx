import { useState } from 'react';
import PostCard from '../components/PostCard';
import styles from '../styles/Home.module.scss';
import searchIcon from '../assets/SearchImage.svg';
import locationIcon from '../assets/location2.svg';
import BelowIcon from '../assets/below_icon.svg';
import Location from '../components/Location';
import NextIcon from '../assets/next_button.svg';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const dummyData = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  title: `게시물 제목 ${i + 1}`,
  content: `게시물 내용 ${i + 1}`,
}));

const ITEMS_PER_PAGE = 9;

const Home = () => {
  const [selectedLocation, setSelectedLocation] = useState('지역변경'); // 지역 상태 추가
  const [isLocationOpen, setIsLocationOpen] = useState(false); // 위치 모달 상태

  const [currentPage, setCurrentPage] = useState(1);

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const currentItems = dummyData.slice(start, end);
  const totalPages = Math.ceil(dummyData.length / ITEMS_PER_PAGE);

  const handlesearch = () => {
    console.log('Next icon clicked!');
  };
  const openLocationModal = () => {
    setIsLocationOpen(true);
  };

  const closeLocationModal = () => {
    setIsLocationOpen(false);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setIsLocationOpen(false); // 선택 후 모달 닫기
  };

  return (
    <div className={styles.home}>
      <div className={styles.topBar}>
        <button onClick={openLocationModal} className={styles.locationbotton}>
          <img src={locationIcon} alt='위치' />
          {selectedLocation}
          <img src={BelowIcon} alt='위치' />
        </button>

        <div className={styles.search}>
          <input
            type='text'
            placeholder='검색어를 입력하세요'
            className={styles.search__input}
          />
          <a onClick={handlesearch}>
            <img src={NextIcon} alt='Search' />
          </a>
        </div>
      </div>

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
      {/* Location Modal */}
      <Location
        isOpen={isLocationOpen}
        close={closeLocationModal}
        onSelectLocation={handleLocationSelect} // 지역 선택 핸들러 전달
      />
    </div>
  );
};

export default Home;
