// src/components/write/AddLink.jsx
import React, { useEffect, useRef, useState } from 'react';
import styles from '../../pages/PostWrite.module.css';

function AddLink({ onConfirm, onClose }) {
  const [link, setLink] = useState('');
  const input = useRef(null);

  useEffect(() => {
    if (input.current) {
      input.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    setLink(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!link) return;
    onConfirm(link);
  };

  return (
    <div className={styles.addLinkContainer}>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="URL을 입력하세요"
          value={link}
          onChange={handleChange}
          ref={input}
          className={styles.linkInput}
        />
        <div className={styles.addLinkButtons}>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelButton}
          >
            취소
          </button>
          <button type="submit" className={styles.confirmButton}>
            확인
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddLink;
