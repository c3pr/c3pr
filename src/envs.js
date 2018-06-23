export const BACKEND = (() => {
  if (document.location.href.includes('localhost')) {
    return 'http://localhost:5005';
  }
  return 'http://c3pr-dashboard:5005';
})();
export const BACKEND_HUB = BACKEND + '/api/hub';
