import React, { useState } from 'react';
import { FaRegBell, FaSignOutAlt, FaUser, FaTimes } from 'react-icons/fa';
import { PiMoneyWavy } from 'react-icons/pi';
import { BiBarChartAlt } from 'react-icons/bi';
import { FiBookOpen } from 'react-icons/fi';
import { LuNotebookPen } from 'react-icons/lu';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@route/routes.js';

const Sidebar = ({
  isOpen,
  onOpenNotification,
  isNotificationOpen,
  onCloseNotification,
  notificationRef,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(false);

  const menuItems = [
    { id: 'notify', label: '알림', icon: FaRegBell, path: '' },
    { id: 'allExpense', label: '전체수입지출', icon: PiMoneyWavy, path: ROUTES.ACCOUNT_BOOK },
    { id: 'challenge', label: '챌린지', icon: BiBarChartAlt, path: ROUTES.CHALLENGE },
    { id: 'diary', label: '다이어리', icon: LuNotebookPen, path: ROUTES.DIARY },
    { id: 'accountBook', label: '가계부 적기', icon: FiBookOpen, path: ROUTES.ACCOUNT_BOOK },
  ];

  const handleMenuClick = (path, itemId) => {
    if (itemId === 'notify') {
      onOpenNotification();
    } else if (path) {
      navigate(path);
    }
  };

  const handleRootClick = () => {
    navigate(ROUTES.ROOT);
  };

  const handleUserClick = () => {
    navigate(ROUTES.USER);
  };

  const handleLogout = () => {
    navigate(ROUTES.LOGIN);
  };

  return (
    <>
      {/* 사이드바 */}
      <div
        style={{
          width: '280px',
          backgroundColor: '#2c3e50',
          color: 'white',
          height: '100vh',
          padding: '1rem',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 1,
        }}
      >
        {/* 로고 영역 */}
        <div
          style={{
            display: 'flex',
            cursor: 'pointer',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 0',
            borderBottom: '1px solid black',
            marginBottom: '10px',
          }}
          onClick={handleRootClick}
        >
          <img src="../img/logo.png" style={{ width: '20px', height: '20px' }} alt="로고" />
          <span>Mooney</span>
        </div>

        {/* 메뉴 리스트 */}
        <div style={{ marginTop: '2rem' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path && item.path !== '';

            return (
              <div
                key={item.id}
                onClick={() => handleMenuClick(item.path, item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  margin: '5px 0',
                  backgroundColor: isActive ? '#3498db' : 'transparent',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* 하단 메뉴 */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '1rem',
            right: '1rem',
          }}
        >
          <div
            onClick={handleUserClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px',
              margin: '5px 0',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            <FaUser size={16} />
            <span>My page</span>
          </div>

          <div
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px',
              margin: '5px 0',
              color: '#e74c3c',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            <FaSignOutAlt size={16} />
            <span>{isLogin ? '로그인' : '로그아웃'}</span>
          </div>
        </div>
      </div>

      {/* 알림창 - 사이드바 바로 오른쪽에 */}
      {isNotificationOpen && (
        <div
          ref={notificationRef} // 참조 추가
          style={{
            position: 'fixed',
            top: '20px',
            left: isOpen ? '290px' : '10px', // 사이드바 바로 오른쪽
            width: '300px',
            height: '500px',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          {/* 헤더 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              borderBottom: '1px solid #eee',
              paddingBottom: '10px',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>🔔 알림</h3>
            <button
              onClick={onCloseNotification}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#999',
                cursor: 'pointer',
                padding: '4px',
                fontSize: '16px',
              }}
            >
              ✕
            </button>
          </div>

          {/* 알림 내용 - 클릭하면 페이지 이동 */}
          <div style={{ color: '#555', lineHeight: '1.5' }}>
            <div
              style={{
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onClick={() => {
                navigate(ROUTES.CHALLENGE);
                onCloseNotification();
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#e9ecef')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#f8f9fa')}
            >
              🏆 챌린지 목표 달성!
            </div>

            <div
              style={{
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: '#fff3cd',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onClick={() => {
                navigate(ROUTES.ACCOUNT_BOOK);
                onCloseNotification();
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#ffeaa7')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#fff3cd')}
            >
              💰 월 예산 80% 사용
            </div>

            <div
              style={{
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: '#d1ecf1',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onClick={() => {
                navigate('/chart');
                onCloseNotification();
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#bee5eb')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#d1ecf1')}
            >
              📊 새로운 기능 업데이트
            </div>

            <div
              style={{
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: '#d4edda',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onClick={() => {
                navigate(ROUTES.DIARY);
                onCloseNotification();
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#c3e6cb')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#d4edda')}
            >
              📝 소비 일기 작성 알림
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
