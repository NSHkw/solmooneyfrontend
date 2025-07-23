// src/contexts/AuthContext.jsx
import React, { createContext, useReducer } from 'react';
import { toast } from 'react-toastify';

import { USER_API } from '../services/apiService.js';

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
        userId: action.payload.userId, // 🔥 토큰 대신 userId 저장
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
        user: null,
        userId: null, // 🔥 userId로 변경
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        userId: null, // 🔥 userId로 변경
        error: null,
        loading: false,
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload }, loading: false };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  // 🔥 초기 상태에서 userId 체크
  const getInitialState = () => {
    const userId = localStorage.getItem('userId'); // 🔥 토큰 대신 userId
    const userData = localStorage.getItem('userData');

    if (userId && userData) {
      try {
        return {
          isAuthenticated: true,
          user: JSON.parse(userData),
          userId: userId, // 🔥 userId 저장
          loading: false,
          error: null,
        };
      } catch (error) {
        console.error('로컬스토리지 데이터 파싱 오류:', error);
        localStorage.removeItem('userId'); // 🔥 userId로 변경
        localStorage.removeItem('userData');
      }
    }

    return {
      isAuthenticated: false,
      user: null,
      userId: null, // 🔥 userId로 변경
      loading: false,
      error: null,
    };
  };

  const [state, action] = useReducer(authReducer, getInitialState());

  // 🔥 로그인 함수 (수정됨)
  const loginHandler = async (credentials) => {
    action({ type: 'LOGIN_START' });

    try {
      const result = await USER_API.login(credentials);
      console.log('result', result);

      if (result.success) {
        // 🔥 userId를 localStorage에 저장
        localStorage.setItem('userId', result.data.userId);
        localStorage.setItem('userData', JSON.stringify(result.data.user));

        action({
          type: 'LOGIN_SUCCESS',
          payload: {
            userId: result.data.userId, // 🔥 토큰 대신 userId
            user: result.data.user,
          },
        });

        toast.success(`${result.data.user.nick}님, 환영합니다! 🎉`);
        return { success: true, user: result.data.user };
      }
    } catch (error) {
      action({ type: 'LOGIN_FAILURE', payload: error.message });
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // 회원가입 함수 (그대로 유지)
  const registerHandler = async (userData) => {
    action({ type: 'SET_LOADING', payload: true });

    try {
      const result = await USER_API.register(userData);

      if (result.success) {
        toast.success(result.message);
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      action({ type: 'SET_LOADING', payload: false });
    }
  };

  // 아이디 중복 확인
  const checkIdDuplicateHandler = async (id) => {
    try {
      const result = await USER_API.checkIdDuplicate(id);
      return result;
    } catch (error) {
      toast.error('아이디 중복 확인 중 오류가 발생했습니다.');
      return { success: false, available: false, message: error.message };
    }
  };

  // 닉네임 중복 확인
  const checkNicknameDuplicateHandler = async (nickname) => {
    try {
      const result = await USER_API.checkNicknameDuplicate(nickname);
      return result;
    } catch (error) {
      toast.error('닉네임 중복 확인 중 오류가 발생했습니다.');
      return { success: false, available: false, message: error.message };
    }
  };

  // 회원정보 수정
  const updateUserInfoHandler = async (updateData) => {
    if (!state.user) {
      toast.error('로그인이 필요합니다.');
      return { success: false, error: '로그인이 필요합니다.' };
    }

    action({ type: 'SET_LOADING', payload: true });

    try {
      const result = await USER_API.updateUserInfo(state.user.loginId, updateData); // 🔥 user.id 대신 user.loginId

      if (result.success) {
        // 로컬 스토리지 업데이트
        localStorage.setItem('userData', JSON.stringify(result.data.user));

        // 상태 업데이트
        action({
          type: 'UPDATE_USER',
          payload: result.data.user,
        });

        toast.success(result.message);
        return { success: true, user: result.data.user };
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      action({ type: 'SET_LOADING', payload: false });
    }
  };

  // 회원탈퇴
  const deleteAccountHandler = async (passwordData) => {
    if (!state.user) {
      toast.error('로그인이 필요합니다.');
      return { success: false, error: '로그인이 필요합니다.' };
    }

    action({ type: 'SET_LOADING', payload: true });

    try {
      const result = await USER_API.deleteAccount(state.user.loginId, passwordData); // 🔥 user.id 대신 user.loginId

      if (result.success) {
        // 로컬 스토리지 정리
        localStorage.removeItem('userId'); // 🔥 토큰 대신 userId
        localStorage.removeItem('userData');

        // 상태 초기화
        action({ type: 'LOGOUT' });

        toast.success(result.message);
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      action({ type: 'SET_LOADING', payload: false });
    }
  };

  // 사용자 정보 새로고침
  const refreshUserInfo = async () => {
    if (!state.user) {
      return { success: false, error: '로그인이 필요합니다.' };
    }

    try {
      const result = await USER_API.getUserInfo(state.user.loginId); // 🔥 user.id 대신 user.loginId

      if (result.success) {
        // 로컬 스토리지 업데이트
        localStorage.setItem('userData', JSON.stringify(result.data.user));

        // 상태 업데이트
        action({
          type: 'UPDATE_USER',
          payload: result.data.user,
        });

        return { success: true, user: result.data.user };
      }
    } catch (error) {
      console.error('사용자 정보 새로고침 실패:', error);
      return { success: false, error: error.message };
    }
  };

  // 로그아웃 함수
  const logoutHandler = () => {
    // 로컬 스토리지 정리
    localStorage.removeItem('userId'); // 🔥 토큰 대신 userId
    localStorage.removeItem('userData');

    // 상태 초기화
    action({ type: 'LOGOUT' });

    // 사용자에게 알림
    toast.info('로그아웃되었습니다.');
  };

  // 🔥 사용자 인증 체크 함수 (토큰 검증 대신)
  const checkUserAuth = async () => {
    const userId = localStorage.getItem('userId'); // 🔥 토큰 대신 userId

    if (!userId) {
      if (state.isAuthenticated) {
        action({ type: 'LOGOUT' });
      }
      return false;
    }

    try {
      // 🔥 개발 중에는 verifyUserDev 사용, 백엔드 준비되면 verifyUser로 변경
      const response = await USER_API.verifyUserDev(userId);
      // const response = await USER_API.verifyUser(userId); // 백엔드 준비 완료 후

      if (!response.success) {
        logoutHandler();
        return false;
      }

      return true;
    } catch (error) {
      console.error('사용자 인증 실패:', error);
      // 🔥 개발 중에는 에러가 나도 로그아웃하지 않음 (선택사항)
      // logoutHandler();
      return false;
    }
  };

  // 현재 사용자 비밀번호 확인
  const verifyPasswordHandler = async (password) => {
    if (!state.user) {
      toast.error('로그인이 필요합니다.');
      return { success: false, error: '로그인이 필요합니다.' };
    }

    try {
      const result = await USER_API.verifyPassword(state.user.loginId, password); // 🔥 user.id 대신 user.loginId
      return result;
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  // 에러 클리어
  const clearError = () => {
    action({ type: 'CLEAR_ERROR' });
  };

  const contextValue = {
    // 상태
    ...state,

    // 인증 관련 함수들
    login: loginHandler,
    register: registerHandler,
    logout: logoutHandler,
    checkUserAuth, // 🔥 checkTokenExpiry 대신 checkUserAuth

    // 중복 확인 함수들
    checkIdDuplicate: checkIdDuplicateHandler,
    checkNicknameDuplicate: checkNicknameDuplicateHandler,

    // 회원정보 관리 함수들
    updateUserInfo: updateUserInfoHandler,
    deleteAccount: deleteAccountHandler,
    refreshUserInfo,
    verifyPassword: verifyPasswordHandler,

    // 유틸리티 함수들
    clearError,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthContext;
