import React, { useState } from 'react';
import { Link, redirect } from 'react-router-dom';
import '../styles/SignIn.scss';
import logo from '../assets/image.svg';
import styles from '../styles/Header.module.scss';
import useSignIn from 'react-auth-kit/hooks/useSignIn';

const SignIn = ({ isOpen, close }) => {
  const signIn = useSignIn();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const loginHandler = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const loginClickHandler = (e) => {
    e.preventDefault();
    const { email, password } = form;

    fetch(
      `${import.meta.env.VITE_BACKEND_API}${import.meta.env.VITE_USER}/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      },
    )
      .then((res) => {
        if (res.status !== 200) throw new Error('로그인 오류');
        return res.json();
      })
      .then((res) => {
        if (
          signIn({
            auth: {
              token: res.result.token,
              type: 'Bearer',
            },
            refresh: res.result.refreshToken,
            userState: {
              id: res.result.id,
              name: res.result.name,
              email: res.result.email,
            },
          })
        ) {
          close();
          window.location.reload();
        } else {
          alert('로그인 오류');
        }
      })
      .catch((err) => alert(err));
  };

  if (!isOpen) return null;

  return (
    <div className='modal'>
      <div onClick={close}>
        <div className='loginModal'>
          <span className='close' onClick={close}>
            &times;
          </span>
          <div className='modalContents' onClick={(e) => e.stopPropagation()}>
            <header className={styles.header}>
              <div className={styles.logo}>
                <img src={logo} alt='My Logo' className={styles.logo__img} />
                <span className={styles.logo__text}>세컨존</span>
              </div>
            </header>
            <input
              name='email'
              className='loginId'
              type='text'
              placeholder='아이디'
              onChange={loginHandler}
            />
            <input
              name='password'
              className='loginPw'
              type='password'
              placeholder='비밀번호'
              onChange={loginHandler}
            />
            <div className='loginMid'>
              <label className='autoLogin' htmlFor='hint'>
                <input type='checkbox' id='hint' /> 로그인 유지하기
              </label>
              <div className='autoLogin'>아이디/비밀번호 찾기</div>
            </div>
            <button className='loginBtn' onClick={loginClickHandler}>
              로그인
            </button>
            <div className='loginEnd'>
              <div className='loginLine'>
                회원이 아니신가요?
                <Link to='/signup'>회원가입</Link>
              </div>
              <div className='noUser'>비회원 주문 조회</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
