import { supabase } from '@/src/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next'; // Thêm dòng này

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  // Lấy dữ liệu bài viết để làm SEO
  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt')
    .eq('slug', slug)
    .single();

  if (!post) {
    return { title: 'Bài viết không tồn tại' };
  }

  return {
    title: post.title,
    description: post.excerpt || 'Đọc bài viết chi tiết tại Vinh Studio',
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      type: 'article',
    },
  };
}

// 1. Thêm async và định nghĩa params là một Promise
export default async function BlogPostDetail({ params }: { params: Promise<{ slug: string }> }) {
  
  // 2. Giải nén slug bằng await
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // 3. Sử dụng biến slug đã được giải nén để query
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!post) return notFound();

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100">
      <header className="border-b py-4 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="max-w-3xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="text-xl font-black tracking-tighter">
            Vinh <span className="text-blue-600">Studio</span>
          </Link>
          <Link href="/#blog" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition">Blog</Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-16">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-gray-900">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-gray-400 text-sm italic">
            <span>Đăng ngày {new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
            <span>•</span>
            <span className="text-blue-600 font-bold uppercase tracking-widest text-[10px]">Author: Vinh</span>
          </div>
        </header>
        
        {/* Render nội dung với Tailwind Typography */}
        <div 
          className="prose prose-blue prose-lg max-w-none 
                     prose-headings:font-bold prose-headings:tracking-tight
                     prose-img:rounded-3xl prose-img:shadow-xl prose-img:mx-auto"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />

        <footer className="mt-20 pt-10 border-t border-gray-100">
          <Link href="/#blog" className="text-blue-600 font-bold hover:underline flex items-center gap-2">
            ← Quay lại danh sách bài viết
          </Link>
        </footer>
      </article>
    </div>
  );
}