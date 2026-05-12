'use client';

import { useState, useMemo, useRef } from 'react';
import { supabase } from '@/src/lib/supabase'; // Đã sửa theo ý bạn
import { uploadFile } from '@/src/lib/upload'; // Đã sửa theo ý bạn
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function CreatePost() {
  const router = useRouter();
  const quillRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    is_published: false
  });

  // --- XỬ LÝ UPLOAD ẢNH TRONG BÀI VIẾT ---
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          // Upload lên bucket 'blog' mà chúng ta đã tạo
          const url = await uploadFile(file, 'blog');
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();
          // Chèn link ảnh từ Supabase vào đúng vị trí con trỏ
          quill.insertEmbed(range.index, 'image', url);
        } catch (error: any) {
          alert('Lỗi upload ảnh bài viết: ' + error.message);
        }
      }
    };
  };

  // Cấu hình Toolbar (Dùng useMemo để tránh việc editor bị reset khi gõ)
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler // Ghi đè hàm xử lý ảnh mặc định bằng hàm của mình
      }
    }
  }), []);

  const generateSlug = (text: string) => {
    return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/^-+|-+$/g, ''); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('posts').insert([formData]);
    if (error) {
      alert('Lỗi: ' + error.message);
      setLoading(false);
    } else {
      router.push('/admin/posts'); 
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto pb-24">
      <Link href="/admin/posts" className="text-gray-500 hover:text-blue-600 mb-6 inline-block">&larr; Quay lại</Link>
      <h1 className="text-3xl font-bold mb-8">Viết Blog Mới</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow border space-y-6">
        <div>
          <label className="block font-bold mb-2 text-gray-700">Tiêu đề bài viết</label>
          <input 
            type="text" required value={formData.title} 
            onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })}
            className="w-full border p-3 rounded-lg outline-none text-lg font-bold focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block font-bold mb-2 text-gray-700">Mô tả ngắn (Excerpt)</label>
          <textarea 
            rows={2} value={formData.excerpt}
            onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
            className="w-full border p-3 rounded-lg outline-none"
          />
        </div>

        <div className="mb-12">
          <label className="block font-bold mb-2 text-gray-700">Nội dung chi tiết</label>
          <div className="h-[500px] mb-12">
            //@ts-ignore
            <ReactQuill 
              ref={quillRef}
              theme="snow"
              value={formData.content}
              onChange={(val) => setFormData({ ...formData, content: val })}
              modules={modules}
              className="h-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-6 border-t">
          <input 
            type="checkbox" checked={formData.is_published}
            onChange={(e) => setFormData({...formData, is_published: e.target.checked})}
            className="w-5 h-5 cursor-pointer"
          />
          <label className="font-semibold text-gray-700 cursor-pointer">Xuất bản bài viết</label>
        </div>

        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-10 py-3 rounded-lg font-bold hover:bg-blue-700">
          {loading ? 'Đang lưu...' : 'Lưu bài viết'}
        </button>
      </form>
    </div>
  );
}