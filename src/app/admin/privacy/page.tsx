'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import Link from 'next/link';
import { ShieldCheck, PlusCircle, Pencil, Trash2, Loader2 } from 'lucide-react';

export default function PrivacyAdmin() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách
  const fetchPolicies = async () => {
    setLoading(true);
const { data } = await supabase.from('privacy_policies').select('*, apps(name)').order('created_at', { ascending: false });    setPolicies(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPolicies(); }, []);

  // Hàm XÓA
  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Ông có chắc muốn xóa chính sách của "${name}" không?`)) {
      const { error } = await supabase.from('privacy_policies').delete().eq('id', id);
      if (error) {
        alert("Lỗi rồi: " + error.message);
      } else {
        // Cập nhật lại danh sách tại chỗ cho nhanh
        setPolicies(policies.filter(p => p.id !== id));
      }
    }
  };

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Chính sách bảo mật</h1>
          <p className="text-slate-500 font-medium">Quản lý nội dung pháp lý cho các ứng dụng.</p>
        </div>
        <Link href="/admin/privacy/create" className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-extrabold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
          <PlusCircle size={18} /> Thêm mới
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Tên ứng dụng</th>
                <th className="px-8 py-5 text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Ngày tạo</th>
                <th className="px-8 py-5 text-[11px] font-extrabold uppercase tracking-widest text-slate-400 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {policies.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><ShieldCheck size={16} /></div>
                      <span className="font-bold text-slate-900">{p.app_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-slate-500 font-medium text-sm">
                    {new Date(p.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/privacy/edit/${p.id}`} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                        <Pencil size={18} />
                      </Link>
                      <button onClick={() => handleDelete(p.id, p.app_name)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}