import { Routes, Route, Navigate } from 'react-router-dom';
import UserForm from './pages/UserForm.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminConsole from './pages/AdminConsole.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<UserForm />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminConsole />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
