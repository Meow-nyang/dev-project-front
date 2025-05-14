import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import styles from '../styles/Home.module.scss';
import searchIcon from '../assets/SearchImage.svg';
import locationIcon from '../assets/location2.svg';
import BelowIcon from '../assets/below_icon.svg';
import Location from '../components/Location';
import NextIcon from '../assets/next_button.svg';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  // const currentItems = dummyData.slice(start, end);
  // const totalPages = Math.ceil(dummyData.length / ITEMS_PER_PAGE);

  const [posts, setPosts] = useState([]); // 실제 데이터 저장
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 처리용

  const currentItems = posts.slice(start, end); // dummyData → posts
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      console.log('fetchPosts 함수 작동 중');
      setLoading(true); // 로딩 시작
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}${import.meta.env.VITE_BOARD}/boards`,
          {
            params: {
              page: currentPage - 1, // ✅ React는 1부터 시작, Spring은 0부터
              size: ITEMS_PER_PAGE,
              sort: 'updatedAt,Desc',
            },
          },
        );

        // ✅ 서버 응답 구조가 CommonResDto 라면 result 내부가 실제 데이터
        const boardList = response.data.result.boards;

        setPosts(boardList); // 게시글 목록 상태 저장
        setTotalPages(response.data.result.totalPage); // 페이지 수 계산 (임시)
      } catch (err) {
        setError(err); // 에러 저장
      } finally {
        setLoading(false); // 로딩 끝
      }
    };

    fetchPosts(); // 함수 호출
  }, [currentPage]); // 페이지 바뀔 때마다 실행됨

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    console.log('입력 값:', event.target.value); // 추가된 부분
  };

  const handlesearch = () => {
    console.log('검색어:', searchTerm);
    // 실제 검색 로직 구현 (예: API 호출 등)
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

  const handlerecommend = () => {
    console.log('recommend clicked!');
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
            value={searchTerm} // 상태 변수와 연결
            onChange={handleInputChange} // 이벤트 핸들러 연결
          />
          <a onClick={handlesearch}>
            <img src={NextIcon} alt='Search' />
          </a>
        </div>
      </div>

      <div className={styles.recommendbutton}>
        <a onClick={handlerecommend}>오늘의 상품 추천</a>
      </div>

      <div className={styles.home}>
        <div className={styles.cardGrid}>
          {currentItems.map((item) => (
            <Link key={item.boardId} to={`board/${item.boardId}`}>
              <PostCard
                key={item.id}
                title={item.title}
                imageUrl={item.imageUrl}
                content={item.content}
                location={`${item.sido || ''} ${item.sigungu || ''} ${item.dong || ''}`}
              />
            </Link>
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
