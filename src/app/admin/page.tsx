'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import Link from 'next/link';
import { ShieldCheck, PlusCircle, Pencil, Trash2, Loader2, AlertTriangle, X } from 'lucide-react';

export default function PrivacyAdmin() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State quản lý Popup xóa
  const [deleteModal, setDeleteModal] = useState({ show: false, id: '', name: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPolicies = async () => {
    setLoading(true);
    const { data } = await supabase.from('privacy_policies').select('*').order('created_at', { ascending: false });
    setPolicies(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPolicies(); }, []);

  // Hàm thực thi xóa sau khi đã xác nhận qua Popup
  const confirmDelete = async () => {
    setIsDeleting(true);
    const { error } = await supabase.from('privacy_policies').delete().eq('id', deleteModal.id);
    
    if (error) {
      alert("Lỗi: " + error.message);
    } else {
      setPolicies(policies.filter(p => p.id !== deleteModal.id));
      setDeleteModal({ show: false, id: '', name: '' }); // Đóng popup
    }
    setIsDeleting(false);
  };

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto relative">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Chính sách bảo mật</h1>
          <p className="text-slate-500 font-medium">Quản lý nội dung pháp lý của Vinh Studio.</p>
        </div>
        {/* Nút thêm mới - Check kỹ đường dẫn này ông nhé */}
        <Link href="/admin/privacy/create" className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-extrabold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
          <PlusCircle size={18} /> Thêm mới
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
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
                        {/* Bấm nút này để hiện Popup */}
                        <button 
                          onClick={() => setDeleteModal({ show: true, id: p.id, name: p.app_name })}
                          className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- POPUP XÁC NHẬN XÓA --- */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl transform animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
              <AlertTriangle size={32} />
            </div>
            
            <h3 className="text-xl font-extrabold text-slate-900 text-center mb-2">Xác nhận xóa?</h3>
            <p className="text-slate-500 font-medium text-center mb-8 leading-relaxed">
              Ông có chắc chắn muốn xóa chính sách của <span className="text-slate-900 font-bold">"{deleteModal.name}"</span> không? Hành động này không thể hoàn tác.
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteModal({ show: false, id: '', name: '' })}
                className="flex-1 bg-slate-100 text-slate-900 py-4 rounded-2xl font-extrabold hover:bg-slate-200 transition-all"
              >
                Hủy
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-extrabold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 disabled:bg-red-300"
              >
                {isDeleting ? 'Đang xóa...' : 'Xóa ngay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}