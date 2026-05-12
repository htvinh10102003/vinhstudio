'use client';

import { useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function CreatePrivacy() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ app_name: '', content: '' });
  
  // State quản lý Popup thay vì Toast
  const [popup, setPopup] = useState({ show: false, type: 'success', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('privacy_policies')
      .insert([{ app_name: formData.app_name, content: formData.content }]);

    setLoading(false);

    if (error) {
      setPopup({
        show: true,
        type: 'error',
        message: 'Lỗi rồi ông ơi: ' + error.message
      });
    } else {
      setPopup({
        show: true,
        type: 'success',
        message: 'Đã thêm chính sách mới thành công rực rỡ!'
      });
      // Hiện popup 2 giây cho đẹp rồi mới té
      setTimeout(() => {
        router.push('/admin/privacy');
        router.refresh();
      }, 2000);
    }
  };

  return (
    <div className="p-8 md:p-12 max-w-4xl mx-auto relative">
      <Link href="/admin/privacy" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 mb-6 transition-colors">
        <ArrowLeft size={16} /> Quay lại danh sách
      </Link>
      
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8 tracking-tight">Thêm chính sách mới</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-3">Tên ứng dụng</label>
            <input 
              required 
              placeholder="VD: App Sticker Vinh Studio..."
              className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-900"
              value={formData.app_name}
              onChange={(e) => setFormData({...formData, app_name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-3">Nội dung (HTML)</label>
            <textarea 
              required 
              rows={12}
              placeholder="Dán nội dung chính sách vào đây..."
              className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-700"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-extrabold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all disabled:bg-slate-200 shadow-xl shadow-slate-900/10"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {loading ? 'Đang xử lý...' : 'Lưu chính sách'}
          </button>
        </div>
      </form>

      {/* --- PHẦN POPUP (MODAL) --- */}
      {popup.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center transform animate-in zoom-in-95 duration-300">
            <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${popup.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
              {popup.type === 'success' ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              {popup.type === 'success' ? 'Ngon lành!' : 'Úi, có lỗi!'}
            </h3>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
              {popup.message}
            </p>
            {popup.type === 'error' && (
              <button 
                onClick={() => setPopup({ ...popup, show: false })}
                className="w-full bg-slate-100 text-slate-900 py-4 rounded-2xl font-extrabold hover:bg-slate-200 transition-all"
              >
                Đóng để kiểm tra lại
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}