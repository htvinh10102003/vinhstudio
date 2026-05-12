'use client';

import { useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State cho thông báo Popup
  const [modal, setModal] = useState({ show: false, message: '', type: 'error' });
  
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Hiện thông báo lỗi và DỪNG loading
      setModal({ show: true, message: 'Sai tài khoản hoặc mật khẩu rồi Vinh ơi!', type: 'error' });
      setLoading(false); 
    } else {
      // Hiện thông báo thành công
      setModal({ show: true, message: 'Đăng nhập thành công! Đang vào hệ thống...', type: 'success' });
      
      setTimeout(() => {
        window.location.href = '/admin'; // Tải lại cứng toàn bộ trang
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 font-sans relative">
      
      {/* --- MODAL POPUP --- */}
      {modal.show && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-gray-100 text-center scale-in-center">
            <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl ${
              modal.type === 'success' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {modal.type === 'success' ? '✅' : '❌'}
            </div>
            <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">
              {modal.type === 'success' ? 'Tuyệt vời' : 'Ối giời ơi'}
            </h3>
            <p className="text-gray-500 font-medium mb-6 text-sm">{modal.message}</p>
            
            {modal.type === 'error' && (
              <button 
                onClick={() => setModal({ ...modal, show: false })}
                className="w-full bg-slate-900 text-white font-black py-3 rounded-xl uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-all"
              >
                Thử lại xem nào
              </button>
            )}
          </div>
        </div>
      )}

      {/* --- FORM ĐĂNG NHẬP --- */}
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10 border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            Vinh <span className="text-blue-600">Studio</span>
          </h1>
          <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em] mt-3">
            Admin Portal Access
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
              Email Address
            </label>
            <input 
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-gray-50 bg-gray-50 p-4 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
              placeholder="vinh@studio.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
              Password
            </label>
            <input 
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-gray-50 bg-gray-50 p-4 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" disabled={loading}
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/10 uppercase tracking-widest text-xs mt-4 disabled:bg-gray-200"
          >
            {loading ? 'Đang xác thực...' : 'Vào hệ thống'}
          </button>
        </form>
      </div>
    </div>
  );
}