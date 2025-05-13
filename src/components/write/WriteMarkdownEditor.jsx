import React, { useCallback, useEffect, useRef, useState } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/addon/display/placeholder';
import '../../common/atom-one-light.css';
import '../../common/atom-one-dark.css';
import ToolbarComponent from './ToolbarComponent.jsx';
import AddLink from './AddLink';
import styles from '../../pages/PostWrite.module.css';

const WriteMarkdownEditor = ({
  onChangeMarkdown,
  onChangeTitle,
  onChangeTags,
  title,
  markdown = '',
  initialBody = '',
  tags = [],
}) => {
  // refs
  const block = useRef(null);
  const toolbarElement = useRef(null);
  const editorElement = useRef(null);
  const titleRef = useRef(null);
  const tagInputRef = useRef(null);
  const editorWrapperRef = useRef(null);

  // CodeMirror 직접 사용 대신 textarea 사용
  const [directMarkdown, setDirectMarkdown] = useState(
    initialBody || markdown || '',
  );
  const [currentField, setCurrentField] = useState('markdown'); // 'title', 'tags', 'markdown'

  // state
  const [addLink, setAddLink] = useState({
    visible: false,
    top: 0,
    left: 0,
    stickToRight: false,
  });
  const [hideUpper, setHideUpper] = useState(false);
  const [localTags, setLocalTags] = useState(tags);
  const [tagInput, setTagInput] = useState('');

  // 마크다운 내용 변경 처리
  const handleMarkdownChange = useCallback(
    (e) => {
      const value = e.target.value;
      setDirectMarkdown(value);
      if (onChangeMarkdown) {
        onChangeMarkdown(value);
      }
    },
    [onChangeMarkdown],
  );

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback((e) => {
    if (e.target.scrollTop > 10) {
      setHideUpper(true);
    } else {
      setHideUpper(false);
    }
  }, []);

  // 커서 위치로 스크롤 이동 처리
  const scrollToCursor = useCallback((textarea, cursorPos) => {
    // 현재 커서 위치까지의 텍스트를 추출
    const text = textarea.value;
    const textBeforeCursor = text.substring(0, cursorPos);

    // 줄 수 계산
    const lines = textBeforeCursor.split('\n');
    const lineCount = lines.length;

    // 현재 줄의 높이와 위치 추정
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    const approxPos = (lineCount - 1) * lineHeight;

    // textarea의 현재 스크롤 정보
    const scrollTop = textarea.scrollTop;
    const clientHeight = textarea.clientHeight;

    // 커서 위치가 보이는 영역을 벗어났는지 확인
    if (
      approxPos < scrollTop ||
      approxPos > scrollTop + clientHeight - lineHeight * 2
    ) {
      // 스크롤 위치 조정 - 커서 위치가 중앙에 오도록
      textarea.scrollTop = Math.max(0, approxPos - clientHeight / 2);
    }
  }, []);

  // 툴바 클릭 처리 - textarea 직접 조작 버전
  const handleToolbarClick = useCallback(
    (mode) => {
      if (!editorElement.current) return;

      const textarea = editorElement.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = directMarkdown.substring(start, end);
      const before = directMarkdown.substring(0, start);
      const after = directMarkdown.substring(end);

      let newText = directMarkdown;
      let newCursorPos = start;

      const selectCurrentLine = () => {
        const text = directMarkdown;
        let lineStart = start;
        while (lineStart > 0 && text[lineStart - 1] !== '\n') {
          lineStart--;
        }

        let lineEnd = end;
        while (lineEnd < text.length && text[lineEnd] !== '\n') {
          lineEnd++;
        }

        return {
          start: lineStart,
          end: lineEnd,
          text: text.substring(lineStart, lineEnd),
        };
      };

      switch (mode) {
        case 'heading1': {
          const line = selectCurrentLine();
          const lineText = line.text;

          if (lineText.startsWith('# ')) {
            newText =
              before.substring(0, line.start) +
              lineText.substring(2) +
              after.substring(line.end - end);
            newCursorPos = start - 2;
          } else if (lineText.match(/^#{2,} /)) {
            const newLineText = '# ' + lineText.replace(/^#{2,} /, '');
            newText =
              before.substring(0, line.start) +
              newLineText +
              after.substring(line.end - end);
            newCursorPos = start;
          } else {
            newText =
              before.substring(0, line.start) +
              '# ' +
              lineText +
              after.substring(line.end - end);
            newCursorPos = start + 2;
          }
          break;
        }
        case 'heading2': {
          const line = selectCurrentLine();
          const lineText = line.text;

          if (lineText.startsWith('## ')) {
            newText =
              before.substring(0, line.start) +
              lineText.substring(3) +
              after.substring(line.end - end);
            newCursorPos = start - 3;
          } else if (lineText.startsWith('# ')) {
            newText =
              before.substring(0, line.start) +
              '## ' +
              lineText.substring(2) +
              after.substring(line.end - end);
            newCursorPos = start + 1;
          } else if (lineText.match(/^#{3,} /)) {
            newText =
              before.substring(0, line.start) +
              '## ' +
              lineText.replace(/^#{3,} /, '') +
              after.substring(line.end - end);
            newCursorPos = start;
          } else {
            newText =
              before.substring(0, line.start) +
              '## ' +
              lineText +
              after.substring(line.end - end);
            newCursorPos = start + 3;
          }
          break;
        }
        case 'heading3': {
          const line = selectCurrentLine();
          const lineText = line.text;

          if (lineText.startsWith('### ')) {
            newText =
              before.substring(0, line.start) +
              lineText.substring(4) +
              after.substring(line.end - end);
            newCursorPos = start - 4;
          } else if (lineText.match(/^#{1,2} /)) {
            newText =
              before.substring(0, line.start) +
              '### ' +
              lineText.replace(/^#{1,2} /, '') +
              after.substring(line.end - end);
            newCursorPos = start + 1;
          } else {
            newText =
              before.substring(0, line.start) +
              '### ' +
              lineText +
              after.substring(line.end - end);
            newCursorPos = start + 4;
          }
          break;
        }
        case 'heading4': {
          const line = selectCurrentLine();
          const lineText = line.text;

          if (lineText.startsWith('#### ')) {
            newText =
              before.substring(0, line.start) +
              lineText.substring(5) +
              after.substring(line.end - end);
            newCursorPos = start - 5;
          } else if (lineText.match(/^#{1,3} /)) {
            newText =
              before.substring(0, line.start) +
              '#### ' +
              lineText.replace(/^#{1,3} /, '') +
              after.substring(line.end - end);
            newCursorPos = start + 1;
          } else {
            newText =
              before.substring(0, line.start) +
              '#### ' +
              lineText +
              after.substring(line.end - end);
            newCursorPos = start + 5;
          }
          break;
        }
        case 'bold': {
          if (selectedText) {
            if (selectedText.startsWith('**') && selectedText.endsWith('**')) {
              newText = before + selectedText.slice(2, -2) + after;
              newCursorPos = start;
            } else {
              newText = before + '**' + selectedText + '**' + after;
              newCursorPos = end + 4;
            }
          } else {
            newText = before + '****' + after;
            newCursorPos = start + 2;
          }
          break;
        }
        case 'italic': {
          if (selectedText) {
            if (selectedText.startsWith('*') && selectedText.endsWith('*')) {
              newText = before + selectedText.slice(1, -1) + after;
              newCursorPos = start;
            } else {
              newText = before + '*' + selectedText + '*' + after;
              newCursorPos = end + 2;
            }
          } else {
            newText = before + '**' + after;
            newCursorPos = start + 1;
          }
          break;
        }
        case 'strike': {
          if (selectedText) {
            if (selectedText.startsWith('~~') && selectedText.endsWith('~~')) {
              newText = before + selectedText.slice(2, -2) + after;
              newCursorPos = start;
            } else {
              newText = before + '~~' + selectedText + '~~' + after;
              newCursorPos = end + 4;
            }
          } else {
            newText = before + '~~~~' + after;
            newCursorPos = start + 2;
          }
          break;
        }
        case 'blockquote': {
          const line = selectCurrentLine();
          const lineText = line.text;

          if (lineText.startsWith('> ')) {
            newText =
              before.substring(0, line.start) +
              lineText.substring(2) +
              after.substring(line.end - end);
            newCursorPos = start - 2;
          } else {
            newText =
              before.substring(0, line.start) +
              '> ' +
              lineText +
              after.substring(line.end - end);
            newCursorPos = start + 2;
          }
          break;
        }
        case 'link': {
          setAddLink({
            visible: true,
            top: textarea.offsetTop + 40,
            left: textarea.offsetLeft + 100,
            stickToRight: false,
          });
          return; // 여기서는 텍스트 변경 없음
        }
        case 'image': {
          if (selectedText) {
            newText = before + '![' + selectedText + ']()' + after;
            newCursorPos = end + 3;
          } else {
            newText = before + '![이미지 설명](이미지 주소)' + after;
            newCursorPos = start + 2;
          }
          break;
        }
        case 'codeblock': {
          if (selectedText) {
            newText = before + '```\n' + selectedText + '\n```' + after;
            newCursorPos = end + 6;
          } else {
            newText = before + '```\n\n```' + after;
            // 커서를 코드 블록 내부로 위치시키기
            newCursorPos = start + 4;
          }
          break;
        }
        default:
          return;
      }

      // 변경된 텍스트 설정
      setDirectMarkdown(newText);
      if (onChangeMarkdown) {
        onChangeMarkdown(newText);
      }

      // DOM 업데이트 후 커서 위치 및 포커스 설정
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        setCurrentField('markdown');

        scrollToCursor(textarea, newCursorPos);
      }, 0);
    },
    [directMarkdown, onChangeMarkdown, scrollToCursor],
  );

  // 링크 추가 완료 처리
  const handleConfirmAddLink = useCallback(
    (link) => {
      if (!editorElement.current) return;

      const textarea = editorElement.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = directMarkdown.substring(start, end);
      const before = directMarkdown.substring(0, start);
      const after = directMarkdown.substring(end);

      let newText;
      let newCursorPos;

      if (selectedText) {
        newText = before + '[' + selectedText + '](' + link + ')' + after;
        newCursorPos = end + link.length + 4;
      } else {
        newText = before + '[링크](' + link + ')' + after;
        newCursorPos = start + link.length + 8;
      }

      setDirectMarkdown(newText);
      if (onChangeMarkdown) {
        onChangeMarkdown(newText);
      }

      setAddLink((prevState) => ({
        ...prevState,
        visible: false,
      }));

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        setCurrentField('markdown');
      }, 0);
    },
    [directMarkdown, onChangeMarkdown],
  );

  // 링크 추가 취소 처리
  const handleCancelAddLink = useCallback(() => {
    setAddLink((prevState) => ({
      ...prevState,
      visible: false,
    }));

    if (editorElement.current) {
      editorElement.current.focus();
      setCurrentField('markdown');
    }
  }, []);

  // 타이틀 변경 처리
  const handleTitleChange = useCallback(
    (e) => {
      if (onChangeTitle) {
        onChangeTitle(e.target.value);
      }
      setCurrentField('title');
    },
    [onChangeTitle],
  );

  // 태그 입력 처리
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  // 태그 포커스 처리
  const handleTagInputFocus = useCallback(() => {
    setCurrentField('tags');
  }, []);

  // Enter 키나 콤마로 태그 추가
  const handleTagInputKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        if (tagInput.trim() && !localTags.includes(tagInput.trim())) {
          const newTags = [...localTags, tagInput.trim()];
          setLocalTags(newTags);
          if (onChangeTags) {
            onChangeTags(newTags);
          }
          setTagInput('');
        }
      }
    },
    [localTags, tagInput, onChangeTags],
  );

  // 태그 클릭으로 삭제 (Velog 스타일)
  const handleRemoveTag = useCallback(
    (tagToRemove) => {
      const newTags = localTags.filter((tag) => tag !== tagToRemove);
      setLocalTags(newTags);
      if (onChangeTags) {
        onChangeTags(newTags);
      }

      // 태그 삭제 후 태그 입력창에 포커스
      if (tagInputRef.current) {
        tagInputRef.current.focus();
        setCurrentField('tags');
      }
    },
    [localTags, onChangeTags],
  );

  // 포커스 관리
  useEffect(() => {
    // 현재 필드에 따라 포커스 설정
    if (currentField === 'title' && titleRef.current) {
      titleRef.current.focus();
    } else if (currentField === 'tags' && tagInputRef.current) {
      tagInputRef.current.focus();
    } else if (currentField === 'markdown' && editorElement.current) {
      editorElement.current.focus();
      const textarea = editorElement.current;
      const cursorPos = textarea.selectionStart;
      textarea.focus();

      setTimeout(() => {
        textarea.setSelectionRange(cursorPos, cursorPos);
        scrollToCursor(textarea, cursorPos);
      });
    }
  }, [currentField, scrollToCursor]);

  // 태그 초기값 설정
  useEffect(() => {
    if (tags && tags.length > 0) {
      setLocalTags(tags);
    }
  }, [tags]);

  return (
    <div className={styles.editorContainer} ref={block}>
      <div className={styles.editorSection}>
        {!hideUpper && (
          <div className={styles.editorHeader}>
            <textarea
              ref={titleRef}
              placeholder="제목을 입력하세요"
              value={title || ''}
              onChange={handleTitleChange}
              onFocus={() => setCurrentField('title')}
              className={styles.titleInput}
            />
            <div className={styles.titleTagHr}></div>
            <div className={styles.tagContainer}>
              {/* 태그 목록 - Velog 스타일 */}
              {localTags.map((tag) => (
                <div
                  key={tag}
                  className={styles.tag}
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag}
                </div>
              ))}
              {/* 태그 입력창 */}
              <input
                ref={tagInputRef}
                type="text"
                placeholder="태그를 입력하세요"
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagInputKeyDown}
                onFocus={handleTagInputFocus}
                className={styles.tagInput}
              />
            </div>
          </div>
        )}
        <ToolbarComponent onClick={handleToolbarClick} ref={toolbarElement} />

        <div className={styles.editorWrapper} ref={editorWrapperRef}>
          {/* CodeMirror 대신 일반 textarea 사용 */}
          <textarea
            aria-valuemax={1}
            ref={editorElement}
            placeholder="당신의 이야기를 적어보세요..."
            value={directMarkdown}
            onChange={handleMarkdownChange}
            onFocus={() => setCurrentField('markdown')}
            onScroll={handleScroll}
            className={
              !directMarkdown
                ? styles.markdownTextareaItalic
                : styles.markdownTextarea
            }
          />
        </div>
      </div>

      {addLink.visible && (
        <div
          className={styles.addLinkWrapper}
          style={{
            position: 'absolute',
            top: addLink.top,
            left: addLink.stickToRight ? 'auto' : addLink.left,
            right: addLink.stickToRight ? '1rem' : 'auto',
            zIndex: 100,
          }}
        >
          <AddLink
            onConfirm={handleConfirmAddLink}
            onClose={handleCancelAddLink}
          />
        </div>
      )}
    </div>
  );
};

export default WriteMarkdownEditor;
