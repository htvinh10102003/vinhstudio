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
    .maybeSingle();

  if (error || !policy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-50/30 flex items-start justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl p-6 sm:p-10 rounded-[2.5rem] shadow-2xl shadow-rose-200/30 ring-1 ring-rose-100 mt-10 sm:mt-20 transition-all">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">🚨</span>
            <h1 className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight">
              Bắt được lỗi rồi!
            </h1>
          </div>
          <p className="text-slate-600 font-medium mb-4 text-sm sm:text-base">
            Đang tìm chính sách với slug: <strong className="inline-block bg-slate-100 text-slate-900 px-3 py-1 rounded-xl font-mono text-sm">{slug}</strong>
          </p>
          <div className="bg-rose-50/80 p-4 sm:p-5 rounded-2xl ring-1 ring-rose-100 text-sm font-mono text-rose-800 whitespace-pre-wrap break-all overflow-auto max-h-64">
            {error ? JSON.stringify(error, null, 2) : 'Không có data trả về (Lỗi: Data = null)'}
          </div>
          <p className="mt-6 text-sm text-slate-500 italic flex items-center gap-2">
            <span className="text-base">📸</span> Ông chụp lại cái bảng lỗi màu đỏ ở trên gửi lên đây tôi xem nhé!
          </p>
        </div>
      </div>
    );
  }

  // Giao diện chính (đã được làm đẹp & responsive)
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-[30rem] h-[30rem] bg-blue-50 rounded-full blur-3xl opacity-40" />
        <div className="absolute -bottom-20 -left-20 w-[25rem] h-[25rem] bg-indigo-50 rounded-full blur-3xl opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
      </div>

      {/* Navigation */}
      <nav className="w-full bg-white/70 backdrop-blur-2xl border-b border-slate-200/60 sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="text-xl sm:text-2xl font-black tracking-tight select-none">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              VINH<span className="text-slate-900">.STUDIO</span>
            </span>
          </Link>
          <Link
            href="/"
            className="group flex items-center gap-1.5 text-sm sm:text-base font-semibold text-slate-500 hover:text-blue-600 transition-all duration-200"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại trang chủ
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <article className="bg-white/90 backdrop-blur-sm rounded-[2.5rem] sm:rounded-[3rem] p-5 sm:p-8 lg:p-12 shadow-xl shadow-slate-200/60 ring-1 ring-slate-200/70 transition-all">
          {/* Header section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 mb-8 sm:mb-12 pb-8 border-b border-slate-100">
            {policy.apps?.icon_url && (
              <div className="flex-shrink-0 relative">
                <img
                  src={policy.apps.icon_url}
                  alt={`${policy.apps?.name || 'App'} icon`}
                  className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl sm:rounded-[1.75rem] object-cover shadow-md ring-1 ring-slate-200/60 transition-transform hover:scale-105"
                />
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-[2rem] -z-10 blur-md" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight text-slate-900 mb-2 leading-tight">
                {policy.title}
              </h1>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-widest">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Cập nhật lần cuối: {new Date(policy.created_at).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              {policy.apps?.name && (
                <p className="mt-1.5 text-sm sm:text-base text-slate-400 font-medium">
                  Ứng dụng: <span className="text-slate-700 font-semibold">{policy.apps.name}</span>
                </p>
              )}
            </div>
          </div>

          {/* Policy content */}
          <div
            className="
              prose prose-slate max-w-none
              prose-headings:font-extrabold prose-headings:tracking-tight 
              prose-h2:text-xl sm:prose-h2:text-2xl lg:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-sm sm:prose-p:text-base lg:prose-p:text-lg prose-p:leading-relaxed
              prose-a:text-blue-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:text-blue-700 hover:prose-a:underline
              prose-strong:text-slate-900 prose-strong:font-bold
              prose-li:text-sm sm:prose-li:text-base lg:prose-li:text-lg
              prose-img:rounded-2xl prose-img:shadow-md
              prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:text-slate-700
              [&_ul]:list-disc [&_ol]:list-decimal
              [&_ul_li::marker]:text-blue-500 [&_ol_li::marker]:text-blue-600
            "
            dangerouslySetInnerHTML={{ __html: policy.content }}
          />
        </article>
      </main>
    </div>
  );
}