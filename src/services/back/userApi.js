// src/service/back/userApi.js

//! 로그인, 회원가입, 토큰 검증, 이메일 인증코드 보내기, 이메일 받은 인증코드 검증, 아이디 중복검사, 닉네임 중복검사,
//! 회원정보 수정, 회원탈퇴, 회원정보 가져오기, 로그아웃

const SERVER_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ 로그인 API (수정됨 - 토큰 대신 userId 저장)
const login = async (credentials) => {
  const logindata = {
    loginId: credentials.id,
    loginPw: credentials.password,
  };

  try {
    console.log('🚀 로그인 요청 시작:', logindata);

    const response = await fetch(`${SERVER_URL}/do.login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 포함
      body: JSON.stringify(logindata),
    });

    console.log('📡 응답 상태:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ 백엔드 응답:', result);

    if (result.isLogined) {
      return {
        success: true,
        message: '로그인 성공',
        data: {
          // 🔥 토큰 대신 userId를 저장 (세션 정보도 함께)
          userId: result.userInfo.mmemId || result.userInfo.id || result.userInfo.regId,
          sessionInfo: result.token || null, // 세션 정보 (선택사항)
          user: {
            loginId: result.userInfo.mmemId || result.userInfo.id || result.userInfo.regId,
            nick: result.userInfo.mmemNick || result.userInfo.nick,
            ppnt: result.userInfo.mmemPnt || result.userInfo.ppnt || 0,
            regd: result.userInfo.registeredDate || result.userInfo.regd,
            bir: result.userInfo.mmemBir || result.userInfo.bir,
            pphoto: result.userInfo.mmemPphoto || result.userInfo.pphoto,
          },
        },
      };
    } else {
      throw new Error(result.message || '로그인에 실패했습니다.');
    }
  } catch (error) {
    console.error('❌ 로그인 에러:', error);

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('서버에 연결할 수 없습니다. 백엔드 서버가 실행중인지 확인해주세요.');
    }

    throw new Error(error.message || '로그인에 실패했습니다.');
  }
};

// ✅ 회원가입 API (기본 구조만 - 백엔드 완성 후 수정 예정)
const register = async (userData) => {
  try {
    const response = await fetch(`${SERVER_URL}/do.register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        mmemId: userData.id,
        mmemPw: userData.password,
        mmemNick: userData.nickname,
        mmemBir: userData.birthDate,
        email: userData.email,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        message: '회원가입이 완료되었습니다.',
        data: { userId: result.userId },
      };
    } else {
      throw new Error(result.message || '회원가입에 실패했습니다.');
    }
  } catch (error) {
    console.error('회원가입 에러:', error);
    throw new Error(error.message || '회원가입에 실패했습니다.');
  }
};

// ✅ 사용자 인증 확인 API (토큰 대신 userId 사용)
const verifyUser = async (userId) => {
  try {
    console.log('🔍 사용자 검증 시작:', userId);

    const response = await fetch(`${SERVER_URL}/do.logincheck`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 기반 세션 사용
      body: JSON.stringify({
        userId: userId, // userId만 전송
        // 또는 백엔드가 원하는 필드명에 맞춰서
        loginId: userId,
      }),
    });

    console.log('📡 사용자 검증 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 사용자 검증 에러 응답:', errorText);
      throw new Error('사용자 인증이 유효하지 않습니다.');
    }

    const result = await response.json();
    console.log('✅ 사용자 검증 성공:', result);

    return {
      success: true,
      data: {
        user: {
          id: result.userInfo.mmemId || result.userInfo.regId || result.userInfo.id,
          nick: result.userInfo.mmemNick,
          points: result.userInfo.mmemPnt || 0,
          registeredDate: result.userInfo.registeredDate,
          birthDate: result.userInfo.mmemBir,
          profilePhoto: result.userInfo.mmemPphoto,
        },
      },
    };
  } catch (error) {
    console.error('❌ 사용자 검증 실패:', error);
    throw new Error(error.message || '사용자 검증에 실패했습니다.');
  }
};

// ✅ 이메일 인증코드 발송 API (백엔드 완성 후 구현 예정)
const sendVerificationEmail = async (email) => {
  try {
    const response = await fetch(`${SERVER_URL}/send-email-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      message: result.message || '인증코드가 발송되었습니다.',
    };
  } catch (error) {
    throw new Error(error.message || '이메일 전송에 실패했습니다.');
  }
};

// ✅ 이메일 인증코드 확인 API (백엔드 완성 후 구현 예정)
const verifyEmailCode = async (email, code) => {
  try {
    const response = await fetch(`${SERVER_URL}/verify-email-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, code }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      message: result.message || '이메일 인증이 완료되었습니다.',
    };
  } catch (error) {
    throw new Error(error.message || '인증코드 확인에 실패했습니다.');
  }
};

// ✅ 아이디 중복 확인 API (백엔드 완성 후 구현 예정)
const checkIdDuplicate = async (id) => {
  try {
    const response = await fetch(`${SERVER_URL}/check-id?id=${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      available: result.available,
      message: result.message,
    };
  } catch (error) {
    throw new Error(error.message || 'ID 중복 확인에 실패했습니다.');
  }
};

// ✅ 닉네임 중복 확인 API (백엔드 완성 후 구현 예정)
const checkNicknameDuplicate = async (nickname) => {
  try {
    const response = await fetch(
      `${SERVER_URL}/check-nickname?nickname=${encodeURIComponent(nickname)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      available: result.available,
      message: result.message,
    };
  } catch (error) {
    throw new Error(error.message || '닉네임 중복 확인에 실패했습니다.');
  }
};

// ✅ 회원정보 수정 API (백엔드 완성 후 구현 예정)
const updateUserInfo = async (userId, updateData) => {
  try {
    const requestData = {};

    // 프론트엔드 필드명을 백엔드 필드명으로 변환
    if (updateData.nickname) requestData.mmemNick = updateData.nickname;
    if (updateData.password) requestData.mmemPw = updateData.password;
    if (updateData.profilePhoto !== undefined) requestData.mmemPphoto = updateData.profilePhoto;

    const response = await fetch(`${SERVER_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      message: result.message || '회원정보가 수정되었습니다.',
      data: {
        user: {
          id: result.user.mmemId,
          nick: result.user.mmemNick,
          ppnt: result.user.mmemPnt,
          regd: result.user.registeredDate,
          bir: result.user.mmemBir,
          pphoto: result.user.mmemPphoto,
        },
      },
    };
  } catch (error) {
    throw new Error(error.message || '회원정보 수정에 실패했습니다.');
  }
};

// ✅ 회원탈퇴 API (백엔드 완성 후 구현 예정)
const deleteAccount = async (userId, password) => {
  try {
    const response = await fetch(`${SERVER_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      message: result.message || '회원탈퇴가 완료되었습니다.',
    };
  } catch (error) {
    throw new Error(error.message || '회원탈퇴에 실패했습니다.');
  }
};

// ✅ 사용자 정보 조회 API (백엔드 완성 후 구현 예정)
const getUserInfo = async (userId) => {
  try {
    const response = await fetch(`${SERVER_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      data: {
        user: {
          id: result.mmemId,
          nickname: result.mmemNick,
          points: result.mmemPnt || 0,
          registeredDate: result.registeredDate,
          birthDate: result.mmemBir,
          profilePhoto: result.mmemPphoto,
        },
      },
    };
  } catch (error) {
    throw new Error(error.message || '사용자 정보 조회에 실패했습니다.');
  }
};

// ✅ 로그아웃 API (수정됨)
const logout = async () => {
  try {
    const response = await fetch(`${SERVER_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    // 🔥 로컬 스토리지 userId 삭제 (token → userId로 수정)
    localStorage.removeItem('userId'); // ✅ 수정됨
    localStorage.removeItem('userData');

    if (!response.ok) {
      return {
        success: true,
        message: '로그아웃되었습니다.',
      };
    }

    const result = await response.json();

    return {
      success: true,
      message: result.message || '로그아웃되었습니다.',
    };
  } catch (error) {
    // 🔥 에러가 발생해도 로컬 userId는 삭제됨 (token → userId로 수정)
    localStorage.removeItem('userId'); // ✅ 수정됨
    localStorage.removeItem('userData');

    return {
      success: true,
      message: '로그아웃되었습니다.',
    };
  }
};

// ✅ 비밀번호 확인 API (백엔드 완성 후 구현 예정)
const verifyPassword = async (userId, password) => {
  try {
    const response = await fetch(`${SERVER_URL}/users/${userId}/verify-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      message: result.message || '비밀번호 확인이 완료되었습니다.',
    };
  } catch (error) {
    throw new Error(error.message || '비밀번호 확인에 실패했습니다.');
  }
};

// 🔥 개발용 임시 검증 함수
const verifyUserDev = async (userId) => {
  console.log('🚧 개발모드: 사용자 검증 건너뛰기, userId:', userId);

  // 로컬스토리지의 유저 데이터 확인
  const userData = localStorage.getItem('userData');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      // userId가 일치하는지 확인
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

// ✅ API 객체 export
const BACK_USER_API = {
  login,
  register,
  verifyUser,
  sendVerificationEmail,
  verifyEmailCode,
  checkIdDuplicate,
  checkNicknameDuplicate,
  updateUserInfo,
  deleteAccount,
  getUserInfo,
  logout,
  verifyPassword,
  verifyUserDev,
};

export default BACK_USER_API;
