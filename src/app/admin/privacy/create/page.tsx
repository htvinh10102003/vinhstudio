'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link'],
    ['clean']
  ],
};
const formats = ['header', 'bold', 'italic', 'underline', 'list', 'link'];

export default function CreatePrivacyPolicy() {
  const router = useRouter();
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    app_id: '',
    title: 'Privacy Policy',
    slug: '',
    content: ''
  });

  // Lấy danh sách app để đổ vào thẻ <select>
  useEffect(() => {
    const fetchApps = async () => {
      const { data } = await supabase.from('apps').select('id, name');
      if (data && data.length > 0) {
        setApps(data);
        setFormData(prev => ({ ...prev, app_id: data[0].id })); // Chọn app đầu tiên làm mặc định
      }
    };
    fetchApps();
  }, []);

  const generateSlug = (text: string) => {
    return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('privacy_policies').insert([formData]);

    if (error) {
      alert('Lỗi: ' + error.message);
      setLoading(false);
    } else {
      router.push('/admin/privacy'); 
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto pb-24">
      <Link href="/admin/privacy" className="text-gray-500 hover:text-blue-600 mb-6 inline-block">
        &larr; Quay lại
      </Link>
      <h1 className="text-3xl font-bold mb-8">Thêm Chính Sách Bảo Mật</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-6">
        <div>
          <label className="block font-medium mb-2 text-gray-700">Áp dụng cho Ứng dụng:</label>
          <select 
            value={formData.app_id}
            onChange={(e) => setFormData({...formData, app_id: e.target.value})}
            className="w-full border p-3 rounded outline-none"
            required
          >
            <option value="" disabled>-- Chọn ứng dụng --</option>
            {apps.map(app => (
              <option key={app.id} value={app.id}>{app.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-2 text-gray-700">Tiêu đề (Vd: Privacy Policy)</label>
            <input 
              type="text" required value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value, slug: generateSlug(e.target.value)})}
              className="w-full border p-3 rounded outline-none"
            />
          </div>
          <div>
            <label className="block font-medium mb-2 text-gray-700">Đường dẫn (Slug)</label>
            <input 
              type="text" required value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              className="w-full border p-3 rounded bg-gray-50 outline-none"
            />
          </div>
        </div>

        <div className="mb-12">
          <label className="block font-medium mb-2 text-gray-700">Nội dung Chính sách</label>
          <div className="h-96 mb-10">
            <ReactQuill 
              theme="snow" value={formData.content}
              onChange={(content) => setFormData({...formData, content})}
              modules={modules} formats={formats} className="h-full"
            />
          </div>
        </div>

        <button 
          type="submit" disabled={loading || !formData.app_id}
          className="bg-blue-600 text-white px-8 py-3 rounded font-bold hover:bg-blue-700 transition"
        >
          {loading ? 'Đang lưu...' : 'Lưu Chính Sách'}
        </button>
      </form>
    </div>
  );
}