import { Link } from 'react-router-dom';

const Home = () => {
  const categories = [
    { name: 'IT & Software', icon: '💻', count: '120+ Vendors' },
    { name: 'Home Maintenance', icon: '🏠', count: '85+ Vendors' },
    { name: 'Logistics', icon: '🚚', count: '40+ Vendors' },
    { name: 'Marketing', icon: '📢', count: '60+ Vendors' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-blue-100 selection:text-blue-700">
      
      {/* 1. Premium Hero Section */}
      <div className="relative bg-slate-900 overflow-hidden">
        {/* Background Pattern Decor */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -right-24 w-80 h-80 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-28 lg:py-40 flex flex-col items-center text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-blue-400 uppercase bg-blue-400/10 rounded-full">
            India's Most Trusted B2B Marketplace
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-8">
            Hire the Best. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Pay with Confidence.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
            Eliminate payment risks with our built-in <strong>Escrow Protection</strong>. From web development to heavy logistics—get verified experts for every business need.
          </p>
          <div className="flex flex-col sm:flex-row gap-5">
            <Link 
              to="/register" 
              className="group bg-blue-600 text-white font-black py-4 px-10 rounded-2xl shadow-2xl shadow-blue-500/20 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
            >
              Start Hiring Now
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
            <Link 
              to="/browse" 
              className="bg-slate-800 text-white border border-slate-700 font-bold py-4 px-10 rounded-2xl hover:bg-slate-700 transition-all"
            >
              Explore Directory
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Trusted Service Categories */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-blue-200 transition-colors group cursor-pointer">
              <span className="text-3xl mb-4 block group-hover:scale-125 transition-transform">{cat.icon}</span>
              <h3 className="font-bold text-slate-800">{cat.name}</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">{cat.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. The Escrow Process (How it Works) */}
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">
              Security is not an option. <br />
              <span className="text-blue-600 italic underline decoration-blue-200 underline-offset-8">It's a promise.</span>
            </h2>
            <p className="text-slate-500 text-lg mb-10">
              Unlike traditional freelancing, we hold funds in a secure digital vault (Escrow) until both parties agree the job is perfect.
            </p>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold">1</div>
                <div>
                  <h4 className="font-bold text-slate-800">Draft & Deposit</h4>
                  <p className="text-sm text-slate-500">Create a contract and fund it via Stripe. Money stays in Escrow.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-slate-800 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold">2</div>
                <div>
                  <h4 className="font-bold text-slate-800">Vendor Delivers</h4>
                  <p className="text-sm text-slate-500">Professional starts work immediately knowing the payment is secured.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold">3</div>
                <div>
                  <h4 className="font-bold text-slate-800">Approve & Release</h4>
                  <p className="text-sm text-slate-500">Review the work. Once satisfied, release the funds instantly.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Visual Placeholder for Image/Graphic */}
          <div className="lg:w-1/2 w-full bg-slate-100 rounded-[3rem] h-[400px] flex items-center justify-center border-8 border-white shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10"></div>
             <span className="text-slate-300 font-black text-8xl opacity-20 uppercase -rotate-12">Escrow</span>
             <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl mb-4 animate-bounce">🔒</div>
                <p className="font-bold text-slate-800">Payment Secured</p>
                <p className="text-xs text-slate-400">Transaction ID: #UTM-892</p>
             </div>
          </div>
        </div>
      </div>

      {/* 4. MODERN FOOTER SECTION */}
      <footer className="bg-slate-950 text-slate-400 pt-20 pb-10 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="text-2xl font-black text-white mb-6 block">
                UttamSewa <span className="text-blue-500">B2B</span>
              </Link>
              <p className="text-sm leading-relaxed mb-6">
                Redefining B2B commerce through transparency and bulletproof payment security. Build your enterprise with verified partners.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"><i className="fab fa-linkedin-in"></i></a>
                <a href="#" className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all"><i className="fab fa-twitter"></i></a>
                <a href="#" className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><i className="fab fa-instagram"></i></a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Marketplace</h3>
              <ul className="space-y-4 text-sm">
                <li><Link to="/browse" className="hover:text-blue-400 transition-colors">Browse All Services</Link></li>
                <li><Link to="/register" className="hover:text-blue-400 transition-colors">Apply as Vendor</Link></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Verified Badge Program</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Resources</h3>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Safety Guide</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Success Stories</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Stay Updated</h3>
              <p className="text-xs mb-4">Get the latest B2B trends and vendor updates.</p>
              <div className="flex">
                <input type="email" placeholder="Email" className="bg-slate-900 border-none rounded-l-xl px-4 py-2 w-full text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                <button className="bg-blue-600 text-white px-4 rounded-r-xl text-xs font-bold hover:bg-blue-700 transition-colors">Go</button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-tighter">
            <p>© {new Date().getFullYear()} UttamSewa Corporation. Built with Pride.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;