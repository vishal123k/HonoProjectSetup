import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const VendorDashboard = () => {
  const { user } = useContext(AuthContext);
  
  // States
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: '', gstNumber: '', servicesOffered: '', hourlyRate: '', stripeAccountId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileRes, contractsRes] = await Promise.all([
        API.get('/profiles'),
        API.get('/contracts/vendor')
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data);
        setFormData({
          companyName: profileRes.data.companyName || '',
          gstNumber: profileRes.data.gstNumber || '',
          servicesOffered: profileRes.data.servicesOffered?.join(', ') || '',
          hourlyRate: profileRes.data.hourlyRate || '',
          stripeAccountId: profileRes.data.stripeAccountId || ''
        });
      }
      setContracts(contractsRes.data);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    // VALIDATION: Minimum ₹10 check for Hourly Rate
    if (Number(formData.hourlyRate) < 10) {
      return alert("Professional standard: Minimum hourly rate must be ₹10.");
    }

    setIsSaving(true);
    try {
      const formattedData = {
        ...formData,
        servicesOffered: formData.servicesOffered.split(',').map(s => s.trim())
      };
      const { data } = await API.post('/profiles', formattedData);
      setProfile(data);
      setIsEditing(false);
      alert('Business Profile Synchronized!');
    } catch (error) {
      alert(error.response?.data?.message || 'Update failed');
    } finally {
      setIsSaving(false);
    }
  };

  const updateStatus = async (contractId, newStatus) => {
    try {
      await API.put(`/contracts/${contractId}/status`, { status: newStatus });
      fetchData(); 
    } catch (error) {
      alert("Status update failed");
    }
  };

  const totalEarnings = contracts
    .filter(c => c.status === 'completed')
    .reduce((sum, c) => sum + c.totalAmount, 0);
    
  const activeJobs = contracts.filter(c => ['funded', 'in_progress'].includes(c.status));

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Accessing Vendor Terminal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 pb-24">
      {/* Upper Brand Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div className="border-l-8 border-blue-600 pl-6">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">VENDOR PORTAL</h1>
          <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-1">
            Enterprise Identity: <span className="text-blue-600">{profile?.companyName || 'PENDING SETUP'}</span>
          </p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)} 
          className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
            isEditing ? 'bg-gray-200 text-gray-600' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isEditing ? 'Discard Changes' : 'Manage Enterprise Profile'}
        </button>
      </div>

      {isEditing ? (
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-gray-100 p-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
           <h2 className="text-sm font-black text-gray-400 mb-8 uppercase tracking-[0.2em]">Business Authentication Details</h2>
           <form onSubmit={handleSaveProfile} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Company Entity Name</label>
                <input type="text" required value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Government GSTIN</label>
                <input type="text" required placeholder="22AAAAA0000A1Z5" value={formData.gstNumber} onChange={(e) => setFormData({...formData, gstNumber: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Core Competencies (Comma Separated)</label>
                <input type="text" value={formData.servicesOffered} onChange={(e) => setFormData({...formData, servicesOffered: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-gray-700" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Service Rate (₹ / Hour)</label>
                <input type="number" required min="10" value={formData.hourlyRate} onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-black text-gray-800" />
              </div>
            </div>
            <button type="submit" disabled={isSaving} className="w-full md:w-auto bg-slate-900 text-white font-black py-4 px-16 rounded-2xl hover:bg-blue-600 transition-all shadow-xl disabled:bg-gray-300">
              {isSaving ? 'Synchronizing...' : 'Save & Verify Profile'}
            </button>
          </form>
        </div>
      ) : (
        <>
          {/* Analytics Board */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Account Status</p>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                <p className="text-xl font-black text-gray-800 uppercase tracking-tight">Verified Partner</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Net Settled Revenue</p>
              <p className="text-4xl font-black text-gray-900 italic">₹{totalEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Active Service Pipeline</p>
              <p className="text-4xl font-black text-blue-600 tracking-tighter">{activeJobs.length} Jobs</p>
            </div>
          </div>

          {/* Operational Flow */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <h2 className="text-lg font-black text-gray-800 uppercase tracking-widest">Active Contracts</h2>
              <span className="text-[10px] font-black bg-white px-4 py-1.5 rounded-full border border-gray-200 text-gray-400 uppercase tracking-widest animate-pulse">Live Sync</span>
            </div>
            
            {contracts.length === 0 ? (
              <div className="py-24 text-center">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No Active Service Requests Found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {contracts.map(contract => (
                  <div key={contract._id} className="p-8 flex flex-col md:flex-row justify-between items-center hover:bg-gray-50/50 transition-all">
                    <div className="flex items-center space-x-6 w-full md:w-auto">
                       <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
                         {contract.client?.name?.charAt(0) || 'C'}
                       </div>
                       <div>
                         <h3 className="font-black text-gray-900 text-xl tracking-tight">{contract.title}</h3>
                         <div className="flex items-center space-x-2 mt-1">
                           <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Requester:</span>
                           <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest underline underline-offset-4">{contract.client?.name}</span>
                         </div>
                       </div>
                    </div>
                    
                    <div className="flex items-center space-x-12 w-full md:w-auto justify-between md:justify-end mt-6 md:mt-0">
                      <div className="text-right">
                        <p className="text-2xl font-black text-gray-900 tracking-tighter">₹{contract.totalAmount.toLocaleString()}</p>
                        <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest border mt-2 inline-block ${
                          contract.status === 'completed' ? 'bg-green-50 text-green-700 border-green-100' :
                          contract.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          contract.status === 'funded' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-gray-50 text-gray-400 border-gray-200'
                        }`}>
                          {contract.status || 'DRAFT'}
                        </span>
                      </div>
                      
                      <div className="w-40 flex justify-end">
                        {contract.status === 'funded' && (
                          <button onClick={() => updateStatus(contract._id, 'in_progress')} className="w-full bg-blue-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                            Initialize Job
                          </button>
                        )}
                        
                        {contract.status === 'in_progress' && (
                          <button onClick={() => updateStatus(contract._id, 'completed')} className="w-full bg-green-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-green-100 hover:bg-green-700 hover:-translate-y-0.5 transition-all">
                            Submit Assets
                          </button>
                        )}

                        {(contract.status === 'draft' || !contract.status) && (
                          <div className="text-[9px] font-black text-orange-400 uppercase tracking-[0.2em] animate-pulse">
                            Awaiting Escrow...
                          </div>
                        )}
                        
                        {contract.status === 'completed' && (
                           <div className="flex items-center text-green-500">
                              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                              <span className="text-[10px] font-black uppercase tracking-widest">Settled</span>
                           </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VendorDashboard;