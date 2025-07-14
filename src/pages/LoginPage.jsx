// src/pages/LoginPage.jsx
import { useState } from 'react';
import { toast } from 'react-toastify'; // ToastContainer 없이 toast만 import!
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [loginData, setLoginData] = useState({
    id: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 간단한 유효성 검사
    if (!loginData.id.trim()) {
      toast.error('아이디를 입력해주세요!');
      return;
    }

    if (!loginData.password.trim()) {
      toast.error('비밀번호를 입력해주세요!');
      return;
    }

    // 임시 로그인 로직 (실제로는 API 호출)
    if (loginData.id === 'admin' && loginData.password === '1234') {
      toast.success('로그인 성공! 환영합니다! 🎉');
      setTimeout(() => {
        navigate('/'); // 메인 페이지로 이동
      }, 1500);
    } else {
      toast.error('아이디 또는 비밀번호가 틀렸습니다.');
    }
  };

  return (
    <div>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>로그인 페이지</h2>
        <br />

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="loginID">ID</label>
            <br />
            <input
              type="text"
              id="loginID"
              name="id"
              value={loginData.id}
              onChange={handleInputChange}
              style={{
                padding: '8px',
                margin: '5px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                width: '200px',
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="loginPW">PW</label>
            <br />
            <input
              type="password"
              id="loginPW"
              name="password"
              value={loginData.password}
              onChange={handleInputChange}
              style={{
                padding: '8px',
                margin: '5px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                width: '200px',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#4A90E2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            로그인
          </button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          <p>테스트 계정: admin / 1234</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
