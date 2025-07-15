// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null, token: null };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null,
  });

  // 앱 시작 시 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
      try {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            token,
            user: JSON.parse(userData),
          },
        });
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      }
    }
  }, []);

  // 로그인 함수
  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (credentials.id === 'admin' && credentials.password === '1234') {
        const mockToken = 'mock-jwt-token-' + Date.now();
        const mockUser = {
          id: credentials.id,
          name: '관리자',
          email: 'admin@mooney.com',
          nickname: 'Mooney관리자',
        };

        localStorage.setItem('token', mockToken);
        localStorage.setItem('userData', JSON.stringify(mockUser));

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { token: mockToken, user: mockUser },
        });

        toast.success('로그인 성공! 환영합니다! 🎉');
        return { success: true, user: mockUser };
      } else {
        throw new Error('아이디 또는 비밀번호가 틀렸습니다.');
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // 회원가입 함수
  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('회원가입 데이터:', userData);
      toast.success('회원가입이 완료되었습니다! 로그인해주세요.');
      return { success: true };
    } catch (error) {
      toast.error('회원가입 중 오류가 발생했습니다.');
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    dispatch({ type: 'LOGOUT' });
    toast.info('로그아웃되었습니다.');
  };

  // 토큰 만료 체크 함수
  const checkTokenExpiry = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      if (state.isAuthenticated) {
        logout();
      }
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        checkTokenExpiry,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내에서 사용되어야 합니다.');
  }
  return context;
};
