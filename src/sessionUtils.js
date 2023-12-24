const generateSessionKey = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const saveSession = (data) => {
  const sessionKey = generateSessionKey();
  sessionStorage.setItem(sessionKey, JSON.stringify(data));
  window.__currentSessionKey = sessionKey;

  return sessionKey;
};

export const getSession = (sessionKey) => {
  const key = sessionKey || window.__currentSessionKey;
  const sessionData = sessionStorage.getItem(key);
  return sessionData ? JSON.parse(sessionData) : null;
};

export const clearSession = (sessionKey) => {
  const key = sessionKey || window.__currentSessionKey;
  sessionStorage.removeItem(key);
};

// Function to clear session on beforeunload event
export const setupBeforeUnloadListener = () => {
  window.addEventListener('beforeunload', () => {
    clearSession(window.__currentSessionKey);
  });
};
