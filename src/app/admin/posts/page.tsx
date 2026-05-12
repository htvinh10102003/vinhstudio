'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import Link from 'next/link';

export default function PostsManager() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    // Lấy toàn bộ bài viết, sắp xếp mới nhất lên đầu
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setPosts(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
    
    await supabase.from('posts').delete().eq('id', id);
    fetchPosts(); // Xóa xong tự động tải lại danh sách
  };

  if (loading) return <div className="p-8">Đang tải dữ liệu...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Bài viết</h1>
        <Link 
          href="/admin/posts/create" 
          className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700"
        >
          + Thêm bài viết
        </Link>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4">Tiêu đề</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Ngày tạo</th>
              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center text-gray-500">Chưa có bài viết nào.</td></tr>
            ) : (
              posts.map(post => (
                <tr key={post.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{post.title}</td>
                  <td className="p-4">
                    {post.is_published ? (
                      <span className="text-green-700 bg-green-100 px-2 py-1 rounded text-sm font-medium">Đã đăng</span>
                    ) : (
                      <span className="text-yellow-700 bg-yellow-100 px-2 py-1 rounded text-sm font-medium">Bản nháp</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(post.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="p-4 space-x-4">
<Link 
  className="text-blue-600 hover:underline" 
  href={`/admin/posts/edit/${post.id}`}
>
  Sửa
</Link>
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:underline"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}