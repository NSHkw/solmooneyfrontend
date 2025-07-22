// src/pages/DiaryPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../css/DiaryPage.css';
import diaryImg from '../img/pencil_mooney.png';
import CategoryChart from '../components/CategoryChart';
// import EXPENSE_API from './../services/back/expenseApi.js';
// import DIARY_API from './../services/back/diaryApi.js';
import AuthContext from '../contexts/AuthContext.jsx';

import EXPENSE_API from './../services/mock/mockExpense.js';
import DIARY_API from './../services/mock/mockDiary.js';

const DiaryPage = () => {
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [diaryText, setDiaryText] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useContext(AuthContext);

  // 소비 내역 상태
  const [expenseData, setExpenseData] = useState({
    income: 0,
    totalExpense: 0,
    chartData: [],
  });

  const formatDisplayDate = (d) => `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;

  // 금액 포맷팅 함수
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  // 일기 데이터 로드 함수 - userId 파라미터 제거 (localStorage에서 자동으로 가져옴)
  const loadDiaryData = async () => {
    setIsLoading(true);
    try {
      const diaryResult = await DIARY_API.getDiaryByDate(date);

      if (diaryResult.data) {
        setDiaryText(diaryResult.data.text || '');
      } else {
        setDiaryText('');
      }
    } catch (error) {
      console.error('일기 데이터 로드 오류:', error);
      setDiaryText('');
    } finally {
      setIsLoading(false);
    }
  };

  // 소비 내역 로드 함수
  const loadExpenseData = () => {
    try {
      // userId를 전달하지 않으면 자동으로 현재 로그인한 사용자 사용
      const dayExpenseData = EXPENSE_API.getExpensesByDate(date);
      setExpenseData(dayExpenseData);
    } catch (error) {
      console.error('지출 데이터 로드 오류:', error);
      setExpenseData({
        income: 0,
        totalExpense: 0,
        chartData: [],
      });
    }
  };

  // 날짜가 바뀔 때마다 데이터 로드
  useEffect(() => {
    if (isAuthenticated && user) {
      loadDiaryData();
      loadExpenseData();
    }
  }, [date, isAuthenticated, user]);

  // 일기 저장 함수 - userId 파라미터 제거
  const saveDiary = async () => {
    if (!diaryText.trim()) {
      alert('일기 내용을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      await DIARY_API.saveDiary(date, diaryText);
      setEditMode(false);
      await loadDiaryData(); // 저장 후 다시 로드
      console.log('일기 저장 완료');
    } catch (error) {
      console.error('일기 저장 오류:', error);
      alert('일기 저장 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 일기 삭제 함수 - userId 파라미터 제거
  const deleteDiary = async () => {
    if (!window.confirm('정말로 이 일기를 삭제하시겠습니까?')) {
      return;
    }

    setIsLoading(true);
    try {
      await DIARY_API.deleteDiary(date);
      await loadDiaryData(); // 삭제 후 다시 로드
      console.log('일기 삭제 완료');
    } catch (error) {
      console.error('일기 삭제 오류:', error);
      alert('일기 삭제 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인하지 않은 경우
  if (!isAuthenticated || !user) {
    return (
      <div className="diary-container">
        <div
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666',
            fontSize: '18px',
          }}
        >
          일기를 사용하려면 로그인이 필요합니다.
        </div>
      </div>
    );
  }

  // 일기 내용이 있는지 확인하여 버튼 텍스트 결정
  const getButtonText = () => {
    if (isLoading) {
      return '⏳ 처리중...';
    }
    if (editMode) {
      return '💾 저장';
    }
    return diaryText.trim() ? '✏️ 수정하기' : '✏️ 일기 쓰기';
  };

  const handleButtonClick = () => {
    if (isLoading) return;

    if (editMode) {
      saveDiary();
    } else {
      setEditMode(true);
    }
  };

  return (
    <div className="diary-container">
      <div className="left-panel">
        <div className="today-phrase">🌿 오늘도 내 하루를 기록해요</div>

        <div className="header-row">
          <h2 onClick={() => setShowCalendar(!showCalendar)}>
            <img src={diaryImg} alt="다이어리 무니" className="diary-img" />
            {formatDisplayDate(date)} ▼
          </h2>

          <div className="diary-calendar-wrapper">
            {showCalendar && (
              <div className="diary-calendar-popup">
                <Calendar
                  onChange={(newDate) => {
                    setDate(newDate);
                    setShowCalendar(false);
                    setEditMode(false); // 날짜 변경 시 편집 모드 해제
                  }}
                  value={date}
                />
              </div>
            )}
          </div>
        </div>

        <div className="summary-box">
          <p className="summary-title">📌 이 날의 소비 내역</p>
          {expenseData.income > 0 && (
            <p className="income">수입 : {formatAmount(expenseData.income)}원</p>
          )}
          <p className="expense">지출 : {formatAmount(expenseData.totalExpense)}원</p>

          {expenseData.totalExpense === 0 && expenseData.income === 0 ? (
            <div className="empty-expense-msg">
              <p style={{ color: '#999', fontSize: '14px', marginTop: '20px' }}>
                이 날은 소비 내역이 없습니다
              </p>
            </div>
          ) : (
            <div className="chart-wrapper">
              <CategoryChart data={expenseData.chartData} />
            </div>
          )}
        </div>
      </div>

      <div className="right-panel">
        <div className="diary-box">
          {/* 헤더에 삭제 버튼 추가 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Diary</h2>
            {!editMode && diaryText.trim() && !isLoading && (
              <button
                onClick={deleteDiary}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                🗑️ 삭제
              </button>
            )}
          </div>

          {/* 로딩 상태 표시 */}
          {isLoading && (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#666',
                fontSize: '16px',
              }}
            >
              ⏳ 로딩 중...
            </div>
          )}

          {/* 편집 모드 */}
          {!isLoading && editMode ? (
            <>
              <textarea
                value={diaryText}
                onChange={(e) => setDiaryText(e.target.value)}
                placeholder="오늘의 소비와 하루를 돌아보며 일기를 작성해보세요..."
              />
              <button onClick={handleButtonClick}>{getButtonText()}</button>
            </>
          ) : (
            /* 읽기 모드 */
            !isLoading && (
              <>
                <div className="lined-paper">
                  {diaryText ? (
                    diaryText.split('\n').map((line, idx) => (
                      <div className="paper-line" key={idx}>
                        {line || <span>&nbsp;</span>}
                      </div>
                    ))
                  ) : (
                    <p className="empty-msg">아직 작성된 일기가 없습니다 😊</p>
                  )}
                </div>
                <button onClick={handleButtonClick}>{getButtonText()}</button>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default DiaryPage;
