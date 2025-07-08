import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@components/Sidebar.jsx';

function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null); // 알림창 참조

  const ToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const OpenNotification = () => {
    setIsNotificationOpen(true);
  };

  const CloseNotification = () => {
    setIsNotificationOpen(false);
  };

  // 전역 클릭 이벤트 리스너 - 알림창 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isNotificationOpen &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        CloseNotification();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotificationOpen]);

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onOpenNotification={OpenNotification}
        isNotificationOpen={isNotificationOpen}
        onCloseNotification={CloseNotification}
        notificationRef={notificationRef} // 참조 전달
      />

      {/* Main Content - 깨끗하게! */}
      <div
        style={{
          marginLeft: isSidebarOpen ? '280px' : '0',
          flex: 1,
          padding: '1rem',
          transition: 'margin-left 0.3s ease',
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#f8f9fa',
        }}
      >
        {/* Toggle Button */}
        <button
          onClick={ToggleSidebar}
          style={{
            position: 'fixed',
            top: '1rem',
            left: isSidebarOpen ? '290px' : '1rem',
            zIndex: 2,
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'left 0.3s ease',
            fontSize: '18px',
          }}
        >
          ☰
        </button>

        {/* 실제 페이지 내용만! */}
        <div style={{ marginTop: '60px' }}>{children}</div>
      </div>
    </div>
  );
}

export default Layout;
