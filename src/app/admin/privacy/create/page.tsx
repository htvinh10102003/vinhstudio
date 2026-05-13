'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, CheckCircle2, XCircle, ChevronDown } from 'lucide-react';

// Hàm nhỏ xíu để biến chữ có dấu thành đường dẫn không dấu (VD: "App Của Tôi" -> "app-cua-toi")
const generateSlug = (text: string) => {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

export default function CreatePrivacy() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apps, setApps] = useState<any[]>([]); 
  const [fetchingApps, setFetchingApps] = useState(true);
  
  // Dữ liệu form phải khớp 100% với các cột trong DB của ông
  const [formData, setFormData] = useState({ app_id: '', title: '', content: '' });
  const [popup, setPopup] = useState({ show: false, type: 'success', message: '' });

  // Lấy danh sách App (lấy cả id và name)
  useEffect(() => {
    const fetchApps = async () => {
      const { data } = await supabase.from('apps').select('id, name').order('name');
      if (data) setApps(data);
      setFetchingApps(false);
    };
    fetchApps();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.app_id) {
      alert("Ông chưa chọn App kìa!");
      return;
    }
    setLoading(true);

    // Tự động tạo slug từ title
    const slug = generateSlug(formData.title);

    // Lưu vào DB đúng với tên cột ông có
    const { error } = await supabase
      .from('privacy_policies')
      .insert([{ 
        app_id: formData.app_id, 
        title: formData.title,
        slug: slug,
        content: formData.content 
      }]);

    setLoading(false);

    if (error) {
      setPopup({ show: true, type: 'error', message: 'Lỗi rùi: ' + error.message });
    } else {
      setPopup({ show: true, type: 'success', message: 'Thêm chính sách ngon lành!' });
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
          
          {/* CHỌN APP */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-3">Ứng dụng</label>
            <div className="relative group">
              <select 
                required
                className="w-full appearance-none border-2 border-slate-50 bg-slate-50 p-4 pr-12 rounded-2xl outline-none focus:border-blue-500 transition-all font-bold text-slate-900 cursor-pointer"
                value={formData.app_id}
                onChange={(e) => setFormData({...formData, app_id: e.target.value})}
              >
                <option value="">-- Bấm để chọn App --</option>
                {fetchingApps ? (
                  <option disabled>Đang tải danh sách...</option>
                ) : (
                  apps.map((app) => (
                    // Hiển thị name nhưng lưu id
                    <option key={app.id} value={app.id}>{app.name}</option> 
                  ))
                )}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown size={20} />
              </div>
            </div>
          </div>

          {/* NHẬP TITLE */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-3">Tiêu đề chính sách (Title)</label>
            <input 
              required 
              placeholder="VD: Chính sách bảo mật Vinh Studio Keyboard"
              className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl outline-none focus:border-blue-500 font-bold text-slate-900"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
            <p className="text-xs text-slate-400 mt-2 font-medium">Đường dẫn sẽ được tạo tự động: /privacy/{formData.title ? generateSlug(formData.title) : '...'}</p>
          </div>

          {/* NHẬP CONTENT */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-3">Nội dung (HTML)</label>
            <textarea 
              required 
              rows={12}
              className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl outline-none focus:border-blue-500 font-medium text-slate-700"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            />
          </div>

          <button type="submit" disabled={loading || fetchingApps} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-extrabold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Lưu chính sách
          </button>
        </div>
      </form>

      {/* POPUP GIỮ NGUYÊN */}
      {popup.show && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
         <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center transform animate-in zoom-in-95 duration-300">
           <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${popup.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
             {popup.type === 'success' ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
           </div>
           <h3 className="text-xl font-extrabold text-slate-900 mb-2">
             {popup.type === 'success' ? 'Ngon lành!' : 'Có biến rồi!'}
           </h3>
           <p className="text-slate-500 font-medium mb-8 leading-relaxed">
             {popup.message}
           </p>
           {popup.type === 'error' && (
             <button onClick={() => setPopup({ ...popup, show: false })} className="w-full bg-slate-100 text-slate-900 py-4 rounded-2xl font-extrabold">
               Thử lại xem sao
             </button>
           )}
         </div>
       </div>
      )}
    </div>
  );
}