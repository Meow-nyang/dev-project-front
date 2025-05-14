import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/MyPage.module.css';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import { Navigate, useNavigate } from 'react-router-dom';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';

const MyPage = () => {
  const authUser = useAuthUser();
  const authHeader = useAuthHeader();
  const isAuthenticated = useIsAuthenticated();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const navigate = useNavigate();

  const tabRefs = useRef({});

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_BACKEND_API}${import.meta.env.VITE_BOARD}/${authUser.name}/boards`,
      {
        headers: {
          Authorization: authHeader,
        },
      },
    )
      .then((res) => res.json())
      .then((res) => setFilteredPosts(res.result));
  }, []);

  if (!isAuthenticated) return <Navigate to={'/'} replace />;

  return (
    <div className={styles.MyVelogContainer}>
      {/*<Header />*/}
      <main className={styles.MyVelogBody}>
        <div className={styles.MyVelogProfileHeader}>
          <div className={styles.MyVelogProfileInfo}>
            {/* <img
              src={profileImg}
              alt="프로필 이미지"
              className={styles.MyVelogProfileImage}
            /> */}
            <div className={styles.MyVelogProfile}>{authUser.name}</div>

            <h1 className={styles.MyVelogTitle}>{authUser.name}</h1>
          </div>
          <div className={styles.MyVelogFollowInfo}>
            <span className={styles.MyVelogFollowNum}>0</span>
            <span className={styles.MyVelogFollowText}>팔로워</span>
            <span className={styles.MyVelogFollowNum}>0</span>
            <span className={styles.MyVelogFollowText}>팔로잉</span>
          </div>
        </div>

        <div className={styles.MyVelogSearchContainer}>
          <input
            type='text'
            className={styles.MyVelogSearchInput}
            placeholder='검색어를 입력하세요'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className={styles.MyVelogSearchIcon}
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 24 24'
          >
            <path
              d='M23 21l-5.6-5.6a9 9 0 1 0-1.4 1.4L21 21l2 2zM10 16a6 6 0 1 1 0-12 6 6 0 0 1 0 12z'
              fill='#888'
            />
          </svg>
        </div>
        <div className={styles.MyVelogPostsContainer}>
          {filteredPosts.length > 0 ? (
            [...filteredPosts].reverse().map((post, index) => (
              <div
                key={post.boardId}
                className={`${styles.MyVelogPostCard} ${index !== filteredPosts.length - 1 ? styles.MyVelogWithBorder : ''}`}
                onClick={() => navigate(`/board/${post.boardId}`)}
              >
                <div className={styles.MyVelogPostContent}>
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    width={100}
                    height={100}
                    className='object-contain'
                  />
                  <p className={styles.MyVelogPostDescription}>{post.title}</p>
                </div>
                <div className={styles.MyVelogPostInfo}>
                  <p className={styles.MyVelogPostInfoText}>{post.tag}</p>
                </div>
              </div>
            ))
          ) : (
            <p>검색 결과가 없습니다.</p>
          )}
        </div>
      </main>
    </div>
  );
};
export default MyPage;
