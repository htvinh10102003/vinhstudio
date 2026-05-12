import { supabase } from '@/src/lib/supabase';
import Link from 'next/link';
// Import Icon mới
import { Smartphone, FileText, ShieldCheck, PlusCircle, PenSquare, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';

export default async function AdminDashboard() {
  const { count: appsCount } = await supabase.from('apps').select('*', { count: 'exact', head: true });
  const { count: postsCount } = await supabase.from('posts').select('*', { count: 'exact', head: true });
  const { count: privacyCount } = await supabase.from('privacy_policies').select('*', { count: 'exact', head: true });
  const { data: recentPosts } = await supabase.from('posts').select('id, title, created_at, is_published, slug').order('created_at', { ascending: false }).limit(4);

  return (
    <div className="p-8 md:p-12 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Tổng quan hệ thống</h1>
        <p className="text-slate-500 font-medium">Chào mừng trở lại! Dưới đây là tình trạng hiện tại của Vinh Studio.</p>
      </div>

      {/* --- CÁC THẺ THỐNG KÊ (METRICS CARDS) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Smartphone size={24} strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-slate-900 tracking-tight">{appsCount || 0}</p>
            <p className="text-slate-500 font-bold text-sm mt-1">Dự án Ứng dụng</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <FileText size={24} strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-slate-900 tracking-tight">{postsCount || 0}</p>
            <p className="text-slate-500 font-bold text-sm mt-1">Bài viết Blog</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={24} strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <p className="text-4xl font-extrabold text-slate-900 tracking-tight">{privacyCount || 0}</p>
            <p className="text-slate-500 font-bold text-sm mt-1">Chính sách bảo mật</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* --- KHU VỰC BÀI VIẾT GẦN ĐÂY --- */}
        <div className="xl:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-extrabold text-slate-900">Bài viết mới nhất</h2>
            <Link href="/admin/posts" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group">
              Xem tất cả <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentPosts?.map((post: any) => (
              <div key={post.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-5 bg-[#F8FAFC] rounded-[1.5rem] hover:bg-slate-50 transition-colors border border-slate-100">
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-slate-900 truncate pr-4">{post.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1.5">
                    <span className="flex items-center gap-1"><Clock size={12} /> {new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {post.is_published ? (
                    <span className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest">
                      <CheckCircle2 size={12} /> Đã xuất bản
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 bg-amber-100 text-amber-700 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest">
                      <FileText size={12} /> Bản nháp
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- KHU VỰC TẠO NHANH (QUICK ACTIONS) --- */}
        <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl shadow-slate-900/10 flex flex-col relative overflow-hidden">
          {/* Gradient trang trí góc */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full"></div>
          
          <h2 className="text-2xl font-extrabold mb-3 relative z-10">Tạo mới</h2>
          <p className="text-slate-400 font-medium text-sm mb-8 relative z-10 leading-relaxed">
            Phím tắt giúp ông thao tác nhanh chóng với hệ thống.
          </p>
          
          <div className="space-y-3 relative z-10 mt-auto">
            <Link 
              href="/admin/apps/create" 
              className="w-full bg-white text-slate-900 px-6 py-4 rounded-2xl font-extrabold flex items-center justify-between hover:scale-[1.02] transition-transform"
            >
              <span className="flex items-center gap-3"><PlusCircle size={20} className="text-blue-600" /> Thêm Ứng dụng</span>
            </Link>
            
            <Link 
              href="/admin/posts/create" 
              className="w-full bg-slate-800 text-white border border-slate-700 px-6 py-4 rounded-2xl font-extrabold flex items-center justify-between hover:bg-slate-700 transition-colors"
            >
              <span className="flex items-center gap-3"><PenSquare size={20} className="text-emerald-400" /> Viết Blog</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}