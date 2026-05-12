import { supabase } from '@/src/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 1. Chuyển hàm thành async và định nghĩa params là một Promise
export default async function PrivacyPolicyDetail({ params }: { params: Promise<{ slug: string }> }) {
  
  // 2. Giải nén slug bằng await
  const { slug } = await params;

  // 3. Sử dụng biến slug đã giải nén để query
  const { data: policy } = await supabase
    .from('privacy_policies')
    .select('*, apps(name)')
    .eq('slug', slug)
    .single();

  if (!policy) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-blue-200">
      <header className="bg-white border-b py-4">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/" className="text-xl font-black text-gray-800 hover:text-blue-600 transition">
            Vinh Studio
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{policy.title}</h1>
          <p className="text-gray-500 mb-8 pb-8 border-b">
            Áp dụng cho ứng dụng: <span className="font-bold text-gray-800">{policy?.apps?.name}</span> <br/>
            Cập nhật lần cuối: {new Date(policy.updated_at).toLocaleDateString('vi-VN')}
          </p>
          
          <div 
  className="prose prose-blue max-w-none text-gray-700 
             prose-headings:text-gray-900 prose-strong:text-gray-900
             break-words overflow-hidden" // Thêm 2 class này để ép chữ phải xuống hàng
  dangerouslySetInnerHTML={{ __html: policy.content }} 
/>
        </div>
      </main>
      
      <footer className="text-center py-8 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Vinh Studio.
      </footer>
    </div>
  );
}