import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import PaymentModal from '../components/PaymentModal';

const ClientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [contracts, setContracts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showNewContractModal, setShowNewContractModal] = useState(false);
  const [newContract, setNewContract] = useState({ providerId: '', title: '', totalAmount: '' });
  const [paymentData, setPaymentData] = useState({ show: false, clientSecret: '', amount: 0, contractId: null });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contractsRes, vendorsRes] = await Promise.all([
        API.get('/contracts/client'),
        API.get('/contracts/vendors')
      ]);
      setContracts(contractsRes.data);
      setVendors(vendorsRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      setLoading(false);
    }
  };

  const handleCreateContract = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/contracts', newContract);
      setContracts([data, ...contracts]);
      setShowNewContractModal(false);
      setNewContract({ providerId: '', title: '', totalAmount: '' });
    } catch (error) {
      alert("Failed to create contract.");
    }
  };

  const handleFundEscrow = async (contract) => {
    try {
      const { data } = await API.post('/payments/fund', { contractId: contract._id });
      setPaymentData({
        show: true,
        clientSecret: data.clientSecret,
        amount: contract.totalAmount,
        contractId: contract._id
      });
    } catch (error) {
      alert("Error initializing payment: " + (error.response?.data?.message || error.message));
    }
  };

  const handlePaymentSuccess = () => {
    alert("Success! Funds are secured in Escrow.");
    setPaymentData({ show: false, clientSecret: '', amount: 0, contractId: null });
    fetchData();
  };

  // Financial Analytics
  const stats = {
    totalSpent: contracts.filter(c => c.status === 'completed').reduce((sum, c) => sum + c.totalAmount, 0),
    inEscrow: contracts.filter(c => ['funded', 'in_progress'].includes(c.status)).reduce((sum, c) => sum + c.totalAmount, 0),
    activeJobs: contracts.filter(c => c.status !== 'completed').length
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Client Hub</h1>
          <p className="text-gray-500 font-medium italic">Welcome back, {user?.name}</p>
        </div>
        <button 
          onClick={() => setShowNewContractModal(true)} 
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95"
        >
          + Create New Contract
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Funds in Escrow</p>
          <p className="text-3xl font-black text-blue-600 mt-1">₹{stats.inEscrow.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Investment</p>
          <p className="text-3xl font-black text-gray-800 mt-1">₹{stats.totalSpent.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-green-500">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Projects</p>
          <p className="text-3xl font-black text-gray-800 mt-1">{stats.activeJobs}</p>
        </div>
      </div>

      {/* Contracts Table/List */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Project Management</h2>
          <span className="text-xs font-black bg-white px-3 py-1 rounded-full border text-gray-400 uppercase tracking-tighter">Live Updates</span>
        </div>

        {loading ? (
          <div className="p-20 text-center animate-pulse text-gray-300 font-bold uppercase tracking-widest">Syncing Dashboard...</div>
        ) : contracts.length === 0 ? (
          <div className="p-20 text-center">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            </div>
            <p className="text-gray-500 font-medium">No projects started yet. Hire a vendor to begin.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {contracts.map((contract) => (
              <div key={contract._id} className="p-6 flex flex-col md:flex-row justify-between items-center hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center space-x-4 mb-4 md:mb-0 w-full md:w-auto">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-black">
                    {contract.provider?.companyName?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{contract.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs font-bold text-gray-400">VENDOR:</span>
                      <span className="text-xs font-black text-gray-600 uppercase tracking-wide">{contract.provider?.companyName || 'Verified Partner'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-8 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-center md:text-right">
                    <p className="text-xl font-black text-gray-900">₹{contract.totalAmount.toLocaleString()}</p>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-tighter ${
                      contract.status === 'funded' ? 'bg-green-100 text-green-700' :
                      contract.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {contract.status || 'drafting'}
                    </span>
                  </div>

                  {(!contract.status || contract.status === 'draft') ? (
                    <button 
                      onClick={() => handleFundEscrow(contract)}
                      className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                    >
                      Fund Escrow
                    </button>
                  ) : (
                    <div className="flex flex-col items-center text-green-600">
                      <div className="bg-green-100 p-2 rounded-full">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-[10px] font-black uppercase mt-1 tracking-widest">Secured</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Contract Modal */}
      {showNewContractModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-gray-100 animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Initialize Project</h2>
            <form onSubmit={handleCreateContract} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Select Verified Partner</label>
                <select required className="w-full p-4 bg-gray-50 border-none rounded-2xl text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" value={newContract.providerId} onChange={(e) => setNewContract({...newContract, providerId: e.target.value})}>
                  <option value="">-- Choose from Directory --</option>
                  {vendors.map(v => (
                    <option key={v._id} value={v._id}>{v.companyName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Contract Title</label>
                <input type="text" required placeholder="e.g. Website Overhaul Q2" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" value={newContract.title} onChange={(e) => setNewContract({...newContract, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Escrow Amount (₹)</label>
                <input type="number" required min="1" placeholder="Enter amount" className="w-full p-4 bg-gray-50 border-none rounded-2xl text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none font-bold" value={newContract.totalAmount} onChange={(e) => setNewContract({...newContract, totalAmount: e.target.value})} />
              </div>
              <div className="flex flex-col space-y-3 mt-8">
                <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">Create Draft Contract</button>
                <button type="button" onClick={() => setShowNewContractModal(false)} className="w-full py-2 text-gray-400 font-bold hover:text-gray-600 transition">Discard</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {paymentData.show && (
        <PaymentModal 
          clientSecret={paymentData.clientSecret} 
          amount={paymentData.amount}
          onSuccess={handlePaymentSuccess}
          onClose={() => setPaymentData({ show: false, clientSecret: '', amount: 0, contractId: null })}
        />
      )}
    </div>
  );
};

export default ClientDashboard;