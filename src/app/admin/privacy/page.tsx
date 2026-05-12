'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import Link from 'next/link';

export default function PrivacyManager() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicies = async () => {
      const { data } = await supabase
        .from('privacy_policies')
        .select('*, apps(name)'); // Lấy kèm tên App từ bảng apps
      if (data) setPolicies(data);
      setLoading(false);
    };
    fetchPolicies();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Chính sách bảo mật</h1>
        <Link href="/admin/privacy/create" className="bg-blue-600 text-white px-4 py-2 rounded font-bold">
          + Tạo mới Policy
        </Link>
      </div>

      <div className="bg-white rounded shadow border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Tên Policy</th>
              <th className="p-4">Thuộc Ứng dụng</th>
              <th className="p-4">Đường dẫn Public</th>
              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {policies.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{p.title}</td>
                <td className="p-4 text-blue-600 font-medium">{p.apps?.name || 'N/A'}</td>
                <td className="p-4 text-sm text-gray-500 italic">/privacy/{p.slug}</td>
                <td className="p-4">
<Link className="text-blue-600 hover:underline mr-4" href="{/admin/privacy/edit/${p.id}}">Sửa</Link>                  <button className="text-red-600 hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}