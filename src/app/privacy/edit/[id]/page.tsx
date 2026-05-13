'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export default function EditPrivacy() {
  const router = useRouter();
  const { id } = useParams(); // Lấy ID từ URL
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({ app_name: '', content: '' });

  // Lấy dữ liệu cũ
  useEffect(() => {
    const fetchDetail = async () => {
      const { data } = await supabase.from('privacy_policies').select('*').eq('id', id).single();
      if (data) setFormData({ app_name: data.app_name, content: data.content });
      setFetching(false);
    };
    fetchDetail();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('privacy_policies').update(formData).eq('id', id);
    
    if (error) {
      alert("Lỗi: " + error.message);
      setLoading(false);
    } else {
      router.push('/privacy');
      router.refresh();
    }
  };

  if (fetching) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;

  return (
    <div className="p-8 md:p-12 max-w-4xl mx-auto">
      <Link href="/privacy" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 mb-6">
        <ArrowLeft size={16} /> Quay lại
      </Link>
      
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Sửa chính sách</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Tên ứng dụng</label>
            <input 
              required 
              className="w-full border-2 border-slate-100 bg-slate-50 p-4 rounded-2xl outline-none focus:border-blue-500 font-bold"
              value={formData.app_name}
              onChange={(e) => setFormData({...formData, app_name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Nội dung chính sách (HTML)</label>
            <textarea 
              required 
              rows={15}
              className="w-full border-2 border-slate-100 bg-slate-50 p-4 rounded-2xl outline-none focus:border-blue-500 font-medium"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-extrabold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all disabled:bg-slate-300"
          >
            <Save size={20} /> {loading ? 'Đang cập nhật...' : 'Cập nhật ngay'}
          </button>
        </div>
      </form>
    </div>
  );
}