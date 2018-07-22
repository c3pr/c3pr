import axios from 'axios';

export const BACKEND = `http://${document.location.hostname}:7305`;
//export const BACKEND = `http://srv-codereview:7305`;
export const BACKEND_HUB = BACKEND + '/api/hub';
//export const BACKEND_HUB = `http://127.0.0.1:7300`;

export default axios.create({baseURL: BACKEND_HUB});
