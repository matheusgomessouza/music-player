import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UploadMusicPage from './pages/UploadMusicPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadMusicPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
