// src/components/Sidebar.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../route/routes.js';
import { useState, useEffect, useRef } from 'react';
import useAuth from '../contexts/useAuth.jsx';
import NotificationPanel from '../components/NotificationPanel';
import { motion } from 'framer-motion';

// 이미지 imports
import mainImg from '../img/main.png';
import diaryIcon from '../img/book.png';
import wonImg from '../img/won.png';
import offBellImg from '../img/off_bell.png';
import onBellImg from '../img/on_bell.png';
import pencilImg from '../img/pencil.png';
import chaImg from '../img/challenge.png';
import mypageImg from '../img/mypage.png';
import logoutIcon from '../img/logout.png';

const Sidebar = ({
  isOpen,
  onOpenNotification,
  isNotificationPanelOpen,
  onCloseNotification,
  notificationRef,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, checkUserAuth } = useAuth();
  const containerRef = useRef(null);
  const [hasNotification, setHasNotification] = useState(true);

  const { height } = useDimensions(containerRef);

  const sidebarMenu = [
    { id: 'notify', label: '알림', icon: hasNotification ? onBellImg : offBellImg },
    { id: 'allExpense', label: '전체수입지출', icon: wonImg, path: ROUTES.ACCOUNT_BOOK },
    { id: 'challenge', label: '챌린지', icon: chaImg, path: ROUTES.CHALLENGE },
    { id: 'diary', label: '다이어리', icon: diaryIcon, path: ROUTES.DIARY },
    { id: 'subscription', label: '구독', icon: pencilImg, path: ROUTES.SUBSCRIPTION },
  ];

  const handleMenuClick = async (path, itemId) => {
    const isValid = await checkUserAuth();
    if (!isValid) {
      return;
    }

    if (itemId === 'notify') {
      onOpenNotification();
    } else if (path) {
      navigate(path);
    }
  };

  const handleRootClick = async () => {
    const isValid = await checkUserAuth();
    if (isValid) {
      navigate(ROUTES.ROOT);
    }
  };

  const handleUserClick = async () => {
    const isValid = await checkUserAuth();
    if (isValid) {
      navigate(ROUTES.USER);
    }
  };

  const handleLogout = () => {
    if (window.confirm('정말 로그아웃하시겠습니까?')) {
      logout();
      navigate(ROUTES.LOGIN);
    }
  };

  // Animation variants
  const sidebarVariants = {
    open: (height = 1000) => ({
      clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
      transition: {
        type: 'spring',
        stiffness: 30,
        restDelta: 2,
        damping: 30,
      },
    }),
    closed: {
      clipPath: 'circle(0px at 40px 40px)',
      transition: {
        delay: 0.1,
        type: 'spring',
        stiffness: 300,
        damping: 50,
      },
    },
  };

  const navVariants = {
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  };

  const itemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  };

  const headerVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.3,
      },
    },
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  const footerVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.4,
        duration: 0.3,
      },
    },
    closed: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <>
      <motion.nav
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        custom={height}
        ref={containerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '350px',
          height: '100vh',
          zIndex: 1000,
        }}
      >
        {/* Background with circular expansion */}
        <motion.div
          variants={sidebarVariants}
          style={{
            backgroundColor: '#e9ecf2',
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: '350px',
            boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            height: '100%',
            padding: '30px 20px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Header */}
          <motion.div variants={headerVariants}>
            <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={handleRootClick}>
              <motion.img
                src={mainImg}
                alt="Mooney"
                style={{
                  width: '60px',
                  height: 'auto',
                  marginBottom: '10px',
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              />
              <motion.h2
                style={{ margin: '0 0 10px 0', fontSize: '24px' }}
                whileHover={{ scale: 1.05 }}
              >
                Mooney
              </motion.h2>
            </div>

            <motion.p
              style={{ margin: 0, fontSize: '14px', textAlign: 'center' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Welcome,&nbsp;
              <span style={{ color: '#6B69EE' }}>{user?.nick || '사용자'}</span>
              님!
            </motion.p>

            {/* Main Menu */}
            <motion.ul
              variants={navVariants}
              style={{
                listStyle: 'none',
                padding: 0,
                marginTop: '30px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                fontSize: '16px',
                fontWeight: 500,
                color: '#333',
              }}
            >
              {sidebarMenu.map((item) => {
                const isActive = location.pathname === item.path && item.path !== '';

                return (
                  <motion.li
                    key={item.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, x: 8 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMenuClick(item.path, item.id)}
                    style={{
                      cursor: 'pointer',
                      padding: '12px 15px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      backgroundColor: isActive ? '#d6dce6' : 'transparent',
                      border: `2px solid ${isActive ? '#6B69EE' : 'transparent'}`,
                      position: 'relative',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = '#d6dce6';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <motion.div
                      style={{
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                        backgroundColor: isActive ? '#6B69EE' : '#f0f0f0',
                      }}
                      whileHover={{
                        backgroundColor: isActive ? '#5a5fd8' : '#e0e0e0',
                        rotate: 5,
                      }}
                    >
                      <img
                        src={item.icon}
                        alt={item.label}
                        style={{
                          width: '18px',
                          height: '18px',
                          filter: isActive ? 'brightness(0) invert(1)' : 'none',
                        }}
                      />
                    </motion.div>

                    <span style={{ flex: 1 }}>{item.label}</span>

                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        style={{
                          position: 'absolute',
                          right: '8px',
                          width: '4px',
                          height: '20px',
                          backgroundColor: '#6B69EE',
                          borderRadius: '2px',
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.li>
                );
              })}
            </motion.ul>
          </motion.div>

          {/* Footer */}
          <motion.div
            variants={footerVariants}
            style={{
              fontSize: '14px',
              color: '#777',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05, x: 8 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUserClick}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 15px',
                borderRadius: '10px',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#d6dce6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <motion.div
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  backgroundColor: '#f0f0f0',
                }}
                whileHover={{ backgroundColor: '#e0e0e0', rotate: 5 }}
              >
                <img
                  src={mypageImg}
                  alt="마이페이지"
                  style={{
                    width: '18px',
                    height: '18px',
                  }}
                />
              </motion.div>
              <span>My page</span>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05, x: 8 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 15px',
                borderRadius: '10px',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ffebee';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <motion.div
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  backgroundColor: '#f0f0f0',
                }}
                whileHover={{ backgroundColor: '#ffcdd2', rotate: 5 }}
              >
                <img
                  src={logoutIcon}
                  alt="Logout"
                  style={{
                    width: '18px',
                    height: '18px',
                  }}
                />
              </motion.div>
              <span>Logout</span>
            </motion.div>
          </motion.div>
        </div>
      </motion.nav>

      {/* Notification Panel */}
      {isNotificationPanelOpen && (
        <NotificationPanel onClose={onCloseNotification} notificationRef={notificationRef} />
      )}
    </>
  );
};

// Dimension hook
const useDimensions = (ref) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      dimensions.current.width = ref.current.offsetWidth;
      dimensions.current.height = ref.current.offsetHeight;
    }
  }, [ref]);

  return dimensions.current;
};

export default Sidebar;
