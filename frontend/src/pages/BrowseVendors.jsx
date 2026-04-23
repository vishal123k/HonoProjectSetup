import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const BrowseVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const { data } = await API.get('/contracts/vendors');
        setVendors(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch vendors", error);
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  const filteredVendors = vendors.filter(vendor => 
    vendor.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vendor.servicesOffered && vendor.servicesOffered.some(service => service.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Premium Hero Search Header */}
      <div className="bg-blue-700 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] py-16 px-6 shadow-inner">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Find the Perfect <span className="text-blue-300">B2B Partner</span>
          </h1>
          <p className="text-blue-100 text-lg mb-8 opacity-90 font-medium">
            Discover verified professionals and specialized agencies for your next project.
          </p>
          
          {/* Dynamic Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search by company, service, or expertise..." 
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-none shadow-2xl text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-blue-400/50 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Results Counter */}
        {!loading && (
          <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <span className="text-gray-500 font-medium">
              Showing <span className="text-blue-600 font-bold">{filteredVendors.length}</span> verified partners
            </span>
            <div className="flex space-x-2">
               <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
               <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Real-time Directory</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-white rounded-2xl animate-pulse border border-gray-100"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVendors.length === 0 ? (
              <div className="col-span-full bg-white rounded-3xl p-16 text-center shadow-sm border-2 border-dashed border-gray-200">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">No matches found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search terms or browsing all categories.</p>
                <button onClick={() => setSearchTerm('')} className="mt-6 text-blue-600 font-bold hover:underline">Clear Search</button>
              </div>
            ) : (
              filteredVendors.map((vendor) => (
                <div key={vendor._id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-black text-xl border border-blue-100">
                      {vendor.companyName.charAt(0)}
                    </div>
                    <div className="text-right">
                      <span className="block text-2xl font-black text-gray-900 leading-none">₹{vendor.hourlyRate || '0'}</span>
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">per hour rate</span>
                    </div>
                  </div>

                  <div className="flex-grow">
                    <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{vendor.companyName}</h2>
                    <div className="flex items-center mt-2 mb-4">
                      <div className="flex items-center text-green-600 bg-green-50 px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
                        Verified
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {vendor.servicesOffered && vendor.servicesOffered.map((service, idx) => (
                        <span key={idx} className="text-[11px] font-bold bg-gray-50 text-gray-500 px-2 py-1 rounded-md border border-gray-100 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link 
                    to="/dashboard/client" 
                    className="mt-auto w-full py-3 bg-gray-900 text-white text-center font-bold rounded-xl hover:bg-blue-600 shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                  >
                    Hire Partner
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseVendors;