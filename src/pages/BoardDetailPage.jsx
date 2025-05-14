import React from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import styles from '../styles/BoardDetailPage.module.css'
import MarkdownPreview from '../components/write/MarkdownPreview.jsx';
const BoardDetailPage = () => {
  const { result } = useLoaderData();

  console.log(result);
  const boardId = useParams().boardId;

  console.log(boardId);
  return (
    <div>
      <div className={styles.productTopSection}>
        <img src={result.imageUrl} width={'430px'} height={'430px'} className={styles.imageSection}  alt={result.title}/>
        <div className={styles.productSummarySection}>
          <div className="border-b-[rgb(238,238,238)] w-full">
            <div className="text-2xl font-[600]">{result.title}</div>
            <div className="h-[25px]"></div>
            <div className="text-[40px] font-[500]">{result.price.toLocaleString()}원</div>
            <div className="h-[30px]"></div>
          </div>
          <div></div>
          <div className="flex justify-end gap-2.5 text-[18px] font-bold leading-normal h-[56px] items-center">
            <button className={styles.purchaseBtn}>바로구매</button>
          </div>
        </div>
      </div>
      <div className={styles.productMainSection}>
        <MarkdownPreview title={result.title} markdown={result.content} />
      </div>
    </div>
  );
};
export default BoardDetailPage;
