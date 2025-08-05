import { useEffect, useState } from "react";
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";

const platformConfigs = {
    codeforces: { name: "Codeforces", color: "#1F8ACB", icon: "🏆", verificationText: "Add the code to your Codeforces profile info (firstName, lastName, or organization)." },
    github: { name: "GitHub", color: "#181717", icon: "💻", verificationText: "Add the code to your bio on your GitHub profile page." },
    leetcode: { name: "LeetCode", color: "#FFA116", icon: "💡", verificationText: "Add the code to your LeetCode profile summary." },
    codechef: { name: "CodeChef", color: "#5B4638", icon: "👨‍🍳", verificationText: "Add the code to your Name field in your profile settings." },
};

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-500/20 border-green-500/30 text-green-300' :
                   type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-300' :
                   'bg-blue-500/20 border-blue-500/30 text-blue-300';

    return (
        <div className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg border backdrop-blur-md ${bgColor} shadow-xl animate-pulse`}>
            <div className="flex justify-between items-start">
                <p className="text-sm font-medium">{message}</p>
                <button onClick={onClose} className="ml-4 text-white/70 hover:text-white">×</button>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [platforms, setPlatforms] = useState({});
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState({});
    const [verificationStep, setVerificationStep] = useState(null);
    const [usernameInput, setUsernameInput] = useState({});
    const [verificationLoading, setVerificationLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState(null);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    const closeToast = () => {
        setToast(null);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await API.get('/platforms');
                setPlatforms(res.data.platforms || {});
            } catch (error) {
                console.error("Failed to fetch user data", error);
                if (error.response?.status === 401) {
                    logout();
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [logout, navigate]);

    const handleStartVerification = async (platform, username) => {
        if (!username.trim()) return;
        setVerificationLoading(true);
        try {
            const res = await API.post('/platforms/verify/start', { platform, username });
            setVerificationStep({ platform, username, code: res.data.verificationCode });
        } catch (error) {
            console.error("Start verification error:", error.response?.data || error.message);
            showToast(error.response?.data?.message || 'Error starting verification. Check console for details.', 'error');
        } finally {
            setVerificationLoading(false);
        }
    };

    const handleVerifyPlatform = async () => {
        if (!verificationStep) return;
        setVerificationLoading(true);
        try {
            const res = await API.post('/platforms/verify/complete', { platform: verificationStep.platform });
            setPlatforms(res.data.platforms);
            setVerificationStep(null);
            setUsernameInput({});
            showToast('Platform verified successfully!', 'success');
        } catch (error) {
            console.error("Complete verification error:", error.response?.data);
            showToast(error.response?.data?.message || 'Verification failed. Check the console for more details.', 'error');
        } finally {
            setVerificationLoading(false);
        }
    };
    
    const handleRefresh = async (platform) => {
        setRefreshing(prev => ({ ...prev, [platform]: true }));
        try {
            const res = await API.put(`/platforms/${platform}/refresh`);
            setPlatforms(res.data.platforms);
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to refresh.', 'error');
        } finally {
            setRefreshing(prev => ({ ...prev, [platform]: false }));
        }
    };

    const handleDisconnect = async (platform) => {
        setConfirmDialog({
            title: `Disconnect ${platformConfigs[platform].name}?`,
            message: `Are you sure you want to disconnect ${platformConfigs[platform].name}?`,
            onConfirm: async () => {
                try {
                    const res = await API.delete(`/platforms/${platform}`);
                    setPlatforms(res.data.platforms);
                    setConfirmDialog(null);
                } catch (error) {
                    showToast(error.response?.data?.message || 'Failed to disconnect.', 'error');
                    setConfirmDialog(null);
                }
            },
            onCancel: () => setConfirmDialog(null)
        });
    };

    const handleInputChange = (platform, value) => {
        setUsernameInput(prev => ({ ...prev, [platform]: value }));
    };
    
    const handleLogout = async function(){
        await logout();
        navigate('/login');
    }

    const verifiedPlatforms = Object.entries(platforms).filter(([_, p]) => p.verified);
    
    const combinedStats = {
        totalProblems: verifiedPlatforms.reduce((sum, [_, p]) => sum + (p.data.problemsSolved || 0), 0),
        totalContests: verifiedPlatforms.reduce((sum, [_, p]) => sum + (p.data.contests || 0), 0),
    };

    const githubData = platforms.github?.data;

    if (loading && !Object.keys(platforms).length) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-x-hidden">
            {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
            
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
                <div className="absolute top-1/3 left-1/3 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
            </div>

            <div className="relative z-10 backdrop-blur-sm bg-white/5 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Dashboard</h1>
                            <p className="text-sm text-gray-300">Track your coding journey</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout} 
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-lg border border-red-500/30 transition-all duration-200"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                    <div className="flex items-center space-x-2 mb-6">
                        <span className="text-2xl">📊</span>
                        <h2 className="text-2xl font-bold">Overall Competitive Stats</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-4xl font-bold text-green-400 mb-2">{combinedStats.totalProblems}</p>
                            <p className="text-sm text-gray-300">Problems Solved</p>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-4xl font-bold text-purple-400 mb-2">{combinedStats.totalContests}</p>
                            <p className="text-sm text-gray-300">Contests Attended</p>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-4xl font-bold text-blue-400 mb-2">{verifiedPlatforms.length}</p>
                            <p className="text-sm text-gray-300">Connected Platforms</p>
                        </div>
                        <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                            <p className="text-4xl font-bold text-indigo-400 mb-2">{Object.keys(platformConfigs).length - verifiedPlatforms.length}</p>
                            <p className="text-sm text-gray-300">Available to Connect</p>
                        </div>
                    </div>
                </div>

                {githubData && (
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center space-x-2 mb-6">
                            <span className="text-2xl">💻</span>
                            <h2 className="text-2xl font-bold">GitHub Overview</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-4xl font-bold text-blue-400 mb-2">{githubData.public_repos}</p>
                                <p className="text-sm text-gray-300">Public Repositories</p>
                            </div>
                            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-4xl font-bold text-yellow-400 mb-2">{githubData.total_stars}</p>
                                <p className="text-sm text-gray-300">Total Stars</p>
                            </div>
                            <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-4xl font-bold text-gray-300 mb-2">{githubData.followers}</p>
                                <p className="text-sm text-gray-300">Followers</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                    <div className="flex items-center space-x-2 mb-6">
                        <span className="text-2xl">🔗</span>
                        <h2 className="text-2xl font-bold">Connected Platforms</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(platformConfigs).map(([key, config]) => {
                            const platformData = platforms[key];
                            const isVerified = platformData?.verified;
                            
                            return (
                                <div key={key} className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{config.icon}</span>
                                            <span className="font-semibold text-xl text-white">{config.name}</span>
                                        </div>
                                        {isVerified && (
                                            <span className="bg-green-500/20 text-green-300 text-xs px-3 py-1 rounded-full border border-green-500/30">
                                                ✓ Verified
                                            </span>
                                        )}
                                    </div>

                                    {isVerified ? (
                                        <div className="space-y-4">
                                            <p className="text-lg text-blue-300 font-medium">@{platformData.username}</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                {Object.entries(platformData.data)
                                                    .filter(([k, v]) => !['lastFetched', 'problemRatings', 'totalSubmissions', 'maxStreak'].includes(k) && v && v !== 0)
                                                    .map(([dataKey, dataValue]) => (
                                                        <div key={dataKey} className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                                            <p className="font-bold text-white text-lg">{dataValue.toString()}</p>
                                                            <p className="text-xs text-gray-300 capitalize">{dataKey.replace('_', ' ')}</p>
                                                        </div>
                                                    ))}
                                            </div>
                                            <div className="flex gap-3 pt-2">
                                                <button 
                                                    onClick={() => handleRefresh(key)} 
                                                    disabled={refreshing[key]} 
                                                    className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-blue-500/30"
                                                >
                                                    {refreshing[key] ? 'Refreshing...' : 'Refresh'}
                                                </button>
                                                <button 
                                                    onClick={() => handleDisconnect(key)} 
                                                    className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm transition-all border border-red-500/30"
                                                >
                                                    Disconnect
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                placeholder={`Enter ${config.name} username`}
                                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                                                value={usernameInput[key] || ''}
                                                onChange={(e) => handleInputChange(key, e.target.value)}
                                            />
                                            <button
                                                onClick={() => handleStartVerification(key, usernameInput[key])}
                                                disabled={verificationLoading || !usernameInput[key]}
                                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
                                            >
                                                {verificationLoading ? 'Connecting...' : 'Connect Platform'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>

            {verificationStep && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/20">
                        <div className="text-center mb-6">
                            <span className="text-4xl mb-4 block">{platformConfigs[verificationStep.platform].icon}</span>
                            <h3 className="text-2xl font-bold mb-2">Verify {platformConfigs[verificationStep.platform].name}</h3>
                            <p className="text-gray-300">Follow these steps to connect your account</p>
                        </div>
                        
                        <div className="space-y-6 text-sm">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <p className="font-semibold text-blue-300 mb-2">Step 1: Copy the verification code</p>
                                <div className="bg-white/10 p-4 rounded-lg font-mono text-center border border-white/20 text-lg font-bold text-white">
                                    {verificationStep.code}
                                </div>
                            </div>
                            
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <p className="font-semibold text-purple-300 mb-2">Step 2: Update your profile</p>
                                <p className="text-gray-300">{platformConfigs[verificationStep.platform].verificationText}</p>
                            </div>
                            
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <p className="font-semibold text-green-300 mb-2">Step 3: Verify connection</p>
                                <p className="text-gray-300">Click "Verify" once you've updated your profile.</p>
                            </div>
                        </div>
                        
                        <div className="flex space-x-4 mt-8">
                            <button 
                                onClick={() => setVerificationStep(null)} 
                                disabled={verificationLoading}
                                className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all disabled:opacity-50 border border-white/20"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleVerifyPlatform} 
                                disabled={verificationLoading} 
                                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 transform hover:scale-105 shadow-lg"
                            >
                                {verificationLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Verifying...
                                    </span>
                                ) : (
                                    'Verify Connection'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {confirmDialog && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-white/20">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-bold mb-2 text-white">{confirmDialog.title}</h3>
                            <p className="text-gray-300 text-sm">{confirmDialog.message}</p>
                        </div>
                        
                        <div className="flex space-x-4">
                            <button 
                                onClick={confirmDialog.onCancel}
                                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all border border-white/20"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDialog.onConfirm}
                                className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all border border-red-500/30"
                            >
                                Disconnect
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;