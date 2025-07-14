// src/utils/toast.js
import { toast } from 'react-toastify';

/**
 * Toast 유틸리티 함수들
 * App.jsx에 ToastContainer가 전역으로 설정되어 있어 어디서든 사용 가능
 */

// 기본 toast 설정
const defaultOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// 성공 메시지
export const showSuccess = (message, options = {}) => {
  return toast.success(message, {
    ...defaultOptions,
    ...options,
  });
};

// 에러 메시지
export const showError = (message, options = {}) => {
  return toast.error(message, {
    ...defaultOptions,
    ...options,
  });
};

// 경고 메시지
export const showWarning = (message, options = {}) => {
  return toast.warning(message, {
    ...defaultOptions,
    ...options,
  });
};

// 정보 메시지
export const showInfo = (message, options = {}) => {
  return toast.info(message, {
    ...defaultOptions,
    ...options,
  });
};

// 로딩 toast (업데이트 가능)
export const showLoading = (message = '처리 중...', options = {}) => {
  return toast.loading(message, {
    ...defaultOptions,
    autoClose: false,
    closeOnClick: false,
    draggable: false,
    ...options,
  });
};

// 로딩 toast 업데이트 (성공)
export const updateLoadingSuccess = (toastId, message, options = {}) => {
  return toast.update(toastId, {
    render: message,
    type: 'success',
    isLoading: false,
    autoClose: 3000,
    closeOnClick: true,
    draggable: true,
    ...options,
  });
};

// 로딩 toast 업데이트 (에러)
export const updateLoadingError = (toastId, message, options = {}) => {
  return toast.update(toastId, {
    render: message,
    type: 'error',
    isLoading: false,
    autoClose: 3000,
    closeOnClick: true,
    draggable: true,
    ...options,
  });
};

// 커스텀 jsx 내용의 toast
export const showCustom = (content, options = {}) => {
  return toast(content, {
    ...defaultOptions,
    ...options,
  });
};

// Promise toast (API 호출에 유용)
export const showPromise = (promise, messages, options = {}) => {
  return toast.promise(
    promise,
    {
      pending: messages.pending || '처리 중...',
      success: messages.success || '성공!',
      error: messages.error || '오류가 발생했습니다.',
    },
    {
      ...defaultOptions,
      ...options,
    },
  );
};

// 모든 toast 닫기
export const dismissAll = () => {
  toast.dismiss();
};

// 특정 toast 닫기
export const dismiss = (toastId) => {
  toast.dismiss(toastId);
};

/**
 * 사용 예시:
 *
 * // 기본 사용
 * import { showSuccess, showError } from '@utils/toast';
 * showSuccess('저장되었습니다!');
 * showError('오류가 발생했습니다.');
 *
 * // 커스텀 옵션
 * showSuccess('성공!', {
 *   autoClose: 5000,
 *   position: "bottom-right"
 * });
 *
 * // 로딩 처리
 * const toastId = showLoading('저장 중...');
 * // API 호출 후
 * updateLoadingSuccess(toastId, '저장 완료!');
 *
 * // Promise 처리
 * showPromise(
 *   apiCall(),
 *   {
 *     pending: '처리 중...',
 *     success: '성공적으로 처리되었습니다!',
 *     error: '처리 중 오류가 발생했습니다.'
 *   }
 * );
 *
 * // 커스텀 JSX
 * showCustom(
 *   <div>
 *     <strong>알림</strong>
 *     <br />
 *     새로운 메시지가 도착했습니다.
 *   </div>
 * );
 */
