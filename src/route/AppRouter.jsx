// src/route/AppRouter.jsx
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import ProtectedRoute from '../route/ProtectedRoute';
import HomePage from '../pages/HomePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import DiaryPage from '../pages/DiaryPage.jsx';
import ChallengePage from '../pages/ChallengePage.jsx';
import AccountBookPage from '../pages/AccountBookPage.jsx';
import UserPage from '../pages/UserPage.jsx';
import SubscriptionPage from '../pages/SubscriptionPage.jsx';
import { ROUTES } from '../route/routes.js';
import WithdrawalPage from '../pages/WithdrawalPage.jsx';
import ModifyUserPage from '../pages/ModifyUserPage.jsx';

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

      <Route
        path={ROUTES.WITHDRAWAL}
        element={
          <ProtectedRoute>
            <WithdrawalPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.MODIFY_USER}
        element={
          <ProtectedRoute>
            <ModifyUserPage />
          </ProtectedRoute>
        }
      />

      {/* 404 페이지 */}
      <Route path="*" element={<div>페이지를 찾을 수 없습니다</div>} />
    </Routes>
  );
}

export default AppRouter;
