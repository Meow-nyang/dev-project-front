import React, { useEffect, useRef, useState } from 'react';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import styles from '../../pages/PostWrite.module.css';
import remarkBreaks from 'remark-breaks';

const MarkdownPreview = ({ markdown, title }) => {
  const [html, setHtml] = useState('');
  const previewRef = useRef(null);
  const prevHtmlRef = useRef('');
  const bottomRef = useRef(null);

  useEffect(() => {
    const processMarkdown = async () => {
      if (!markdown) {
        setHtml('');
        return;
      }

      try {
        // 마크다운을 HTML로 변환
        const result = await unified()
          .use(remarkParse)
          .use(remarkBreaks)
          .use(remarkRehype, { allowDangerousHtml: true })
          .use(rehypeRaw)
          .use(rehypeStringify)
          .process(markdown);
        setHtml(String(result));
      } catch (error) {
        console.error('마크다운 변환 오류:', error);
      }
    };
    processMarkdown();
  }, [markdown]);

  useEffect(() => {
    // preview 영역이 있고 스크롤이 생긴 상태라면 (scrollHeight > clientHeight)
    // 이전 html이 존재하고, 새 html이 이전 html의 접두사로 시작하면 (append 상황)
    if (!bottomRef.current) return;
    if (prevHtmlRef.current && html.startsWith(prevHtmlRef.current)) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    // 현재 html 값을 prevHtmlRef에 저장해둡니다.
    prevHtmlRef.current = html;
  }, [html]);

  return (
    <div className={styles.previewWrapper}>
      <div className={styles.previewContainer} ref={previewRef}>
        {title && <h1 className={styles.previewTitle}>{title}</h1>}

        {html ? (
          <>
            <div
              className={styles.previewContent}
              dangerouslySetInnerHTML={{ __html: html }}
            />
            <div ref={bottomRef} />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default MarkdownPreview;
