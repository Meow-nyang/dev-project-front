import React from 'react';
import { Navigate, useLoaderData, useParams } from 'react-router-dom';
import styles from '../styles/BoardDetailPage.module.css';
import MarkdownPreview from '../components/write/MarkdownPreview.jsx';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import CommentBoard from './Comment.jsx';
const BoardDetailPage = () => {
  const { result } = useLoaderData();
  const authHeader = useAuthHeader();
  const authUser = useAuthUser();

  console.log(result);
  const boardId = useParams().boardId;

  console.log(boardId);
  return (
    <div>
      <div className={styles.productMainSection}>
        <MarkdownPreview title={result.title} />
      </div>
      <div className={styles.productTopSection}>
        <img
          src={result.imageUrl}
          width={'430px'}
          height={'430px'}
          className={styles.imageSection}
          alt={result.title}
        />
        <div className={styles.productSummarySection}>
          <div className='border-b-[rgb(238,238,238)] w-full'>
            <div className='text-2xl font-[600]'>{result.title}</div>
            <div className='h-[25px]'></div>
            <div className='text-[40px] font-[500]'>
              {result.price.toLocaleString()}원
            </div>
            <div className='h-[30px]'></div>
            <div>
              판매 여부: {result.status === 'ON_SALE' ? '판매 중' : '판매 완료'}
            </div>
            <div>판매자: {result.userName}</div>
          </div>
          {result.status === 'ON_SALE' && authUser?.name !== result.userName && (
            <div className='flex justify-end gap-2.5 text-[18px] font-bold leading-normal h-[56px] items-center'>
              <button
                className={styles.purchaseBtn}
                onClick={() => {
                  fetch(
                    `${import.meta.env.VITE_BACKEND_API}${import.meta.env.VITE_TRADE}`,
                    {
                      method: 'POST',
                      headers: {
                        Authorization: authHeader,
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        boardId,
                        userName: authUser.name,
                      }),
                    },
                  )
                    .then((res) => res.json())
                    .then((res) => {
                      alert('거래가 성공적으로 체결되었습니다.');
                      window.location.reload();
                    })
                    .catch((err) => alert(err));
                }}
              >
                바로구매
              </button>
            </div>
          )}
          <div> {result.content}</div>
        </div>
      </div>
      <CommentBoard />
    </div>
  );
};
export default BoardDetailPage;
