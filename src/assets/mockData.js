// src/assets/mockData.js
import { FaBell, FaBookOpen, FaTrophy, FaWallet } from 'react-icons/fa';
import { ROUTES } from '../route/routes';

const mockNotificationsData = [
  // 알림에 대한 기능- 챌린지 알림, 예상보다 많이 사용함 알림, 일기 작성 알림(이건 없어도 됨), 시스템 업데이트 알림, 구독 알림(연체, 구독료 지출 날짜) NotificationPanel과 연관됨
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
    message: '이번 달 예산의 80%를 사용했습니다.',
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

const mockUserData = [
  {
    id: 'testuser123',
    pw: 'testuser123',
    nick: '가계부마스터',
    pphoto: null, // 프로필 사진이 없는 경우
    regd: '2024-01-15T00:00:00Z',
    bir: '1995-06-20T00:00:00Z',
    ppnt: 15750, // 포인트
  },
  {
    id: 'user001',
    pw: 'user001',
    nick: 'user000000',
    pphoto: 'null',
    regd: '2025-07-08',
    bir: '2020-05-05',
    ppnt: 11111,
  },
  {
    id: 'user002',
    pw: 'user002',
    nick: 'user023456',
    pphoto: 'null',
    regd: '2025-07-09',
    bir: '2020-05-09',
    ppnt: 456,
  },
  {
    id: 'admin',
    pw: '1234',
    nick: 'addmin',
    pphoto: 'null',
    regd: '2025-07-08',
    bir: '2020-05-05',
    ppnt: 987654,
  },
];

// 추가로 필요한 카테고리들도 함께 업데이트
const mockCategory = [
  { mcatId: 1, mcatName: '엔터테인먼트', mcatColor: '#FF6384' },
  { mcatId: 2, mcatName: '업무/생산성', mcatColor: '#36A2EB' },
  { mcatId: 3, mcatName: '클라우드 저장소', mcatColor: '#FFCE56' },
  { mcatId: 4, mcatName: '쇼핑', mcatColor: '#8BC34A' },
  { mcatId: 5, mcatName: '기타', mcatColor: '#9C27B0' },
  { mcatId: 6, mcatName: '식비', mcatColor: '#FF9F40' },
  { mcatId: 7, mcatName: '교통비', mcatColor: '#4BC0C0' },
  { mcatId: 8, mcatName: '통신비', mcatColor: '#9966FF' },
  { mcatId: 9, mcatName: '건강/의료', mcatColor: '#FF6B6B' },
  { mcatId: 10, mcatName: '교육', mcatColor: '#4ECDC4' },
];

const mockExpenseData = [
  // === 구독 예정 (PENDING) - 현재 달 예정 ===
  {
    mexpId: 1,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 17000,
    mexpDec: 'Netflix 구독료',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-07-25',
    mexpStatus: 'PENDING',
    mcatId: 1, // 엔터테인먼트
  },
  {
    mexpId: 2,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 10900,
    mexpDec: 'Spotify Premium',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-07-28',
    mexpStatus: 'PENDING',
    mcatId: 1, // 엔터테인먼트
  },
  {
    mexpId: 3,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 29000,
    mexpDec: 'Adobe Creative Cloud',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-08-15',
    mexpStatus: 'PENDING',
    mcatId: 2, // 업무/생산성
  },
  {
    mexpId: 4,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 2900,
    mexpDec: 'Google Drive 스토리지',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-08-01',
    mexpStatus: 'PENDING',
    mcatId: 3, // 클라우드 저장소
  },
  {
    mexpId: 5,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 4990,
    mexpDec: '쿠팡 와우 멤버십',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-07-20',
    mexpStatus: 'OVERDUE',
    mcatId: 4, // 쇼핑
  },

  // === 추가 구독 서비스 (PENDING) ===
  {
    mexpId: 7,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 12900,
    mexpDec: 'YouTube Premium',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-07-30',
    mexpStatus: 'PENDING',
    mcatId: 1, // 엔터테인먼트
  },
  {
    mexpId: 8,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 16500,
    mexpDec: '웨이브(Wavve) 구독',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-08-05',
    mexpStatus: 'PENDING',
    mcatId: 1, // 엔터테인먼트
  },
  {
    mexpId: 9,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 9900,
    mexpDec: '멜론 스트리밍',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-08-10',
    mexpStatus: 'PENDING',
    mcatId: 1, // 엔터테인먼트
  },
  {
    mexpId: 10,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 55000,
    mexpDec: 'Microsoft 365',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-08-20',
    mexpStatus: 'PENDING',
    mcatId: 2, // 업무/생산성
  },
  {
    mexpId: 11,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 149000,
    mexpDec: 'Figma Professional',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-09-01',
    mexpStatus: 'PENDING',
    mcatId: 2, // 업무/생산성
  },
  {
    mexpId: 12,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 8900,
    mexpDec: 'Notion Pro',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-07-22',
    mexpStatus: 'PENDING',
    mcatId: 2, // 업무/생산성
  },
  {
    mexpId: 13,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 6600,
    mexpDec: 'Dropbox Plus',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-08-12',
    mexpStatus: 'PENDING',
    mcatId: 3, // 클라우드 저장소
  },
  {
    mexpId: 14,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 12000,
    mexpDec: '11번가 플러스 멤버십',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-08-25',
    mexpStatus: 'PENDING',
    mcatId: 4, // 쇼핑
  },
  {
    mexpId: 15,
    mexpMmemId: 'user001',
    mexpDt: null,
    mexpAmt: 29900,
    mexpDec: '마켓컬리 퍼플박스',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-09-10',
    mexpStatus: 'PENDING',
    mcatId: 4, // 쇼핑
  },

  // === 구독 완료 (COMPLETED) - 최근 결제한 것들 ===
  {
    mexpId: 101,
    mexpMmemId: 'user001',
    mexpDt: '2025-07-12',
    mexpAmt: 17000,
    mexpDec: 'Netflix 구독료',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-06-25',
    mexpStatus: 'COMPLETED',
    mcatId: 1, // 엔터테인먼트
  },
  {
    mexpId: 102,
    mexpMmemId: 'user001',
    mexpDt: '2025-07-10',
    mexpAmt: 2900,
    mexpDec: 'Google Drive 스토리지',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-07-01',
    mexpStatus: 'COMPLETED',
    mcatId: 3, // 클라우드 저장소
  },
  {
    mexpId: 103,
    mexpMmemId: 'user001',
    mexpDt: '2025-07-13',
    mexpAmt: 10900,
    mexpDec: 'Spotify Premium',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-06-28',
    mexpStatus: 'COMPLETED',
    mcatId: 1, // 엔터테인먼트
  },
  {
    mexpId: 104,
    mexpMmemId: 'user001',
    mexpDt: '2025-07-15',
    mexpAmt: 29000,
    mexpDec: 'Adobe Creative Cloud',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-07-15',
    mexpStatus: 'COMPLETED',
    mcatId: 2, // 업무/생산성
  },
  {
    mexpId: 105,
    mexpMmemId: 'user001',
    mexpDt: '2025-07-16',
    mexpAmt: 12900,
    mexpDec: 'YouTube Premium',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-06-30',
    mexpStatus: 'COMPLETED',
    mcatId: 1, // 엔터테인먼트
  },
  {
    mexpId: 106,
    mexpMmemId: 'user001',
    mexpDt: '2025-07-18',
    mexpAmt: 8900,
    mexpDec: 'Notion Pro',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-06-22',
    mexpStatus: 'COMPLETED',
    mcatId: 2, // 업무/생산성
  },

  // === 다른 사용자 데이터 ===
  {
    mexpId: 201,
    mexpMmemId: 'testuser123',
    mexpDt: null,
    mexpAmt: 9900,
    mexpDec: '카카오톡 이모티콘 플러스',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-07-24',
    mexpStatus: 'PENDING',
    mcatId: 1, // 엔터테인먼트
  },
  {
    mexpId: 202,
    mexpMmemId: 'testuser123',
    mexpDt: null,
    mexpAmt: 39000,
    mexpDec: 'ChatGPT Plus',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-08-03',
    mexpStatus: 'PENDING',
    mcatId: 2, // 업무/생산성
  },
  {
    mexpId: 203,
    mexpMmemId: 'testuser123',
    mexpDt: '2025-07-14',
    mexpAmt: 16500,
    mexpDec: '웨이브(Wavve) 구독',
    mexpType: 'E',
    mexpRpt: 'T',
    mexpRptdd: '2025-07-05',
    mexpStatus: 'COMPLETED',
    mcatId: 1, // 엔터테인먼트
  },

  // === 일반 지출 데이터 (참고용/가계부용) ===
  {
    mexpId: 301,
    mexpMmemId: 'user001',
    mexpDt: '2025-07-15',
    mexpAmt: 50000,
    mexpDec: '마트 장보기',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mcatId: 5, // 기타
  },
  {
    mexpId: 302,
    mexpMmemId: 'user001',
    mexpDt: '2025-07-16',
    mexpAmt: 25000,
    mexpDec: '점심 외식',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mcatId: 5, // 기타
  },
  {
    mexpId: 303,
    mexpMmemId: 'user001',
    mexpDt: '2025-07-17',
    mexpAmt: 80000,
    mexpDec: '주유비',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mcatId: 5, // 기타
  },
  {
    mexpId: 304,
    mexpMmemId: 'user001',
    mexpDt: '2025-07-18',
    mexpAmt: 15000,
    mexpDec: '커피숍',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mcatId: 5, // 기타
  },
  {
    mexpId: 305,
    mexpMmemId: 'user001',
    mexpDt: '2025-07-19',
    mexpAmt: 120000,
    mexpDec: '온라인 쇼핑',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mcatId: 4, // 쇼핑
  },

  // === 수입 데이터 (Income) ===
  {
    mexpId: 401,
    mexpMmemId: 'user001',
    mexpDt: '2025-07-01',
    mexpAmt: 3500000,
    mexpDec: '월급',
    mexpType: 'I', // Income
    mexpRpt: 'T',
    mexpRptdd: '2025-08-01',
    mexpStatus: 'COMPLETED',
    mcatId: 5, // 기타
  },
  {
    mexpId: 402,
    mexpMmemId: 'user001',
    mexpDt: '2025-07-10',
    mexpAmt: 500000,
    mexpDec: '부업 수입',
    mexpType: 'I',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mcatId: 5, // 기타
  },
  {
    mexpId: 403,
    mexpMmemId: 'testuser123',
    mexpDt: '2025-07-01',
    mexpAmt: 2800000,
    mexpDec: '월급',
    mexpType: 'I',
    mexpRpt: 'T',
    mexpRptdd: '2025-08-01',
    mexpStatus: 'COMPLETED',
    mcatId: 5, // 기타
  },

  // === 챌린지 페이지용 더미 데이터 (최근 소비 데이터 추가) ===
  {
    mexpId: 501,
    mexpMmemId: 'user001',
    mexpDt: '2025-01-01',
    mexpAmt: 50000,
    mexpDec: '신년 외식',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mcatId: 5,
  },
  {
    mexpId: 502,
    mexpMmemId: 'user001',
    mexpDt: '2025-01-02',
    mexpAmt: 30000,
    mexpDec: '마트 장보기',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mcatId: 5,
  },
  {
    mexpId: 503,
    mexpMmemId: 'user001',
    mexpDt: '2025-01-03',
    mexpAmt: 20000,
    mexpDec: '카페',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mcatId: 5,
  },
  {
    mexpId: 504,
    mexpMmemId: 'user001',
    mexpDt: '2025-01-04',
    mexpAmt: 45000,
    mexpDec: '온라인 쇼핑',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mcatId: 4,
  },
  {
    mexpId: 505,
    mexpMmemId: 'user001',
    mexpDt: '2025-01-05',
    mexpAmt: 25000,
    mexpDec: '교통비',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mcatId: 5,
  },
  {
    mexpId: 506,
    mexpMmemId: 'user001',
    mexpDt: '2024-12-15',
    mexpAmt: 150000,
    mexpDec: '연말 모임',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mcatId: 5,
  },
  {
    mexpId: 507,
    mexpMmemId: 'user001',
    mexpDt: '2024-12-20',
    mexpAmt: 200000,
    mexpDec: '선물 구매',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mcatId: 4,
  },
  {
    mexpId: 508,
    mexpMmemId: 'user001',
    mexpDt: '2024-11-10',
    mexpAmt: 80000,
    mexpDec: '의료비',
    mexpType: 'E',
    mexpRpt: 'F',
    mexpRptdd: null,
    mexpStatus: 'COMPLETED',
    mcatId: 5,
  },
];

const mockDiaryData = [
  {
    diaryId: 1,
    userId: 'user001',
    date: '2025-07-15',
    text: `오늘은 마트에서 장을 보고 점심에 친구들과 외식을 했다.
마트에서 5만원 정도 썼는데, 평소보다 좀 많이 산 것 같다.
특히 과자랑 음료수를 너무 많이 샀네...

점심 외식비는 2만 5천원이었는데, 맛있긴 했지만 역시 집에서 해먹는 게 경제적이긴 하다.
그래도 친구들과 오랜만에 만나서 즐거웠다.

앞으로는 마트 갈 때 리스트를 미리 작성해서 가야겠다.
충동구매를 너무 많이 하는 것 같아서...`,
  },
  {
    diaryId: 2,
    userId: 'user001',
    date: '2025-07-16',
    text: `어제 마트에서 산 과자를 벌써 다 먹어버렸다... 😅
역시 한 번에 많이 사면 자제력이 부족해진다.

오늘은 온라인 쇼핑으로 12만원이나 썼다.
원래 필요한 건 3만원어치였는데, 
할인 쿠폰이 있다고 해서 이것저것 더 담았더니 이렇게 됐네.

온라인 쇼핑 할 때는 정말 조심해야겠다.
장바구니에 담고 하루 정도 기다렸다가 정말 필요한지 다시 생각해보는 습관을 만들어야지.`,
  },
  {
    diaryId: 3,
    userId: 'user001',
    date: '2025-07-17',
    text: `오늘은 주유를 했다. 8만원.
요즘 기름값이 정말 많이 올랐네...
대중교통을 더 이용해야겠다는 생각이 든다.

커피숍에서 1만 5천원 썼는데, 
집에서 커피를 내려 마시는 게 훨씬 경제적이겠지만
가끔은 카페 분위기도 필요하다고 생각한다.

오늘은 그래도 계획된 소비만 해서 만족스럽다.
어제의 반성이 효과가 있었나 보다.`,
  },
  {
    diaryId: 4,
    userId: 'user001',
    date: '2025-07-18',
    text: `오늘은 커피만 마셨다.
어제보다 소비를 줄여보려고 했는데 성공!

집에 있는 음식들로 하루를 보냈더니 
별로 돈을 안 쓰고도 충분히 만족스러웠다.

이렇게 보니 평소에 얼마나 불필요한 소비를 많이 했는지 알 것 같다.
간단한 식사와 집에서 만든 커피만으로도 충분히 행복할 수 있구나.

내일도 이런 식으로 해보자!`,
  },
  {
    diaryId: 5,
    userId: 'user001',
    date: '2025-07-19',
    text: `음... 어제의 다짐이 무색하게 또 온라인 쇼핑을 했다. 12만원.
필요한 것들이긴 했지만, 역시 한 번에 사지 말고 
정말 급한 것만 먼저 샀어야 했는데.

그래도 어제 하루 절약한 덕분에 죄책감이 조금은 덜하다.
완벽하게 절약하는 건 어렵지만, 
조금씩이라도 의식하면서 소비하는 게 중요한 것 같다.

이번 주말에는 가계부를 정리해서 이번 달 소비 패턴을 분석해봐야겠다.`,
  },
  {
    diaryId: 6,
    userId: 'testuser123',
    date: '2025-07-15',
    text: `Netflix 구독료가 빠져나갔다. 
매달 1만 7천원인데, 요즘 볼 게 많아서 그나마 가성비는 좋은 것 같다.

웨이브도 구독하고 있는데 둘 다 필요한지 고민이 된다.
한 달에 3만원 넘게 OTT 서비스에 쓰고 있으니까...

일단 이번 달까지 써보고 정말 필요한 것만 남겨야겠다.`,
  },
  {
    diaryId: 7,
    userId: 'testuser123',
    date: '2025-07-16',
    text: `오늘은 소비 없는 하루!
집에서 요리해서 먹고, 
구독 중인 Netflix로 영화도 보고...

이렇게 보니 굳이 밖에 나가서 돈 쓸 일이 별로 없구나.
코로나 때 늘어난 집콕 습관이 의외로 절약에 도움이 되고 있다.

내일도 이런 식으로 보낼 수 있을까? 😄`,
  },
  {
    diaryId: 8,
    userId: 'user002',
    date: '2025-07-15',
    text: `오늘은 새로운 다이어리 앱을 써보기 시작했다!
소비에 대해 일기를 쓰라니 처음엔 좀 이상했는데
생각해보니 정말 필요한 기능인 것 같다.

평소에 돈을 어떻게 쓰는지 의식하지 못하고 살았는데,
이렇게 기록하다 보면 패턴이 보일 것 같다.

오늘은 점심값 1만원 정도 썼는데,
이것도 집에서 도시락 싸오면 절약할 수 있을 텐데...`,
  },
];

const MOCKDATA = {
  mockNotificationsData,
  mockUserData,
  mockCategory,
  mockExpenseData,
  mockDiaryData,
};

export default MOCKDATA;
