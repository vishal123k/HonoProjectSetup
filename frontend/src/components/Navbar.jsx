import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm py-3 px-6 md:px-12 flex justify-between items-center">
      <Link to="/" className="flex items-center space-x-2 group">
        <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-2xl font-black text-gray-800 tracking-tight">
          UttamSewa <span className="text-blue-600">B2B</span>
        </span>
      </Link>
      
      <div className="hidden md:flex items-center space-x-8">
        {user ? (
          <div className="flex items-center space-x-6">
            <Link 
              to={user.role === 'vendor' ? '/dashboard/vendor' : '/dashboard/client'}
              className="text-gray-600 hover:text-blue-600 font-semibold text-sm uppercase tracking-wider"
            >
              My Dashboard
            </Link>
            <div className="flex items-center space-x-3 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-200">
              <span className="text-gray-700 text-sm font-medium">
                {user.name} <span className="text-gray-400 text-[10px]">({user.role})</span>
              </span>
              <button onClick={handleLogout} className="ml-2 text-red-400 hover:text-red-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-blue-600 font-bold transition px-3 py-2">Sign In</Link>
            <Link to="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 shadow-md">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;