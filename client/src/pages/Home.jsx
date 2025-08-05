import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
      </div>

      <nav className="relative z-10 flex justify-between items-center p-6 backdrop-blur-sm bg-white/5 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-xl font-bold">Statly</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login">
            <button className="px-4 py-2 text-white/80 hover:text-white transition duration-200">
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-sm transition duration-200">
              Sign Up
            </button>
          </Link>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col justify-center items-center px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
            Track Your
            <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
              Coding Journey
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            One unified dashboard to monitor your progress across 
            <span className="text-blue-400 font-semibold"> LeetCode</span>,
            <span className="text-purple-400 font-semibold"> Codeforces</span>,
            <span className="text-indigo-400 font-semibold"> GitHub</span>, and more
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link to="/login">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm min-w-[140px]">
                Get Started
              </button>
            </Link>
            <Link to="/signup">
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-white/20 hover:border-white/30 min-w-[140px]">
                Create Account
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl">
            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Unified Analytics</h3>
              <p className="text-gray-400 text-sm">Track all your coding platforms in one place</p>
            </div>
            
            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Updates</h3>
              <p className="text-gray-400 text-sm">Get instant insights on your progress</p>
            </div>
            
            <div className="p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-white text-xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Goal Tracking</h3>
              <p className="text-gray-400 text-sm">Set and achieve your coding milestones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;