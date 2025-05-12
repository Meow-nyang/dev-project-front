import React, { useState } from 'react';
import styles from './PostWrite.module.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/addon/display/placeholder';
import WriteMarkdownEditor from '../components/write/WriteMarkdownEditor.jsx';
import MarkdownPreview from '../components/write/MarkdownPreview.jsx';
import { useNavigate } from 'react-router-dom';
import PublishModal from '../components/Modal/PublishModal.jsx';

function PostWrite() {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState([]);
  const [markdown, setMarkdown] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const modalClose = () => {
    setIsModalOpen(false);
  };

  const handleChangeTitle = (title) => {
    setTitle(title);
  };

  const handleChangeMarkdown = (content) => {
    setMarkdown(content);
  };

  // 태그 변경 핸들러 예시
  const handleChangeTags = (newTags) => {
    setTags(newTags);
  };

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <WriteMarkdownEditor
            title={title}
            markdown={markdown}
            tags={tags} // 태그 배열 전달
            onChangeTitle={handleChangeTitle}
            onChangeMarkdown={handleChangeMarkdown}
            onChangeTags={handleChangeTags} // 태그 변경 핸들러 추가
            theme="light"
          />
          <footer>
            <div className={styles.footerSection}>
              <button
                className={styles.footerButton}
                onClick={() => navigate(-1)}
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.footerSvg}
                >
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
                </svg>
                <span className={styles.footerSpan}>나가기</span>
              </button>
              <div className={styles.footerButtonContainer}>
                <button
                  className={`${styles.footerCommonBtn} ${styles.footerTemporarySaveBtn}`}
                >
                  임시저장
                </button>
                <button
                  className={`${styles.footerCommonBtn} ${styles.footerPublishBtn}`}
                  onClick={() => setIsModalOpen(true)}
                >
                  출간하기
                </button>
              </div>
            </div>
          </footer>
        </div>

        <div className={styles.right}>
          <MarkdownPreview markdown={markdown} title={title} />
        </div>
      </div>
      {isModalOpen && (
        <PublishModal
          title={title}
          tags={tags}
          markdown={markdown}
          onClose={modalClose}
        />
      )}
    </>
  );
}

export default PostWrite;
