// src/route/AppRouter.jsx
import { Routes, Route } from 'react-router-dom';
import Layout from '@components/Layout.jsx';
import ProtectedRoute from '@components/ProtectedRoute';
import HomePage from '@pages/HomePage.jsx';
import LoginPage from '@pages/LoginPage.jsx';
import DiaryPage from '@pages/DiaryPage.jsx';
import ChallengePage from '@pages/ChallengePage.jsx';
import AccountBookPage from '@pages/AccountBookPage.jsx';
import UserPage from '@pages/UserPage.jsx';
import SubscriptionPage from '@pages/SubscriptionPage.jsx';
import Setting from '@pages/Setting.jsx';
// import ExitPage from '@pages/ExitPage.jsx'; // 아직 구현되지 않음
import { ROUTES } from '@route/routes.js';

function AppRouter() {
  return (
    <Routes>
      {/* Layout 없는 페이지들 - 사이드바 없는 것 */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      {/* 인증이 필요한 Layout 없는 페이지들 */}
      <Route
        path={ROUTES.USER}
        element={
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={ROUTES.SETTING}
        element={
          <ProtectedRoute>
            <Setting />
          </ProtectedRoute>
        }
      />

      {/* 회원 탈퇴 페이지 - 아직 구현되지 않음 */}
      {/* 
      <Route 
        path="/exit" 
        element={
          <ProtectedRoute>
            <ExitPage />
          </ProtectedRoute>
        } 
      />
      */}

      {/* Layout이 있는 페이지들 - 사이드바 있는 것 (모두 인증 필요) */}
      <Route
        path={ROUTES.ROOT}
        element={
          <ProtectedRoute>
            <Layout>
              <HomePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.DIARY}
        element={
          <ProtectedRoute>
            <Layout>
              <DiaryPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.CHALLENGE}
        element={
          <ProtectedRoute>
            <Layout>
              <ChallengePage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.ACCOUNT_BOOK}
        element={
          <ProtectedRoute>
            <Layout>
              <AccountBookPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.SUBSCRIPTION}
        element={
          <ProtectedRoute>
            <Layout>
              <SubscriptionPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 404 페이지 */}
      <Route path="*" element={<div>페이지를 찾을 수 없습니다</div>} />
    </Routes>
  );
}

export default AppRouter;
