// src/pages/UserPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@route/routes.js';

function UserPage() {
  const navigate = useNavigate();
  // 사용자 정보 상태 관리
  const [MemData, setMemData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 카테고리 추가 모달 상태
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Mock 데이터
  const mockUserData = {
    id: 'testuser123',
    nick: '가계부마스터',
    pphoto: null, // 프로필 사진이 없는 경우
    regd: '2024-01-15T00:00:00Z',
    bir: '1995-06-20T00:00:00Z',
    ppnt: 15750, // 포인트
  };

  // Mock 사용자 정보 가져오기 (서버 연결 대신)
  const getUserinfoDTA = async () => {
    try {
      setIsLoading(true);

      // 실제 서버 연결 시뮬레이션 (1초 지연)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // localStorage에서 로그인 상태 확인 (실제 환경과 동일하게)
      const savedLoginState = localStorage.getItem('isYouLogined');

      if (!savedLoginState) {
        // 로그인 정보가 없으면 mock 데이터로 임시 설정
        console.log('로그인 정보가 없어 mock 데이터를 사용합니다.');
      }

      // Mock 데이터 설정
      setMemData(mockUserData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserinfoDTA();
  }, []);

  // 날짜 포맷팅 함수
  const formatDate = (str) => {
    if (!str) return '-';
    return new Date(str).toLocaleDateString('ko-KR');
  };

  // 페이지 이동 함수들 (실제 프로젝트에서는 useNavigate 사용)
  const goToEdit = () => {
    navigate(ROUTES.MODIFY_USER);
  };

  const goToExit = () => {
    if (confirm('정말 회원 탈퇴 페이지로 이동하시겠습니까?')) {
      // 기존 alert 대신 실제 페이지 이동
      navigate(ROUTES.WITHDRAWAL);
    }
  };

  const goToHome = () => {
    alert('홈페이지로 이동합니다. (실제 환경에서는 / 페이지로 이동)');
    // window.location.href = '/';
  };

  // 카테고리 모달 토글
  const toggleCategoryModal = () => {
    setShowCategoryModal(!showCategoryModal);
  };

  // 카테고리 추가 기능 (Mock)
  const handleAddCategory = () => {
    const categoryName = prompt('추가할 카테고리 이름을 입력하세요:');
    if (categoryName && categoryName.trim()) {
      alert(`"${categoryName}" 카테고리가 추가되었습니다! (실제 환경에서는 서버에 저장됩니다)`);
      setShowCategoryModal(false);
    } else if (categoryName !== null) {
      alert('카테고리 이름을 입력해주세요.');
    }
  };

  // 포인트 사용 기능 (Mock)
  const usePoints = () => {
    const pointsToUse = prompt(
      `사용할 포인트를 입력하세요 (보유: ${MemData.ppnt?.toLocaleString()} P):`,
    );
    const points = parseInt(pointsToUse);

    if (!pointsToUse) return;

    if (isNaN(points) || points <= 0) {
      alert('올바른 포인트를 입력해주세요.');
      return;
    }

    if (points > MemData.ppnt) {
      alert('보유 포인트가 부족합니다.');
      return;
    }

    // Mock 포인트 차감
    setMemData((prev) => ({
      ...prev,
      ppnt: prev.ppnt - points,
    }));

    alert(`${points.toLocaleString()} P가 사용되었습니다!`);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>불러오는 중...</div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>오류: {error}</div>
      </div>
    );
  }

  // 사용자 데이터가 없을 때
  if (!MemData) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>사용자 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      {/* 헤더 */}
      <div style={styles.header}>
        <h1 style={styles.title}>마이페이지</h1>
        <button onClick={goToHome} style={styles.homeButton}>
          홈으로
        </button>
      </div>

      {/* 메인 컨텐츠 */}
      <div style={styles.container}>
        {/* 프로필 섹션 */}
        <div style={styles.profileSection}>
          <div style={styles.profileImageContainer}>
            <img
              src={
                MemData.pphoto
                  ? `http://localhost:7474/member.photo/${MemData.pphoto}`
                  : 'https://via.placeholder.com/100x100/ddd/666?text=USER'
              }
              alt="프로필"
              style={styles.profileImage}
            />
          </div>
          <div style={styles.profileInfo}>
            <h2 style={styles.nickname}>{MemData.nick} 님</h2>
            <p style={styles.infoText}>아이디: {MemData.id}</p>
            <p style={styles.infoText}>가입일: {formatDate(MemData.regd)}</p>
            {MemData.bir && <p style={styles.infoText}>생년월일: {formatDate(MemData.bir)}</p>}
          </div>
        </div>

        {/* 포인트 섹션 */}
        <div style={styles.pointSection}>
          <div style={styles.pointCard}>
            <div style={styles.pointIcon}>💰</div>
            <div style={styles.pointInfo}>
              <p style={styles.pointLabel}>보유 포인트</p>
              <p style={styles.pointValue}>{MemData.ppnt?.toLocaleString() ?? 0} P</p>
            </div>
            <button onClick={usePoints} style={styles.usePointButton}>
              포인트 사용
            </button>
          </div>
        </div>

        {/* 카테고리 관리 섹션 */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>카테고리 관리</h3>
          <button onClick={toggleCategoryModal} style={styles.categoryButton}>
            카테고리 추가
          </button>
        </div>

        {/* 계정 관리 섹션 */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>계정 관리</h3>
          <div style={styles.actionButtons}>
            <button onClick={goToEdit} style={styles.editButton}>
              개인정보 수정
            </button>
            <button onClick={goToExit} style={styles.exitButton}>
              회원 탈퇴
            </button>
          </div>
        </div>
      </div>

      {/* 카테고리 추가 모달 */}
      {showCategoryModal && (
        <div style={styles.modalOverlay} onClick={toggleCategoryModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>카테고리 추가</h3>
              <button onClick={toggleCategoryModal} style={styles.closeButton}>
                ×
              </button>
            </div>
            <div style={styles.modalContent}>
              <div style={styles.categoryForm}>
                <p style={styles.modalDescription}>새로운 지출/수입 카테고리를 추가하세요.</p>
                <div style={styles.categoryExamples}>
                  <h4 style={styles.exampleTitle}>카테고리 예시:</h4>
                  <div style={styles.exampleTags}>
                    <span style={styles.exampleTag}>🍽️ 식비</span>
                    <span style={styles.exampleTag}>🚗 교통비</span>
                    <span style={styles.exampleTag}>🎮 취미</span>
                    <span style={styles.exampleTag}>💼 부업수입</span>
                    <span style={styles.exampleTag}>🏠 월세</span>
                    <span style={styles.exampleTag}>📱 통신비</span>
                  </div>
                </div>
                <div style={styles.modalButtons}>
                  <button onClick={handleAddCategory} style={styles.modalConfirmButton}>
                    카테고리 추가
                  </button>
                  <button onClick={toggleCategoryModal} style={styles.modalCancelButton}>
                    취소
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 스타일 정의
const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '600px',
    margin: '0 auto 30px auto',
  },

  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },

  homeButton: {
    padding: '10px 20px',
    backgroundColor: '#4A90E2',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },

  container: {
    maxWidth: '600px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },

  // 프로필 섹션
  profileSection: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },

  profileImageContainer: {
    marginBottom: '20px',
  },

  profileImage: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #e0e0e0',
  },

  profileInfo: {
    width: '100%',
  },

  nickname: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '16px',
  },

  infoText: {
    fontSize: '16px',
    color: '#666',
    margin: '8px 0',
  },

  // 포인트 섹션
  pointSection: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },

  pointCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },

  pointIcon: {
    fontSize: '32px',
  },

  pointInfo: {
    flex: 1,
  },

  pointLabel: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 8px 0',
  },

  pointValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#4A90E2',
    margin: 0,
  },

  usePointButton: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '500',
  },

  // 일반 섹션
  section: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },

  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '16px',
  },

  // 카테고리 버튼
  categoryButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
  },

  // 액션 버튼들
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  editButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#4A90E2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
  },

  exitButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
  },

  // 로딩 및 에러
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px',
    color: '#666',
  },

  error: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: '#dc3545',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
  },

  // 모달 스타일
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '0',
    maxWidth: '400px',
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid #e0e0e0',
  },

  modalTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },

  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
    padding: '0',
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalContent: {
    padding: '24px',
  },

  categoryForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  modalDescription: {
    margin: 0,
    fontSize: '16px',
    color: '#666',
    textAlign: 'center',
  },

  categoryExamples: {
    textAlign: 'center',
  },

  exampleTitle: {
    fontSize: '14px',
    color: '#333',
    margin: '0 0 12px 0',
  },

  exampleTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
  },

  exampleTag: {
    padding: '6px 12px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '16px',
    fontSize: '12px',
    color: '#495057',
  },

  modalButtons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  },

  modalConfirmButton: {
    padding: '10px 20px',
    backgroundColor: '#4A90E2',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },

  modalCancelButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default UserPage;
