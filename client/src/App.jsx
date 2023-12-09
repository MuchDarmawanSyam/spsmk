import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "@/layouts";
import { Login } from "@/pages/auth";

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
}

export default App;
