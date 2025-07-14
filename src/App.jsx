// src/App.jsx
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRouter from '@route/AppRouter';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppRouter />

        {/* 전역 Toast Container - 모든 페이지에서 사용 가능 */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          // 추가 커스터마이징
          toastClassName="custom-toast"
          bodyClassName="custom-toast-body"
          progressClassName="custom-toast-progress"
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
