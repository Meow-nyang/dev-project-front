import React, { Component } from 'react';
import '../styles/SignIn.scss';
import logo from '../assets/image.svg';
import styles from '../styles/Header.module.scss';

class Location extends Component {
  state = {
    email: '',
    password: '',
    locationList: [
      '서울',
      '부산',
      '대구',
      '인천',
      '광주',
      '대전',
      '울산',
      '세종',
      '제주',
      '수원',
      '창원',
      '청주',
    ],
  };

  loginHandler = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  loginClickHandler = () => {
    if (!navigator.geolocation) {
      alert('이 브라우저에서는 위치 정보가 지원되지 않습니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('현재 위치:', latitude, longitude);

        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        )
          .then((res) => res.json())
          .then((data) => {
            const address = data.address;
            console.log('주소 정보:', address);

            // 필요한 주소 정보
            const state = address.state || ''; // 예: 서울특별시
            const city = address.city || address.county || ''; // 예: 서초구
            const town =
              address.suburb || address.town || address.village || ''; // 예: 서초1동

            // 문자열 조합
            const fullLocation = `${state} ${city} ${town}`.trim();

            console.log('선택된 위치:', fullLocation);

            if (fullLocation) {
              this.setState((prevState) => ({
                locationList: [
                  fullLocation,
                  ...prevState.locationList.filter(
                    (item) => item !== fullLocation,
                  ),
                ],
              }));
            } else {
              alert('위치 정보를 확인할 수 없습니다.');
            }
          })
          .catch((err) => {
            console.error('위치 정보 오류:', err);
            alert('위치 정보를 가져오는 데 실패했습니다.');
          });
      },
      (error) => {
        alert('위치 접근이 거부되었습니다.');
      },
    );
  };

  handleLocationClick = (location) => {
    console.log('Selected location:', location);
    if (this.props.onSelectLocation) {
      this.props.onSelectLocation(location);
    }
  };

  render() {
    const { isOpen, close } = this.props;
    const { locationList } = this.state;

    return (
      <>
        {isOpen && (
          <div className='modal'>
            <div onClick={close}>
              <div className='loginModal'>
                <span className='close' onClick={close}>
                  &times;
                </span>
                <div
                  className='modalContents'
                  onClick={(e) => e.stopPropagation()}
                >
                  <header className={styles.header}>
                    <div className={styles.logo}>
                      <img
                        src={logo}
                        alt='My Logo'
                        className={styles.logo__img}
                      />
                      <span className={styles.logo__text}>지역변경</span>
                    </div>
                  </header>

                  <input
                    name='location'
                    className='loginId'
                    type='text'
                    placeholder='지역이나 동네로 검색하기'
                    onChange={this.loginHandler}
                  />

                  <button className='loginBtn' onClick={this.loginClickHandler}>
                    현재 내 위치 사용하기
                  </button>

                  <div className='locationList'>
                    {locationList.map((loc, index) => (
                      <div
                        key={index}
                        className='locationItem'
                        onClick={() => this.handleLocationClick(loc)}
                      >
                        {loc}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default Location;
