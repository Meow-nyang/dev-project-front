import createStore from 'react-auth-kit/createStore';
import createRefresh from 'react-auth-kit/createRefresh';

const refresh = createRefresh({
  interval: 30,
  refreshApiCallback: async (param) => {
    try {
      console.log(param.authUserState);
      const result = await fetch(
        `${import.meta.env.VITE_BACKEND_API}${import.meta.env.VITE_USER}/refresh`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: param.authUserState.id,
            refreshToken: param.refreshToken,
          }),
        },
      );
      const response = await result.json();
      console.log('refreshing');
      console.log(response);
      return {
        isSuccess: true,
        newAuthToken: response.result.token,
        newAuthTokenType: 'Bearer',
        newAuthUserState: param.authUserState,
      };
    } catch (e) {
      console.error(e);
      window.location.reload();
      return {
        isSuccess: false,
      };
    }
  },
});

const store = createStore({
  authName: '_auth',
  authType: 'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:',
  refresh: refresh,
});

export default store;
