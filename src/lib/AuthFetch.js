import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';

const useAuthFetch = () => {
  const authHeader = useAuthHeader();

  return async (url, options = {}) => {
    const headers = {
      ...options.headers,
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    return response;
  };
};
