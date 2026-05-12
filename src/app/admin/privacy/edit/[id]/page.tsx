'use client';

import { useState, useEffect, use } from 'react';
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

export default function EditPrivacyPolicy({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const router = useRouter();
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    app_id: '',
    title: '',
    slug: '',
    content: ''
  });

  useEffect(() => {
    // Tải cả danh sách App và dữ liệu Policy cùng lúc
    const loadData = async () => {
      const [appsRes, policyRes] = await Promise.all([
        supabase.from('apps').select('id, name'),
        supabase.from('privacy_policies').select('*').eq('id', id).single()
      ]);

      if (appsRes.data) setApps(appsRes.data);
      if (policyRes.data) {
        setFormData(policyRes.data);
      } else {
        alert('Không tìm thấy chính sách!');
        router.push('/admin/privacy');
      }
      setFetching(false);
    };
    
    loadData();
  }, [id, router]);

  const generateSlug = (text: string) => {
    return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/^-+|-+$/g, ''); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('privacy_policies')
      .update({
        ...formData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      alert('Lỗi: ' + error.message);
      setLoading(false);
    } else {
      router.push('/admin/privacy'); 
    }
  };

  if (fetching) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto pb-24">
      <Link href="/admin/privacy" className="text-gray-500 hover:text-blue-600 mb-6 inline-block">&larr; Quay lại</Link>
      <h1 className="text-3xl font-bold mb-8 text-blue-600">Sửa Chính Sách Bảo Mật</h1>

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
            <label className="block font-medium mb-2 text-gray-700">Tiêu đề</label>
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
          {loading ? 'Đang cập nhật...' : 'Cập nhật Chính Sách'}
        </button>
      </form>
    </div>
  );
}