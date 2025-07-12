// src/pages/ChallengePage.jsx
import { useState, useMemo, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import S from '@styles/challengePage.style';

const challengeStatus = {
  SUCCESS: '성공',
  FAIL: '실패',
  ONGOING: '진행중',
  PENDING: '시작 대기중',
};

function ChallengePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formCurrentAmount, setFormCurrentAmount] = useState(0);

  // 챌린지 추가 모달 initial Data
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    targetAmount: '',
    reward: '',
    contents: '',
  });

  // Mock 소비 데이터 (백엔드 MOONEY_EXPENSE 테이블에서 가져올 데이터)
  const mockExpenseData = useMemo(
    () => [
      { date: '2025-01-01', amount: 50000 },
      { date: '2025-01-02', amount: 30000 },
      { date: '2025-01-03', amount: 20000 },
      { date: '2025-01-04', amount: 45000 },
      { date: '2025-01-05', amount: 25000 },
      { date: '2025-01-06', amount: 35000 },
      { date: '2025-01-07', amount: 40000 },
      { date: '2025-01-08', amount: 55000 },
      { date: '2025-01-09', amount: 30000 },
      { date: '2025-01-10', amount: 70000 },
      { date: '2024-11-13', amount: 111111 },
      { date: '2024-12-12', amount: 500001 },
    ],
    [],
  );

  // 모든 챌린지 데이터 (실제로는 API에서 가져올 데이터)
  const [mockAllChallenges, setMockAllChallenges] = useState([
    {
      id: 1,
      title: '1월 절약 챌린지',
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      targetAmount: 600000,
      reward: 100,
      contents: '1월 한 달 동안 60만원 이하로 소비하기',
    },
    {
      id: 2,
      title: '12월 절약 챌린지',
      startDate: '2024-12-01',
      endDate: '2024-12-31',
      targetAmount: 500000,
      reward: 150,
      contents: '12월 연말 소비 줄이기',
    },
    {
      id: 3,
      title: '11월 절약 챌린지',
      startDate: '2024-11-01',
      endDate: '2024-11-30',
      targetAmount: 400000,
      reward: 100,
      contents: '11월 식비 절약하기',
    },
    {
      id: 4,
      title: '2월 절약 챌린지',
      startDate: '2025-02-01',
      endDate: '2025-02-28',
      targetAmount: 550000,
      reward: 120,
      contents: '2월 교통비 절약하기',
    },
    {
      id: 5,
      title: '9월 절약 챌린지',
      startDate: '2025-09-01',
      endDate: '2025-09-30',
      targetAmount: 500000,
      reward: 100,
      contents: '9월 쇼핑 절약하기',
    },
  ]);

  // startDate부터 현재(또는 endDate)까지의 지출 합계 계산
  const calculateCurrentAmount = useCallback(
    (startDate, endDate = null) => {
      const today = new Date();
      const challengeStartDate = new Date(startDate);

      // 시작일이 미래인 경우
      if (challengeStartDate > today) {
        return 0;
      }

      const challengeEndDate = endDate ? new Date(endDate) : today;
      const calculationEndDate = challengeEndDate < today ? challengeEndDate : today;

      return mockExpenseData
        .filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= challengeStartDate && expenseDate <= calculationEndDate;
        })
        .reduce((total, expense) => total + expense.amount, 0);
    },
    [mockExpenseData],
  );

  // 챌린지 상태 계산 함수
  const calculateChallengeStatus = useCallback((challenge, currentAmount) => {
    const today = new Date();
    const startDate = new Date(challenge.startDate);
    const endDate = new Date(challenge.endDate);

    // 시작일이 미래인 경우
    if (startDate > today) {
      return challengeStatus.PENDING;
    }

    // 목표 금액 초과
    if (currentAmount > challenge.targetAmount) {
      return challengeStatus.FAIL;
    }

    // 챌린지 종료 + 목표 달성
    if (endDate <= today) {
      return challengeStatus.SUCCESS;
    }

    // 진행중
    return challengeStatus.ONGOING;
  }, []);

  // 기간 진행률 계산 함수
  const calculateTimeProgress = useCallback((startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= today) return 0;
    if (end <= today) return 100;

    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const passedDays = Math.ceil((today - start) / (1000 * 60 * 60 * 24));

    return Math.min((passedDays / totalDays) * 100, 100);
  }, []);

  // 남은 일수 계산 함수
  const calculateRemainingDays = useCallback((endDate) => {
    const today = new Date();
    const end = new Date(endDate);

    if (end <= today) return 0;
    return Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  }, []);

  // 모든 챌린지에 계산된 데이터 추가
  const challengesWithStatus = useMemo(() => {
    return mockAllChallenges.map((challenge) => {
      const currentAmount = calculateCurrentAmount(challenge.startDate, challenge.endDate);
      const status = calculateChallengeStatus(challenge, currentAmount);
      const gaugeBar =
        challenge.targetAmount > 0
          ? Math.min((currentAmount / challenge.targetAmount) * 100, 100)
          : 0;
      const timeProgress = calculateTimeProgress(challenge.startDate, challenge.endDate);
      const remainingDays = calculateRemainingDays(challenge.endDate);

      return {
        ...challenge,
        currentAmount,
        status,
        gaugeBar,
        timeProgress,
        remainingDays,
      };
    });
  }, [
    mockAllChallenges,
    calculateCurrentAmount,
    calculateChallengeStatus,
    calculateTimeProgress,
    calculateRemainingDays,
  ]);

  // 상태별로 챌린지 분류
  const { currentChallenge, previousChallenges, pendingChallenges } = useMemo(() => {
    const current = challengesWithStatus.find((c) => c.status === challengeStatus.ONGOING) || null;
    const previous = challengesWithStatus.filter(
      (c) => c.status === challengeStatus.SUCCESS || c.status === challengeStatus.FAIL,
    );
    const pending = challengesWithStatus.filter((c) => c.status === challengeStatus.PENDING);

    return {
      currentChallenge: current,
      previousChallenges: previous,
      pendingChallenges: pending,
    };
  }, [challengesWithStatus]);

  // 전체 챌린지 성공률 계산
  const successRate = useMemo(() => {
    if (previousChallenges.length === 0) return 0;

    const successCount = previousChallenges.filter(
      (challenge) => challenge.status === challengeStatus.SUCCESS,
    ).length;

    return Math.round((successCount / previousChallenges.length) * 100);
  }, [previousChallenges]);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
    setFormCurrentAmount(0);
    setFormData({
      title: '',
      startDate: '',
      endDate: '',
      targetAmount: '',
      reward: '',
      contents: '',
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setFormCurrentAmount(0);
    setFormData({
      title: '',
      startDate: '',
      endDate: '',
      targetAmount: '',
      reward: '',
      contents: '',
    });
  }, []);

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleStartDateChange = useCallback(
    (e) => {
      const selectedStartDate = e.target.value;
      handleFormChange(e);
      const calculatedAmount = calculateCurrentAmount(selectedStartDate);
      setFormCurrentAmount(calculatedAmount);
    },
    [handleFormChange, calculateCurrentAmount],
  );

  const validateForm = useCallback((formData) => {
    const { title, startDate, endDate, targetAmount, reward } = formData;

    if (!title.trim()) {
      toast.error('챌린지 이름을 입력해주세요.');
      return false;
    }

    if (!startDate) {
      toast.error('시작 날짜를 선택해주세요.');
      return false;
    }

    if (!endDate) {
      toast.error('종료 날짜를 선택해주세요.');
      return false;
    }

    if (!targetAmount || parseInt(targetAmount) <= 0) {
      toast.error('목표 금액을 올바르게 입력해주세요.');
      return false;
    }

    if (reward && (reward < 10 || reward > 200)) {
      toast.error('보상 포인트는 최소 10포인트, 최대 200포인트입니다.');
      return false;
    }

    return true;
  }, []);

  const handleCreateChallenge = useCallback(
    (e) => {
      e.preventDefault();

      if (!validateForm(formData)) {
        return;
      }

      const newChallenge = {
        id: Date.now(),
        title: formData.title,
        startDate: formData.startDate,
        endDate: formData.endDate,
        targetAmount: parseInt(formData.targetAmount),
        reward: parseInt(formData.reward) || 0,
        contents: formData.contents || '',
      };

      setMockAllChallenges((prev) => [...prev, newChallenge]);
      toast.success('챌린지가 성공적으로 생성되었습니다!');
      handleCloseModal();
    },
    [formData, validateForm, handleCloseModal],
  );

  // 상태별 배경색 결정
  const getStatusColor = useCallback((status) => {
    switch (status) {
      case challengeStatus.SUCCESS:
        return '#4CAF50';
      case challengeStatus.FAIL:
        return '#ff4444';
      case challengeStatus.ONGOING:
        return '#2196F3';
      case challengeStatus.PENDING:
        return '#FF9800';
      default:
        return '#666';
    }
  }, []);

  return (
    <>
      <S.PageContainer>
        {/* 왼쪽 */}
        <S.LeftColumn>
          {/* 현재 진행중인 챌린지 카드 */}
          {currentChallenge ? (
            <S.Card>
              <S.SectionTitle>나의 챌린지</S.SectionTitle>
              <S.ChallengeHeader>
                <S.ChallengeTitle>{currentChallenge.title}</S.ChallengeTitle>
                <S.ChallengeDateRange>
                  {currentChallenge.startDate} ~ {currentChallenge.endDate}
                </S.ChallengeDateRange>
              </S.ChallengeHeader>

              <S.TargetAmount>
                목표 지출: {currentChallenge.targetAmount.toLocaleString()}원
              </S.TargetAmount>

              {/* 기간 진행률 게이지바 */}
              <S.GaugeContainer marginBottom="20px">
                <S.GaugeHeader>
                  <S.GaugeLabel>기간 진행률</S.GaugeLabel>
                  <S.GaugeValue>
                    {currentChallenge.remainingDays > 0
                      ? `${currentChallenge.remainingDays}일 남음`
                      : '종료됨'}
                  </S.GaugeValue>
                </S.GaugeHeader>
                <S.GaugeBar bgColor="#f0f0f0" height="8px">
                  <S.GaugeFill fillColor="#9C27B0" width={currentChallenge.timeProgress} />
                </S.GaugeBar>
                <S.GaugeText>{Math.round(currentChallenge.timeProgress)}% 진행</S.GaugeText>
              </S.GaugeContainer>

              {/* 지출 진행률 게이지바 */}
              <S.GaugeContainer>
                <S.GaugeHeader>
                  <S.GaugeLabel>지출 진행률</S.GaugeLabel>
                  <S.GaugeValue>{Math.round(currentChallenge.gaugeBar)}%</S.GaugeValue>
                </S.GaugeHeader>
                <S.GaugeBar>
                  <S.GaugeFill
                    fillColor={getStatusColor(currentChallenge.status)}
                    width={currentChallenge.gaugeBar}
                  />
                </S.GaugeBar>
              </S.GaugeContainer>

              <S.AmountDisplay>
                현재 지출: {currentChallenge.currentAmount.toLocaleString()}원
              </S.AmountDisplay>

              <S.AmountDisplay
                fontWeight="bold"
                color={
                  currentChallenge.targetAmount - currentChallenge.currentAmount >= 0
                    ? '#4CAF50'
                    : '#ff4444'
                }
              >
                목표까지 남은 지출:{' '}
                {(currentChallenge.targetAmount - currentChallenge.currentAmount).toLocaleString()}
                원
              </S.AmountDisplay>

              {currentChallenge.status !== challengeStatus.ONGOING && (
                <S.StatusBadge bgColor={getStatusColor(currentChallenge.status)}>
                  {currentChallenge.status}
                </S.StatusBadge>
              )}
            </S.Card>
          ) : (
            <S.Card center>
              <S.SectionTitle>나의 챌린지</S.SectionTitle>
              <p>현재 진행중인 챌린지가 없습니다.</p>
              <p>새로운 챌린지를 만들어보세요!</p>
            </S.Card>
          )}

          {/* 이전 진행 챌린지 */}
          <S.Card>
            <S.SubSectionTitle>지금까지 진행한 챌린지</S.SubSectionTitle>
            {previousChallenges.length > 0 ? (
              previousChallenges.map((item) => (
                <S.PreviousChallengeItem key={item.id}>
                  <S.PreviousChallengeHeader>
                    <S.PreviousChallengeTitle>{item.title}</S.PreviousChallengeTitle>
                    <S.StatusBadge bgColor={getStatusColor(item.status)}>
                      {item.status}
                    </S.StatusBadge>
                  </S.PreviousChallengeHeader>
                  <S.PreviousChallengeDateRange>
                    {item.startDate} ~ {item.endDate}
                  </S.PreviousChallengeDateRange>
                  <S.GaugeBar height="6px">
                    <S.GaugeFill
                      fillColor={getStatusColor(item.status)}
                      width={Math.min(item.gaugeBar, 100)}
                    />
                  </S.GaugeBar>
                  <S.PreviousChallengeDetails>
                    사용 금액: {item.currentAmount.toLocaleString()} /{' '}
                    {item.targetAmount.toLocaleString()}원 ({Math.round(item.gaugeBar)}%)
                  </S.PreviousChallengeDetails>
                </S.PreviousChallengeItem>
              ))
            ) : (
              <S.EmptyState>완료된 챌린지가 없습니다.</S.EmptyState>
            )}
          </S.Card>
        </S.LeftColumn>

        {/* 오른쪽 */}
        <S.RightColumn>
          <S.AddButton onClick={handleOpenModal}>+ Challenge 추가</S.AddButton>

          <S.SuccessRateCard>
            <p style={{ margin: '0 0 10px 0' }}>챌린지 성공률</p>
            <S.SuccessRateValue>{successRate}%</S.SuccessRateValue>
          </S.SuccessRateCard>

          <S.PointsCard>
            <S.PointsLabel>현재 보유중인 포인트</S.PointsLabel>
            <S.PointsValue>1,250 P</S.PointsValue>
          </S.PointsCard>

          <S.Card>
            <S.SubSectionTitle>시작 대기 중인 챌린지</S.SubSectionTitle>
            {pendingChallenges.length > 0 ? (
              pendingChallenges.map((challenge) => (
                <S.PendingChallengeItem key={challenge.id}>
                  <S.PendingChallengeHeader>
                    <S.PendingChallengeTitle>{challenge.title}</S.PendingChallengeTitle>
                    <S.StatusBadge bgColor="#FF9800">{challenge.status}</S.StatusBadge>
                  </S.PendingChallengeHeader>
                  <S.PendingChallengeInfo>
                    {challenge.startDate} ~ {challenge.endDate}
                  </S.PendingChallengeInfo>
                  <S.PendingChallengeInfo>
                    목표: {challenge.targetAmount.toLocaleString()}원
                  </S.PendingChallengeInfo>
                </S.PendingChallengeItem>
              ))
            ) : (
              <S.EmptyState>대기 중인 챌린지가 없습니다.</S.EmptyState>
            )}
          </S.Card>
        </S.RightColumn>
      </S.PageContainer>

      {/* 모달창 */}
      {isModalOpen && (
        <S.ModalOverlay>
          <S.ModalContent>
            <S.ModalTitle>Challenge 추가</S.ModalTitle>
            <form onSubmit={handleCreateChallenge}>
              <S.FormGroup>
                <S.Label>챌린지 이름</S.Label>
                <S.Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  required
                />
              </S.FormGroup>

              <S.FormRow>
                <S.FormColumn>
                  <S.Label htmlFor="startDate">시작 날짜</S.Label>
                  <S.Input
                    type="date"
                    name="startDate"
                    id="startDate"
                    value={formData.startDate}
                    onChange={handleStartDateChange}
                    required
                  />
                </S.FormColumn>
                <S.FormColumn>
                  <S.Label htmlFor="endDate">종료 날짜</S.Label>
                  <S.Input
                    type="date"
                    name="endDate"
                    id="endDate"
                    value={formData.endDate}
                    onChange={handleFormChange}
                    required
                  />
                </S.FormColumn>
              </S.FormRow>

              <S.FormGroup>
                <S.Label>목표 금액 (원)</S.Label>
                <S.Input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleFormChange}
                  required
                />
              </S.FormGroup>

              <S.FormGroup>
                <S.Label>보상 포인트</S.Label>
                <S.Input
                  type="number"
                  name="reward"
                  value={formData.reward}
                  onChange={handleFormChange}
                  placeholder="선택사항"
                />
              </S.FormGroup>

              <S.FormGroup>
                <S.Label>챌린지 설명</S.Label>
                <S.TextArea
                  name="contents"
                  value={formData.contents}
                  onChange={handleFormChange}
                  placeholder="선택사항"
                  rows="3"
                />
              </S.FormGroup>

              <S.FormGroup>
                <S.Label>현재 소비 금액</S.Label>
                <S.CurrentAmountDisplay>
                  {formCurrentAmount.toLocaleString()}원
                </S.CurrentAmountDisplay>
              </S.FormGroup>

              <S.ButtonRow>
                <S.SubmitButton type="submit">생성</S.SubmitButton>
                <S.CancelButton type="button" onClick={handleCloseModal}>
                  취소
                </S.CancelButton>
              </S.ButtonRow>
            </form>
          </S.ModalContent>
        </S.ModalOverlay>
      )}

      {/* ToastContainer */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default ChallengePage;
