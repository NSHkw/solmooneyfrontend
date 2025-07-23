// src/services/back/diaryApi.js
/**
 * 다이어리 관련 실제 백엔드 API
 * mock API와 동일한 인터페이스 제공
 * 사용법: DiaryPage.jsx에서 import만 변경하면 됨
 * import DIARY_API from './../services/back/diaryApi';
 */

const SERVER_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// localStorage에서 현재 로그인한 사용자 정보 가져오기 (mock과 동일)
const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem('userData');
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  } catch (error) {
    console.error('사용자 정보를 불러올 수 없습니다:', error);
    return null;
  }
};

// 공통 fetch 요청 함수
const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    credentials: 'include',
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${SERVER_URL}${url}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API 요청 중 오류:', error);
    throw error;
  }
};

// 날짜 키 포맷팅 유틸리티 (mock과 동일)
const formatDateKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * 특정 날짜의 일기 조회 (현재 로그인한 사용자)
 * @param {Date|string} date - 날짜
 * @returns {Promise<Object>} - 일기 데이터
 */
const getDiaryByDate = async (date) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const dateString = formatDateKey(date);

    const result = await apiRequest(`/diary/date?date=${dateString}`, {
      method: 'GET',
    });

    return {
      success: true,
      data: result.diary
        ? {
            mdiaId: result.diary.mdiaId,
            mdiaMmemId: result.diary.mdiaMmemId,
            mdiaDate: result.diary.mdiaDate,
            mdiaContent: result.diary.mdiaContent,
            text: result.diary.mdiaContent,
          }
        : null,
    };
  } catch (error) {
    console.error('일기 조회 중 오류:', error);
    throw new Error('일기를 불러올 수 없습니다.');
  }
};

/**
 * 일기 저장/수정 (현재 로그인한 사용자)
 * @param {Date|string} date - 날짜
 * @param {string} text - 일기 내용
 * @returns {Promise<Object>} - 저장 결과
 */
const saveDiary = async (date, text) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    if (!text || text.trim().length === 0) {
      throw new Error('일기 내용을 입력해주세요.');
    }

    const dateString = formatDateKey(date);

    const result = await apiRequest('/diary', {
      method: 'POST',
      body: JSON.stringify({
        mdiaDate: dateString,
        mdiaContent: text.trim(),
      }),
    });

    return {
      success: true,
      message: result.message || '일기가 저장되었습니다.',
      data: {
        mdiaId: result.diary.mdiaId,
        mdiaMmemId: result.diary.mdiaMmemId,
        mdiaDate: result.diary.mdiaDate,
        mdiaContent: result.diary.mdiaContent,
        text: result.diary.mdiaContent,
      },
    };
  } catch (error) {
    console.error('일기 저장 중 오류:', error);
    throw error;
  }
};

/**
 * 일기 삭제 (현재 로그인한 사용자)
 * @param {Date|string} date - 날짜
 * @returns {Promise<Object>} - 삭제 결과
 */
const deleteDiary = async (date) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const dateString = formatDateKey(date);

    const result = await apiRequest(`/diary?date=${dateString}`, {
      method: 'DELETE',
    });

    return {
      success: true,
      message: result.message || '일기가 삭제되었습니다.',
      data: {
        deletedDate: dateString,
      },
    };
  } catch (error) {
    console.error('일기 삭제 중 오류:', error);
    throw error;
  }
};

/**
 * 현재 사용자의 모든 일기 조회
 * @returns {Promise<Object>} - 일기 목록
 */
const getAllDiaries = async () => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw new Error('로그인이 필요합니다.');
    }

    const result = await apiRequest('/diary/all', {
      method: 'GET',
    });

    const diaries = result.diaries.map((diary) => ({
      mdiaId: diary.mdiaId,
      mdiaMmemId: diary.mdiaMmemId,
      mdiaDate: diary.mdiaDate,
      mdiaContent: diary.mdiaContent,
      text: diary.mdiaContent,
      date: formatDateKey(diary.mdiaDate),
    }));

    diaries.sort((a, b) => new Date(b.mdiaDate) - new Date(a.mdiaDate));

    return {
      success: true,
      data: {
        diaries,
        totalCount: diaries.length,
      },
    };
  } catch (error) {
    console.error('일기 목록 조회 중 오류:', error);
    throw new Error('일기 목록을 불러올 수 없습니다.');
  }
};

const BACK_DIARY_API = {
  // 기본 CRUD (필수 기능만)
  getDiaryByDate,
  saveDiary,
  deleteDiary,

  // 목록 조회
  getAllDiaries,

  // 유틸리티 (필요)
  formatDateKey,
  getCurrentUser,
};

export default BACK_DIARY_API;
