// src/services/mock/mockUser.js
// 🔥 세션 기반으로 수정된 Mock API

import MOCKDATA from '../../assets/mockData.js';

// 🔥 로그인 mockAPI - 세션 기반으로 수정
const login = async (credentials) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { id, password } = credentials;

  const user = MOCKDATA.mockUserData.find((u) => u.mmemId === id && u.mmemPw === password);

  if (!user) {
    console.log('로그인 에러가 났다');
    throw new Error('아이디 or 비번 틀림');
  }

  // 🔥 세션 시뮬레이션 - sessionStorage에 로그인 정보 저장
  sessionStorage.setItem(
    'mockSession',
    JSON.stringify({
      loginId: user.mmemId,
      loginTime: Date.now(),
      sessionId: 'mock_session_' + Date.now(),
    }),
  );

  return {
    success: true,
    message: '로그인 성공',
    data: {
      userId: user.mmemId, // 🔥 토큰 대신 userId 반환
      user: {
        loginId: user.mmemId, // 🔥 id 대신 loginId
        nick: user.mmemNick,
        ppnt: user.mmemPnt,
        regd: user.mmemRegd,
        bir: user.mmemBir,
        pphoto: user.mmemPphoto,
      },
    },
  };
};

// 🔥 사용자 검증 - userId 기반
const verifyUser = async (userId) => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // 세션 확인
  const mockSession = sessionStorage.getItem('mockSession');
  if (!mockSession) {
    throw new Error('세션이 만료되었습니다.');
  }

  try {
    const sessionData = JSON.parse(mockSession);

    // userId와 세션의 loginId가 일치하는지 확인
    if (sessionData.loginId !== userId) {
      throw new Error('사용자 인증 실패');
    }

    // 세션 만료 확인 (1시간)
    if (Date.now() - sessionData.loginTime > 60 * 60 * 1000) {
      sessionStorage.removeItem('mockSession');
      throw new Error('세션이 만료되었습니다.');
    }

    // 사용자 정보 조회
    const user = MOCKDATA.mockUserData.find((u) => u.mmemId === userId);

    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    return {
      success: true,
      data: {
        user: {
          loginId: user.mmemId, // 🔥 id 대신 loginId
          nick: user.mmemNick,
          ppnt: user.mmemPnt,
          regd: user.mmemRegd,
          bir: user.mmemBir,
          pphoto: user.mmemPphoto,
        },
      },
    };
  } catch (error) {
    sessionStorage.removeItem('mockSession');
    throw new Error('세션 검증 실패');
  }
};

// 🔥 개발용 임시 검증 함수
const verifyUserDev = async (userId) => {
  console.log('🚧 개발모드: 사용자 검증 건너뛰기, userId:', userId);

  const userData = localStorage.getItem('userData');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      if (user.loginId === userId || user.id === userId) {
        return {
          success: true,
          data: { user },
        };
      } else {
        throw new Error('사용자 ID가 일치하지 않습니다.');
      }
    } catch (e) {
      throw new Error('저장된 유저 데이터가 잘못되었습니다.');
    }
  }

  throw new Error('유저 데이터가 없습니다.');
};

// 회원가입 mockAPI (그대로 유지)
const register = async (userData) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { id, nickname, password, birthDate } = userData;

  const existingUser = MOCKDATA.mockUserData.find(
    (u) => u.mmemId === id && u.mmemNick === nickname,
  );

  if (existingUser) {
    if (existingUser.mmemId === id) {
      throw new Error('이미 존재하는 ID');
    }
    if (existingUser.mmemNick === nickname) {
      throw new Error('이미 존재하는 nick');
    }
  }

  const newUser = {
    mmemId: id, // 🔥 필드명 통일
    mmemPw: password,
    mmemNick: nickname,
    mmemPphoto: null,
    mmemRegd: new Date().toISOString(),
    mmemBir: birthDate,
    mmemPnt: 100,
  };

  MOCKDATA.mockUserData.push(newUser);

  return {
    success: true,
    message: '회원가입 완료',
    data: { userId: newUser.mmemId },
  };
};

// 회원정보 수정 (userId 기반으로 수정)
const updateUserInfo = async (userId, updateData) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const userIndex = MOCKDATA.mockUserData.findIndex((u) => u.mmemId === userId);

  if (userIndex === -1) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  const user = MOCKDATA.mockUserData[userIndex];

  if (updateData.nickname && updateData.nickname !== user.mmemNick) {
    const nicknameExists = MOCKDATA.mockUserData.some(
      (u) => u.mmemNick === updateData.nickname && u.mmemId !== userId,
    );

    if (nicknameExists) {
      throw new Error('이미 사용중인 닉네임입니다.');
    }
  }

  const updatedUser = { ...user };

  if (updateData.nickname) {
    updatedUser.mmemNick = updateData.nickname;
  }

  if (updateData.password) {
    updatedUser.mmemPw = updateData.password;
  }

  if (updateData.profilePhoto !== undefined) {
    updatedUser.mmemPphoto = updateData.profilePhoto;
  }

  MOCKDATA.mockUserData[userIndex] = updatedUser;

  return {
    success: true,
    message: '회원정보가 성공적으로 수정되었습니다.',
    data: {
      user: {
        loginId: updatedUser.mmemId, // 🔥 id 대신 loginId
        nick: updatedUser.mmemNick,
        ppnt: updatedUser.mmemPnt,
        regd: updatedUser.mmemRegd,
        bir: updatedUser.mmemBir,
        pphoto: updatedUser.mmemPphoto,
      },
    },
  };
};

// 비밀번호 확인 (userId 기반으로 수정)
const verifyPassword = async (userId, password) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = MOCKDATA.mockUserData.find((u) => u.mmemId === userId);

  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  if (user.mmemPw !== password) {
    throw new Error('비밀번호가 올바르지 않습니다.');
  }

  return {
    success: true,
    message: '비밀번호 확인 완료',
  };
};

// 로그아웃 (세션 삭제)
const logout = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // 🔥 세션 삭제
  sessionStorage.removeItem('mockSession');

  return {
    success: true,
    message: '로그아웃 되었습니다.',
  };
};

// 나머지 함수들은 기존과 동일하게 유지...
const sendVerificationEmail = async (email) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('올바른 이메일 형식이 아닙니다.');
  }

  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  const verificationData = {
    email: email,
    code: verificationCode.toString(),
    createdAt: new Date().getTime(),
    expiresAt: new Date().getTime() + 5 * 60 * 1000,
  };

  if (!window.mockVerificationCodes) {
    window.mockVerificationCodes = [];
  }

  window.mockVerificationCodes = window.mockVerificationCodes.filter((v) => v.email !== email);
  window.mockVerificationCodes.push(verificationData);

  console.log(`Mock 이메일 인증코드 ${verificationCode}(실제는 이메일로 전송)`);

  return {
    success: true,
    message: '인증코드 전송',
    __dev_code: verificationCode,
  };
};

const verifyEmailCode = async (email, code) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!window.mockVerificationCodes) {
    throw new Error('발송된 인증코드가 없습니다.');
  }

  const verification = window.mockVerificationCodes.find((v) => v.email === email);

  if (!verification) {
    throw new Error('인증 코드를 먼저 요청해주세요.');
  }

  if (new Date().getTime() > verification.expiresAt) {
    window.mockVerificationCodes = window.mockVerificationCodes.filter((v) => v.email !== email);
    throw new Error('인증코드가 만료되었습니다.');
  }

  if (verification.code !== code.toString()) {
    throw new Error('인증코드가 올바르지 않습니다.');
  }

  window.mockVerificationCodes = window.mockVerificationCodes.filter((v) => v.email !== email);

  return {
    success: true,
    message: '이메일 인증 완료',
  };
};

const checkIdDuplicate = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const exists = MOCKDATA.mockUserData.some((u) => u.mmemId === id);

  return {
    success: true,
    available: !exists,
    message: exists ? '이미 존재하는 아이디입니다.' : '사용 가능한 아이디입니다.',
  };
};

const checkNicknameDuplicate = async (nickname) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const exists = MOCKDATA.mockUserData.some((u) => u.mmemNick === nickname);

  return {
    success: true,
    available: !exists,
    message: exists ? '이미 사용중인 닉네임입니다.' : '사용 가능한 닉네임입니다.',
  };
};

const deleteAccount = async (userId, password) => {
  await new Promise((resolve) => setTimeout(resolve, 700));

  const userIndex = MOCKDATA.mockUserData.findIndex((u) => u.mmemId === userId);

  if (userIndex === -1) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  const user = MOCKDATA.mockUserData[userIndex];

  if (user.mmemPw !== password) {
    throw new Error('비밀번호가 올바르지 않습니다.');
  }

  MOCKDATA.mockUserData.splice(userIndex, 1);

  // 🔥 세션도 삭제
  sessionStorage.removeItem('mockSession');

  return {
    success: true,
    message: '회원탈퇴가 완료되었습니다.',
  };
};

const getUserInfo = async (userId) => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const user = MOCKDATA.mockUserData.find((u) => u.mmemId === userId);

  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  return {
    success: true,
    data: {
      user: {
        loginId: user.mmemId, // 🔥 id 대신 loginId
        nick: user.mmemNick,
        ppnt: user.mmemPnt,
        regd: user.mmemRegd,
        bir: user.mmemBir,
        pphoto: user.mmemPphoto,
      },
    },
  };
};

const USER_API = {
  login,
  register,
  verifyUser, // 🔥 세션 기반 검증
  verifyUserDev, // 🔥 개발용 임시 검증
  sendVerificationEmail,
  verifyEmailCode,
  checkIdDuplicate,
  checkNicknameDuplicate,
  updateUserInfo,
  deleteAccount,
  getUserInfo,
  logout,
  verifyPassword,
};

export default USER_API;
