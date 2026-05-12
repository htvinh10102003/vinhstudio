'use client';

import { useState, useEffect, use, useMemo, useRef } from 'react';
import { supabase } from '@/src/lib/supabase';
import { uploadFile } from '@/src/lib/upload';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function EditPost({ params }: { params: Promise<{ id: string }> }) {
  // Giải nén ID từ params (Next.js 15)
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const router = useRouter();
  const quillRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    is_published: false
  });

  // 1. TẢI DỮ LIỆU CŨ CỦA BÀI VIẾT
  useEffect(() => {
    const fetchPostDetail = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setFormData(data);
      } else if (error) {
        alert('Không tìm thấy bài viết này!');
        router.push('/admin/posts');
      }
      setFetching(false);
    };
    fetchPostDetail();
  }, [id, router]);

  // 2. XỬ LÝ UPLOAD ẢNH TRONG BỘ GÕ
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          const url = await uploadFile(file, 'blog');
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          quill.insertEmbed(range.index, 'image', url);
        } catch (error: any) {
          alert('Lỗi upload ảnh: ' + error.message);
        }
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: { image: imageHandler }
    }
  }), []);

  const generateSlug = (text: string) => {
    return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/^-+|-+$/g, ''); 
  };

  // 3. LƯU THAY ĐỔI
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase
      .from('posts')
      .update({
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        is_published: formData.is_published,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      alert('Lỗi khi cập nhật: ' + error.message);
      setLoading(false);
    } else {
      router.push('/admin/posts'); 
    }
  };

  if (fetching) return <div className="p-10 text-center text-gray-500 italic">Đang lấy dữ liệu bài viết...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto pb-24">
      <Link href="/admin/posts" className="text-gray-500 hover:text-blue-600 mb-6 inline-block">
        &larr; Quay lại danh sách
      </Link>
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Sửa Bài Viết</h1>
        <div className="text-sm text-gray-400 font-mono">ID: {id}</div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div>
          <label className="block font-bold mb-2 text-gray-700">Tiêu đề bài viết</label>
          <input 
            type="text" required value={formData.title} 
            onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })}
            className="w-full border p-3 rounded-xl outline-none text-xl font-bold focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-2 text-gray-700">Đường dẫn (Slug)</label>
            <input 
              type="text" required value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              className="w-full border p-3 rounded-xl bg-gray-50 text-gray-500 outline-none"
            />
          </div>
          <div className="flex items-center gap-2 md:pt-8">
            <input 
              type="checkbox" id="is_published"
              checked={formData.is_published}
              onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
              className="w-5 h-5 cursor-pointer accent-blue-600"
            />
            <label htmlFor="is_published" className="font-bold text-gray-700 cursor-pointer">Xuất bản bài viết</label>
          </div>
        </div>

        <div>
          <label className="block font-bold mb-2 text-gray-700">Đoạn trích ngắn</label>
          <textarea 
            rows={2} value={formData.excerpt || ''}
            onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
            className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Mô tả tóm tắt nội dung bài viết..."
          />
        </div>

        <div>
          <label className="block font-bold mb-2 text-gray-700">Nội dung chi tiết</label>
          <div className="h-[500px] mb-12">
            <ReactQuill 
              ref={quillRef}
              theme="snow"
              value={formData.content}
              onChange={(val) => setFormData({ ...formData, content: val })}
              modules={modules}
              className="h-full rounded-xl overflow-hidden"
            />
          </div>
        </div>

        <div className="pt-6 border-t flex gap-4">
          <button 
            type="submit" disabled={loading}
            className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-gray-300"
          >
            {loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
          </button>
          <Link href="/admin/posts" className="px-10 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all">
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}