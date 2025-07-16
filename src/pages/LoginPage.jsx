// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { ROUTES } from '../route/routes';
import logo_nuki from '../img/logo_nuki.png';
import API from '../services/mock/mockUser.js';
import S from '../styles/loginPage.style.js';

function LoginPage() {
  const [currentForm, setCurrentForm] = useState('login'); // 'login', 'register', 'reset'
  const [formData, setFormData] = useState({
    // 로그인 폼
    id: '',
    password: '',
    // 회원가입 폼
    confirmPassword: '',
    email: '',
    nickname: '',
    birthDate: '',
  });
  // 검증 상태들
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [isEmailCodeSent, setIsEmailCodeSent] = useState(false);

  // 비밀번호 찾기
  const [resetEmail, setResetEmail] = useState('');

  const { login, register, checkIdDuplicate, checkNicknameDuplicate, isAuthenticated, loading } =
    useAuth();
  const navigate = useNavigate();

  // 이미 로그인된 상태면 홈으로 리다이렉트
  if (isAuthenticated) {
    return <Navigate to={ROUTES.ROOT} replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 중복 확인 상태 초기화
    if (name === 'id') {
      setIsIdChecked(false);
    }
    if (name === 'nickname') {
      setIsNicknameChecked(false);
    }
  };

  // 로그인 처리
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.id.trim()) {
      toast.error('아이디를 입력해주세요!');
      return;
    }

    if (!formData.password.trim()) {
      toast.error('비밀번호를 입력해주세요!');
      return;
    }

    const result = await login({
      id: formData.id,
      password: formData.password,
    });

    if (result.success) {
      navigate(ROUTES.ROOT);
    }
  };

  // 회원가입 처리
  const handleRegister = async (e) => {
    e.preventDefault();

    // 필수 항목 검증
    if (!formData.id.trim()) {
      toast.error('아이디를 입력해주세요!');
      return;
    }

    if (!isIdChecked) {
      toast.error('아이디 중복확인을 해주세요!');
      return;
    }

    if (!formData.password.trim()) {
      toast.error('비밀번호를 입력해주세요!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다!');
      return;
    }

    if (!formData.nickname.trim()) {
      toast.error('닉네임을 입력해주세요!');
      return;
    }

    if (!isNicknameChecked) {
      toast.error('닉네임 중복확인을 해주세요!');
      return;
    }

    if (!formData.birthDate) {
      toast.error('생년월일을 입력해주세요!');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('이메일을 입력해주세요!');
      return;
    }

    if (!isEmailVerified) {
      toast.error('이메일 인증을 완료해주세요!');
      return;
    }

    // 회원가입 API 호출 (confirmPassword 제외, email은 인증용으로만 사용)
    const result = await register({
      id: formData.id,
      password: formData.password,
      nickname: formData.nickname,
      birthDate: formData.birthDate,
      email: formData.email, // 인증 완료 확인용
    });

    if (result.success) {
      // 폼 초기화
      setFormData({
        id: '',
        password: '',
        nickname: '',
        birthDate: '',
        confirmPassword: '',
        email: '',
      });
      setIsIdChecked(false);
      setIsNicknameChecked(false);
      setIsEmailVerified(false);
      setIsEmailCodeSent(false);

      setCurrentForm('login');
    }
  };

  // ID 중복 확인
  const handleIdCheck = async () => {
    if (!formData.id.trim()) {
      toast.error('아이디를 입력해주세요!');
      return;
    }

    try {
      const result = await checkIdDuplicate(formData.id);
      if (result.available) {
        toast.success(result.message);
        setIsIdChecked(true);
      } else {
        toast.error(result.message);
        setIsIdChecked(false);
      }
    } catch (error) {
      toast.error('아이디 중복 확인 중 오류가 발생했습니다. ', error);
      setIsIdChecked(false);
    }
  };

  // 닉네임 중복 확인
  const handleNicknameCheck = async () => {
    if (!formData.nickname.trim()) {
      toast.error('닉네임을 입력해주세요!');
      return;
    }

    try {
      const result = await checkNicknameDuplicate(formData.nickname);
      if (result.available) {
        toast.success(result.message);
        setIsNicknameChecked(true);
      } else {
        toast.error(result.message);
        setIsNicknameChecked(false);
      }
    } catch (error) {
      toast.error('닉네임 중복 확인 중 오류가 발생했습니다. ', error);
      setIsNicknameChecked(false);
    }
  };

  // 이메일 인증코드 발송
  const handleSendEmailCode = async () => {
    if (!formData.email.trim()) {
      toast.error('이메일을 입력해주세요!');
      return;
    }

    try {
      const result = await API.sendVerificationEmail(formData.email);
      if (result.success) {
        toast.success(result.message);
        setIsEmailCodeSent(true);
        // 개발용으로 콘솔에 코드 표시
        if (result.__dev_code) {
          toast.info(`개발용 인증코드: ${result.__dev_code}`);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleVerifyEmailCode = async () => {
    if (!emailVerificationCode.trim()) {
      toast.error('인증코드를 입력해주세요!');
      return;
    }

    try {
      const result = await API.verifyEmailCode(formData.email, emailVerificationCode);
      if (result.success) {
        toast.success(result.message);
        setIsEmailVerified(true);
        setEmailVerificationCode('');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // 비밀번호 찾기
  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!resetEmail.trim()) {
      toast.error('이메일을 입력해주세요!');
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success('비밀번호 재설정 링크가 이메일로 발송되었습니다.');

    setTimeout(() => {
      setCurrentForm('login');
      setResetEmail('');
    }, 1500);
  };

  return (
    <S.LoginPage>
      <S.LoginCard>
        {/* 로그인 폼 */}
        {currentForm === 'login' && (
          <S.FormContainer>
            <S.LogoSection>
              <S.LogoImage src={logo_nuki} alt="Mooney Logo" />
              <S.SpeechBubble>Mooney로 똑똑하게 소비하자!</S.SpeechBubble>
            </S.LogoSection>

            <S.Form onSubmit={handleLogin}>
              <S.InputGroup>
                <S.Label>아이디</S.Label>
                <S.Input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  placeholder="아이디를 입력하세요"
                />
              </S.InputGroup>

              <S.InputGroup>
                <S.Label>비밀번호</S.Label>
                <S.Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="비밀번호를 입력하세요"
                />
              </S.InputGroup>

              <S.SubmitButton type="submit" disabled={loading}>
                {loading ? '로그인 중...' : '로그인'}
              </S.SubmitButton>
            </S.Form>

            <S.LinkSection>
              <S.LinkButton onClick={() => setCurrentForm('reset')}>비밀번호 찾기</S.LinkButton>
            </S.LinkSection>

            <S.Divider>
              <span>소셜 로그인</span>
            </S.Divider>

            <S.SocialButtons>
              <S.SocialButton style={{ backgroundColor: '#FEE500' }}>💬</S.SocialButton>
              <S.SocialButton style={{ backgroundColor: '#03C75A' }}>N</S.SocialButton>
              <S.SocialButton style={{ backgroundColor: '#EA4335' }}>G</S.SocialButton>
            </S.SocialButtons>

            <S.RegisterSection>
              <span>계정이 없으신가요? </span>
              <S.RegisterLink onClick={() => setCurrentForm('register')}>회원가입</S.RegisterLink>
            </S.RegisterSection>

            <S.TestAccount>
              <p>테스트 계정: admin / 1234</p>
            </S.TestAccount>
          </S.FormContainer>
        )}

        {/* 회원가입 폼 */}
        {currentForm === 'register' && (
          <S.FormContainer>
            <S.FormHeader>
              <h2>회원 가입</h2>
            </S.FormHeader>

            <S.Form onSubmit={handleRegister}>
              {/* 아이디 */}
              <S.InputGroup>
                <S.Label>아이디</S.Label>
                <S.InputWithButton>
                  <S.InputWithBtn
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    placeholder="아이디를 입력하세요"
                  />
                  <S.CheckButton type="button" onClick={handleIdCheck}>
                    중복 확인
                  </S.CheckButton>
                </S.InputWithButton>
                {isIdChecked && <S.SuccessText>✓ 사용 가능한 아이디입니다</S.SuccessText>}
              </S.InputGroup>

              {/* 비밀번호 */}
              <S.InputGroup>
                <S.Label>비밀번호</S.Label>
                <S.Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="비밀번호를 입력하세요"
                />
              </S.InputGroup>

              {/* 비밀번호 확인 */}
              <S.InputGroup>
                <S.Label>비밀번호 확인</S.Label>
                <S.Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="비밀번호를 다시 입력하세요"
                />
                {formData.confirmPassword &&
                  (formData.password === formData.confirmPassword ? (
                    <S.SuccessText>✓ 비밀번호가 일치합니다</S.SuccessText>
                  ) : (
                    <S.ErrorText>✗ 비밀번호가 일치하지 않습니다</S.ErrorText>
                  ))}
              </S.InputGroup>

              {/* 닉네임 */}
              <S.InputGroup>
                <S.Label>닉네임</S.Label>
                <S.InputWithButton>
                  <S.InputWithBtn
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleInputChange}
                    placeholder="닉네임을 입력하세요"
                  />
                  <S.CheckButton type="button" onClick={handleNicknameCheck}>
                    중복 확인
                  </S.CheckButton>
                </S.InputWithButton>
                {isNicknameChecked && <S.SuccessText>✓ 사용 가능한 닉네임입니다</S.SuccessText>}
              </S.InputGroup>

              {/* 생년월일 */}
              <S.InputGroup>
                <S.Label>생년월일</S.Label>
                <S.Input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                />
              </S.InputGroup>

              {/* 이메일 인증 */}
              <S.InputGroup>
                <S.Label>이메일 (인증용)</S.Label>
                <S.InputWithButton>
                  <S.InputWithBtn
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="이메일을 입력하세요"
                    disabled={isEmailVerified}
                  />
                  <S.CheckButton
                    type="button"
                    onClick={handleSendEmailCode}
                    disabled={isEmailVerified}
                  >
                    {isEmailCodeSent ? '재발송' : '인증코드 발송'}
                  </S.CheckButton>
                </S.InputWithButton>
                {isEmailVerified && <S.SuccessText>✓ 이메일 인증이 완료되었습니다</S.SuccessText>}
              </S.InputGroup>

              {/* 이메일 인증코드 입력 */}
              {isEmailCodeSent && !isEmailVerified && (
                <S.InputGroup>
                  <S.Label>인증코드</S.Label>
                  <S.InputWithButton>
                    <S.InputWithBtn
                      type="text"
                      value={emailVerificationCode}
                      onChange={(e) => setEmailVerificationCode(e.target.value)}
                      placeholder="인증코드 6자리를 입력하세요"
                      maxLength={6}
                    />
                    <S.CheckButton type="button" onClick={handleVerifyEmailCode}>
                      인증 확인
                    </S.CheckButton>
                  </S.InputWithButton>
                </S.InputGroup>
              )}

              <S.SubmitButton type="submit" disabled={loading}>
                {loading ? '가입 중...' : '회원 가입'}
              </S.SubmitButton>
            </S.Form>

            <S.RegisterSection>
              <span>이미 계정이 있으신가요? </span>
              <S.RegisterLink onClick={() => setCurrentForm('login')}>로그인</S.RegisterLink>
            </S.RegisterSection>
          </S.FormContainer>
        )}

        {/* 비밀번호 찾기 폼 */}
        {currentForm === 'reset' && (
          <S.FormContainer>
            <S.FormHeader>
              <h2>비밀번호 찾기</h2>
              <S.Description>
                가입 시 사용한 이메일을 입력하시면
                <br />
                비밀번호 재설정 링크를 보내드립니다.
              </S.Description>
            </S.FormHeader>

            <S.Form onSubmit={handlePasswordReset}>
              <S.InputGroup>
                <S.Label>이메일</S.Label>
                <S.Input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="이메일을 입력하세요"
                />
              </S.InputGroup>

              <S.SubmitButton type="submit">재설정 링크 보내기</S.SubmitButton>
            </S.Form>

            <S.BackSection>
              <S.BackLink onClick={() => setCurrentForm('login')}>← 로그인으로 돌아가기</S.BackLink>
            </S.BackSection>
          </S.FormContainer>
        )}
      </S.LoginCard>
    </S.LoginPage>
  );
}

export default LoginPage;
