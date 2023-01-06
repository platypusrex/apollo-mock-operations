export const generateUUID = () => {
  const crypto = typeof window !== 'undefined' ? window.crypto : require('crypto');
  return crypto.randomUUID();
};
