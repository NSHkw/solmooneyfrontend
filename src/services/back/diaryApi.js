// src/services/back/diaryApi.js

const SERVER_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 현재 로그인한 사용자의 특정 날짜 일기 조회
 * @param {Date|string} date - 날짜
 * @returns {Promise<Object>} - 일기 데이터
 */
const getDiaryByDate = async (date) => {
  try {
    const dateString = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD 형식
    const token = localStorage.getItem('token');

    const response = await fetch(`${SERVER_URL}/diary/current?date=${dateString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      data: result.diary
        ? {
            mdiaId: result.diary.mdiaId,
            mdiaMmemId: result.diary.mdiaMmemId,
            mdiaDate: result.diary.mdiaDate,
            mdiaContent: result.diary.mdiaContent,
            text: result.diary.mdiaContent, // DiaryPage에서 사용하는 필드
          }
        : null,
    };
  } catch (error) {
    console.error('일기 조회 중 오류:', error);
    throw new Error('일기를 불러올 수 없습니다.');
  }
};

/**
 * 현재 로그인한 사용자의 일기 저장/수정
 * @param {Date|string} date - 날짜
 * @param {string} text - 일기 내용
 * @returns {Promise<Object>} - 저장 결과
 */
const saveDiary = async (date, text) => {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error('일기 내용을 입력해주세요.');
    }

    const dateString = new Date(date).toISOString().split('T')[0];
    const token = localStorage.getItem('token');

    const response = await fetch(`${SERVER_URL}/diary/current`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        mdiaDate: dateString,
        mdiaContent: text.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

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
 * 현재 로그인한 사용자의 일기 삭제
 * @param {Date|string} date - 날짜
 * @returns {Promise<Object>} - 삭제 결과
 */
const deleteDiary = async (date) => {
  try {
    const dateString = new Date(date).toISOString().split('T')[0];
    const token = localStorage.getItem('token');

    const response = await fetch(`${SERVER_URL}/diary/current?date=${dateString}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

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

// 날짜 키 포맷팅 유틸리티
const formatDateKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const DIARY_API = {
  // 기본 CRUD (필수 기능만)
  getDiaryByDate,
  saveDiary,
  deleteDiary,

  // 유틸리티 (필요)
  formatDateKey,
};

export default DIARY_API;
