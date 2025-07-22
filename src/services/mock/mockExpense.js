// src/api/mockExpense.js
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
    return (
      expense.mexpMmemId === userId &&
      expense.mexpDt === dateString &&
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
 * 날짜별 더미 데이터 생성 (데이터가 없는 날짜를 위한 샘플 데이터)
 * @param {Date} date - 날짜
 * @returns {Object} - 더미 소비 데이터
 */
const generateSampleDataForDate = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;

  // 날짜 기반으로 다양한 샘플 데이터 생성
  const sampleData = [
    {
      income: 0,
      totalExpense: 45000,
      chartData: [
        { name: '식비', value: 25000, color: '#FF9F40' },
        { name: '교통비', value: 12000, color: '#4BC0C0' },
        { name: '기타', value: 8000, color: '#9C27B0' },
      ],
    },
    {
      income: 0,
      totalExpense: 32000,
      chartData: [
        { name: '쇼핑', value: 20000, color: '#8BC34A' },
        { name: '식비', value: 12000, color: '#FF9F40' },
      ],
    },
    {
      income: 0,
      totalExpense: 18000,
      chartData: [
        { name: '식비', value: 15000, color: '#FF9F40' },
        { name: '기타', value: 3000, color: '#9C27B0' },
      ],
    },
    {
      income: 3500000,
      totalExpense: 0,
      chartData: [],
    },
    {
      income: 0,
      totalExpense: 67000,
      chartData: [
        { name: '엔터테인먼트', value: 17000, color: '#FF6384' },
        { name: '식비', value: 35000, color: '#FF9F40' },
        { name: '교통비', value: 15000, color: '#4BC0C0' },
      ],
    },
  ];

  // 날짜 기반으로 샘플 데이터 선택
  const index = (day + month) % sampleData.length;
  return {
    date: date.toISOString().split('T')[0],
    ...sampleData[index],
    expenses: [],
    categoryData: {},
  };
};

/**
 * 특정 월의 모든 날짜별 소비 요약 데이터 가져오기
 * @param {number} year - 연도
 * @param {number} month - 월 (1-12)
 * @param {string} userId - 사용자 ID
 * @returns {Array} - 월별 일자별 소비 요약
 */
const getMonthlyExpenseSummary = (year, month, userId = 'user001') => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  const summary = [];

  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayData = getExpensesByDate(new Date(d), userId);

    // 실제 데이터가 없으면 샘플 데이터 사용
    if (dayData.totalExpense === 0 && dayData.income === 0) {
      const sampleData = generateSampleDataForDate(new Date(d));
      summary.push(sampleData);
    } else {
      summary.push(dayData);
    }
  }

  return summary;
};

const EXPENSE_API = { getExpensesByDate, generateSampleDataForDate, getMonthlyExpenseSummary };

export default EXPENSE_API;
