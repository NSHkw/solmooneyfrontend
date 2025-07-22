// src/services/mock/mockExpense.js
import MOCKDATA from '../../assets/mockData.js';

/**
 * 특정 날짜의 소비 내역을 가져오는 Mock API
 * @param {Date} date - 조회할 날짜
 * @param {string} userId - 사용자 ID (기본값: 'user001')
 * @returns {Object} - 해당 날짜의 수입/지출 데이터와 카테고리별 집계
 */
const getExpensesByDate = (date, userId = 'user001') => {
  const targetDate = new Date(date);
  const dateString = targetDate.toISOString().split('T')[0]; // YYYY-MM-DD 형식

  // 해당 날짜의 지출 데이터 필터링
  const dayExpenses = MOCKDATA.mockExpenseData.filter((expense) => {
    // Date 객체를 문자열로 변환해서 비교
    const expenseDate = expense.mexpDt
      ? new Date(expense.mexpDt).toISOString().split('T')[0]
      : null;
    return (
      expense.mexpMmemId === userId &&
      expenseDate === dateString &&
      expense.mexpStatus === 'COMPLETED'
    );
  });

  // 수입과 지출 분리
  const income = dayExpenses
    .filter((expense) => expense.mexpType === 'I')
    .reduce((sum, expense) => sum + expense.mexpAmt, 0);

  const expenses = dayExpenses.filter((expense) => expense.mexpType === 'E');
  const totalExpense = expenses.reduce((sum, expense) => sum + expense.mexpAmt, 0);

  // 카테고리별 집계 (지출만)
  const categoryData = {};
  expenses.forEach((expense) => {
    const category = MOCKDATA.mockCategory.find((cat) => cat.mcatId === expense.mcatId);
    const categoryName = category ? category.mcatName : '기타';
    const categoryColor = category ? category.mcatColor : '#9C27B0';

    if (!categoryData[categoryName]) {
      categoryData[categoryName] = {
        amount: 0,
        color: categoryColor,
        items: [],
      };
    }

    categoryData[categoryName].amount += expense.mexpAmt;
    categoryData[categoryName].items.push({
      description: expense.mexpDec,
      amount: expense.mexpAmt,
    });
  });

  // 차트용 데이터 변환
  const chartData = Object.entries(categoryData).map(([name, data]) => ({
    name,
    value: data.amount,
    color: data.color,
  }));

  return {
    date: dateString,
    income,
    totalExpense,
    expenses: expenses.map((expense) => ({
      id: expense.mexpId,
      description: expense.mexpDec,
      amount: expense.mexpAmt,
      category:
        MOCKDATA.mockCategory.find((cat) => cat.mcatId === expense.mcatId)?.mcatName || '기타',
    })),
    categoryData,
    chartData,
  };
};

/**
 * 특정 월의 모든 날짜별 소비 요약 데이터 가져오기
 * @param {number} year - 연도
 * @param {number} month - 월 (1-12)
 * @param {string} userId - 사용자 ID
 * @returns {Array} - 월별 일자별 소비 요약 (실제 데이터만)
 */
const getMonthlyExpenseSummary = (year, month, userId = 'user001') => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  const summary = [];

  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayData = getExpensesByDate(new Date(d), userId);
    // 샘플 데이터 생성 로직 제거 - 실제 데이터만 사용
    summary.push(dayData);
  }

  return summary;
};

const EXPENSE_API = {
  getExpensesByDate,
  getMonthlyExpenseSummary,
};

export default EXPENSE_API;
