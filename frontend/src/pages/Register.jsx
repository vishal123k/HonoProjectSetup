import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'client' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">Join UttamSewa</h2>
        {error && <p className="text-red-500 text-sm font-bold text-center mb-4 bg-red-50 p-3 rounded-xl">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Full Name" required className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" onChange={e => setFormData({...formData, name: e.target.value})} />
          <input type="email" placeholder="Email Address" required className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="password" placeholder="Password" required minLength="6" className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" onChange={e => setFormData({...formData, password: e.target.value})} />
          <select className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-700" onChange={e => setFormData({...formData, role: e.target.value})}>
            <option value="client">I want to Hire (Client)</option>
            <option value="vendor">I want to Work (Vendor)</option>
          </select>
          <button disabled={loading} className="w-full bg-blue-600 text-white font-black py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center mt-6 text-gray-500 font-medium">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;