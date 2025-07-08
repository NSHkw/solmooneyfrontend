import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@route/routes.js';
import { FaTimes, FaBell, FaTrophy, FaWallet, FaBookOpen } from 'react-icons/fa';

const NotificationPanel = ({ onClose }) => {
  const navigate = useNavigate();

  // 알림 mock 데이터
  const mockNotifications = [
    {
      id: 1,
      type: 'challenge',
      icon: FaTrophy,
      title: '챌린지 목표 달성!',
      message: '이번 달 절약 챌린지를 성공적으로 완료했습니다.',
      time: '2시간 전',
      path: ROUTES.CHALLENGE,
      isRead: false,
    },
    {
      id: 2,
      type: 'expense',
      icon: FaWallet,
      title: '월 예산 80% 사용',
      message: '이번 달 예산의 80%를 사용했습니다. 지출을 확인해보세요.',
      time: '4시간 전',
      path: ROUTES.ACCOUNT_BOOK,
      isRead: true,
    },
    {
      id: 3,
      type: 'diary',
      icon: FaBookOpen,
      title: '소비 일기 작성 알림',
      message: '어제 소비에 대한 일기를 작성해보세요.',
      time: '1일 전',
      path: ROUTES.DIARY,
      isRead: false,
    },
    {
      id: 4,
      type: 'system',
      icon: FaBell,
      title: '새로운 기능 업데이트',
      message: '가계부 차트 기능이 새롭게 추가되었습니다.',
      time: '2일 전',
      path: '/chart',
      isRead: true,
    },
  ];

  const HandleNotificationClick = (notification) => {
    navigate(notification.path);
    onClose();
  };

  const HandleMarkAllAsRead = () => {
    console.log('모든 알림을 읽음 처리');
  };

  return <div onClick={onClose}></div>
  <div></div>
};

export default NotificationPanel;
