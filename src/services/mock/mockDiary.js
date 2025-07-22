// src/services/mock/mockDiary.js
import MOCKDATA from '../../assets/mockData';

/**
 * 다이어리 관련 Mock API
 * mockData 구조에 정확히 맞춤: { diaryId, userId, date, text }
 * 백엔드 연결 시 이 파일만 실제 API 호출로 변경하면 됨
 */

// 날짜 키 포맷팅
const formatDateKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * 특정 날짜의 일기 조회
 * @param {string} userId - 사용자 ID
 * @param {Date|string} date - 날짜
 * @returns {Promise<Object>} - 일기 데이터
 */
const getDiaryByDate = async (userId, date) => {
  // API 응답 시뮬레이션을 위한 지연
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    const dateKey = formatDateKey(date);

    // mockData에서 일기 찾기
    const diary = MOCKDATA.mockDiaryData?.find((diary) => {
      return diary.userId === userId && diary.date === dateKey;
    });

    if (diary) {
      return {
        success: true,
        data: {
          diaryId: diary.diaryId,
          userId: diary.userId,
          date: diary.date,
          text: diary.text,
        },
      };
    }

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    console.error('일기 조회 중 오류:', error);
    throw new Error('일기를 불러올 수 없습니다.');
  }
};

/**
 * 일기 저장/수정
 * @param {string} userId - 사용자 ID
 * @param {Date|string} date - 날짜
 * @param {string} text - 일기 내용
 * @returns {Promise<Object>} - 저장 결과
 */
const saveDiary = async (userId, date, text) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    if (!text || text.trim().length === 0) {
      throw new Error('일기 내용을 입력해주세요.');
    }

    const dateKey = formatDateKey(date);

    // mockData에서 기존 일기 찾기
    const existingDiaryIndex = MOCKDATA.mockDiaryData?.findIndex((diary) => {
      return diary.userId === userId && diary.date === dateKey;
    });

    let savedDiary;

    if (existingDiaryIndex !== -1) {
      // 기존 일기 수정
      MOCKDATA.mockDiaryData[existingDiaryIndex].text = text.trim();
      savedDiary = MOCKDATA.mockDiaryData[existingDiaryIndex];
      console.log(`일기 수정 완료: ${userId}, ${dateKey}`);
    } else {
      // 새 일기 생성
      const newDiary = {
        diaryId: Math.max(...(MOCKDATA.mockDiaryData?.map((d) => d.diaryId) || [0]), 0) + 1,
        userId: userId,
        date: dateKey,
        text: text.trim(),
      };

      if (!MOCKDATA.mockDiaryData) {
        MOCKDATA.mockDiaryData = [];
      }
      MOCKDATA.mockDiaryData.push(newDiary);
      savedDiary = newDiary;
      console.log(`새 일기 생성 완료: ${userId}, ${dateKey}`);
    }

    return {
      success: true,
      message: existingDiaryIndex !== -1 ? '일기가 수정되었습니다.' : '일기가 저장되었습니다.',
      data: {
        diaryId: savedDiary.diaryId,
        userId: savedDiary.userId,
        date: savedDiary.date,
        text: savedDiary.text,
      },
    };
  } catch (error) {
    console.error('일기 저장 중 오류:', error);
    throw error;
  }
};

/**
 * 일기 삭제
 * @param {string} userId - 사용자 ID
 * @param {Date|string} date - 날짜
 * @returns {Promise<Object>} - 삭제 결과
 */
const deleteDiary = async (userId, date) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    const dateKey = formatDateKey(date);

    // mockData에서 일기 찾기
    const diaryIndex = MOCKDATA.mockDiaryData?.findIndex((diary) => {
      return diary.userId === userId && diary.date === dateKey;
    });

    if (diaryIndex === -1) {
      throw new Error('삭제할 일기를 찾을 수 없습니다.');
    }

    // 일기 삭제
    const deletedDiary = MOCKDATA.mockDiaryData.splice(diaryIndex, 1)[0];
    console.log(`일기 삭제 완료: ${userId}, ${dateKey}`);

    return {
      success: true,
      message: '일기가 삭제되었습니다.',
      data: {
        deletedId: deletedDiary.diaryId,
        deletedDate: dateKey,
      },
    };
  } catch (error) {
    console.error('일기 삭제 중 오류:', error);
    throw error;
  }
};

/**
 * 특정 사용자의 모든 일기 조회
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Object>} - 일기 목록
 */
const getAllDiaries = async (userId) => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  try {
    const diaries =
      MOCKDATA.mockDiaryData
        ?.filter((diary) => diary.userId === userId)
        ?.map((diary) => ({
          diaryId: diary.diaryId,
          userId: diary.userId,
          date: diary.date,
          text: diary.text,
        })) || [];

    // 날짜순 정렬 (최신순)
    diaries.sort((a, b) => new Date(b.date) - new Date(a.date));

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

/**
 * 월별 일기 조회
 * @param {string} userId - 사용자 ID
 * @param {number} year - 연도
 * @param {number} month - 월 (1-12)
 * @returns {Promise<Object>} - 월별 일기 목록
 */
const getDiariesByMonth = async (userId, year, month) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  try {
    const allDiaries = await getAllDiaries(userId);
    const monthDiaries = allDiaries.data.diaries.filter((diary) => {
      const diaryDate = new Date(diary.date);
      return diaryDate.getFullYear() === year && diaryDate.getMonth() + 1 === month;
    });

    return {
      success: true,
      data: {
        diaries: monthDiaries,
        totalCount: monthDiaries.length,
      },
    };
  } catch (error) {
    console.error('월별 일기 조회 중 오류:', error);
    throw new Error('월별 일기를 불러올 수 없습니다.');
  }
};

/**
 * 일기 통계 조회
 * @param {string} userId - 사용자 ID
 * @param {number} year - 연도
 * @param {number} month - 월 (1-12)
 * @returns {Promise<Object>} - 통계 데이터
 */
const getDiaryStats = async (userId, year, month) => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  try {
    const monthData = await getDiariesByMonth(userId, year, month);
    const diaries = monthData.data.diaries;

    // 해당 월의 총 일수
    const daysInMonth = new Date(year, month, 0).getDate();

    // 작성률 계산
    const writtenDays = diaries.length;
    const writeRate = Math.round((writtenDays / daysInMonth) * 100);

    // 평균 일기 길이 계산
    const averageLength =
      diaries.length > 0
        ? Math.round(
            diaries.reduce((sum, diary) => sum + (diary.text?.length || 0), 0) / diaries.length,
          )
        : 0;

    return {
      success: true,
      data: {
        year,
        month,
        totalDays: daysInMonth,
        writtenDays,
        writeRate,
        averageLength,
        longestEntry: diaries.length > 0 ? Math.max(...diaries.map((d) => d.text?.length || 0)) : 0,
        shortestEntry:
          diaries.length > 0 ? Math.min(...diaries.map((d) => d.text?.length || 0)) : 0,
      },
    };
  } catch (error) {
    console.error('일기 통계 조회 중 오류:', error);
    throw new Error('일기 통계를 불러올 수 없습니다.');
  }
};

/**
 * 일기 검색
 * @param {string} userId - 사용자 ID
 * @param {string} keyword - 검색 키워드
 * @returns {Promise<Object>} - 검색 결과
 */
const searchDiaries = async (userId, keyword) => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  try {
    if (!keyword || keyword.trim().length === 0) {
      throw new Error('검색 키워드를 입력해주세요.');
    }

    const allDiaries = await getAllDiaries(userId);
    const searchResults = allDiaries.data.diaries.filter((diary) => {
      return diary.text?.toLowerCase().includes(keyword.toLowerCase());
    });

    return {
      success: true,
      data: {
        diaries: searchResults,
        totalCount: searchResults.length,
        keyword: keyword.trim(),
      },
    };
  } catch (error) {
    console.error('일기 검색 중 오류:', error);
    throw error;
  }
};

const DIARY_API = {
  // 기본 CRUD
  getDiaryByDate,
  saveDiary,
  deleteDiary,

  // 목록 조회
  getAllDiaries,
  getDiariesByMonth,

  // 통계 및 검색
  getDiaryStats,
  searchDiaries,

  // 유틸리티
  formatDateKey,
};

export default DIARY_API;
