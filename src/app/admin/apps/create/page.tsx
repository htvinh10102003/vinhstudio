'use client';

import { useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Sử dụng Lucide icons cho đúng style Vinh Studio
import { ArrowLeft, Save, LayoutGrid, Link as LinkIcon, Image as ImageIcon, FileText, Smartphone, Globe, Code } from 'lucide-react';
const generateSlug = (text: string) => {
  return text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};
export default function CreateApp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 1. Khởi tạo State đầy đủ các trường theo Database mới
  const [formData, setFormData] = useState({
    name: '',
    project_type: 'Android App', // Mặc định
    version: '1.0.0',
    testing_status: 'testing',
    short_description: '',
    full_description: '',
    icon_url: '',
    video_url: '',
    screenshots: '', // Lưu dạng text tạm thời, sẽ split thành mảng sau
    play_store_url: '',
    app_store_url: '',
    website_url: '',
    apk_download_url: '',
    repository_url: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!formData.name) return alert("Ông quên nhập tên dự án kìa!");
  
  setLoading(true);

  // 1. Tạo mảng Screenshots từ text
  const screenshotsArray = formData.screenshots
    .split('\n')
    .map(url => url.trim())
    .filter(url => url !== '');

  // 2. TỰ ĐỘNG TẠO SLUG TỪ TÊN APP
  const slug = generateSlug(formData.name);

  // 3. Đẩy lên Supabase kèm theo SLUG
  const { error } = await supabase.from('apps').insert([{
    name: formData.name,
    slug: slug, // <-- Thêm dòng này để hết lỗi NOT NULL
    project_type: formData.project_type,
    version: formData.version,
    testing_status: formData.testing_status,
    short_description: formData.short_description,
    full_description: formData.full_description,
    icon_url: formData.icon_url,
    video_url: formData.video_url,
    screenshots: screenshotsArray,
    play_store_url: formData.play_store_url,
    app_store_url: formData.app_store_url,
    website_url: formData.website_url,
    apk_download_url: formData.apk_download_url,
    repository_url: formData.repository_url,
    is_active: true,
  }]);

  if (error) {
    alert('Lỗi rồi ông ơi: ' + error.message);
    setLoading(false);
  } else {
    // Nếu ông muốn dùng Popup như bên Privacy thì thêm state popup vào đây
    // Còn không thì chuyển hướng luôn như cũ
    router.push('/admin/apps');
    router.refresh();
  }
};

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto font-sans bg-[#F8FAFC] min-h-screen">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div>
          <Link href="/admin/apps" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-4">
            <ArrowLeft size={16} /> Quay lại danh sách
          </Link>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 italic">VINH<span className="text-blue-600">.CREATE</span></h1>
          <p className="text-slate-500 font-medium mt-1">Thêm một siêu phẩm mới vào hệ sinh thái của ông.</p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full md:w-auto bg-slate-900 text-white px-10 py-4 rounded-2xl font-extrabold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 disabled:bg-slate-300"
        >
          {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Save size={20} />}
          {loading ? 'Đang khởi tạo...' : 'Phát hành dự án'}
        </button>
      </div>

      <form className="space-y-8 pb-20">
        
        {/* --- KHỐI 1: IDENTITY & STATUS --- */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-lg font-extrabold flex items-center gap-2 text-slate-900 mb-6 border-b border-slate-50 pb-4">
            <Smartphone size={20} className="text-blue-500" /> Định danh & Trạng thái
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Tên dự án *</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-900 text-lg" placeholder="VD: Vinh Studio Keyboard..." />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Loại dự án</label>
              <select name="project_type" value={formData.project_type} onChange={handleChange} className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-900 appearance-none">
                <option value="Android App">Android App</option>
                <option value="iOS App">iOS App</option>
                <option value="Game">Game (Trò chơi)</option>
                <option value="Web Service">Web Service</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Phiên bản hiện tại</label>
              <input name="version" value={formData.version} onChange={handleChange} className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-900" placeholder="1.0.0" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Giai đoạn dự án</label>
              <div className="flex flex-wrap gap-4">
                <label className={`flex items-center gap-3 cursor-pointer px-6 py-4 rounded-2xl font-bold transition-all border-2 ${formData.testing_status === 'testing' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-50 border-slate-50 text-slate-400'}`}>
                  <input type="radio" name="testing_status" value="testing" checked={formData.testing_status === 'testing'} onChange={handleChange} className="hidden" />
                  <div className={`w-4 h-4 rounded-full border-2 ${formData.testing_status === 'testing' ? 'border-amber-500 bg-amber-500' : 'border-slate-300'}`}></div>
                  Bản thử nghiệm (Testing)
                </label>
                <label className={`flex items-center gap-3 cursor-pointer px-6 py-4 rounded-2xl font-bold transition-all border-2 ${formData.testing_status === 'production' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-50 text-slate-400'}`}>
                  <input type="radio" name="testing_status" value="production" checked={formData.testing_status === 'production'} onChange={handleChange} className="hidden" />
                  <div className={`w-4 h-4 rounded-full border-2 ${formData.testing_status === 'production' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'}`}></div>
                  Phát hành chính thức (Live)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* --- KHỐI 2: CONTENT & DESCRIPTION --- */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-lg font-extrabold flex items-center gap-2 text-slate-900 mb-6 border-b border-slate-50 pb-4">
            <FileText size={20} className="text-emerald-500" /> Nội dung & Mô tả
          </h2>
          <div className="space-y-8">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Mô tả ngắn (Card View)</label>
              <textarea name="short_description" value={formData.short_description} onChange={handleChange} rows={2} className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-900" placeholder="Câu giới thiệu thu hút người xem trong 1-2 dòng..." />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Mô tả chi tiết (Popup View)</label>
              <textarea name="full_description" value={formData.full_description} onChange={handleChange} rows={6} className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-700 leading-relaxed" placeholder="Kể chi tiết về các tính năng, công nghệ sử dụng, giải pháp ông mang lại... (Hỗ trợ HTML cơ bản)" />
            </div>
          </div>
        </div>

        {/* --- KHỐI 3: VISUAL MEDIA --- */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-lg font-extrabold flex items-center gap-2 text-slate-900 mb-6 border-b border-slate-50 pb-4">
            <ImageIcon size={20} className="text-purple-500" /> Hình ảnh & Media
          </h2>
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Link Icon dự án (1:1)</label>
                <input name="icon_url" value={formData.icon_url} onChange={handleChange} className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl outline-none focus:border-purple-500 transition-all font-medium" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Link Video demo (Youtube Embed)</label>
                <input name="video_url" value={formData.video_url} onChange={handleChange} className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl outline-none focus:border-purple-500 transition-all font-medium" placeholder="https://www.youtube.com/embed/..." />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 text-purple-600">Screenshots (Nhiều ảnh)</label>
              <p className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-tighter italic">Copy-paste các link ảnh, mỗi link nằm trên 1 dòng. Tụi tui sẽ tự động gom chúng lại thành Slider cho ông.</p>
              <textarea 
                name="screenshots" 
                value={formData.screenshots} 
                onChange={handleChange} 
                rows={4} 
                className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl outline-none focus:border-purple-500 focus:bg-white transition-all font-mono text-sm text-slate-600" 
                placeholder={`https://image1.png\nhttps://image2.jpg\nhttps://image3.webp`} 
              />
            </div>
          </div>
        </div>

        {/* --- KHỐI 4: LINKS & DISTRIBUTION --- */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-lg font-extrabold flex items-center gap-2 text-slate-900 mb-6 border-b border-slate-50 pb-4">
            <LinkIcon size={20} className="text-amber-500" /> Phân phối & Liên kết
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative group">
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Google Play URL</label>
              <input name="play_store_url" value={formData.play_store_url} onChange={handleChange} className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-medium pl-12" placeholder="https://..." />
              <div className="absolute left-4 top-10 text-slate-300 group-focus-within:text-amber-500"><Globe size={18} /></div>
            </div>
            <div className="relative group">
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">App Store URL</label>
              <input name="app_store_url" value={formData.app_store_url} onChange={handleChange} className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-medium pl-12" placeholder="https://..." />
              <div className="absolute left-4 top-10 text-slate-300 group-focus-within:text-amber-500"><Smartphone size={18} /></div>
            </div>
            <div className="relative group">
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Website / Landing Page</label>
              <input name="website_url" value={formData.website_url} onChange={handleChange} className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-medium pl-12" placeholder="https://..." />
              <div className="absolute left-4 top-10 text-slate-300 group-focus-within:text-amber-500"><Globe size={18} /></div>
            </div>
            <div className="relative group">
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Direct APK Download</label>
              <input name="apk_download_url" value={formData.apk_download_url} onChange={handleChange} className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl outline-none focus:border-amber-500 transition-all font-medium pl-12" placeholder="https://..." />
              <div className="absolute left-4 top-10 text-slate-300 group-focus-within:text-amber-500"><Save size={18} /></div>
            </div>
            <div className="md:col-span-2 relative group border-t border-slate-50 pt-6">
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Source Code Repository</label>
              <input name="repository_url" value={formData.repository_url} onChange={handleChange} className="w-full border-2 border-slate-50 bg-slate-50 p-4 rounded-2xl outline-none focus:border-slate-900 transition-all font-medium pl-12" placeholder="https://github.com/vinh-studio/..." />
              <div className="absolute left-4 top-16 text-slate-300 group-focus-within:text-slate-900"><Code size={18} /></div>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}