// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { toast } from 'react-toastify';
import { ROUTES } from '@route/routes';
import logo_nuki from '@img/logo_nuki.png';

function LoginPage() {
  const [currentForm, setCurrentForm] = useState('login'); // 'login', 'register', 'reset'
  const [formData, setFormData] = useState({
    // 로그인 폼
    id: '',
    password: '',
    // 회원가입 폼
    confirmPassword: '',
    email: '',
    phone: '',
  });
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const { login, register, isAuthenticated, loading } = useAuth();
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

    if (name === 'id') {
      setIsIdChecked(false);
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

    if (!formData.email.trim()) {
      toast.error('이메일을 입력해주세요!');
      return;
    }

    if (!isPhoneVerified) {
      toast.error('휴대폰 인증을 완료해주세요!');
      return;
    }

    const result = await register(formData);
    if (result.success) {
      setCurrentForm('login');
    }
  };

  // ID 중복 확인
  const handleIdCheck = () => {
    if (!formData.id.trim()) {
      toast.error('아이디를 입력해주세요!');
      return;
    }

    if (formData.id === 'admin') {
      toast.error('이미 사용 중인 아이디입니다.');
      setIsIdChecked(false);
    } else {
      toast.success('사용 가능한 아이디입니다.');
      setIsIdChecked(true);
    }
  };

  // 휴대폰 인증
  const handlePhoneVerification = () => {
    if (!formData.phone.trim()) {
      toast.error('휴대폰 번호를 입력해주세요!');
      return;
    }

    toast.success('인증번호가 발송되었습니다.');
    setTimeout(() => {
      setIsPhoneVerified(true);
      toast.success('휴대폰 인증이 완료되었습니다.');
    }, 2000);
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
    }, 1500);
  };

  return (
    <div style={styles.loginPage}>
      <div style={styles.loginCard}>
        {/* 로그인 폼 */}
        {currentForm === 'login' && (
          <div style={styles.formContainer}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img src={logo_nuki} style={{ width: '80px' }} />
              <div style={styles.speechBubble}>Mooney로 똑똑하게 소비하자!</div>
            </div>

            <form onSubmit={handleLogin} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>ID</label>
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="아이디를 입력하세요"
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="비밀번호를 입력하세요"
                />
              </div>

              <button type="submit" style={styles.submitButton} disabled={loading}>
                {loading ? '로그인 중...' : '로그인'}
              </button>
            </form>

            <div style={styles.linkSection}>
              <button onClick={() => setCurrentForm('reset')} style={styles.linkButton}>
                아이디 / 비밀번호 찾기
              </button>
            </div>

            <div style={styles.divider}>
              <span>소셜 로그인</span>
            </div>

            <div style={styles.socialButtons}>
              <button style={{ ...styles.socialButton, backgroundColor: '#FEE500' }}>💬</button>
              <button style={{ ...styles.socialButton, backgroundColor: '#03C75A' }}>N</button>
              <button style={{ ...styles.socialButton, backgroundColor: '#EA4335' }}>G</button>
            </div>

            <div style={styles.registerSection}>
              <span>계정이 없으신가요? </span>
              <button onClick={() => setCurrentForm('register')} style={styles.registerLink}>
                회원가입
              </button>
            </div>

            <div style={styles.testAccount}>
              <p>테스트 계정: admin / 1234</p>
            </div>
          </div>
        )}

        {/* 회원가입 폼 */}
        {currentForm === 'register' && (
          <div style={styles.formContainer}>
            <div style={styles.formHeader}>
              <h2>회원 가입</h2>
            </div>

            <form onSubmit={handleRegister} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>ID</label>
                <div style={styles.inputWithButton}>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    style={styles.inputWithBtn}
                    placeholder="아이디를 입력하세요"
                  />
                  <button type="button" onClick={handleIdCheck} style={styles.checkButton}>
                    중복 확인
                  </button>
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="비밀번호를 입력하세요"
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password 확인</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="비밀번호를 다시 입력하세요"
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="이메일을 입력하세요"
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>휴대번호</label>
                <div style={styles.inputWithButton}>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={styles.inputWithBtn}
                    placeholder="휴대폰 번호를 입력하세요"
                  />
                  <button
                    type="button"
                    onClick={handlePhoneVerification}
                    style={styles.checkButton}
                  >
                    인증 확인
                  </button>
                </div>
              </div>

              <button type="submit" style={styles.submitButton} disabled={loading}>
                {loading ? '가입 중...' : '회원 가입'}
              </button>
            </form>

            <div style={styles.registerSection}>
              <span>이미 계정이 있으신가요? </span>
              <button onClick={() => setCurrentForm('login')} style={styles.registerLink}>
                로그인
              </button>
            </div>
          </div>
        )}

        {/* 비밀번호 찾기 폼 */}
        {currentForm === 'reset' && (
          <div style={styles.formContainer}>
            <div style={styles.formHeader}>
              <h2>비밀번호 찾기</h2>
              <p style={styles.description}>
                가입 시 사용한 이메일을 입력하시면
                <br />
                비밀번호 재설정 링크를 보내드립니다.
              </p>
            </div>

            <form onSubmit={handlePasswordReset} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  style={styles.input}
                  placeholder="이메일을 입력하세요"
                />
              </div>

              <button type="submit" style={styles.submitButton}>
                재설정 링크 보내기
              </button>
            </form>

            <div style={styles.backSection}>
              <button onClick={() => setCurrentForm('login')} style={styles.backLink}>
                ← 로그인으로 돌아가기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  loginPage: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #A8C8EC 0%, #C8B8E8 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  loginCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  formContainer: { width: '100%' },
  formHeader: { textAlign: 'center', marginBottom: '30px' },
  description: { color: '#666', fontSize: '14px', lineHeight: '1.5', marginTop: '10px' },
  mascot: { fontSize: '60px', marginBottom: '10px' },
  coin: { position: 'absolute', top: '0', right: '30%', fontSize: '24px' },
  speechBubble: {
    background: '#f0f0f0',
    borderRadius: '20px',
    padding: '10px 15px',
    fontSize: '14px',
    color: '#333',
    position: 'relative',
    display: 'inline-block',
    marginTop: '10px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#333' },
  input: {
    padding: '12px',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'border-color 0.3s',
    outline: 'none',
  },
  inputWithButton: { display: 'flex', gap: '10px' },
  inputWithBtn: {
    flex: 1,
    padding: '12px',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
  },
  checkButton: {
    padding: '12px 16px',
    background: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  submitButton: {
    padding: '15px',
    background: 'linear-gradient(135deg, #A8C8EC 0%, #C8B8E8 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    marginTop: '10px',
  },
  linkSection: { textAlign: 'center', margin: '20px 0' },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#666',
    fontSize: '14px',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  divider: {
    textAlign: 'center',
    margin: '25px 0',
    position: 'relative',
    color: '#666',
    fontSize: '14px',
  },
  socialButtons: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    marginBottom: '25px',
  },
  socialButton: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s',
  },
  registerSection: { textAlign: 'center', fontSize: '14px', color: '#666' },
  registerLink: {
    background: 'none',
    border: 'none',
    color: '#A8C8EC',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  testAccount: {
    textAlign: 'center',
    marginTop: '20px',
    padding: '10px',
    background: '#f8f9fa',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#666',
  },
  backSection: { textAlign: 'center', marginTop: '20px' },
  backLink: {
    background: 'none',
    border: 'none',
    color: '#A8C8EC',
    fontSize: '14px',
    cursor: 'pointer',
    fontWeight: '600',
  },
};

export default LoginPage;
