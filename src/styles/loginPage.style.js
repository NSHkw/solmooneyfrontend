// src/styles/loginPage.style.js
import styled from '@emotion/styled';

// 메인 페이지 컨테이너
const LoginPage = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #a8c8ec 0%, #c8b8e8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

// 로그인 카드
const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  max-height: 90vh;
  overflow-y: auto;
`;

// 폼 컨테이너
const FormContainer = styled.div`
  width: 100%;
`;

// 로고 섹션
const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
`;

// 말풍선
const SpeechBubble = styled.div`
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #f8f9fa;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  border: 1px solid #e9ecef;
`;

// 폼 헤더
const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;

  h2 {
    margin: 0;
    color: #333;
    font-size: 24px;
    font-weight: 600;
  }
`;

// 설명 텍스트
const Description = styled.p`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-top: 10px;
  margin-bottom: 0;
`;

// 폼
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// 입력 그룹
const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// 라벨
const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

// 기본 입력 필드
const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }

  &:disabled {
    background-color: #f8f9fa;
    color: #666;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #999;
  }
`;

// 버튼과 함께 있는 입력 필드 컨테이너
const InputWithButton = styled.div`
  display: flex;
  gap: 8px;
`;

// 버튼과 함께 있는 입력 필드
const InputWithBtn = styled(Input)`
  flex: 1;
`;

// 확인 버튼 (중복확인, 인증확인 등)
const CheckButton = styled.button`
  padding: 12px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  font-weight: 500;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #218838;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

// 제출 버튼
const SubmitButton = styled.button`
  padding: 14px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #357abd;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

// 성공 텍스트
const SuccessText = styled.div`
  font-size: 12px;
  color: #28a745;
  margin-top: 4px;
  font-weight: 500;
`;

// 에러 텍스트
const ErrorText = styled.div`
  font-size: 12px;
  color: #dc3545;
  margin-top: 4px;
  font-weight: 500;
`;

// 링크 섹션
const LinkSection = styled.div`
  text-align: center;
  margin-top: 20px;
`;

// 링크 버튼
const LinkButton = styled.button`
  background: none;
  border: none;
  color: #4a90e2;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.3s ease;

  &:hover {
    color: #357abd;
  }
`;

// 구분선
const Divider = styled.div`
  text-align: center;
  margin: 30px 0;
  position: relative;
  color: #666;
  font-size: 14px;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #e9ecef;
    z-index: 1;
  }

  span {
    background-color: rgba(255, 255, 255, 0.95);
    padding: 0 15px;
    position: relative;
    z-index: 2;
  }
`;

// 소셜 버튼들
const SocialButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
`;

// 소셜 버튼
const SocialButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

// 회원가입 섹션
const RegisterSection = styled.div`
  text-align: center;
  font-size: 14px;
  color: #666;
`;

// 회원가입 링크
const RegisterLink = styled.button`
  background: none;
  border: none;
  color: #4a90e2;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  font-weight: 600;
  transition: color 0.3s ease;

  &:hover {
    color: #357abd;
  }
`;

// 테스트 계정 표시
const TestAccount = styled.div`
  text-align: center;
  margin-top: 20px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
  font-size: 12px;
  color: #666;
  border: 1px solid #e9ecef;

  p {
    margin: 0;
    font-weight: 500;
  }
`;

// 뒤로가기 섹션
const BackSection = styled.div`
  text-align: center;
  margin-top: 20px;
`;

// 뒤로가기 링크
const BackLink = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #333;
  }
`;

// 로고 이미지
const LogoImage = styled.img`
  width: 80px;
  height: auto;
`;

// Default export로만 제공
const S = {
  LoginPage,
  LoginCard,
  FormContainer,
  LogoSection,
  SpeechBubble,
  FormHeader,
  Description,
  Form,
  InputGroup,
  Label,
  Input,
  InputWithButton,
  InputWithBtn,
  CheckButton,
  SubmitButton,
  SuccessText,
  ErrorText,
  LinkSection,
  LinkButton,
  Divider,
  SocialButtons,
  SocialButton,
  RegisterSection,
  RegisterLink,
  TestAccount,
  BackSection,
  BackLink,
  LogoImage,
};

export default S;
