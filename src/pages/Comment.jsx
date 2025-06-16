import { useState } from 'react';
import '../styles/Comment.scss';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
// 날짜 포맷팅 함수
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

// 댓글 컴포넌트
const Comment = ({ comment, onEdit, onDelete, onReply, level = 0 }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleEdit = () => {
    onEdit(comment.id, editedContent);
    setIsEditing(false);
  };

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent('');
      setShowReplyForm(false);
    }
  };

  return (
    <div
      className={`comment ${level > 0 ? 'comment-reply' : ''}`}
      style={{ marginLeft: `${level * 20}px` }}
    >
      <div className='comment-header'>
        <span className='comment-author'>{comment.author}</span>
        <span className='comment-date'>{formatDate(comment.date)}</span>
      </div>

      {isEditing ? (
        <div className='comment-edit'>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className='comment-edit-textarea'
          />
          <div className='comment-edit-actions'>
            <button className='btn btn-save' onClick={handleEdit}>
              저장
            </button>
            <button
              className='btn btn-cancel'
              onClick={() => setIsEditing(false)}
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <div className='comment-content'>{comment.content}</div>
      )}

      <div className='comment-actions'>
        <button
          className='btn btn-reply'
          onClick={() => setShowReplyForm(!showReplyForm)}
        >
          답글
        </button>
        <button className='btn btn-edit' onClick={() => setIsEditing(true)}>
          수정
        </button>
        <button className='btn btn-delete' onClick={() => onDelete(comment.id)}>
          삭제
        </button>
      </div>

      {showReplyForm && (
        <div className='reply-form'>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder='답글을 입력하세요...'
            className='reply-textarea'
          />
          <div className='reply-actions'>
            <button className='btn btn-post' onClick={handleReply}>
              등록
            </button>
            <button
              className='btn btn-cancel'
              onClick={() => setShowReplyForm(false)}
            >
              취소
            </button>
          </div>
        </div>
      )}

      {comment.replies &&
        comment.replies.map((reply) => (
          <Comment
            key={reply.id}
            comment={reply}
            onEdit={onEdit}
            onDelete={onDelete}
            onReply={onReply}
            level={level + 1}
          />
        ))}
    </div>
  );
};

// 댓글 폼 컴포넌트
const CommentForm = ({ onSubmit }) => {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (author.trim() && content.trim()) {
      onSubmit({ author, content });
      setContent('');
    }
  };

  return (
    <div className='comment-form'>
      <div className='form-group'>
        <input
          type='text'
          placeholder='이름'
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className='form-control'
        />
      </div>
      <div className='form-group'>
        <textarea
          placeholder='댓글을 입력하세요...'
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className='form-control'
        />
      </div>
      <button onClick={handleSubmit} className='btn btn-submit'>
        댓글 등록
      </button>
    </div>
  );
};

// 메인 게시판 컴포넌트
export default function CommentBoard({ comments: fetchComments, boardId }) {
  const [comments, setComments] = useState(fetchComments);
  const authHeader = useAuthHeader();
  // 새 댓글 추가
  const addComment = async (newComment) => {
    const comment = {
      ...newComment,
      date: new Date(),
      replies: [],
    };

    console.log(authHeader);
    console.log(newComment);
    const string = await fetch(
      `${import.meta.env.VITE_BACKEND_API}${import.meta.env.VITE_COMMENT}`,
      {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          boardId,
          content: newComment.content,
        }),
      },
    );
    console.log(string);
    setComments([...comments, comment]);
  };

  // 댓글 수정
  const editComment = (id, newContent) => {
    const updateCommentTree = (commentsList) => {
      return commentsList.map((comment) => {
        if (comment.id === id) {
          return { ...comment, content: newContent };
        }
        if (comment.replies && comment.replies.length > 0) {
          return { ...comment, replies: updateCommentTree(comment.replies) };
        }
        return comment;
      });
    };

    setComments(updateCommentTree(comments));
  };

  // 댓글 삭제
  const deleteComment = (id) => {
    const deleteFromTree = (commentsList) => {
      return commentsList.filter((comment) => {
        if (comment.id === id) {
          return false;
        }
        if (comment.replies && comment.replies.length > 0) {
          comment.replies = deleteFromTree(comment.replies);
        }
        return true;
      });
    };

    setComments(deleteFromTree(comments));
  };

  // 답글 추가
  const addReply = (parentId, replyContent) => {
    const addReplyToTree = (commentsList) => {
      return commentsList.map((comment) => {
        if (comment.id === parentId) {
          const newReply = {
            id: Date.now(),
            author: '사용자', // 실제로는 로그인한 사용자 정보를 사용
            content: replyContent,
            date: new Date(),
            replies: [],
          };
          return { ...comment, replies: [...comment.replies, newReply] };
        }
        if (comment.replies && comment.replies.length > 0) {
          return { ...comment, replies: addReplyToTree(comment.replies) };
        }
        return comment;
      });
    };

    setComments(addReplyToTree(comments));
  };

  return (
    <div className='comment-board'>
      <h2></h2>

      <div className='comments-section'>
        <h3>댓글 ({comments.length})</h3>

        <CommentForm onSubmit={addComment} />

        <div className='comments-list'>
          {comments.map((comment) => (
            <Comment
              key={comment.id || Date.now()}
              comment={comment}
              onEdit={editComment}
              onDelete={deleteComment}
              onReply={addReply}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
