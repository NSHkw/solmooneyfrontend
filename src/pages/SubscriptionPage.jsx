// src/pages/SubscriptionPage.jsx
import { useState, useEffect } from 'react';
import {
  FaPlus,
  FaSortAmountDown,
  FaSortAlphaDown,
  FaClock,
  FaCheck,
  FaTimes,
  FaEdit,
  FaTrash,
} from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const alignStyle = {
  LATEST: 'latest',
  HIGHEST: 'highest',
  NAMING: 'naming',
};

function SubscriptionPage() {
  const [alignWay, setAlignWay] = useState(alignStyle.LATEST);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [formData, setFormData] = useState({
    mexpDec: '', // 구독 서비스 설명
    mexpAmt: '', // 금액
    mexpRptdd: '', // 다음 결제일
    mcatId: '', // 카테고리 ID
  });

  // Mock 카테고리 데이터 (실제로는 Mooney_Category 테이블에서 가져올 데이터)
  const [categories] = useState([
    { mcatId: 1, mcatName: '엔터테인먼트', mcatColor: '#FF6384' },
    { mcatId: 2, mcatName: '업무/생산성', mcatColor: '#36A2EB' },
    { mcatId: 3, mcatName: '클라우드 저장소', mcatColor: '#FFCE56' },
    { mcatId: 4, mcatName: '쇼핑', mcatColor: '#8BC34A' },
    { mcatId: 5, mcatName: '기타', mcatColor: '#9C27B0' },
  ]);

  // Mock 반복 지출 데이터 (실제로는 MEXP_RPT = 'T'이고 MEXP_TYPE = 'E'인 데이터)
  const [subscriptions, setSubscriptions] = useState([
    {
      mexpId: 1,
      mexpMmemId: 'user001',
      mexpDt: '2025-07-05',
      mexpAmt: 17000,
      mexpDec: 'Netflix 구독료',
      mexpType: 'E',
      mexpRpt: 'T',
      mexpRptdd: '2025-08-05',
      mcatId: 1,
      categoryName: '엔터테인먼트',
      categoryColor: '#FF6384',
      isPaid: true, // 이번 달 결제 여부 (계산된 값)
    },
    {
      mexpId: 2,
      mexpMmemId: 'user001',
      mexpDt: '2025-07-10',
      mexpAmt: 10900,
      mexpDec: 'Spotify Premium',
      mexpType: 'E',
      mexpRpt: 'T',
      mexpRptdd: '2025-08-10',
      mcatId: 1,
      categoryName: '엔터테인먼트',
      categoryColor: '#FF6384',
      isPaid: true,
    },
    {
      mexpId: 3,
      mexpMmemId: 'user001',
      mexpDt: '2025-07-15',
      mexpAmt: 29000,
      mexpDec: 'Adobe Creative Cloud',
      mexpType: 'E',
      mexpRpt: 'T',
      mexpRptdd: '2025-08-15',
      mcatId: 2,
      categoryName: '업무/생산성',
      categoryColor: '#36A2EB',
      isPaid: false,
    },
    {
      mexpId: 4,
      mexpMmemId: 'user001',
      mexpDt: '2025-07-01',
      mexpAmt: 2900,
      mexpDec: 'Google Drive 스토리지',
      mexpType: 'E',
      mexpRpt: 'T',
      mexpRptdd: '2025-08-01',
      mcatId: 3,
      categoryName: '클라우드 저장소',
      categoryColor: '#FFCE56',
      isPaid: true,
    },
    {
      mexpId: 5,
      mexpMmemId: 'user001',
      mexpDt: '2025-07-20',
      mexpAmt: 4990,
      mexpDec: '쿠팡 와우 멤버십',
      mexpType: 'E',
      mexpRpt: 'T',
      mexpRptdd: '2025-08-20',
      mcatId: 4,
      categoryName: '쇼핑',
      categoryColor: '#8BC34A',
      isPaid: false,
    },
  ]);

  // 카테고리별 지출 차트 데이터 계산
  const getChartData = () => {
    const categoryTotals = {};

    subscriptions.forEach((sub) => {
      const categoryName = sub.categoryName;
      if (!categoryTotals[categoryName]) {
        categoryTotals[categoryName] = {
          category: categoryName,
          amount: 0,
          color: sub.categoryColor,
        };
      }
      categoryTotals[categoryName].amount += sub.mexpAmt;
    });

    return Object.values(categoryTotals);
  };

  // 정렬 함수
  const getSortedSubscriptions = () => {
    const sorted = [...subscriptions];
    switch (alignWay) {
      case alignStyle.HIGHEST:
        return sorted.sort((a, b) => b.mexpAmt - a.mexpAmt);
      case alignStyle.NAMING:
        return sorted.sort((a, b) => a.mexpDec.localeCompare(b.mexpDec));
      case alignStyle.LATEST:
      default:
        return sorted.sort((a, b) => new Date(b.mexpRptdd) - new Date(a.mexpRptdd));
    }
  };

  // 이번 달 총 구독 지출 계산
  const getTotalSubscriptionAmount = () => {
    return subscriptions.reduce((total, sub) => total + sub.mexpAmt, 0);
  };

  // 결제 완료된 구독료 계산
  const getPaidAmount = () => {
    return subscriptions.filter((sub) => sub.isPaid).reduce((total, sub) => total + sub.mexpAmt, 0);
  };

  // 미결제 구독료 계산
  const getUnpaidAmount = () => {
    return subscriptions
      .filter((sub) => !sub.isPaid)
      .reduce((total, sub) => total + sub.mexpAmt, 0);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddOrUpdateSubscription = (e) => {
    e.preventDefault();

    const selectedCategory = categories.find((cat) => cat.mcatId === parseInt(formData.mcatId));

    const subscriptionData = {
      mexpMmemId: 'user001', // 실제로는 로그인된 사용자 ID
      mexpDt: new Date().toISOString().split('T')[0], // 오늘 날짜
      mexpAmt: parseInt(formData.mexpAmt),
      mexpDec: formData.mexpDec,
      mexpType: 'E', // 지출
      mexpRpt: 'T', // 반복 지출
      mexpRptdd: formData.mexpRptdd,
      mcatId: parseInt(formData.mcatId),
      categoryName: selectedCategory.mcatName,
      categoryColor: selectedCategory.mcatColor,
      isPaid: false, // 새로 추가된 구독은 기본적으로 미결제
    };

    if (editingSubscription) {
      // 수정 모드
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.mexpId === editingSubscription.mexpId
            ? { ...subscriptionData, mexpId: editingSubscription.mexpId }
            : sub,
        ),
      );
    } else {
      // 추가 모드
      const newSubscription = {
        ...subscriptionData,
        mexpId: Date.now(), // 임시 ID (실제로는 DB에서 auto increment)
      };
      setSubscriptions((prev) => [...prev, newSubscription]);
    }

    // 폼 초기화 및 모달 닫기
    setIsModalOpen(false);
    setEditingSubscription(null);
    setFormData({
      mexpDec: '',
      mexpAmt: '',
      mexpRptdd: '',
      mcatId: '',
    });
  };

  const handleEditSubscription = (subscription) => {
    setEditingSubscription(subscription);
    setFormData({
      mexpDec: subscription.mexpDec,
      mexpAmt: subscription.mexpAmt.toString(),
      mexpRptdd: subscription.mexpRptdd,
      mcatId: subscription.mcatId.toString(),
    });
    setIsModalOpen(true);
  };

  const handleDeleteSubscription = (mexpId) => {
    if (window.confirm('정말로 이 구독을 삭제하시겠습니까?')) {
      setSubscriptions((prev) => prev.filter((sub) => sub.mexpId !== mexpId));
    }
  };

  const handleOpenAddModal = () => {
    setEditingSubscription(null);
    setFormData({
      mexpDec: '',
      mexpAmt: '',
      mexpRptdd: '',
      mcatId: '',
    });
    setIsModalOpen(true);
  };

  // 이번 달 결제 여부 업데이트 (실제로는 현재 날짜와 MEXP_DT를 비교해서 결제 여부 판단)
  const togglePaymentStatus = (mexpId) => {
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.mexpId === mexpId ? { ...sub, isPaid: !sub.isPaid } : sub)),
    );
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: '30px' }}>
        <h1
          style={{
            margin: '0 0 10px 0',
            fontSize: '28px',
            color: '#333',
            fontWeight: 'bold',
          }}
        >
          구독 관리
        </h1>
        <p style={{ margin: '0', color: '#666', fontSize: '16px' }}>
          정기 구독 서비스를 관리하고 지출을 추적하세요 (반복 지출 관리)
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '30px',
          height: 'calc(100vh - 150px)',
        }}
      >
        {/* 왼쪽: 구독 리스트 */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* 정렬 버튼들 */}
          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '20px',
              backgroundColor: 'white',
              padding: '15px',
              borderRadius: '15px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            <button
              onClick={() => setAlignWay(alignStyle.LATEST)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: alignWay === alignStyle.LATEST ? '#4A90E2' : '#f0f0f0',
                color: alignWay === alignStyle.LATEST ? 'white' : '#666',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                transition: 'all 0.2s',
              }}
            >
              <FaClock size={12} />
              다음결제일순
            </button>
            <button
              onClick={() => setAlignWay(alignStyle.HIGHEST)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: alignWay === alignStyle.HIGHEST ? '#4A90E2' : '#f0f0f0',
                color: alignWay === alignStyle.HIGHEST ? 'white' : '#666',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                transition: 'all 0.2s',
              }}
            >
              <FaSortAmountDown size={12} />
              높은 금액순
            </button>
            <button
              onClick={() => setAlignWay(alignStyle.NAMING)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: alignWay === alignStyle.NAMING ? '#4A90E2' : '#f0f0f0',
                color: alignWay === alignStyle.NAMING ? 'white' : '#666',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                transition: 'all 0.2s',
              }}
            >
              <FaSortAlphaDown size={12} />
              이름순
            </button>
          </div>

          {/* 구독 리스트 */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              flex: 1,
              overflow: 'auto',
            }}
          >
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#333' }}>
              반복 지출 내역 (MEXP_RPT = 'T')
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {getSortedSubscriptions().map((subscription) => (
                <div
                  key={subscription.mexpId}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: `2px solid ${subscription.isPaid ? '#4CAF50' : '#FF4D4D'}`,
                    backgroundColor: subscription.isPaid ? '#f8fff8' : '#fff8f8',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: subscription.categoryColor,
                        }}
                      />
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#333' }}>
                          {subscription.mexpDec}
                        </h4>
                        <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                          {subscription.categoryName} • 다음 결제: {subscription.mexpRptdd}
                        </p>
                        <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#999' }}>
                          ID: {subscription.mexpId} • 최근 결제: {subscription.mexpDt}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: subscription.isPaid ? '#4CAF50' : '#FF4D4D',
                          }}
                        >
                          {subscription.mexpAmt.toLocaleString()}원
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: subscription.isPaid ? '#4CAF50' : '#FF4D4D',
                            fontWeight: '500',
                          }}
                        >
                          {subscription.isPaid ? '결제 완료' : '결제 필요'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <button
                          onClick={() => togglePaymentStatus(subscription.mexpId)}
                          style={{
                            padding: '4px 8px',
                            border: 'none',
                            borderRadius: '4px',
                            backgroundColor: subscription.isPaid ? '#4CAF50' : '#FF4D4D',
                            color: 'white',
                            fontSize: '10px',
                            cursor: 'pointer',
                          }}
                        >
                          {subscription.isPaid ? <FaCheck size={10} /> : <FaTimes size={10} />}
                        </button>
                        <button
                          onClick={() => handleEditSubscription(subscription)}
                          style={{
                            padding: '4px 8px',
                            border: 'none',
                            borderRadius: '4px',
                            backgroundColor: '#4A90E2',
                            color: 'white',
                            fontSize: '10px',
                            cursor: 'pointer',
                          }}
                        >
                          <FaEdit size={10} />
                        </button>
                        <button
                          onClick={() => handleDeleteSubscription(subscription.mexpId)}
                          style={{
                            padding: '4px 8px',
                            border: 'none',
                            borderRadius: '4px',
                            backgroundColor: '#FF4D4D',
                            color: 'white',
                            fontSize: '10px',
                            cursor: 'pointer',
                          }}
                        >
                          <FaTrash size={10} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 오른쪽: 지출 내역 및 차트 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 이번 달 구독 지출 */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '25px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              textAlign: 'center',
            }}
          >
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#666' }}>
              이번 달 반복 지출 총계
            </h3>
            <div
              style={{ margin: '0 0 15px 0', fontSize: '32px', fontWeight: 'bold', color: '#333' }}
            >
              {getTotalSubscriptionAmount().toLocaleString()}원
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <div style={{ color: '#4CAF50' }}>결제완료: {getPaidAmount().toLocaleString()}원</div>
              <div style={{ color: '#FF4D4D' }}>미결제: {getUnpaidAmount().toLocaleString()}원</div>
            </div>
          </div>

          {/* 카테고리별 지출 차트 */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              flex: 1,
            }}
          >
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#333' }}>
              카테고리별 반복 지출
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={getChartData()} barSize={30}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" fontSize={12} tick={{ fill: '#666' }} />
                <YAxis
                  fontSize={12}
                  tick={{ fill: '#666' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(value) => [`${value.toLocaleString()}원`, '지출']}
                  labelStyle={{ color: '#333' }}
                />
                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                  {getChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 구독 추가 버튼 */}
          <button
            onClick={handleOpenAddModal}
            style={{
              backgroundColor: '#4A90E2',
              color: 'white',
              border: 'none',
              borderRadius: '15px',
              padding: '20px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.2s',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#357abd';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#4A90E2';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }}
          >
            <FaPlus size={16} />새 반복 지출 추가
          </button>
        </div>
      </div>

      {/* 구독 추가/수정 모달 */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '30px',
              width: '450px',
              maxWidth: '90vw',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            }}
          >
            <h2
              style={{ margin: '0 0 25px 0', fontSize: '24px', color: '#333', textAlign: 'center' }}
            >
              {editingSubscription ? '반복 지출 수정' : '반복 지출 추가'}
            </h2>
            <form onSubmit={handleAddOrUpdateSubscription}>
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#333',
                    fontSize: '14px',
                  }}
                >
                  지출 설명 (MEXP_DEC)
                </label>
                <input
                  type="text"
                  name="mexpDec"
                  value={formData.mexpDec}
                  onChange={handleFormChange}
                  required
                  placeholder="Netflix 구독료, Spotify Premium 등"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#4A90E2')}
                  onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#333',
                    fontSize: '14px',
                  }}
                >
                  카테고리 (MCAT_ID)
                </label>
                <select
                  name="mcatId"
                  value={formData.mcatId}
                  onChange={handleFormChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: 'white',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#4A90E2')}
                  onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
                >
                  <option value="">카테고리 선택</option>
                  {categories.map((category) => (
                    <option key={category.mcatId} value={category.mcatId}>
                      {category.mcatName}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#333',
                    fontSize: '14px',
                  }}
                >
                  금액 (MEXP_AMT)
                </label>
                <input
                  type="number"
                  name="mexpAmt"
                  value={formData.mexpAmt}
                  onChange={handleFormChange}
                  required
                  placeholder="15000"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#4A90E2')}
                  onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#333',
                    fontSize: '14px',
                  }}
                >
                  다음 결제일 (MEXP_RPTDD)
                </label>
                <input
                  type="date"
                  name="mexpRptdd"
                  value={formData.mexpRptdd}
                  onChange={handleFormChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '10px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#4A90E2')}
                  onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '14px',
                    backgroundColor: '#4A90E2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#357abd')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = '#4A90E2')}
                >
                  {editingSubscription ? '수정' : '추가'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    backgroundColor: '#f0f0f0',
                    color: '#666',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#e0e0e0')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = '#f0f0f0')}
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubscriptionPage;
