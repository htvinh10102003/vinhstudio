import { supabase } from '@/src/lib/supabase';
import Link from 'next/link';

export const revalidate = 0;

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const { data: policy, error } = await supabase
    .from('privacy_policies')
    .select('*, apps(name, icon_url)')
    .eq('slug', slug)
    .single();

  // --- TRẠM BẮT LỖI (DEBUG MODE) ---
  if (error || !policy) {
    return (
      <div className="min-h-screen bg-slate-50 p-10 flex items-start justify-center">
        <div className="w-full max-w-2xl bg-white p-8 rounded-[2rem] shadow-xl border border-red-100 mt-20">
          <h1 className="text-2xl font-extrabold text-red-600 mb-4 flex items-center gap-2">
            🚨 Bắt được lỗi rồi!
          </h1>
          <p className="text-slate-600 font-medium mb-4">
            Đang tìm chính sách với slug là: <strong className="text-slate-900 bg-slate-100 px-2 py-1 rounded">{slug}</strong>
          </p>
          
          <div className="bg-red-50 p-4 rounded-2xl border border-red-100 text-sm font-mono text-red-800 whitespace-pre-wrap">
            {error ? JSON.stringify(error, null, 2) : 'Không có data trả về (Lỗi: Data = null)'}
          </div>
          
          <p className="mt-6 text-sm text-slate-500 italic">
            *Ông chụp lại cái bảng lỗi màu đỏ ở trên gửi lên đây tôi xem nhé!
          </p>
        </div>
      </div>
    );
  }

  // --- NẾU KHÔNG CÓ LỖI THÌ HIỂN THỊ BÌNH THƯỜNG ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <nav className="w-full bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            VINH<span className="text-blue-600">.STUDIO</span>
          </Link>
          <Link href="/" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
            &larr; Quay lại trang chủ
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-200/20">
          <div className="flex items-center gap-6 mb-10 pb-10 border-b border-slate-100">
            {policy.apps?.icon_url && (
              <img 
                src={policy.apps.icon_url} 
                alt="App Icon" 
                className="w-20 h-20 rounded-2xl object-cover shadow-sm border border-slate-100" 
              />
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
                {policy.title}
              </h1>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                Cập nhật lần cuối: {new Date(policy.created_at).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>

          <div 
            className="prose prose-slate prose-blue max-w-none prose-headings:font-extrabold prose-h2:text-2xl prose-a:text-blue-600 hover:prose-a:text-blue-700"
            dangerouslySetInnerHTML={{ __html: policy.content }}
          />
        </div>
      </div>
    </div>
  );
}