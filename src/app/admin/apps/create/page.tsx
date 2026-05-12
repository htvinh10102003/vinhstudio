'use client';

import { useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Import icon cho đẹp
import { ArrowLeft, Save, LayoutGrid, Link as LinkIcon, Image as ImageIcon, FileText } from 'lucide-react';

export default function CreateApp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Khởi tạo state cho TẤT CẢ các trường
  const [formData, setFormData] = useState({
    name: '',
    project_type: 'Android App',
    version: '1.0.0',
    testing_status: 'testing',
    short_description: '',
    full_description: '',
    icon_url: '',
    video_url: '',
    screenshots: '', // Sẽ xử lý chuỗi này thành mảng (Array) sau
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
    setLoading(true);

    // Chuyển đổi text nhiều dòng của screenshots thành Mảng các link ảnh
    const screenshotsArray = formData.screenshots
      .split('\n')
      .map(url => url.trim())
      .filter(url => url !== '');

    const { error } = await supabase.from('apps').insert([{
      name: formData.name,
      project_type: formData.project_type,
      version: formData.version,
      testing_status: formData.testing_status,
      short_description: formData.short_description,
      full_description: formData.full_description,
      icon_url: formData.icon_url,
      video_url: formData.video_url,
      screenshots: screenshotsArray, // Truyền mảng vào DB
      play_store_url: formData.play_store_url,
      app_store_url: formData.app_store_url,
      website_url: formData.website_url,
      apk_download_url: formData.apk_download_url,
      repository_url: formData.repository_url,
      is_active: true,
    }]);

    if (error) {
      alert('Lỗi: ' + error.message);
      setLoading(false);
    } else {
      router.push('/admin/apps');
      router.refresh();
    }
  };

  return (
    <div className="p-8 md:p-12 max-w-5xl mx-auto font-sans">
      <div className="flex items-center justify-between mb-10">
        <div>
          <Link href="/admin/apps" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-4">
            <ArrowLeft size={16} /> Quay lại danh sách
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Thêm dự án mới</h1>
          <p className="text-slate-500 font-medium mt-1">Đưa sản phẩm mới của ông vào hệ sinh thái Vinh Studio.</p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-extrabold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:bg-slate-300"
        >
          <Save size={18} /> {loading ? 'Đang lưu...' : 'Lưu dự án'}
        </button>
      </div>

      <form className="space-y-8">
        {/* --- KHỐI 1: THÔNG TIN CƠ BẢN --- */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h2 className="text-lg font-extrabold flex items-center gap-2 text-slate-900 mb-6 border-b border-slate-100 pb-4">
            <LayoutGrid size={20} className="text-blue-500" /> Thông tin cơ bản
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Tên dự án *</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full border-2 border-slate-100 bg-slate-50 p-4 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-900" placeholder="Vstu Keyboard..." />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Loại dự án</label>
              <select name="project_type" value={formData.project_type} onChange={handleChange} className="w-full border-2 border-slate-100 bg-slate-50 p-4 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-900 appearance-none">
                <option value="Android App">Android App</option>
                <option value="iOS App">iOS App</option>
                <option value="Game">Game (Trò chơi)</option>
                <option value="Web Service">Web Service</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Phiên bản (Version)</label>
              <input name="version" value={formData.version} onChange={handleChange} className="w-full border-2 border-slate-100 bg-slate-50 p-4 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-bold text-slate-900" placeholder="1.0.0" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Tình trạng</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border-2 border-slate-100 px-5 py-3 rounded-2xl font-bold hover:bg-slate-100">
                  <input type="radio" name="testing_status" value="testing" checked={formData.testing_status === 'testing'} onChange={handleChange} className="w-4 h-4 text-blue-600" /> Bản thử nghiệm
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-emerald-50 border-2 border-emerald-100 px-5 py-3 rounded-2xl font-bold hover:bg-emerald-100 text-emerald-800">
                  <input type="radio" name="testing_status" value="production" checked={formData.testing_status === 'production'} onChange={handleChange} className="w-4 h-4 text-emerald-600" /> Đã phát hành (Live)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* --- KHỐI 2: NỘI DUNG & MÔ TẢ --- */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h2 className="text-lg font-extrabold flex items-center gap-2 text-slate-900 mb-6 border-b border-slate-100 pb-4">
            <FileText size={20} className="text-emerald-500" /> Nội dung dự án
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Mô tả ngắn (Hiển thị ở Card)</label>
              <textarea name="short_description" value={formData.short_description} onChange={handleChange} rows={2} className="w-full border-2 border-slate-100 bg-slate-50 p-4 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-900" placeholder="Giới thiệu nhanh gọn về app..." />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Mô tả chi tiết (Hiển thị trong Popup)</label>
              <textarea name="full_description" value={formData.full_description} onChange={handleChange} rows={5} className="w-full border-2 border-slate-100 bg-slate-50 p-4 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-900" placeholder="Viết chi tiết các tính năng, có thể dùng thẻ HTML (<b>, <i>, <br>) để trang trí..." />
            </div>
          </div>
        </div>

        {/* --- KHỐI 3: MEDIA (ẢNH & VIDEO) --- */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h2 className="text-lg font-extrabold flex items-center gap-2 text-slate-900 mb-6 border-b border-slate-100 pb-4">
            <ImageIcon size={20} className="text-purple-500" /> Hình ảnh & Video
          </h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Link Ảnh Icon (App Icon)</label>
                <input name="icon_url" value={formData.icon_url} onChange={handleChange} className="w-full border-2 border-slate-100 bg-slate-50 p-4 rounded-2xl outline-none focus:border-purple-500 focus:bg-white transition-all font-medium" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Link Video (Youtube/MP4)</label>
                <input name="video_url" value={formData.video_url} onChange={handleChange} className="w-full border-2 border-slate-100 bg-slate-50 p-4 rounded-2xl outline-none focus:border-purple-500 focus:bg-white transition-all font-medium" placeholder="https://youtube.com/embed/..." />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Ảnh chụp màn hình (Screenshots)</label>
              <p className="text-xs text-slate-400 mb-3">Copy và Dán các link ảnh vào đây, <strong>mỗi link nằm trên 1 dòng mới</strong> (Enter để xuống dòng).</p>
              <textarea 
                name="screenshots" 
                value={formData.screenshots} 
                onChange={handleChange} 
                rows={4} 
                className="w-full border-2 border-slate-100 bg-slate-50 p-4 rounded-2xl outline-none focus:border-purple-500 focus:bg-white transition-all font-medium whitespace-pre text-sm" 
                placeholder={`https://link-anh-1.jpg\nhttps://link-anh-2.png`} 
              />
            </div>
          </div>
        </div>

        {/* --- KHỐI 4: LIÊN KẾT & TẢI XUỐNG --- */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h2 className="text-lg font-extrabold flex items-center gap-2 text-slate-900 mb-6 border-b border-slate-100 pb-4">
            <LinkIcon size={20} className="text-amber-500" /> Liên kết & Nút Tải
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Google Play URL</label>
              <input name="play_store_url" value={formData.play_store_url} onChange={handleChange} className="w-full border-2 border-slate-100 bg-slate-50 p-4 rounded-2xl outline-none focus:border-amber-500 focus:bg-white transition-all font-medium" placeholder="https://play.google.com/..." />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">App Store URL</label>
              <input name="app_store_url" value={formData.app_store_url} onChange={handleChange} className="w-full border-2 border-slate-100 bg-slate-50 p-4 rounded-2xl outline-none focus:border-amber-500 focus:bg-white transition-all font-medium" placeholder="https://apps.apple.com/..." />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Trang Web (Web Service)</label>
              <input name="website_url" value={formData.website_url} onChange={handleChange} className="w-full border-2 border-slate-100 bg-slate-50 p-4 rounded-2xl outline-none focus:border-amber-500 focus:bg-white transition-all font-medium" placeholder="https://vinhstudio.com" />
            </div>
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">File APK URL</label>
              <input name="apk_download_url" value={formData.apk_download_url} onChange={handleChange} className="w-full border-2 border-slate-100 bg-slate-50 p-4 rounded-2xl outline-none focus:border-amber-500 focus:bg-white transition-all font-medium" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">Source Code (Github/Gitlab)</label>
              <input name="repository_url" value={formData.repository_url} onChange={handleChange} className="w-full border-2 border-slate-100 bg-slate-50 p-4 rounded-2xl outline-none focus:border-amber-500 focus:bg-white transition-all font-medium" placeholder="https://github.com/..." />
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}