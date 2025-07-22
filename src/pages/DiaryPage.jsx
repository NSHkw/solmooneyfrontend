// src/pages/DiaryPage.jsx
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../css/DiaryPage.css';
import diaryImg from '../img/pencil_mooney.png';
import CategoryChart from '../components/CategoryChart';
import EXPENSE_API from './../services/mock/mockExpense';

const DiaryPage = () => {
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [diaryText, setDiaryText] = useState('');
  const [savedDiaries, setSavedDiaries] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [mood, setMood] = useState('😀');
  const [summary, setSummary] = useState('');

  // 소비 내역 상태 추가
  const [expenseData, setExpenseData] = useState({
    income: 0,
    totalExpense: 0,
    chartData: [],
  });

  const formatDateKey = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(
      2,
      '0',
    )}`;

  const formatDisplayDate = (d) => `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;

  // 금액 포맷팅 함수
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  // 날짜가 바뀔 때마다 소비 내역과 일기 데이터 로드
  useEffect(() => {
    // 일기 데이터 로드
    const stored = localStorage.getItem('diaries');
    if (stored) {
      const parsed = JSON.parse(stored);
      setSavedDiaries(parsed);
      const key = formatDateKey(date);
      setDiaryText(parsed[key]?.text || '');
      setSummary(parsed[key]?.summary || '');
      setMood(parsed[key]?.mood || '😀');
    } else {
      // 저장된 일기가 없을 때 초기화
      setDiaryText('');
      setSummary('');
      setMood('😀');
    }

    // 소비 내역 데이터 로드
    const dayExpenseData = EXPENSE_API.getExpensesByDate(date, 'user001');

    // 실제 데이터가 없으면 샘플 데이터 사용
    if (dayExpenseData.totalExpense === 0 && dayExpenseData.income === 0) {
      const sampleData = EXPENSE_API.generateSampleDataForDate(date);
      setExpenseData(sampleData);
    } else {
      setExpenseData(dayExpenseData);
    }
  }, [date]);

  const saveDiary = () => {
    const key = formatDateKey(date);
    const updated = {
      ...savedDiaries,
      [key]: {
        text: diaryText,
        summary,
        mood,
      },
    };
    setSavedDiaries(updated);
    localStorage.setItem('diaries', JSON.stringify(updated));
    setEditMode(false);
  };

  // 일기 내용이 있는지 확인하여 버튼 텍스트 결정
  const getButtonText = () => {
    if (editMode) {
      return '💾 저장';
    }
    return diaryText.trim() ? '✏️ 수정하기' : '✏️ 일기 쓰기';
  };

  const handleButtonClick = () => {
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
          <h2>Diary</h2>

          {editMode ? (
            <>
              <textarea
                value={diaryText}
                onChange={(e) => setDiaryText(e.target.value)}
                placeholder="오늘의 소비와 하루를 돌아보며 일기를 작성해보세요..."
              />
              <textarea
                className="one-line-thought"
                placeholder="오늘의 한 줄 요약 ✍️"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                style={{
                  height: '50px',
                  marginTop: '10px',
                  fontSize: '14px',
                }}
              />
              <div
                className="mood-selector"
                style={{
                  margin: '15px 0',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                오늘 기분:
                {['😀', '😐', '😴', '😔'].map((face) => (
                  <span
                    key={face}
                    onClick={() => setMood(face)}
                    style={{
                      opacity: mood === face ? 1 : 0.4,
                      cursor: 'pointer',
                      fontSize: '20px',
                      padding: '5px',
                    }}
                  >
                    {face}
                  </span>
                ))}
              </div>
              <button onClick={handleButtonClick}>{getButtonText()}</button>
            </>
          ) : (
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
              <div
                className="summary-and-mood"
                style={{
                  padding: '15px 0',
                  borderTop: '1px solid #f0f4f8',
                  marginTop: '15px',
                }}
              >
                <p
                  className="summary-display"
                  style={{
                    fontSize: '16px',
                    color: '#37485c',
                    marginBottom: '8px',
                  }}
                >
                  오늘의 한 마디: {summary || '💬'}
                </p>
                <p
                  className="mood-display"
                  style={{
                    fontSize: '16px',
                    color: '#37485c',
                  }}
                >
                  오늘 기분: {mood}
                </p>
              </div>
              <button onClick={handleButtonClick}>{getButtonText()}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiaryPage;
