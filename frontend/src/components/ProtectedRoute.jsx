import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext); // loading state context se le rahe hain
  const location = useLocation();

  // 1. Agar context load ho raha hai, toh loader dikhayein
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // 2. Agar user logged in nahi hai, toh login page par bhejein
  // state={{ from: location }} se hum yaad rakhte hain ki user kahan jana chahta tha
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Role-based Access Control (RBAC)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Agar access nahi hai, toh home par bhejein ya unauthorized page par
    return <Navigate to="/" replace />;
  }

  // 4. Sab sahi hai toh page dikhayein
  return children;
};

export default ProtectedRoute;