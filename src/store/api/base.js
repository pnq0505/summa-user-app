import axios from 'axios';
import axiosRetry from 'axios-retry';

export const client = (baseUrl) => {
  const callAPIWithAPIKEY = axios.create({
    baseURL: baseUrl, // YOUR_API_URL HERE
    timeout: 1000 * 5, // Wait for 30 seconds
    timeoutErrorMessage: 'Timeout error',
  });

  axiosRetry(callAPIWithAPIKEY, {
    retries: 3,
    shouldResetTimeout: true,
    onRetry: () => {
      console.log('Retry call API');
    },
  });

  callAPIWithAPIKEY.interceptors.response.use(
    (res) => {
      if (res && res.data) {
        if (res.data.errors) {
          if (res.data.errors[0].extensions) {
            const status = res.data.errors[0].extensions.exception.status;
            if (status === 401) {
              console.log('Error 401');
            }

            if (status === 403) {
              console.log('Error 403');
            }

            if (status === 500) {
              console.log('Error 500');
            }
            console.log('res.data.errors[0].message :>> ', res.data.errors[0].message);
            return Promise.reject(res.data.errors[0].message);
          }
        }
        return res;
      }
      return res;
    },
    (err) => {
      if (err.response && err.response.status === 401) {
        console.log('error 401');
      }

      if (err.response && err.response.status === 403) {
        console.log('error 403');
      }

      if (err.response && err.response.status === 500) {
        console.log('error 500');
      }

      return Promise.reject(err);
    },
  );
  return callAPIWithAPIKEY;
};
