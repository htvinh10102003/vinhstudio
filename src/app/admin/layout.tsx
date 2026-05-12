'use client';

import { supabase } from '@/src/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
// Import bộ Icon xịn xò
import { LayoutDashboard, Smartphone, FileText, ShieldCheck, Home, LogOut, Settings } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'Tổng quan', href: '/admin', icon: LayoutDashboard },
    { name: 'Ứng dụng', href: '/admin/apps', icon: Smartphone },
    { name: 'Bài viết', href: '/admin/posts', icon: FileText },
    { name: 'Chính sách', href: '/admin/privacy', icon: ShieldCheck },
  ];

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      window.location.href = '/login';
    } else {
      alert('Lỗi khi đăng xuất: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-900 selection:bg-blue-200">
      {/* --- SIDEBAR HIỆN ĐẠI --- */}
      <aside className="w-72 bg-white border-r border-slate-200 fixed h-full flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
        <div className="h-20 flex items-center px-8 border-b border-slate-50">
          <Link href="/admin" className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3 group">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-md group-hover:bg-blue-600 transition-colors">
              <Settings size={18} />
            </div>
            VINH<span className="text-blue-600">.ADMIN</span>
          </Link>
        </div>
        
        <div className="px-8 pt-8 pb-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
          Main Menu
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 group ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 shadow-sm shadow-blue-100/50' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon 
                  size={20} 
                  className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600 transition-colors'} 
                  strokeWidth={isActive ? 2.5 : 2} 
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* --- KHU VỰC TÀI KHOẢN --- */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-2">
          <Link 
            href="/" 
            target="_blank"
            className="flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 hover:shadow-sm transition-all group"
          >
            <Home size={18} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
            Xem trang chủ
            <span className="ml-auto text-slate-300">↗</span>
          </Link>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content (Chừa lề cho Sidebar 72 = 18rem = 288px) */}
      <main className="flex-1 ml-72 min-w-0">
        {children}
      </main>
    </div>
  );
}