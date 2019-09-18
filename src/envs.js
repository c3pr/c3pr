import axios from 'axios';

// export const BACKEND = `http://${document.location.hostname}:7305`;
export const BACKEND = `http://srv-codereview:7305`;
export const BACKEND_HUB = BACKEND + '/api/hub';
//export const BACKEND_HUB = `http://127.0.0.1:7300`;


const c3prAxios = axios.create({baseURL: BACKEND_HUB});

c3prAxios.interceptors.response.use(function (response) {
  if (!Array.isArray(response.data)) {
    console.error(`Empty array returned because response obtained from '${response.config.url}' is not an array. Got ${JSON.stringify(response.data)}.`);
    return {...response, data: []};
  }
  return response;
}, function (error) {
  return Promise.reject(error);
});

export default c3prAxios;
