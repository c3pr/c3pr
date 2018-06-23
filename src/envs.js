export const BACKEND = (() => {
  let host = 'c3pr-dashboard';
  if (document.location.href.includes('localhost')) {
    host = 'localhost';
  } else if (document.location.href.includes('127.0.0.1')) {
    host = '127.0.0.1';
  }
  return `http://${host}:5005`;
})();
export const BACKEND_HUB = BACKEND + '/api/hub';
