import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = await login(email, password);
      if (userData.role === 'client') navigate('/dashboard/client');
      else navigate('/dashboard/vendor');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">Welcome Back</h2>
        {error && <p className="text-red-500 text-sm font-bold text-center mb-4 bg-red-50 p-3 rounded-xl">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email Address" required className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" onChange={e => setPassword(e.target.value)} />
          <button disabled={loading} className="w-full bg-slate-900 text-white font-black py-4 rounded-xl shadow-xl hover:bg-blue-600 transition-all">
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
        <p className="text-center mt-6 text-gray-500 font-medium">
          New to UttamSewa? <Link to="/register" className="text-blue-600 font-bold hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;