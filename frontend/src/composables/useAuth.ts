import { reactive, toRefs } from 'vue';

interface Credentials {
  username: string;
  password: string;
}

const VALID_CREDENTIALS: Credentials = {
  username: 'admin',
  password: '123456'
};

const state = reactive({
  isAuthenticated: false,
  lastError: ''
});

export const useAuth = () => {
  const login = (credentials: Credentials) => {
    if (
      credentials.username === VALID_CREDENTIALS.username &&
      credentials.password === VALID_CREDENTIALS.password
    ) {
      state.isAuthenticated = true;
      state.lastError = '';
      return true;
    }

    state.isAuthenticated = false;
    state.lastError = 'Kullanıcı adı veya şifre hatalı.';
    return false;
  };

  const logout = () => {
    state.isAuthenticated = false;
    state.lastError = '';
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
