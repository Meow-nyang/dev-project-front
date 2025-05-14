import { useState } from 'react';
import '../styles/SignupForm.scss';
import { Link } from 'react-router-dom';

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    // 이름 검증
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다';
    } else if (!/(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = '특수문자가 하나 이상 포함되어야 합니다';
    }

    // 비밀번호 확인 검증
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    if (!validateForm()) return;

    setIsLoading(true);
    setApiError('');

    try {
      // API 명세서에 따른 회원가입 요청
      const response = await fetch('/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        setSignupSuccess(true);
      } else {
        setApiError(data.message || '회원가입 중 오류가 발생했습니다');
      }
    } catch (error) {
      setApiError('서버 연결 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  if (signupSuccess) {
    return (
      <div className='success-container'>
        <div className='success-card'>
          <h2 className='success-title'>회원가입 완료!</h2>
          <p className='success-message'>
            {formData.name}님, 가입을 축하합니다!
          </p>
          <button
            onClick={() => (window.location.href = '/login')}
            className='login-button'
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='signup-container'>
      <div className='signup-card'>
        <h2 className='signup-title'>회원가입</h2>

        {apiError && <div className='api-error'>{apiError}</div>}

        <div>
          <div className='form-group'>
            <label className='form-label' htmlFor='name'>
              이름
            </label>
            <input
              id='name'
              name='name'
              type='text'
              placeholder='홍길동'
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? 'error' : ''}`}
            />
            {errors.name && <p className='error-message'>{errors.name}</p>}
          </div>

          <div className='form-group'>
            <label className='form-label' htmlFor='email'>
              이메일
            </label>
            <input
              id='email'
              name='email'
              type='email'
              placeholder='example@example.com'
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
            />
            {errors.email && <p className='error-message'>{errors.email}</p>}
          </div>

          <div className='form-group'>
            <label className='form-label' htmlFor='password'>
              비밀번호
            </label>
            <input
              id='password'
              name='password'
              type='password'
              placeholder='8자 이상, 특수문자 포함'
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
            />
            {errors.password && (
              <p className='error-message'>{errors.password}</p>
            )}
          </div>

          <div className='form-group'>
            <label className='form-label' htmlFor='confirmPassword'>
              비밀번호 확인
            </label>
            <input
              id='confirmPassword'
              name='confirmPassword'
              type='password'
              placeholder='비밀번호 재입력'
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
            />
            {errors.confirmPassword && (
              <p className='error-message'>{errors.confirmPassword}</p>
            )}
          </div>

          <div>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className='signup-button'
            >
              {isLoading ? '처리 중...' : '가입하기'}
            </button>
          </div>

          <div className='login-link-container'>
            <p className='login-link-text'>
              이미 계정이 있으신가요?{' '}
              <Link to='/home' className='login-link'>
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
