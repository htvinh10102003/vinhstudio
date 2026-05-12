'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import Link from 'next/link';

export default function AppsManager() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    const { data } = await supabase
      .from('apps')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setApps(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa ứng dụng này?')) return;
    
    await supabase.from('apps').delete().eq('id', id);
    fetchApps(); 
  };

  if (loading) return <div className="p-8">Đang tải dữ liệu...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Quản lý Ứng dụng</h1>
        <Link 
          href="/admin/apps/create" 
          className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700"
        >
          + Thêm ứng dụng
        </Link>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4">Tên Ứng dụng</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Liên kết</th>
              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {apps.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center text-gray-500">Chưa có ứng dụng nào.</td></tr>
            ) : (
              apps.map(app => (
                <tr key={app.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-blue-600">{app.name}</td>
                  <td className="p-4">
                    {app.testing_status === 'production' && <span className="text-green-700 bg-green-100 px-2 py-1 rounded text-sm">Đã phát hành</span>}
                    {app.testing_status === 'internal_testing' && <span className="text-purple-700 bg-purple-100 px-2 py-1 rounded text-sm">Đang Test nội bộ</span>}
                    {app.testing_status === 'development' && <span className="text-gray-700 bg-gray-200 px-2 py-1 rounded text-sm">Đang phát triển</span>}
                  </td>
                  <td className="p-4 space-x-3 text-sm">
                    {app.play_store_url && <a href={app.play_store_url} target="_blank" className="text-blue-500 hover:underline">Play Store</a>}
                    {app.repository_url && <a href={app.repository_url} target="_blank" className="text-gray-600 hover:underline">Github</a>}
                  </td>
                  <td className="p-4 space-x-4">
<Link href={`/admin/apps/edit/${app.id}`} className="text-blue-600 hover:underline">
  Sửa
</Link>                    <button onClick={() => handleDelete(app.id)} className="text-red-600 hover:underline">Xóa</button>
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