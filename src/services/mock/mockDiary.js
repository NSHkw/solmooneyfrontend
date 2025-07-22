// src/services/mock/mockDiary.js
import MOCKDATA from '../../assets/mockData';

/**
 * 다이어리 관련 Mock API - 핵심 기능만
 * mockData 구조: { mdiaId, mdiaMmemId, mdiaDate, mdiaContent }
 * 백엔드 연결 시 이 파일만 실제 API 호출로 변경하면 됨
 */

// 날짜 키 포맷팅 유틸리티
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

    // mockData에서 일기 찾기 (날짜는 Date 객체이므로 변환 필요)
    const diary = MOCKDATA.mockDiaryData?.find((diary) => {
      const diaryDateKey = formatDateKey(diary.mdiaDate);
      return diary.mdiaMmemId === userId && diaryDateKey === dateKey;
    });

    if (diary) {
      return {
        success: true,
        data: {
          mdiaId: diary.mdiaId,
          mdiaMmemId: diary.mdiaMmemId,
          mdiaDate: diary.mdiaDate,
          mdiaContent: diary.mdiaContent,
          // DiaryPage에서 사용하는 text 필드로 매핑
          text: diary.mdiaContent,
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
    if (!MOCKDATA.mockDiaryData) {
      MOCKDATA.mockDiaryData = [];
    }

    const existingDiaryIndex = MOCKDATA.mockDiaryData.findIndex((diary) => {
      const diaryDateKey = formatDateKey(diary.mdiaDate);
      return diary.mdiaMmemId === userId && diaryDateKey === dateKey;
    });

    let savedDiary;

    if (existingDiaryIndex !== -1) {
      // 기존 일기 수정
      MOCKDATA.mockDiaryData[existingDiaryIndex].mdiaContent = text.trim();
      savedDiary = MOCKDATA.mockDiaryData[existingDiaryIndex];
      console.log(`일기 수정 완료: ${userId}, ${dateKey}`);
    } else {
      // 새 일기 생성
      const newDiary = {
        mdiaId: Math.max(...(MOCKDATA.mockDiaryData.map((d) => d.mdiaId) || [0]), 0) + 1,
        mdiaMmemId: userId,
        mdiaDate: new Date(date),
        mdiaContent: text.trim(),
      };

      MOCKDATA.mockDiaryData.push(newDiary);
      savedDiary = newDiary;
      console.log(`새 일기 생성 완료: ${userId}, ${dateKey}`);
    }

    return {
      success: true,
      message: existingDiaryIndex !== -1 ? '일기가 수정되었습니다.' : '일기가 저장되었습니다.',
      data: {
        mdiaId: savedDiary.mdiaId,
        mdiaMmemId: savedDiary.mdiaMmemId,
        mdiaDate: savedDiary.mdiaDate,
        mdiaContent: savedDiary.mdiaContent,
        // DiaryPage에서 사용하는 text 필드로 매핑
        text: savedDiary.mdiaContent,
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
    if (!MOCKDATA.mockDiaryData) {
      throw new Error('삭제할 일기를 찾을 수 없습니다.');
    }

    const diaryIndex = MOCKDATA.mockDiaryData.findIndex((diary) => {
      const diaryDateKey = formatDateKey(diary.mdiaDate);
      return diary.mdiaMmemId === userId && diaryDateKey === dateKey;
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
        deletedId: deletedDiary.mdiaId,
        deletedDate: dateKey,
      },
    };
  } catch (error) {
    console.error('일기 삭제 중 오류:', error);
    throw error;
  }
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
