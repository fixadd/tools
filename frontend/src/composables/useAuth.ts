import { reactive, toRefs } from 'vue';

interface Credentials {
  username: string;
  password: string;
}

const VALID_CREDENTIALS: Credentials = {
  username: 'admin',
  password: '123456'
};

const AUTH_TOKEN_KEY = 'ifs_ops_auth_token';

const state = reactive({
  isAuthenticated: false,
  lastError: '',
  token: ''
});

if (typeof window !== 'undefined') {
  const storedToken = window.localStorage.getItem(AUTH_TOKEN_KEY);

  if (storedToken) {
    state.isAuthenticated = true;
    state.token = storedToken;
  }
}

export const useAuth = () => {
  const login = (credentials: Credentials) => {
    if (
      credentials.username === VALID_CREDENTIALS.username &&
      credentials.password === VALID_CREDENTIALS.password
    ) {
      const token = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Date.now().toString();

      state.isAuthenticated = true;
      state.lastError = '';
      state.token = token;

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(AUTH_TOKEN_KEY, token);
      }
      return true;
    }

    state.isAuthenticated = false;
    state.lastError = 'Kullanıcı adı veya şifre hatalı.';
    state.token = '';
    return false;
  };

  const logout = () => {
    state.isAuthenticated = false;
    state.lastError = '';
    state.token = '';

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  };

  const resetError = () => {
    state.lastError = '';
  };

  return {
    ...toRefs(state),
    state,
    login,
    logout,
    resetError
  };
};
