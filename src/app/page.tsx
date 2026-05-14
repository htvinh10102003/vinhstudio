import Link from 'next/link';
import { supabase } from '@/src/lib/supabase';
import ProjectGrid from '@/src/components/ProjectGrid';
import { Analytics } from "@vercel/analytics/next"

export const revalidate = 0;

// 1. Lấy dữ liệu Ứng dụng
async function getApps() {
  const { data } = await supabase
    .from('apps')
    .select('*, privacy_policies(slug)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  return data || [];
}

// 2. Lấy dữ liệu Bài viết
async function getPosts() {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(6);
  return data || [];
}

// 3. Dữ liệu Đội ngũ
const teamMembers = [
  {
    id: 1,
    name: "Hồ Tá Vinh",
    role: "Founder & Lead Developer",
    image: "https://i.ibb.co/FqmzNWNy/1767303410837-1.jpg",
    description: "Chuyên gia phát triển ứng dụng di động, tập trung vào kiến trúc hệ thống và tối ưu hóa trải nghiệm người dùng."
  },
];

export default async function Home() {
  const apps = await getApps();
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden relative text-slate-900">
      
      {/* Background Gradient rực rỡ ẩn phía sau */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-br from-blue-100 via-indigo-50 to-white -z-10 blur-3xl opacity-70"></div>

      {/* --- NAVBAR KÍNH MỜ --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-md border-b border-white/40 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold tracking-tight text-slate-900">
            VINH<span className="text-blue-600">.STUDIO</span>
          </Link>
          <div className="hidden md:flex gap-8 text-sm font-bold text-slate-500">
            <Link href="#apps" className="hover:text-blue-600 transition-colors">Dự án</Link>
            <Link href="#team" className="hover:text-blue-600 transition-colors">Đội ngũ</Link>
            <Link href="#blog" className="hover:text-blue-600 transition-colors">Blog</Link>
          </div>
          <Link href="mailto:contact.vinhstudio@gmail.com" className="hidden md:block bg-slate-900 text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-blue-600 transition-all shadow-md shadow-slate-900/10">
            Liên hệ ngay
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-40 pb-20 px-6 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-blue-50 border border-blue-100 text-blue-600 font-bold px-4 py-1.5 rounded-full text-xs mb-6 tracking-wide uppercase">
            🚀 Khởi tạo giải pháp di động
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 leading-[1.1]">
            Chế tác trải nghiệm <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              hoàn hảo đến từng pixel.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed mb-10">
            Freelance Mobile Application Developer tại Hà Nội. Chuyên gia biến ý tưởng phức tạp thành những ứng dụng mượt mà, tối ưu và thân thiện.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#apps" className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 hover:-translate-y-1 transition-all shadow-lg shadow-slate-900/20">
              Khám phá dự án
            </a>
          </div>
        </div>
      </section>

      {/* --- APPS SECTION --- */}
      <section id="apps" className="max-w-6xl mx-auto px-6 py-24">
        <div className="mb-16 md:text-center">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">Sản phẩm nổi bật</h2>
          <p className="text-slate-500 font-medium mt-4 max-w-xl mx-auto">Những ứng dụng và công cụ được xây dựng với sự tỉ mỉ, tối ưu hóa cho người dùng cuối.</p>
        </div>

        <ProjectGrid apps={apps} />
      </section>

      {/* --- TEAM SECTION (SLIDER MƯỢT - NỀN SÁNG) --- */}
      <section id="team" className="py-24 bg-white border-y border-slate-100 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-sm font-extrabold text-blue-600 uppercase tracking-widest mb-2">Đội ngũ nòng cốt</h2>
              <p className="text-4xl font-extrabold tracking-tight text-slate-900">Vinh Studio Team</p>
            </div>
            <div className="hidden md:flex gap-2">
              <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400">←</div>
              <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-900 bg-slate-50">→</div>
            </div>
          </div>
        </div>

        <div className="w-full px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {teamMembers.map((member) => (
                <div key={member.id} className="min-w-[85vw] md:min-w-[380px] snap-center bg-[#F8FAFC] border border-slate-200 p-8 rounded-[2.5rem] hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group cursor-grab active:cursor-grabbing">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="relative">
                      <img src={member.image} alt={member.name} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform" />
                      <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold tracking-tight text-slate-900">{member.name}</h3>
                      <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mt-1">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-slate-500 font-medium leading-relaxed text-sm">
                    {member.description}
                  </p>
                </div>
              ))}

              {/* Thẻ Tuyển dụng */}
              <div className="min-w-[85vw] md:min-w-[380px] snap-center bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-lg flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-800 transition-colors duration-300">
                <div className="text-4xl mb-4 opacity-50">🚀</div>
                <h3 className="text-2xl font-extrabold tracking-tight mb-2">Trở thành đối tác</h3>
                <p className="text-slate-400 text-sm font-medium mb-8">Bạn muốn gia nhập hoặc hợp tác cùng hệ sinh thái Vinh Studio?</p>
                <a href="mailto:contact.vinhstudio@gmail.com" className="bg-white text-slate-900 px-6 py-3 rounded-full text-xs font-bold hover:scale-105 transition-transform">
                  Liên hệ ngay
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- BLOG SECTION --- */}
      <section id="blog" className="bg-[#F8FAFC] py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-sm font-extrabold text-blue-600 uppercase tracking-widest mb-2">Knowledge Base</h2>
              <p className="text-4xl font-extrabold tracking-tight text-slate-900">Nhật ký lập trình</p>
            </div>
            <div className="hidden md:block h-px flex-1 bg-slate-200 mx-10 mb-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col bg-white p-6 rounded-[2rem] border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all hover:-translate-y-1">
                <div className="mb-6 overflow-hidden rounded-xl aspect-video bg-slate-100 border border-slate-50 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:scale-110 transition-transform duration-700 flex items-center justify-center">
                     <span className="text-slate-300 font-extrabold tracking-tighter text-2xl">VINH.STUDIO</span>
                  </div>
                </div>
                <div className="text-blue-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
                  {new Date(post.created_at).toLocaleDateString('vi-VN')}
                </div>
                <h3 className="text-xl font-extrabold tracking-tight mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug text-slate-900">
                  {post.title}
                </h3>
                <div className="text-slate-500 font-bold text-[11px] flex items-center gap-2 uppercase tracking-wider mt-auto">
                  Đọc tiếp <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER TỐI GIẢN --- */}
      <footer className="bg-white py-12 px-6 border-t border-slate-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-900 font-extrabold text-xl tracking-tight">VINH.STUDIO</div>
          <div className="flex gap-6 text-sm font-bold text-slate-500">
            <Link href="mailto:contact.vinhstudio@gmail.com" className="hover:text-blue-600 transition-colors">Liên hệ</Link>
            <Link href="/admin/privacy" className="hover:text-blue-600 transition-colors">Bảo mật</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}